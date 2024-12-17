const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const productController = {
  getAllProduct,
  getProductById,
  createProduct,
  updateProductById,
  deleteProduct,
};

async function getAllProduct(req, res) {
  try {
    const { page = 1, limit = 10, category } = req.query;
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    const skip = (pageNumber - 1) * limitNumber;
    const whereCondition = category ? { product_category: category } : {};

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

    const data = await prisma.product.create({
      data: {
        product_name: product.product_name,
        product_desc: product.product_desc,
        product_category: product.product_category,
        price: product.price,
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
    const { product_name, product_desc, product_category, product_img, price } =
      req.body;

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
        product_name,
        product_desc,
        product_category,
        product_img,
        price,
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

module.exports = productController;
