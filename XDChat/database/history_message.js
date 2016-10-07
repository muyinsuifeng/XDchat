var mongodb = require('./msession');
var moment = require('moment');
function history_message(history_message) {

  this.from = history_message.from;
  this.to = history_message.to;
  this.context = history_message.context;
  // this.years = history_message.years;
  // this.months = history_message.months;
  // this.days = history_message.days;
  // this.hours = history_message.hours;
  // this.minutes = history_message.minutes;
  // this.seconds = history_message.seconds;
  //this.date = new Date(moment(history_message.date).format('YYYY-MM-DD HH:mm:ss'));
  this.date = history_message.date;
  this.gettime = history_message.gettime;
  //this.isonline = user.isonlie;
};
module.exports = history_message;

//存储用户信息
history_message.prototype.save = function (callback) {
  //要存入数据库的用户文档
  var history_message = {
    from:this.from,
    to:this.to,
    context:this.context,
    // years:this.years,
    // months:this.months,
    // days:this.days,
    // hours:this.hours,
    // minutes:this.minutes,
    // seconds:this.seconds,
    date:this.date,
    gettime :this.gettime,
  };
  //打开数据库

  console.log("save",history_message.date,typeof(history_message.date));
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err); //错误，返回 err 信息
    }
    //读取 users 集合
    db.collection('history_message', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err); //错误，返回 err 信息
      }
      //将用户数据插入 users 集合
      collection.insert(history_message, {
        safe: true
      }, function (err) {
        mongodb.close();
        if (err) {
          return callback(err); //错误，返回 err 信息
        }
        return callback(null); //成功！err 为 null，并返回存储后的用户文档
      });
    });
  });
};





//判断是否在DB里
history_message.prototype.findhistory = function(sendfrom,sendto,from_time,to_time,callback) {
  //打开数据库
  // console.log("sendfrom:"+sendfrom,"sendto:"+sendto,"from_time:"+from_time,"to_time:"+to_time);
  // console.log(typeof(from_time)+typeof(to_time));
  // var newfromDate = new Date(from_time);
  // newfromDate.setHours(newfromDate.getHours()-8);
  // var newtoDate = new Date(to_time);
  // newtoDate.setHours(newtoDate.getHours()-8);
  // console.log(newfromDate,newtoDate);
      console.log(from_time);
      console.log(to_time);
  mongodb.open(function (err, db) {
    //读取 users 集合
    db.collection('history_message', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err,null);//错误，返回 err 信息
      }
      collection.find(
        {"$and":
          [
            {"$and":
                  [
                  {"from":
                      {"$in":
                            [sendfrom,sendto]
                      }
                  },
                  {"to":
                      {"$in":
                            [sendfrom,sendto]
                      }
                  }
                  ]
             }
              ,
              {"gettime":
                      {"$gte":from_time,"$lte":to_time}
              }
              
          ]

        }
                      
                      
      ).toArray(function (err, history) {
        mongodb.close();
        console.log("history_message"+history);
        if(!history_message) return callback(err,null);
        else return callback(null,history);

      });
      // collection.aggregate(
      //                     [
      //                         {$match:{
      //                             "$or":[
      //                                   {"from":
      //                                         {"$in":
      //                                               [sendfrom,sendto]
      //                                         }
      //                                   },
      //                                   {"to":
      //                                         {"$in":
      //                                               [sendfrom,sendto]
      //                                         }
      //                                   }
      //                                   ]
      //                                 }
      //                         },
      //                         {$group:
      //                                   {"years":
      //                                           {"$gte":from_time[0],"$lte":to_time[0]}
      //                                   }
      //                                   ,
      //                                   {"months":
      //                                           {"$gte":from_time[1],"$lte":to_time[1]}
      //                                   }
      //                                   ,
      //                                    {"days":
      //                                           {"$gte":from_time[2],"$lte":to_time[2]}
      //                                   }
                                      

      //                         }

      //                     ]
      // ).toArray(function (err, history) {
      //   mongodb.close();
      //   console.log("history_message"+history);
      //   if(!history_message) return callback(err,null);
      //   else return callback(null,history);

      // });
    });
  });
};
