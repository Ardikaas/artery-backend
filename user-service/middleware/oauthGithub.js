const passport = require("passport");
const GithubStrategy = require("passport-github2");
const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbacURL: process.env.GITHUB_CALLBACK_URL,
      scope: ["user:email"],
    },
    async (access_token, refresh_token, profile, done) => {
      try {
      } catch (error) {
        console.log(error);
        done(error, nul);
      }
    }
  )
);
