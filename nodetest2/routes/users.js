var express = require('express');
var router = express.Router();

/*
 * GET userlist.
 */
router.get('/userlist', function(req, res) {
    var db = req.db;
    var collection = db.get('userlist');
    collection.find({},{},function(e,docs){
        res.json(docs);
    });
});

/* Post to AddUser*/
router.post('/adduser', function(req, res){
  var db = req.db;
  var collection = db.get('userlist');
  collection.insert(req.body, function(req,res){
    res.send(
      (err === null) ? {msg : ''} : {msg:err}
    );
  });
});

/* Delete User */
router.delete('/deleteuser/:id', function(req,res){
  var db =req.db;
  var collection = db.get('userlist');
  var userTodelete = req.params.id;
  collection.remove({'_id' : userTodelete}, function(err){
    res.send((err === null) ? {msg: ''} : {msg: 'err:' + err});
  });
});
module.exports = router;
