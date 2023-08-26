import cartModel from "../models/carts.model.js";

export default class CartManager {
  constructor() {
    console.log("Working with Carts in MONGO DB");
  }

  getAll = async () => {
    return await cartModel.find();
  };

  addCart = async () => {
    const cart = {
      products: [],
    };
    return await cartModel.create(cart);
  };

  getCartById = async (id) => {
    const cart = await cartModel
      .findOne({ _id: id })
      .populate("products.product");
    if (cart) return cart;
    console.error("Not found.");
  };

  updateCart = async (id, productId, quantity) => {
    const productDefault = {
      product: productId,
      quantity: quantity,
    };

    let cart = await cartModel.findOne({ _id: id });
    if (!cart) {
      console.log("No se encontro el carrito a actualizar.");
      return;
    } else {
      console.log(cart);
      const cartProducts = cart.products;
      const cartProduct = cartProducts.find(
        (p) => p.product.toString() === productId
      );
      if (!cartProduct) {
        cart = await cartModel.updateOne(
          { _id: id },
          { $push: { products: productDefault } }
        );
      } else {
        cart = await cartModel.updateOne(
          { _id: id, "products.product": productId },
          { $inc: { "products.$.quantity": 1 } }
        );
      }
      return cart;
    }
  };

  deleteCart = async (id) => {
    return await cartModel.deleteOne({ _id: id });
  };

  emptyCart = async (id) => {
    const cart = await cartModel.findOne({ _id: id });
    cart.products = [];
    return await cartModel.updateOne({ _id: id }, cart);
  };

  removeProduct = async (id, productId) => {
    const cart = await cartModel.findOne({ _id: id });
    cart.products = cart.products.filter((p) => p.id !== productId);
    return await cartModel.updateOne({ _id: id }, cart);
  };

  updateProducts = async (id, products) => {
    const cart = await cartModel.findOne({ _id: id });
    cart.products = products;
    return await cartModel.updateOne({ _id: id }, cart);
  };
}
