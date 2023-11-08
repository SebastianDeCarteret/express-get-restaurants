const Restaurant = require("./models/index");
const { seedRestaurant } = require("./seedData");
const db = require("./db/connection");

const syncSeed = async () => {
  await db.sync({ force: true }); // clear db
  await Promise.all(
    seedRestaurant.map((restaurant) => Restaurant.create(restaurant))
  );
  // BONUS: Update with Item and Menu bulkCreate
};

//syncSeed();

module.exports = { syncSeed };
