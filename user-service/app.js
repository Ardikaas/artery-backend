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

app.get("/", async (req, res) => {
  UserController.getAllUsers(req, res);
});

app.delete("/:id", async (req, res) => {
  UserController.deleteUser(req, res);
});

app.post("/register", async (req, res) => {
  UserController.register(req, res);
});

app.post("/login", async (req, res) => {
  UserController.login(req, res);
});

app.post("/logout", async (req, res) => {
  UserController.logout(req, res);
});

app.post("/refresh", async (req, res) => {
  UserController.refresh(req, res);
});

app.post("/emailverify", async (req, res) => {
  UserController.sendEmailVerify(req, res);
});

app.get("/verify-email", async (req, res) => {
  UserController.verifyEmail(req, res);
});

app.get("/auth/discord", passport.authenticate("discord", { session: false }));
app.get(
  "/auth/discord/redirect",
  passport.authenticate("discord", { failureRedirect: "/api", session: false }),
  discordCallback
);

app.listen(port, () => {
  console.log(`listening on port http://localhost:${port}`);
});
