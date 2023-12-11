const sqlite3 = require("sqlite3");

const db = new sqlite3.Database("./src/datas/crm.db");

function getRankData(query, id, month) {
  return new Promise((resolve, reject) => {
    db.all(query, [id, month], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        const data = rows;
        resolve(data);
      }
    });
  });
}

module.exports = { getRankData };
