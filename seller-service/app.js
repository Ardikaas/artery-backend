const express = require("express");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");
const bodyParser = require("body-parser");
const sellerController = require("./controllers/sellerController");

dotenv.config();
const port = process.env.PORT;
const app = express();

const prisma = new PrismaClient();
prisma
  .$connect()
  .then((result) => console.log("database connected succesfully"))
  .catch((err) =>
    console.log({
      message: "database connetion failure",
      error: { err },
    })
  );

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.get("/", async (req, res) => {
  sellerController.getAllStore(req, res);
});

app.post("/create", async (req, res) => {
  sellerController.createStore(req, res);
});

app.put("/add-product/:id", async (req, res) => {
  sellerController.addStoreProduct(req, res);
});

app.put("/add-order/:id", async (req, res) => {
  sellerController.addOrder(req, res);
});

app.put("/add-history/:id", async (req, res) => {
  sellerController.HistoryOrder(req, res);
});

app.listen(port, () => {
  console.log(`app listening on port http://localhost:${port}`);
});
