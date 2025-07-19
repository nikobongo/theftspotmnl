import { useNavigate } from 'react-router-dom';
import '../css/Nav.css';

function Nav() {
  const navigate = useNavigate();
  
                return (
                    <div class="header">
                        <div class="logos">
                            <img src="../img/theftspotmnl-icon.png" alt="TheftSpotMNL" />
                        </div>
                        <div class="nav">
                            <button onClick={() => navigate('/home')}>Home</button>
                            <button onClick={() => navigate('/dashboard')}>Dashboard</button>
                            <button>About</button>
                            <button>Contact</button>
                        </div>
                    </div>
                )
            }

            export default Nav;