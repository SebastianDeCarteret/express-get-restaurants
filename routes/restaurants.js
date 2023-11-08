const express = require("express");
const router = express.Router();
const Restaurant = require("../models/index");

router.use((req, res, next) => {
  next();
});

router.get("/", async (request, response) => {
  const restuarants = await Restaurant.findAll();
  response.json(restuarants);
});

router.get("/:id", async (request, response) => {
  const resturant = await Restaurant.findByPk(request.params.id);
  if (resturant === null) {
    response.status(404).send("Not found");
    return;
  }
  response.json(resturant);
});

router.post("/", async (request, response) => {
  await Restaurant.create(request.body);
  console.log(request);
  response.status(201).send("Added resturant");
});

router.put("/:id", async (request, response) => {
  const resturant = await Restaurant.findByPk(request.params.id);
  if (resturant === null) {
    response.status(404).send("Not found");
    return;
  }
  await resturant.update(request.body);
  response.status(201).send("Updated resturant");
});

router.delete("/:id", async (request, response) => {
  const resturant = await Restaurant.findByPk(request.params.id);
  if (resturant === null) {
    response.status(404).send("Not found");
    return;
  }
  resturant.destroy();
  response.status(200).send("Deleted resturant");
});

module.exports = router;
