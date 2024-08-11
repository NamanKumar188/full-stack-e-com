// require("dotenv").config();
// const express = require("express");
// const app = express();
// const mongoose = require("mongoose");
// const cookieParser = require("cookie-parser");
// const cors = require('cors');
// const path = require("path");

// const port = process.env.PORT || 5007;
// const keysecret = process.env.KEY;

// const DefaultData = require("./defaultdata");
// require("./db/conn");
// const router = require("./routes/router");

// // Middleware
// app.use(express.json());
// app.use(cookieParser(""));

// // app.use(cors({
// //     origin: process.env.CLIENT_URL || 'http://localhost:3000', 
// //     credentials: true 
// // }));

// const allowedOrigins = [
//     'https://NamanKumar188.github.io/full-stack-e-com',
//     'https://namankumar188.github.io',
//     'https://NamanKumar188.github.io/full-stack-e-com-client',
//     process.env.CLIENT_URL || 'http://localhost:3000'
// ];

// app.use(cors({
//     origin: (origin, callback) => {
//         if (allowedOrigins.includes(origin) || !origin) {
//             callback(null, true);
//         } else {
//             callback(new Error('Not allowed by CORS'));
//         }
//     },
//     credentials: true
// }));


// app.use(router);

// if (process.env.NODE_ENV === "production") {
//     app.use(express.static(path.join(__dirname, "client/build")));

//     app.get("*", (req, res) => {
//         res.sendFile(path.join(__dirname, "client", "build", "index.html"));
//     });
// } else {
//     app.get("/", (req, res) => {
//         res.send("API is running...");
//     });
// }

// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
//     DefaultData();
// });
require("dotenv").config();
const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const MongoStore = require('connect-mongo');
const cors = require('cors');
const path = require("path");

const port = process.env.PORT || 5007;
const keysecret = process.env.KEY;

const DefaultData = require("./defaultdata");
require("./db/conn");
const router = require("./routes/router");

// Middleware
const app = express();

app.use(express.json());

// Session management
app.use(session({
    secret: keysecret,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://namankumar:naman1234@atlascluster.sw6thba.mongodb.net/?retryWrites=true&w=majority&appName=AtlasCluster', // MongoDB URI
        collectionName: 'sessions'
    }),
    cookie: {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use true for HTTPS
        sameSite: 'None', // Required for cross-site cookies
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    }
}));

// CORS configuration
const allowedOrigins = [
    'https://NamanKumar188.github.io/full-stack-e-com',
    'https://namankumar188.github.io',
    'https://NamanKumar188.github.io/full-stack-e-com-client',
    process.env.CLIENT_URL || 'http://localhost:3000'
];

app.use(cors({
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
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
