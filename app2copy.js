const express = require("express");
const nunjucks = require("nunjucks");
const fs = require("fs");
const csv = require("csv-parser"); //선택사항

const app = express();
const port = 3000;

// const userRouter = require('./src/userRouter');

app.use(express.static("public"));
//눈적스 초기화
nunjucks.configure("views", {
  autoescape: true,
  express: app,
});
app.set("view engine", "html");

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

const results = [];
const hdResults = [];

async function loadDataIntoMemory() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(
      "/Users/yubyung-gyu/SESAC/me/sesac_ot/3.NODE/generator/1.user/User.csv"
    )
      .pipe(csv())
      .on("headers", (headers) => hdResults.push(...headers))
      .on("data", (data) => results.push(data))
      .on("end", () => {
        console.log("파일 다 읽었음");
        resolve();
      })
      .on("error", (error) => {
        console.log("파일읽기 오류", error);
        reject(error);
      });
  });
}

async function startServer() {
  await loadDataIntoMemory();

  app.get("/", (req, res) => {
    const itemsPerPage = 20;
    let startIndex = 0;
    let endIndex;

    console.log(`요청 GET 파라미터 : ${req.query.page}`);
    let page = req.query.page || 1;
    startIndex = (page - 1) * itemsPerPage;
    endIndex = startIndex + itemsPerPage;
    //전체 페이지수 계산 >> 페이지 숫자를 HTML로 전달해서 화면 아래에 추가
    const totalPage = Math.ceil(results.length / itemsPerPage);
    console.log(totalPage);

    const limitedResults = results.slice(startIndex, endIndex);
    res.render("index", {
      header: hdResults,
      data: limitedResults,
      page: totalPage,
      currentPage: parseInt(page),
    });
  });

  app.get("/user/:ID", (req, res) => {
    const userData = [];
    let userID = req.params.ID;
    userData.push(results.find((user) => user.ID === userID));
    let page = req.query.page || 1;

    res.render("user", {
      header: hdResults,
      data: userData,
      currentPage: parseInt(page),
    });
  });

  app.get("/search", (req, res) => {
    const searchResults = [];
    const searchWord = req.query.q;
    console.log(searchWord);
    results.forEach((user) => {
      if (user.Name.toLowerCase().includes(searchWord)) {
        searchResults.push(user);
      }
    });
    res.render("search", {
      header: hdResults,
      data: searchResults,
    });
  });

  app.listen(port, () => {
    console.log("서버 오픈");
  });
}

startServer();
