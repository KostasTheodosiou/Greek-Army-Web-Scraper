import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./styles/NewsFeed.css";
import EntryForm from "./EntryForm";
import ArticleCard from "./articleCard";

async function fetchArticles(url) {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("Error fetching articles:", error);
        return [{ title: "", link: "" }];
    }
}

function NewsFeed() {
    const [entries, setEntries] = useState([]);
    const intervalRef = useRef(null);

    const fetchNewArticles = async () => {
        const data = await fetchArticles("/api/newArticles");
        setEntries(data.reverse());
    };

    useEffect(() => {
        fetchNewArticles();
        intervalRef.current = setInterval(fetchNewArticles, 1000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    return (
        <div className="Feed">
            <div className="Feed-entry-list">
                {entries.map((article) => (
                    <div key={article.id} className="feed-article-card">
                        <ArticleCard
                            key={article.id}
                            article={article}
                            articleTags={article.tags}
                        />
                    </div>
                ))}
            </div>{" "}
            <EntryForm />
        </div>
    );
}

export default NewsFeed;
