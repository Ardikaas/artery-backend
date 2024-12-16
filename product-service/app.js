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

app.get("/api/product", (req, res) => {
  productController.getAllProduct(req, res);
});

app.listen(port, () => {
  console.log(`listening on port http://localhost:${port}`);
});
