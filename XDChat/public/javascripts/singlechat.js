// var socket = io.connect('http://192.168.3.110');
var socket = io.connect();
var singlechat_from = window.name.split("/")[0];
var singlechat_to = window.name.split("/")[2];
var input = document.getElementById('message');
var messagebox = document.getElementById('messagebox');
container = document.getElementById('historyMsg'),
//---------------------chat--------------------------------------
socket.on('singlechatMeg',function(data){
	if(data.name === singlechat_from ||data.name === singlechat_to ||data.to === singlechat_from ||data.to === singlechat_to ){
		//messagebox.value=data.name+data.to+data.context+" "+singlechat_from+singlechat_to;
		var msgToDisplay = document.createElement('p');
    var time = new Date();
        	hours = time.getHours();
        	minutes = time.getMinutes();
        	seconds = time.getSeconds();
        	minutes = changetime(minutes);
        	hours = changetime(hours);
        	seconds = changetime(seconds);
        var output = hours+":"+minutes+":"+seconds+":"+"\n";
        	output += data.name +":"+showEmoji(data.context)+"\n";
        msgToDisplay.innerHTML=output;
        container.appendChild(msgToDisplay);
        container.scrollTop = container.scrollHeight;
        //messagebox.value += output;
        //scrollTop();
	}
});
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
socket.on('singlechatexit',function(data){
	if(data.name === singlechat_from ||data.name === singlechat_to ||data.to === singlechat_from ||data.to === singlechat_to ){
		window.close();
	}
});

socket.on('emerg',function(data){
  alert(data.from+"请求紧急呼叫!!请紧急停止聊天！");
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


//-----------vedio----------
  var sourcevid = document.getElementById('video');
  var remotevid = document.getElementById('remotevideo');
  var localStream = null;
  var peerConn = null;
  var started = false;
  var channelReady = false;
  // var mediaConstraints = {'mandatory': {
  //                         'OfferToReceiveAudio':true, 
  //                         'OfferToReceiveVideo':true }};
  var isVideoMuted = false;

  // get the local video up
  function startVideo() {
      socket.emit("singlechat_room",{});


      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || window.navigator.mediaDevices.getUserMedia || navigator.msGetUserMedia;
      window.URL = window.URL || window.webkitURL;

      navigator.getUserMedia({video: true, audio: true}, successCallback, errorCallback);
      function successCallback(stream) {
          localStream = stream;
          if (sourcevid.mozSrcObject) {
            sourcevid.mozSrcObject = stream;
            sourcevid.play();
          } else {
            try {
              sourcevid.src = window.URL.createObjectURL(stream);
              sourcevid.play();
            } catch(e) {
              console.log("Error setting video src: ", e);
            }
          }
      }
      function errorCallback(error) {
          console.error('An error occurred: [CODE ' + error.code + ']');
          return;
      }

  }
function startVideo1() {
      socket.emit("singlechat_room",{});


      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || window.navigator.mediaDevices.getUserMedia || navigator.msGetUserMedia;
      window.URL = window.URL || window.webkitURL;

      navigator.getUserMedia({video: true, audio: true}, successCallback, errorCallback);
      function successCallback(stream) {
          localStream = stream;
          if (sourcevid.mozSrcObject) {
            sourcevid.mozSrcObject = stream;
            sourcevid.play();
          } else {
            try {
              sourcevid.src = window.URL.createObjectURL(stream);
              sourcevid.play();
            } catch(e) {
              console.log("Error setting video src: ", e);
            }
          }
          stop();
          connect();
      }
      function errorCallback(error) {
          console.error('An error occurred: [CODE ' + error.code + ']');
          return;
      }
  }
  // stop local video
  function stopVideo() {
    if (sourcevid.mozSrcObject) {
      sourcevid.mozSrcObject.stop();
      sourcevid.src = null;
    } else {
      sourcevid.src = "";
      localStream.stop();
    }
    stop();
  }

  // send SDP via socket connection
  function setLocalAndSendMessage(sessionDescription) {
    peerConn.setLocalDescription(sessionDescription);
    console.log("Sending: SDP");
    console.log(sessionDescription);
    socket.json.send(sessionDescription);
  }//-------type = 'offer'--------------

  function createOfferFailed() {
    console.log("Create Answer failed");
  }

  // start the connection upon user request
  function connect() {
    console.log(started);
    console.log(localStream);
    console.log(channelReady);
    if (!started && localStream && channelReady) {
      createPeerConnection();
      started = true;
      peerConn.createOffer(setLocalAndSendMessage, createOfferFailed);//, mediaConstraints);
    } else {
      alert("Local stream not running yet - try again.");
    }
  }

  // stop the connection upon user request
  function hangUp() {
    console.log("Hang up.");    
    socket.json.send({
                      // from: singlechat_from,
                      // to: singlechat_to,
                      type: "bye"});
    stop();
  }//-------type = 'bye'----------------

  function stop() {
    peerConn.close();
    peerConn = null;
    started = false;    
  }

  // socket: channel connected
  socket.on('connect', onChannelOpened)
        .on('message', onMessage);

  function onChannelOpened(evt) {
    console.log('Channel opened.');
    channelReady = true;
  }

  function createAnswerFailed() {
    console.log("Create Answer failed");
  }
  // socket: accept connection request
  function onMessage(evt) {
      //console.log(evt.from+":"+evt.to);
     //if(evt.from == undefined || evt.from === singlechat_from || evt.to === singlechat_to){
      if (evt.type === 'offer') {
        console.log("Received offer...")
      if (!started) {
        createPeerConnection();
        started = true;
      }
      console.log('Creating remote session description...' );
      peerConn.setRemoteDescription(new RTCSessionDescription(evt));
      console.log('Sending answer...');//---------type = 'answer'------------
      peerConn.createAnswer(setLocalAndSendMessage, createAnswerFailed);//, mediaConstraints);

      } else if (evt.type === 'answer' && started) {
        console.log('Received answer...');
        console.log('Setting remote session description...' );
        peerConn.setRemoteDescription(new RTCSessionDescription(evt));

      } else if (evt.type === 'candidate' && started) {
        console.log('Received ICE candidate...');
        var candidate = new RTCIceCandidate({sdpMLineIndex:evt.sdpMLineIndex, sdpMid:evt.sdpMid, candidate:evt.candidate});
        console.log(candidate);
        peerConn.addIceCandidate(candidate);

      } else if (evt.type === 'bye' && started) {
        console.log("Received bye");
        stop();
      }
     //}
    
  }
  function createPeerConnection() {
    console.log("Creating peer connection");
    // RTCPeerConnection = webkitRTCPeerConnection || mozRTCPeerConnection;
    var pc_config = {
        "iceServers":[{
                "url": "stun:stun.l.google.com:19302"
            }, {
                "url": "turn:numb.viagenie.ca",
                "username": "webrtc@live.com",
                "credential": "muazkh"
            }
    ]};
    try {
      console.log(RTCPeerConnection);
      peerConn = new RTCPeerConnection(pc_config);
    } catch (e) {
      console.log("Failed to create PeerConnection, exception: " + e.message);
    }
    // send any ice candidates to the other peer
    peerConn.onicecandidate = function (evt) {
      if (evt.candidate) {
        console.log('Sending ICE candidate...');
        console.log(evt.candidate);
        socket.json.send({
                          type: "candidate",//-------type = 'candidate'--------------
                          sdpMLineIndex: evt.candidate.sdpMLineIndex,
                          sdpMid: evt.candidate.sdpMid,
                          candidate: evt.candidate.candidate});
      } else {
        console.log("End of candidates.");
      }
    };
    console.log('Adding local stream...');
    peerConn.addStream(localStream);

    peerConn.addEventListener("addstream", onRemoteStreamAdded, false);
    peerConn.addEventListener("removestream", onRemoteStreamRemoved, false)

    // when remote adds a stream, hand it on to the local video element
    function onRemoteStreamAdded(event) {
      console.log("Added remote stream");
      remotevid.src = window.URL.createObjectURL(event.stream);
    }

    // when remote removes a stream, remove it from the local video element
    function onRemoteStreamRemoved(event) {
      console.log("Remove remote stream");
      remotevid.src = "";
    }
  }
  //----------------------------------


  
   var reader = new FileReader();
  //-----------file upload-----------

//   document.getElementById('files').addEventListener('change', handleFileSelect, false);
//   function handleFileSelect(evt) {
//     console.log("reader_init:"+reader.result+" ");
//     var files = evt.target.files; // FileList object
// 	console.log("typeof(reader):"+typeof(reader));
//     // Loop through the FileList and render image files as thumbnails.
//     for (var i = 0, f; f = files[i]; i++) {
		
//       // Only process image files.
//       // if (!f.type.match('image.*')) {
//       //   continue;
//       // }

// 		reader.onerror = (function(){
// 			console.log("readfile_error");
// 		});
//       //Closure to capture the file information.
//         reader.onload = (function() {
//            return function(e) {
//              // Render thumbnail.
//             console.log("reader_after_read_onload:" + "{reader.result:" + reader.result + "\n reader.readyState:" + reader.readyState + "}");
// //			socket.emit('files',{
// //							from: singlechat_from,
// //							files: e.target.result});
// //           var span = document.createElement('span');
// //           span.innerHTML = ['<img class="thumb" src="', e.target.result,
// //                             '" title="', escape(theFile.name), '"/>'].join('');
// //           document.getElementById('list').insertBefore(span, null);

//            };
//          })(f);

//       // Read in the image file as a data URL.
//       //reader.readAsText(f);
//       reader.readAsDataURL(f);
//       console.log("reader_after_read_readasdataurl:"+"{reader.result:"+reader.result+"\n reader.readyState:"+reader.readyState+"}");
//     }

//   }
//   socket.on("files",function(data){
  	
//   	if(window.confirm("收到"+data.from+"的文件，是否接收？")){
//        console.log(data.from +":" +typeof(data.files));
//     }
//   });
  
  
  //--------------------------------------------
  //---------data channel----------------
// function send_files(){
// 	socket.emit('files',{
// 							from: singlechat_from,
// 							files: reader});
////var peerConnection = new RTCPeerConnection();
//var dataChannelOptions = {
//  ordered: false, //不保证到达顺序
//  maxRetransmitTime: 3000, //最大重传时间
//};
////使用信令传输信道创建对等连接
//
//if(!peerConn){
//	peerConn = new RTCPeerConnection();
//}
//var dataChannel = peerConn.createDataChannel("myLabel", dataChannelOptions);
//console.log("send_files:" + reader.result);
//dataChannel.onerror = function (error) {
//  console.log("Data Channel Error:", error);
//};
//dataChannel.onmessage = function (event) {
//	if (event.type === 'send_files_offer') {
//      console.log("Received send_files_offer'...")
//    
//    console.log('Creating remote session description...' );
////    peerConnection.
////    //peerConn.setRemoteDescription(new RTCSessionDescription(evt));
////    console.log('Sending answer...');//---------type = 'answer'------------
////    peerConn.createAnswer(setLocalAndSendMessage, createAnswerFailed);//, mediaConstraints);
////
////    } else if (evt.type === 'answer' && started) {
////      console.log('Received answer...');
////      console.log('Setting remote session description...' );
////      peerConn.setRemoteDescription(new RTCSessionDescription(evt));
////
////    } else if (evt.type === 'candidate' && started) {
////      console.log('Received ICE candidate...');
////      var candidate = new RTCIceCandidate({sdpMLineIndex:evt.sdpMLineIndex, sdpMid:evt.sdpMid, candidate:evt.candidate});
////      console.log(candidate);
////      peerConn.addIceCandidate(candidate);
////
//  } 
//};
//
//dataChannel.onopen= function () {
//	console.log("Send Message:");
//  socket.json.emit({
//  	type:"send_files_offer"
//  });
//};
//
//dataChannel.onclose = function () {
//  console.log("The Data Channel is Closed");
//};
//}




  //--------------------emoji--------------------
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
 //-----------images-----------------
//  var reader = new FileReader();
//  document.getElementById('sendImage').addEventListener('change', handleFileSelect, false);
//   function handleFileSelect(evt) {
//     console.log("reader_init:"+reader.result+" ");
//     var files = evt.target.files; // FileList object
//     console.log("typeof(reader):"+typeof(reader));
//     // Loop through the FileList and render image files as thumbnails.
//     for (var i = 0, f; f = files[i]; i++) {
        
//       // Only process image files.
//       // if (!f.type.match('image.*')) {
//       //   continue;
//       // }

//         reader.onerror = (function(){
//             console.log("readfile_error");
//         });
//       //Closure to capture the file information.
//         reader.onload = (function() {
//            return function(e) {
//              // Render thumbnail.
//             console.log("reader_after_read_onload:" + "{reader.result:" + reader.result + "\n reader.readyState:" + reader.readyState + "}");
// //          socket.emit('files',{
// //                          from: singlechat_from,
// //                          files: e.target.result});
// //           var span = document.createElement('span');
// //           span.innerHTML = ['<img class="thumb" src="', e.target.result,
// //                             '" title="', escape(theFile.name), '"/>'].join('');
// //           document.getElementById('list').insertBefore(span, null);
//                 socket.emit('singlechatimg', {
//                                     from:singlechat_from,
//                                     result:e.target.result});
//            };
//          })(f);

//       // Read in the image file as a data URL.
//       //reader.readAsText(f);
//       reader.readAsDataURL(f);
//       console.log("reader_after_read_readasdataurl:"+"{reader.result:"+reader.result+"\n reader.readyState:"+reader.readyState+"}");
//     }

//   }
//   function displayImage(user, imgData){
//     var container = document.getElementById('historyMsg'),
//         msgToDisplay = document.createElement('p'),
//         date = new Date().toTimeString().substr(0, 8);
//     msgToDisplay.innerHTML = user + '<span class="timespan">(' + date + '): </span> <br/>' + '<a href="' + imgData + '" target="_blank"><img src="' + imgData + '"/></a>';
//     container.appendChild(msgToDisplay);
//     container.scrollTop = container.scrollHeight;
// }
// socket.on('singlechatimg',function(data){
//     console.log(data.data.result);
//     displayImage(data.data.from,data.data.result);
// })

//---------------------file upload--------------
// String.prototype.format = function (args) {
//       var result = this;
//       if (arguments.length > 0) {
//         if (arguments.length == 1 && typeof (args) == "object") {
//           for (var key in args) {
//             if (args[key] != undefined) {
//               var reg = new RegExp("({" + key + "})", "g");
//               result = result.replace(reg, args[key]);
//             }
//           }
//         }
//         else {
//           for (var i = 0; i < arguments.length; i++) {
//             if (arguments[i] != undefined) {
//               var reg = new RegExp("({)" + i + "(})", "g");
//               result = result.replace(reg, arguments[i]);
//             }
//           }
//         }
//       }
//       return result;
//   }

//   $(function(){
//     $('#btnSub').on('click',function(){        
//       var fulAvatarVal = $('#fulAvatar').val(),  
//         errorTip = '<div id="errorTip" class="alert alert-warning">{0}</div> ';  

//       $("#errorTip,#alt_warning").remove();
      
//       if(fulAvatarVal.length == 0)
//       {
//         $("#container").prepend(errorTip.format('请选择要上传的文件'));                              
//         return false;
//       }

//        var extName = fulAvatarVal.substring(fulAvatarVal.lastIndexOf('.'),fulAvatarVal.length).toLowerCase();

//       if(extName != '.png' && extName != '.jpg'){
//          $("#container").prepend(errorTip.format('只支持png和jpg格式图片'));                             
//          return false;              
//       }
      
//       return true;              
//     })
//   });
function openfilesend(){
  socket.emit('filesendopen_req', {
                from : singlechat_from,
                to : singlechat_to
            });
}

socket.on('filesendopen_req',function(data){
  if(data.to === singlechat_from){
            if(window.confirm(data.from+"准备给你发文件，是否接受？")){
                socket.emit('filesendopen',{from : data.from,
                                            to : data.to});
            }
  }
});
socket.on('filesendopen',function(data){
    console.log("filesendopen",data.to,data.from);
        if(data.from === singlechat_from||data.to === singlechat_from){
            if(data.from === singlechat_from){
              console.log("filesendopen",data.from);
              window.open('filesendopen',data.from+"/filesendopen/"+data.to);
            }
            else {
              console.log("filesendopen",data.to);
              window.open('filesendopen',data.to+"/filesendopen/"+data.from);
            }
        }
  });

//----------------history_message------

function history_message(){
  window.open('history_message',singlechat_from+"/history_message/"+singlechat_to);
}