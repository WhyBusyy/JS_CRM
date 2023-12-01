const express = require('express');
const router = express.Router();


router.get("/:ID", (req, res) => {
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

module.exports = router;

//일단 보류