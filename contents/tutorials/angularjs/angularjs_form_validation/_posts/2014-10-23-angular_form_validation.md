---
layout : tutorials
title : AngularJS에서 폼 데이터 벨리데이션 처리하기
category : tutorials
subcategory : angularjs
summary : 폼을 작성할 때 사용자의 입력 값의 유효성 체크를 할 때 AngularJS를 어떻게 활용할 수 있는지 살펴본다.
permalink : /tutorials/angularjs/angularjs_form_validation
title_background_color : DD1B16
title_color : FFFFFF
tags : javascript framework angularjs tutorials form validation
author : jeadoko
---

# AngularJS에서 폼 데이터 벨리데이션 처리하기

대다수의 웹 어플리케이션에서 폼을 사용한다. 아주 간단한 예로 로그인이나 회원가입이 있고 좀 더 복잡한 예를들면 상품등록과 같은 많고 다양한 입력 요소를 요구하는 경우가 있다. 이런 폼들은 입력요소별로 다양한 제약조건들이 요구된다. 가령 회원가입 시 사용자 아이디는 필수값이고 전화번호는 특정한 데이터 포멧을 요구한다. 이러한 요구사항을 위해 벨리데이션 처리를 하게되는데 AngualrJS는 손쉽게 벨리데이션 처리를 할 수 있다. 그럼 회원 가입 폼을 만들면서 벨리데이션 처리의 기본기능을 보도록 하자.

## 회원가입 폼 만들기

회원가입을 하기위해서는 이름, 이메일, 비밀번호등과 같은 정보를 이벽하는 입력창이 필요하다. 다음 그림은 우리가 만들 회원가입 폼이다.

{% bimg imgs/form_valid_01.png 400x370 %}회원가입 폼 그림{% endbimg %}

다음은 회원가입 폼의 &lt;form&gt;태그 부분의 소스코드이다. 
전체 소스코드는 [GitHub web-angular-sample 프로젝트의 form-validation Branch](https://github.com/jeado/web-angular-sample/tree/form-validation)에서 form-validation.html 파일로 확인할 수 있다.

{% highlight html %}
<form name="signUpForm" class="form" role="form">
  <legend>회원가입</legend>
  <h4>AngularJS 폼 데모</h4>
  <div class="row">
    <div class="col-xs-6 col-md-6">
      <input type="text" name="firstname" class="form-control input-lg" placeholder="성" />
    </div>
    <div class="col-xs-6 col-md-6">
      <input type="text" name="lastname" class="form-control input-lg" placeholder="이름" />
    </div>
  </div>
  <br>
  <input type="text" name="email" class="form-control input-lg" placeholder="Email" />
  <br>
  <input type="password" name="password" class="form-control input-lg" placeholder="패스워드" />
  <br>
  <input type="password" name="confirm_password" class="form-control input-lg" placeholder="패스워드 재입력" />
  <br>
  <label>성별 : </label>
  <input type="radio" name="gender" value="M">남자
  <input type="radio" name="gender" value="F">여자
  <br>
  <button class="btn btn-lg btn-primary btn-block signup-btn" type="submit">회원가입</button>
</form>
{% endhighlight %}

그럼 폼 벨리데이션 처리를 추가해보자. AngularJS의 폼 벨리데이션을 사용하려면 우선 적용하고자 하는 폼의 name 속성값을 작성해야 한다. 위 코드에서는 회원가입폼의 name 속성값을 signUpForm으로 주었다.

그리고 각 &lt;input&gt;에도 name 속성값을 준다. 이 name 속성값은 나중에 벨리데이션 처리 결과에 접근할때 사용된다. 그리고 각 입력요소가 벨리데이션 처리가 되기 위해서는 꼭 ng-model로 데이터바인딩이 되어 있어야 한다. (위의 코드에는 아직 ng-model이 작성되지 않았다.)

## 필수값 제약조건(ng-requried, requried)

이제 실제로 제약조건들을 각 입력요소에 주겠다. 우선 성별을 제외한 모든 요소가 필수값이라고 가정하고 필수값 제약조건을 준다. 필수값 제약조건은 대상 &lt;input&gt;에 다음과 같은 속성을 주면된다.

    ng-required="표현식"
    또는
    required="필수값 에러키"

필수값 제약은 ng-required 또는 required로 줄수있는데 ng-required의 속성값으로 주는 표현식의 결과가 true면 required="required"가 추가되어 제약조건이 만들어진다. 즉 그냥 required에 required 속성값을 주면 해당 속성 값으로 에러키가 만들어지는 것이고 ng-requried를 주면 required라는 미리 정해진 키로 제약조건이 만들어 지는 것이다. 그럼 아래 코드와 같이 우리 회원가입 폼에 필수값 제약조건을 주도록 하자.

{% highlight html %}
<!-- 생략 -->
<div class="row">
  <div class="col-xs-6 col-md-6">
    <input type="text" name="firstname" class="form-control input-lg" ng-model="user.firstName" placeholder="성" ng-required="true"/>
  </div>
  <div class="col-xs-6 col-md-6">
    <input type="text" name="lastname" class="form-control input-lg" placeholder="이름" ng-model="user.lastName" ng-required="true" />
  </div>
</div>
<br>
<input type="text" name="email" class="form-control input-lg" placeholder="Email" ng-model="user.email" ng-required="true" />
<br>
<input type="password" name="password" class="form-control input-lg" placeholder="패스워드" ng-model="user.password" ng-required="true" />
<br>
<input type="password" name="confirm_password" class="form-control input-lg" placeholder="패스워드 재입력" ng-model="user.repassword" ng-required="true" />
<!-- 생략 -->
{% endhighlight %}

위와 같이 코드를 수정하고 다시 브라우저에서 확인을 해도 별다른 차이를 못느낄것이다. 그럼 조건에 맞지 않을 경우 사용자가 인지하도록 변경해보자. 대체로 CSS를 이용하여 조건에 맞지 않는 입력 요소를 부각한다던지 혹은 해당 입력요소 주변에 메시지를 보여준다. 우선 CSS를 이용해 필수값을 입력하지 않을 경우 필수값 입력박스 테두리가 빨갛게 되도록 하자. 다음과 같은 CSS코드를 추가한다.

{% highlight css %}
input.ng-invalid {
  border: 5px solid red;
}
{% endhighlight %}

이제 다시 브라우저에서 회원가입 페이지를 로드하면 다음 그림과 같은 화면을 볼 수 있을 것이다.

{% bimg imgs/form_valid_02.png 400x370 %}회원가입 폼 그림{% endbimg %}

## 최소/최대 글자수 제약조건(ng-minlength/ng-maxlength)

이번엔 회원가입 폼에 최소/최대 글자수 제약조건을 추가해보자. 말이 안되긴 하지만 성은 최대 4글자를 넘지 못하고 이름은 최소 2글자는 되어야한다고 하자. 이때 우리는 ng-minlength와 ng-maxlength 속성을 줄 수 있다.(외자 이름을 가지신 분께는 죄송합니다.) 

    ng-minlenght="숫자"
    ng-maxlength="숫자"

그럼 다음과 같이 성과 이름을 입력하는 요소를 변경할 수 있다.

{% highlight html %}
<!-- 생략 -->
<div class="col-xs-6 col-md-6">
  <input type="text" name="firstname" class="form-control input-lg" ng-model="user.firstName" placeholder="성" ng-required="true" ng-maxlength="4"/>
</div>
<div class="col-xs-6 col-md-6">
  <input type="text" name="lastname" class="form-control input-lg" placeholder="이름" ng-model="user.lastName" ng-required="true" ng-minlength="2"/>
</div>
<!-- 생략 -->
{% endhighlight %} 

다시 브라우저에서 회원가입 페이지를 로드하고 성에 4자보다 적게 이름을 2자보다 많게 작성하면 빨간 테두리가 사라지는 것을 확인할 수있다. 하지만 여기에 문제점이 있다. 사용자가 성과 이름을 대체 최소/최대 몇자로 작성해야 하는지 바로 알 수 없다는 것이다. 그래서 이를 바로 알려주도록 입력박스 하단에 제약조건에 만족을 하지 않을 경우 정확한 제약조건을 알려주도록 하자.

{% highlight html %}
<!-- 생략 -->
<div class="col-xs-6 col-md-6">
  <input type="text" name="firstname" class="form-control input-lg" ng-model="user.firstName" placeholder="성" ng-required="true" ng-maxlength="4"/>
</div>
<div class="col-xs-6 col-md-6">
  <input type="text" name="lastname" class="form-control input-lg" placeholder="이름" ng-model="user.lastName" ng-required="true" ng-minlength="2"/>
</div>
<div ng-show="signUpForm.firstname.$error.maxlength" class="col-xs-12 col-md-12 alert alert-warning" role="alert">성은 최대 4글자만 입력가능합니다.</div>
<div ng-show="signUpForm.lastname.$error.minlength"  class="col-xs-12 col-md-12 alert alert-warning" role="alert">이름은 최소 2글자만 입력가능합니다.</div>
<!-- 생략 -->
{% endhighlight %} 

다시 브라우저에서 읽으면 아래 그림과 같은 화면을 볼 수 있을것이다.

{% bimg imgs/form_valid_03.png 400x420 %}회원가입 폼 그림{% endbimg %}

AngularJS는 제약조건에 대한 에러를 각 에러에 대한 키를 가지는 $error 객체로 알 수 있도록 한다. 즉 ng-required, ng-minlength 와 같은 속성으로 제약조건을 주고 제약조건에 대한 유효성검사 알아서 하고 그 결과를 $error로 확인할 수 있게 한다.

위 코드의 signUpForm.firstname.$error.maxlength을 보면 signUpForm은 앞에서 &lt;form&gt;의 name 속성으로 준 값이고 firstname도 마찬가지로 &lt;input&gt;의 name 속성으로 준 값이다. 이렇게 name 속성의 값으로 $error객체를 접근하여 최대값 에러는 maxlength를 키로하여 결과를 true/false로 값을 얻을 수 있다. 최대값 에러가 있으면 true이고 없으면 false이다. 폼 전체에 대하여 확인하려면 signUpForm.$error로 확인할 수 가 있다.

## 패턴 매치 제약조건 (ng-pattern)

패스워드같은 경우에는 제약조건이 다양하다. 몇 글자 이상에서 부터 문자랑 숫자 포함여부 또는 대문자 포함 여부까지도 제약조건으로 준다. 이때 우리는 ng-pattern을 이용하여 정규표현식으로 제약조건을 줄 수 있다.

    ng-pattern="정규표현식"

그럼 회원가입 폼의 패스워드 입력박스에 제약조건을 주고 벨리데이션 체크 결과를 하단에 메시지를 보여주도록 코드를 수정하자.

{% highlight html %}
<!-- 생략 -->
<input type="password" name="password" class="form-control input-lg" placeholder="패스워드" ng-model="user.password" ng-required="true" ng-pattern="/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,8}$/" />
<div ng-show="signUpForm.password.$error.pattern" class="alert alert-warning" role="alert">최소 4글자, 최대 8글자이고 적어도 1나의 소문자, 대문자, 숫자를 포함해야합니다.</div>
<!-- 생략 -->
{% endhighlight %}

## References

- [angularjs official document](https://docs.angularjs.org/)
