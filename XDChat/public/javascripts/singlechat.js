var socket=io.connect();//与服务器进行连接 
var singlechat_from = window.name.split("/")[0];
var singlechat_to = window.name.split("/")[2];
var input = document.getElementById('message');
var messagebox = document.getElementById('messagebox');

// socket.on('singlechatinit',function(data){
	
// });
socket.on('singlechatMeg',function(data){
	
	if(data.name === singlechat_from ||data.name === singlechat_to ||data.to === singlechat_from ||data.to === singlechat_to ){
		//messagebox.value=data.name+data.to+data.context+" "+singlechat_from+singlechat_to;
		var time = new Date();
        	hours = time.getHours();
        	minutes = time.getMinutes();
        	seconds = time.getSeconds();
        	minutes = changetime(minutes);
        	hours = changetime(hours);
        	seconds = changetime(seconds);
        var output = hours+":"+minutes+":"+seconds+":"+"\n";
        	output += data.name +":"+data.context+"\n";
        messagebox.value += output;
        scrollTop();
	}
});
socket.on('singlechatexit',function(data){
	if(data.name === singlechat_from ||data.name === singlechat_to ||data.to === singlechat_from ||data.to === singlechat_to ){
		window.close();
	}
});

function changetime(data){
    	if(data < 10){
    		return "0"+data;
    	}
    	return data;
    }
function sendMeg(){
	if(input.value == ""){
            window.alert("输入不能为空！！");
    }
    else {
        socket.emit('singlechatMeg', {
            from : singlechat_from,
            to : singlechat_to,
            context : input.value
        });
        input.value="";  
     }
}

function scrollTop(){
        document.getElementById("messagebox").scrollTop = document.getElementById("messagebox").scrollHeight;
   }

// function singlechatinit(){
// 	socket.emit('singlechatinit', {from:singlechat_from
//         });
// }

document.getElementById("message").onkeydown = function(e) {
    e = e || event;
    console.log(e.keyCode);
    if (e.keyCode === 13) {
       sendMeg();
    }
};

function singlechatexit(){
	socket.emit('singlechatexit',{from:singlechat_from,to:singlechat_to});
}