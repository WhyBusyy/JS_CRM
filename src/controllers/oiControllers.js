const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("./src/datas/crm.db");
const { loadData } = require("./functions/loadData.js");

async function oiId(req, res) {
  let data = await loadData("orderitem");
  let orderID = req.params.ID;
  let orderData = [];
  const dataQuery = `SELECT Orderitem.id, Orderitem.order_id, Orderitem.item_id, item.name
    FROM orderitem
    JOIN item ON orderitem.item_id = item.id
    WHERE order_id=?;`;

  db.all(dataQuery, [orderID], (err, rows) => {
    if (err) {
      console.error(err.message);
    } else {
      orderData = rows;
      res.render("orderitem_detail", {
        header: data.hdResults,
        data: orderData,
      });
    }
  });
}

module.exports = { oiId };
