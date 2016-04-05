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
var userdatabase = require('../database/userdatabase');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { title: 'XiaoDaiChat' });
});

router.route('/userlogin')
.get(function(req, res) {
    if (req.session.user) {
        res.redirect('/home');
    }
    res.render('userlogin', { title: '用户登录' });
})
.post(function(req, res) {
    var user = {
        username: 'admin',
        password: '123456'
    }
    // req.assert('username', "用户名不能为空").notEmpty();
    // req.assert('password', "密码不能为空").notEmpty();
    if (req.body.username === user.username && req.body.password === user.password) {
        req.session.user = user;
        res.redirect('/home');
    } else {
        req.session.error='用户名或密码不正确';
        res.redirect('/userlogin');
    }
});




router.route('/register')
.get(function(req, res) {
    if (req.session.user) {
        res.redirect('/home');
    }
    res.render('register', { title: '用户注册' });
})
.post(function(req, res) {
    var name = req.body.username;
  	var pwd = req.body.password;
  	var newUser = new userdatabase({
    	username: name,
    	password: pwd
  	});
  	newUser.isexist(name,function(name,callback){
  		if(!callback)｛
  			newUser.save(function (err, user) {
    		//相关操作，写入session
    		res.send(user);
  			｝
  		else{
  			req.alert('客户号或密码不正确');
        	res.redirect('/register');
  		} 
  	});



 	
  });
});



router.route('/custom_servicelogin')
.get(function(req, res) {
    if (req.session.user) {
        res.redirect('/home');
    }
    res.render('custom_servicelogin', { title: '客服登录' });
})
.post(function(req, res) {
    var user = {
        username: '1',
        password: '1'
    }
    // req.assert('username', "用户名不能为空").notEmpty();
    // req.assert('password', "密码不能为空").notEmpty();
    if (req.body.username === user.username && req.body.password === user.password) {
        req.session.user = user;
        res.redirect('/home');
    } else {
        req.session.error='客户号或密码不正确';
        res.redirect('/custom_servicelogin');
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