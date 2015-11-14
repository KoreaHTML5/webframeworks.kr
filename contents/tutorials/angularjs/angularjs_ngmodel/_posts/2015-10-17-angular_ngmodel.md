---
layout : tutorials
title : AngularJS 데이터바인딩 탐구
category : tutorials
subcategory : data-input
summary : AngularJS 1.3이후부터 데이터바인딩에 대한 기능이 강력해졌다. 강려해진 폼과의 데이터 바인딩 처리인 ngModel에 대하여 자세히 살펴보겠다.
permalink : /tutorials/angularjs/angularjs_ngmessages
title_background_color : DD1B16
title_color : FFFFFF
tags : javascript framework angularjs tutorials ngMessages
author : jeadoko
---

# AngularJS에서 데이터바인딩

데이터바인딩이란 두 데이터 혹은 정보의 소스를 모두 일치시키는 기법이다. 웹 어플리케이션에서의 데이터바인딩이란 화면에 보이는 데이터와 브라우저 메모리에 있는 데이터를 일치시키는 거라 하겠다. AngularJS에서는 데이터바인딩 기능을 제공하기 위해 ngModel과 ngBind 지시자를 만들었다. 우리는 매번 AngularJS 기반의 웹 어플리케이션을 개발할때 두 지시자를 사용하곤 했다. 이번 튜토리얼에서는 여러분들에게 AngularJS에서 두 지시자의 사용법을 간단히 살펴보고 나아가 1.3버전 이후 더욱 강력해진 ngModel 지시자에 대하여 살펴보도록 하겠다.

## ngBind 지시자

ngBind 지시자는 단방향<sup>one-way</sup> 데이터 바인딩을 지원한다. 여기서 단방향이란 자바스크립틔 데이터를 HTML 화면의 보여지는데 씌이는 데이터로 동기화를 의미하고 실제 HTML 요소의 텍스트 내용을 표현식의 결과로 바꾸고 표현식의 값이 바뀔때마다 지속적으로 업데이트를 한다. 간단한 예제를 보자.

{% highlight html %}
<body class="container" ng-controller="mainController">
  <script>
  angular.module('ngBindApp', []).
    controller('mainController', ['$scope',function($scope){
      $scope.greeting = "hello";
      $scope.changeValue = function (newVal) {
        $scope.greeting = newVal;
      }
    }]);
  </script>
  <!-- ngBind 지시로 greeting 모델의 값(hello)에 데이터바인딩을 하였다. -->
  <h1 ng-bind="greeting"></h1>

  <!-- 버튼을 클릭하면 changeValue함수를 호출하고 자바스크립트 데이터를 변경한다. 해당 모델의 값이 변경되는 자동으로 바인딩된 화면의 값이 업데이트된다. -->
  <button ng-click="changeValue('hello again')">값 변경</button>
</body>
{% endhighlight %}

위 예제에서 greeting 모델의 값은 hello이다. 자바스크립트의 데이터로 정의된 이 값을 h1 태그의 텍스트 내용으로 바인딩을 하기 위해 ngBind 지시자를 h1태그의 속성으로 사용하였다. 또한 아래 '값 변경' 버튼을 클릭하면 greeding 모델의 값을 hello again으로 변경하도록 하였다. 모델 값이 변경이되면 AngularJS는 내부에서 자동으로 바인딩된 텍스트 내용을 변경된 값으로 업데이트 한다.

## one-time 바인딩

단방향 데이터바인딩을 위해선 ngBind 지시자외에 이중 중괄호 `{{"{{ "}}}}`를 이용하여 자바스크립트 데이터 즉 모델 값을 화면 데이터로 연결할 수 있다. 위의 코드에서 ngBind를 사용한 부분을 아래와 같이 변경하면 된다.

{% highlight html %}
<body class="container" ng-controller="mainController">
  <script>
  //생략
  </script>
  <!-- 이중 중괄호를 이용하여 greeting 모델의 값(hello)에 데이터바인딩을 하였다. -->
  <h1>{{"{{ greeting "}}}}</h1>
  <button ng-click="changeValue('hello again')">값 변경</button>
</body>
{% endhighlight %}

AngularJS 1.3에서는 성능적 향상을 위해 한번 데이터를 바인딩한 후 지속적으로 동기화를 할 필요가 없는 one-time 바인딩을 추가하였다. one-time 바인딩은 `::`으로 시작할 때 처리된다. 앞의 예제를 one-time 바인딩으로 변경하여 보자. 

{% highlight html %}
 <!-- 바인딩하고자 하는 greeting 모델앞에 ::과 함께 작성하여 한번만 바인딩되게 하였다. -->
 <h1>{{"{{ ::greeting "}}}}</h1>
{% endhighlight %}

위와 같이 `::greeting`으로 greeting 모델의 값과 h1태그의 텍스트 값을 한번만 바인딩하였기 때문에 버튼을 클릭해도 값이 변경되지 않음을 확인할 수 있다.

one-time 바인딩은 처음 화면에 값을 출력하고 바뀔 필요가 없을 때 유용하게 사용될 수 있다. 이는 무분별한 watcher등록을 제한하여 성능향상을 가지고 올 수 있다.

## ngModel 지시자

ngModel 지사자는 입력박스와 같은 폼컨트롤과 양방향<sup>tow-way</sup> 데이터 바인딩 처리를 지원한다. 즉 자바스크립트 데이터와 화면의 입력박스의 값을 서로 연결시켜 어느 한쪽의 값의 변경이 발생해도 서로 값이 동기화된다. 뿐만 아니라 벨리데이션 기능과 컨트롤의 상태(ng-valid, ng-invalid, ng-dirty, ng-pristine, ng-touched, ng-untouched, ng-empty, ng-not-empty)를 관리할 수 있다. 벨리데이션과 관련된 글은 [폼 유효성 처리](../angularjs_form_validation)를 참고하자.

그럼 간단한 ngModel 지시자를 사용한 예제를 살펴보자.

{% highlight html %}
<!DOCTYPE html>
<html lang="en" ng-app="ngBindApp">
<head>
  <meta charset="UTF-8">
  <title>데이터바인딩 예제</title>
  <link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap.css">
  <script src="bower_components/angular/angular.js"></script>
</head>
<body class="container" ng-controller="mainController">
  <script>
  angular.module('ngBindApp', []).
    controller('mainController', ['$scope',function($scope){
      $scope.member = {};
    }]);
  </script>
  <form>
    <h4>회원가입</h4>
    <div class="form-group">
      <label>아이디</label>
      <!-- member 모델의 id속성과 데이터바인딩을 하였다. 화면값이 바뀌면 모델의 값도 바뀌게 된다. -->
      <input type="text" class="form-control" name="inputId" ng-model="member.id">
    </div>
    <div class="form-group">
      <label>이름</label>
      <!-- member 모델의 name속성과 데이터바인딩을 하였다. -->
      <input type="text" class="form-control" name="inputName" ng-model="member.name">
    </div>
    <div class="form-group">
      <label class="radio-inline">
        <!-- member 모델의 gender속성과 데이터바인딩을 하였다. -->
        <input type="radio" name="inlineradio1" value="male" ng-model="member.gender">남자
      </label>
      <label class="radio-inline">
        <!-- member 모델의 gender속성과 데이터바인딩을 하였다. -->
        <input type="radio" name="inlineradio2" value="female" ng-model="member.gender">여자
      </label>
    </div>
    <button type="submit" class="btn btn-default">가입</button>
    <br>
    <div>
        <!-- member 모델의 값이 바뀌면 화면의 값이 업데이트 된다. -->
      {{"{{ member "}}}}
    </div>
  </form>
</body>
</html>
{% endhighlight %}

위 예제를 보면 아이디 입력 컨트롤, 이름 입력 컨트롤, 성별 라디오 컨트롤이 member 모델과 바인딩이 되어 있다. 사용자가 입력 컨트롤에 값을 입력함과 동시에 모델의 값이 업데이트 되는 것을 확인할 수 있다. 우리가 제이쿼리로 이를 구현했다면 입력 컨트롤에 input 이벤트를 리스너 함수들을 등록하고 입력 컨트롤러의 값이 바뀌면 member 모델의 값을 변경했을 것이다. 이 모든 것을 AngularJS 가 내부적으로 해주고 있다.

하지만 많은 모델에 watcher함수들이 등록되어 있거나 필요에 의해서 입력 값이 바로 모델에 바인딩이 되지 않고 일정 수준의 시간으로 딜레이를 주고 싶다면 어떻게 할까? AngularJS 1.3부터는 좀더 세세한 바인딩 처리를 위한 ngModelOption 지시자를 제공하기 시작했다.

## ngModelOptions 지시자

ngModelOptions 지시자는 말 그래도 ngModel에 특정 옵션을 제공하기 위한 지시자이다. 앞에서 말한바와 같이 모델의 값을 업데이트하는 시간을 제한할 수 있는 debounce 옵션을 정의할 수 있다. debounce 옵션에는 밀리세컨드 단위로 숫자를 줄 수 있는데 아래 간단한 예제로 살펴보자.

{% highlight html %}
<div class="form-group">
   <label>아이디</label>
   <!-- ng-model-options 는 옵션객체로 계산되는 표현식이 올 수 있다. -->
   <input type="text" class="form-control" name="inputId" ng-model="member.id" ng-model-options="{debounce : 1000}">
</div>
{% endhighlight %}

브라우저에서 예제를 구동해서 아이디 입력 컨트롤에 값을 입력하면 바로 member모델의 id속성 값에 반영이 되지 않아 아래 member 모델을 json형식으로 보여주는 텍스트가 업데이트 되지 않는 것을 확인할 수 있다. 입력 컨트롤러에 값을 입력한 후 1초후에 변경되는 것을 확인할 수 있다.

ngModelOptions 지시자는 debounce 외에 몇 개의 옵션을 더 제공하는데 이번에는 updateOn 옵션에 대하여 보도록 하자. 이름에서도 유추할 수 있듯이 모델값을 업데이트 하기위한 이벤트를 정의할 수 있다. 모든 입력 컨트롤에는 default로 정의되는 모델 변경 이벤트들이 있는다. 예를 들면 키보드의 키를 누를 때마다 모델을 업데이트하라고 텍스트 입력 컨트롤은 default로 정의되어 있다. 그럼 onBlur 이벤트가 발생할 때 모델을 업데이트하라고 변경해보자.

 {% highlight html %}
<div class="form-group">
   <label>아이디</label>
   <!-- 마우스 포커스가 텍스트 입력 컨트롤에서 빠져 나깔 때 blur이벤트가 발생하고 모델이 업데이트 된다. -->
   <input type="text" class="form-control" name="inputId" ng-model="member.id" ng-model-options="{updateOn : 'blur'}">
</div>
<div class="form-group">
  <label>이름</label>
  <!-- AngularJS가 정의한 이벤트에 의해서도 모델을 업데이트하고 mouseenger 이벤트에서 모델이 업데이트 된다. -->
  <input type="text" class="form-control" name="inputName" ng-model="member.name" ng-model-options="{updateOn : 'default mouseenter'}">
</div>
{% endhighlight %}

위 예제에서 맴버 아이디를 입력하는 아이디 텍스트 입력 컨트롤은 이전과 다르게 마우스 포커스가 입력 컨트롤에서 빠져 나가면 모델 값에 반영되는 것을 볼 수 있다. 아래는 조금 말이 안되긴 하지만 여러 이벤트들을 리스닝할 수 있다는 것을 보여준다. 또한 default라는 AngularJS가 정한 이벤트도 적용하겠다는 것을 알 수 있다.

## References

- [angularjs official document](https://docs.angularjs.org/)
