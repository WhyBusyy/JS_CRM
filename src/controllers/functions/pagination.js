function pagination(req, data) {
  const itemsPerPage = 20;
  let startIndex = 0;
  let endIndex;
  let page = req.query.page || 1;
  startIndex = (page - 1) * itemsPerPage;
  endIndex = startIndex + itemsPerPage;
  const totalPage = Math.ceil(data.length / itemsPerPage);
  const limitedResults = data.slice(startIndex, endIndex);

  const results = {totalPage, limitedResults, page}
  
  return results;
}

module.exports = { pagination };
