const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: "*" }));
app.use(express.json());

mongoose.connect("mongodb+srv://ahmad:A2009developer@cluster0.puzjbog.mongodb.net/?appName=Cluster0")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("Error:", err));

const itemSchema = new mongoose.Schema({
  name: String,
  age: Number,
});

const Item = mongoose.model("Item", itemSchema);


app.get("/data", async (req, res) => {
  const data = await Item.find();
  res.json(data);
});

app.post("/data", async (req, res) => {
  const newItem = new Item(req.body);
  await newItem.save();
  res.json(newItem);
});

app.delete("/data/:id", async (req, res) => {
  await Item.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

app.put("/data/:id", async (req, res) => {
  const updated = await Item.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updated);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
