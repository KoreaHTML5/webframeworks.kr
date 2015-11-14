---
layout : tutorials
title : DDP로 다리놓기
category : tutorials
subcategory : data-binding
summary : DDP를 이용하여 Meteor와 통신하는 사례를 배워본다
permalink : /tutorials/core_meteor/3_ddp_meteor
title_background_color : 1C1C1F
title_color : E4E4E4
tags : javascript meteor DDP
author : acidsound
---
# [Core Meteor] DDP로 다리놓기

Meteor는 Web Application이지만 기존 HTTP 통신을 최초에 자원을 읽어올때 한번만 사용하고 그 이후로는 DDP(Distributed Data Protocol https://www.meteor.com/ddp)를 이용하여 자료교환을 한다.

![Meteor 작동방식](imgs/DDP_console.jpg)

DDP를 Websocket을 위한 REST라고 이야기하기엔 결정적으로 다른 차이점 하나가 있다.

HTTP의 경우는 요청(Request)을 하면 응답(Response)를 주는 방식으로 연결이 유지가 되지 않는 반면, DDP 는 기본적으로 Connection을 한번 맺으면 클라이언트와 계속 연결을 유지하면서 실시간 송수신을 주고 받는다.

DDP는 WebSocket을 사용하고 SockJS를 사용하여 XMLHttpRequest 로 대체하기도 한다.

어떤 식으로 전송/수신을 하는지 Chrome의 Developer Tools를 통해 WebSockets 흐름을 한번 살펴보자.

![DDP Websocket 캡쳐화면](imgs/DDP_Websocket.png)

Meteor에서 클라이언트/서버간 통신하는 내용을 살펴보면 의외로 별게 없는데 Random.id()로 생성한 id값과 msg 종류. name 이름과 나머지 인자값들이 전부다.

## Client 쪽 DDP 분석

1 연결 요청(connect)한다.

```javascript
{
  "msg":"connect",
  "version":"pre2",
  "support": ["pre2","pre1"]
}
```

2 subscribe 한다.

```javascript
{
  "msg":"sub",
  "id":"j9jDEAyCxPnNELqGE", /* 이 id로 ready를 받는다 */
  "name":"meteor.loginServiceConfiguration",
  "params":[],
  "route":null
}
```

3 unsubscribe 한다.

```javascript
{
  "msg":"unsub",
  "id":"2CJPyYjDkF6cBBjPa" /* subscribe 했던 ID */
}
```

4 method 실행한다.

```javascript
{
  "msg":"method",
  "method":"login", /* login Method 의 예 */
  "params":[{
    "resume":"1LD6dzePGgaVXWanStM_t0s1VzzwlCjNpWsnV4uwIHw"
  }],
  "id":"1"
}
```

이게 전부.
여기에 대응하는 서버쪽의 응답은

## Server 쪽 DDP 분석

1 연결 확인(connected)

```javascript
{
  "msg":"connected",
  "session":"EndYfXuGFeqmK6cTR"
}
```

2 publish에서 해당 collection을 added 후 ready 반환

```javascript
{
  "msg":"added",
  "collection":"meteor_accounts_loginServiceConfiguration",
  "id":"DPEKK2xYQ7WHJsBA3",
  "fields":{
    "service":"twitter",
    "consumerKey":"......."
  }
}
....
{
  "msg":"ready",
  "subs":["j9jDEAyCxPnNELqGE"] /* subscribe시 요청했던 id */
}
```

3 unsubscribe의 결과인 nosub을 반환

```javascript
{
  "msg":"nosub",
  "id":"2CJPyYjDkF6cBBjPa" /* unsubscribe 요청한 id */
}
```

4 method 결과인 result 를 반환

```javascript
{
  "msg":"result",
  "id":"1", /* method 요청 했던 id */
  "result":  {
    "id":"aKcCLrJJHrzNHbJSs",
    "token":"1LD6dzePGgaVXWanStM_t0s1VzzwlCjNpWsnV4uwIHw",
    "tokenExpires": {
      "$date":1447776670432
    }
  }
}
```

요렇게 쌍으로 이루어져있다.

눈으로 읽을 수 있는 JSON구조라서 파악이 어렵지 않다.

이 DDP의 구조를 파악하고 있다면 클라이언트건 서버쪽이든 Meteor Platform과 통신할 수 있는 코드를 만들 수 있다는 것이다.

언어별로 [DDP 클라이언트](http://meteorpedia.com/read/DDP_Clients)들이 참 다양하게 구현이 되어있으니 쓰기만 하면 된다.

이론은 알았으니 실제로 외부 Meteor 사이트를 데이터베이스 연결없이 가지고 오는 예를 한번 구현해보자.

## DDP 연결 구현

[전체 소스 구현 및 예제](http://meteorpad.com/pad/N5ABJRpjd4id3Pf4s/remoteConnection)

오직 클라이언트쪽 구현만으로 시도해 볼 것이므로 서버는 만질 필요가 없다.

먼저 DDP로 외부 URL 연결을 시도할 객체를 생성하고

```javascript
remote = new DDP.connect('http://www.meteorjs.kr');
```

와 같이 연결한다.

중요한 것은 일단 Collection을 어디와 연결하느냐인데 일단 두가지 방법이 있다.
직접적으론 collection 선언시 인자로 DDP.connect한 핸들러를 넘겨주는 방법이 있고

```javascript
Posts = new Meteor.Collection('posts', remote);
```

아예 Meteor.connection 객체를 외부 DDP로 바꿔치기 하는 방법이 있다.

```javascript
Meteor.connection = remote;
Posts = new Meteor.Collection('posts');
```

이 경우 편리한 점은 ```Meteor.loginWithPassword``` 같은 내장 Method들을 그대로 쓰면 된다는 장점이 있다.

만일, 여러개의 DDP를 원격으로 제어하고자 한다면 Websocket의 내용을 보고 참조해서 넣으면 된다. 로그인의 경우는 이렇다.

```javascript
{
  "msg":"method",
  "method":"login",
  "params":[{
    "user":{
      "username":"spectrum"
    },
    "password": {
      "digest":"xxxxxxxxxxxxxxxxxxxxx",
      "algorithm":"sha-256"
    }
  }],
  "id":"1"
}
```

여기에서 method 이름과 params를 아래와 같이 호출하면 된다.

```javascript
Meteor.call('login', { user: { username: "spectrum" }..... )
```
그러면 예상하는 결과로

```javascript
{
  "msg":"result",
  "id":"1",
  "result": {
    "id":"aKcCLrJJHrzNHbJSs",
    "token":"xxxxxxxxxxxxx",
    "tokenExpires":{
      "$date":1448039686373
    }
  }
}
```

이런 형태의 token 값을 받을 것이다.

이 토큰 값을 가지고 저장하고 있다가 다음 로그인에 사용하거나 하면 된다.

마지막으로 subscribe인데, 위에서 가져올 빈 컬렉션을 먼저 준비해두었다면 사용할 Template 의 onCreated 에서 ```this.subscribe``` 대신 ```remote = new DDP.connect('http://www.meteorjs.kr');```에서 받은 객체를 ```remote.subscribe``` 식으로 사용하면 된다.

```Meteor.connection```을 바꿔치기 했다면 ```Meteor.connection.subscribe("....", ...)``` 형식으로 사용한다.

DDP를 이기종/플랫폼간 실시간 메시지 큐로도 사용할 수 있을 것이고 0MQ 같은 것들이랑 연동한다던지 외부 서버와의 DB 독립적으로 자료교환하는 등의 응용도 가능할 것이다.

단, OAuth를 사용하는 경우는 약간 고민이 필요할 것 같다. 대부분의 경우(facebook/twitter등) OAuth 인증 후 callback URL을 요구하는데 remote DDP 연결을 통하면 URL이 달라서 다소 어려움이 있겠다.

개인적으로는 도메인과 상관없는 Single Sign On 로그인 서버를 Meteor 로 만드는 것도 꽤 멋진 일이라고 생각한다.

웹이든 앱이든 서버 배치든 뭐든지 DDP로 연결해보자!

DDP는 간결하고 잘 작동하며 아름다운 프로토콜이다!