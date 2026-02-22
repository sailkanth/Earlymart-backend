import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: Number,
    }
  ],
  amount: Number,
  status: String,
  paymentId: String,
  orderId: String,
  address: Object
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
