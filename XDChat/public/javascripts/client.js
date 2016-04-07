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
    }) ;
    socket.on('link', function(data) {  
        //将消息输出到控制台 
        document.getElementById('roominfo').innerHTML = "当前在线人数:" + data.connectnumber;
        document.getElementById('roominfo2').innerHTML = "当前在线:";
        for(var i in data.connectuser)
             document.getElementById('roominfo2').innerHTML +=  data.connectuser[i]+" ";
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
    })   
    function link(){
    	socket.emit('link', {
            id:id,
    		type:type,
    		from:name,
    	});
    }
    function sendMeg(){  
        socket.emit('Meg', {
            from : name,
            context : input.value
        });
        input.value="";//发送一个名为foo的事件，并且传递一个字符串数据‘hello’  
    }  
    function changetime(data){
    	if(data < 10){
    		return "0"+data;
    	}
    	return data;
    }