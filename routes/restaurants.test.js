const request = require("supertest");
const db = require("../db/connection");
const app = require("../src/app");
const { syncSeed } = require("../seed");
const { seedRestaurant } = require("../seedData");
const Restaurant = require("../models/index");

describe("Restuarant API tests:", () => {
  beforeEach(async () => {
    //await db.sync({ force: true });
    await syncSeed();
  });
  describe("./restuarants endpoint:", () => {
    it("GET should return code: 200 when table has values", async () => {
      const response = await request(app).get("/restaurants");
      expect(response.statusCode).toBe(200);
    });
    it("GET should return code: 200 when table no values", async () => {
      await db.sync({ force: true });
      const response = await request(app).get("/restaurants");
      expect(response.statusCode).toBe(200);
    });
    it("GET should return an array", async () => {
      const response = await request(app).get("/restaurants");
      expect(Array.isArray(response.body)).toBe(true);
    });
    it("GET should return the correct number of resturants", async () => {
      const response = await request(app).get("/restaurants");
      expect(response.body.length).toBe(seedRestaurant.length);
    });
    it("GET should return the correct data compared to the seed", async () => {
      const response = await request(app).get("/restaurants");
      response.body.forEach((object, index) => {
        expect(object.name).toEqual(seedRestaurant[index].name);
        expect(object.location).toEqual(seedRestaurant[index].location);
        expect(object.cuisine).toEqual(seedRestaurant[index].cuisine);
      });
    });
    it("POST should return a JSON response of the resturants with the new one", async () => {
      const sendData = {
        name: "Japanese",
        location: "Bristol",
        cuisine: "Japanese",
      };
      const response = await request(app).post("/restaurants").send(sendData);
      response.body.forEach(async (object, index) => {
        const resturantObj = await Restaurant.findByPk(index + 1);
        expect(await object.cuisine).toBe(await resturantObj.cuisine);
      });
      //expect(response.body).toEqual(await Restaurant.findAll());
    });
    it("POST should add a new resturant when keys are not empty", async () => {
      const sendData = {
        name: "Japanese",
        location: "Bristol",
        cuisine: "Japanese",
      };
      const response = await request(app).post("/restaurants").send(sendData);
      expect((await Restaurant.findAll()).length).toBe(4);
      expect(response.body.error).toBe(undefined);
    });
    it("POST should return error when keys are empty", async () => {
      const sentData = { name: "", location: "", cuisine: "" };
      const response = await request(app).post("/restaurants").send(sentData);
      response.body.error.forEach((error, index) => {
        console.log(error);
        const errorMessageCurrent = {
          location: "body",
          path: Object.keys(sentData)[index], // get the key name at the index of loop
          msg: "Invalid value",
          type: "field",
          value: "",
        };
        expect(error).toEqual(errorMessageCurrent);
      });
    });
  });

  describe("./restuarants/:id endpoint:", () => {
    seedRestaurant.forEach((_, index) =>
      it(`GET should return the correct data at index: ${index} compared to the seed`, async () => {
        const response = await request(app).get(`/restaurants/${index + 1}`);
        expect(response.body.name).toEqual(seedRestaurant[index].name);
        expect(response.body.location).toEqual(seedRestaurant[index].location);
        expect(response.body.cuisine).toEqual(seedRestaurant[index].cuisine);
      })
    );
    it("PUT should update an existing resturant", async () => {
      await request(app).put("/restaurants/1").send({ name: "PineappleBees" });
      expect((await Restaurant.findByPk(1)).name).toBe("PineappleBees");
    });
    it("PUT should update an existing resturant", async () => {
      await request(app).delete("/restaurants/1");
      expect(await Restaurant.findByPk(1)).toBe(null);
    });
  });
});
