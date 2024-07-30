import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles/articleCard.css";
import CheckBox from "./CheckBox";

const ArticleCard = ({ article }) => {
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        setChecked(article.tags?.includes("Read") ?? false);
    }, [article]);

    function SwitchState() {
        console.log(article.tags);
        setChecked(!checked);
        if (!checked) {
            const tags = ["Current", "Read"];
            ToggleRead(article.id, tags);
        } else {
            const tags = ["Current"];
            ToggleRead(article.id, tags);
        }
    }

    const sendArticle = async (article) => {
        console.log(`Sending: ${article.title}`);
        try {
            const response = await axios.get(
                "/api/SendSignalMessage",
                {
                    params: {
                        article: article,
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error sending Article:", error);
            return [{ title: "", link: "" }];
        }
    };

    const copyArticle = async (article) => {
        try {
            await navigator.clipboard.writeText(
                article.title + "\n\n" + encodeURI(article.link)    
            );
            console.log("Text copied to clipboard");
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    };

    async function ToggleRead(articleID, articleTags) {
        try {
            console.log(articleID);
            const response = await axios.post(
                "http://192.168.1.12:5000/api/UpdateEntry",
                {
                    params: {
                        id: articleID, // Axios automatically serializes the array
                        updates: { tags: articleTags },
                    },
                }
            );
        } catch (error) {
            console.error("Updating Article:", error);
            return [{ id: articleID }];
        }
    }

    return (
        <>
            <div className="date">{article.date}</div>
            <h3 className={!checked ? "article-title" : "inactive-title"}>
                {article.title}
            </h3>
            <a
                className={!checked ? "article-link" : "inactive-link"}
                href={encodeURI(article.link)}
                target="_blank"
                rel="noopener noreferrer"
            >
                {encodeURI(article.link)}
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
            <CheckBox
                key={article.id}
                SwitchState={SwitchState}
                checked={checked}
            />
        </>
    );
};

export default ArticleCard;
