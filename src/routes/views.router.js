import { Router } from "express";
import ProductManager from "../dao/dbManagers/ProductManager.js";
import CartManager from "../dao/dbManagers/CartManager.js";

const router = Router();

const productManager = new ProductManager();
const cartManager = new CartManager();

const SORT_ORDER = { asc: 1, desc: -1 };

//Vista Users

const publicAccess = (req, res, next) => {
  if (req.session.user) return res.redirect("/");
  next();
};
const privateAccess = (req, res, next) => {
  if (!req.session.user) return res.redirect("/user/login");
  next();
};
router.get("/user/register", publicAccess, (req, res) => {
  res.render("register");
});
router.get("/user/login", publicAccess, (req, res) => {
  res.render("login");
});

router.get("/", privateAccess, async (req, res) => {
  try {
    const { page = 1, limit = 5, sort, query, cartId } = req.query; //toma valor por defectro de este query param en uno, si es que no tiene valor
    const { docs, hasPrevPage, hasNextPage, nextPage, prevPage, totalPages } =
      await productManager.paginate(query, {
        limit,
        page,
        lean: true,
        sort: sort ? { price: SORT_ORDER[sort.toLowerCase()] } : {},
      });
    const products = docs;
    let queryParams = "?";
    if (query) queryParams += "&query=" + query;
    if (sort) queryParams += "&sort=" + sort;
    if (limit) queryParams += "&limit=" + limit;
    let prevLink = hasPrevPage ? queryParams + "&page=" + prevPage : null;
    let nextLink = hasNextPage ? queryParams + "&page=" + nextPage : null;
    res.render("products", {
      status: "success",
      totalPages,
      page,
      payload: products,
      hasPrevPage,
      hasNextPage,
      nextPage,
      prevPage,
      prevLink,
      nextLink,
      cartId,
      user: req.session.user,
    });
  } catch (error) {
    console.error(error);
  }
});

router.get("/user/reset", publicAccess, (req, res) => {
  res.render("reset");
});

router.get("/products", privateAccess, (req, res) => {
  res.render("products", { user: req.session.user });
});

router.get("/products/:pid", async (req, res) => {
  const { pid } = req.params;
  const productSelected = await productManager.getProductById(pid);
  res.render("product", productSelected.toJSON());
});

router.get("/carts/:cid", async (req, res) => {
  const { cid } = req.params;
  const cartSelected = await cartManager.getCartById(cid);
  res.render("cartSelected", cartSelected.toJSON());
});

export default router;
