const express = require("express");
const fs = require("fs");
const sqlite3 = require("sqlite3");

const db = new sqlite3.Database("./public/crm.db");
const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// app.use('/user', userRouter);
app.use((req, res, next) => {
  // 모든 요청이 있을 때마다 미들웨어를 거쳐간다.. next()
  const start = Date.now();
  //나중에 동작할 리스너 등록
  res.on("finish", () => {
    const end = Date.now();
    const duration = end - start;
    console.log(`요청 ${req.path}에서 소요시간 ${duration}ms입니다.`);
  });
  next();
});

app.get("/:table", (req, res) => {
  const table = req.params.table;
  const query = `SELECT * FROM ${table}`;

  db.all(query, (err, rows) => {
    res.json(rows);
  });
});

  app.listen(port, () => {
    console.log("서버 오픈");
  });
