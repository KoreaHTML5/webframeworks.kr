---
layout : tutorials
category : tutorials
title : Socket.IO를 이용하여 Tic Tac Toe 만들기 (1/3)
subcategory : setlayout
summary : Socket.IO를 이용하여 Tic Tac Toe 만들기에 대해 알아봅니다.
permalink : /tutorials/weplanet/Tic-Tac-Toe-Socket-IO1
author : danielcho
tags : socket.io javascript
title\_background\_color : F1F71A
---



> 본 포스팅은 [Ayush Gupta](https://ayushgp.github.io/)의 [Tic Tac Toe using Socket.IO](https://ayushgp.github.io/Tic-Tac-Toe-Socket-IO/)를 저자의 허락하에 번역한 글입니다. 오탈자, 오역 등이 있다면 연락부탁드립니다.

  

[Socket.IO](http://socket.io/)를 사용하여 실시간 [Tic-Tac-Toe game](https://www.wikiwand.com/en/Tic-tac-toe) 게임을 만드는 법을 알려드리겠습니다.



*Note: 이 프로젝트는 UI를 만들기 위해 minimal css 프레임워크인 skeleton을 사용하였습니다. 이 어플리케이션을 위한 코드는 [GitHub](https://github.com/ayushgp/tic-tac-toe-socket-io)에서 찾아볼 수 있으며, [Heroku에 있는 데모](https://tic-tac-toe-realtime.herokuapp.com/)를 확인할 수 있습니다.* 



## 전제 사항 

- Socket.IO는 Node.js 상에서 구동되는 프레임워크이고, 이 튜토리얼을 따라하기 위해 Node.js 설치가 필요합니다. 설치를 위해 Node.js 설치 가이드를 참고하세요.
- 중급 수준의 JavaScript에 대한 지식이 있어야 합니다. Object Prototype, Event, Event Handlers, Callbacks, IIFE 등에 익숙하셔야 합니다.
- 이 튜토리얼을 따라하기 위해서는 jQuery에 대한 지식 또한 가지고 있어야 합니다. 그렇지 않다면, [Beginners Guide to DOM Selection with jQuery](https://www.sitepoint.com/beginners-guide-dom-selection-jquery/) 을 확인해 보십시오. 







## 시작하기

Socket.IO는 클라이언트와 서버 간의 소통을 위해 이벤트를 사용합니다. 우리는 클라이언트에게 서버와 연결하기 위한 커넥션을 오픈합니다. 서버에 연결하면, 우리는 클라이언트와 서버가 서로 데이터를 전송할 수 있는 양방향 파이프라인을 갖게 됩니다. 이것의 주요 이점은 클라이언트의 요청 없이도 서버가 클라이언트에게 데이터를 전송할 수 있다는 것입니다! 즉, 이 방식은 서버가 특정 이벤트에 따라 클라이언트에게 데이터를 푸쉬해야하는 경우에 매우 유용합니다. 



우리는 게임을 만들기 위해 이벤트를 만들 것입니다. 우리 게임이 어떻게 구동되는지에 대한 간략한 개요입니다. 한 플레이어는 게임을 창조하고 (플레이어 1혹은 X) 다른 플레이어들에게 게임 id를 지급할 것입니다. 두 번째 플레이어가 게임에 참여할 것입니다 (플레이어 2 혹은 O). 그리고 게임은 우승자가 생기거나 무승부가 될 때까지 이어질 것입니다. 



이제 애플리케이션을 위한 디렉토리를 만들고 dependencies를 설치하면서 시작해 봅시다. 



NPM을 사용하여 애플리케이션을 시작하세요. 그리고 `tic-tac-toe`라고 하는 새로운 디렉토리를 만드세요. 다음 내용과 함께 디렉토리 내에 `package.json`파일을 만드세요:



```
{
  "name": "tic-tac-toe",
  "version": "1.0.0",
  "description": "A realtime online multiplayer game.",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "author": "Your Name Here",
  "license": "ISC",
  "dependencies": {
    "express": "^4.14.0",
    "jquery": "^3.1.1",
    "skeleton-css": "^2.0.4",
    "socket.io": "^1.7.1"
  }
}

```



이제  `npm install` 를 통해  `package.json` 파일에서 정의한 dependencies를 설치합니다.

- **Express**: 서버 세팅을 위한 프레임워크 
- **jQuery**: DOM을 다루기 위한 프레임워크 
- **Skeleton**: CSS 프레임워크
- **Socket.IO**: 플레이어들과 소통하기 위한 실시간 프레임워크





## 서버 설정하기

우리는 `tic-tac-toe` 의 root에 `index.js` 파일을 만듭니다. 이 코드는 우리가 클라이언트에게서 전송받는 모든 이벤트를 다루고, 게임 방을 관리하고, 클라이언트에게 정적 파일을 전달합니다.



아래 내용을 `index.js` 파일에 추가해주세요.

```
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var rooms = 0;

app.use(express.static('.'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/game.html');
});

server.listen(5000);

```



이제 서버가 만들어졌습니다. 이제 UI에서 사용할 기본 HTML 파일, `game.html`을 만들어 봅시다. 다음과 같은 코드를 추가하십시오.

```
<!DOCTYPE html>
<html>
  <head>
    <title>Tic Tac Toe</title>
    <link rel="stylesheet" href="node_modules/skeleton-css/css/skeleton.css">
  </head>
  <body>
    <div class="container">
    </div>
    <script src="node_modules/jquery/dist/jquery.min.js"></script>
    <script src="/socket.io/socket.io.js"></script>
  </body>
</html>

```



이제 우리는 클라이언트가 서버에 연결되면 어떤 동작이 일어나야 하는지 다뤄야 합니다. Socket.IO는 `connection`이라고 불리는 자동으로 작동하는 이벤트를 제공합니다. 연결 이벤트를 다루기 위해 다음 코드를 `index.js` 파일 `server.listen call` 위쪽에 추가하십시오. 

```
io.on('connection', function(socket){
	console.log('A user connected!'); // We'll replace this with our own events
});
```



사용자가 게임을 만들 때마다, 우리는 그것을 트레킹해야 합니다. 하지만 수동으로 하는 것은 거의 불가능하죠. Socket.IO는 `rooms` 를 만들 수 있습니다. 우리는 이용자를 만들기 위해 `rooms`을 이용할 것입니다. `rooms` 안에서 이루어지는 모든 소통은 그 `rooms`에 있는 사람에게만 한정되어 있습니다. 



### 서버 내부

다음과 같은 단계가 플레이어들이 실제로 게임을 하기 전에 이루어질 것입니다. 

1. 서버는 첫 번째 플레이어가 게임을 만든 직후 곧바로 게임 방에 합류하게 만듭니다.
2. 그 후 서버는 사용자가 두 번째 플레이어가 게임에 합류하도록 사용자의 브라우저에 `newGame`이라는 이벤트를 `rooms`  id와 함께 보냅니다. 
3. 두 번째 플레이어가 게임에 합류하면, 두 번째 플레이어는 `joinGame` 이벤트를 전송받게 됩니다. 서버는 그 사용자가 합류하고 싶어하는 방을 찾아줄 것입니다. 서버는 그 방이 존재하고, 한 명만 있는 상태라면 사용자를 조인시킵니다. 
4. 그 후 서버는 사용자들에게 자신의 역할에 대해 알려주고, 이에 따라 `player 1` 과 `player 2`  이벤트를 내보냅니다.



사용자들이 플레이할 순서가 되면, 서버는 `playTurn`  이벤트를 전송 받습니다. 서버는 이 움직임에 대해 `turnPlayed`  이벤트를 두 번째 플레이어에게 보내어 두 사용자의 UI 모두 업데이트되고 두 번째 플레이어가 움직일 수 있도록 합니다.

해당 턴을 플레이하는 사용자는 이겼는지, 비겼는지를 확인합니다. 만약 이겼다면, 소켓은 `gameEnded` 이벤트를 전송하고, 다른 사용자가 게임 상태를 확인할 수 있도록 합니다.



### 이벤트 헨들러

이제 위의 계획을 시행하고 서버를 작동시켜 봅시다. `CreateGame`, `joinGame`, `playTurn`, 그리고 `gameEnded` 이벤트에 대한 이벤트 핸들러를 만들 것입니다. 다음 코드로 로그 내역서를 이벤트 핸들러로 바꿉니다. 



```
/**
 * Create a new game room and notify the creator of game. 
 */
socket.on('createGame', function(data){
  socket.join('room-' + ++rooms);
  socket.emit('newGame', {name: data.name, room: 'room-'+rooms});
});

/**
 * Connect the Player 2 to the room he requested. Show error if room full.
 */
socket.on('joinGame', function(data){
  var room = io.nsps['/'].adapter.rooms[data.room];
  if( room && room.length == 1){
    socket.join(data.room);
    socket.broadcast.to(data.room).emit('player1', {});
    socket.emit('player2', {name: data.name, room: data.room })
  }
  else {
    socket.emit('err', {message: 'Sorry, The room is full!'});
  }
});

/**
 * Handle the turn played by either player and notify the other. 
 */
socket.on('playTurn', function(data){
  socket.broadcast.to(data.room).emit('turnPlayed', {
    tile: data.tile,
    room: data.room
  });
});

/**
 * Notify the players about the victor.
 */
socket.on('gameEnded', function(data){
  socket.broadcast.to(data.room).emit('gameEnd', data);
});

```



다음 정보는 Socket이 어떻게 이벤트를 다루고 통신하는지에 대해 이해하도록 도와줍니다.

- `socket.on('event', function)` 는 각 연결된 클라이언트의 이벤트를 수신하고 이벤트가 구동될 때 관련 기능을 실행합니다.
- `socket.emit('event', data)` 는 이 콜을 포함한 이벤트를 호출한 클라이언트에게 내보냅니다.
- `socket.broadcast.to(room)` 는 이 기능을 구동시킨 이벤트를 보낸 사람을 제외하고 방에 있는 모든 사람들에게 이벤트를 방송합니다. 예를 들어, `gameEnded` 이벤트 핸들러에서, 본 이벤트를 내보낸 사람은 `gameEnd` 이벤트를 수신 받지 않게 됩니다. 그 방에 있는 그 외 모두는 이 이벤트를 수신받게 됩니다. 

