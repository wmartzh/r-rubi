const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const Joi = require("joi");


const createOrderSchema = Joi.object({

})

const getAll = async (req, res) => {
  try {
    let orders = await prisma.order.findMany();
    if (orders.length == 0) {
      throw { code: 404, message: { Reg404: "There is no registers" } };
    }
    res.json(orders);
  } catch (error) {
    if (error.code) {
      res.status(error.code).json(error.json);
    } else {
      res.status(500).json({
        ServerError: error,
      });
    }
  }
};
const create = async (req, res) => {
  try {
      


  } catch (error) {
    
  }
};
module.exports = {
  getAll,
  create
};
