import { useNavigate } from 'react-router-dom';
import '../css/ContactPage.css';

function Contact() {
  const navigate = useNavigate();

    return (
    <div class="wrapper">
        <div class="head">
            <h1>Get in touch</h1>
        </div>

        <div class="divider"></div>

        <div class="contacts">
            <h1>Address</h1>
            <p>900 San Marcelino Street, Ermita, Manila, 1000, Philippines.</p>
            <h1>Phone</h1>
            <p>0935464644422323</p>
            <h1>Mail</h1>
            <p>TheBadHabits@gmail.com</p>
        </div>
    </div>
    )
}

export default Contact;