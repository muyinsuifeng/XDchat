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
var user_online = [];
var server_online = [];
var formidable = require('formidable');
var fs = require('fs');
var TITLE = 'formidable上传示例';
var AVATAR_UPLOAD_FOLDER = '/avatar/';


/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { title: 'XiaoDaiChat' });
});





router.route('/userlogin')
.get(function(req, res) {
    // if (req.session.user) {
    //     res.redirect('/home');
    // }
    res.render('userlogin', { title: '用户登录' });
})
.post(function(req, res) {
    // var user = {
    //     username: 'admin',
    //     password: '123456'
    // }
    // req.assert('username', "用户名不能为空").notEmpty();
    // req.assert('password', "密码不能为空").notEmpty();
    // if (req.body.username === user.username && req.body.password === user.password) {
    //     req.session.user = user;
    //     res.redirect('/home');
    // } else {
    //     req.session.error='用户名或密码不正确';
    //     res.redirect('/userlogin');
    // }
    var name = req.body.username;
  	var pwd = req.body.password;
  	var newUser = new userdatabase({
  		type: "user",
    	name: name,
    	password: pwd
  	});
  	newUser.isexist(name,function(err,user){
  		//console.log("1");
  		if(!user || user.type !== "user"){//console.log("2");
  			req.session.error='用户不存在';
        	res.redirect('/userlogin');
  		}
  		else{
  			if(user.password == pwd){
  				//console.log("3");
          if(isexist(user_online,name)){
            req.session.error='该用户已登录';
            res.redirect('/userlogin');
          }
          else {
            req.session.user = user;
            user_online.push(name);
            res.redirect('/home');
          }
  			}
  			else{//console.log("4");
  				req.session.error='密码错误';
        		res.redirect('/userlogin');
  			}
  		}
  	});
});

function isexist(array,name){
  for(var i in array ){
    if(array[i] === name) return true;
  }
  return false;
}



router.route('/register')
.get(function(req, res) {
    // if (req.session.user) {
    //     res.redirect('/home');
    // }
    res.render('register', { title: '用户注册' });
})
.post(function(req, res) {
    var name = req.body.username;
  	var pwd = req.body.password;
  	var newUser = new userdatabase({
  		type: "user",
    	name: name,
    	password: pwd
  	});
  	newUser.isexist(name,function(err,user){

  		if(user){
  			 req.session.error='该用户已存在';
        	res.redirect('/register');
  		}
  		else{newUser.save(function (err, user) {
    		//相关操作，写入session
    	
    		req.session.error='注册成功';
    		res.send(user);
    		res.redirect('/register');

  			});
  		}
  	});





  	
});



router.route('/custom_servicelogin')
.get(function(req, res) {
    // if (req.session.user) {
    //     res.redirect('/home');
    // }
    res.render('custom_servicelogin', { title: '客服登录' });
})
 .post(function(req, res) {
//     var user = {
//         username: '1',
//         password: '1'
//     }
//     // req.assert('username', "用户名不能为空").notEmpty();
//     // req.assert('password', "密码不能为空").notEmpty();
//     if (req.body.username === user.username && req.body.password === user.password) {
//         //req.session.user = user;
//         res.redirect('/home');
//     } else {
//         req.session.error='客户号或密码不正确';
//         res.redirect('/custom_servicelogin');
//     }
	var name = req.body.username;
  	var pwd = req.body.password;
  	var newUser = new userdatabase({
  		type: "service",
    	name: name,
    	password: pwd
  	});
  	newUser.isexist(name,function(err,user){
  		//console.log("1");
  		if(!user || user.type !== "service"){//console.log("2");
  			req.session.error='客服不存在';
        	res.redirect('/custom_servicelogin');
  		}
  		else{
  			if(user.password == pwd){
  				//console.log("3");
          if(isexist(server_online,name)){
            req.session.error='该客服已登录';
            res.redirect('/custom_servicelogin');
          }
          else {
            req.session.user = user;
            server_online.push(name);
            res.redirect('/home');
          }
  				  
  			}
  			else{//console.log("4");
  				req.session.error='密码错误';
        		res.redirect('/custom_servicelogin');
  			}
  		}
  	});

});

router.get('/logout', function(req, res) {
    req.session.user = null;
    res.redirect('/');
});

// router.get('/home', function(req, res) {
//     authentication(req, res);
//     var user =req.session.user ;
//     req.session.user = null;
//     res.render('home', { title: user });
    
// });
router.route('/home')
.get( function(req, res) {
    authentication(req, res);
    var user =req.session.user ;
    console.log("/home"+user.name+user.type);
    req.session.user = null;
    res.render('home', { title: user});
    
})
 .post(function(req, res) {
  var name = req.body.logout_name;
  var type = req.body.logout_type;

  console.log(name);
  if(type === "user"){
    for(var i in user_online){
      if(user_online[i] === name){
        user_online.splice(i,1);
      }
    }
  }
  else{
    for(var i in server_online){
      if(server_online[i] === name){
        server_online.splice(i,1);
      }
    }
  }
  res.redirect('/logout');

});

// router.get('/singlechat', function(req, res) {
//     res.render('singlechat', { title: "singleservice" });
    
// });
router.route('/singlechat')
.get( function(req, res) {
    res.render('singlechat', { title: "singleservice" });
})
// .post(function(req, res) {
//   var form = new formidable.IncomingForm();   //创建上传表单
//     form.encoding = 'utf-8';    //设置编辑
//     form.uploadDir = 'public' + AVATAR_UPLOAD_FOLDER;  //设置上传目录
//     form.keepExtensions = true;  //保留后缀
//     form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小

//   form.parse(req, function(err, fields, files) {

//     if (err) {
//       res.locals.error = err;
//       res.render('singlechat', { title: TITLE });
//       return;   
//     }  
     
//     var extName = '';  //后缀名
//     switch (files.fulAvatar.type) {
//       case 'image/pjpeg':
//         extName = 'jpg';
//         break;
//       case 'image/jpeg':
//         extName = 'jpg';
//         break;     
//       case 'image/png':
//         extName = 'png';
//         break;
//       case 'image/x-png':
//         extName = 'png';
//         break;     
//     }

//     if(extName.length == 0){
//         res.locals.error = '只支持png和jpg格式图片';
//         res.render('singlechat', { title: TITLE });
//         return;          
//     }

//     var avatarName = Math.random() + '.' + extName;
//     var newPath = form.uploadDir + avatarName;

//     console.log(newPath);
//     fs.renameSync(files.fulAvatar.path, newPath);  //重命名
//   });

//   res.locals.success = '上传成功';
//   res.render('singlechat', { title: TITLE });

// });

 
router.route('/filesendopen')
.get( function(req, res) {
    res.render('filesendopen', { title: "newPath"});
})
.post(function(req, res) {
  var avatarName = Math.random() + '.' + extName;
    var newPath = form.uploadDir + avatarName;
  var form = new formidable.IncomingForm();   //创建上传表单
    form.encoding = 'utf-8';    //设置编辑
    form.uploadDir = 'public' + AVATAR_UPLOAD_FOLDER;  //设置上传目录
    form.keepExtensions = true;  //保留后缀
    form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小

  form.parse(req, function(err, fields, files) {

    if (err) {
      res.locals.error = err;
      res.render('filesendopen', { title: newPath});
      return;   
    }  
     
    var extName = '';  //后缀名
    switch (files.fulAvatar.type) {
      case 'image/pjpeg':
        extName = 'jpg';
        break;
      case 'image/jpeg':
        extName = 'jpg';
        break;     
      case 'image/png':
        extName = 'png';
        break;
      case 'image/x-png':
        extName = 'png';
        break;     
    }

    if(extName.length == 0){
        res.locals.error = '只支持png和jpg格式图片';
        res.render('filesendopen', { title: newPath });
        return;          
    }

    

    console.log(newPath);
    fs.renameSync(files.fulAvatar.path, newPath);  //重命名
  });

  res.locals.success = '上传成功';
  res.render('filesendopen', { title: newPath });

});


function authentication(req, res) {
    if (!req.session.user) {
        return res.redirect('/');
    }
}




module.exports = router;