const request = require("supertest");
const db = require("../db/connection");
const app = require("../src/app");
const { syncSeed } = require("../seed");

describe("Restuarant API tests:", () => {
  beforeEach(async () => {
    //await db.sync({ force: true });
    await syncSeed();
  });
  describe("./restuarants endpoint:", () => {
    it("should return code: 200 when table has values", async () => {
      const response = await request(app).get("/restaurants");
      expect(response.statusCode).toBe(200);
    });
    it("should return code: 200 when table no values", async () => {
      await db.sync({ force: true });
      const response = await request(app).get("/restaurants");
      expect(response.statusCode).toBe(200);
    });
  });
});
