const fs = require("fs");
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("./src/datas/crm.db");
const { loadData } = require("./functions/loadData.js");

async function itemDetail(req, res) {
  const query = fs.readFileSync("src/controllers/sql/itemMonthlyTotal.sql", "utf-8");
  const itemID = req.params.ID;

  const data = await loadData("item");
  const itemData = [];
  itemData.push(data.results.find((item) => item.id === itemID));

  db.all(query, [itemID], (err, rows) => {
    if (err) {
      console.error(err.message);
    } else {
      res.render("item_detail", {
        header: data.hdResults,
        data: itemData,
        itemtotalData: rows,
      });
    }
  });
}

module.exports = { itemDetail };
