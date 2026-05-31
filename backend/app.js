require("dotenv").config();
const express=require("express");
const cors = require("cors");
const app=express();
const router = express.Router();
const mongoose = require("mongoose");
app.use(express.json());
app.use(cors());
const passEncrypt = require("bcryptjs")
const jwt = require('jsonwebtoken');
const Stripe = require("stripe");

const stripe = Stripe(
  process.env.STRIPE_SECRET_KEY
);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
      console.log("Database Connected");
  })
  .catch((e) => {
      console.log(e);
  });

require('./UserDetails');
require("./EventDetails");
const User = mongoose.model("userInfo");
const Event = mongoose.model("eventDetails");


app.post('/create-payment-intent', async (req, res) => {
  const { amount, currency } = req.body; 

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount, 
      currency,
    });

    res.send({
      clientSecret: paymentIntent.client_secret, 
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});


app.post("/register", async (req, res) => {
  const { name, email, password, joined, owned } = req.body;

  const oldUser = await User.findOne({ email: email});

  if (oldUser) {
      return res.send({ data: "This email is already in use." });
  }

  const encryptedPassword = await passEncrypt.hash(password, 10);

  try {
      await User.create({
        name: name,
        email: email,
        password: encryptedPassword,
        joined: joined,
        owned: owned,
      });
      res.send({ status: "Ok.", data: "User Created." });
  }   catch (error) {
      res.send({ status: "error", data: error});
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  const oldUser = await User.findOne({ email: email });

  if (!oldUser){
      return res.send({ data: "User not found."});
  }

  if (await passEncrypt.compare(password, oldUser.password)) {
    const token = jwt.sign({ email: oldUser.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log(token);
    if (res.status(201)) {
      return res.send({ status: "Ok.", data: token });
    } else {
      return res.send({ error: "error" });
    }
  }
});

app.post("/userdetails", async (req, res) => {
  const { token } = req.body;
  try {
      const user = jwt.verify(token,process.env.JWT_SECRET);
      const userEmail = user.email;

      User.findOne({email:userEmail}).then((data) => {
          return res.send({ status: "Ok.", data: data });
      });
  } catch (error) {
      return res.send({ error: error });
  }
});

app.post("/event", async (req, res) => {
  const {
    creator,
    name,
    description,
    start,
    repeat,
    location,
    open,
    close,
    fee,
    max,
    event,
    registered,
    request,
    payment,
    attend,
  } = req.body;

  const eventExists = await Event.findOne({ name: name });

  if (eventExists) {
    return res.send({ data: "An event with this name already exists." });
  }

  try {
    await Event.create({
      creator: creator,
      name: name,
      description: description,
      start: start,
      repeat: repeat,
      location: location,
      open: open,
      close: close,
      fee: fee,
      max: max,
      event: event,
      registered: registered,
      request: request,
      payment: payment,
      attend: attend,
    });
    res.send({ status: "Ok.", data: "Event Created." });
  } catch (error) {
    return res.send({ status: "error", data: error });
  }
});


app.post("/owned", async (req, res) => {
  const { email, owned } = req.body;
  
  try {
    await User.updateOne(
      { email: email },
      {
        $push: {
          owned: owned,
        },
      }
    );
    res.send({ status: "Ok.", data: "User owned events updated." });
  } catch (error) {
    return res.send({ status: "error", data: error });
  }
});

app.get("/eventdetails/:name", async (req, res) => {
  try {
    const name1 = req.params.name;
    const event = await Event.findOne({ name: name1 });
    console.log("Received parameters:", name1);
    if (!event) {
      return res.status(403).json({ message: "Event not found" });
    } else {
      res.send({ status: "Ok.", data: event });
    }
  } catch (error) {
    console.error("Error fetching event by name:", error); // Log the error
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/eventdetails", async (req, res) => {
  try {
    const events = await Event.find({}, { name: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: "Error fetching events" });
  }
});



app.delete("/eventdetails/:name", async (req, res) => {
  try {
    const name1 = req.params.name;
    const event = await Event.findOneAndDelete({ name: name1 });
    console.log("Received parameters:", name1);
    if (!event) {
      return res.status(403).json({ message: "Event not found" });
    } else {
      res.send({ status: "Ok.", data: event });
    }
  } catch (error) {
    console.error("Error fetching event by name:", error);
    res.status(500).json({ message: "Server error" });
  }
});


app.post('/removejoined', async (req, res) => {
  const { joined } = req.body;
  console.log("Received joined parameters:", joined);
  if (!joined) {
    return res.status(400).send({ error: "Event name is required" });
  }
  try {
    const result = await User.updateMany(
      { joined: joined }, 
      { $pull: { joined: joined } } 
    );

    if (result.modifiedCount > 0) {
      res.send({ message: `${result.modifiedCount} user(s) updated successfully` });
    } else {
      res.send({ message: 'No users found with the specified event in their joined list' });
    }
  } catch (error) {
    console.error('Error updating users:', error);
    res.status(500).send({ error: 'An error occurred while removing the event' });
  }
});



app.delete("/owned/:email/:owned", async (req, res) => {
  try {
    const email = req.params.email;
    const owned = req.params.owned;
    console.log("Received parameters:", email, owned);
    await User.findOneAndUpdate(
      { email: email },
      {
        $pull: {
          owned: owned,
        },
      }
    );
    res.send({ status: "Ok.", data: "User owned events updated." });
  } catch (error) {
    return res.send({ status: "error", data: error });
  }
});

app.post("/eventjoin", async (req, res) => {
  const { name, request } = req.body;
  console.log("Received parameters:", name, request);
  try {
    await Event.updateOne(
      { name: name },
      {
        $push: {
          request: request,
        },
      }
    );
    res.send({ status: "Ok.", data: "Event join request successful." });
  } catch (error) {
    return res.send({ status: "error", data: error });
  }
});

app.post("/eventapprove", async (req, res) => {
  const { name, registered } = req.body;
  try {
    await Event.updateOne(
      { name: name },
      {
        $push: {
          registered: registered,
        },
      }
    );
    res.send({ status: "Ok.", data: "Membership request successfully approved." });
  } catch (error) {
    return res.send({ status: "error", data: error });
  }
});

app.post("/eventforward", async (req, res) => {
  const { name, event } = req.body;
  console.log("Received parameters:", name, event);
  try {
    await Event.updateOne(
      { name: name },
      {
        $push: {
          event: event,
        },
      }
    );
    res.send({ status: "Ok.", data: "Event week moved forward" });
  } catch (error) {
    return res.send({ status: "error", data: error });
  }
});


app.delete("/event/:name/:request", async (req, res) => {
  try {
    const name = req.params.name;
    const request = req.params.request;
    
    await Event.findOneAndUpdate(
      { name: name },
      {
        $pull: {
          request: request,
        },
      }
    );
    res.send({ status: "Ok.", data: "Membership request removed from list" });
  } catch (error) {
    return res.send({ status: "error", data: error });
  }
});

app.post("/joined", async (req, res) => {
  const { email, joined } = req.body;
  console.log("Received parameters:", email, joined);
  try {
    await User.updateOne(
      { email: email },
      {
        $push: {
          joined: joined,
        },
      }
    );
    res.send({ status: "Ok.", data: "User joined events updated." });
  } catch (error) {
    return res.send({ status: "error", data: error });
  }
});

app.post("/attend", async (req, res) => {
  const { name, attend } = req.body;
  console.log("Received parameters:", name, attend);
  try {
    await Event.updateOne(
      { name: name },
      {
        $push: {
          attend: attend,
        },
      }
    );
    res.send({ status: "Ok.", data: "Event" });
  } catch (error) {
    return res.send({ status: "error", data: error });
  }
});

app.post("/payment", async (req, res) => {
  const { name, payment } = req.body;
  console.log("Received parameters:", name, payment);
  try {
    await Event.updateOne(
      { name: name },
      {
        $push: {
          payment: payment,
        },
      }
    );
    res.send({ status: "Ok.", data: "Event payment record updated" });
  } catch (error) {
    return res.send({ status: "error", data: error });
  }
});



app.get("/event/:name/:attend", async (req, res) => {
  try {
    const { name, attend } = req.params;

    console.log("Received parameters attendance:", name, attend);
    const event = await Event.findOne({ name: name });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const isAttendee = event.attend && event.attend.includes(attend);

    if (isAttendee) {
      return res.json({ message: `'${attend}' is attending '${name}'` });
    } else {
      return res
        .status(404)
        .json({ message: `'${attend}' is not attending '${name}'` });
    }
  } catch (error) {
    console.error("Error fetching event or checking attendance:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/removeattend/:name/:attend", async (req, res) => {
  try {
    const { name, attend } = req.params;

    console.log("Received parameters remove attendance:", name, attend);
    await Event.findOneAndUpdate(
      { name: name },
      {
        $pull: {
          attend: attend,
        },
      }
    );
    res.send({ status: "Ok.", data: "Attendance set to NO" });
  } catch (error) {
    return res.send({ status: "error", data: error });
  }
});



app.listen(3001,()=>{
    console.log("Node.js server has started.");
});