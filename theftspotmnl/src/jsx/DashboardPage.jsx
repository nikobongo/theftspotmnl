import { useState } from 'react';
import '../css/DashboardPage.css';

function Dashboard() {
  const [articleUrl, setArticleUrl] = useState('');
  const [error, setError] = useState('');
  const [urlResult, setUrlResult] = useState('');
  const [articleTitle, setArticleTitle] = useState('');
  const [article, setArticle] = useState('');
  const [confidence, setConfidence] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/dashboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ article_url: articleUrl }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Something went wrong');
        return;
      }
      setError('');
      setUrlResult(data.url_result);
      setArticleTitle(data.article_title);
      setArticle(data.article);
      setConfidence(data.confidence);
    } catch (err) {
      setError('Submission failed');
    }
  };

  return (
    <div className="content">
      <div className="result-section">
        <h2 className="section-title">Results</h2>

        <div className="result-header">
          <div>Title</div>
          <div>Content</div>
          <div>Classification</div>
          <div>Confidence</div>
        </div>

        <div className="result-row">
          <div>Sample Title</div>
          <div>Sample content goes here...</div>
          <div className="theft-tag">Theft</div>
          <div>89%</div>
        </div>
      </div>

      <div className="upload-url">
        <h3>Upload URL</h3>
        <p>Upload the articles of your choice</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="article_url"
            placeholder="Paste article URL here"
            required
            value={articleUrl}
            onChange={(e) => setArticleUrl(e.target.value)}
          />
          <button type="submit" name="action" value="predict_url">
            Classify
          </button>
        </form>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        {urlResult && (
          <div className="result-row">
            <div>{articleTitle || 'Article'}</div>
            <div>{article}</div>
            <div className={urlResult === 'Theft' ? 'theft-tag' : 'non-theft-tag'}>
              {urlResult}
            </div>
            <div>{confidence || 'N/A'}</div>
          </div>
        )}
      </div>

      <div className="dashboard-container">
        <div className="dashboard-box">
          <h3>Dashboard</h3>
          <div className="metrics-row">
            <div className="metric">
              <p>Total Articles</p>
              <div className="metric-number total">20</div>
            </div>
            <div className="metric">
              <p>Theft-Related</p>
              <div className="metric-number theft">12</div>
            </div>
            <div className="metric">
              <p>Non Theft-Related</p>
              <div className="metric-number non-theft">8</div>
            </div>
            <div className="metric">
              <p>Avg Confidence</p>
              <div className="metric-number confidence">89%</div>
            </div>
          </div>
        </div>

        <div className="piechart-box">
          <h3>Theft vs Non Theft</h3>
          <div className="piechart-content">
            <div className="legend">
              <div>
                <span className="color theft"></span> Theft
              </div>
              <div>
                <span className="color non-theft"></span> Non Theft
              </div>
            </div>
            <img
              src="88b10cf2-a7ae-4b9c-8cf9-e0991fe9595a.png"
              alt="Pie Chart"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
