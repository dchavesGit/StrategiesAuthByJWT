import { Router } from "express";
import CartManager from "../dao/dbManagers/CartManager.js";

const router = Router();

const cartManager = new CartManager();

router.post("/", async (req, res) => {
  try {
    const cart = await cartManager.addCart();
    res.send({ status: "success", payload: cart });
  } catch (error) {
    res.status(400).send({ status: "Error, cannot creat cart", error: error });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const cartSelected = await cartManager.getCartById(cid);
    res.send({ status: "success found", payload: cartSelected });
  } catch (error) {
    res.status(400).send({ status: "Error, cannot found cart", error: error });
  }
});

router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const productId = req.params.pid;

    const productQuantity = Number(Object.values(req.body));

    const cartId = req.params.cid;

    const cartSelected = await cartManager.updateCart(
      cartId,
      productId,
      productQuantity
    );
    res.send({ status: "product updated", payload: cartSelected });
  } catch (error) {
    res.status(400).send({ status: "Error, cannot update cart", error: error });
  }
});
router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const productId = req.params.pid;
    const cartId = req.params.cid;
    await cartManager.removeProduct(cartId, productId);
    res.send({ status: "deletion success" });
  } catch (error) {
    res.status(400).send({ status: "Error, cannot delete cart", error: error });
  }
});
router.put("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const products = req.body.map((p) => {
      p.product, p.quantity;
    });
    const cart = await cartManager.updateProducts(cartId, products);
    res.send({ status: "cart updated", payload: cart });
  } catch (error) {
    res.status(400).send({ status: "Error, modify cart", error: error });
  }
});
router.delete("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await cartManager.emptyCart(cartId);
    res.send({ status: "cart emptied", payload: cart });
  } catch (error) {
    res.send(400).send({ status: "Error, emptied cart", error: error });
  }
});
export default router;
