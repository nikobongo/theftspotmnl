
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

nltk.download('punkt')
nltk.download('stopwords')

app = Flask(__name__, template_folder="html")
model = joblib.load("model/svm_model.pkl")
vectorizer = joblib.load("model/vectorizer.pkl")

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
@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        if request.form.get("action") == "predict_url":
            url = request.form.get("article_url")
            raw = scrape_article(url)
            if not raw:
                return render_template("dashboard.html", error="Could not extract content from that URL.")
            cleaned = preprocess(raw)
            X = vectorizer.transform([cleaned])
            prediction = model.predict(X)[0]
            label = "Theft" if prediction == 1 else "Non-Theft"
            confidence = (
                round(max(model.predict_proba(X)[0]) * 100, 2)
                if hasattr(model, "predict_proba") else "N/A"
            )
            # Extract a simple title from the URL
            article_title = url.split("/")[-1].replace("-", " ").title()
            return render_template(
                "dashboard.html",
                url_result=label,
                article=raw,
                confidence=f"{confidence}%",
                article_title=article_title
            )

    return render_template("dashboard.html")

if __name__ == "__main__":
    app.run(debug=True)