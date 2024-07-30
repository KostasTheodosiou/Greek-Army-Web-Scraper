import React, { useState } from "react";
import axios from "axios";

function EntryForm({ addEntry, fetchNewArticles }) {
    const [title, setTitle] = useState("");
    const [link, setLink] = useState("");

    async function addAnEntry(article) {
        try {
            const response = await axios.get(
                "/api/AddEntry",
                {
                    params: {
                        title: article.title,
                        link: article.link,
                    },
                }
            );
            console.log("GET request running");
            return response.data;
        } catch (error) {
            console.error("Error fetching articles:", error);
            return [{ title: "", link: "" }];
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (title && link) {
            addAnEntry({ title, link });
            setTitle("");
            setLink("");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="entry-form">
            <div>
                <label>Title:</label>
                <input
                    className="entrybox"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Link:</label>
                <input
                    className="entrybox"
                    type="url"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Add Entry</button>
        </form>
    );
}

export default EntryForm;
