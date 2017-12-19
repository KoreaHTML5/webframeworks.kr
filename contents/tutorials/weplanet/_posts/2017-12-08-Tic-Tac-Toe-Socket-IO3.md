---
layout : tutorials
category : tutorials
title : Tic Tac Toe using Socket.IO (3/3)
subcategory : setlayout
summary : Tic Tac Toe using Socket.IO에 대해 알아봅니다.
permalink : /tutorials/weplanet/Tic-Tac-Toe-Socket-IO3
author : danielcho
tags : socket.io javascript
title\_background\_color : F1F71A
---



> 본 포스팅은 [Ayush Gupta](https://ayushgp.github.io/)의 [Tic Tac Toe using Socket.IO](https://ayushgp.github.io/Tic-Tac-Toe-Socket-IO/)를 저자의 허락하에 번역한 글입니다. 오탈자, 오역 등이 있다면 연락부탁드립니다.

  



### 게임 클래스

이제 `Game` 클래스를 만들어 봅시다. 우리는 위의 방법들 (`Player` 클래스)를 순서, 플레이한 타일 등을 기록하기 위해 사용할 것입니다.

```
/**
 * Game class
 */
var Game = function(roomId){
  this.roomId = roomId;
  this.board = [];
  this.moves = 0;
}

/**
 * Create the Game board by attaching event listeners to the buttons. 
 */
Game.prototype.createGameBoard = function(){
  for(var i=0; i<3; i++) {
    this.board.push(['','','']);
    for(var j=0; j<3; j++) {
      $('#button_' + i + '' + j).on('click', function(){
        if(!player.getCurrentTurn()){
          alert('Its not your turn!');
          return;
        }

        if($(this).prop('disabled'))
          alert('This tile has already been played on!');

        var row = parseInt(this.id.split('_')[1][0]);
        var col = parseInt(this.id.split('_')[1][1]);

        //Update board after your turn.
        game.playTurn(this);
        game.updateBoard(player.getPlayerType(), row, col, this.id);

        player.setCurrentTurn(false);
        player.updateMovesPlayed(1 << (row * 3 + col));

        game.checkWinner();
        return false;
      });
    }
  }
}

/**
 * Remove the menu from DOM, display the gameboard and greet the player.
 */
Game.prototype.displayBoard = function(message){
  $('.menu').css('display', 'none');
  $('.gameBoard').css('display', 'block');
  $('#userHello').html(message);
  this.createGameBoard();
}

/**
 * Update game board UI
 */
Game.prototype.updateBoard = function(type, row, col, tile){
  $('#'+tile).text(type);
  $('#'+tile).prop('disabled', true);
  this.board[row][col] = type;
  this.moves ++;
}

Game.prototype.getRoomId = function(){
  return this.roomId;
}

/**
 * Send an update to the opponent to update their UI.
 */
Game.prototype.playTurn = function(tile){
  var clickedTile = $(tile).attr('id');
  var turnObj = {
    tile: clickedTile,
    room: this.getRoomId()
  };
  // Emit an event to update other player that you've played your turn.
  socket.emit('playTurn', turnObj);
}

/**
 *
 * To determine a win condition, each square is "tagged" from left
 * to right, top to bottom, with successive powers of 2.  Each cell
 * thus represents an individual bit in a 9-bit string, and a
 * player's squares at any given time can be represented as a
 * unique 9-bit value. A winner can thus be easily determined by
 * checking whether the player's current 9 bits have covered any
 * of the eight "three-in-a-row" combinations.
 *
 *     273                 84
 *        \               /
 *          1 |   2 |   4  = 7
 *       -----+-----+-----
 *          8 |  16 |  32  = 56
 *       -----+-----+-----
 *         64 | 128 | 256  = 448
 *       =================
 *         73   146   292
 *
 *  We have these numbers in the Player.wins array and for the current 
 *  player, we've stored this information in player.movesPlayed.
 */
Game.prototype.checkWinner = function(){		
  var currentPlayerPositions = player.getMovesPlayed();
  Player.wins.forEach(function(winningPosition){
    // We're checking for every winning position if the player has achieved it.
    // Keep in mind that we are using a bitwise AND here not a logical one.PlaysArr
    if(winningPosition & currentPlayerPositions == winningPosition){
      game.announceWinner();
    }
  });

  var tied = this.checkTie();
  if(tied){
    socket.emit('gameEnded', {room: this.getRoomId(), message: 'Game Tied :('});
    alert('Game Tied :(');
    location.reload();	
  }
}

/**
 * Check if game is tied
 */
Game.prototype.checkTie = function(){
  return this.moves >= 9;
}

/**
 * Announce the winner if the current client has won. 
 * Broadcast this on the room to let the opponent know.
 */
Game.prototype.announceWinner = function(){
  var message = player.getPlayerName() + ' wins!';
  socket.emit('gameEnded', {room: this.getRoomId(), message: message});
  alert(message);
  location.reload();
}

/**
 * End the game if the other player won.  
 */
Game.prototype.endGame = function(message){
  alert(message);
  location.reload();
}

```

- 새로운 게임을 시작할 때, 우리는 먼저 DOM에서 현재 메뉴를 삭제하고 `displayBoard' 기능을 사용하여 우리의 게임 보드를 추가합니다. 
- 그 후 우리는 `createGameBoard` 기능을 사용하여 보드에 있는 모든 타일에 이벤트 리스너를 추가할 것입니다.
- 플레이어가 움직일 때마다, 우리는 보드(`updateBoard` function)을 업데이트 하고 `turnPlayed`이벤트를 전달하여 상대편에게 알려 줍니다. 
- 매 순서가 끝날 때마다, 우리는 플레이어가 이겼는지, 혹은 비겼는지 확인합니다. 우리는 이에 따라 `announceWinner` 기능을 이용하여 각 플레이어에게 알려줍니다. 그 `endgame`은 `announceWinner`에 의해 전달된 이벤트를 처리합니다. 




### 프론트엔드 이벤트 헨들러 

이제 서버에서 브로드케스팅/전달하고 있는 이벤트를 위한 이벤트 핸들러를 추가해야 합니다. 해당 이벤트들은 다음과 같습니다.

- `newGame`: 새로운 게임 방을 만들고 게임 제작자에게 알려줍니다.
- `player1`: 게임 제작자에게 다른 플레이어가 합류했다는 것을 알려줍니다.
- `player2`: 플레이어 2에게 게임이 시작됐음을 알려줍니다. 
- `err`: 플레이어에게 합류하려는 방이 꽉 찼음을 알려줍니다.
- `turnPlayed`: 플레이어 중 한명에게 그들의 순서가 플레이 됐음을 알려줍니다. 
- `gameEnd`: 플레이어들에게 게임이 종료됐음과 어떤 플레이어가 이겼는지 알려줍니다. 



우리의 IIFE 안의 `main.js`파일에 다음의 이벤트를 위한 이벤트 핸들러를 만들어 봅시다.

```
/** 
 * New Game created by current client. 
 * Update the UI and create new Game var.
 */
socket.on('newGame', function(data){
  var message = 'Hello, ' + data.name + 
    '. Please ask your friend to enter Game ID: ' +
    data.room + '. Waiting for player 2...';

  // Create game for player 1
  game = new Game(data.room);
  game.displayBoard(message);		
});

/**
 * If player creates the game, he'll be P1(X) and has the first turn.
 * This event is received when opponent connects to the room.
 */
socket.on('player1', function(data){		
  var message = 'Hello, ' + player.getPlayerName();
  $('#userHello').html(message);
  player.setCurrentTurn(true);
});

/**
 * Joined the game, so player is P2(O). 
 * This event is received when P2 successfully joins the game room. 
 */
socket.on('player2', function(data){
  var message = 'Hello, ' + data.name;

  //Create game for player 2
  game = new Game(data.room);
  game.displayBoard(message);
  player.setCurrentTurn(false);	
});	

/**
 * Opponent played his turn. Update UI.
 * Allow the current player to play now. 
 */
socket.on('turnPlayed', function(data){
  var row = data.tile.split('_')[1][0];
  var col = data.tile.split('_')[1][1];
  var opponentType = player.getPlayerType() == P1 ? P2 : P1;
  game.updateBoard(opponentType, row, col, data.tile);
  player.setCurrentTurn(true);
});

/**
 * If the other player wins or game is tied, this event is received. 
 * Notify the user about either scenario and end the game. 
 */
socket.on('gameEnd', function(data){
  game.endGame(data.message);
  socket.leave(data.room);
})

/**
 * End the game on any err event. 
 */
socket.on('err', function(data){
  game.endGame(data.message);
});

```



## 게임 플레이하기

휴, 많은 코드였어요! 이제 게임을 구동하고 플레이해봅시다. 그러기 위해서, 당신의 터미널에서 다음의 명령을 구동하십시오.

```
$ npm start
```



서버는 <http://localhost:5000> 에서 구동이 시작될 것입니다. 게임을 하기 위해서는 두 개의 창을 열고 이 주소로 가십시오. 



## 결론

우리는 400줄 미만의 코드로 우리만의 서버의 멀티플레이어 게임을 만들었습니다. 꽤 쉽죠? 이것이 Socket.IO를 사용하는 법을 보여주기 위한 최소한의 실행이고, 이것이 실제 제작에서 발생하는 모든 일을 커버하지는 않는다는 것을 참고해 주십시오. 



게임을 [여기](http://tic-tac-toe-realtime.herokuapp.com/) 에서 플레이해볼 수 있습니다. 코드에서 어떤 문제가 발견되면, [repository](https://github.com/ayushgp/tic-tac-toe-socket-io)에 이슈를 등록해주세요. 원할 경우 PR을 제출할 수도 있습니다. 