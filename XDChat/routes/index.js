// var express = require('express');
// var router = express.Router();

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'XiaoDaiChat' });
// });

// module.exports = router;
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { title: 'XiaoDaiChat' });
});

router.route('/login')
.get(function(req, res) {
    res.render('login', { title: 'login' });
})
.post(function(req, res) {
    var user = {
        username: 'admin',
        password: '123456'
    }
    if(req.body.username === user.username && req.body.password === user.password){
        req.session.user = user;
        res.redirect('/home');
    } else {
        res.redirect('/login');
    }
});

router.get('/logout', function(req, res) {
    req.session.user = null;
    res.redirect('/');
});

router.get('/home', function(req, res) {
    res.render('home', { title: 'Home' });
});

module.exports = router;

// module.exports = function(app){
// 	app.get('/', function(req, res){
// 		res.sendfile('views/index.html');
// 	});
// 	app.get('/user', function(req, res){
// 		var user = {
//          	username: 'admin',
//          	password: '123456'
//      	}
//      	var t =  req.body.username;
//      	console.log(t);
//     	if (req.body.username == user.username && req.body.password == user.password) {
// 			res.sendfile('views/user.html');
//      	} else {
//          	res.sendfile('views/user.html');
//      	}
// 	});
	
// };
