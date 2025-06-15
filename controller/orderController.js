import pool from "../db/db.js";

export async function placeOrder(req, res) {
  const { cartItems, total, name, email, address } = req.body;
  const userId = req.user.id;

  try {
    const orderResult = await pool.query(
      `INSERT INTO orders (user_id, total, name, email, address)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [userId, total, name, email, address]
    );

    const orderId = orderResult.rows[0].id;

    const insertItems = cartItems.map(item =>
      pool.query(
        "INSERT INTO order_items (order_id, product_name, quantity, price) VALUES ($1, $2, $3, $4)",
        [orderId, item.name, item.quantity, item.price]
      )
    );

    await Promise.all(insertItems);

    res.status(201).json({ message: "Order placed successfully", orderId });
  } catch (err) {
    console.error("Error placing order:", err);
    res.status(500).json({ message: "Failed to place order" });
  }
}
