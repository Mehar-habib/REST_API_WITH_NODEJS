import multer from "multer";
import path from "path";
import CustomerErrorHandler from "../services/CustomErrorHandler";
import Joi from "joi";
import fs from "fs";
import { Product } from "../models";

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    // !create unique picture name
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    //  2345345342-234234234324.png
    cb(null, uniqueName);
  },
});
const handleMultiPartData = multer({
  storage,
  limits: { fileSize: 1000000 * 5 },
}).single("image"); //!5mb & client file name 'image'

const productController = {
  async store(req, res, next) {
    //! Multipart data
    handleMultiPartData(req, res, async (err) => {
      if (err) {
        return next(CustomerErrorHandler.uploadingFileError(err.message));
      }
      //  console.log(req.file)
      const filePath = req.file.path;
      // ! validation
      const ProductSchema = Joi.object({
        name: Joi.string().required(),
        price: Joi.number().required(),
        size: Joi.string().required(),
      });
      const { error } = ProductSchema.validate(req.body);
      if (error) {
        // delete the uploaded file/image
        fs.unlink(`${appRoot}/${filePath}`, (err) => {
          if (err) {
            return next(CustomerErrorHandler.uploadingFileError(err.message));
          } //rootFolder ==>global_folder/uploads/filename.png
        });
        return next(error);
      }

      const { name, price, size } = req.body;
      let document;
      try {
        document = await Product.create({
          name,
          price,
          size,
          image: filePath,
        });
      } catch (error) {
        return next(error);
      }
      res.status(200).json({ document });
    });
  },
};
export default productController;
