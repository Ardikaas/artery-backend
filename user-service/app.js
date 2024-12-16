const bodyParser = require("body-parser");
const express = require("express");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");
const UserController = require("./controllers/userController");
const protect = require("./middleware/auth");
const passport = require("passport");
const { discordCallback } = require("./middleware/oauthDiscord");

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

app.use(passport.initialize());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/api", async (req, res) => {
  res.send("hai ngapain kesini");
});

app.get("/api/user", async (req, res) => {
  UserController.getAllUsers(req, res);
});

app.delete("/api/user/:id", async (req, res) => {
  UserController.deleteUser(req, res);
});

app.post("/api/register", async (req, res) => {
  UserController.register(req, res);
});

app.post("/api/login", async (req, res) => {
  UserController.login(req, res);
});

app.post("/api/logout", async (req, res) => {
  UserController.logout(req, res);
});

app.post("/api/refresh", async (req, res) => {
  UserController.refresh(req, res);
});

app.post("/api/emailverify", async (req, res) => {
  UserController.sendEmailVerify(req, res);
});

app.get("/api/verify-email", async (req, res) => {
  UserController.verifyEmail(req, res);
});

app.get(
  "/api/auth/discord",
  passport.authenticate("discord", { session: false })
);
app.get(
  "/api/auth/discord/redirect",
  passport.authenticate("discord", { failureRedirect: "/api", session: false }),
  discordCallback
);

app.listen(port, () => {
  console.log(`listening on port http://localhost:${port}`);
});
