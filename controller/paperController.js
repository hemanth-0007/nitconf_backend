import Paper from "../models/Paper.js";
import User from "../models/User.js";
import { Status } from "../Enums/status.js";

import { validateDuplicatePapers } from "../validation/validateDuplicatePapers.js";

const getAllPapers = async (req, res) => {
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
};

const getPaper = async (req, res) => {
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
};

const addPaper = async (req, res) => {
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
    return res.status(200).send(savedPaper);
  } catch (error) {
    return res.send({
      message: error.message,
    });
  }
};

const deletePaper = async (req, res) => {
  const paper_id = req.params.id;
  const user_id = req.user_id;
  try {
    const user = await User.findById(user_id);
    if (user === null || user === undefined) {
      return res.status(404).send({message : "User not found"});
    }
    const paper = await Paper.findById(paper_id);
    if (paper === null || paper === undefined) {
      return res.status(404).send({message : "Paper not found"});
    }
    if (paper.author_id != user_id) {
      return res.status(401).send({message : "Unauthorized access"});
    }
    if (paper.status == Status.PENDING || paper.status == Status.ACCEPTED) {
      return res
        .status(400)
        .send({
          message: `Paper can't be deleted since status is ${paper.status}`,
        });
    }
    await Paper.findByIdAndDelete(paper_id);
    const updatedPapers = user.papers.filter(paper => paper != paper_id);
    user.papers = updatedPapers;
    await user.save();
    return res.status(200).send({message : "Paper deleted successfully"});
  } catch (error) {
    return res.send({
      message: error.message,
    });
  }
};

const updatePaper = async (req, res) => {
  const paper_id = req.params.id;
  const user_id = req.user_id;
  const { title, description, tags } = req.body;
  for (let index = 0; index < tags.length; index++)
    tags[index] = tags[index].trim();
  const updatedAt = new Date();
  try {
    const user = await User.findById(user_id);
    if (user === null || user === undefined) {
      return res.status(404).send({message : "User not found"});
    }
    const paper = await Paper.findById(paper_id);
    if (paper === null || paper === undefined) {
      return res.status(404).send({message : "Paper not found"});
    }
    if (paper.author_id != user_id) {
      return res.status(401).send({message : "Unauthorized access"});
    }
    paper.title = title.trim();
    paper.description = description.trim();
    paper.tags = tags;
    paper.updatedAt = updatedAt;
    await paper.save();
    res.status(200).send({message : "Paper updated successfully"});
  } catch (error) {
    res.send({
      message: error.message,
    });
  }
};

export { getAllPapers, getPaper, addPaper, deletePaper, updatePaper };
