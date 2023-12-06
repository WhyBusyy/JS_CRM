const { loadData } = require("./functions/loadData.js");

async function orderId(req, res) {
  let data = await loadData("orders");
  const orderData = [];
  let orderID = req.params.ID;
  orderData.push(data.results.find((order) => order.id === orderID));

  res.render("order_detail", {
    header: data.hdResults,
    data: orderData,
  });
};

module.exports = { orderId };
