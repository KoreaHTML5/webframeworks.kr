---
layout : tutorials
title : AngularJS에서 OAuth2.0 처리하기
category : tutorials
subcategory : tips
summary : AngularJS 자바스크립트 웹 어플리케이션에서 oauth2.0을 이용하여 로그인처리를 하는 방법을 알아본다.
permalink : /tutorials/angularjs/angular_oauth2
title_background_color : DD1B16
title_color : FFFFFF
tags : javascript framework angularjs tutorials animation
author : jeadoko
---

# AngularJS에서 OAuth2.0 처리하기

## OAuth2.0 알아보기

OAuth2.0을 자세히 다루자면 본 튜토리얼이 OAuth2.0 자체의 튜토리얼이 되어도 모자랄 만큼 많은 내용을 다룬다. 자세항 내용은 http://tools.ietf.org/html/rfc6749에서 직접 확인하고 본 튜토리얼 진행에 필요로한 내용을 간단히 설명하고자 한다.
간단히 OAuth2.0을 설명하자면 OAuth2.0은 제한된 리소스를 HTTP로 서비스할때 제3자가 리소스 오너의 허락을 받아 해당 리소스를 제3자가 사용하게 절차를 표준화하였다. 이때 다양한 시나리오가 있는데 본 튜토리얼에서는 클라이언트 중심의 어플리케이션, 즉 AngularJS 웹 어플리케이션에서 제한된 리소스를 접근하기 위하여 OAuth2.0을 사용하는 것에 대하여 기술하겠다. 그럼 OAuth2.0에서 클라언트 사이드 흐름(OAuth 2.0 Implicit Grant)에 대하여 보자.

{% bimg imgs/oauth2.png 298x240 %}OAuth2.0{% endbimg %}
출처 : http://devcenter.kinvey.com/angular/tutorials/how-to-implement-safe-signin-via-oauth

각 흐름별 의미는 다음과 같다.

1. 클라이언트는 사용자를 리소스 프로바이더가 제공하는 로그인 페이지로 이동한다.
2. 사용자는 클라이언트를 허용한다.
3. 프로바이더는 클라이언트로 사용자를 다시 이동시키며 이때 **access_token**을 함께 준다.
4. 클라이언트는 해당 **access_token**을 유효한지 확인한다.
5. 클라이언트는 유효한 **access_token**을 가지고 보호된 자원을 프로바이더로부터 얻으려고 한다.

{% highlight html %}
<head>
 <meta charset="UTF-8">
 <title>사용자 관리 DEMO APP</title>
 <link rel="stylesheet" href="libs/bootstrap/css/bootstrap.min.css">
 <link rel="stylesheet" href="resources/app.css">
 <script type="text/javascript" src="libs/angular/angular.js"></script>
 <script type="text/javascript" src="libs/angular/angular-animate.js"></script>
 <!-- 애니메이션 기능을 위해 angular-animate.js 파일을 추가해 준다. -->
 <script type="text/javascript" src="libs/angular/angular-cookies.js"></script>
 <script type="text/javascript" src="libs/ui-bootstrap/ui-bootstrap-0.8.0.js"></script>
 <script type="text/javascript" src="libs/ui-bootstrap/ui-bootstrap-tpls-0.8.0.js"></script>
 <script type="text/javascript" src="app.js"></script>
</head>
{% endhighlight %}

## Google Mail API OAuth2.0으로 인증하여 사용하기

구글의 많은 서비스들을 OAuth2.0을 통하여 서비스 리소스에 대한 인증을 가능하게 한다. 이번 튜토리얼에서는 간단한 메일 쓰레드를 조회하기 위한 처리를 보도록 하겠다.

[Google Developer Console](https://console.developers.google.com/)에 접속을 하여 새로운 프로젝트를 만들고 API를 서비스에 가서 GMail API를 선택한다. 

{% bimg imgs/googledevconsole-api.png 500x240 %}Google Developer Console{% endbimg %}


다음으로 API 사용설정을 누르고 OAuth 동의 화면을 설정하고 저장한다. 

{% bimg imgs/gdc-user-auth-info.png 500x400 %}Google Developer Console OAuth 동의 화면 추가{% endbimg %}

그 후 왼쪽의 사용자 인증정보에서 OAuth 2.0클라이언트 ID로 사용자 인증 정보를 추가하도록 한다.

{% bimg imgs/gdc-oauth-client-id.png 500x240 %}Google Developer Console Client Id 추가{% endbimg %}
 
애플리케이션 유형을 웹 애플리케이션으로 하고 이름과 승인된 리다이렉션 URL정보를 넣어준다. 이때 셈플 서버를 구동할 http://localhost:8080으로 추가한다. 그리고 생성 번튼을 클릭하게 되면 클라이언트 ID를 얻을 수 있다. 결국 이 클라이언트 ID를 얻기위해 개발자 콘솔에서 여러 설정을 한 것이다.

## 구글 메일 목록 조회하는 셈플 어플리케이션 만들기

간단히 로그인을 한 후 메일 목록을 가져오는 셈플을 만들어 보자. 셈플 프로그램은 첫 화면이 로그인페이지고 로그인 성공후 maillist 페이지로 넘어간다. 2화면을 가지게 되니 Angular UI Router 모듈을 사용하여 구성하도록 하자.

{% highlight html %}
<!DOCTYPE html>
<html lang="en" ng-app="example">
<head>
  <meta charset="UTF-8">
  <title>AngularJS OAuth2.0 Demo</title>
  <link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap.css">
</head>
<body>
  <div class="container">
    <div ui-view></div>
  </div>
  <script src="bower_components/angular/angular.js"></script>
  <script src="bower_components/angular-ui-router/release/angular-ui-router.js"></script>
  <script src="app.js"></script>
</body>
</html>
{% endhighlight %}

다음은 로그인 페이지이고 template폴더에 위치해있다.

{% highlight html %}
<h1>Login</h1>
<button ng-click="login()">Login with google</button>
{% endhighlight %}

다음은 로그인 성공후 이동할 메일 쓰레드 목록 페이지이다.

{% highlight html %}
<h1>메일 쓰레드 목록</h1>
  <div class="row">
    <button type="button" class="btn btn-default pull-right" ng-click="getListOfMails()" >메일 쓰레드 조회</button>
  </div>
  <div class="row">
    <ul class="list-group">
      <li ng-repeat="thread in threads" class="list-group-item">{{thread.snippet}}</li>
    </ul>
  </div>
</div>
{% endhighlight %}

이제 자바스크립트 코드인 app.js를 보도록 하자.

{% highlight javascript %}
angular.module("example", ['ui.router'])
 .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'templates/login.html',
            controller: 'LoginController'
        })
        .state('mailThreads', {
            url: '/access_token=:accessToken',
            templateUrl: 'templates/mailThreads.html',
            controller: 'mailThreadsController'
        });
    $urlRouterProvider.otherwise('/login');
 }).controller("LoginController", function($scope) {
  $scope.login=function() {
      //구글 개발자 콘솔에서 획득한 클라이언트 아이디를 입력한다.
      var client_id="****";
      //GMAIL API에서 API Scope을 설정한다.
      //자세한 내용은 https://developers.google.com/gmail/api/auth/scopes 참고
      var scope="https://www.googleapis.com/auth/gmail.readonly";
      //사용자가 로그인을 한 후 돌아올 주소이다.
      //앞에서 구글 개발자 콘솔에서 승인한 URL이어야 한다.
      var redirect_uri="http://localhost:8080";
      var response_type="token";
      var url="https://accounts.google.com/o/oauth2/auth?scope="+scope+"&client_id="+client_id+"&redirect_uri="+redirect_uri+
      "&response_type="+response_type;
      //로그인 페이지를 불러온다.
      window.location.replace(url);
     };
 
}).controller("mailThreadsController", function($scope, $stateParams, $http) {
    //전달받을때 AccessToken 외에 Scope과 AccessType정보가 &기호로 분리하여 쿼리스트링으로 온다.
    //필요한 AccessToken값만 가지고 오자.
    $scope.accessToken = $stateParams.accessToken.split('&')[0]; 
    $scope.getListOfMails = function() {
     $http.get('https://www.googleapis.com/gmail/v1/users/me/threads',{
       params : {
          //리소스 호출시 URL 파라미터로 access_token을 전달해 준다.
          "access_token" : $scope.accessToken
          }
       })
       .success(function(data) {
           $scope.threads = data.threads;
       })
    }
});
{% endhighlight %}

지금까지 간단한 샘플을 통하여 AngularJS에서 OAuth2.0을 처리하는 방법을 살펴보았다. 실제 토큰에 대한 저장에 만료시 처리와 같은 좀 더 고려해야할 내용들이 많다. OAuth2.0에서는 지금까지 한 클라리언트에서 처리하지 않고 서버사이드에서 처리하는 등과 같은 여러 케이스별 시나리오가 존재한다. 자세한 내용은 [
Using OAuth 2.0 to Access Google APIs](https://developers.google.com/identity/protocols/OAuth2)을 참고하길 바란다.

## References

- [angularjs official document](https://docs.angularjs.org/)
