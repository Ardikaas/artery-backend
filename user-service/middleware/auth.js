const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const protect = async (req, res, next) => {
  const { auth } = req.headers;

  if (!auth) {
    return res.status(401).json({
      status: {
        code: 401,
        message: "Authorization token required",
      },
    });
  }

  const token = auth.split(" ")[1];
  try {
    const { userId } = jwt.verify(token, process.env.TOKENPASS);

    req.user = await prisma.user.findUnique({
      where: { id: userId },
      select: { ide: true, username: true },
    });

    if (!req.user) {
      return res.status(401).json({
        status: {
          code: 401,
          message: "User not found",
        },
      });
    }
  } catch (error) {
    res.status(401).json({
      status: {
        code: 401,
        message: "Request is not authorized",
      },
    });
  }
};

module.exports = protect;
