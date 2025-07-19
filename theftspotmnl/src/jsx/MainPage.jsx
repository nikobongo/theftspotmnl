import { useNavigate } from 'react-router-dom';
import '../css/MainPage.css';

function Main() {
  const navigate = useNavigate();

  return (
    <div class="main">
      <img src="/img/theftspotmnl-icon.png" alt="TheftSpotMNL" class="logo" />
      <button class="glow" onClick={() => navigate('/Home')}>Try it now!</button>
    </div>
  );
}

export default Main;