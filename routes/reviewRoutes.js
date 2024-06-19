const express = require("express");
const router = express.Router();


// an api to right review
router.post("/add-review/", async (req, res) => {
    const { review, rating, reviewer, reviewed } = req.body;
});
 
 
 

module.exports = router;
