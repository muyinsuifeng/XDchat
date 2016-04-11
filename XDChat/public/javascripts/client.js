var socket=io.connect(),//与服务器进行连接  
    	name = document.getElementById('name').innerHTML;
    	type = document.getElementById('type').innerHTML;
    	button = document.getElementById('sendBtn');  
    	input = document.getElementById('message');
        id = document.getElementById('id').innerHTML;
        // roominfo = document.getElementById('roominfo').innerHTML;
        // roominfo2 = document.getElementById('roominfo2').innerHTML;
    	messagebox = document.getElementById('messagebox');
    socket.on('Meg', function(data) {  
        //将消息输出到控制台 
        var time = new Date();
        	hours = time.getHours();
        	minutes = time.getMinutes();
        	seconds = time.getSeconds();
        	minutes = changetime(minutes);
        	hours = changetime(hours);
        	seconds = changetime(seconds);
        var output = hours+":"+minutes+":"+seconds+":"+"\n";
        	output += data.from+":"+data.context+"\n";
        messagebox.value += output;
        scrollTop();
    });
    socket.on('link', function(data) {  
        //将消息输出到控制台 
        document.getElementById('roominfo').innerHTML = "当前在线人数:" + data.connectnumber;
        document.getElementById('roominfo2').innerHTML = "当前在线:";
        document.getElementById('roominfo3').innerHTML = "";
        for(var i in data.connectuser){
            if(data.connectuser[i].type === "service"){
                if(data.connectuser[i].iswork === "not working")
                    document.getElementById('roominfo2').innerHTML += "<button onclick='addText(this)'>" +data.connectuser[i].from+"("+data.connectuser[i].type+"-"+data.connectuser[i].iswork+") </button>";
                else 
                    document.getElementById('roominfo2').innerHTML +=  data.connectuser[i].from+"("+data.connectuser[i].type+"-"+data.connectuser[i].iswork+") ";           
            }
            else{
                document.getElementById('roominfo3').innerHTML +=  data.connectuser[i].from+"("+data.connectuser[i].type+") ";
            }
        }
        
            var time = new Date();
            hours = time.getHours();
            minutes = time.getMinutes();
            seconds = time.getSeconds();
            minutes = changetime(minutes);
            hours = changetime(hours);
            seconds = changetime(seconds);
        var output = "      "+hours+":"+minutes+":"+seconds+":"+"    ";
            output += data.userinfo.from+"加入聊天室\n";
        messagebox.value += output;
        scrollTop();
    });   
    socket.on('logout', function(data) {  
        //将消息输出到控制台 
        document.getElementById('roominfo').innerHTML = "当前在线人数:" + data.connectnumber;
        document.getElementById('roominfo2').innerHTML = "当前在线:";
        document.getElementById('roominfo3').innerHTML = "";
        for(var i in data.connectuser){
            if(data.connectuser[i].type === "service"){
                if(data.connectuser[i].iswork === "not working")
                    document.getElementById('roominfo2').innerHTML += "<button onclick='addText(this)'>" +data.connectuser[i].from+"("+data.connectuser[i].type+"-"+data.connectuser[i].iswork+") </button>";
                else 
                    document.getElementById('roominfo2').innerHTML +=  data.connectuser[i].from+"("+data.connectuser[i].type+"-"+data.connectuser[i].iswork+") ";           
            }
            else{
                document.getElementById('roominfo3').innerHTML +=  data.connectuser[i].from+"("+data.connectuser[i].type+") ";
            }
        }
            var time = new Date();
            hours = time.getHours();
            minutes = time.getMinutes();
            seconds = time.getSeconds();
            minutes = changetime(minutes);
            hours = changetime(hours);
            seconds = changetime(seconds);
        var output = "      "+hours+":"+minutes+":"+seconds+":"+"    ";
            output += data.userinfo.name+"退出了聊天室\n";
        messagebox.value += output;
        scrollTop();
    });   

    function link(){
    	socket.emit('link', {
            id:id,
    		type:type,
    		from:name,
    	});
    }
    function logout(){
        socket.emit('logout', {
            id:id,
            type:type,
            from:name,
        });
    }
    function sendMeg(){  
        if(input.value == ""){
            window.alert("输入不能为空！！");
        }
        else {
            socket.emit('Meg', {
                from : name,
                context : input.value
            });
            input.value="";
        }



        
    }  
    function changetime(data){
    	if(data < 10){
    		return "0"+data;
    	}
    	return data;
    }

    document.getElementById("message").onkeydown = function(e) {
        e = e || event;
        console.log(e.keyCode);
        if (e.keyCode === 13) {
            sendMeg();
            
        }
    };

   function reflash(){
        return "刷新将退出账号，你确定要退出？"
   }


   function scrollTop(){
        document.getElementById("messagebox").scrollTop = document.getElementById("messagebox").scrollHeight;
   }



//singlechat跳转

	function addText(obj){
   		var to = obj.innerText;
   		to = to.split("(")[0];
   		 socket.emit('singlechat', {
                from : name,
                id : id,
                type : type,
                to : to,
            });
	} 
	socket.on('singlechat',function(data){
		document.getElementById('roominfo2').innerHTML = "当前在线:";
        document.getElementById('roominfo3').innerHTML = "";
        for(var i in data.connectuser){
            if(data.connectuser[i].type === "service"){
            	if(data.connectuser[i].iswork === "not working")
                	document.getElementById('roominfo2').innerHTML += "<button onclick='addText(this)'>" +data.connectuser[i].from+"("+data.connectuser[i].type+"-"+data.connectuser[i].iswork+") </button>";
            	else 
            		document.getElementById('roominfo2').innerHTML +=  data.connectuser[i].from+"("+data.connectuser[i].type+"-"+data.connectuser[i].iswork+") ";        	
            }
            else{
                document.getElementById('roominfo3').innerHTML +=  data.connectuser[i].from+"("+data.connectuser[i].type+") ";
            }
        }
        if(data.name === name||data.to === name){
            if(data.name === name)
        	   window.open("singlechat",name+"/singlechat/"+data.to);
            else 
               window.open("singlechat",name+"/singlechat/"+data.name);
        }
	});
	socket.on('exit',function(data){
		document.getElementById('roominfo2').innerHTML = "当前在线:";
        document.getElementById('roominfo3').innerHTML = "";
        for(var i in data.connectuser){
            if(data.connectuser[i].type === "service"){
            	if(data.connectuser[i].iswork === "not working")
                	document.getElementById('roominfo2').innerHTML += "<button onclick='addText(this)'>" +data.connectuser[i].from+"("+data.connectuser[i].type+"-"+data.connectuser[i].iswork+") </button>";
            	else 
            		document.getElementById('roominfo2').innerHTML +=  data.connectuser[i].from+"("+data.connectuser[i].type+"-"+data.connectuser[i].iswork+") ";        	
            }
            else{
                document.getElementById('roominfo3').innerHTML +=  data.connectuser[i].from+"("+data.connectuser[i].type+") ";
            }
        }
	});

    