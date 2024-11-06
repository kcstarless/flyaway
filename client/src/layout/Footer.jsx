import { useState } from "react";

const Footer = () => {
    return (
        <footer className="footer-main">
            <div className="footer-sitemap">
                <div className="footer-c1">
                    <a href="#">Help</a>
                    <a href="#">Privacy Settings</a>
                </div>
                <div className="footer-c2">
                    <a href="#">Terms of Service</a>
                    <a href="#">Privacy Policy</a>
                    <a href="#">Cookie Policy</a>
                    <a href="#">Comopany Details</a>
                </div>
            </div>
            <div className="footer-register">
                <div>Go now! Fly now!</div>
                <div>© 2024 Flynow</div>
            </div>
        </footer>
    );
}

export default Footer;