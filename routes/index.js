var express = require('express');
var router = express.Router();
var fs = require('fs');
var multer = require('multer');
var uploading = multer({
  dest: 'temporary'
});

var destinationFolder = "dest";//has to be created

//the destination folder that we are watching... triggers the transformation process
fs.watch('dest', function (event, filename) {
  console.log('event is: ' + event);
  if (filename) {
    console.log('filename provided: ' + filename);
  } else {
    console.log('filename not provided');
  }
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'PoC' });
});

router.post('/upload', uploading.single('file'), function(req, res,next) {
    console.log("file upload");
    var file = req.file;
    console.log(file.originalname+ " " +file.size +" path:"+file.path);
    console.log(file.filename);
    //move to the destination folder
    fs.rename(file.path, destinationFolder+ "\\"+file.originalname, function(err) {
        if (err) throw err;
        // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
        fs.unlink(file.path, function() {
            if (err) throw err;
        });
    });
     res.status(204).end()
});
module.exports = router;
