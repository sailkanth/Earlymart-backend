import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  password: String,
  role: { type: String, default: "USER" },
  address: [
    {
      label: String,
      fullAddress: String,
      pincode: String,
      city: String,
      state: String,
    }
  ]
});

export default mongoose.model("User", userSchema);
