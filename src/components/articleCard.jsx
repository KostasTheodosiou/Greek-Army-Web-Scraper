import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles/articleCard.css";
import CheckBox from "./CheckBox";

const convertDateToGreek = (dateString) => {
    if(dateString == null){
        return "";
    } 
    const monthsGreek = [
        "Ιανουαρίου", "Φεβρουαρίου", "Μαρτίου", "Απριλίου", "Μαΐου", "Ιουνίου",
        "Ιουλίου", "Αυγούστου", "Σεπτεμβρίου", "Οκτωβρίου", "Νοεμβρίου", "Δεκεμβρίου"
    ];

    // Split the date and time parts
    const [datePart, timePart] = dateString.split(" ");
    const [year, month, day] = datePart.split("-");

    // Convert the month to Greek
    const monthGreek = monthsGreek[parseInt(month, 10) - 1];

    // Return the formatted string
    return `${day} ${monthGreek} ${year} ${timePart}`;
};


const ArticleCard = ({ article }) => {
    const [checked, setChecked] = useState(false);
    // const [isEditing, setIsEditing] = useState(false);
    // const [editedTitle, setEditedTitle] = useState(article.title);

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
        //console.log(`Sending: ${article.title}`);
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
                "/api/UpdateEntry",
                {
                    params: {
                        id: articleID, // Axios automatically serializes the array
                        updates: { tags: articleTags },
                    },
                }
            );
            console.log(response);
        } catch (error) {
            console.error("Updating Article:", error);
            return [{ id: articleID }];
        }
    }

    // const handleEditClick = () => {
    //     setIsEditing(true);
    // };

    // const handleSaveClick = async () => {
    //     setIsEditing(false);
    //     await updateArticleTitle(article.id, editedTitle);
    // };

    // const handleInputChange = (e) => {
    //     setEditedTitle(e.target.value);
    // };

    // const updateArticleTitle = async (articleID, newTitle) => {
    //     try {
    //         const response = await axios.post(
    //             "/api/UpdateEntry",
    //             {
    //                 id: articleID,
    //                 updates: { title: newTitle },
    //             }
    //         );
    //         console.log(response);
    //     } catch (error) {
    //         console.error("Error updating article title:", error);
    //     }
    // };

    return (
        <>
            <div className="dateAdded">Βρέθηκε: {convertDateToGreek(article.dateAdded)}</div>
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
