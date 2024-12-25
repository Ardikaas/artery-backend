const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const imageController = require("./controller/imageController");

dotenv.config();
const port = process.env.PORT;
const app = express();

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

app.post(
  "/upload-product",
  imageController.uploadProduct,
  imageController.uploadProductImage
);
app.post(
  "/upload-user",
  imageController.uploadUser,
  imageController.uploadUserProfileImage
);
app.post(
  "/upload-store",
  imageController.uploadStore,
  imageController.uploadStoreProfileImage
);

app.get("/:type/:filename", imageController.getImage);

app.get("/", (req, res) => {
  res.send("img server running smoothly");
});

app.listen(port, () => {
  console.log(`listening on port http://localhost:${port}`);
});
