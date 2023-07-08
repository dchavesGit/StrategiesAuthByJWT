import passport from "passport";
import local from "passport-local";
import userModel from "../dao/models/users.model.js";
import { isValidPassword, createHash } from "../utils.js";
import GitHubStrategy from "passport-github2";

const localStrategy = local.Strategy;

const initializePassport = () => {
  //passport como tal, es un middleware
  passport.use(
    "register",
    new localStrategy(
      {
        passReqToCallback: true, //permite acceder al objeto request como cuaqluier otro middleware
        usernameField: "email", //define porque parametro quiero hacer el filtrado o la autorizacion
      },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        console.log(first_name);
        try {
          const user = await userModel.findOne({ email: username });
          console.log(user);
          if (user) {
            return done(null, false);
          }
          const userToSave = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
          };
          const result = await userModel.create(userToSave);
          return done(null, result);
        } catch (error) {
          return done(`Error al obtener el usuario: ${error}`);
        }
      }
    )
  );
  passport.use(
    "login",
    new localStrategy(
      {
        usernameField: "email", //define porque parametro quiero hacer el filtrado o la autorizacion
      },
      async (username, password, done) => {
        console.log(username, password);
        try {
          const user = await userModel.findOne({ email: username });
          console.log(user);
          if (!user) {
            return done(null, false);
          }
          if (!isValidPassword(user, password)) return done(null, false);
          return done(null, user);
          //req.user este si todo sale bien, retorna un req.user al session.router, donde va a desenvolver la peticion
        } catch (error) {
          return done(`Error al obtener el usuario: ${error}`);
        }
      }
    )
  );

  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: "Iv1.31559329479768af",
        clientSecret: "55a7350619e8043c3480e1d0a8adf78c6927b99e",
        callbackURL: "http://localhost:8080/user/github-callback",
        scope: ["user:email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails[0].value;
          const user = await userModel.findOne({ email });
          if (!user) {
            const newUser = {
              first_name: profile._json.name,
              last_name: "",
              age: 18,
              email,
              password: "",
            };

            const result = await userModel.create(newUser);
            done(null, result);
          } else {
            done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await userModel.findById(id);
    done(null, user);
  });
};
export default initializePassport;
