var picktime_from = document.getElementById('time_from');
var picktime_to = document.getElementById('time_to');
var history_from = window.name.split("/")[0];
var history_to = window.name.split("/")[2];
//var history_message = require('./database/history_message');
var socket=io.connect();
//var from_time = "2000-01-01 00:00:00";
Date.prototype.format = function (format) {
           var args = {
               "M+": this.getMonth() + 1,
               "d+": this.getDate(),
               "h+": this.getHours(),
               "m+": this.getMinutes(),
               "s+": this.getSeconds(),
               "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
               "S": this.getMilliseconds()
           };
           if (/(y+)/.test(format))
               format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
           for (var i in args) {
               var n = args[i];
               if (new RegExp("(" + i + ")").test(format))
                   format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? n : ("00" + n).substr(("" + n).length));
           }
           return format;
       };

function history_message(){
	 console.log(picktime_from.value);
	 console.log(typeof(picktime_from.value));
	 console.log(picktime_to.value);
	 console.log(typeof(picktime_to.value));
	 var p_from = picktime_from.value+" 00:00:00";
	 var p_to = picktime_to.value+" 23:59:59";
	 //var  from_time   =   new   Date(str.replace(/-/g,   "/"));
	 var d = new Date(); 
		d.setYear(parseInt(p_from.substring(0,4),10)); 
		d.setMonth(parseInt(p_from.substring(5,7)-1,10)); 
		d.setDate(parseInt(p_from.substring(8,10),10)); 
		d.setHours(parseInt(p_from.substring(11,13),10)); 
		d.setMinutes(parseInt(p_from.substring(14,16),10)); 
		d.setSeconds(parseInt(p_from.substring(17,19),10)); 
	 var from_time = d.getTime();
	 d = new Date(); 
		d.setYear(parseInt(p_to.substring(0,4),10)); 
		d.setMonth(parseInt(p_to.substring(5,7)-1,10)); 
		d.setDate(parseInt(p_to.substring(8,10),10)); 
		d.setHours(parseInt(p_to.substring(11,13),10)); 
		d.setMinutes(parseInt(p_to.substring(14,16),10)); 
		d.setSeconds(parseInt(p_to.substring(17,19),10)); 
	 var to_time = d.getTime();
	// from_time = picktime_from.value;
	// // var datetime = picktime_from.value.split(' ');
	// // var from_date = datetime[0].split('-');
	// // var from_time = datetime[1].split(':');
	// //  console.log(from_date);
	// //  console.log(from_time);
	// var time = new Date().format("yyyy-MM-dd hh:mm:ss");
	// // console.log(time);
 // //        years = time.getFullYear();
 // //        months = time.getMonth()+1;
 // //        months = changetime(months);
 // //        days = time.getDate();
 // //        days = changetime(days);
 // //        hours = time.getHours();
 // //        minutes = time.getMinutes();
 // //        seconds = time.getSeconds();
 // //        minutes = changetime(minutes);
 // //        hours = changetime(hours);
 // //        seconds = changetime(seconds);
 // //    var to_date =[years,months,days];
 // //    var to_time = [hours,minutes,seconds];
 //   // console.log(to_date);
 //    console.log(time); 
    socket.emit("history_message",{
    	from:history_from,
    	to:history_to,
    	from_time:from_time,
    	to_time:to_time
    }); 
    // var Newhistory_message = new history_message({
    // 		from:history_from,
    // 		to:history_to,
    // 		context:"",
    // 		date:""
    // });
    // Newhistory_message.findhistory(history_from,history_to,picktime_from.value,time,function(err,history_message){
    // 		console.log(history_message);
    // });

}

socket.on("history_message",function(data){

	console.log("history_message:"+data.history_message);
	var history_message_box = document.getElementById("history_message");
	if(history_message){
		history_message_box.innerHTML  = "<p>";
		for(var i in data.history_message){
				history_message_box.innerHTML  += new Date(data.history_message[i].date).format("yyyy-MM-dd hh:mm:ss");
				history_message_box.innerHTML  += "--" ;
				history_message_box.innerHTML  += data.history_message[i].from ;
				history_message_box.innerHTML  += " to " ;
				history_message_box.innerHTML  += data.history_message[i].to ;
				history_message_box.innerHTML  += " : " ;
				history_message_box.innerHTML  += data.history_message[i].context;
				history_message_box.innerHTML  += "<br>";
		}
		history_message_box.innerHTML  += "</p>";
	}
	else{
		history_message_box.innerHTML = "<p>无聊天记录.</p>";
	}
	



});

// function changetime(data){
//       if(data < 10){
//         return "0"+data;
//       }
//       return data;
//     } 