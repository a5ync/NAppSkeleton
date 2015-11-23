var express = require('express');
var router = express.Router();

var multer = require('multer');
var uploading = multer({
  dest: 'temporary..'
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'PoC' });
});

router.post('/upload', uploading.single('displayImage'), function(req, res, next) {
    console.log("upload");
     res.status(204).end()

});
module.exports = router;
