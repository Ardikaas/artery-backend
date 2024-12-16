const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const productController = {
  getAllProduct,
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

module.exports = productController;
