import React, { useState, useEffect } from "react";
import { ResizableBox } from "react-resizable";
import { Link } from "react-router-dom";
import "./styles/Navbar.css";

const Navbar = () => {
    const [width, setWidth] = useState(250);

    return (
        <ResizableBox
        className="sidebar"
        width={width}
        height={Infinity}
        axis="x"
        minConstraints={[100, Infinity]} // Minimum width
        maxConstraints={[500, Infinity]} // Maximum width
        onResizeStop={(e, data) => setWidth(data.size.width)}
      >
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
        </ResizableBox>

    );
};

export default Navbar;
