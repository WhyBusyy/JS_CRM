const fs = require("fs");
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("./src/datas/crm.db");
const { loadData } = require("./utility/loadData.js");
const { getRankData } = require("./utility/getRankData.js");

async function storeDetail(req, res) {
  const reqMonth = `${req.query.month}%`;
  const monthlyTotal = fs.readFileSync("src/controllers/sql/monthlyTotal.sql", "utf8");
  const dailyTotal = fs.readFileSync("src/controllers/sql/dailyTotal.sql", "utf8");
  const totalVisit = fs.readFileSync("src/controllers/sql/totalVisit.sql", "utf8");
  const monthlyVisit = fs.readFileSync("src/controllers/sql/monthlyVisit.sql", "utf8");

  const data = await loadData("store");
  const storeID = req.params.ID;
  const storeData = [];
  storeData.push(data.results.find((store) => store.id === storeID));
  const storeVisit = await getRankData(totalVisit, storeID);
  const storeMonthlyVisit = await getRankData(monthlyVisit, storeID, reqMonth);

  if (req.query.month) {
    db.all(dailyTotal, [storeID, reqMonth], (err, rows) => {
      if (err) {
        console.error(err.message);
      } else {
        res.render("store_daily_detail", {
          header: data.hdResults,
          data: storeData,
          storeMonthly: rows,
          storeVisit: storeMonthlyVisit,
        });
      }
    });
  } else {
    db.all(monthlyTotal, [storeID], (err, rows) => {
      if (err) {
        console.error(err.message);
      } else {
        res.render("store_detail", {
          header: data.hdResults,
          data: storeData,
          storeMonthly: rows,
          storeVisit: storeVisit,
        });
      }
    });
  }
}

module.exports = { storeDetail };
