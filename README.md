Web scraping App for real time web scraping of greek news outlets, built for the needs of the Greek Army general Staff. It uses Node.js as its' main runtime and express for the backend. The constant scraping is implemented with cron Jobs that periodicly grab the specified web pages. The saving of the data is achieved though the use of a mySQL database that resets daily. The user interracts with the app using a frontend utility that was designed using a REACT framework, in a way that allows multiple users on the same local network to work along side each other. The app supports integration with Signal Messaging API, so that updates from websites can be received imidiately on mobile apps through push notifications from the Signal Messaging App.

# To Run: 

Install Node

npm i express cors fs path ws react react-dom axios cheerio sqlite3

# Create React Build 

npm run build

# Start Server

node ./backend/index.js
