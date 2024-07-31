// backend/index.js
const { scrapeArticles, loadWebsites } = require("./utils.js");

const {
    handleSignalOps,
    sendAutoSignalMessage,
    sendSignalMessage,
} = require("./handleSignal.js");

const {
    db,
    AddArticle,
    getAllArticlesByName,
    updateArticle,
    getAllArticles,
    getAllArticlesByTag,
} = require("./database.js");

const express = require("express");
const axios = require("axios");
const cors = require("cors");
const cron = require("node-cron");
const fs = require("fs");
const { spawn } = require("child_process");
const path = require("path");

const WebSocket = require("ws");

const app = express();
const PORT = 5000;
const SOCKETPORT = 5001;

const configFilePath = path.join(__dirname, "config.json");

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "..", "build")));

const server = new WebSocket.Server({ port: SOCKETPORT });

server.on("connection", (socket) => {
    console.log("Client connected");

    // Receive message from client
    socket.on("message", (message) => {
        try {
            handleSignalOps(socket, message);
        } catch (err) {
            socket.send(JSON.stringify({ error: err.message }));
        }
    });

    // Handle connection close
    socket.on("close", () => {
        console.log("Client disconnected");
    });
});

console.log(`WebSocket server is running on ws://localhost: ${SOCKETPORT}`);

app.get("/api/Articles", async (req, res) => {
    const name = req.query.names;
    try {
        const articles = await getAllArticlesByName(db, name);
        res.json(articles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/api/newArticles", async (req, res) => {
    try {
        const articles = await getAllArticlesByTag(db, "Current");
        res.json(articles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/api/sendSignalMessage", async (req, res) => {
    const article = req.query.article;
    sendSignalMessage(article);
    res.json({ sent: true });
});

app.get("/api/AddEntry", async (req, res) => {
    const {title, link } = req.query;
    const article = { title, link, name:"Other", date: ""};
    AddArticle(db, article, ["Current"]);
    res.json({ Added: true });
});

app.post("/api/UpdateEntry", async (req, res) => {
    try {
        const id = parseInt(req.body.params.id, 10);
        const updates = req.body.params.updates;
        const result = await updateArticle(db, id, updates);
        if (result) {
            res.json({ message: "Article updated successfully", result });
        } else {
            res.status(404).json({ error: "Article not found" });
        }
    } catch (error) {
        console.error("Error updating article:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});

const startUp = async () => {
    const websites = loadWebsites();

    for (const i in websites) {
        const articles = await scrapeArticles(
            websites[i].url,
            websites[i].name,
            websites[i].ancestorTerm,
            websites[i].searchTerm,
            websites[i].dateTerm,
            websites[i].linkprefix
        );
        for (const j in articles) {
            try {
                await AddArticle(db, articles[j], ["Log"]);
            } catch {}
        }
    }
};

const RefreshArticles = async () => {
    const websites = loadWebsites();

    for (const i in websites) {
        const articles = await scrapeArticles(
            websites[i].url,
            websites[i].name,
            websites[i].ancestorTerm,
            websites[i].searchTerm,
            websites[i].dateTerm,
            websites[i].linkprefix
        );
        for (const j in articles) {
            try {
                const result = await AddArticle(db, articles[j], ["Current"]);
            } catch {}
        }
    }
};

cron.schedule("* * * * *", () => {
    console.log("..");
    RefreshArticles();
});

app.listen(PORT, async () => {
    console.log(`Server is running on http://localhost:${PORT}`);

    startUp();
});
