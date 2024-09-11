import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles/articleCard.css";
import CheckBox from "./CheckBox";
import { CopyToClipboard } from "react-copy-to-clipboard";

const ArticleCard = ({ article }) => {
  const [checked, setChecked] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset the copied state after 2 seconds
  };

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
    try {
      const response = await axios.get("/api/SendSignalMessage", {
        params: {
          article: article,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error sending Article:", error);
      return [{ title: "", link: "" }];
    }
  };

  async function ToggleRead(articleID, articleTags) {
    try {
      console.log(articleID);
      const response = await axios.post("/api/UpdateEntry", {
        params: {
          id: articleID, // Axios automatically serializes the array
          updates: { tags: articleTags },
        },
      });
      console.log(response);
    } catch (error) {
      console.error("Updating Article:", error);
      return [{ id: articleID }];
    }
  }

  return (
    <>
      <div className="article-options">
        <CopyToClipboard text={article.title} onCopy={handleCopy}>
          <button className="individual-copy-title">T 📋</button>
        </CopyToClipboard>
        <CopyToClipboard text={article.link} onCopy={handleCopy}>
          <button className="individual-copy-link">L 📋</button>
        </CopyToClipboard>
      </div>
        <div className="dateAdded">Βρέθηκε: {article.dateAdded}</div>
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
        <button className="send-button" onClick={() => sendArticle(article)}>
          Send
        </button>
        <CopyToClipboard
          text={article.title + "\n\n" + article.link}
          onCopy={handleCopy}
        >
          <button className="copy-button">Copy</button>
        </CopyToClipboard>
        <CheckBox
          key={article.id}
          SwitchState={SwitchState}
          checked={checked}
        />
    </>
  );
};

export default ArticleCard;