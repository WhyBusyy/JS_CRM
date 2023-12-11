SELECT store.name, count(*) AS c
FROM user
JOIN orders ON user.id = orders.user_id
JOIN Store ON orders.store_id = store.id
WHERE user.id = ?
GROUP BY store.name
LIMIT 5;