const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: "*" }));
app.use(express.json());

mongoose
  .connect(
    "mongodb+srv://ahmad:A2009developer@cluster0.puzjbog.mongodb.net/?appName=Cluster0"
  )
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("Error:", err));

const dataSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  images: [String],
  category: String,
  size: [String],
  color: [String],
  material: String,
  brand: String,
  inStock: Number,
  discount: Number,
  gender: String,
  rating: Number,
  reviews: [
    {
      user: String,
      comment: String,
      stars: Number,
    },
  ],
  productCode: String,
});

const Data = mongoose.model("Data", dataSchema);

app.get("/data", async (req, res) => {
  const data = await Data.find();
  res.json(data);
});

app.post("/data", async (req, res) => {
  const newData = new Data(req.body);
  await newData.save();
  res.json(newData);
});

app.delete("/data/:id", async (req, res) => {
  await Data.findByIdAndDelete(req.params.id);
  res.json({ message: "Data deleted" });
});

app.put("/data/:id", async (req, res) => {
  const updatedData = await Data.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updatedData);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
