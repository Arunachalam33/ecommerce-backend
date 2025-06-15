import pool from "../db/db.js";

export async function getAllProducts(req, res) {
  try {
    const result = await pool.query("SELECT * FROM products");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ message: "Server error" });
  }
}

// Get product by ID
export async function getProductById(req, res) {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM products WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching product:", err);
    res.status(500).json({ message: "Server error" });
  }
}

// Create product (for admin)
export async function createProduct(req, res) {
  const { name, description, price, image_url } = req.body;
  try {
    await pool.query(
      "INSERT INTO products (name, description, price, image_url) VALUES ($1, $2, $3, $4)",
      [name, description, price, image_url]
    );
    res.status(201).json({ message: "Product created" });
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({ message: "Server error" });
  }
}