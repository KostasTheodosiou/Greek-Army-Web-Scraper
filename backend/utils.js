const fs = require("fs");
const axios = require("axios");
const cheerio = require("cheerio");
const path = require("path");

const scrapeArticles = async (
    url,
    name,
    ancestorTerm,
    searchTerm,
    dateTerm,
    prefix
) => {
    //return [{ title: " ", link: " " }];
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        let articles = [];

        $(searchTerm).each((i, elem) => {
            let title1 = $(elem).find("a").text().trim();
            let title2 = $(elem).find("a").attr("title");
            let title3 = $(elem).find("h3").text().trim();
            const link = prefix + decodeURI($(elem).find("a").attr("href"));

            const title = title1 || title2 || title3;

            //console.log(elem.html());
            let ancestorElem = $(elem).closest(ancestorTerm);
            let date = $(ancestorElem).find(dateTerm).text().trim();

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
