import express from "express";
import passport from "passport";
import apiRouter from "./routers/index.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";
import { initializePassport } from "./config/passport.config.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//inicializar passport
initializePassport();
app.use(passport.initialize());


// Rutas principales
app.use('/api', apiRouter);

app.use(errorHandler);

export default app;
