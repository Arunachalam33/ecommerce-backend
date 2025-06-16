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
  const { name, description, price, category, image } = req.body;
  const userId = req.user.id;

  try {
    // Check if the user is admin
    const result = await pool.query(
      "SELECT is_admin FROM users WHERE id = $1",
      [userId]
    );

    if (!result.rows[0]?.is_admin) {
      return res.status(403).json({ message: "Access denied" });
    }

    await pool.query(
      `INSERT INTO products (name, description, price, category, image_url)
       VALUES ($1, $2, $3, $4, $5)`,
      [name, description, price, category, image]
    );

    res.status(201).json({ message: "Product created successfully" });
  } catch (err) {
    console.error("Error adding product:", err);
    res.status(500).json({ message: "Failed to create product" });
  }
}
export async function deleteProduct(req, res) {
  const { id } = req.params;
   console.log("Delete request received for product ID:", id);
  try {
    const result = await pool.query("DELETE FROM products WHERE id = $1", [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ message: "Failed to delete product" });
  }
}
