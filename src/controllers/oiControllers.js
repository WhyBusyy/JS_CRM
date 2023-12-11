const fs = require("fs");
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("./src/datas/crm.db");
const { loadData } = require("./utility/loadData.js");

const query = fs.readFileSync("src/controllers/sql/orderitemDetail.sql", "utf-8");

async function oiDetail(req, res) {
  const orderID = req.params.ID;
  const data = await loadData("orderitem");

  db.all(query, [orderID], (err, rows) => {
    if (err) {
      console.error(err.message);
    } else {
      res.render("orderitem_detail", {
        header: data.hdResults,
        data: rows,
      });
    }
  });
}

module.exports = { oiDetail };
