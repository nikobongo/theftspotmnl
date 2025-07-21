from flask import Flask, render_template, request, send_file
import pandas as pd
import joblib
import os
import re
import tempfile
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
import nltk
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright
import random
from flask import Flask, render_template, request, jsonify, send_file
from flask_cors import CORS

nltk.download('punkt')
nltk.download('stopwords')

app = Flask(__name__, template_folder="html")
CORS(app)

model = joblib.load("model/svm_modelv3.pkl")
vectorizer = joblib.load("model/vectorizer1.pkl")

# === Text Preprocessing === #
def preprocess(text):
    text = str(text).lower()
    text = re.sub(r"[^a-zA-Z\s]", "", text)
    tokens = word_tokenize(text)
    filipino_stopwords = set([
        "ang", "ng", "sa", "na", "ay", "at", "ito", "ni", "si", "ko", "mo", "kanila", "namin",
        "amin", "kayo", "tayo", "sila", "kami", "ikaw", "kaniya", "lahat", "dapat", "hindi",
        "wala", "may", "mga"
    ])
    stop_words = set(stopwords.words("english")) | filipino_stopwords
    tokens = [word for word in tokens if word not in stop_words and len(word) > 2]
    return " ".join(tokens)

# === Web Scraper for a Single Article with Headful Mode, Mobile UA, Proxy Rotation, Error Handling === #
def scrape_article(url):
    mobile_user_agent = "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15A372 Safari/604.1"
    proxies = [
        None,
        # Example: {"server": "http://proxy1.com:8000"},
        # Example: {"server": "http://proxy2.com:8000"},
    ]
    proxy = random.choice(proxies)

    domain_selectors = {
        "abs-cbn.com": [
            {"name": "div", "attrs": {"class": "article__content"}},
            {"name": "div", "attrs": {"class": "article-content"}},
            {"name": "div", "attrs": {"id": "bodyTopPart"}},
            {"name": "div", "attrs": {"class": "text-justify"}},
        ],
    }

    fallback_selectors = [
        {"name": "div", "attrs": {"id": "bodyTopPart"}},
        {"name": "div", "attrs": {"class": "article-content"}},
        {"name": "article"},
        {"name": "div", "attrs": {"class": "article-body"}},
        {"name": "div", "attrs": {"class": "article__body"}},
        {"name": "div", "attrs": {"class": "article-full-body"}},
        {"name": "div", "attrs": {"class": "article__writeup"}},
    ]

    def find_best_article_container(soup):
        candidates = soup.find_all(["div", "article"])
        best_candidate = None
        max_p_count = 0
        for tag in candidates:
            p_count = len(tag.find_all("p"))
            if p_count > max_p_count and p_count >= 3:
                best_candidate = tag
                max_p_count = p_count
        return best_candidate

    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=False)  # headful mode
            context_args = {
                "user_agent": mobile_user_agent,
                "viewport": {"width": 390, "height": 844},
                "extra_http_headers": {
                    "Accept-Language": "en-US,en;q=0.9",
                    "Referer": "https://www.google.com/",
                }
            }
            if proxy:
                context_args["proxy"] = proxy

            context = browser.new_context(**context_args)
            page = context.new_page()

            page.goto(url, timeout=90000)
            page.wait_for_selector("p", timeout=10000)
            html = page.content()
            page.close()
            browser.close()

        soup = BeautifulSoup(html, "html.parser")
        domain = next((d for d in domain_selectors if d in url), None)
        selectors = domain_selectors.get(domain, fallback_selectors)

        article = None
        for selector in selectors:
            article = soup.find(**selector)
            if article:
                break

        if not article:
            article = find_best_article_container(soup)

        if article:
            paragraphs = [p.get_text(strip=True) for p in article.find_all("p") if "ADVERTISEMENT" not in p.text.upper()]
            content = "\n".join(paragraphs)
            return content if content.strip() else None
        else:
            return None

    except Exception as e:
        print(f"[Scrape Error] {e}")
        return None

# === Routes === #
@app.route("/dashboard", methods=["POST"])
def dashboard_predict():
    data = request.get_json()
    url = data.get("article_url")
    if not url:
        return jsonify({"error": "Missing URL"}), 400

    try:
        # Scrape content and HTML
        mobile_user_agent = "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15A372 Safari/604.1"
        proxies = [None]
        proxy = random.choice(proxies)

        with sync_playwright() as p:
            browser = p.chromium.launch(headless=False)
            context_args = {
                "user_agent": mobile_user_agent,
                "viewport": {"width": 390, "height": 844},
                "extra_http_headers": {
                    "Accept-Language": "en-US,en;q=0.9",
                    "Referer": "https://www.google.com/",
                }
            }
            if proxy:
                context_args["proxy"] = proxy

            context = browser.new_context(**context_args)
            page = context.new_page()
            page.goto(url, timeout=90000)
            page.wait_for_selector("p", timeout=10000)
            html = page.content()
            page.close()
            browser.close()

        soup = BeautifulSoup(html, "html.parser")

        # Extract article title
        article_title = soup.title.string.strip() if soup.title and soup.title.string else "No title found"

        # Reuse same soup for article scraping
        domain_selectors = {
            "abs-cbn.com": [
                {"name": "div", "attrs": {"class": "article__content"}},
                {"name": "div", "attrs": {"class": "article-content"}},
                {"name": "div", "attrs": {"id": "bodyTopPart"}},
                {"name": "div", "attrs": {"class": "text-justify"}},
            ],
        }

        fallback_selectors = [
            {"name": "div", "attrs": {"id": "bodyTopPart"}},
            {"name": "div", "attrs": {"class": "article-content"}},
            {"name": "article"},
            {"name": "div", "attrs": {"class": "article-body"}},
            {"name": "div", "attrs": {"class": "article__body"}},
            {"name": "div", "attrs": {"class": "article-full-body"}},
            {"name": "div", "attrs": {"class": "article__writeup"}},
        ]

        def find_best_article_container(soup):
            candidates = soup.find_all(["div", "article"])
            best_candidate = None
            max_p_count = 0
            for tag in candidates:
                p_count = len(tag.find_all("p"))
                if p_count > max_p_count and p_count >= 3:
                    best_candidate = tag
                    max_p_count = p_count
            return best_candidate

        domain = next((d for d in domain_selectors if d in url), None)
        selectors = domain_selectors.get(domain, fallback_selectors)

        article = None
        for selector in selectors:
            article = soup.find(**selector)
            if article:
                break

        if not article:
            article = find_best_article_container(soup)

        if article:
            paragraphs = [p.get_text(strip=True) for p in article.find_all("p") if "ADVERTISEMENT" not in p.text.upper()]
            raw = "\n".join(paragraphs)
        else:
            raw = None

    except Exception as e:
        print(f"[Dashboard Error] {e}")
        return jsonify({"error": "Failed to fetch or parse article."}), 500

    if not raw:
        return jsonify({"error": "Could not extract article content."}), 400

    cleaned = preprocess(raw)
    X = vectorizer.transform([cleaned]).toarray()
    prediction = model.predict(X)[0]
    label = "Theft" if prediction == 1 else "Non-Theft"

    confidence = None
    if hasattr(model, "predict_proba"):
        prob = model.predict_proba(X)[0]
        confidence = round(max(prob) * 100, 2)

    return jsonify({
        "url_result": label,
        "article_title": article_title,
        "article": raw,
        "confidence": f"{confidence}%" if confidence else "N/A"
    })

    
if __name__ == "__main__":
    app.run(debug=True)