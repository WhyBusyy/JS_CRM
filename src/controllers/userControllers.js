const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("./src/datas/crm.db");
const { loadData } = require("./functions/loadData.js");

async function userId(req, res) {
  let data = await loadData("user");
  const userData = [];
  let visitData = [];
  let itemData = [];
  let userID = req.params.ID;
  userData.push(data.results.find((user) => user.ID === userID));

  let query = `SELECT orders.id, orders.ordered_at, orders.store_id
    FROM user
    JOIN orders ON user.id = orders.user_id
    WHERE user.id = ?
    ORDER BY orders.ordered_at DESC;`;

  function getVisitData() {
    const visitNum = `SELECT store.name, count(*) AS c
      FROM user
      JOIN orders ON user.id = orders.user_id
      JOIN Store ON orders.store_id = store.id
      WHERE user.id = ?
      GROUP BY store.name
      LIMIT 5;`;
    return new Promise((resolve, reject) => {
      db.all(visitNum, [userID], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          visitData = rows;
          resolve();
        }
      });
    });
  }

  function getItemData() {
    const itemNum = `SELECT item.name, count(*) AS c
      FROM user
      JOIN orders ON user.id = orders.user_id
      JOIN orderitem ON orders.id = orderitem.order_id
      JOIN item ON Orderitem.item_id = item.id
      WHERE user.id = ?
      GROUP BY item.name
      ORDER BY c DESC
      LIMIT 5;`;
    return new Promise((resolve, reject) => {
      db.all(itemNum, [userID], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          itemData = rows;
          resolve();
        }
      });
    });
  }

  getVisitData();
  getItemData();

  db.all(query, [userID], (err, rows) => {
    if (err) {
      console.error(err.message);
    } else {
      orderData = rows;
      res.render("user", {
        header: data.hdResults,
        data: userData,
        orderData: orderData,
        visitData: visitData,
        itemData: itemData,
      });
    }
  });
}

module.exports = { userId };
