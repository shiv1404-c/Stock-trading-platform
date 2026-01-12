require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const { HoldingsModel } = require("./model/HoldingsModel");
const { PositionsModel } = require("./model/PositionsModel");
const { OrdersModel } = require("./model/OrdersModel");
const bcrypt = require('bcrypt');
const User = require('./model/UserModel');

const app = express();
const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

mongoose.connect(uri)
  .then(() => console.log("DB started!"))
  .catch((error) => console.error("DB connection error:", error));


app.get('/signup', (req, res) => {
  res.send('Signup endpoint is working');
});

app.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();
    res.json({ message: 'Signup successful' });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(400).json({ error: 'Error signing up' });
  }
});

app.get("/allHoldings", async (req, res) => {
  try {
    let allHoldings = await HoldingsModel.find({});
    res.json(allHoldings);
  } catch (error) {
    console.error("Error fetching holdings:", error);
    res.status(500).json({ error: 'Error fetching holdings' });
  }
});

app.get("/allPositions", async (req, res) => {
  try {
    let allPositions = await PositionsModel.find({});
    res.json(allPositions);
  } catch (error) {
    console.error("Error fetching positions:", error);
    res.status(500).json({ error: 'Error fetching positions' });
  }
});

app.post("/newOrder", async (req, res) => {
  try {
    let newOrder = new OrdersModel({
      name: req.body.name,
      qty: req.body.qty,
      price: req.body.price,
      mode: req.body.mode,
    });
    await newOrder.save();
    res.send("Order saved!");
  } catch (error) {
    console.error("Error saving order:", error);
    res.status(500).json({ error: 'Error saving order' });
  }
});

app.listen(3002, () => {
  console.log("App started!");
});