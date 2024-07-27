import React from "react";
import { Link } from "react-router-dom";
import "./styles/Navbar.css";

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <ul className="navbar-menu">
                    <li className="navbar-item">
                        <Link to="/" className="navbar-link">
                            Ρυθμίσεις Signal
                        </Link>
                    </li>
                    <li className="navbar-item">
                        <Link to="/MainApp" className="navbar-link">
                            Βασικές Σελίδες
                        </Link>
                    </li>
                    <li className="navbar-item">
                        <Link to="/NewsFeed" className="navbar-link">
                            Ροή Αρθρων
                        </Link>
                    </li>
                    {/* <li className="navbar-item">
                        <Link to="/ArticleCategoriser" className="navbar-link">
                            Κατηγοριοποίηση Άρθρων
                        </Link>
                    </li> */}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
