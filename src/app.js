const express = require("express");
const app = express();
const Restaurant = require("../models/index");
const db = require("../db/connection");
const seed = require("../seed");
// const router = require("../routes/restaurants");

//TODO: Create your GET Request Route Below:
app.use(express.json());
app.use(express.urlencoded());

db.sync({ force: true }); // clear db
seed(); // add data

app.get("/restaurants", async (request, response) => {
  response.json(await Restaurant.findAll());
});

app.get("/restaurants/:id", async (request, response) => {
  const resturant = await Restaurant.findByPk(request.params.id);
  if (resturant === null) {
    response.status(404).send("Not found");
    return;
  }
  response.json(resturant);
});

app.post("/restaurants", async (request, response) => {
  await Restaurant.create(request.body);
  response.status(201).send("Added resturant");
});

app.put("/restaurants/:id", async (request, response) => {
  const resturant = await Restaurant.findByPk(request.params.id);
  if (resturant === null) {
    response.status(404).send("Not found");
    return;
  }
  await resturant.update(request.body);
  response.status(201).send("Updated resturant");
});

app.delete("/restaurants/:id", async (request, response) => {
  const resturant = await Restaurant.findByPk(request.params.id);
  if (resturant === null) {
    response.status(404).send("Not found");
    return;
  }
  resturant.destroy();
  response.status(200).send("Deleted resturant");
});

module.exports = app;
