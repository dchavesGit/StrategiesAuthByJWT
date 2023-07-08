import express from "express";
import productsRouter from "./routes/productsManager.routes.js";
import cartsRouter from "./routes/cartsManager.routes.js";
import mongoose from "mongoose";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import viewsRouter from "./routes/views.router.js";
import sessionRouter from "./routes/session.router.js";
import MongoStore from "connect-mongo";
import session from "express-session";
import initializePassport from "./config/passport.config.js";
import passport from "passport";

const app = express();

try {
  await mongoose.connect(
    "mongodb+srv://dchaves:Pirulo123@cluster39760dc.ozdm3aq.mongodb.net/SegundaEntrega?retryWrites=true&w=majority"
  );
  console.log("DB connected");
} catch (error) {
  console.log(error);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(`${__dirname}/public`));
app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

app.use(
  session({
    store: MongoStore.create({
      client: mongoose.connection.getClient(), //Aca conecto con el cliente ya iniciado de vuelta la DB, para que no haga un RElogueo
      ttl: 3600, //esto se tiene que especificar y es que  estamos usando la nueva nomenclatura de conexion mongo
    }),
    secret: "Coder39760", //autentica la session del usuario mediante la clave
    resave: true, //cuando no hubo actividad en la pagina web, no cierra la sesion
    saveUninitialized: true,
  })
);

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/user", sessionRouter);

app.listen(8080, () => console.log("Listening server on port 8080"));
