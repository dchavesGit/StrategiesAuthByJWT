import productModel from "../models/products.model.js";

export default class ProductManager {
  constructor() {
    console.log("Working on DB with products");
  }
  getAll = async () => {
    return await productModel.find();
  };
  addProduct = async (
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnail
  ) => {
    const product = {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnail,
    };
    const checkFieldsAreValids = (product) => {
      let isValid = true;
      // Object.keys(product) devuelve un array con las claves del objeto
      const objKeys = Object.keys(product);
      // Recorremos el array de claves
      objKeys.forEach((key) => {
        // Si el valor de la clave es falsy, es decir, no tiene valor, mostramos un mensaje de error
        if (!product[key]) {
          console.log(`El campo ${key} es obligatorio.`);
          // Cambiamos el valor de la variable isValid a false
          isValid = false;
        }
      });
      return isValid;
    };
    if (!checkFieldsAreValids(product)) {
      console.log("All fields are necesary");
      return;
    }
    let products = await productModel.find({ code: code }).lean();
    if (products.lenght > 0) {
      throw console.log(
        `The code ${code} was alrady in use, please check the field code again.`
      );
    }
    return await productModel.create(product);
  };
  updateProduct = async (id, update) => {
    return await productModel.updateOne({ _id: id }, update);
  };
  deleteProduct = async (id) => {
    return await productModel.deleteOne({ _id: id });
  };
  getProductById = async (id) => {
    const product = await productModel.findOne({ _id: id });

    if (product) return product;

    console.error("Not found.");
  };
  paginate = async (query, pagination) => {
    return await productModel.paginate(query, pagination);
  };
}
