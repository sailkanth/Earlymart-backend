import { gql } from "apollo-server-express";

export const typeDefs = gql`

  type User {
    id: ID!
    name: String
    phone: String
    email: String
    role: String
    address: [Address]
  }

  type Address {
    label: String
    fullAddress: String
    pincode: String
    city: String
    state: String
  }

  type Product {
    id: ID!
    name: String
    image: String
    description: String
    category: String
    price: Float
    mrp: Float
    stock: Int
    rating: Float
    isFeatured: Boolean
  }

  type CartItem {
    productId: ID
    quantity: Int
  }

  type Cart {
    id: ID!
    userId: ID!
    items: [CartItem]
  }

  type OrderItem {
    product: ID
    quantity: Int
  }

  type Order {
    id: ID!
    userId: ID!
    items: [OrderItem]
    amount: Float
    status: String
    paymentId: String
    orderId: String
    address: Address
  }

  type PaymentResponse {
    orderId: String
    amount: Float
    currency: String
  }

  input AddressInput {
    label: String
    fullAddress: String
    pincode: String
    city: String
    state: String
  }

  input OrderInput {
    product: ID
    quantity: Int
  }

  type Query {
    getProducts: [Product]
    getProduct(id: ID!): Product
    getCart: Cart
    getOrders: [Order]
    me: User
  }

  type Mutation {
    register(name: String!, phone: String!, email: String, password: String!): String
    login(phone: String!, password: String!): String

    addAddress(address: AddressInput!): User

    addToCart(productId: ID!, quantity: Int!): Cart
    removeFromCart(productId: ID!): Cart

    createRazorpayOrder(amount: Float!): PaymentResponse
    verifyPayment(orderId: String!, paymentId: String!, signature: String!): String

    placeOrder(items: [OrderInput], address: AddressInput!, amount: Float!): Order
  }
`;
