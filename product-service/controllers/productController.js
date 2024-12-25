const { PrismaClient } = require("@prisma/client");
const Fuse = require("fuse.js");

const prisma = new PrismaClient();
const productController = {
  getAllProduct,
  getProductById,
  createProduct,
  updateProductById,
  deleteProduct,
  searchProduct,
};

async function getAllProduct(req, res) {
  try {
    const { page = 1, limit = 10, type } = req.query;
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    const skip = (pageNumber - 1) * limitNumber;
    const whereCondition = type ? { type: type } : {};

    const products = await prisma.product.findMany({
      where: whereCondition,
      skip: skip,
      take: limitNumber,
    });

    const totalProducts = await prisma.product.count({
      where: whereCondition,
    });

    const totalPages = Math.ceil(totalProducts / limitNumber);

    res.status(200).json({
      status: {
        code: 200,
        message: "Success",
      },
      data: products,
      pagination: {
        currentPage: pageNumber,
        totalPages: totalPages,
        totalProducts: totalProducts,
        limit: limitNumber,
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

async function getProductById(req, res) {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: {
        id: id,
      },
    });

    if (!product) {
      return res.status(401).json({
        status: {
          code: 401,
          message: `Cannot find any product with ID ${id}`,
        },
      });
    }

    res.status(200).json({
      status: {
        code: 200,
        message: "Success",
      },
      data: product,
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

async function createProduct(req, res) {
  try {
    const product = req.body;

    if (!product.name || !product.type || !product.price || !product.stock) {
      return res.status(400).json({
        status: {
          code: 400,
          message: "Invalid input: name, type, price, and stock are required",
        },
      });
    }

    const data = await prisma.product.create({
      data: {
        name: product.name,
        process: product.process,
        type: product.type,
        taste_note: product.taste_note,
        body_level: product.body_level,
        acid_level: product.acid_level,
        price: product.price,
        stock: product.stock,
        coffe_img: product.coffe_img,
        shop_id: product.shop_id || 123,
        shop_name: product.shop_name,
        shop_img: product.shop_img || "https://defaultimg",
      },
    });

    res.status(200).json({
      status: {
        code: 200,
        message: "Success",
      },
      data: data,
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

async function updateProductById(req, res) {
  try {
    const { id } = req.params;
    const {
      name,
      process,
      type,
      taste_note,
      body_level,
      acid_level,
      price,
      stock,
      coffe_img,
      shop_name,
      shop_img,
    } = req.body;

    const existingProduct = await prisma.product.findUnique({
      where: {
        id: id,
      },
    });

    if (!existingProduct) {
      return res.status(404).json({
        status: {
          code: 404,
          message: `Cannot find any product with ID ${id}`,
        },
      });
    }

    const updatedProduct = await prisma.product.update({
      where: {
        id: id,
      },
      data: {
        name: name || existingProduct.name,
        process: process || existingProduct.process,
        type: type || existingProduct.type,
        taste_note: taste_note || existingProduct.taste_note,
        body_level: body_level || existingProduct.body_level,
        acid_level: acid_level || existingProduct.acid_level,
        price: price || existingProduct.price,
        stock: stock || existingProduct.stock,
        coffe_img: coffe_img || existingProduct.coffe_img,
        shop_name: shop_name || existingProduct.shop_name,
        shop_img: shop_img || existingProduct.shop_img,
      },
    });

    res.status(200).json({
      status: {
        code: 200,
        message: "Product updated successfully",
      },
      data: updatedProduct,
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

async function deleteProduct(req, res) {
  const { id } = req.params;

  try {
    const product = await prisma.product.findUnique({
      where: { id: id },
    });

    if (!product) {
      return res.status(401).json({
        status: {
          code: 401,
          message: `Cannot find any product with ID ${id}`,
        },
      });
    }

    await prisma.product.delete({
      where: { id: id },
    });

    res.status(200).json({
      status: {
        code: 200,
        message: "Product deleted successfully",
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

async function searchProduct(req, res) {
  try {
    const { search, page = 1, limit = 10, threshold = 0.3 } = req.query;
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    const products = await prisma.product.findMany();

    const options = {
      includeScore: true,
      keys: ["name", "process", "type", "taste_note"],
    };

    const fuse = new Fuse(products, options);
    const results = fuse.search(search);

    const relevantProducts = results
      .filter((result) => result.score <= threshold)
      .map((result) => result.item);

    const totalProducts = relevantProducts.length;
    const totalPages = Math.ceil(totalProducts / limitNumber);

    const startIndex = (pageNumber - 1) * limitNumber;
    const paginatedResults = relevantProducts.slice(
      startIndex,
      startIndex + limitNumber
    );

    res.status(200).json({
      status: {
        code: 200,
        message: "Success",
      },
      data: paginatedResults,
      pagination: {
        currentPage: pageNumber,
        totalPages: totalPages,
        totalProducts: totalProducts,
        limit: limitNumber,
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

module.exports = productController;
