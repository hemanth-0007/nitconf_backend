const validator = require("validator");
const MAX_TAGS = 5;
const MIN_DES_LEN = 10;
const MAX_DES_LEN = 300;
const MIN_TITLE_LEN = 4;
const MAX_TITLE_LEN = 100;
const MAX_TAG_LEN = 20;
const MIN_TAG_LEN = 4;

    //  assuming that the paper object has the following properties
    // title > 4 and < 100 and all alphabets and may spaces
    // description > 10 and < 300 and all alphabets and may spaces
    // tags array of strings, each string > 4 and < 20 and all alphabets
    // tags are limited to 5 and no duplicates



const validatePaperRequest = (req, res, next) => {
  const { title, description, tags } = req.body;
  if(title === undefined || description === undefined || tags === undefined){
   return res.status(400).send({message: "Please provide all the fields"});
  }
  if(title === null || description === null || tags === null){
    return res.status(400).send({message: "Please provide all the some are null"});
  }
  if(tags.length === 0){
    return res.status(400).send({message: "Tags cannot be empty"});
  }
  if(!validator.isAlpha(title, 'en-US', {ignore: ' '}) || !validator.isAlpha(description , 'en-US', {ignore: ' '})){
    return res.status(400).send({message: "Title and description should be alphabets"});
  }
  if (validator.isEmpty(title) || validator.isEmpty(description)){
    return res.status(400).send({message: "Title and description should not be empty"});
  }
  if (description.length < MIN_DES_LEN || description.length > MAX_DES_LEN) {
    return res.status(400).send({message: `Description should be between ${MIN_DES_LEN} and ${MAX_DES_LEN} characters`});
  }
  if (title.length < MIN_TITLE_LEN || title.length > MAX_TITLE_LEN){
    return res.status(400).send({message: `Description should be between ${MIN_TITLE_LEN} and ${MAX_TITLE_LEN} characters`});
  }
  if(tags.length > MAX_TAGS){
    // console.log("tags length is greater than MAX_TAGS");
    return res.status(400).send({message: `Tags should be less than ${MAX_TAGS}`});
  }
  // initialize set in javascript
  let tagSet = new Set();
  for (let index = 0; index < tags.length; index++) {
    const element = tags[index];
    const tag = element.trim();
    if (tag.length < MIN_TAG_LEN || tag.length > MAX_TAG_LEN || !validator.isAlpha(tag,'en-US', {ignore: ' '})){
      // console.log("tag is not valid");
      return res.status(400).send({message: `Tag should be between ${MIN_TAG_LEN} and ${MAX_TAG_LEN} characters and should be alphabets only`});
    }
    if(tagSet.has(getProperString(tag))){
      // console.log("tag is duplicate");
      return res.status(400).send({message: "Tags should be unique"});
    }
    tagSet.add(getProperString(tag));
  }
  // delete tagSet;
  next();
};

const getProperString = (str) => {
  return str.split('').filter(e => e.trim().length).join('').toLowerCase();
}
// console.log(validator.isAlpha("HelloWorld", " "));
// validor.isAlpha("HelloWorld", " "); should ignore spaces
// console.log(validator.isAlpha("Hello World", 'en-US', {ignore: ' '})); // true



module.exports = validatePaperRequest;
