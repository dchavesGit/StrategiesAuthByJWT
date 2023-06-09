import { Router } from "express";
import CartManager from "../dao/dbManagers/CartManager.js";

const router = Router();

const cartManager = new CartManager();

router.post("/", async (req, res) => {
  const cart = await cartManager.addCart();
  res.send({ status: "success", payload: cart });
});

router.get("/:cid", async (req, res) => {
  const cid = Number(req.params.cid);
  const cartSelected = await cartManager.getCartById(cid);
  res.send({ status: "success found", payload: cartSelected });
});

router.put("/:cid/product/:pid", async (req, res) => {
  const productId = Number(req.params.pid);
  const productQuantity = Number(req.body.quantity);
  const cartId = Number(req.params.cid);
  const cartSelected = await cartManager.updateCart(
    cartId,
    productId,
    productQuantity
  );
  res.send({ status: "product updated", payload: cartSelected });
});
router.delete("/:cid/product/:pid", async (req, res) => {
  const productId = Number(req.params.pid);
  const cartId = Number(req.params.cid);
  await cartManager.removeProduct(cartId, productId);
  res.send({ status: "deletion success" });
});
router.put("/:cid", async (req, res) => {
  const cartId = Number(req.params.cid);
  const products = req.body.map((p) => {
    p.product, p.quantity;
  });
  const cart = await cartManager.updateProducts(cartId, products);
  res.send({ status: "cart updated", payload: cart });
});
router.delete("/:cid", async (req, res) => {
  const cartId = Number(req.params.cid);
  const cart = await cartManager.emptyCart(cartId);
  res.send({ status: "cart emptied", payload: cart });
});
export default router;
