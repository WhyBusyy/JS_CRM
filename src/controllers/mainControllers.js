const { loadData } = require("./utility/loadData.js");
const { pagination } = require("./utility/pagination.js");

async function userRoute(req, res) {
  let data = await loadData("user");
  let searchResults = [];
  const searchWord = req.query.q || "";
  const selectedGender = req.query.gender || "";
  data.results.forEach((user) => {
    if (user.Name.toLowerCase().includes(searchWord)) {
      if (user.Gender.includes(selectedGender)) {
        searchResults.push(user);
      }
    }
  });

  const results = pagination(req, searchResults);

  res.render("index", {
    table: "user",
    header: data.hdResults,
    data: results.limitedResults,
    page: results.totalPage,
    currentPage: parseInt(results.page),
    searchWord: searchWord,
    selectedGender: selectedGender,
  });
}

async function orderRoute(req, res) {
  let data = await loadData("orders");
  const results = pagination(req, data.results);

  res.render("order", {
    table: "order",
    header: data.hdResults,
    data: results.limitedResults,
    page: results.totalPage,
    currentPage: parseInt(results.page),
  });
}

async function oiRoute(req, res) {
  let data = await loadData("orderitem");
  const results = pagination(req, data.results);

  res.render("order_item", {
    table: "order_item",
    header: data.hdResults,
    data: results.limitedResults,
    page: results.totalPage,
    currentPage: parseInt(results.page),
  });
}

async function itemRoute(req, res) {
  let data = await loadData("item");
  const results = pagination(req, data.results);

  res.render("item", {
    table: "item",
    header: data.hdResults,
    data: results.limitedResults,
    page: results.totalPage,
    currentPage: parseInt(results.page),
  });
}

async function storeRoute(req, res) {
  let data = await loadData("store");
  const results = pagination(req, data.results);

  res.render("store", {
    table: "store",
    header: data.hdResults,
    data: results.limitedResults,
    page: results.totalPage,
    currentPage: parseInt(results.page),
  });
}

module.exports = { userRoute, orderRoute, oiRoute, itemRoute, storeRoute };
