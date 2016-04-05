// var express = require('express');
// var router = express.Router();

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'XiaoDaiChat' });
// });

// module.exports = router;
//-----------------------------------------
// var express = require('express');
// var router = express.Router();

// /* GET home page. */
// router.get('/', function(req, res) {
//     res.render('index', { title: 'XiaoDaiChat' });
// });

// router.route('/login')
// .get(function(req, res) {
//     res.render('login', { title: 'login' });
// })
// .post(function(req, res) {
//     var user = {
//         username: 'admin',
//         password: '123456'
//     }
//     if(req.body.username === user.username && req.body.password === user.password){
//         req.session.user = user;
//         res.redirect('/home');
//     } else {
//         res.redirect('/login');
//     }
// });

// router.get('/logout', function(req, res) {
//     req.session.user = null;
//     res.redirect('/');
// });

// router.get('/home', function(req, res) {
//     res.render('home', { title: 'Home' });
// });

// module.exports = router;
//---------------------------------------------------
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
//--------------------------
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { title: 'Express' });
});

router.route('/login')
.get(function(req, res) {
    if (req.session.user) {
        res.redirect('/home');
    }
    res.render('login', { title: '用户登录' });
})
.post(function(req, res) {
    var user = {
        username: 'admin',
        password: '123456'
    }
    if (req.body.username === user.username && req.body.password === user.password) {
        req.session.user = user;
        res.redirect('/home');
    } else {
        req.session.error='用户名或密码不正确';
        res.redirect('/login');
    }
});

router.get('/logout', function(req, res) {
    req.session.user = null;
    res.redirect('/');
});

router.get('/home', function(req, res) {
    authentication(req, res);
    res.render('home', { title: 'Home' });
});

function authentication(req, res) {
    if (!req.session.user) {
        req.session.error='请先登录';
        return res.redirect('/login');
    }
}

module.exports = router;