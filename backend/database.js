const sqlite3 = require("sqlite3").verbose();
const path = require("path");

function formatDateToDDMMYYYY(date) {
    const day = String(date.getDate()).padStart(2, "0"); // Ensure two digits for day
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based, so add 1
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
}

const today = new Date();
const date = formatDateToDDMMYYYY(today);
console.log(date);

const dbPath = path.resolve(__dirname, `./ArticlesLog/${date}.db`);
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Error opening database " + err.message);
    } else {
        console.log("-- Η Βάση συνδέθηκε --");
    }
});

// Initialize and create table if it doesn't exist
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS articles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        link TEXT NOT NULL UNIQUE,
        name TEXT,
        date TEXT,
        tags TEXT NOT NULL,
        category TEXT,
        dateAdded TEXT DEFAULT (datetime('now'))
    )`);
});

/**
 * Adds an article to the database if it doesn't already exist.
 * @param {sqlite3.Database} db - The database connection.
 * @param {Object} article - The article object.
 * @param {string} article.title - The title of the article.
 * @param {string} article.link - The link to the article.
 * @param {string} article.name - The name associated with the article.
 * @param {string} article.date - The date of the article.
 * @param {string} tag - The tag associated with the article.
 * @returns {Promise<Object>} The added article or the existing one.
 */
function AddArticle(db, article, tags) {
    return new Promise((resolve, reject) => {
        const { title, link, name, date } = article;
        const category = ""; // Default value for category

        if (typeof link === "undefined" || link === "" || link === "undefined") {
            return reject();
        }

        const checkQuery = `SELECT * FROM articles WHERE link = ?`;

        db.get(checkQuery, [link], (err, row) => {
            if (err) {
                return reject(err);
            }
            if (row) {
                // Article already exists
                return resolve();
            }
            console.log("New entry in " + name);

            const activeDate = date.length > 0 ? date : " ";
            const validTags = ["Log", "Current", "Read", "Sent"];
            const filteredTags = tags.filter((tag) => validTags.includes(tag));
            const tagsJSON = JSON.stringify(filteredTags);

            const query = `INSERT INTO articles (title, link, name, date, tags, category, dateAdded) VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`;

            db.run(
                query,
                [title, link, name, activeDate, tagsJSON, category],
                function (err) {
                    if (err) {
                        console.error("Database AddArticle error:", err.message);
                        return reject(err);
                    }
                    // Resolve with the ID of the inserted row
                    resolve({
                        id: this.lastID,
                        title,
                        link,
                        name,
                        date: activeDate,
                        tags: filteredTags,
                        category,
                        dateAdded: new Date().toISOString() // Current date and time in ISO format
                    });
                    console.log({
                        id: this.lastID,
                        title,
                        link,
                        name,
                        date: activeDate,
                        tags: filteredTags,
                        category,
                        dateAdded: new Date().toISOString() // Current date and time in ISO format
                    });
                }
            );
        });
    });
}


/**
 * Retrieves all articles by a specific name.
 * @param {sqlite3.Database} db - The database connection.
 * @param {string} name - The name to filter by.
 * @returns {Promise<Array>} The list of articles with the specified name.
 */
function getAllArticlesByName(db, name) {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM articles WHERE name = ?`;

        db.all(query, [name], (err, rows) => {
            if (err) {
                console.error({ error: err.message });
                reject(err);
            }
            resolve(rows);
        });
    });
}

/**
 * Retrieves all articles by a specific tag.
 * @param {sqlite3.Database} db - The database connection.
 * @param {string} tag - The tag to filter by.
 * @returns {Promise<Array>} The list of articles with the specified tag.
 */
function getAllArticlesByTag(db, tag) {
    return new Promise((resolve, reject) => {
        const query = `SELECT articles.* FROM articles, json_each(articles.tags) WHERE json_each.value = ?`;

        db.all(query, [tag], (err, rows) => {
            //console.log([tag]);
            if (err) {
                console.error({ error: err.message });
                reject(err);
            }
            resolve(rows);
        });
    });
}

function getAllArticles(db) {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM articles`;

        db.all(query, (err, rows) => {
            if (err) {
                console.log({ error: err.message });
                reject(err);
            }
            resolve(rows);
        });
    });
}

function getArticle(db, id) {
    const query = `SELECT * FROM articles WHERE id = ?`;

    db.get(query, [id], (err, row) => {
        if (err) {
            console.log("Database getArticle error");
        }
        if (row) {
            return row;
        } else {
            console.log({ error: "Article not found" });
        }
    });
}

function updateArticle(db, id, updates) {
    return new Promise((resolve, reject) => {
        const fields = [];
        const values = [];

        //Dynamically build the SQL query based on provided fields
        if (updates.title) {
            fields.push("title = ?");
            values.push(updates.title);
        }
        if (updates.link) {
            fields.push("link = ?");
            values.push(updates.link);
        }
        if (updates.tags) {
            const validTags = ["Log", "Current", "Read", "Sent"];
            const filteredTags = updates.tags.filter((tag) =>
                validTags.includes(tag)
            );
            values.push(JSON.stringify(filteredTags));
            fields.push("tags = ?");
        }
        if (updates.category !== undefined) {
            values.push(updates.category);
            fields.push("category = ?");
        }

        // Add the ID to the values array and create the final query
        values.push(id);
        const query = `UPDATE articles SET ${fields.join(", ")} WHERE id = ?`;

        db.run(query, values, function (err) {
            if (err) {
                console.error({ error: err.message });
                return reject(err);
            }
            if (this.changes > 0) {
                resolve({ id, ...updates });
            } else {
                resolve(null);
            }
        });
    });
}

function deleteArticle(db, id) {
    const query = `DELETE FROM articles WHERE id = ?`;

    db.run(query, id, function (err) {
        if (err) {
            console.log({ error: err.message });
        }
        if (this.changes) {
            console.log(`deleted: ${id}`);
        } else {
            console.log({ error: "Article not found" });
        }
    });
}

module.exports = {
    db,
    AddArticle,
    getAllArticles,
    updateArticle,
    getAllArticlesByName,
    getAllArticlesByTag,
    deleteArticle,
};
