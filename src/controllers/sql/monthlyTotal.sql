SELECT
strftime('%Y-%m', orders.ordered_at) AS month,
SUM(item.unit_price) AS revenue,
count(*) AS count
FROM orders
JOIN orderitem ON orders.id = orderitem.order_id
JOIN item ON orderitem.item_id = item.id
JOIN Store ON orders.store_id = store.id
WHERE store_id = ?
GROUP BY month;