require('dotenv').config({ path: '.env' });
const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const mainRouter = require('./router');


// SERVER CONFIG _____________________________________________________

const app = express();

app.listen(process.env.PORT, () => {
  console.log(`Le serveur est lancé sur le port ${process.env.PORT} en ${process.env.NODE_ENV} mode.`);
});

app.get("/", (_, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

app.use(
    cors({
        origin: "http://localhost:3000",
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("../client/build"));
app.use(cookieParser());


// ROUTES ___________________________________________________________

app.use(process.env.APP_BASE_URL, mainRouter);