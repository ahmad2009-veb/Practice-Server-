const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: "*" }));
app.use(express.json());

// ===== Connect to MongoDB =====
mongoose
mongoose.connect("mongodb+srv://ahmad:A2009developer@cluster0.puzjbog.mongodb.net/?appName=Cluster0")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("Error:", err));

// ===== Schema & Model =====
const itemSchema = new mongoose.Schema({
  name: String,
  age: Number,
});

const Item = mongoose.model("Item", itemSchema);

// ===== Routes =====

// GET
app.get("/items", async (req, res) => {
  const items = await Item.find();
  res.json(items);
});

// POST
app.post("/items", async (req, res) => {
  const newItem = new Item(req.body);
  await newItem.save();
  res.json(newItem);
});

// DELETE
app.delete("/items/:id", async (req, res) => {
  await Item.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// PUT
app.put("/items/:id", async (req, res) => {
  const updated = await Item.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updated);
});

// LISTEN
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
