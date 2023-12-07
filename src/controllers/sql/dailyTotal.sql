SELECT strftime('%Y-%m-%d', orders.ordered_at) AS day,
SUM(item.unit_price) AS daily_sales,
COUNT(*) AS order_count
FROM orders
JOIN orderitem ON orders.id = orderitem.order_id
JOIN item ON orderitem.item_id = item.id
JOIN Store ON orders.store_id = store.id
WHERE store_id = ?
AND Orders.ordered_at LIKE ?
GROUP BY day;