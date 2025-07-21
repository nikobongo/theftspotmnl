import { useNavigate } from 'react-router-dom';
import '../css/MainPage.css';

function Main() {
  const navigate = useNavigate();

  return (
    <div className="main">
      <img src="/img/theftspotmnl-icon.png" alt="TheftSpotMNL" />
      <button onClick={() => navigate('/home')}>Try it now!</button>
    </div>
  );
}

export default Main;