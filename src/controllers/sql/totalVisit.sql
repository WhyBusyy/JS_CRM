SELECT user.id, user.name, count(*) AS visit
FROM orders JOIN store ON orders.store_id = store.id
JOIN user ON user.id = orders.user_id
WHERE store.id =?
GROUP BY user.id
ORDER BY visit DESC LIMIT 10;