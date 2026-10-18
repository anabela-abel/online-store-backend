const express = require("express");
const mongoose = require("mongoose");
const Product = require("../models/Product");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

// GET semua produk
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data produk" });
  }
});

// GET satu produk
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "ID produk tidak valid" });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil detail produk" });
  }
});

// POST produk baru
router.post("/", verifyToken, async (req, res) => {
  try {
    const { name, price, description, image, stock } = req.body;

    if (!name || price === undefined || !description || !image || stock === undefined) {
      return res.status(400).json({
        message: "name, price, description, image, dan stock wajib diisi"
      });
    }

    const product = await Product.create({
      name,
      price,
      description,
      image,
      stock
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({
      message: "Gagal menambahkan produk",
      error: error.message
    });
  }
});

// PUT produk
router.put("/:id", verifyToken, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "ID produk tidak valid" });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!product) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    res.json(product);
  } catch (error) {
    res.status(400).json({
      message: "Gagal memperbarui produk",
      error: error.message
    });
  }
});

// DELETE produk
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "ID produk tidak valid" });
    }

    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    res.json({ message: "Produk berhasil dihapus", product });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus produk" });
  }
});

module.exports = router;
