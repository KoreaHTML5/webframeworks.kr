---
layout : tutorials
title : 싱글 페이지를 위한 AngularJS Router 알아보기
category : tutorials
subcategory : angularjs
summary : 싱글 페이지 웹어플리케이션 개발을 위해 AngularJS에서 제공하는 ngRoute 모듈을 살펴보도록 하겠다.
permalink : /tutorials/angularjs/angularjs_router
title_background_color : DD1B16
title_color : FFFFFF
tags : javascript framework angularjs tutorials animation router
author : jeadoko
---

# 싱글 페이지를 위한 AngularJS Router 알아보기

싱글 페이지 웹 애플리케이션을 단순히 생각하면 웹 애플리케이션을 사용하는 동안 웹 페이지를 리로드하지 않는 웹 애플리케이션을 의미한다. 매번 웹 페이지를 리로드하지 않는 웹 어플리케이션에 불과하지만 이는 윈도우 운영체제에 설치되는 네이티브 애플리케이션과 동일한 사용자 경험(UX)을 제공할 수 있다. 우리가 많이 사용하는 구글의 지메일(GMail)을 대표적인 싱글 페이지 웹 애플리케이션으로 생각할 수 있는데 지메일을 사용하다 보면 마이크로소프트의 아웃룩과 비교해도 손색이 없을 수준의 기능과 사용자 경험을 느낄 수 있다.

하지만 싱글 페이지 웹 애플리케이션을 만들려면 고려해야 할 사항이 있다. 일반 웹 페이지는 화면 전환 시 페이지를 다시 읽어 오면서 해당 페이지를 가리키는 URL이 변경된다. 하지만 한 페이지 조각을 서버로부터 받아와서 브라우저 전체를 다시 읽지 않고 특정 영역의 DOM을 변경한다면 화면의 상태가 바뀌었음에도 URL이 변경되지 않고 브라우저의 히스토리가 관리되지 않는다. 이러한 문제를 해결하기 위해서 AngularJS는 $location 서비스를 제공한다. 그리고 이 $location 서비스를 이용하여 더욱 편리한 방법으로 특정 URL과 컨트롤러와 화면을 연결 시켜주는 $route 서비스를 제공한다. 그럼 AngularJS의 $route 서비스에 대하여 살펴보자.

## $route를 이용한 단일페이지 웹 어플리케이션 개발
$route는 기본 ng 모듈로 제공되지 않고 ngRoute 모듈로 제공된다. 그래서 라우트 기능과 관련된 모든 서비스는 ngRoute 모듈로 접근할 수 있다. ngRoute 모듈을 적용하려면 다음 코드와 같이 별도의 angular-route.js 파일을 추가해야 한다.

{% highlight html %}
<script src="angular.js">
<script src="angular-route.js">
{% endhighlight %}

angular-router.js 자바스크립트 파일을 추가하였다면 ngRoute 모듈을 사용한다고 모듈 선언 시 다음 코드와 같이 작성한다.

{% highlight html %}
angular.module('userMgnt', ['ngRoute'])
{% endhighlight %}

ngRoute모듈을 사용하게 되면 다음과 같은 서비스와 지시자를 사용할 수 있다.

#### ngView 지시자
&lt;ng-view&gt;&lt;/ng-view&gt;로 사용한다. 현재 라우트의 정보가 변경될 때 마다 정의된 URL에 해당하는 화면을 해당 지시자가 작성된 부분에 삽입한다.
#### 서비스
##### $route
현재 브라우저 URL에 해당하는 화면과 컨트롤러를 연결 하는데 사용된다. $route.current로 현재 URL 경로에 해당하는 화면과 컨트롤러 정보 얻을 수 있다.
##### $routeParam
현재 URL 경로의 매개변수 값을 얻는데 사용된다. 

그럼 간단히 단일 페이지 웹 어플리케이션을 만들어 보면서 각 서비스들과 지시자를 살펴보겠다. 우선 다음과 같이 router.html 파일을 만들자.

{% highlight html %}
<!DOCTYPE html>
<html ng-app="routerApp">
<head>
  <meta charset="UTF-8">
  <title>라우터 데모 엡</title>
  <link rel="stylesheet" href="libs/bootstrap/css/bootstrap.min.css">
  <script type="text/javascript" src="libs/angular/angular.js"></script>
  <script type="text/javascript" src="libs/angular/angular-route.js"></script>
  <!-- ngRoute 모듈을 사용하기 위해 추가한다. -->
  <script type="text/javascript" src="routerApp.js"></script>  
 </head>
 <body>
   <div class="container">
     <div class="navbar">
       <div class="navbar-inner">
         <a class="brand" href="#">라우터 셈플</a>
         <ul class="nav">
           <li><a href="#home">홈</a></li>
           <!-- #(해쉬태그)를 이용하여 URL 경로를 변경한다. HTML5에서는 History API를 이용하여 #없이 라우팅 처리가 가능하다. 라우트 설정 시 홈 화면과 연결할 #home에 해당하는 라우트 url은 home이다. -->
           <li><a href="#userList">사용자 관리</a></li>
         </ul>
       </div>
     </div>
     <ng-view></ng-view>
     <!--  ngView 지시자를 이용하여 URL 경로가 변경될 시 해당 URL 경로에 해당하는 HTML 조각을 삽입할 곳을 지정한다. -->
   </div>
 </body>
 </html>
{% endhighlight %}

다음으로 홈 화면과 사용자 관리 화면에 해당하는 HTML 조각 파일을 작성하자. 우선 views 폴더를 생성하고 폴더 안에 home.html 파일을 만들어 다음과 같이 작성한다.

{% highlight html %}
<h1>라우터 첫 페이지</h1>
<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ratione fuga suscipit, ab iure, incidunt, aut molestias cupiditate adipisci ducimus provident qui? Voluptatum iusto eligendi voluptates libero, excepturi officiis labore, quos!</p>
<!-- 의미 없지만 내용을 채우기 위하여 Lorem 문구를 사용하였다. -->
{% endhighlight %}

앞의 home.html 파일과 마찬가지로 views 폴더 안에 userList.html 파일을 다음과 같이 만든다. HTML 조각 파일은 앞에서 설명하였듯이 &lt;ng-view&gt;&lt;/ng-view&gt; 태그에 위치하게 되고 HTML 조각 파일은 템플릿으로서 ng-repeat과 같은 지시자와 {{ "{{  " }}}}을 이용하여 작성할 수 있다.

{% highlight html %}
<table class="table table-striped table-bordered table-hover">
  <thead>
    <tr>
      <th>#</th>
      <th>이름</th>
      <th>E-Mail</th>
      <th>가입 날짜</th>
    </tr>
   </thead>
   <tbody>
    <tr ng-repeat="user in userList">
<!-- $scope의 userList 배열 요소의 개수만큼 <tr>요소를 생성한다. <tr>요소 내부에서는 user를 통하여 각 배열 요소의 값을 접근할 수 있다. -->
       <td>{{ "{{ $index + 1 " }}}}</td>
<!-- ngRepeat 지시자에서 제공하는 $index를 이용하여 각 배열 요소의 인덱스 값에 접근한다. -->
       <td>{{ "{{ user.name " }}}}</td>
       <td>{{ "{{ user.email " }}}}</td>
       <td>{{ "{{ user.regDate " }}}}</td>
     </tr>
     <tr ng-show="!userList.length">
<!-- userList 배열 요소 개수가 0이거나 배열 값이 없을 시 해당 <tr>요소가 보인다. -->
       <td colspan="6" style="text-align :center">
         <span class="text-warning">데이터가 없습니다.</span>
       </td>
     </tr>
   </tbody>
 </table>
{% endhighlight %}

이제 routerApp.js 자바스크립트 파일을 작성하자. 해당 자바스크립트 파일에서 routeApp 모듈을 정의하면서 라우트 설정을 한다.

{% highlight javascript %}
angular.module('routerApp', ['ngRoute'])
 .config(function ($routeProvider) {
//Module의 config API를 사용하면 서비스 제공자provider에 접근할 수 있다. 여기선 $route 서비스 제공자를 인자로 받아온다. 
  $routeProvider
//$routeProvider의 when 메소드를 이용하면 특정 URL에 해당하는 라우트를 설정한다. 이때 라우트 설정객체를 전달하는데 <ng-view>태그에 삽입할 탬플릿에 해당하는 url을 설정객체의 templateUrl 속성으로 정의한다.
    .when('/home', {templateUrl: 'views/home.html'})
    .when('/userList', {templateUrl: 'views/userList.html', controller: 'userListCtrl'})
//라우트 설정객체에 controller 속성을 통하여 해당 화면에 연결되는 컨트롤러 이름을 설정할 수 있다.
    .otherwise({redirectTo: '/home'});
//otherwise 메소드를 통하여 브라우저의 URL이 $routeProivder에서 정의되지 않은 URL일 경우에 해당하는 설정을 할 수 있다. 여기선 ‘/home’으로 이동시키고 있다.
  }).
  controller('userListCtrl',function($scope) {
//사용자 관리화면의 컨트롤러를 정의한다. 이 컨트롤러는 URL이 ‘/userList’일 경우에만 적용이 된다. 이전의 템플릿 코드에서 별도로 ng-controller 지시자를 사용하지 않고 $routeProvider에서 라우트를 정의할 때 해당 컨트롤러와 연결되는 화면을 정의하였다.
    $scope.userList = [
    {
      name : '미나',
      email : 'mina@gmail.com',
      regDate : '2012-03-12'
    },
    {
      name : '제시카',
      email : 'jess@gmail.com',
      regDate : '2012-03-12'
    }
  ];
});
{% endhighlight %}

브라우저에서 해당 라우터 데모 웹 어플리케이션을 열어보면 다음 그림과 같은 화면을 볼 수 있을 것이다. 어플리케이션의 상단 네비게이션에서 홈 버튼을 클릭하거나 사용자관리 버튼을 클릭하면 브라우저 상단의 URL 입력창 끝에 #/uerMgt 부분이 해당 화면과 연결된 URL로 변경되는 것을 확인할 수 있다.

{% bimg imgs/router_tutorial_01.png 500x200 %}라우터 데모 어플리케이션에서의 사용자 관리 화면{% endbimg %}


##$http 서비스를 통한 Ajax 기능 구현

단일 페이지 웹 어플리케이션을 개발하는데 있어서 앞에서 본 라우트 기능은 매우 중요하다. 하지만 데이터를 서버로부터 읽어와 동적으로 화면을 구성하는 것도 매우 중요하다. 이전에 제이쿼리를 사용한 경험이 있는 독자라면 $.ajax나 $.get 또는 $.post와 같은 메소드를 기억할 것이다. 이러한 메소드를 이용하여 데이터를 비동기로 서버로부터 읽어와 동적으로 화면을 구성하였다. AngularJS에도 이런 Ajax 기능을 위해 제이쿼리처럼 XMLHttpRequest를 손쉽게 사용할 수 있게 하는 $http 서비스를 제공한다. 이전의 라우터 데모 어플리케이션에서 사용자 정보를 가져오는 부분에 $http 서비스를 사용하여 데이터를 가져오도록 변경해 보도록 하겠다. 다음 예제 코드를 확인해보려면 요청을 받아줄 별도의 웹 서버가 필요하다. 간단한 노드나 파이썬 서버를 구동하도록 하여 sample.json파일을 호스팅하도록 한다.

{% highlight javascript %}
//생략
controller('userListCtrl',function($scope, $http) {
    var reqPromise = $http({
      method : 'GET',
      url : 'sample.json'
    });
//$http서비스를 요청 설정 객체와 함께 호출한다. 요청 설정 객체에 method 속성에는 GET, POST, DELET, PUT과 같은 HTTP 메소드를 문자열값으로 정하고 url 속성으로 전송할 대상 URL을 문자열값으로 줄 수 있다. 호출한 결과로 Promise객체를 반환하는데 해당 객체에 success나 error 메소드를 통하여 성공과 실패 시 호출할 콜백함수를 전달할 수 있다.

    reqPromise.success(function(data) {
      $scope.userList = data;
    });
//$http 서비스를 호출하고 반환된 Promise 객체에 success 매소드를 이용하여 요청 성공 시 호출할 콜백함수를 작성하였다. 요청으로 받은 데이터를 $scope.userList에 대입하여 사용자 목록 데이터를 화면에 출력한다. 제이쿼리와 다르게 별도로 DOM 처리를 할 필요없이 AngularJS의 데이터바인딩을 이용하여 결과 데이터에 맞게 화면이 동적으로 구성된다.

    reqPromise.error(function(data) {
      console.error("Ajax 에러 발생");
    });
});
{% endhighlight %}

$http 서비스 함수 호출 후 결과로 반환된 Promise 객체에서 success와 error에 메소드에 전달하는 콜백함수에는 다음과 간은 인자를 전달 받을 수 있다.

{% highlight javascript %}
success(function(data, status, headers, config) {
//data: 문자열인 응답 바디를 transform 함수를 통하여 변환된 값이다. 기본적으로 JSON 문자열을 자바스크립트 객체로 변환한 값이다.
//status: 응답 상태 코드
//headers: 해더 값을 가지고 올 수 있는 getter 함수이다. headers(헤더이름)으로 사용한다.
//config: http 설정 객체이다. $http 서비스를 호출할 때 전달한 설정객체이다.
})
error(function(data, status, headers, config) {
//위와 동일
})
{% endhighlight %}

##단축 메서드 제공
앞의 예제 에서 보았듯이 $http 서비스를 설정 객체와 함께 함수로 호출해서 사용했다. 하지만 $http 서비스를 메서드를 제공하는 객체처럼 사용할 수도 있다. $http 서비스는 편 의상 GET, POST, PUT, DELETE와 같은 HTTP 메서드별로 단축 메서드를 제공한다. 다음 메서드는 $서비스에서 사용할 수 있는 메서드들이다. 

- $http.get(url, 설정 객체) 
- $http.post(url, data, 설정 객체) 
- $http.put(url, data, 설정 객체) 
- $http.delete(url, 설정 객체) 
- $http.head(url, 설정 객체) 
- $http.jsonp(url, 설정 객체) 

메서드 명에서 알 수 있듯이 $http.get은 HTTP GET 요청을 보내는 것이고 $http.delete는 HTTP DELETE 요청을 보내는 것이다. 다음 코드는 이전 코드를 $http 서비스를 단축 메서드로 변경한 코드이다.

{% highlight javascript %}
controller('userListCtrl',function($scope, $http) {
    var reqPromise = $http.get('sample.json');
//$http서비스의 get 단축메소드를 사용하였다. 이전 코드보다 더욱 간결해진 것을 볼 수 있다.

    reqPromise.success(function(data) {
      $scope.userList = data;
    });

    reqPromise.error(function(data) {
      console.error("Ajax 에러 발생");
    });
});

{% endhighlight %}


## $routerParam 서비스를 이용하여 사용자 상세화면 연결

지금까지 라우터 데모 어플리케이션을 ngRoute 모듈을 이용하여 단일페이지 웹 어플리케이션으로 개발해 보았다. 그리고 해당 어플리케이션의 사용자 관리 페이지에서 전체 사용자 목록을 테이블로 보여주었는데 각 행을 클릭하면 해당 사용자 목록의 상세화면을 보여주는 기능을 추가해 보자.

우선 사용자 상세화면 템플릿 파일을 views 폴더 안에 다음과 같이 작성하자.

{% highlight html %}
<form class="form-horizontal">
  <div class="control-group">
    <label class="control-label">사용자 이름</label>
    <div class="controls">
      <input type="text" ng-model="user.name">
<!-- $scope.user 객체의 name 속성과 데이터 바인딩을 한다. -->
    </div>
  </div>
  <div class="control-group">
    <label class="control-label">E-Mail</label>
    <div class="controls">
      <input type="text" ng-model="user.email">
<!-- $scope.user 객체의 email 속성과 데이터 바인딩을 한다. -->
    </div>
  </div>
  <div class="control-group">
    <label class="control-label">가입 날짜</label>
    <div class="controls">
      <input type="text" ng-model="user.regDate">
<!-- $scope.user 객체의 regDate 속성과 데이터 바인딩을 한다. -->
    </div>
  </div>
  <div class="control-group">
      <div class="controls">
        <button type="button" class="btn" ng-click=”back()”>뒤로가기</button>
<!-- 클릭 시 $scope 객체의 back 메소드를 호출 한다. -->
      </div>
    </div>
  </div>
</form>
{% endhighlight %}

이제 사용자 상세화면인 앞의 템플릿과 url이 연결되도록 $routeProvider에 새로운 라우트 설정을 추가하자. routeApp.js 파일을 다음과 같이 수정한다.

{% highlight javascript %}
//생략
$routeProvider
    .when('/home', {templateUrl: 'views/home.html'})
    .when('/userList', {templateUrl: 'views/userList.html', controller: 'userListCtrl'})
    .when('/user/:userId', {templateUrl: 'views/userDetail.html', controller: 'userDetailCtrl'})
//사용자 상세화면과 연결되는 새로운 라우트 설정을 추가하였다. 여기서 URL에 매개변수를 사용한 것에 주목하자. :userId라는 매개변수를 이용하면 /user/1, /user/2 와 같은 형태의 URL 요청이 오면 userId 매개변수에 1 또는 2와 같은 값을 대입하고 해당 라우터에 의하여 템플릿 화면과 컨트롤러로 라우팅 처리를 한다. 이 매개변수는 나중에 $routeParam.userId로 사용이 가능하다.
    .otherwise({redirectTo: '/home'});
})
//생략
{% endhighlight %}

그럼 아래와 같이 routeApp.js에 userDetailCtrl 컨트롤러를 작성한다.

{% highlight javascript %}
controller('userDetailCtrl',function($scope, $http, $routeParams, $location) {
//URL 매개변수 값을 가져오기 위한 $routeParams 서비스와 URL 이동을 위해 $location 서비스를 주입받는다.
    var id = $routeParams.userId;
//$routeProvider에서 정의한 :userId 매개변수 값을 $routeParams 서비스를 통하여 접근한다.
    var reqPromise = $http.get('sample-'+id+'.json');
//각 userId에 해당하는 데이터를 $http 서비스를 통하여 요청한다.

    reqPromise.success(function(data) {
      $scope.user = data;
    });

    reqPromise.error(function(data) {
      console.error("Ajax 에러 발생");
    });

    $scope.back = function() {
      $location.url('/userList')
//사용자 상세 화면에서 뒤로가기 버튼을 클릭 시 해당 함수가 호출되며 이 때 $location서비스를 이용하여 브라우저 URL을 ‘userList’로 변경한다.
    };
});
{% endhighlight %}

마지막으로 사용자 목록 테이블의 각 행을 클릭할 경우 사용자 상세화면 URL로 이동하도록 기존에 만든 사용자 목록화면을 수정하자. 우선 userList.html 템플릿 파일을 다음과 같이 수정한다.

{% highlight html %}
<tr ng-repeat="user in userList" ng-click="goDetail(user.userId)">
<!-- 각 행을 클릭 시 $scope 객체의 goDetail 메소드를 호출한다. -->
       <td>{{ "{{ $index + 1 " }}}}</td>
       <td>{{ "{{ user.name " }}}}</td>
       <td>{{ "{{ user.email " }}}}</td >
       <td>{{ "{{ user.regDate " }}}}</td>
</tr>
{% endhighlight %}

다음으로 userListCtrl 컨트롤러 함수에 다음과 같이 goDetail 메소드를 추가한다.

{% highlight javascript %}
controller('userListCtrl',function($scope, $http, $location) {
//$location 서비스를 주입받도록 추가하였다.
    var reqPromise = $http.get('sample.json');

    reqPromise.success(function(data) {
      $scope.userList = data;
    });

    reqPromise.error(function(data) {
      console.error("Ajax 에러 발생");
    });

    $scope.goDetail = function(userId) {
      $location.url('/user/'+userId);
//$location 서비스의 URL 서비스의 url 메소드를 이용하여 사용자 아이디에 해당하는 ‘user/사용자아이디’ URL로 이동한다.
    };
}).
{% endhighlight %}

다시 라우터 데모 어플리케이션을 브라우저에서 열어보자. 그리고 사용자 목록 화면에서 사용자 행을 클릭하면 해당 사용자에 대한 상세 정보를 보는 페이지로 이동하게 된다.


## References

- [angularjs official document](https://docs.angularjs.org/)
