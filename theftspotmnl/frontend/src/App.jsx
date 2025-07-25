import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Main from './jsx/MainPage';
import Home from './jsx/HomePage';
import Dashboard from './jsx/DashboardPage';
import Nav from './jsx/Nav';
import About from './jsx/AboutPage';
import Contact from './jsx/ContactPage';
import Footer from './jsx/Footer';

function Layout() {
  const location = useLocation();
  const hideNavOn = ['/'];
  const hideFooter = location.pathname === "/";

  return (
    <>
      {!hideNavOn.includes(location.pathname) && <Nav />}
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      {!hideFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;