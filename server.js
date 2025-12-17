require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const app = express();
const PORT = process.env.PORT || 3000;
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

app.use(cors({ origin: "*" }));
app.use(express.json());
console.log("JWT_SECRET:", JWT_SECRET);
mongoose
  .connect(
    "mongodb+srv://ahmad:A2009developer@cluster0.puzjbog.mongodb.net/?appName=Cluster0"
  )
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("Error:", err));

const imagesSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
});

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

const brandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

const reviewSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  stars: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const sizeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: String,
  material: String,
  inStock: {
    type: Number,
    default: 0,
  },
  discount: {
    type: Number,
    default: 0,
  },
  gender: {
    type: String,
    enum: ["men", "women", "unisex"],
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
  },
  images: [imagesSchema],
  category: categorySchema,
  brand: brandSchema,
  size: [sizeSchema],
  review: [reviewSchema],
});

const userSchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      match: [/^\+?\d{9,15}$/, "Invalid phone number"],
    },

    otp: String,
    otpExpires: Date,
  },
  { timestamps: true }
);


const Product = mongoose.model("Product", productSchema);
const Category = mongoose.model("Category", categorySchema);
const Brand = mongoose.model("Brand", brandSchema);
const Review = mongoose.model("Review", reviewSchema);
const Size = mongoose.model("Size", sizeSchema);
const User = mongoose.model("User", userSchema);

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

app.get("/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

app.post("/products", authMiddleware, async (req, res) => {
  const newProduct = new Product(req.body);
  await newProduct.save();
  res.json(newProduct);
});

app.delete("/products/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted" });
});

app.put("/products/:id", async (req, res) => {
  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );
  res.json(updatedProduct);
});

app.get("/categories", async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
});

app.post("/categories", async (req, res) => {
  const category = new Category(req.body);
  await category.save();
  res.json(category);
});

app.delete("/categories/:id", async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: "Category deleted" });
});

app.put("/categories/:id", async (req, res) => {
  const updated = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updated);
});

app.post("/brands", async (req, res) => {
  const brand = new Brand(req.body);
  await brand.save();
  res.json(brand);
});

app.get("/brands", async (req, res) => {
  const brands = await Brand.find();
  res.json(brands);
});

app.delete("/brands/:id", async (req, res) => {
  await Brand.findByIdAndDelete(req.params.id);
  res.json({ message: "Brand deleted" });
});

app.put("/brands/:id", async (req, res) => {
  const updated = await Brand.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updated);
});

app.post("/sizes", async (req, res) => {
  const size = new Size(req.body);
  await size.save();
  res.json(size);
});

app.get("/sizes", async (req, res) => {
  const sizes = await Size.find();
  res.json(sizes);
});

app.delete("/sizes/:id", async (req, res) => {
  await Size.findByIdAndDelete(req.params.id);
  res.json({ message: "Size deleted" });
});

app.post("/reviews", async (req, res) => {
  const review = new Review(req.body);
  await review.save();
  res.json(review);
});

app.get("/reviews", async (req, res) => {
  const reviews = await Review.find();
  res.json(reviews);
});

app.delete("/reviews/:id", async (req, res) => {
  await Review.findByIdAndDelete(req.params.id);
  res.json({ message: "Review deleted" });
});

app.post("/send-otp", async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ message: "Phone number required" });
    }

    // формат чек
    const phoneRegex = /^\+?\d{9,15}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return res.status(400).json({ message: "Invalid phone number format" });
    }

    let user = await User.findOne({ phoneNumber });

    if (!user) {
      user = new User({ phoneNumber });
    }

    const otp = generateOTP();

    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 дақиқа
    await user.save();

    console.log("OTP:", otp); // ⚠️ танҳо барои development

    res.json({ message: "OTP sent" });
  } catch (err) {
    console.error("SEND OTP ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});



app.post("/verify-otp", async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    if (!phoneNumber || !otp) {
      return res.status(400).json({ message: "Phone number and OTP required" });
    }

    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.otp || !user.otpExpires) {
      return res.status(400).json({ message: "OTP not requested" });
    }

    if (user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.otp = null;
    user.otpExpires = null;
    await user.save();

    const token = jwt.sign(
      { id: user._id, phoneNumber: user.phoneNumber },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Verified",
      token,
      user: {
        id: user._id,
        phoneNumber: user.phoneNumber,
      },
    });
  } catch (err) {
    console.error("VERIFY OTP ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
