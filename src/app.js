import express from "express";
import productsRouter from "./routes/productsManager.routes.js";
import cartsRouter from "./routes/cartsManager.routes.js";
import mongoose from "mongoose";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import viewsRouter from "./routes/views.router.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(`${__dirname}/public`));
app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

app.use("/api/products", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
try {
  await mongoose.connect(
    "mongodb+srv://dchaves:Pirulo123@cluster39760dc.ozdm3aq.mongodb.net/SegundaEntrega?retryWrites=true&w=majority"
  );
  console.log("DB connected");
} catch (error) {
  console.log(error);
}

app.listen(8080, () => console.log("Listening server on port 8080"));
