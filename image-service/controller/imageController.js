const multer = require("multer");
const path = require("path");
const fs = require("fs");

const allowedFileTypes = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/svg+xml",
  "image/raw",
];

const createStorage = (folder) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = `./uploads/${folder}`;

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const name = req.body.name || Date.now();
      cb(null, name + path.extname(file.originalname));
    },
  });
};

const fileFilter = (req, file, cb) => {
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    req.fileValidationError = {
      status: {
        code: 400,
        message:
          "File type not accepted. Please upload a file in jpg, png, jpeg, svg, or raw format.",
      },
    };
    cb(null, false);
  }
};

const uploadProduct = multer({
  storage: createStorage("product_images"),
  fileFilter: fileFilter,
  limits: { fileSize: 35 * 1024 * 1024 },
});

const uploadUser = multer({
  storage: createStorage("user_images"),
  fileFilter: fileFilter,
  limits: { fileSize: 35 * 1024 * 1024 },
});

const uploadStore = multer({
  storage: createStorage("store_images"),
  fileFilter: fileFilter,
  limits: { fileSize: 35 * 1024 * 1024 },
});

async function uploadProductImage(req, res) {
  try {
    if (req.fileValidationError) {
      return res.status(400).json(req.fileValidationError);
    }

    if (!req.file) {
      return res.status(400).json({
        status: {
          code: 400,
          message: "There is no file uploaded",
        },
      });
    }

    const filePath = `https://43207vdf-8080.asse.devtunnels.ms/img/product_images/${req.file.filename}`;

    res.status(200).json({
      status: {
        code: 200,
        message: "Image uploaded successfully",
        filePath: filePath,
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

async function uploadUserProfileImage(req, res) {
  try {
    if (req.fileValidationError) {
      return res.status(400).json(req.fileValidationError);
    }

    if (!req.file) {
      return res.status(400).json({
        status: {
          code: 400,
          message: "There is no file uploaded",
        },
      });
    }

    const filePath = `https://43207vdf-8080.asse.devtunnels.ms/img/user_images/${req.file.filename}`;

    res.status(200).json({
      status: {
        code: 200,
        message: "Image uploaded successfully",
        filePath: filePath,
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

async function uploadStoreProfileImage(req, res) {
  try {
    if (req.fileValidationError) {
      return res.status(400).json(req.fileValidationError);
    }

    if (!req.file) {
      return res.status(400).json({
        status: {
          code: 400,
          message: "There is no file uploaded",
        },
      });
    }

    const filePath = `https://43207vdf-8080.asse.devtunnels.ms/img/store_images/${req.file.filename}`;

    res.status(200).json({
      status: {
        code: 200,
        message: "Image uploaded successfully",
        filePath: filePath,
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

async function getImage(req, res) {
  try {
    const { type, filename } = req.params;
    const filePath = path.join(__dirname, "../uploads", type, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        status: {
          code: 404,
          message: "Image not found",
        },
      });
    }

    res.sendFile(filePath);
  } catch (error) {
    res.status(500).json({
      status: {
        code: 500,
        message: error.message,
      },
    });
  }
}

module.exports = {
  uploadProduct: uploadProduct.single("image"),
  uploadUser: uploadUser.single("image"),
  uploadStore: uploadStore.single("image"),
  uploadProductImage,
  uploadUserProfileImage,
  uploadStoreProfileImage,
  getImage,
};
