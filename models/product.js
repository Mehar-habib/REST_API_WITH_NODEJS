import mongoose from "mongoose";
import { APP_URL } from "../config";
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    size: { type: String, required: true },
    image: {
      type: String,
      required: true,
      get: (image) => {
        // Complete absolute path
        // http://localhoet:5000/uploads/23542323432-324234223.png
        return `${APP_URL}/${image}`;
      },
    },
  },
  { timestamps: true, toJSON: { getters: true } } //tell the mongoose to use getter fun
);

export default mongoose.model("Product", productSchema, "products");
