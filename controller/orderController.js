import pool from "../db/db.js";

export async function placeOrder(req, res) {
  const { cartItems, total, name, email, address } = req.body;
  const userId = req.user.id;

  try {
    // 1. Insert order
    const orderResult = await pool.query(
      `INSERT INTO orders (user_id, total, name, email, address)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [userId, total, name, email, address]
    );
    const orderId = orderResult.rows[0].id;

    // 2. Insert items
    await Promise.all(
      cartItems.map(item =>
        pool.query(
          `INSERT INTO order_items (order_id, product_name, quantity, price)
           VALUES ($1, $2, $3, $4)`,
          [orderId, item.name, item.quantity, item.price]
        )
      )
    );

    // 3. Respond to client
    res.status(201).json({ message: "Order placed", orderId });
  } catch (err) {
    console.error("Error placing order:", err);
    res.status(500).json({ message: "Failed to place order" });
  }
}

export async function getUserOrders(req, res) {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `SELECT o.id AS order_id, o.total, o.created_at, 
              json_agg(json_build_object(
                'product_name', oi.product_name,
                'quantity', oi.quantity,
                'price', oi.price
              )) AS items
       FROM orders o
       JOIN order_items oi ON o.id = oi.order_id
       WHERE o.user_id = $1
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Failed to fetch orders", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
}

export async function getAllOrders(req, res) {
  try {
    const result = await pool.query(
      `SELECT o.id AS order_id, o.user_id, o.name, o.email, o.address,
              o.total, o.created_at,
              json_agg(json_build_object(
                'product_name', oi.product_name,
                'quantity', oi.quantity,
                'price', oi.price
              )) AS items
       FROM orders o
       JOIN order_items oi ON o.id = oi.order_id
       GROUP BY o.id
       ORDER BY o.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch all orders" });
  }
}

export async function markShipped(req, res) {
  const { orderId } = req.params;
  try {
    await pool.query(
      "UPDATE orders SET shipped = TRUE WHERE id = $1",
      [orderId]
    );
    res.json({ message: "Order marked as shipped" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update order" });
  }
}


