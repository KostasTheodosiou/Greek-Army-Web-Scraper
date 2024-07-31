import React, { useState,  useRef, useEffect } from "react";
import "./styles/EntryForm.css";
import axios from "axios";

function EntryForm({ addEntry, fetchNewArticles }) {
    const [title, setTitle] = useState("");
    const [link, setLink] = useState("");
    const formRef = useRef(null);

    async function addAnEntry(article) {
        try {
            const response = await axios.get("/api/AddEntry", {
                params: {
                    title: article.title,
                    link: article.link,
                },
            });
            console.log("GET request running");
            return response.data;
        } catch (error) {
            console.error("Error fetching articles:", error);
            return [{ title: "", link: "" }];
        }
    }
    useEffect(() => {
        const formElement = formRef.current;
        let offsetX, offsetY;

        const handleMouseDown = (e) => {
            offsetX = e.clientX - formElement.getBoundingClientRect().left;
            offsetY = e.clientY - formElement.getBoundingClientRect().top;
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
        };

        const handleMouseMove = (e) => {
            formElement.style.left = `${e.clientX - offsetX}px`;
            formElement.style.top = `${e.clientY - offsetY}px`;
        };

        const handleMouseUp = () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };

        const handle = formElement.querySelector(".handle");
        handle.addEventListener("mousedown", handleMouseDown);

        return () => {
            handle.removeEventListener("mousedown", handleMouseDown);
        };
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (title && link) {
            addAnEntry({ title, link });
            setTitle("");
            setLink("");
        }
    };

    useEffect(() => {
        const formElement = formRef.current;
        let offsetX, offsetY;

        const handleMouseDown = (e) => {
            offsetX = e.clientX - formElement.getBoundingClientRect().left;
            offsetY = e.clientY - formElement.getBoundingClientRect().top;
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
        };

        const handleMouseMove = (e) => {
            formElement.style.left = `${e.clientX - offsetX}px`;
            formElement.style.top = `${e.clientY - offsetY}px`;
        };

        const handleMouseUp = () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };

        const handle = formElement.querySelector(".handle");
        handle.addEventListener("mousedown", handleMouseDown);

        return () => {
            handle.removeEventListener("mousedown", handleMouseDown);
        };
    }, []);

    return (
        <form ref={formRef} onSubmit={handleSubmit} className="entry-form">
            <div className="handle">..........</div>

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
