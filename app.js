require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require('cors');
const path = require("path");

const port = process.env.PORT || 5007;
const keysecret = process.env.KEY;

const DefaultData = require("./defaultdata");
require("./db/conn");
const router = require("./routes/router");

// Middleware
app.use(express.json());
app.use(cookieParser(""));

// app.use(cors({
//     origin: process.env.CLIENT_URL || 'http://localhost:3000', 
//     credentials: true 
// }));


app.use(cors({
    origin: ' https://NamanKumar188.github.io/full-stack-e-com/',
    credentials: true
}));


app.use(router);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "client/build")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "client", "build", "index.html"));
    });
} else {
    app.get("/", (req, res) => {
        res.send("API is running...");
    });
}

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    DefaultData();
});
