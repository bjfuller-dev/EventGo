const mongoose = require("mongoose");

const eventDetailsSchema = new mongoose.Schema(
  {
    creator: String,
    name: { type: String, unique: true },
    description: String,
    start: Date,
    repeat: Boolean,
    location: String,
    open: String,
    close: String,
    fee: Number,
    max: Number,
    event: Number,
    registered: [String],
    request: [String],
    payment: [String],
    attend: [String],
  },
  {
    collection: "eventDetails",
  }
);
mongoose.model("eventDetails", eventDetailsSchema);