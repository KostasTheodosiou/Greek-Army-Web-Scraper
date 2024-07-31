import "./styles/EntryForm.css";
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

function EntryForm({ fetchNewArticles }) {
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [minimized, setMinimized] = useState(false);
  const formRef = useRef(null);
  const handleRef = useRef(null);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title && link) {
      addAnEntry({ title, link });
      setTitle("");
      setLink("");
    }
  };

  const toggleMinimize = () => {
    setMinimized(!minimized);
  };

  useEffect(() => {
    const formElement = formRef.current;
    const handleElement = handleRef.current;

    if (!formElement || !handleElement) return;

    let offsetX, offsetY;

    const handleMouseDown = (e) => {
      offsetX = e.clientX - formElement.getBoundingClientRect().left;
      offsetY = e.clientY - formElement.getBoundingClientRect().top;
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    };

    const handleMouseMove = (e) => {
      const formRect = formElement.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let newLeft = e.clientX - offsetX;
      let newTop = e.clientY - offsetY;

      // Ensure the form doesn't go out of the viewport boundaries
      if (newLeft < 0) newLeft = 0;
      if (newTop < 0) newTop = 0;
      if (newLeft + formRect.width > viewportWidth)
        newLeft = viewportWidth - formRect.width;
      if (newTop + formRect.height > viewportHeight)
        newTop = viewportHeight - formRect.height;

      formElement.style.left = `${newLeft}px`;
      formElement.style.top = `${newTop}px`;
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    handleElement.addEventListener("mousedown", handleMouseDown);

    return () => {
      handleElement.removeEventListener("mousedown", handleMouseDown);
    };
  }, [minimized]);

  useEffect(() => {
    if (minimized) {
      const formElement = formRef.current;
      formElement.style.left = "auto";
      formElement.style.top = "auto";
      formElement.style.right = "10px";
      formElement.style.bottom = "10px";
    }
  }, [minimized]);

  return (
    <div ref={formRef} className={`entry-form ${minimized ? "minimized" : ""}`}>
      {minimized ? (
        <button className= {`minimize-button-${minimized ? "minimized" : ""}`} onClick={toggleMinimize}>
          +
        </button>
      ) : (
        <>
          <button ref={handleRef} className="handle">
            .....
          </button>
          <button className="minimize-button" onClick={toggleMinimize}>
            -
          </button>
          <form onSubmit={handleSubmit}>
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
        </>
      )}
    </div>
  );
}

export default EntryForm;
