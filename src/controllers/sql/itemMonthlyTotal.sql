SELECT
    strftime('%Y-%m', orders.ordered_at) AS month,
    SUM(item.unit_price) AS total,
    COUNT(Orderitem.id) AS count
    FROM item
    JOIN orderitem ON item.id = orderitem.item_id
    JOIN orders ON orderitem.order_id = orders.id
    WHERE item.id = ?
    GROUP BY  month
    ORDER BY month ASC;