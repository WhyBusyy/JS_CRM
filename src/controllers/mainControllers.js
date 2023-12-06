const { loadData } = require("./functions/loadData.js");

async function userRoute(req, res) {
  let data = await loadData("user");
  let searchResults = [];
  const searchWord = req.query.q || "";
  data.results.forEach((user) => {
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
    header: data.hdResults,
    data: limitedResults,
    page: totalPage,
    currentPage: parseInt(page),
    searchWord: searchWord,
  });
}

async function orderRoute(req, res) {
  let data = await loadData("orders");
  const itemsPerPage = 20;
  let startIndex = 0;
  let endIndex;

  let page = req.query.page || 1;
  startIndex = (page - 1) * itemsPerPage;
  endIndex = startIndex + itemsPerPage;
  const totalPage = Math.ceil(data.results.length / itemsPerPage);

  const limitedResults = data.results.slice(startIndex, endIndex);

  res.render("order", {
    header: data.hdResults,
    data: limitedResults,
    page: totalPage,
    currentPage: parseInt(page),
  });
}

async function oiRoute(req, res) {
  let data = await loadData("orderitem");
  const itemsPerPage = 20;
  let startIndex = 0;
  let endIndex;

  let page = req.query.page || 1;
  startIndex = (page - 1) * itemsPerPage;
  endIndex = startIndex + itemsPerPage;
  const totalPage = Math.ceil(data.results.length / itemsPerPage);

  const limitedResults = data.results.slice(startIndex, endIndex);

  res.render("order_item", {
    header: data.hdResults,
    data: limitedResults,
    page: totalPage,
    currentPage: parseInt(page),
  });
}

async function itemRoute(req, res) {
  let data = await loadData("item");
  const itemsPerPage = 20;
  let startIndex = 0;
  let endIndex;

  let page = req.query.page || 1;
  startIndex = (page - 1) * itemsPerPage;
  endIndex = startIndex + itemsPerPage;
  const totalPage = Math.ceil(data.results.length / itemsPerPage);

  const limitedResults = data.results.slice(startIndex, endIndex);

  res.render("item", {
    header: data.hdResults,
    data: limitedResults,
    page: totalPage,
    currentPage: parseInt(page),
  });
}

async function storeRoute(req, res) {
  let data = await loadData("store");
  const itemsPerPage = 20;
  let startIndex = 0;
  let endIndex;

  let page = req.query.page || 1;
  startIndex = (page - 1) * itemsPerPage;
  endIndex = startIndex + itemsPerPage;
  const totalPage = Math.ceil(data.results.length / itemsPerPage);

  const limitedResults = data.results.slice(startIndex, endIndex);

  res.render("store", {
    header: data.hdResults,
    data: limitedResults,
    page: totalPage,
    currentPage: parseInt(page),
  });
}

module.exports = { userRoute, orderRoute, oiRoute, itemRoute, storeRoute };
