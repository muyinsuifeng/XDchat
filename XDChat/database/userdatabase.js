var mongodb = require('./msession');

function User(user) {

  this.name = user.name;
  this.type = user.type;
  this.password = user.password;
  //this.isonline = user.isonlie;
};

module.exports = User;

//存储用户信息
User.prototype.save = function (callback) {
  //要存入数据库的用户文档
  var user = {
    type: this.type,
    name: this.name,
    password: this.password
    //isonline: false
  };
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err); //错误，返回 err 信息
    }
    //读取 users 集合
    db.collection('users', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err); //错误，返回 err 信息
      }
      //将用户数据插入 users 集合
      collection.insert(user, {
        safe: true
      }, function (err, user) {
        mongodb.close();
        if (err) {
          return callback(err); //错误，返回 err 信息
        }
        return callback(null, user[0]); //成功！err 为 null，并返回存储后的用户文档
      });
    });
  });
};

//读取用户信息
// User.prototype.get = function(name, callback) {
//   //打开数据库
//   mongodb.open(function (err, db) {
//     if (err) {
//       return callback(err);//错误，返回 err 信息
//     }
//     //读取 users 集合
//     db.collection('users', function (err, collection) {
//       if (err) {
//         mongodb.close();
//         return callback(err);//错误，返回 err 信息
//       }
//       //查找用户名（name键）值为 name 一个文档
//       collection.findOne({
//         name: name
//       }, function (err, user) {
//         mongodb.close();
//         if (err) {
//           return callback(err);//失败！返回 err 信息
//         }
//         callback(null, user);//成功！返回查询的用户信息
//       });
//     });
//   });
// };

//判断是否在DB里
User.prototype.isexist = function(name,callback) {
  //打开数据库
  mongodb.open(function (err, db) {
    //读取 users 集合
    db.collection('users', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);//错误，返回 err 信息
      }
      collection.findOne({
        name: name
      }, function (err, user) {
        mongodb.close();
        if (!user) {
          return callback(err,user);//失败！返回 err 信息
         }
         else {
            if(user.name == name&& user.type == "user"){
              return callback(null, user);//成功！返回查询的用户信息
            }
            else {
              return callback(err,user);
            }
         }
       
      });  
    });
  });
};


// 更改用户信息
// User.prototype.change_offline = function(name) {
//   //打开数据库
//   mongodb.open(function (err, db) {
//     if (err) {
//       return callback(err);//错误，返回 err 信息
//     }
//     //读取 users 集合
//     db.collection('users', function (err, collection) {
//       if (err) {
//         mongodb.close();
//         return callback(err);//错误，返回 err 信息
//       }
//       //查找用户名（name键）值为 name 一个文档
//       collection.update({
//         name: name
//       }, {$set:{isonline:false}},function (err, user) {
//         mongodb.close();
//         if (err) {
//           console.log(result);
//         }
//         console.log(err);
//       });
//     });
//   });
// };

// 更改用户信息
// User.prototype.change_online = function(name) {
//   //打开数据库
//   mongodb.open(function (err, db) {
//     if (err) {
//       return callback(err);//错误，返回 err 信息
//     }
//     //读取 users 集合
//     db.collection('users', function (err, collection) {
//       if (err) {
//         mongodb.close();
//         return callback(err);//错误，返回 err 信息
//       }
//       //查找用户名（name键）值为 name 一个文档
//       collection.update({
//         name: name
//       }, {$set:{isonline:true}},function (err, user) {
//         mongodb.close();
//         if (err) {
//           console.log(result);
//         }
//         console.log(err);
//       });
//     });
//   });
// };