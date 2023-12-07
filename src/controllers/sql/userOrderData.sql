SELECT orders.id, orders.ordered_at, orders.store_id
    FROM user
    JOIN orders ON user.id = orders.user_id
    WHERE user.id = ?
    ORDER BY orders.ordered_at DESC;