const express = require("express");
const nunjucks = require("nunjucks");
const path = require("path");

const mainRoutes = require('./src/routes/mainRoutes');
const userRoutes = require('./src/routes/userRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const oiRoutes = require('./src/routes/oiRoutes');
const itemRoutes = require('./src/routes/itemRoutes');
const storeRoutes = require('./src/routes/storeRoutes');

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

app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const end = Date.now();
    const duration = end - start;
    console.log(`요청 ${req.path}에서 소요시간 ${duration}ms입니다.`);
  });
  next();
});

app.use('/', mainRoutes);
app.use('/user', userRoutes);
app.use('/order', orderRoutes);
app.use('/order_item', oiRoutes);
app.use('/item', itemRoutes);
app.use('/store', storeRoutes);

app.listen(port, () => {
  console.log("서버 오픈");
});