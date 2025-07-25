import { useState } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend
} from 'recharts';
import { useEffect } from 'react';
import '../css/DashboardPage.css';

function TruncatableContent({ text }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`animated-content ${expanded ? 'expanded' : ''}`}
      onClick={() => setExpanded(!expanded)}
      title="Click to expand/collapse"
    >
      {text}
    </div>
  );
}

function Dashboard() {
  const [articleUrl, setArticleUrl] = useState('');
  const [error, setError] = useState('');
  const [results, setResults] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [submittedUrls, setSubmittedUrls] = useState([]);
  useEffect(() => {
  const savedResults = JSON.parse(localStorage.getItem('results')) || [];
  const savedPredictions = JSON.parse(localStorage.getItem('predictions')) || [];

  setResults(savedResults);
  setPredictions(savedPredictions);
}, []);

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await fetch('http://127.0.0.1:5000/dashboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ article_url: articleUrl }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Something went wrong');
      return;
    }

    const newResult = {
      title: data.article_title || 'No title found',
      content: data.article || 'No content',
      label: data.url_result,
      confidence: data.confidence || 'N/A',
    };

    // Update state
    setResults((prev) => {
      const updated = [newResult, ...prev];
      localStorage.setItem('results', JSON.stringify(updated));
      return updated;
    });

    setPredictions((prev) => {
      const updated = [
        ...prev,
        {
          label: newResult.label,
          confidence: parseFloat(newResult.confidence.replace('%', '')) || 0,
        },
      ];
      localStorage.setItem('predictions', JSON.stringify(updated));
      return updated;
    });

    setSubmittedUrls((prev) => [articleUrl, ...prev]);
    setArticleUrl('');
  } catch (err) {
    setError('Submission failed');
  }
};

    const handleClearHistory = () => {
    setResults([]);
    setPredictions([]);
    setSubmittedUrls([]);
    localStorage.removeItem('results');
    localStorage.removeItem('predictions');
    localStorage.removeItem('submittedUrls');
  };


  const getStats = () => {
    const theftPreds = predictions.filter(p => p.label === 'Theft');
    const nonTheftPreds = predictions.filter(p => p.label === 'Non-Theft');

    const avg = (arr) =>
      arr.length === 0
        ? 0
        : Math.round(arr.reduce((sum, p) => sum + p.confidence, 0) / arr.length);

    return {
      total: predictions.length,
      theft: theftPreds.length,
      nonTheft: nonTheftPreds.length,
      avgTheftConfidence: avg(theftPreds),
      avgNonTheftConfidence: avg(nonTheftPreds),
    };
  };

  const getPieChartData = () => {
    const { theft, nonTheft } = getStats();
    return [
      { name: 'Theft', value: theft },
      { name: 'Non-Theft', value: nonTheft },
    ];
  };

  const {
  total,
  theft,
  nonTheft,
  avgTheftConfidence,
  avgNonTheftConfidence
} = getStats();

  return (
    <div className="content">
      <div className="result-section">
        <h2 className="section-title">Results</h2>
          <div className="dashboard-container">
            <div className="dashboard-box">
              <h3>Dashboard</h3>
              <div className="metrics-row">
                <div className="metric">
                  <div className="metric-number total">{total}</div>
                  <p>Total Articles</p>
                </div>
                <div className="metric">
                  <div className="metric-number theft">{theft}</div>
                  <p>Theft-Related</p>
                </div>
                <div className="metric">
                  <div className="metric-number non-theft">{nonTheft}</div>
                  <p>Non Theft-Related</p>
                </div>
                <div className="metric">
                  <div className="metric-number confidence1">{avgTheftConfidence}%</div>
                  <p>Avg Theft Confidence</p>
                </div>
                <div className="metric">
                  <div className="metric-number confidence2">{avgNonTheftConfidence}%</div>
                  <p>Avg Non-Theft Confidence</p>
                </div>
              </div>
            </div>

            <div className="piechart-box">
              <h3>Incident Distribution</h3>
              <div className="piechart-content">
                <PieChart width={500} height={120}>
                  <Pie
                    data={getPieChartData()}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={55}
                    labelLine={false}  
                    label
                    fontFamily="Poppins" fontWeight={800}
                  >
                    <Cell key="theft" fill="#F52E2E" />
                    <Cell key="non-theft" fill="#12a430ff" />
                  </Pie>
                  <Tooltip />
                  <Legend 
                      layout="vertical"
                      verticalAlign="middle"
                      align="right"
                    wrapperStyle={{ fontFamily: 'Poppins', fontSize: 25 }}
                  />
                </PieChart>
              </div>
            </div>
          </div>
          <div className="upload-url">
        <h3>Upload URL</h3>
        <p>Provide article URLs for analysis</p>
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
          <button type="button" onClick={handleClearHistory}>
            Clear History
          </button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
          </div>
          <div className="result-header">
          <div>Title</div>
          <div>Content</div>
          <div>Classification</div>
          <div>Confidence</div>
          </div>
          <div className="results-scrollbox">
                {results.map((result, index) => (
          <div className="result-row" key={index}>
            <div><strong>{result.title}</strong></div>
                <TruncatableContent text={result.content} />
            <div className={result.label === 'Theft' ? 'theft-tag' : 'non-theft-tag'}>
              {result.label}
            </div>
            <div>{result.confidence}</div>
          </div>
        ))}
          </div>
        </div>
    </div>
  );
}

export default Dashboard;
