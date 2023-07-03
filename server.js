import express from "express";
import { APP_PORT, DB_URL } from "./config";
import router from "./routes";
import errorHandler from "./middlewares/errorHandler";
import mongoose from "mongoose";
import path from "path";
const app = express();

// Database connection
mongoose.connect(DB_URL, {});
const db = mongoose.connection;
db.on("error", (error) => {
  console.log("error connecting db");
});
db.once("open", () => {
  console.log("DB connected...");
});

global.appRoot = path.resolve(__dirname);
//! received the multipart data
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/api", router);
app.use("/uploads", express.static("uploads")); //server the static file/images 1 uploads is url 2 is folder

app.use(errorHandler);
app.listen(APP_PORT, () => console.log(`Listening on Port ${APP_PORT}.`));
