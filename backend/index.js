// backend/index.js
const { scrapeArticles, loadWebsites } = require("./utils.js");

const {
    handleSignalOps,
    sendSignalMessage,
} = require("./handleSignal.js");

const {
    db,
    AddArticle,
    getAllArticlesByName,
    updateArticle,
    getAllArticlesByTag,
} = require("./database.js");

const express = require("express");
const cors = require("cors");
const cron = require("node-cron");
const fs = require("fs");
const path = require("path");

const WebSocket = require("ws");

const app = express();
const PORT = 5000;
const SOCKETPORT = 5001;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "..", "build")));
const imagePath = path.join(__dirname, 'NewsFronts');
//console.log('Serving images from:', imagePath);
app.use('/images', express.static(imagePath));

const server = new WebSocket.Server({ port: SOCKETPORT });

let cronJob = null;

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

//console.log(`WebSocket server is running on ws://localhost: ${SOCKETPORT}`);

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
    const { title, link } = req.query;
    const article = { title, link, name: "Other", date: "" };
    AddArticle(db, article, ["Current"]);
    res.json({ Added: true });
});

app.get('/api/images', (req, res) => {
    fs.readdir(path.join(__dirname, 'NewsFronts'), (err, files) => {
      if (err) {
        res.status(500).send('Error reading image directory');
        return;
      }
      // Filter out any non-image files if needed
      res.json(files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file)));
    });
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
            websites[i].linkTerm,
            websites[i].dateTerm
        );
        for (const j in articles) {
            try {
                await AddArticle(db, articles[j], ["Log"]);
            } catch { }
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
            websites[i].linkTerm,
            websites[i].dateTerm
        );
        for (const j in articles) {
            try {
                const result = await AddArticle(db, articles[j], ["Current"]);
            } catch { }
        }
    }
};

function startCronJob() {
    if (cronJob) {
        console.log("Cron job is already running.");
        return;
    }

    // Define the cron job, e.g., to run every minute
    cronJob = cron.schedule("*/2 * * * *", () => {
        console.log("..");
        RefreshArticles();
    });
}

async function initializeServer() {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Ο Server τρέχει στο port ${PORT}`);
    });

    try {
        console.log("Αρχικοποίηση Βάσης");
        await startUp(); // Wait for the startup task to complete
        console.log("Αρχικοποίηση Ολοκληρώθηκε, Έναρξη περιοδικού Ελέγχου για νέα Άρθρα");
        startCronJob(); // Start the cron job after task completion
    } catch (error) {
        console.error("Failed to complete startup task:", error);
        process.exit(1); // Exit the process if the startup task fails
    }
}
initializeServer();