import { useNavigate } from 'react-router-dom';
import '../css/AboutPage.css';

function About() {
  const navigate = useNavigate();

  return (
    <div className="about">
      <div className="section">
        <h3>What is it?</h3>
        <p className="about-content red">TheftSpotMNL is a simple web-based app that helps people quickly find out if news articles are about theft incidents in Manila.</p>
      </div>
      <div className="section">
        <h3>Why did we build it?</h3>
        <p className="about-content">We noticed that theft news is scattered across many websites. By using our tool, researchers, analysts, and citizens can easily check news articles and stay aware of theft-related events without reading each story one by one.</p>
      </div>
      <div className="section">
        <h3>How does it work?</h3>
        <p className="about-content red">Users upload a file of news articles. The system automatically reads each article and checks if it talks about theft, showing clear results with confidence scores and easy-to-read charts.</p>
      </div>
    </div>
  )
}

export default About;