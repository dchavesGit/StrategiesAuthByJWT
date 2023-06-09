import mongoose from "mongoose";
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
    const cart = await cartModel.find({ _id: id });
    if (cart) return cart;
    console.error("Not found.");
  };
  updateCart = async (id, productId, quantity) => {
    const productDefault = {
      product: productId,
      quantity: quantity,
    };
    const cart = await cartModel.findOne({ _id: id });
    const cartProducts = cart.products;
    if (!cart) {
      console.log("No se encontro el carrito a actualizar.");
      return;
    }
    const cartProduct = cartProducts.find((p) => p.product === productId);
    if (!cartProduct) {
      cartProducts.push(productDefault);
    } else {
      // cartProducts.forEach((p) => {
      //   if (productId === p.product) {
      //     p.quantity++;
      //   }
      // });
      cartProduct.quantity += quantity;
    }
    return await cartModel.updateOne({ _id: id }, cart);
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
