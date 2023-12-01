const express = require("express");
const nunjucks = require("nunjucks");
const fs = require("fs");
const csv = require("csv-parser"); //선택사항

const app = express();
const port = 3000;


app.use(express.static("public"));
//눈적스 초기화
nunjucks.configure("views", {
  autoescape: true,
  express: app,
});
app.set("view engine", "html");

app.use((req, res, next) => {
  // 모든 요청이 있을 때마다 미들웨어를 거쳐간다.. next()
  const start = Date.now();
  //나중에 동작할 리스너 등록
  res.on('finish', () => {
    const end = Date.now();
    const duration = end - start;
    console.log(`요청 ${req.path}에서 소요시간 ${duration}ms입니다.`);
  })
  next();
})

app.get("/", (req, res) => {
  const results = [];
  const hdResults = [];
  try {
    fs.createReadStream(
        "/Users/yubyung-gyu/SESAC/me/sesac_ot/3.NODE/generator/1.user/User.csv"
      )
      .pipe(csv())
      .on('headers',(headers) => hdResults.push(...headers))
      .on("data", (data) => results.push(data))
      .on("end", () => {
        const limitedResults = results.slice(0, 20);
        res.render("index", { header : hdResults, data : limitedResults });
      });
  } catch (error) {
    console.error("에러 발생:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log("서버 오픈");
});
