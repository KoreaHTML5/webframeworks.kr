---
layout : tutorials
title : 채팅창 클라이언트를 통해 Scope 이벤트 처리 이용하기
category : tutorials
subcategory : angularjs
summary : AngularJS의 Scope의 이벤트 처리를 채팅창 클라이언트를 만들어 보면서 알아본다.
permalink : /tutorials/angularjs/angularjs_scope_events
title_background_color : DD1B16
title_color : FFFFFF
tags : javascript framework angularjs tutorials form validation
author : jeadoko
---

# 채팅창 클라이언트를 통해 Scope 이벤트 처리 이용하기

AngularJS는 웹 애플리케이션에 애플리케이션 이벤트를 정의하고 이런 이벤트 처리에 대 한 일련의 메커니즘을 제공한다. 이러한 사용자 정의 이벤트는 모두 $scope 객체를 통하여 처리되는데 $scope 객체에서 특정 이벤트를 발생시키면 이벤트를 발생한 $scope 객체의 자식 이나 부모 $scope에서 해당 이벤트를 처리할 수 있는 것이다. 우선 $scope 객체에 대하여 간단히 알아보자.

## Scope 타입

AngularJS 세상에는 몇 개의 별도 타입이 존재한다. 여기서 타입이란 자바스크립트 생성자 함수로 정의된 것을 애기한다. 즉, 다음과 같이 별도의 Scope 생성자 함수가 AngularJS 내부에 정의돼 있다.

    function Scope(){ ... } 
    Scope.prototype.$apply = function(){}; 
    Scope.prototype.$digest = function(){ ... };
    Scope.protytpe.$watch = function(){ ... };
    Scope.prototype.$new = function(){ ... };
    //...

그래서 우리가 정의하는 컨트롤러에서 받는 $scope은 위 생성자 함수에 new 키워드로 호출하여 만들어진 Scope 타입의 인스턴스이다. 자바스크립트 특성상 모든 $scope 인스턴스는 Scope 타입의 프로토타입 객체를 상속받기 때문에 $scope.$apply, $scope.$watch 와 같은 프로토타입 메소드를 사용할 수 있다. 이번 튜토리얼에서는 어플리케이션 이벤트를 생성하고 이벤트의 리스너를 정의하는 프로토타입 매서드인  $broadcast, $emit, $on에 대하여 살펴보겠다.

## 사용자 정의 어플리케이션 이벤트 처리

이벤트를 발생시키는 API는 $scope 객체의 $broadcast와 $emit 메서드가 있다. $braodcast는 자식 $scope에게 특정 이벤트의 이름으로 주어진 데이터와 함께 이벤트를 발생시킨다. 그리고 $emit은 반대로 부모 $scope에게 특정 이벤트의 이름으로 주어진 데이터와 함께 이벤트를 발생시킨다.

### $broadcast(이벤트 이름, 인자들......)

$broadcast 메소드는 첫 번째 인자인 이벤트 이름으로 하는 이벤트를 모든 하위 $scope에게 발생시킨다. 다음 코드를 보자.

    $scope.$broadcast(‘popup:open’,{ title : “hello” });

위와 같이 $broadcast 메소드를 호출하면 하위 $scope들에게 'popup:open'이라는 이베트 이름으로 { title : “hello” } 객체를 전달 할 수 있다. 여기서 'popup:open'은 단지 문자열에 불과해서 이벤트 이름 중복을 맊기위해 : 또는 . 와 같이 네임스페이스를 주면 좋다.

### $emit(이벤트명, 인자들......)

$emit 메소드는 해당 $scope를 기준으로 상위 계층 $scope에게 이벤트 명으로 인자를 전달한다. 아래 코드와 같이 사용할 수 있다.

    $scope.$emit(‘popup:open’,{ title : “hello” });

### $on(이벤트 이름, 리스너 함수)

$emit과 $broadcast로 발생되는 이벤트는 모두 $on 메서드를 이용해 특정 이벤트 이름에 해 당하는 이벤트 리스너 함수를 등록할 수 있다. 이렇게 등록된 이벤트 리스너는 등록된 이벤트 이름으로 이벤트가 발생하게 되면 해당 이벤트 리스너 함수가 호출된다. 이벤트 리스너 함수의 첫 번째 인자는 이벤트 객체이고 다음 인자는 $emit과 $broadcast로 이벤트 발생 시 전달하는 데이터가 된다. 다음은 예제코드이다.

    $scope.$on('popup:open', function (event, message) {
      console.log(message.title);
    });

이벤트 리스너 함수의 이벤트 객체는 다음과 같은 속성을 가지고 있다.

- targetScope - {Scope}: 이벤트를 발생시킨 $scope 객체의 레퍼런스
- currentScope - {Scope}: 리스너가 등록된 현재 $scope
- name - {string}: 이벤트 이름
- stopPropagation - {function=}: 이벤트 프로파게이션을 맊는다. $emit으로 호출된 이벤트에서만 사용가능하다.
- preventDefault - {function}: preventDefault 함수를 호출하면 defaultPrevented 플래그를 false로 셋팅한다.
- defaultPrevented - {boolean}: preventDefault 함수가 호출되면 true를 반환한다.

## 채팅 클라이언트를 개발하기

그럼 아래 그림과 같은 간단한 채팅 클라이언트를 개발하여 AngularJS의 사용자 정의 이벤트를 알아보자. 

{% bimg imgs/scope_event_tutorial_01.png 500x400 %}채팅 클라이언트 데모 화면{% endbimg %}

사용자 정의 이벤트는 어느 한 컴포넌트가 다른 컴포넌트와의 존재를 알 필요가 없게한다. 또한 특정 이벤트에 대하여 여러 컴포넌트가 듣고있다 처리하는 경우에도 활용할 수 있다. 그럼 위 채팅 클라이언트를 어떻게 개발해야할까? 다음 그림을 보자. 

{% bimg imgs/scope_event_tutorial_02.png 600x380 %}채팅 클라이언트 데모 화면{% endbimg %}

위 그림에서 보는 것과 같이 채팅내용이 보이는 컴포넌트와 채팅 내용을 입력하는 컴포넌트로 분리한다. 각 컨트롤러 컴포넌트들은 별도의 $scope을 가지고있어 서로의 모델을 직접 공유하지 않는다. 그럼 위 그림과 같이 채팅 클라이언트를 구현해보자. 다음은 채팅 클라이언트의 HTML 코드이고 전체 코드는 [GitHub web-angular-sample 프로젝트의 scope-chat-ui Branch](https://github.com/jeado/web-angular-sample/tree/scope-chat-ui)에서 scope-chat.html파일을 보면 된다.

{% highlight html %}
<!-- 생략 -->
<div class="panel-heading">
  <i class="fa fa-comments fa-fw"></i>
  채팅예제
</div>
<!-- 이전의 그림과 같이 크게 글 목록을 보여주는 chatBodyCtrl영역과 글을 입력하는 chatInputCtrl영역이 있다.-->
<div class="panel-body" ng-controller="chatBodyCtrl">
  <ul class="chat">
    <!-- ng-repeat을 이용하여 chats 배열요소의 개수만큼 채팅글을 보여준다. -->
    <li class="{{ "{{ $even && 'left' || 'right' " }}}} clearfix" ng-repeat="chat in chats">
    <!-- $even은 ng-repeat안에서 사용할 수 있고 짝수일경우 true이다. 짝수이면 left이고 홀수이면 right인 표현식을 나타낸다. 본인글만 왼쪽으로 나타내는 건 별도의 isMine()등으로 ng-class를 이용하여 구현할 수도 있다. -->
      <span class="chat-img pull-{{ "{{ $even && 'left' || 'right' " }}}}">
      <img src="http://placehold.it/50/55C1E7/fff" alt="사용자 이미지" class="img-circle">
      </span>
      <div class="chat-body clearfix">
        <div class="header text-{{ "{{ $even && 'left' || 'right' " }}}}">
          <strong>{{ "{{ chat.user.name " }}}}</strong>
        </div>
        <p>{{ "{{ chat.msg " }}}}</p>
      </div>
    </li>
  </ul>
</div>
<div class="panel-footer" ng-controller="chatInputCtrl">
  <div class="input-group">
    <input id="btn-input" type="text" class="form-control input-sm" ng-model="chatTxt">
    <span class="input-group-btn">
    <!-- 전송 버튼을 클릭하면 chatInputCtrl의 sendMsg를 호출한다. 이때 위 input에 데이터 바인딩이 된 chatTxt를 인자로 준다. -->
    <button class="btn btn-warning btn-sm" id="btn-chat" ng-click="sendMsg(chatTxt)">전송</button>
    </span>
  </div>
</div>
<!-- 생략 -->
{% endhighlight %}

다음은 자바스크립트 코드이다.

{% highlight javascript %}
angular.module('chatApp', []).
  //사용자 정보를 반환하는 서비스이다.
  factory('UserService', function () {
    return {
      getUser : function () {
        return {
          name : '제이'
        }
      }
    } 
  }).
  //실제 이벤트를 전달하는 서비스이다.
  factory('ChatService', function ($rootScope) {
    var CHAT_EVENT_MSG = "chat_masg",
        //채팅 이벤트 이름을 변수로 선언하였다.
        sendChatMsg = function (msg) {
          $rootScope.$broadcast(CHAT_EVENT_MSG, msg);
          //메시지 객체를 CHAT_EVENT_MSG 이벤트 이름으로 전파한다.
        },
        onChatMsg = function ($scope, handler) {
          $scope.$on(CHAT_EVENT_MSG, function (event, msg) {
            handler(msg);
         });
         //전달 받은 $scope에 CHAT_EVENT_MSG 이벤트의 리스너를 등록한다.
        };
    return {
      sendChatMsg: sendChatMsg,
      onChatMsg: onChatMsg
    };
  })
  .controller('chatInputCtrl', ['$scope','ChatService','UserService', function ($scope,ChatService,UserService) {
    //전달받은 채팅 메시지 문자열과 사용자 정보를 포함하는 메시지 객체를 ChatService서비스를 이용해 매시지를 전송한다.
    $scope.sendMsg = function (msg) {
      ChatService.sendChatMsg({
          msg : msg,
          user :UserService.getUser()
      });
      $scope.chatTxt = "";
    };      
  }])
  .controller('chatBodyCtrl', ['$scope','ChatService', function ($scope,ChatService) {
    $scope.chats = [];
    //채팅 메시지 이벤트에 대한 리스너를 ChatService를 통하여 처리한다.
    ChatService.onChatMsg($scope, function (msg) {
      //새로운 채팅 메시지를 전달받으면 채팅메시지 목록에 추가한다.
      $scope.chats.push(msg);
    });
  }]);
{% endhighlight %}

채팅클라이언트 데모를 보면 알 수 있듯이 AngularJS의 어플리케이션 이벤트 처리 기능을 이용하면 $scope들 사이의 참조 관계를 매우 느슨하게 만들어 재활용할 수 있는 컴포넌트 개발에 용이하다.


## References

- [angularjs official document](https://docs.angularjs.org/)
- [시작하세요 angularjs 프로그래밍](http://wikibook.co.kr/beginning-angularjs/)
