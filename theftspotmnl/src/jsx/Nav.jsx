import { useNavigate } from 'react-router-dom';
import '../css/Nav.css';

function Nav() {
    const navigate = useNavigate();
  
    return (
        <div className="header">
            <img src="/img/theftspotmnl-icon.png" alt="TheftSpotMNL" />
            <nav className="nav">
                <ul>
                    <li className={location.pathname === '/home' ? 'active' : ''} onClick={() => navigate('/home')}>Home</li>
                    <li className={location.pathname === '/dashboard' ? 'active' : ''} onClick={() => navigate('/dashboard')}>Dashboard</li>
                    <li className={location.pathname === '/about' ? 'active' : ''} onClick={() => navigate('/about')}>About</li>
                    <li className={location.pathname === '/contact' ? 'active' : ''} onClick={() => navigate('/contact')}>Contact</li>
                </ul>
            </nav>
        </div>
    )
}

export default Nav;