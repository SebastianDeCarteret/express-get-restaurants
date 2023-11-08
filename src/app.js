const express = require("express");
const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded());

// routes(middleware)
const restaurantsRouter = require("../routes/restaurants");
app.use("/restaurants", restaurantsRouter);

module.exports = app;
