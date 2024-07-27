// src/Articles.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styles/articles.css";
import ArticleItem from "./ArticleItem";

async function fetchArticles(url, name) {
    try {
        const response = await axios.get(url, {
            params: {
                names: name, // Axios automatically serializes the array
            },
        });
        //console.log("GET request running");
        return response.data;
    } catch (error) {
        console.error("Error fetching articles:", error);
        return [{ title: "", link: "" }];
    }
}

const Articles = () => {
    const [ArticleNames] = useState([
        "Army.gr",
        "mod.mil",
        "Geetha",
        "kranosgr",
        "spartakos",
        "armyvoice",
        "Militaire",
    ]);
    const [armyArticles, setArmyArticles] = useState([]);
    const [modArticles, setModArticles] = useState([]);
    const [geethaArticles, setGeethaArticles] = useState([]);
    const [kranosArticles, setKranosArticles] = useState([]);
    const [spartakosArticles, setSpartakosArticles] = useState([]);
    const [armyvoiceArticles, setArmyvoiceArticles] = useState([]);
    const [MilitaireArticles, setMilitaireArticles] = useState([]);

    useEffect(() => {
        const fetchAllArticles = async () => {
            for (const i in ArticleNames) {
                const data = await fetchArticles(
                    "http://192.168.1.12:5000/api/Articles",
                    ArticleNames[i] // Axios automatically serializes the array
                );
                //console.log(data);
                if (ArticleNames[i] === "Army.gr") {
                    setArmyArticles(data);
                }
                if (ArticleNames[i] === "mod.mil") {
                    setModArticles(data);
                }
                if (ArticleNames[i] === "Geetha") {
                    setGeethaArticles(data);
                }
                if (ArticleNames[i] === "kranosgr") {
                    setKranosArticles(data);
                }
                if (ArticleNames[i] === "spartakos") {
                    setSpartakosArticles(data);
                }
                if (ArticleNames[i] === "armyvoice") {
                    setArmyvoiceArticles(data);
                }
                if (ArticleNames[i] === "Militaire") {
                    setMilitaireArticles(data);
                }
            }
        };

        fetchAllArticles();
    }, []);

    const sendArticle = async (article) => {
        console.log(`Sending: ${article.title}`);
        try {
            const response = await axios.get(
                "http://localhost:5000/api/SendSignalMessage",
                {
                    params: {
                        article: article,
                    },
                }
            );
            console.log("GET request running");
            return response.data;
        } catch (error) {
            console.error("Error sending Article:", error);
            return [{ title: "", link: "" }];
        }
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
        <div>
            <h1>Άρθρα Army.gr</h1>
            <ArticleItem
                articles={armyArticles}
                sendArticle={sendArticle}
                copyArticle={copyArticle}
            ></ArticleItem>
            <h1>Άρθρα ΥΕΘΑ</h1>
            <ArticleItem
                articles={modArticles}
                sendArticle={sendArticle}
                copyArticle={copyArticle}
            ></ArticleItem>
            <h1>Άρθρα ΓΕΕΘΑ</h1>
            <ArticleItem
                articles={geethaArticles}
                sendArticle={sendArticle}
                copyArticle={copyArticle}
            ></ArticleItem>
            <h1>Άρθρα kranosgr</h1>
            <ArticleItem
                articles={kranosArticles}
                sendArticle={sendArticle}
                copyArticle={copyArticle}
            ></ArticleItem>
            <h1>Άρθρα Spartakos</h1>
            <ArticleItem
                articles={spartakosArticles}
                sendArticle={sendArticle}
                copyArticle={copyArticle}
            ></ArticleItem>
            <h1>Άρθρα armyvoice</h1>
            <ArticleItem
                articles={armyvoiceArticles}
                sendArticle={sendArticle}
                copyArticle={copyArticle}
            ></ArticleItem>
            <h1>Άρθρα Militaire</h1>
            <ArticleItem
                articles={MilitaireArticles}
                sendArticle={sendArticle}
                copyArticle={copyArticle}
            ></ArticleItem>
        </div>
    );
};

export default Articles;
