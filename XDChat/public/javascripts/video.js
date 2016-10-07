// var socket = require('./singlechat').socket;
// var singlechat_from = window.name.split("/")[0];
// var singlechat_to = window.name.split("/")[2];
// var flag = 0;
//   //使用Google的stun服务器
// var iceServer = {
//             "iceServers": [{
//                 "url": "stun:stun.l.google.com:19302"
//             }, {
//                 "url": "turn:numb.viagenie.ca",
//                 "username": "webrtc@live.com",
//                 "credential": "muazkh"
//             }]
//         };

// //兼容浏览器的getUserMedia写法
// var getUserMedia = (navigator.getUserMedia ||
//                     navigator.webkitGetUserMedia || 
//                     navigator.mozGetUserMedia || 
//                     navigator.msGetUserMedia);
// //兼容浏览器的PeerConnection写法
// var PeerConnection = (window.PeerConnection ||
//                     window.webkitPeerConnection00 || 
//                     window.webkitRTCPeerConnection || 
//                     window.mozRTCPeerConnection);
// //与后台服务器的WebSocket连接
// //创建PeerConnection实例
// var pc = new PeerConnection(iceServer);



//         pc.onicecandidate = function(event){
//             if (event.candidate !== null) {
//                 socket.send(JSON.stringify({
//                     "event": "_ice_candidate",
//                     "data": {
//                         "candidate": event.candidate
//                     }
//                 }));
//             }
//         };

//         // 如果检测到媒体流连接到本地，将其绑定到一个video标签上输出
//         pc.onaddStream= function(event){
//             document.getElementById('chatideo').src = URL.createObjectURL(event.localMediaStream);
//         };

//         // 发送offer和answer的函数，发送本地session描述
//         var sendOfferFn = function(desc){
//             pc.setLocalDescription(desc);
//             socket.send(JSON.stringify({ 
//                 "event": "_offer",
//                 "data": {
//                     "sdp": desc
//                 }
//             }));
//         },
//         sendAnswerFn = function(desc){
//             pc.setLocalDescription(desc);
//             socket.send(JSON.stringify({ 
//                 "event": "_answer",
//                 "data": {
//                     "sdp": desc
//                 }
//             }));
//         };

// function Reqvideo(){ 
//     socket.emit('videolink',{
//         from:singlechat_from,
//         to:singlechat_to
//     });
//     // if(flag == 0){
//         getUserMedia.call(navigator, {
//             video: true,
//             audio: true
//         }, function(localMediaStream) {
//             var video = document.getElementById('video');
//             // var video2 = document.getElementById('chatvideo');
//             // video2.src = window.URL.createObjectURL(localMediaStream);
//             video.src = window.URL.createObjectURL(localMediaStream);
//             pc.addStream(localMediaStream);
//             video.onloadedmetadata = function(e) {
//                 console.log("Label: " + localMediaStream.label);
//                 console.log("AudioTracks" , localMediaStream.getAudioTracks());
//                 console.log("VideoTracks" , localMediaStream.getVideoTracks());
//             };
//             pc.createAnswer(sendOfferFn, function (error) {
//                     console.log('Failure callback: ' + error);
//             });
//                 // pc.createOffer(sendOfferFn, function (error) {
//                 //     console.log('Failure callback: ' + error);

//            // pc.sendOfferFn(localMediaStream);

//             }
//         }, function(e) {
//             console.log('Rejected!', e);
//         });
//     //     flag = 1;
//     // }
//     // else{
//     //     var video = document.getElementById('video');
//     //     video.pause();
//     //     video.src=null;
//     //     flag = 0;
//     // }
    
//  }
// socket.onmessage = function(event){
//             var json = JSON.parse(event.data);
//             console.log('onmessage: ', json);
//             //如果是一个ICE的候选，则将其加入到PeerConnection中，否则设定对方的session描述为传递过来的描述
//             if( json.event === "_ice_candidate" ){
//                 pc.addIceCandidate(new RTCIceCandidate(json.data.candidate));
//             } else if(json.event === "_offer"||json.event === "_answer") {
//                 pc.setRemoteDescription(new RTCSessionDescription(json.data.sdp));
//                 // 如果是一个offer，那么需要回复一个answer
//                 if(json.event === "_offer") {
//                     pc.createAnswer(sendAnswerFn, function (error) {
//                         console.log('Failure callback: ' + error);
//                     });
//                 }
//             }
//         };