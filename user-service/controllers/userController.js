const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const nodemailer = require("nodemailer");

const OAuth2_client = new OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);
OAuth2_client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const prisma = new PrismaClient();
const UserController = {
  getAllUsers,
  deleteUser,
  register,
  login,
  logout,
  refresh,
  sendEmailVerify,
  verifyEmail,
};

async function getAllUsers(req, res) {
  try {
    const role = req.query.role;
    const users = role
      ? await prisma.user.findMany({
          where: { role: role },
        })
      : await prisma.user.findMany();
    const dataUsers = users.map(
      ({ password, ...userWithoutPassword }) => userWithoutPassword
    );

    res.status(200).json({
      status: {
        code: 200,
        message: "Success",
      },
      data: dataUsers,
    });
  } catch (error) {
    res.status(500).json({
      status: {
        code: 500,
        message: error.message,
      },
    });
  }
}

async function deleteUser(req, res) {
  try {
    const userId = req.params.id;

    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      return res.status(404).json({
        status: {
          code: 404,
          message: "User not found",
        },
      });
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    res.status(200).json({
      status: {
        code: 200,
        message: "User deleted successfully",
      },
    });
  } catch (error) {
    res.status(500).json({
      status: {
        code: 500,
        message: error.message,
      },
    });
  }
}

async function register(req, res) {
  try {
    const newUser = req.body;

    const userExist = await prisma.user.findFirst({
      where: {
        username: {
          equals: newUser.username,
          mode: "insensitive",
        },
      },
    });
    const emailExist = await prisma.user.findUnique({
      where: {
        email: newUser.email,
      },
    });

    if (userExist) {
      return res.status(400).json({
        status: {
          code: 400,
          messagen: "Username already exist",
        },
      });
    }

    if (emailExist) {
      return res.status(400).json({
        status: {
          code: 400,
          messagen: "Email already used",
        },
      });
    }

    const hash = await bcrypt.hash(newUser.password, 16);

    const user = await prisma.user.create({
      data: {
        username: newUser.username,
        password: hash,
        email: newUser.email,
      },
    });

    res.status(201).json({
      status: {
        code: 201,
        message: "Success",
      },
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      status: {
        code: 500,
        message: error.message,
      },
    });
  }
}

async function login(req, res) {
  try {
    const { username, email, password } = req.body;

    const users = await prisma.user.findMany({
      where: {
        OR: [{ username: username }, { email: email }],
      },
    });

    const user = users.length > 0 ? users[0] : null;

    if (!user) {
      return res.status(401).json({
        status: {
          code: 401,
          message: "User or Email not found",
        },
      });
    }

    const passValidation = await bcrypt.compare(password, user.password);
    if (!passValidation) {
      return res.status(401).json({
        status: {
          code: 401,
          message: "Invalid password",
        },
      });
    }

    if (user.userStatus === false) {
      return res.status(401).json({
        status: {
          code: 401,
          message: "This User is blocked",
        },
      });
    }

    const access_token = jwt.sign(
      { id: user.id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    const refresh_token = jwt.sign(
      { id: user.id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    await prisma.user.update({
      where: { id: user.id },
      data: {
        refresh_token: refresh_token,
        lastLoginAt: new Date(),
      },
    });

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
  } catch (error) {
    res.status(500).json({
      status: {
        code: 500,
        message: error.message,
      },
    });
  }
}

async function logout(req, res) {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      return res.status(400).json({
        status: {
          code: 400,
          message: "Refresh token is required",
        },
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        refresh_token: refresh_token,
      },
    });

    if (!user) {
      return res.status(403).json({
        status: {
          code: 403,
          message: "Invalid refresh token",
        },
      });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { refresh_token: null },
    });

    res.json({
      status: {
        code: 200,
        message: "Logout successful",
      },
    });
  } catch (error) {
    res.status(500).json({
      status: {
        code: 500,
        message: error.message,
      },
    });
  }
}

async function refresh(req, res) {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      return res.status(400).json({
        status: {
          code: 400,
          message: "Refresh token is required",
        },
      });
    }

    const decodedToken = jwt.verify(
      refresh_token,
      process.env.REFRESH_TOKEN_SECRET
    );
    const userId = decodedToken?.id;

    if (!userId) {
      return res.status(403).json({
        status: {
          code: 403,
          message: "Refresh token has expired or is invalid",
        },
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user || user.refresh_token !== refresh_token) {
      return res.status(403).json({
        status: {
          code: 403,
          message: "Invalid refresh token",
        },
      });
    }

    const access_token = jwt.sign(
      { id: user.id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    res.json({
      status: {
        code: 200,
        message: "Token refreshed successfully",
      },
      data: {
        access_token: access_token,
        refresh_token: refresh_token,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: {
        code: 500,
        message: error.message,
      },
    });
  }
}

async function sendEmailVerify(req, res) {
  try {
    const { email } = req.body;
    const accessToken = OAuth2_client.getAccessToken();

    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      return res.status(404).json({
        status: {
          code: 404,
          message: "Email not found",
        },
      });
    }

    const token = jwt.sign(
      { email: user.email, userId: user.id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.GOOGLE_USER,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      from: process.env.GOOGLE_USER,
      to: email,
      subject: "Verify Your Email Address",
      html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #555;">Welcome to Our Service!</h2>
        <p>Thank you for signing up. We're excited to have you on board. To complete your registration and start using our services, we need to verify your email address.</p>
        <p>Please click the button below to verify your email address:</p>
        <a href="https://43207vdf-3000.asse.devtunnels.ms/api/verify-email?token=${token}" style="background-color: #007BFF; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email</a>
        <p>If the button above doesn't work, copy and paste the following link into your browser:</p>
        <p><a href="https://43207vdf-3000.asse.devtunnels.ms/verify-email?token=${token}">https://43207vdf-3000.asse.devtunnels.ms/api/verify-email?token=${token}</a></p>
        <p>If you didn't create this account, please ignore this email. If you have any questions, feel free to contact our support team.</p>
        <p>Best regards,</p>
        <p><strong>The Support Team</strong></p>
      </div>
      `,
    };

    transport.sendMail(mailOptions, function (error, result) {
      if (error) {
        res.status(500).json({
          code: 500,
          message: "Error sending email",
          error: error.message,
        });
      } else {
        res.status(200).json({
          status: {
            code: 200,
            message: "Email sent successfully",
          },
          data: {
            email: email,
            username: user.username,
            userId: user.id,
          },
        });
      }
      transport.close();
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function verifyEmail(req, res) {
  try {
    const { token } = req.query;
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return res.status(404).json({
        status: {
          code: 404,
          message: "User not found",
        },
      });
    }

    await prisma.user.update({
      where: { id: decoded.userId },
      data: { isEmailValid: true },
    });

    res.status(200).json({
      status: {
        code: 200,
        message: "Email successfully verified",
      },
    });
  } catch (error) {
    res.status(400).json({
      status: {
        code: 400,
        message: "Invalid or expired token",
      },
    });
  }
}

module.exports = UserController;
