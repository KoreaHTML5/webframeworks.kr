---
layout : tutorials
category : tutorials
title : Tic Tac Toe using Socket.IO (2/3)
subcategory : setlayout
summary : Tic Tac Toe using Socket.IO에 대해 알아봅니다.
permalink : /tutorials/weplanet/Tic-Tac-Toe-Socket-IO2
author : danielcho
tags : socket.io javascript
title\_background\_color : F1F71A
---



> 본 포스팅은 [Ayush Gupta](https://ayushgp.github.io/)의 [Tic Tac Toe using Socket.IO](https://ayushgp.github.io/Tic-Tac-Toe-Socket-IO/)를 저자의 허락하에 번역한 글입니다. 오탈자, 오역 등이 있다면 연락부탁드립니다.

  




## UI 준비하기 

이제 서버를 준비 했으니, 게임을 위한 UI를 만들 시간입니다. 먼저 사용자가 게임을 만들고 합류할 수 있는 양식을 만듭니다. `Game.html` 파일을 편집하고 다음 코드를 그 사이에 추가하십시오.

```
<div class="container">
  <div class="menu">
    <h1>Tic - Tac - Toe</h1>
    <h3>How To Play</h3>
    <ol>
      <li>Player 1: Create a new game by entering the username</li>
      <li>Player 2: Enter another username and the room id that is displayed on first window.</li>
      <li>Click on join game. </li>
    </ol>
    <h4>Create a new Game</h4>
    <input type="text" name="name" id="nameNew" placeholder="Enter your name" required>
    <button id="new">New Game</button>
    <br><br>
    <h4>Join an existing game</h4>
    <input type="text" name="name" id="nameJoin" placeholder="Enter your name" required>
    <input type="text" name="room" id="room" placeholder="Enter Game ID" required>
    <button id="join">Join Game</button>
  </div>
</div>

```



그리고 우리는 game board를 생성합니다. 이는 jQuery 스크립트와 게임을 구동시킬 우리의 코드를 포함합니다. 그리고 다음 코드를  `div` tag를 닫은 후에 입력해주세요.

```
<div class="gameBoard">
  <h2 id="userHello"></h2>
  <h3 id="turn"></h3>
  <table class="center">
    <tr>
      <td><button class="tile" id="button_00"></button></td>
      <td><button class="tile" id="button_01"></button></td>
      <td><button class="tile" id="button_02"></button></td>
    </tr>
    <tr>
      <td><button class="tile" id="button_10"></button></td>
      <td><button class="tile" id="button_11"></button></td>
      <td><button class="tile" id="button_12"></button></td>
    </tr>
    <tr>
      <td><button class="tile" id="button_20"></button></td>
      <td><button class="tile" id="button_21"></button></td>
      <td><button class="tile" id="button_22"></button></td>
    </tr>
  </table>
</div>
<script src="node_modules/jquery/dist/jquery.min.js"></script>
<script src="/socket.io/socket.io.js"></script>
<script src="main.js"></script>	

```



## 새로운 게임 만들기 

우리는 게임 로직을 처리할 `main.js` 파일을 설정합니다. Tic-tac-toc root 아래 `main.js` 파일을 만들고 다음 코드를 넣으세요. 

```
(function(){

  // Types of players
  var P1 = 'X', P2 = 'O';
  var socket = io.connect('http://localhost:5000'),
    player,
    game;

  /**
   * Create a new game. Emit newGame event.
   */
  $('#new').on('click', function(){
    var name = $('#nameNew').val();
    if(!name){
      alert('Please enter your name.');
      return;
    }
    socket.emit('createGame', {name: name});
    player = new Player(name, P1);
  });

  /** 
   *  Join an existing game on the entered roomId. Emit the joinGame event.
   */ 
  $('#join').on('click', function(){
    var name = $('#nameJoin').val();
    var roomID = $('#room').val();
    if(!name || !roomID){
      alert('Please enter your name and game ID.');
      return;
    }
    socket.emit('joinGame', {name: name, room: roomID});
    player = new Player(name, P2);
  });
})();

```

우리는 로딩되자 마자 실행되는 [IIFE](https://en.wikipedia.org/wiki/Immediately-invoked_function_expression) 을 만들었습니다. 이 IIFE 안에 우리의 코드를 넣을 것입니다:

- 우리는 서버에 커넥션을 만들었고 객체를 소`socket`변수에 저장하였습니다.
- 우리는 클릭 이벤트 리스너를 `Create Game`과 `Join Game` 버튼에 붙여넣습니다.
- 우리는 유효성 검사를 삽입했고, 서버에 이 이벤트를 전달합니다.





### 플레이어 객체

우리는 이제 두 객체, `Game`과 `Player`를 만들어야 합니다. 이러한 객체들은 게임과 플레이어의 다양한 속성을 처리합니다. 이것들은 우리의 코드를 정돈되게 유지하는 데 도움을 줄 것입니다. 플레이어 객체를 정의해 봅시다. 다음 코드를 변수 선언 뒤에 넣으십시오.

```
/**
 * Player class
 */
var Player = function(name, type){
  this.name = name;
  this.type = type;
  this.currentTurn = true;
  this.movesPlayed = 0;
}

/**
 * Create a static array that stores all possible win combinations
 */
Player.wins = [7, 56, 448, 73, 146, 292, 273, 84];

/**
 * Set the bit of the move played by the player
 */
Player.prototype.updateMovesPlayed = function(tileValue){
  this.movesPlayed += tileValue;
}

Player.prototype.getMovesPlayed = function(){
  return this.movesPlayed;
}

/**
 * Set the currentTurn for player to turn and update UI to reflect the same.
 */
Player.prototype.setCurrentTurn = function(turn){
  this.currentTurn = turn;
  if(turn){
    $('#turn').text('Your turn.');
  }
  else{
    $('#turn').text('Waiting for Opponent');
  }
}

Player.prototype.getPlayerName = function(){
  return this.name;
}

Player.prototype.getPlayerType = function(){
  return this.type;
}

/**
 * Returns currentTurn to determine if it is the player's turn.
 */
Player.prototype.getCurrentTurn = function(){
  return this.currentTurn;
}

```


