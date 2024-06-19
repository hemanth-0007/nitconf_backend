const express = require("express");
const router = express.Router();
const Paper = require("../models/Paper");
const User = require("../models/User");
const Status = require("../utility/status");
const authenticateToken = require("../authenticate/jwtAuth");
const validatePaperRequest = require("../validation/validatePaperRequest");
const validateDuplicatePapers = require("../validation/validateDuplicatePapers");

const MAX_TAGS = 5;

// get all the papers for the user
router.get("/all/", authenticateToken, async (req, res) => {
  const user_id = req.user_id;
  try {
    const user = await User.findById(user_id).populate("papers");

    if (user === null) {
      res.status(404).send("User not found");
    } else {
      const papers = user.papers;
      res.status(200).send(papers);
    }
  } catch (error) {
    res.send({
      message: error.message,
    });
  }
});

router.get("/get/:id", authenticateToken, async (req, res) => {
  const user_id = req.user_id;
  const paper_id = req.params.id;
  // console.log("paper_id", paper_id);
  try {
    const user = await User.findById(user_id);
    if (user === null || user === undefined) {
      return res.status(404).send("User not found");
    }
    const paper = await Paper.findById(paper_id).populate("tags");
    if (paper === null || paper === undefined) {
      return res.status(404).send("Paper not found");
    }
    if (paper.author_id != user_id) {
      return res.status(401).send("Unauthorized access");
    }
    res.status(200).send(paper);
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
  }
});

// add a paper to the user's collection
router.post(
  "/new-paper/",
  authenticateToken,
  validatePaperRequest,
  async (req, res) => {
    const user_id = req.user_id;
    const { title, description, tags } = req.body;
    const createdAt = new Date();
    const status = Status.PENDING;
    for (let index = 0; index < tags.length; index++)
      tags[index] = tags[index].trim();
    const updatedPaper = new Paper({
      title: title.trim(),
      description: description.trim(),
      status,
      tags,
      createdAt,
      author_id: user_id,
    });

    try {
      const user = await User.findById(user_id).populate("papers");
      if (user === null || user === undefined) {
        // console.log("User not found");
        return res.status(404).send("User not found");
      }
      if (!validateDuplicatePapers(user.papers, updatedPaper.title))
        return res.status(400).send({ message: "Duplicate paper Title found" });
      const savedPaper = await updatedPaper.save();
      // console.log(savedPaper);
      user.papers.push(savedPaper._id);
      await user.save();
      // console.log("User updated successfully");
      return res.status(200).send({ message: "Paper added successfully" });
    } catch (error) {
      return res.send({
        message: error.message,
      });
    }
  }
);

// delete a paper from the user's collection
router.delete("/delete/:id", authenticateToken, async (req, res) => {
  const paper_id = req.params.id;
  const user_id = req.user_id;
  try {
    const user = await User.findById(user_id);
    if (user === null || user === undefined) {
      return res.status(404).send("User not found");
    }
    const paper = await Paper.findById(paper_id);
    if (paper === null || paper === undefined) {
      return res.status(404).send("Paper not found");
    }
    if (paper.author_id != user_id) {
      return res.status(401).send("Unauthorized access");
    }
    if(paper.status == Status.PENDING || paper.status == Status.ACCEPTED){
      return res.status(400).send({message : "Paper can't be deleted since it is Pending or Accepted"});
    }
    await paper.delete();
    const updatedPapers = user.papers.filter((paper) => {
      // console.log(typeof(paper));
      // console.log(typeof(paper_id));
      return paper != paper_id;
    });
    user.papers = updatedPapers;
    // console.log(updatedPapers);
    // console.log(user.papers);
    await user.save();
    res.status(200).send("Paper deleted successfully");
  } catch (error) {
    res.send({
      message: error.message,
    });
  }
});

// update a paper in the user's collection
router.put(
  "/update/:id",
  authenticateToken,
  validatePaperRequest,
  async (req, res) => {
    const paper_id = req.params.id;
    const user_id = req.user_id;
    const { title, description, tags } = req.body;
    for (let index = 0; index < tags.length; index++)
      tags[index] = tags[index].trim();
    const updatedAt = new Date();
    const status = Status.PENDING;
    try {
      const user = await User.findById(user_id);
      if (user === null || user === undefined) {
        return res.status(404).send("User not found");
      }
      const paper = await Paper.findById(paper_id);
      if (paper === null || paper === undefined) {
        return res.status(404).send("Paper not found");
      }
      if (paper.author_id != user_id) {
        return res.status(401).send("Unauthorized access");
      }
      paper.title = title.trim();
      paper.description = description.trim();
      paper.tags = tags;
      paper.updatedAt = updatedAt;
      paper.status = status;
      await paper.save();
      res.status(200).send("Paper updated successfully");
    } catch (error) {
      res.send({
        message: error.message,
      });
    }
  }
);

module.exports = router;
