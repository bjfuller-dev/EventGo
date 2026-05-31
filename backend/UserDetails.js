const mongoose = require("mongoose");

const userDetailsSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    joined: [String],
    owned: [String],
  },
  {
    collection: "userInfo",
  }
);
mongoose.model("userInfo", userDetailsSchema);