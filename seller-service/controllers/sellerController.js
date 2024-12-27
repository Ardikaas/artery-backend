const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const sellerController = {
  getAllStore,
  createStore,
  addStoreProduct,
  addOrder,
  HistoryOrder,
};

async function getAllStore(req, res) {
  try {
    const { page = 1, limit = 10 } = req.query;
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;

    const stores = await prisma.store.findMany({
      skip,
      take: limitNumber,
    });

    const totalStores = await prisma.store.count();
    const totalPages = Math.ceil(totalStores / limitNumber);

    res.status(200).json({
      status: {
        code: 200,
        message: "Success",
      },
      data: stores,
      pagination: {
        currentPage: pageNumber,
        totalPages,
        totalStores,
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

async function createStore(req, res) {
  try {
    const store = req.body;

    if (!store.store_name || !store.store_address) {
      return res.status(400).json({
        status: {
          code: 400,
          message: "Invalid input: store_name and store_address are required",
        },
      });
    }

    const nameExist = await prisma.store.findFirst({
      where: {
        store_name: {
          equals: store.store_name,
          mode: "insensitive",
        },
      },
    });

    if (nameExist) {
      return res.status(400).json({
        status: {
          code: 400,
          message: "Store name already exist",
        },
      });
    }

    const data = await prisma.store.create({
      data: {
        store_name: store.store_name,
        store_address: store.store_address,
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

async function addStoreProduct(req, res) {
  try {
    const store_id = req.params.id;
    const { product_id } = req.body;

    const store = await prisma.store.findUnique({
      where: { id: store_id },
      select: { product_id: true },
    });

    if (!store) {
      return res.status(404).json({
        status: {
          code: 404,
          message: "Store not found",
        },
      });
    }

    const currentProducts = Array.isArray(store.product_id)
      ? store.product_id
      : [];

    if (currentProducts.includes(product_id)) {
      return res.status(400).json({
        status: {
          code: 400,
          message: "Product already exists in the store",
        },
      });
    }
    const updatedProducts = [...currentProducts, product_id];

    const updatedStore = await prisma.store.update({
      where: { id: store_id },
      data: {
        product_id: updatedProducts,
      },
    });

    res.status(200).json({
      status: {
        code: 200,
        message: "Store products updated successfully",
      },
      data: updatedStore,
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

async function addOrder(req, res) {
  try {
    const store_id = req.params.id;
    const { active_order_id } = req.body;

    const store = await prisma.store.findUnique({
      where: { id: store_id },
      select: { active_order_id: true },
    });

    if (!store) {
      return res.status(404).json({
        status: {
          code: 404,
          message: "Store not found",
        },
      });
    }

    const currentActiveOrder = Array.isArray(store.active_order_id)
      ? store.active_order_id
      : [];

    if (currentActiveOrder.includes(active_order_id)) {
      return res.status(400).json({
        status: {
          code: 400,
          message: "Product already exists in the store",
        },
      });
    }
    const updatedActiveOrder = [...currentActiveOrder, active_order_id];

    const updatedStore = await prisma.store.update({
      where: { id: store_id },
      data: {
        active_order_id: updatedActiveOrder,
      },
    });

    res.status(200).json({
      status: {
        code: 200,
        message: "Store products updated successfully",
      },
      data: updatedStore,
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

async function HistoryOrder(req, res) {
  try {
    const store_id = req.params.id;
    const { history_order_id } = req.body;

    const store = await prisma.store.findUnique({
      where: { id: store_id },
      select: { history_order_id: true },
    });

    if (!store) {
      return res.status(404).json({
        status: {
          code: 404,
          message: "Store not found",
        },
      });
    }

    const currentHistoryOrder = Array.isArray(store.history_order_id)
      ? store.history_order_id
      : [];

    if (currentHistoryOrder.includes(history_order_id)) {
      return res.status(400).json({
        status: {
          code: 400,
          message: "Product already exists in the store",
        },
      });
    }
    const updatedHistoryOrder = [...currentHistoryOrder, history_order_id];

    const updatedStore = await prisma.store.update({
      where: { id: store_id },
      data: {
        history_order_id: updatedHistoryOrder,
      },
    });

    res.status(200).json({
      status: {
        code: 200,
        message: "Store products updated successfully",
      },
      data: updatedStore,
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

module.exports = sellerController;
