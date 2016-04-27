var socket=io.connect(),//与服务器进行连接  
    	name = document.getElementById('name').innerHTML;
    	type = document.getElementById('type').innerHTML;
    	button = document.getElementById('sendBtn');  
    	input = document.getElementById('message');
        id = document.getElementById('id').innerHTML;
        service_choice = document.getElementById('service_choice');
        // form = document.getElementById('form');
        logout_name = document.getElementById('logout_name');
        logout_type = document.getElementById('logout_type');
        // roominfo = document.getElementById('roominfo').innerHTML;
        // roominfo2 = document.getElementById('roominfo2').innerHTML;
    	messagebox = document.getElementById('messagebox');
    socket.on('Meg', function(data) {  
        //将消息输出到控制台 
        showtext(data);
        scrollTop();
    });
    socket.on('link', function(data) {  
        
        //将消息输出到控制台 
        document.getElementById('roominfo').innerHTML = "当前在线人数:" + data.connectnumber;
        showinfo(data);
        showlogintext(data);
        scrollTop();
    });   
    socket.on('logout', function(data) {  
        //将消息输出到控制台 
        document.getElementById('roominfo').innerHTML = "当前在线人数:" + data.connectnumber;
        showinfo(data);
        showlogouttext(data);
        scrollTop();
    });   
    
    function link(){
        console.log("link_before");
        document.getElementById('logout_name').value = name;
        document.getElementById('logout_type').value = type;
    	socket.emit('link', {
            id:id,
    		type:type,
    		from:name,
    	});
        console.log("link_after");
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


    function showinfo(data){
        document.getElementById('roominfo2').innerHTML = "当前在线:";
        document.getElementById('roominfo3').innerHTML = "";
        for(var i in data.connectuser){
            if(data.connectuser[i].type === "service"){
                if(data.connectuser[i].iswork === "not working")
                    document.getElementById('roominfo2').innerHTML +=  data.connectuser[i].from+"("+data.connectuser[i].type+"-"+data.connectuser[i].iswork+")  ";
                else 
                    document.getElementById('roominfo2').innerHTML +=  data.connectuser[i].from+"("+data.connectuser[i].type+"-"+data.connectuser[i].iswork+") ";           
            }
            else{
                document.getElementById('roominfo3').innerHTML +=  data.connectuser[i].from+"("+data.connectuser[i].type+") ";
            }
        }
        if(type == "user"){
            service_choice.innerHTML = "";
            for(var i in data.connectuser){
                if(data.connectuser[i].type === "service"){
                    if(data.connectuser[i].iswork === "not working"){
                        var text = document.createTextNode(data.connectuser[i].from);
                        var a = document.createElement("a");
                        a.appendChild(text);
                        a.setAttribute("onclick","addText(this)");
                        a.setAttribute("id",data.connectuser[i].from);
                        a.setAttribute("text-align","center");
                        a.setAttribute("line-height","50px");
                        var div = document.createElement("div");
                        div.appendChild(a);
                        div.setAttribute("class","client-list");
                        service_choice.appendChild(div);
                        service_choice.setAttribute("id",data.connectuser[i].from);
                    }   
                }   
            }
        }
        
    }
    function showlogintext(data){
        var time = new Date();
            hours = time.getHours();
            minutes = time.getMinutes();
            seconds = time.getSeconds();
            minutes = changetime(minutes);
            hours = changetime(hours);
            seconds = changetime(seconds);
        var output = "      "+hours+":"+minutes+":"+seconds+":"+"    ";
            output += data.userinfo.from+"加入了聊天室\n";
        messagebox.value += output;
    }
    function showlogouttext(data){
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
    }
    function showtext(data){
        var time = new Date();
            hours = time.getHours();
            minutes = time.getMinutes();
            seconds = time.getSeconds();
            minutes = changetime(minutes);
            hours = changetime(hours);
            seconds = changetime(seconds);
        var output = hours+":"+minutes+":"+seconds+":"+"    \n";
            output += data.from + ":" + data.context + "\n";
        messagebox.value += output;
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
		showinfo(data);
        if(data.name === name||data.to === name){
            if(data.name === name)
        	   window.open("singlechat",name+"/singlechat/"+data.to);
            else 
               window.open("singlechat",name+"/singlechat/"+data.name);
        }
	});
	socket.on('exit',function(data){
		showinfo(data);
	});
