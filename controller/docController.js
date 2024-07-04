import User from "../models/User.js";
import Document from "../models/Document.js";
import Paper from "../models/Paper.js";

// file upload
import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const MAX_DOCS = 5;
// at max user can upload 5 documents for a paper
const MAX_FILE_SIZE = 1024 * 1024 * 10; // 1MB

const getAllDocs = async (req, res) => {
  const user_id = req.user_id;
  const paper_id = req.params.id;
  // console.log("paper_id",paper_id);
  try {
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(400).send("Bad Request");
    }
    const paper = await Paper.findById(paper_id).populate("documents");
    if (!paper) {
      return res.status(400).send("Bad Request");
    }
    if (paper.author_id != user_id) {
      return res.status(403).send("Unauthorized access");
    }
    if (paper.documents.length == 0) {
      return res.status(400).send("No documents found");
    }
    // console.log(typeof(document.file.data));
    res.set("Content-Type", "application/pdf");
    res.send(paper.documents);
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
  }
};

const getLatestDoc = async (req, res) => {
  const user_id = req.user_id;
  const paper_id = req.params.id;
  // console.log("paper_id",paper_id);
  try {
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(400).send("Bad Request");
    }
    const paper = await Paper.findById(paper_id);
    if (!paper) {
      return res.status(400).send("Bad Request");
    }
    if (paper.author_id != user_id) {
      return res.status(403).send("Unauthorized access");
    }
    if (paper.documents.length == 0) {
      return res.status(400).send("No documents found");
    }
    const document = await Document.findById(
      paper.documents[paper.documents.length - 1]
    );
    // console.log(typeof(document.file.data));
    // setting the headers
    res.set("Content-Type", "application/pdf");
    res.send(document);
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
  }
};

const uploadDoc = async (req, res) => {
  const user_id = req.user_id;
  const paper_id = req.params.id;
  const file = req.file;
  let { changes_description } = req.body;
  // console.log("changes_description", changes_description);
  const updated_at = new Date();

  if (!req.file) {
    // console.log("file is null or undefined");
    return res.status(400).send({message : "pdf file is null or undefined"});
  }
  try {
    const user = await User.findById(user_id);
    const paper = await Paper.findById(paper_id);
    if (!user || !paper) {
      return res.status(404).send({message : "User or Paper not found"});
    }
    if (paper.author_id != user_id) {
      return res.status(403).send({ message: "Unauthorized access" });
    }
    if (paper.documents.length >= MAX_DOCS) {
      return res
        .status(400)
        .send({ message: "Can only upload at max 5 documents for a paper" });
    }
     
    var buffer = file.buffer;
    if(buffer.length > MAX_FILE_SIZE){
        return res.status(400).send("File size exceeded");
    }
    if (paper.documents.length == 0) {
      changes_description = "Initial document upload";
    }
    else{
      // if the document is already present then changes_description is required
      if(!changes_description)
        return res.status(400).send({message : "Changes description is required"});
    }
    const document = new Document({
      file: buffer,
      changes_description,
      updated_at,
      original_name: file.originalname,
    });
     
    const savedDocument = await document.save();
    paper.documents.push(savedDocument._id);
    await paper.save();
    res.send("Document uploaded successfully");
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
  }
  // console.log(file);
};

const updateDoc = async (req, res) => {
  const user_id = req.user_id;
  const document_id = req.params.id;
  const paper_id = req.params.paper_id;
  const { changes_description } = req.body;
  try {
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(400).send("Bad Request");
    }
    const paper = await Paper.findById(paper_id);
    if (!paper) {
      return res.status(400).send("Bad Request");
    }
    if (paper.author_id != user_id) {
      return res.status(403).send("Unauthorized access");
    }
    const document = await Document.findById(document_id);
    if (!document) {
      return res
        .status(400)
        .send("Bad Request document not found Document Id : " + document_id);
    }

    document.changes_description = changes_description;
    document.updated_at = new Date();
    await document.save();
    res.send("Document updated successfully");
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
  }
};

const deleteDoc = async (req, res) => {
  const user_id = req.user_id;
  const document_id = req.params.id;
  const paper_id = req.params.paper_id;
  if(!document_id || !paper_id) return res.status(400).send({message : "Document Id or Paper Id is missing"});
  // are the ids in correct format
  if(!document_id.match(/^[0-9a-fA-F]{24}$/) || !paper_id.match(/^[0-9a-fA-F]{24}$/)){
    return res.status(400).send({message : "Document Id or Paper Id is not in correct format"});
  }

  try {
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(400).send({ message: "Bad Request" });
    }
    const paper = await Paper.findById(paper_id);
    if (!paper) {
      return res.status(400).send({ message: "Bad Request" });
    }
    if (paper.author_id != user_id) {
      return res.status(403).send({ message: "Unauthorized access" });
    }
    if (paper.documents.length == 1) {
      return res
        .status(400)
        .send({ message: "Atleast one document should be present" });
    }
    const document = await Document.findById(document_id);
    if (!document) {
      return res
        .status(400)
        .send({
          message: `Bad Request document not found Document Id : ${document_id}`,
        });
    }
    const deletedDoc = await Document.deleteOne({ _id: document_id });
    paper.documents.pull(document_id);
    await paper.save();
    res.send({ message: "Document deleted successfully" });
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
  }
};

export { getAllDocs, getLatestDoc, uploadDoc, updateDoc, deleteDoc };