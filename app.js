const express = require("express");
const fs = require("fs");
const sqlite3 = require("sqlite3");
const nunjucks = require("nunjucks");
const path = require("path");

const db = new sqlite3.Database("./public/crm.db");
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
nunjucks.configure("views", {
  autoescape: true,
  express: app,
});
app.set("view engine", "html");

let userResults = [];
let userHdResults = [];
let orderResults = [];
let orderHdResults = [];
let oiResults = [];
let oiHdResults = [];
let itemResults = [];
let itemHdResults = [];
let storeResults = [];
let storeHdResults = [];

async function loadUserData() {
  return new Promise((resolve, reject) => {
    const headersQuery = `PRAGMA table_info(user)`;
    const dataQuery = `SELECT * FROM user`;

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
          userHdResults = headerRows.map((row) => row.name);
          userResults = dataRows;

          resolve();
        });
      });
    });
  });
}

async function loadOrderData() {
  return new Promise((resolve, reject) => {
    const headersQuery = `PRAGMA table_info(orders)`;
    const dataQuery = `SELECT * FROM orders`;

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
          orderHdResults = headerRows.map((row) => row.name);
          orderResults = dataRows;

          resolve();
        });
      });
    });
  });
}

async function loadOiData() {
  return new Promise((resolve, reject) => {
    const headersQuery = `PRAGMA table_info(orderitem)`;
    const dataQuery = `SELECT * FROM orderitem`;

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
          oiHdResults = headerRows.map((row) => row.name);
          oiResults = dataRows;

          resolve();
        });
      });
    });
  });
}

async function loadItemData() {
  return new Promise((resolve, reject) => {
    const headersQuery = `PRAGMA table_info(item)`;
    const dataQuery = `SELECT * FROM item`;

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
          itemHdResults = headerRows.map((row) => row.name);
          itemResults = dataRows;

          resolve();
        });
      });
    });
  });
}

async function loadStoreData() {
  return new Promise((resolve, reject) => {
    const headersQuery = `PRAGMA table_info(store)`;
    const dataQuery = `SELECT * FROM store`;

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
          storeHdResults = headerRows.map((row) => row.name);
          storeResults = dataRows;

          resolve();
        });
      });
    });
  });
}

async function startServer() {
  await loadUserData();
  await loadOrderData();
  await loadOiData();
  await loadItemData();
  await loadStoreData();

  app.listen(port, () => {
    console.log("서버 오픈");
  });
}

app.get("/user", (req, res) => {
  let searchResults = [];
  const searchWord = req.query.q || "";
  userResults.forEach((user) => {
    if (user.Name.toLowerCase().includes(searchWord)) {
      searchResults.push(user);
    }
  });

  const itemsPerPage = 20;
  let startIndex = 0;
  let endIndex;

  let page = req.query.page || 1;
  startIndex = (page - 1) * itemsPerPage;
  endIndex = startIndex + itemsPerPage;
  const totalPage = Math.ceil(searchResults.length / itemsPerPage);

  const limitedResults = searchResults.slice(startIndex, endIndex);

  res.render("index", {
    header: userHdResults,
    data: limitedResults,
    page: totalPage,
    currentPage: parseInt(page),
    searchWord: searchWord,
  });
});

app.get("/user/:ID", (req, res) => {
  const userData = [];
  let visitData = [];
  let itemData = [];
  let userID = req.params.ID;
  userData.push(userResults.find((user) => user.ID === userID));
  let query = `SELECT orders.id, orders.ordered_at, store.address
  FROM user
  JOIN orders ON user.id = orders.user_id
  JOIN Store ON orders.store_id = store.id
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
        header: userHdResults,
        data: userData,
        orderData: orderData,
        visitData: visitData,
        itemData: itemData
      });
    }
  });
});

app.get("/order", (req, res) => {
  const itemsPerPage = 20;
  let startIndex = 0;
  let endIndex;

  let page = req.query.page || 1;
  startIndex = (page - 1) * itemsPerPage;
  endIndex = startIndex + itemsPerPage;
  const totalPage = Math.ceil(orderResults.length / itemsPerPage);

  const limitedResults = orderResults.slice(startIndex, endIndex);

  res.render("order", {
    header: orderHdResults,
    data: limitedResults,
    page: totalPage,
    currentPage: parseInt(page),
  });
});

app.get("/order/:ID", (req, res) => {
  const orderData = [];
  let orderID = req.params.ID;
  orderData.push(orderResults.find((order) => order.id === orderID));

  res.render("order_detail", {
    header: orderHdResults,
    data: orderData,
  });
});

app.get("/order_item", (req, res) => {
  const itemsPerPage = 20;
  let startIndex = 0;
  let endIndex;

  let page = req.query.page || 1;
  startIndex = (page - 1) * itemsPerPage;
  endIndex = startIndex + itemsPerPage;
  const totalPage = Math.ceil(oiResults.length / itemsPerPage);

  const limitedResults = oiResults.slice(startIndex, endIndex);

  res.render("order_item", {
    header: oiHdResults,
    data: limitedResults,
    page: totalPage,
    currentPage: parseInt(page),
  });
});

app.get("/order_item/:ID", (req, res) => {
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
        header: oiHdResults,
        data: orderData,
      });
    }
  });
});

app.get("/item", (req, res) => {
  const itemsPerPage = 20;
  let startIndex = 0;
  let endIndex;

  let page = req.query.page || 1;
  startIndex = (page - 1) * itemsPerPage;
  endIndex = startIndex + itemsPerPage;
  const totalPage = Math.ceil(itemResults.length / itemsPerPage);

  const limitedResults = itemResults.slice(startIndex, endIndex);

  res.render("item", {
    header: itemHdResults,
    data: limitedResults,
    page: totalPage,
    currentPage: parseInt(page),
  });
});

app.get("/item/:ID", (req, res) => {
  const itemData = [];
  let itemID = req.params.ID;
  itemData.push(itemResults.find((item) => item.id === itemID));

  res.render("item_detail", {
    header: itemHdResults,
    data: itemData,
  });
});

app.get("/store", (req, res) => {
  const itemsPerPage = 20;
  let startIndex = 0;
  let endIndex;

  let page = req.query.page || 1;
  startIndex = (page - 1) * itemsPerPage;
  endIndex = startIndex + itemsPerPage;
  const totalPage = Math.ceil(storeResults.length / itemsPerPage);

  const limitedResults = storeResults.slice(startIndex, endIndex);

  res.render("store", {
    header: storeHdResults,
    data: limitedResults,
    page: totalPage,
    currentPage: parseInt(page),
  });
});

app.get("/store/:ID", (req, res) => {
  let storeData = [];
  let storeMonthly = [];
  let storeVisit = [];
  let storeID = req.params.ID;
  storeData.push(storeResults.find((store) => store.id === storeID));
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
          header: storeHdResults,
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
          header: storeHdResults,
          data: storeData,
          storeMonthly: storeMonthly,
          storeVisit: storeVisit,
        });
      }
    });
  }
});

startServer();
