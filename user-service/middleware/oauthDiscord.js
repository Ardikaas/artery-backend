const passport = require("passport");
const DiscordStrategy = require("passport-discord");
const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

passport.use(
  new DiscordStrategy(
    {
      clientID: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      callbackURL: process.env.DISCORD_CALLBACK_URL,
      scope: ["identify", "email"],
    },
    async (access_token, refresh_token, profile, done) => {
      try {
        const userExist = await prisma.user.findUnique({
          where: {
            email: profile.email,
            mode: "insensitive",
          },
        });

        if (userExist) {
          if (userExist.discord_id !== profile.id) {
            const updateUser = await prisma.user.update({
              where: { email: profile.email },
              data: { discord_id: profile.id },
            });
            return done(null, updateUser);
          }
          return done(null, userExist);
        }

        const newUser = await prisma.user.create({
          data: {
            discord_id: profile.id,
            username: profile.username,
            email: profile.email,
            image_url: profile.avatar
              ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
              : "https://defaultpicture.com",
            password: "",
          },
        });

        return done(null, newUser);
      } catch (error) {
        console.log(error);
        done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

const discordCallback = async (req, res) => {
  const access_token = jwt.sign(
    { id: req.user.id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
  const refresh_token = jwt.sign(
    { id: req.user.id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  try {
    await prisma.user.update({
      where: { id: req.user.id },
      data: { refresh_token: refresh_token },
    });
  } catch (error) {
    console.log("Error updating refresh token:", error);
  }

  res.json({
    status: {
      code: 200,
      message: "Login Successful",
    },
    data: {
      access_token: access_token,
      refresh_token: refresh_token,
    },
  });
};

module.exports = { passport, discordCallback };
