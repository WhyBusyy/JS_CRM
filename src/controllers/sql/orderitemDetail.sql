SELECT Orderitem.id, Orderitem.order_id, Orderitem.item_id, item.name
    FROM orderitem
    JOIN item ON orderitem.item_id = item.id
    WHERE order_id=?;