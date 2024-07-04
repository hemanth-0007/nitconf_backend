
 

const  validateDuplicatePapers = (userPapers, title) => {
    for (let index = 0; index < userPapers.length; index++) {
        const paper = userPapers[index];
        const paperTitle = paper.title;
        if(getProperString(paperTitle) === getProperString(title)) return false;
    }
    return true;
}
const getProperString = (str) => {
    return str.split('').filter(e => e.trim().length).join('').toLowerCase();
}

// console.log(" Hemanth venkata   sai".split('').filter(e => e.trim().length).join('').toLowerCase());

export { validateDuplicatePapers };