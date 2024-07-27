// src/App.js
import React from "react";
import Articles from "./Articles";
import "./styles/MainApp.css";

function MainApp() {
    return (
        <div className="MainApp">
            <header className="MainAppHeader">
                <h1>Άρθα ιστοσελίδων με Στρατιωτικό περιεχόμενο</h1>
            </header>
            <Articles />
        </div>
    );
}

export default MainApp;
