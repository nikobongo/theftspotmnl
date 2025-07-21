import { useNavigate } from 'react-router-dom';
import '../css/HomePage.css';

function Home() {
    const navigate = useNavigate();

    return (
        <>
            <div className="home">
                <div className="top-content">
                    <h1>Theft News Classifier</h1>
                    <p>Spot Theft News in Seconds</p>
                    <h2>Upload news articles in seconds. Instantly find out if they're theft-related or not. Helping communities stay informed and aware.</h2>
                    <button onClick={() => navigate('/dashboard')}>Upload Now</button>
                </div>
            </div>
            <div className="bottom-content">
                <div className="home-wrapper">
                    <div className="left-content">
                        <h1>How It Works</h1>
                        <div className="process-definition">
                            <div className="step">
                                <img src="/img/upload-icon.png" alt="Upload" />
                                <p className="process">1. Upload</p>
                                <p className="definition">Provide the direct URL of the news article.</p>
                            </div>
                            <div className="step">
                                <img src="/img/analyze-icon.png" alt="Analyze" />
                                <p className="process">2. Analyze</p>
                                <p className="definition">Our tool reads each article and spots which ones talk about theft.</p>
                            </div>
                            <div className="step">
                                <img src="/img/results-icon.png" alt="Results" />
                                <p className="process">3. View Results</p>
                                <p className="definition">Clear results with confidence levels.</p>
                            </div>
                        </div>
                    </div>
                    <div className="home-divider" />
                    <div className="right-content">
                            <h3>Recommended News Sources</h3>
                            <p>For best results, please use news article links from these trusted publishers:</p>
                            <ul>
                                <li><a href="https://www.philstar.com" target="_blank" rel="noopener noreferrer">Philstar</a></li>
                                <li><a href="https://www.pna.gov.ph" target="_blank" rel="noopener noreferrer">Philippine News Agency</a></li>
                                <li><a href="https://www.gmanetwork.com" target="_blank" rel="noopener noreferrer">GMA Network</a></li>
                                <li><a href="https://www.topgear.com.ph" target="_blank" rel="noopener noreferrer">TopGear PH</a></li>
                                <li><a href="https://www.manilatimes.net" target="_blank" rel="noopener noreferrer">Manila Times</a></li>
                                <li><a href="https://themanilajournal.com" target="_blank" rel="noopener noreferrer">The Manila Journal</a></li>
                            </ul>
                            <p>Links from other sites may not be supported yet.</p>
                        </div>
                </div>
            </div>
        </>
    )
}

export default Home;