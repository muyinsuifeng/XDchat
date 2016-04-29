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
        container = document.getElementById('historyMsg'),
    socket.on('Meg', function(data) {  
        //将消息输出到控制台 
        showtext(data);
        //scrollTop();
    });
    socket.on('link', function(data) {  
        
        //将消息输出到控制台 
        document.getElementById('roominfo').innerHTML = "当前在线人数:" + data.connectnumber;
        showinfo(data);
        showlogintext(data);
        //scrollTop();
    });   
    socket.on('logout', function(data) {  
        //将消息输出到控制台 
        document.getElementById('roominfo').innerHTML = "当前在线人数:" + data.connectnumber;
        showinfo(data);
        showlogouttext(data);
        //scrollTop();
    });   
    
    function linked(){
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

    // document.getElementById("sendemerg").onclick = function(){
    //     console.log("emergency send");
    //     socket.emit('emergency',{
    //         id:id,
    //         type:type,
    //         from:name
    //     });
    // }
    function sendemerg(){
        console.log("emergency send");
        socket.emit('emergency',{
            id:id,
            type:type,
            from:name
        });
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
    }

   function reflash(){
        return "刷新将退出账号，你确定要退出？"
   }


   // function scrollTop(){
   //      document.getElementById("messagebox").scrollTop = document.getElementById("messagebox").scrollHeight;
   // }


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
        var msgToDisplay = document.createElement('p');
        var time = new Date();
            hours = time.getHours();
            minutes = time.getMinutes();
            seconds = time.getSeconds();
            minutes = changetime(minutes);
            hours = changetime(hours);
            seconds = changetime(seconds);
        var output = "      "+hours+":"+minutes+":"+seconds+":"+"    ";
            output += data.userinfo.from+"加入了聊天室\n";
        //messagebox.value += output;
        msgToDisplay.innerHTML=output;
        container.appendChild(msgToDisplay);
        container.scrollTop = container.scrollHeight;
    }
    function showlogouttext(data){
        var msgToDisplay = document.createElement('p');
        var time = new Date();
            hours = time.getHours();
            minutes = time.getMinutes();
            seconds = time.getSeconds();
            minutes = changetime(minutes);
            hours = changetime(hours);
            seconds = changetime(seconds);
        var output = "      "+hours+":"+minutes+":"+seconds+":"+"    ";
            output += data.userinfo.name+"退出了聊天室\n";
        //messagebox.value += output;
        msgToDisplay.innerHTML=output;
        container.appendChild(msgToDisplay);
        container.scrollTop = container.scrollHeight;
    }
    function showtext(data){
        var msgToDisplay = document.createElement('p');
        var time = new Date();
            hours = time.getHours();
            minutes = time.getMinutes();
            seconds = time.getSeconds();
            minutes = changetime(minutes);
            hours = changetime(hours);
            seconds = changetime(seconds);
        var output = hours+":"+minutes+":"+seconds+":"+"    \n";
            output += data.from + ":" + showEmoji(data.context) + "\n";
        // messagebox.value += output;
        msgToDisplay.innerHTML=output;
        container.appendChild(msgToDisplay);
        container.scrollTop = container.scrollHeight;
       
    }
   function showEmoji(msg) {
    var match, result = msg,
        reg = /\[emoji:\d+\]/g,
        emojiIndex,
        totalEmojiNum = document.getElementById('emojiWrapper').children.length;
    while (match = reg.exec(msg)) {
        emojiIndex = match[0].slice(7, -1);
        if (emojiIndex > totalEmojiNum) {
            result = result.replace(match[0], '[X]');
        } else {
            result = result.replace(match[0], '<img src="./images/F_' + emojiIndex + '.gif" />');
        };
    };
    return result;
}

//singlechat跳转

	function addText(obj){
   		var to = obj.innerText;
   		to = to.split("(")[0];
   		 socket.emit('singlechat_req', {
                from : name,
                id : id,
                type : type,
                to : to
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
    socket.on('singlechat_req',function(data){
        if(data.to === name){
            if(window.confirm("收到"+data.from+"的客服请求，是否接受？")){
                socket.emit('singlechat',{data:data});
            }
        }
        
    });
	socket.on('exit',function(data){
		showinfo(data);
	});


//----------------emoji-----------
function initialEmoji(){
    var emojiContainer = document.getElementById('emojiWrapper'),
        docFragment = document.createDocumentFragment();
    for (var i = 40; i > 0; i--) {
        var emojiItem = document.createElement('img');
        emojiItem.src = './images/F_' + i + '.gif';
        emojiItem.title = i;
        docFragment.appendChild(emojiItem);
    };
    emojiContainer.appendChild(docFragment);
    emojiContainer.style.display = 'none';
}
this.initialEmoji();
 document.getElementById('emoji').addEventListener('click', function(e) {
     var emojiwrapper = document.getElementById('emojiWrapper');
     emojiwrapper.style.display = 'block';
     e.stopPropagation();
 }, false);
 document.body.addEventListener('click', function(e) {
     var emojiwrapper = document.getElementById('emojiWrapper');
     if (e.target != emojiwrapper) {
         emojiwrapper.style.display = 'none';
     };
 });
 document.getElementById('emojiWrapper').addEventListener('click', function(e) {
    //获取被点击的表情
    var target = e.target;
    if (target.nodeName.toLowerCase() == 'img') {
        var messageInput = document.getElementById('message');
        messageInput.focus();
        messageInput.value = messageInput.value + '[emoji:' + target.title + ']';
    };
}, false);


 //----------------images------------
 // document.getElementById('sendImage').addEventListener('change', function() {
 //    //检查是否有文件被选中
 //        console.log('sendImage');
 //        //获取文件并用FileReader进行读取
 //         var file = files[0],
 //             reader = new FileReader();
 //         if (!reader) {
 //             displayNewMsg('system', '!your browser doesn\'t support fileReader', 'red');
 //             value = '';
 //             return;
 //         };
 //         reader.onload = function(e) {
 //            //读取成功，显示到页面并发送到服务器
 //             this.value = '';
 //             socket.emit('img', {
 //                                    from:name,
 //                                    result:e.target.result});
 //             displayImage('me', e.target.result);
 //         };
 //         reader.readAsDataURL(file);

 // }, false);
 var reader = new FileReader();
 document.getElementById('sendImage').addEventListener('change', handleFileSelect, false);
  function handleFileSelect(evt) {
    console.log("reader_init:"+reader.result+" ");
    var files = evt.target.files; // FileList object
    console.log("typeof(reader):"+typeof(reader));
    // Loop through the FileList and render image files as thumbnails.
    for (var i = 0, f; f = files[i]; i++) {
        
      // Only process image files.
      // if (!f.type.match('image.*')) {
      //   continue;
      // }

        reader.onerror = (function(){
            console.log("readfile_error");
        });
      //Closure to capture the file information.
        reader.onload = (function() {
           return function(e) {
             // Render thumbnail.
            console.log("reader_after_read_onload:" + "{reader.result:" + reader.result + "\n reader.readyState:" + reader.readyState + "}");
//          socket.emit('files',{
//                          from: singlechat_from,
//                          files: e.target.result});
//           var span = document.createElement('span');
//           span.innerHTML = ['<img class="thumb" src="', e.target.result,
//                             '" title="', escape(theFile.name), '"/>'].join('');
//           document.getElementById('list').insertBefore(span, null);
                socket.emit('img', {
                                    from:name,
                                    result:e.target.result});
           };
         })(f);

      // Read in the image file as a data URL.
      //reader.readAsText(f);
      reader.readAsDataURL(f);
      console.log("reader_after_read_readasdataurl:"+"{reader.result:"+reader.result+"\n reader.readyState:"+reader.readyState+"}");
    }

  }
  function displayImage(user, imgData){
    var container = document.getElementById('historyMsg'),
        msgToDisplay = document.createElement('p'),
        date = new Date().toTimeString().substr(0, 8);
    msgToDisplay.innerHTML = user + '<span class="timespan">(' + date + '): </span> <br/>' + '<a href="' + imgData + '" target="_blank"><img src="' + imgData + '"/></a>';
    container.appendChild(msgToDisplay);
    container.scrollTop = container.scrollHeight;
}
socket.on('img',function(data){
    console.log(data.data.result);
    displayImage(data.data.from,data.data.result);
})