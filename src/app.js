const express = require("express");
const app = express();
const Restaurant = require("../models/index");
const db = require("../db/connection");
const seed = require("../seed");

//TODO: Create your GET Request Route Below:

db.sync({ force: true });
seed();

app.get("/restaurants", async (request, response) => {
  response.json(await Restaurant.findAll());
});

app.get("/restaurants/:id", async (request, response) => {
  response.json(await Restaurant.findByPk(Number(request.params.id)));
});

app.use(express.json());
app.use(express.urlencoded());

app.get(
  "/restaurants/add/:name/:location/:cusine",
  async (request, response) => {
    await Restaurant.create({
      name: request.params.name,
      location: request.params.location,
      cuisine: request.params.cusine,
    });
    response.status(201).send("Created new resturant");
  }
);

app.get(
  "/restaurants/update/:id/:name?/:location?/:cusine?",
  async (request, response) => {
    const resturant = await Restaurant.findByPk(request.params.id);
    await resturant.update({
      name: request.params.name,
      location: request.params.location,
      cuisine: request.params.cusine,
    });
    response.status(201).send("Updated resturant");
  }
);

module.exports = app;
