const fs = require("fs");
const axios = require("axios");
const cheerio = require("cheerio");
const path = require("path");

const scrapeArticles = async (
    url,
    name,
    ancestorTerm,
    searchTerm,
	linkTerm,
    dateTerm
) => {
    //return [{ title: " ", link: " " }];
    try {
        const { request, data } = await axios.get(url);
		const { protocol, host } = request;
		const origin = `${protocol}//${host}`;
        const $ = cheerio.load(data);
        const articles = [];

        $(searchTerm).each((i, elem) => {
            const title = $(elem).text().trim().replace(/\s+/g, " ");
            const ancestorElem = $(elem).closest(ancestorTerm);
            const href = $(ancestorElem).find(linkTerm).attr("href");
            const date = $(ancestorElem).find(dateTerm).text().trim().replace(/\s+/g, " ");
			
			const link = new URL(href, origin).href;

            articles.push({ title, link, name, date });
        });
        return articles;
    } catch (error) {
        console.error("ScrapeArticle Error");
        return [];
    }
};

const loadWebsites = () => {
    try {
        const data = fs.readFileSync(
            path.join(__dirname, "websites.json"),
            "utf8"
        );
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading file:", err);
        return [];
    }
};

module.exports = {
    scrapeArticles,
    loadWebsites,
};
