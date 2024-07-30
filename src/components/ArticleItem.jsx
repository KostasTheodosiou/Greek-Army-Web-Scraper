import React from "react";
import "./styles/articleItem.css";
import PropTypes from "prop-types";

const ArticleItem = ({ articles, sendArticle, copyArticle }) => {
    return (
        <div className="articles-container">
            {articles.map((article, index) => (
                <div key={index} className="article-card">
                    <h3 className="date">{article.date}</h3>
                    <h3 className="article-title">{article.title}</h3>
                    <a
                        className="article-link"
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
