const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("./src/datas/crm.db");
const { loadData } = require("./functions/loadData.js");

async function itemId(req, res) {
  let data = await loadData("item");
  let itemData = [];
  let itemtotalData = [];
  let itemID = req.params.ID;
  itemData.push(data.results.find((item) => item.id === itemID));

  const dataQuery = `SELECT
    strftime('%Y-%m', orders.ordered_at) AS month,
    SUM(item.unit_price) AS total,
    COUNT(Orderitem.id) AS count
    FROM item
    JOIN orderitem ON item.id = orderitem.item_id
    JOIN orders ON orderitem.order_id = orders.id
    WHERE item.id = ?
    GROUP BY  month
    ORDER BY month ASC;`;

  db.all(dataQuery, [itemID], (err, rows) => {
    if (err) {
      console.error(err.message);
    } else {
      itemtotalData = rows;
      res.render("item_detail", {
        header: data.hdResults,
        data: itemData,
        itemtotalData: itemtotalData,
      });
    }
  });
}

module.exports = { itemId };
