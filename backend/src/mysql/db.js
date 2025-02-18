const { Model } = require("objection");
const Knex = require("knex");
const knexfile = require("./knexfile");

const db = Knex(knexfile);
Model.knex(db);

// db.raw("select 1+1")
//   .then(() => {
//     console.log("Connected to database");
//   })
//   .catch((err) => {
//     console.log("Error connecting to database", err);
//   });

module.exports = db;
