const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("./src/datas/crm.db");
const { loadData } = require("./functions/loadData.js");

async function storeId(req, res) {
  let data = await loadData("store");
  let storeData = [];
  let storeMonthly = [];
  let storeVisit = [];
  let storeID = req.params.ID;
  storeData.push(data.results.find((store) => store.id === storeID));
  let dataQuery = `SELECT
    strftime('%Y-%m', orders.ordered_at) AS month,
    SUM(item.unit_price) AS revenue,
    count(*) AS count
    FROM orders
    JOIN orderitem ON orders.id = orderitem.order_id
    JOIN item ON orderitem.item_id = item.id
    JOIN Store ON orders.store_id = store.id
    WHERE store_id = ?
    GROUP BY month;`;
  let query = `${req.query.month}%`;

  function getStoreVisit() {
    const visitNum = `SELECT user.id, user.name, count(*) AS visit
        FROM orders JOIN store ON orders.store_id = store.id
        JOIN user ON user.id = orders.user_id
        WHERE store.id =?
        GROUP BY user.id
        ORDER BY visit DESC LIMIT 10;`;
    return new Promise((resolve, reject) => {
      db.all(visitNum, [storeID], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          storeVisit = rows;
          resolve();
        }
      });
    });
  }

  function getMonthlyStoreVisit() {
    const MonthlyVisitNum = `SELECT user.id, user.name, count(*) AS visit
        FROM orders
        JOIN store ON orders.store_id = store.id
        JOIN user ON user.id = orders.user_id
        WHERE store.id = ? AND Orders.ordered_at LIKE ?
        GROUP BY orders.id
        ORDER BY visit DESC LIMIT 10;`;
    return new Promise((resolve, reject) => {
      db.all(MonthlyVisitNum, [storeID, query], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          storeVisit = rows;
          resolve();
        }
      });
    });
  }

  if (query !== "undefined%") {
    dataQuery = `SELECT strftime('%Y-%m-%d', orders.ordered_at) AS day,
      SUM(item.unit_price) AS daily_sales,
      COUNT(*) AS order_count
      FROM orders
      JOIN orderitem ON orders.id = orderitem.order_id
      JOIN item ON orderitem.item_id = item.id
      JOIN Store ON orders.store_id = store.id
      WHERE store_id = ?
      AND Orders.ordered_at LIKE ?
      GROUP BY day;`;

    getMonthlyStoreVisit();

    db.all(dataQuery, [storeID, query], (err, rows) => {
      if (err) {
        console.error(err.message);
      } else {
        storeMonthly = rows;
        res.render("store_daily_detail", {
          header: data.hdResults,
          data: storeData,
          storeMonthly: storeMonthly,
          storeVisit: storeVisit,
        });
      }
    });
  } else {
    getStoreVisit();
    db.all(dataQuery, [storeID], (err, rows) => {
      if (err) {
        console.error(err.message);
      } else {
        storeMonthly = rows;
        res.render("store_detail", {
          header: data.hdResults,
          data: storeData,
          storeMonthly: storeMonthly,
          storeVisit: storeVisit,
        });
      }
    });
  }
}

module.exports = { storeId };
