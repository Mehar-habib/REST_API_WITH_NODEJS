import multer from "multer";
import path from "path";
import CustomerErrorHandler from "../services/CustomErrorHandler";
import Joi from "joi";
import fs from "fs";
import { Product } from "../models";
import ProductSchema from "../validators/productValidator";

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

  //   ! update section
  async update(req, res, next) {
    handleMultiPartData(req, res, async (err) => {
      if (err) {
        return next(CustomerErrorHandler.uploadingFileError(err.message));
      }
      let filePath;
      if (req.file) {
        filePath = req.file.path;
      }
      // ! validation
      const { error } = ProductSchema.validate(req.body);
      if (error) {
        // !deleting file error
        if (req.file) {
          fs.unlink(`${appRoot}/${filePath}`, (err) => {
            if (err) {
              return next(CustomerErrorHandler.uploadingFileError(err.message));
            }
          });
        }
        return next(error);
      }
      const { name, price, size } = req.body;
      let document;
      try {
        document = await Product.findOneAndUpdate(
          { _id: req.params.id }, //! Dynamic get data
          {
            name,
            price,
            size,
            ...(req.file && { image: filePath }), //! if file path included
          },
          { new: true }
        ); //! get update/fresh data
      } catch (error) {
        return next(error);
      }
      res.status(200).json(document);
    });
  },

  // todo ==> delete Product
  async destroy(req, res, next) {
    const document = await Product.findOneAndRemove({ _id: req.params.id });
    if (!document) {
      return next(new Error("Nothing to delete!"));
    }
    // ! Delete image in database
    const imagePath = document._doc.image;
    fs.unlink(`${appRoot}/${imagePath}`, (err) => {
      if (err) {
        return next(CustomerErrorHandler.uploadingFileError());
      }
    });
    res.status(200).json(document);
  },

  //   ! Get all Products
  async index(req, res, next) {
    let document;
    try {
      document = await Product.find()
        .select("-updatedAt -__v")
        .sort({ _id: -1 });
    } catch (error) {
      return next(error);
    }
    res.json(document);
  },

  //   ! get Single Product
  async show(req, res, next) {
    let document;
    try {
      document = await Product.findOne({ _id: req.params.id }).select(
        "-updatedAt -__v"
      );
    } catch (error) {
      return next(error);
    }
    res.json(document);
  },
};
export default productController;
