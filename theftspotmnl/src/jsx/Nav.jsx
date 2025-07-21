import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../css/Nav.css';

function Nav() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleNavClick = (path) => {
        navigate(path);
        setIsOpen(false);
    };

    return (
        <div className="header">
            <img src="/img/theftspotmnl-icon.png" alt="TheftSpotMNL" />

            <div className="hamburger" onClick={toggleMenu}>
                ☰
            </div>

            <nav className={`nav ${isOpen ? 'open' : ''}`}>
                <ul>
                    <li className={location.pathname === '/home' ? 'active' : ''} onClick={() => handleNavClick('/home')}>Home</li>
                    <li className={location.pathname === '/dashboard' ? 'active' : ''} onClick={() => handleNavClick('/dashboard')}>Dashboard</li>
                    <li className={location.pathname === '/about' ? 'active' : ''} onClick={() => handleNavClick('/about')}>About</li>
                    <li className={location.pathname === '/contact' ? 'active' : ''} onClick={() => handleNavClick('/contact')}>Contact</li>
                </ul>
            </nav>
        </div>
    );
}

export default Nav;