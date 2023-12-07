const { loadData } = require("./functions/loadData.js");

async function orderDetail(req, res) {
  const orderID = req.params.ID;

  const data = await loadData("orders");
  const orderData = [];
  orderData.push(data.results.find((order) => order.id === orderID));

  res.render("order_detail", {
    header: data.hdResults,
    data: orderData,
  });
};

module.exports = { orderDetail };
