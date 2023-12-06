const sqlite3 = require("sqlite3");

const db = new sqlite3.Database("./src/datas/crm.db");

async function loadData(table) {
  return new Promise((resolve, reject) => {
    const headersQuery = `PRAGMA table_info(${table})`;
    const dataQuery = `SELECT * FROM ${table}`;

    db.serialize(() => {
      db.all(headersQuery, (err, headerRows) => {
        if (err) {
          console.error(err.message);
          reject();
        }
        db.all(dataQuery, (err, dataRows) => {
          if (err) {
            console.error(err.message);
            reject();
          }

          const hdResults = headerRows.map((row) => row.name);
          const results = dataRows;
          const data = { hdResults, results };
          resolve(data);
        });
      });
    });
  });
}

module.exports = { loadData };
