import express from "express";
import helmet from "helmet";
import cors from "cors";
import convertRoute from "./routes/convert.routes.js";

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN
}));
app.use(helmet());
app.use(express.json({limit: "16kb"}));
app.use(express.static("public"));

app.use("/api/v1", convertRoute);

export { app }