import '../css/HomePage.css';

function Home() {
                return (
                    <>
                        <div class="home">
                            <div class="top-content">
                                <h1>Theft News Classifier</h1>
                                <p>Spot Theft News in Seconds</p>
                                <h2>Upload news articles in seconds. Instantly find out if they're theft-related or not. Helping communities stay informed and aware.</h2>
                                <button>Upload Now</button>
                            </div>
                        </div>
                        <div class="bottom-content">
                            <div class="content-wrapper">
                                <div class="main-left">
                                    <h1>How It Works</h1>
                                    <div class="process-definition">
                                        <div class="step">
                                            <img src="/img/upload-icon.png" alt="Upload" />
                                            <p class="process">1. Upload</p>
                                            <p class="definition">Upload your csv file of news articles.</p>
                                        </div>
                                        <div class="step">
                                            <img src="/img/analyze-icon.png" alt="Analyze" />
                                            <p class="process">2. Analyze</p>
                                            <p class="definition">Our tool reads each article and spots which ones talk about theft.</p>
                                        </div>
                                        <div class="step">
                                            <img src="/img/results-icon.png" alt="Results" />
                                            <p class="process">3. View Results</p>
                                            <p class="definition">Clear results with confidence levels.</p>
                                        </div>
                                    </div>
                                </div>
                                    <div class="divider"></div>
                                    <div class="reco">
                                        <h3>Recommended News Sources</h3>
                                        <p>For best results, please use news article links from these trusted publishers:</p>
                                        <li>Philstar</li>
                                        <li>Philippine News Agency</li>
                                        <li>GMA Network</li>
                                        <li>TopGear PH</li>
                                        <li>Manila Times</li>
                                        <li>The Manila Journal</li>
                                        <p>Links from other sites may not be supported yet.</p>
                                    </div>
                            </div>
                        </div>
                    </>
                )
}

export default Home;