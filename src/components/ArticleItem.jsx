import React from "react";
import "./styles/articleItem.css";
import PropTypes from "prop-types";
import { CopyToClipboard } from "react-copy-to-clipboard";

const ArticleItem = ({ articles, sendArticle, copyArticle }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset the copied state after 2 seconds
    };
    if (!articles.length) {
        return <p>Δεν υπάρχουν Άρθρα.</p>;
    }

    const sortArticles = (articles) => {
        const currentArticles = articles.filter(article => article.tags.includes("Current"));
        const logArticles = articles.filter(article => article.tags.includes("Log"));
        currentArticles.sort((a, b) => b.id - a.id);
        logArticles.sort((a, b) => a.id - b.id);
        return [...currentArticles, ...logArticles];
    };

    const sortedArticles = sortArticles(articles);


    return (
        <div className="articles-container">
            {sortedArticles.map((article, index) => (
                <div key={index} className="article-card">
                    <h3 className="date">{article.date}</h3>
                    <h3 className="article-title">{article.title}</h3>
                    <a
                        className="article-link"
                        href={article.link}
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
                    <CopyToClipboard text={article.title + "\n\n" + article.link} onCopy={handleCopy}>
                    <button className="copy-button">
                        Copy
                    </button>
                    </CopyToClipboard>
                </div>
            ))}
        </div>
    );
};

ArticleItem.propTypes = {
    articles: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string.isRequired,
            link: PropTypes.string.isRequired,
        })
    ).isRequired,
};

export default ArticleItem;
