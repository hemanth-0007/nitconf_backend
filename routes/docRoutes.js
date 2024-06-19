const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Document = require("../models/Document");
const Paper = require("../models/Paper");
const authenticateToken = require("../authenticate/jwtAuth");

// file upload
const multer = require('multer');
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
const MAX_DOCS = 5;
const MAX_FILE_SIZE = 1024*1024*10; // 10MB
// at max user can upload 5 documents for a paper



// get all the documents for the paper
// params : id --> paper id
router.get("/all/:id",authenticateToken, async (req, res) => {
    const user_id = req.user_id;
    const paper_id = req.params.id;
    // console.log("paper_id",paper_id);
    try {
        const user = await User.findById(user_id);
        if(!user){
            return res.status(400).send("Bad Request");
        }
        const paper = await Paper.findById(paper_id).populate("documents");
        if(!paper){
            return res.status(400).send("Bad Request");
        }
        if(paper.author_id != user_id){
            return res.status(403).send("Unauthorized access");
        }
        if(paper.documents.length == 0){
            return res.status(400).send("No documents found");
        }
        // console.log(typeof(document.file.data));
        res.set('Content-Type', 'application/pdf');
        res.send(paper.documents);
    }
    catch (error) {
        res.status(400).send({
            message : error.message
        })
    }
});


// get the latest documents for the user
router.get("/get-latest/:id",authenticateToken, async (req, res) => {
    const user_id = req.user_id;
    const paper_id = req.params.id;
    // console.log("paper_id",paper_id);
    try {
        const user = await User.findById(user_id);
        if(!user){
            return res.status(400).send("Bad Request");
        }
        const paper = await Paper.findById(paper_id);
        if(!paper){
            return res.status(400).send("Bad Request");
        }
        if(paper.author_id != user_id){
            return res.status(403).send("Unauthorized access");
        }
        if(paper.documents.length == 0){
            return res.status(400).send("No documents found");
        }
        const document = await Document.findById(paper.documents[paper.documents.length-1]);
        // console.log(typeof(document.file.data));
        res.set('Content-Type', 'application/pdf');
        res.send(document);
    }
    catch (error) {
        res.status(400).send({
            message : error.message
        })
    }
});

// upload a new document
// body : changes_description
// file : pdf-file
router.post("/upload/:id",authenticateToken,upload.single('pdf-file'), async (req, res) => {
    const user_id = req.user_id;
    const paper_id = req.params.id;
    const file = req.file;
    const {changes_description} = req.body;
    const updated_at = new Date();

    
    if(!req.file){
        // console.log("Bad Request");
        console.log("file is null or undefined");
        return res.status(400).send("Bad Request");
    }
    try {
        const user = await User.findById(user_id);
        const paper = await Paper.findById(paper_id);
        if(!user || !paper){
            console.log("user or paper not found");
            return res.status(400).send("Bad Request");
        }
        if(paper.author_id != user_id){
            return res.status(403).send({message : "Unauthorized access"});
        }
        if(paper.documents.length >= MAX_DOCS){
            return res.status(400).send({message : "Can only upload at max 5 documents for a paper"});
        }
        // console.log(file.buffer);
        var buffer = file.buffer;
        // console.log(buffer);
        // console.log("file size",buffer.length);
        // if(buffer.length > MAX_FILE_SIZE){
        //     return res.status(400).send("File size exceeded");
        // }
        if(paper.documents.length == 0){
            changes_description = "Initial document upload";
        }
        const document = new Document({
            file : buffer,
            changes_description,
            updated_at,
            original_name : file.originalname
        });
        // console.log(document);
        const savedDocument = await document.save();
        paper.documents.push(savedDocument._id);
        await paper.save();
        res.send("Document uploaded successfully");
    } catch (error) {
        res.status(400).send({
            message : error.message
        })
    }
    // console.log(file);
});


// update the document
// body : changes_description
// params : id --> document id, paper-id --> paper id
// file : pdf-file
router.put("/paper/:paper-id/update/:id",authenticateToken, async (req, res) => {
    const user_id = req.user_id;
    const document_id = req.params.id;
    const paper_id = req.params.paper_id;
    const {changes_description} = req.body;
    try {
        const user = await User.findById(user_id);
        if(!user){
            return res.status(400).send("Bad Request");
        }
        const paper = await Paper.findById(paper_id);
        if(!paper){
            return res.status(400).send("Bad Request");
        }
        if(paper.author_id != user_id){
            return res.status(403).send("Unauthorized access");
        }
        const document = await Document.findById(document_id);
        if(!document){
            return res.status(400).send("Bad Request document not found Document Id : "+document_id);
        }
        
        document.changes_description = changes_description;
        document.updated_at = new Date();
        await document.save();
        res.send("Document updated successfully");
    } catch (error) {
        res.status(400).send({ 
            message : error.message
        });
    }
});

// delete the document
// if the documents are 1 then it will through an error
// params : id --> document id, paper-id --> paper id
router.delete("/paper/:paper-id/delete/:id",authenticateToken, async (req, res) => {
    const user_id = req.user_id;
    const document_id = req.params.id;
    const paper_id = req.params.paper_id;
    try {
        const user = await User.findById(user_id);
        if(!user){
            return res.status(400).send({message : "Bad Request"});
        }
        const paper = await Paper.findById(paper_id);
        if(!paper){
            return res.status(400).send({message : "Bad Request"});
        }
        if(paper.author_id != user_id){
            return res.status(403).send({message : "Unauthorized access"});
        }
        if(paper.documents.length == 1){
            return res.status(400).send({message : "Atleast one document should be present"});
        }
        const document = await Document.findById(document_id);
        if(!document){
            return res.status(400).send({message : `Bad Request document not found Document Id : ${document_id}`});
        }
        const deletedDoc = await Document.deleteOne({_id : document_id});
        paper.documents = paper.documents.filter((doc) => doc != document_id);
        await paper.save();
        res.send({message : "Document deleted successfully"});

    } catch (error) {
        res.status(400).send({
            message : error.message
        });
    }
});

module.exports = router;