import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
  category: String,
  price: Number,
  mrp: Number,
  stock: Number,
  rating: Number,
  isFeatured: Boolean,
});

export default mongoose.model("Product", productSchema);
