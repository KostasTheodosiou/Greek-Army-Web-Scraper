// src/Articles.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styles/articles.css";
import ArticleItem from "./ArticleItem";

async function fetchArticles(url, names) {
    try {
        const responses = await Promise.all(
            names.map(name => axios.get(url, { params: { names: name } }))
        );
        return responses.map(response => response.data);
    } catch (error) {
        console.error("Error fetching articles:", error);
        return [];
    }
}

const Articles = () => {
    const articleNames = [
        "Army.gr",
        "mod.mil",
        "Geetha",
        "kranosgr",
        "armyvoice",
        "Militaire",
        "defencepoint",
        "onalert",
		"Documento",
		"DefenceReview",
		"DirectusAmyna",
		"DirectusDiethni",
		"HellasJournal",
		"DefenceNet"
    ];

    const [articles, setArticles] = useState({});

    useEffect(() => {
        const fetchAllArticles = async () => {
            const articlesData = await fetchArticles("/api/Articles", articleNames);
            const articlesMap = articleNames.reduce((acc, name, index) => {
                acc[name] = articlesData[index] || [];
                return acc;
            }, {});
            setArticles(articlesMap);
        };

        fetchAllArticles();
    }, []);

    const sendArticle = async (article) => {
        console.log(`Sending: ${article.title}`);
        try {
            await axios.get("/api/SendSignalMessage", {
                params: { article },
            });
        } catch (error) {
            console.error("Error sending Article:", error);
        }
    };

    const copyArticle = async (article) => {
        try {
            await navigator.clipboard.writeText(
                `${article.title}\n\n${decodeURI(article.link)}`
            );
            console.log("Text copied to clipboard");
        } catch (err) {
            console.error("Failed to copy text:", err);
        }
    };

    return (
        <div>
            {articleNames.map(name => (
                <div key={name}>
                    <h1>Άρθρα {name}</h1>
                    <ArticleItem
                        articles={articles[name] || []}
                        sendArticle={sendArticle}
                        copyArticle={copyArticle}
                    />
                </div>
            ))}
        </div>
    );
};

export default Articles;
