// var socket = io.connect('http://192.168.3.110');
var socket = io.connect();
var singlechat_from = window.name.split("/")[0];
var singlechat_to = window.name.split("/")[2];
var input = document.getElementById('message');
var messagebox = document.getElementById('messagebox');
//---------------------chat--------------------------------------
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
  var mediaConstraints = {'mandatory': {
                          'OfferToReceiveAudio':true, 
                          'OfferToReceiveVideo':true }};
  var isVideoMuted = false;

  // get the local video up
  function startVideo() {
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

  // stop local video
  function stopVideo() {
    if (sourcevid.mozSrcObject) {
      sourcevid.mozSrcObject.stop();
      sourcevid.src = null;
    } else {
      sourcevid.src = "";
      localStream.stop();
    }
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
      peerConn.createOffer(setLocalAndSendMessage, createOfferFailed, mediaConstraints);
    } else {
      alert("Local stream not running yet - try again.");
    }
  }

  // stop the connection upon user request
  function hangUp() {
    console.log("Hang up.");    
    socket.json.send({type: "bye"});
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
    if (evt.type === 'offer') {
      console.log("Received offer...")
      if (!started) {
        createPeerConnection();
        started = true;
      }
      console.log('Creating remote session description...' );
      peerConn.setRemoteDescription(new RTCSessionDescription(evt));
      console.log('Sending answer...');//---------type = 'answer'------------
      peerConn.createAnswer(setLocalAndSendMessage, createAnswerFailed, mediaConstraints);

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
        socket.json.send({type: "candidate",//-------type = 'candidate'--------------
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