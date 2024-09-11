// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import MainApp from "./components/MainApp";
import BotConfigurator from "./components/BotConfigurator";
import ArticleCategoriser from "./components/ArticleCategoriser";
import NewspaperGrid from "./components/NewspaperGrid";
import "./App.css";
import NewsFeed from "./components/NewsFeed";

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<NewsFeed />} />
                <Route path="/BotConfigurator" element={<BotConfigurator />} />
                <Route path="/MainApp" element={<MainApp />} />
                <Route
                    path="/ArticleCategoriser"
                    element={<ArticleCategoriser />}
                />
                <Route path="/NewsFronts" element={<NewspaperGrid />} />

            </Routes>
        </Router>
    );
}

export default App;