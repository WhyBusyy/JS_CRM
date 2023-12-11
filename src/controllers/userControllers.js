const fs = require("fs");
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("./src/datas/crm.db");
const { loadData } = require("./utility/loadData.js");
const { getRankData } = require("./utility/getRankData.js");

const query = fs.readFileSync("src/controllers/sql/userOrderData.sql", "utf8");
const visitRank = fs.readFileSync("src/controllers/sql/userVisitRank.sql", "utf8");
const itemRank = fs.readFileSync("src/controllers/sql/userItemRank.sql", "utf8");

async function userDetail(req, res) {
  const userID = req.params.ID;

  const data = await loadData("user");
  const userData = [];
  userData.push(data.results.find((user) => user.ID === userID));
  const visitRankData = await getRankData(visitRank, userID);
  const itemRankData = await getRankData(itemRank, userID);

  db.all(query, [userID], (err, rows) => {
    if (err) {
      console.error(err.message);
    } else {
      res.render("user_detail", {
        header: data.hdResults,
        data: userData,
        orderData: rows,
        visitData: visitRankData,
        itemData: itemRankData,
      });
    }
  });
}

module.exports = { userDetail };
