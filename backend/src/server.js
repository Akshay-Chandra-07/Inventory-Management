const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config({ path: "./src/.env" });
require("./mysql/db");

const app = express();
app.use(
  cors({ origin: "http://localhost:4200", exposedHeaders: ["Authorization"] }),
);
app.use(express.json());

app.use("/v1", require("./v1/v1Routes"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening to port ${process.env.PORT}`);
});
