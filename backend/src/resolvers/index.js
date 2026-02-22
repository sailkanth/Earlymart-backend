import User from "../models/User.js";
import Product from "../models/Product.js";
import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import { signToken } from "../config/jwt.js";
import { razorpay } from "../config/razorpay.js";
import crypto from "crypto";

export const resolvers = {

  Query: {
    getProducts: () => Product.find(),
    getProduct: (_, { id }) => Product.findById(id),
    getCart: async (_, __, { user }) => {
      if (!user) throw new Error("Not authenticated");
      return Cart.findOne({ userId: user.id });
    },
    getOrders: async (_, __, { user }) => {
      if (!user) throw new Error("Not authenticated");
      return Order.find({ userId: user.id });
    },
    me: (_, __, { user }) => user,
  },

  Mutation: {

    // REGISTER
    register: async (_, { name, phone, email, password }) => {
      const newUser = new User({ name, phone, email, password });
      await newUser.save();
      return "User Registered";
    },

    // LOGIN
    login: async (_, { phone, password }) => {
      const user = await User.findOne({ phone });
      if (!user) throw new Error("User not found");
      if (user.password !== password) throw new Error("Incorrect password");

      return signToken(user);
    },

    // ADD ADDRESS
    addAddress: async (_, { address }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      const dbUser = await User.findById(user.id);
      dbUser.address.push(address);
      await dbUser.save();
      return dbUser;
    },

    // ADD TO CART
    addToCart: async (_, { productId, quantity }, { user }) => {
      if (!user) throw new Error("Not authenticated");

      let cart = await Cart.findOne({ userId: user.id });

      if (!cart) {
        cart = new Cart({ userId: user.id, items: [] });
      }

      const item = cart.items.find(i => i.productId == productId);

      if (item) item.quantity += quantity;
      else cart.items.push({ productId, quantity });

      await cart.save();
      return cart;
    },

    // REMOVE FROM CART
    removeFromCart: async (_, { productId }, { user }) => {
      if (!user) throw new Error("Not authenticated");

      const cart = await Cart.findOne({ userId: user.id });
      cart.items = cart.items.filter(i => i.productId != productId);
      await cart.save();
      return cart;
    },

    // RAZORPAY ORDER
    createRazorpayOrder: async (_, { amount }) => {
      const options = {
        amount: amount * 100,
        currency: "INR",
        receipt: "order_rcptid_11",
      };
      const order = await razorpay.orders.create(options);
      return { orderId: order.id, amount, currency: "INR" };
    },

    // VERIFY PAYMENT
    verifyPayment: async (_, { orderId, paymentId, signature }) => {
      const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
      hmac.update(orderId + "|" + paymentId);
      const generatedSignature = hmac.digest("hex");

      if (generatedSignature !== signature) {
        throw new Error("Payment verification failed");
      }

      return "Payment Verified";
    },

    // PLACE ORDER
    placeOrder: async (_, { items, address, amount }, { user }) => {
      if (!user) throw new Error("Not authenticated");

      const order = new Order({
        userId: user.id,
        items,
        address,
        amount,
        status: "PLACED",
      });

      await order.save();
      return order;
    },

  }
};
