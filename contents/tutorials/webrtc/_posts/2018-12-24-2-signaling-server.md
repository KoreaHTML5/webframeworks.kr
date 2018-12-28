---
layout : tutorials
category : tutorials
title : WebRTC - Signaling Server
subcategory : setlayout
summary : WebRTC Signaling Server에 대해서 알아봅시다
permalink : /tutorials/webrtc/signaling-server
author : marcushong
tags : webrtc
title\_background\_color : F1F71A
---

### Signaling Server
* WebRTC (피어들로 불리우는) 브라우저들 사이에 스트리밍 데이터를 주고 받는 RTCPeerConnection를 사용한다. 
* 통신을 조율하고 조장할 메세지를 주고 받기 위해 Signaling으로 알려진 일련의 과정이 필요하다. 
* Signaling을 위한 방법들과 프로토콜들은 WebRTC에 없다.
* 개발자가 사용하기에 적절하다고 판단되는 방식을 선택할 수 있다.

### socket.io의 역할
* join: 채팅방에 참여함. 참여했을 때 이미 2명일 경우 에러 리턴. 2명이 참여했을 경우 채팅이 가능하다는 것을 참여자들에게 알려줌.
* offer: 통신요청 정보를 전달
* answer: 통신요청에 대한 답변을 전달
* candidate: offer와 answer가 성공적으로 연결되었을 경우, ICE framework를 통해 찾은 서로간의 네트워크 정보를 교환함,

### Code

```js
const io = require('socket.io')

io.sockets.on('connection', function(socket) {
  socket.on('join', (room) => {
    const clients = io.sockets.adapter.rooms[room]
    const numClients = (typeof clients !== 'undefined') ? clients.length : 0
    if (numClients > 1){
      return callback('already_full')
    }
    else if(numClients === 1) {
      socket.join(room)
      io.in(room).emit('ready')
    }
    else {
      socket.join(room)
    }
    callback()
  })
  
  socket.on('offer', (data) => {
    const {room, candidate} = data
    socket.to(room).emit('offer', candidate)
  })
  
  socket.on('answer', (data) => {
    const {room, candidate} = data
    socket.to(room).emit('answer', candidate)
  })
  
  socket.on('candidate', (data) => {
    const {room, candidate} = data
    socket.to(room).emit('candidate', candidate)
  })
})


```

### 정리
Signaling 서버는 소켓으로 연결된 두 클라이언트 사이에 정보를 교환하는 역할이다.
추후에 인증이 필요하다면 추가할 수 있고, join 이벤트에서 사용량 체크를 할 수 있다.