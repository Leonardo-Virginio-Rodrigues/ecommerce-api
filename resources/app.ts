import express from "express";
import authRouter from "./modules/auth/auth.routes";
import { errorHandler } from "./core/http";

const app = express();
app.use(express.json());

app.use("/auth", authRouter);

app.use(errorHandler);

export default app;
