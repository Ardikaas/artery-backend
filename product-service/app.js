const express = require("express");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");
const bodyParser = require("body-parser");
const productController = require("./controllers/productController");

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

app.get("/all", async (req, res) => {
  productController.getAllProduct(req, res);
});

app.get("/search", async (req, res) => {
  productController.searchProduct(req, res);
});

app.get("/:id", async (req, res) => {
  productController.getProductById(req, res);
});

app.get("/create", async (req, res) => {
  productController.createProduct(req, res);
});

app.delete("/:id", async (req, res) => {
  productController.deleteProduct(req, res);
});

app.listen(port, () => {
  console.log(`listening on port http://localhost:${port}`);
});
