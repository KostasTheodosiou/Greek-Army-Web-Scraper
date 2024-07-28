import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles/articleCategoriser.css";
import EntryForm from "./EntryForm";
import CategoryGrid from "./CategoryGrid";
//import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

async function fetchArticles(url) {
    try {
        const response = await axios.get(url);
        //console.log("GET request running");
        return response.data;
    } catch (error) {
        console.error("Error fetching articles:", error);
        return [{ title: "", link: "" }];
    }
}

function ArticleCategoriser() {
    const [entries, setEntries] = useState([]);

    useEffect(() => {
        const fetchNewArticles = async () => {
            const data = await fetchArticles(
                "/api/newArticles"
            );
            setEntries(data);
        };
        fetchNewArticles();

        const intervalId = setInterval(fetchNewArticles, 5000); // Poll every 5 seconds

        return () => clearInterval(intervalId);
    }, []);

    const [draggedIndex, setDraggedIndex] = useState(null);

    const handleDragStart = (e, index) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e, index) => {
        if (draggedIndex === null) return;

        const updatedItems = [...entries];
        const [movedItem] = updatedItems.splice(draggedIndex, 1);
        updatedItems.splice(index, 0, movedItem);

        setEntries(updatedItems);
        setDraggedIndex(null);
    };

    useEffect(() => {}, []);

    const sendArticle = (article) => {
        console.log(`Sending: ${article.title}`);
        // Add your logic to send the link, e.g., via an API call
    };

    const copyArticle = async (article) => {
        try {
            await navigator.clipboard.writeText(
                article.title + "\n\n" + article.link
            );
            console.log("Text copied to clipboard");
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    };
    return (
        <div className="article-categoriser">
            <div className="entry-list">
                {entries.map((article, index) => (
                    <div
                        key={index}
                        className="article-card to-categorize"
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, index)}
                    >
                        <h3 className="article-title">{article.title}</h3>
                        <a
                            className="article-link"
                            href={article.link}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {article.link}
                        </a>
                        <button
                            className="send-button"
                            onClick={() => sendArticle(article)}
                        >
                            Send
                        </button>
                        <button
                            className="copy-button"
                            onClick={() => copyArticle(article)}
                        >
                            Copy
                        </button>
                    </div>
                ))}
            </div>{" "}
            <EntryForm />
            <CategoryGrid />
        </div>
    );
}

export default ArticleCategoriser;
