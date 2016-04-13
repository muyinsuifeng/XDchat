
数据库开启：mongod -dbpath d:/MongoDB/Server/data/db

//------------------------A和B建立视频通话过程----------------------------
A为房间创建端，B为加入房间端：

1、A通过http登录、获取其他服务器地址（做一些保存用户信息的操作，获取信令、stun、turn服务器地址等，非必要）

2、A和信令服务器建立websocket长连接

3、A通过websocket向信令服务器注册（创建房间，记录房间号，等待B加入房间）

4、A创建本地视频，获取A的sdp信息

5、B创建本地视频，获取B的sdp信息

6、B发送本地sdp信息到信令服务器sendOffer

6.1、B同时也在向stun（穿越）、turn（延时转发）服务器获取ice信息

6.2、B发送ice信息到信令服务器（后续会和A交换3种信息，不再赘述）

7、信令服务器转发sdp、ice信息到A（通过房间号辨别）

8、A将B的sdp信息设置到底层setRemoteDescription

8.1、A添加B的ice信息

8.2、A同时也在向stun（穿越）、turn（延时转发）服务器获取ice信息

8.3、A发送ice信息到信令服务器（后续会和B交换3种信息，不再赘述）

9、A发送本地sdp信息到信令服务器sendAnswer

10、信令服务器转发sdp信息到B

11、B将A的sdp信息设置到底层setRemoteDescription

在交换sdp信息的同时，ice信息也在进行交换，通过交换ice信息，最终会选择一种合适的方式来建立连接（p2p或者基于turn服务器的延时转发通路）