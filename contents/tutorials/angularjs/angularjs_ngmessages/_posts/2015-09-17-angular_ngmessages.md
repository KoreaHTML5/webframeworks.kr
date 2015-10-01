---
layout : tutorials
title : ngMessage를 이용한 메시지처리
category : tutorials
subcategory : data-input
summary : 우리는 일반적으로 메시지를 이용하여 사용자에게 어플리케이션 상태나 사용자 입력에 대한 결과를 알려준다. 본 글을 통하여 AngularJS 웹 어플리케이션에선 어떻게 이런 메시지를 처리하는지 살펴보겠다.
permalink : /tutorials/angularjs/angularjs_ngmessages
title_background_color : DD1B16
title_color : FFFFFF
tags : javascript framework angularjs tutorials ngMessages
author : jeadoko
---

# AngularJS에서 ngMessages 지시자 사용하기

AngularJS 1.3이후로 ngMessages 지시자가 추가됐다. ngMessages 지시자는 이름에서 유추할 수 있듯이 메시지 처리를 위한 지시자이다. 주로 사용자가 입력하는 폼 컨트롤러의 상태 메시지를 보여주데 활용할 수 있는데 예를 들면 필수로 입력해야하는 값을 입력하지 않았다든지 전화번호에 맞지 않는 포멧으로 입력하였다든지 등의 메시지들을 보여줄 수 있다. ngMessages 지시자가 없던 AngularJS 1.3 이전에는 [폼 유효성 처리](../angularjs_form_validation)에서 설명한 것과 같이 ng-show나 ng-if를 이용해서 메시지 처리 할 수 있었다. 다음은 ngMessages가 없던 1.2 버젼에서 처리한 템플릿 코드이다.

{% highlight html %}
<form name="signUpForm" class="form" role="form">
  <legend>회원가입</legend>
  <h4>AngularJS 폼 데모</h4>
  <div class="row">
    <div class="col-xs-6 col-md-6">
      <input type="text" name="firstname" class="form-control input-lg" ng-model="user.firstName" placeholder="성" ng-required="true" ng-maxlength="4"/>
    </div>
    <div ng-show="signUpForm.firstname.$error.maxlength" class="col-xs-12 col-md-12 alert alert-warning" role="alert">성은 최대 4글자만 입력가능합니다.
    </div>
    <div ng-show="signUpForm.firstname.$error.required"  class="col-xs-12 col-md-12 alert alert-warning" role="alert">성은 필수로 입력 해야 합니다.
    </div>
    <div class="col-xs-6 col-md-6">
      <input type="text" name="lastname" class="form-control input-lg" placeholder="이름" ng-model="user.lastName" ng-required="true" ng-minlength="2"/>
    </div>
  </div>
</form>
{% endhighlight %}

그럼 이제 위 코드를 ngMessages 지시자를 이용하여 변경해 보자. 우선 ngMessages 지시자를 사용하려면 ngMessage 모듈을 의존관계를 설정해야한다. angular-messages.js 스크립트를 로드하도록 스크립트 태그를 아래와 같이 추가하자.

{% highlight html %}
<script src="bower_components/angular-messages/angular-messages.js"></script>
{% endhighlight %}

다음으로 angular 모듈 선언문장에서 다음과 같이 ngMessage모듈의존관계를 설정한다.

{% highlight javascript %}
angular.module('messageApp', ['ngMessages'])
{% endhighlight %}

그럼 이제 실제 form태그 내부의 코드를 다음과 같이 수정해 보자.

{% highlight html %}
<form name="signUpForm" class="form" role="form">
  <legend>회원가입</legend>
  <h4>AngularJS 폼 데모</h4>
  <div class="row">
    <div class="col-xs-6 col-md-6">
      <input type="text" name="firstname" class="form-control input-lg" ng-model="user.firstName" placeholder="성" ng-required="true" ng-maxlength="4"/>
    </div>
    <div class="col-xs-6 col-md-6">
      <input type="text" name="lastname" class="form-control input-lg" placeholder="이름" ng-model="user.lastName" ng-required="true" ng-minlength="2"/>
    </div>
  </div>
  <div ng-messages="signUpForm.firstname.$error">
    <div ng-message="maxlength, required" class="alert alert-warning">성은 필수이고 최대 4글자만 입력가능합니다.</div>
  </div>
</form>
{% endhighlight %}

위 코드를 살펴보면 ngMessages 지시자 하위에 태그에 ngMessage 지시자를 사용하는 태그들이 보일 것이다. ngSwitch 지시자와 흡사한 사용법을 볼 수 있는데 ng-messages 속성값으로는 키-벨류 객체로 계산되는 표현식을 입력하면 된다. 일반적으로 ngModel 인스턴스의 $error 객체를 전달하는데 위 코드에서는 firstname 모델의 $error 속성을 값으로 주고 있다.

ngMessages 지시자의 하위 지시자로 ngMessage 지시자를 사용할 수 있는데 부모 태그의 ngMessages에 주어진 키-벨류 객체의 키값들을 속성 값으로 줄 수 있다. 위 예제에서 maxlength와 required 두 키를 속성값으로 주었고 두 속성의 값이 true가 될 때 지시자 태그의 안의 컨텐츠가 화면에 보이게 된다.

ngMessages 지사자를 태그로써 사용할수도 있는데 그렇게 되면 앞에서 속성값으로 주었던 키-벨류 객체로 계산되는 표현식을 어떻게 전달할 수 있을가? 다음 코드를 보면 알 수 있다.

{% highlight html %}
<ng-messages for="signUpForm.firstname.$error">
  <ng-message when="maxlength, required" class="alert alert-warning">성은 필수이고 최대 4글자만 입력가능합니다.</ng-message>
</ng-messages>
{% endhighlight %}

이렇게 ng-messages는 for를 속성명을 이용하고 ng-message는 when 속성명을 이용하여 이전에 해당 지시자들을 속성명으로 이용하여 넘겼던 값들을 전달할 수 있다.

지금까지는 간단한 사용법에 대하여 살펴보았는데 좀 더 다양한 형태의 사용법을 살펴보자.

## 기존 메시지 템플릿 추가

우리는 단순한 반복을 싫어한다. 같은 코드가 한 소스상에 반복적으로 나타나면 함수로 묶고싶어진다. 그러면 계속적으로 씌이는 메시지는 어떠할까? 이 또한 외부 메시지 템플릿파일로 추출한 후 사용될 곳에 선언만 할 것이다. 함수처럼.

ngMessage 모듈에는 이렇게 외부 메시지 템플릿을 동적으로 추가하는 지시자를 제공한다. 다음 코드를 보자.

{% highlight html %}
<!-- requireMessage.html -->
<div ng-message="maxlength, required" class="alert alert-warning">성은 필수이고 최대 4글자만 입력가능합니다.</div>
{% endhighlight %}

{% highlight html %}
<div ng-messages="signUpForm.firstname.$error">
  <div ng-messages-include="requireMessage.html"></div>
</div>
{% endhighlight %}

ngMessageInclude 지시자에 위와 같이 외부 템플릿에 연결되는 문자열을 입력한다. AngularJS 1.4 버전 이후부터는 ngMessage지시자가 사용되는 부모 태그 하위에 쓸수 있고 1.3이하 버전에서는 ngMessage지시가작 사용되는 부모 태그와 같은 위치에 속성으로 사용한다.

다음 코드는 1.3이하 버전일때 ng-messages-include 사용 코드이다.

{% highlight html %}
<div ng-messages="signUpForm.firstname.$error" ng-messages-include="requireMessage.html">
</div>
{% endhighlight %}

## 동적 메시지 처리
AngularJS 1.4 이전에는 AngularJS의 메시지처리는 ngMessage와 ngMessagesInclude를 이용하여 외부 메시지 템플릿을 불러오거나 하나의 템플릿에 정적으로 메시지 내용을 적어서 사용할 수 밖에 없었다. 물론 1.2때보다 더 깔끔하고 직관적으로 템플릿을 작성할 수 있어서 좋았지만 ngMessage 지시자에 표현식을 전달할 수 없었던 문제점은 있었다. 하지만 AngularJS 1.4버전부터 ngMessageExp 지시자가 나왔는데 해당 지시자는 에러 타입으로 계산되는 표현식을 전달할 수 있다. 이제 우리는 동적으로 어떤 메시지를 보여줄지 정할 수 있게 된것이다.

ngMessageExp를 사용하면 모가 좋을까? ngMessage만 사용했을 경우에는 템플릿에 모든 메시지 내용을 작성하여 배포하면 후에 새로운 에러 타입에 따른 메시지를 추가하려면 템플릿 코드를 수정해야 한다. ngMessagesInclude를 사용하면 메시지 내용을 주는 템플릿 만을 수정해서 전체 템플릿을 배포할 필요는 없지만 여전이 불편하거나 할 일이 많다. (서버에서 단순히 데이터만 주는게 아니라 HTML 메시지 템플릿을 만들도록 처리해야하거나 등등)

ngMessageExp를 사용하면 에러 메시지를 JSON으로 제공하는 서비스 API가 있다고 가정하면 새로운 애러타입에 따른 JSON데이터만 추가되면 템플릿 수정없이 바로 메시지 처리가 동적으로 적용시킬수 있다. 이 부분을 한번 앞에서 작성한 회원가입 코드에 적용해보자.

{% highlight html %}
<!-- 메인 템플릿 부분 -->
<body class="container" ng-controller="mainController">
  <form name="signUpForm" class="form" role="form">
   <!-- 생략 -->
    <div ng-messages for="signUpForm.firstname.$error">
      <div ng-repeat="message in messages">
        <div ng-message-exp="message.exp" class="alert alert-warning">{{"{{ message.msg "}}}}</div>
      </div>
    </div>
  </form>
</body>
{% endhighlight %}

위와 같이 ngMessages안에 ngRepeat 지시자를 사용할 수 있다. 아시다시피 ngRepeat 지시자는 messages 배열의 요소만큰 복제를 하면서 현재 배열의 요소를 message로 접근하게 해준다. 이 message는 위 코드를 보면 유추할 수 있듯이 exp와 msg 속성을 가지는데 ngMessageExp에 message의 exp속성을 전달하면 exp속성의 값이 에러코드를 나타냄을 알수 있다. 그리고 그리고 msg는 에러코드에 해당하는 메시지이다. 그럼 $scope에 messages 속성에 값을 셋팅하는 컨트롤러 코드를 보자.

{% highlight javascript %}
//자바스크립트 부분
angular.module('messageApp', ['ngMessages']).
  controller('mainController', ['$scope','$http', function($scope, $http){
    $scope.messages = [];
    $http.get('messages.json')
      .success(function (response) {
        $scope.messages = response.data;
      });
  }])
{% endhighlight %}

messages는 $http서비스를 이용하여 서버로부터 messages.json로 요청하여 받은 응답데이터로 대입된다. 그러면 실제 messages.json 데이터는 어떠한 모습인지 보도록 하자.

{% highlight javascript %}
//messages.json
[{
  "exp": "required",
  "msg": "필수값 입력을 하지 않았습니다."
}, {
  "exp": ["minlength", "maxlength"],
  "msg": "최소 2글자 최대 4글자 입니다."
}]
{% endhighlight %}

편의상 messages.json 정적파일을 서버로부터 요청하여 받아오지만 DB로부터 데이터를 받아와서 반환하도록 구현할 수 도 있겠다. exp를 보면 알수 있듯이 ng-message-exp에 주어지는 값은 에러코드 문자열 혹은 코드들을 담은 배열로 계산되는 표현식이라는 것을 알 수 있다. 

## References

- [angularjs official document](https://docs.angularjs.org/)
