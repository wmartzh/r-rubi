const { PrismaClient } = require("@prisma/client");
const { required } = require("joi");
const prisma = new PrismaClient();
const Joi = require("joi");
const { DateTime } = require("luxon");
const productSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string(),
  price: Joi.number().required(),
});
const productUpdate = Joi.object({
  name: Joi.string(),
  description: Joi.string(),
  price: Joi.number(),
});

//Get all products
const getAll = async (req, res) => {
  try {
    let products = await prisma.product.findMany();
    if (products.length == 0) {
      throw { Reg404: "There is not registers" };
    }
    res.json(products);
  } catch (error) {
    if (error.Reg404) {
      res.status(404).json({
        ServerError: error,
      });
    } else {
      res.status(500).json({
        ServerError: error,
      });
    }
  }
};
//Create a new Product
const create = async (req, res) => {
  try {
    const data = await productSchema.validateAsync(req.body);
    let products = await prisma.product.findMany();
    let newConsecutive = products.length + 1;
    data.code = `${data.name[0].toUpperCase()}-${newConsecutive}`;

    await prisma.product.create({ data: data });
    res.status(201).json({
      message: "Product was created successfully",
    });
  } catch (error) {
    if (error.details) {
      res.status(400).json(error);
    } else {
      res.status(500).json({
        ServerError: error,
      });
    }
  }
};
//Update Product
const update = async (req, res) => {
  try {
    let { productId } = req.params;

    if (productId == null || productId == undefined) {
      throw { code: 400, message: "Product ID is required" };
    }
    if (isNaN(Number(productId))) {
      throw { code: 400, message: "Product ID is not valid " };
    }

    const data = await productUpdate.validateAsync(req.body);
    data.updatedAt = DateTime.now().toISO();

    await prisma.product.update({
      where: {
        id: Number(productId),
      },
      data: data,
    });
    res.status(201).json({
      message: "Product was updated successfully",
    });
  } catch (error) {
    if (error.code === "P2025") {
      res.status(400).json({ Error: error.meta.cause });
    } else if (error.code) {
      res.status(error.code).json({ Error: error.message });
    } else {
      res.status(500).json({
        ServerError: error,
      });
    }
  }
};

module.exports = {
  create,
  getAll,
  update,
};
