SELECT item.name, count(*) AS c
      FROM user
      JOIN orders ON user.id = orders.user_id
      JOIN orderitem ON orders.id = orderitem.order_id
      JOIN item ON Orderitem.item_id = item.id
      WHERE user.id = ?
      GROUP BY item.name
      ORDER BY c DESC
      LIMIT 5;