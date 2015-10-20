---
layout : getstarted
title : Jasmine Javascript Testing
category : getstarted
subcategory : tool
summary : 웹프론트엔드를 개발하다보면 특히나 많은 테스트를 진행해야하는데, 진행이 쉽지가 않습니다. Jasmine은 자바스크립트 코드 테스트를 위한 행위주도개발프레임워크입니다.
permalink : /getstarted/jasmine
title_background_color : FFCC2F
tags : test build javascript
author : weplanetJT
---

# [Jasmine](http://jasmine.github.io/2.0/introduction.html)

## 자스민과 테스트소개
Jasmine은 Pivotal Labs의 개발자들에 의해 만들어진 Behavior-driven development (BDD) 테스트 프레임워크로써, 자동화된 자바스크립트 유닛테스트를 작성할 수 있게 해줍니다
테스트유닛이란 어플리케이션 코드의 기능을 갖고 있는 유닛을 테스트하기위한 코드를 말합니다

위에서 BDD 라는 말이 나왔는데,우선 Test-driven development(TDD)와 BDD에 대해서 설명하도록하겠습니다

Test-Driven Development : 비교적 새로운 소프트웨어 개발 기술로써, 프로세스는 아래와 같습니다.

1. 개발된 코드의 특정 부분을 위한 시험(tests)을 작성합니다. 만약 계산기를 예로 들자면 양수, 음수 정수 등등을 더하는 시험을 작성합니다. 하지만 아직 실제 코드가 작성된게 아니기 때문에, 테스트를 진행한다면 실패(fail)가 될 것입니다.
2. 이제 시험에 연관된 개발코드를 작성합니다. 이 코드는 테스트를 성공(pass)하기 위한 것입니다.
3. 테스트에서 성공하였다면 이제 작성한 코드를 제 위치에 리팩토링하며 집어넣습니다.

TDD는 개발자들이 개발의 명세(Specification)에 대해 개발을 직접 세밀하게 진행보기 전에, 보다 선명한게 생각할 수 있게 해줍니다.
또한 한번 작성된 시험은 언제나 유용합니다

Behavior-Driven Development : BDD는 명세를 작고 쉽게 작성합니다. 기본적으로 BDD는 아래 2개의 중심부분이 있습니다

1. 테스트는 반드시 작고 한가지를 테스트해야합니다. 어플레키에션 전체를 테스트하는 대신, 작지만 많은 수의 시험(tests)을 작성합니다.
 계산기를 예로 들자면 하나의 테스트는 '1더하기', 하나의 테스트는 '0더하기0', 또 다른 테스트는 '-5더하기6', 그리고 '1.2더하기3.1' 등을 작성하게 됩니다.
2. 시험은 문장이어야 합니다. 자스민프레임워크와 계산기를 예로들면, 문장은 "Calculator adds two positive integers"와 같아야합니다. 그러면 테스팅프레임워크가 자동으로 테스트를 진행할 것 입니다.



## 설치하기
Jasmine은 npm을 통해 간단한게 설치가 가능합니다.

```
$ npm install -g jasmine
```

혹은 [여기](https://github.com/jasmine/jasmine/releases)를 눌러 직접 다운로드 후에도 사용 가능하며, 사용시에는 아래와 같이 코드를 추가해줍니다.

{% highlight html %}
<link rel="shortcut icon" type="image/png" href="jasmine/lib/jasmine-2.0.0/jasmine_favicon.png">
<link rel="stylesheet" type="text/css" href="jasmine/lib/jasmine-2.0.0/jasmine.css">

<script type="text/javascript" src="jasmine/lib/jasmine-2.0.0/jasmine.js"></script>
<script type="text/javascript" src="jasmine/lib/jasmine-2.0.0/jasmine-html.js"></script>
<script type="text/javascript" src="jasmine/lib/jasmine-2.0.0/boot.js"></script>
{% endhighlight %}


## 테스트하기
이제 코드를 만들며 테스트를 진행해보도록 하겠습니다.

### 개발코드

우선, 간단한 함수를 만들고, 그것의 행위를 테스트 해보도록 하겠습니다. 함수는 아래처럼 "hello world" 문자열을 반환하는 기능을 할 것입니다.
{% highlight javascript %}
  function helloWorld(){
    return "Hello World!";
  }
{% endhighlight %}

코드가 워낙 간단해서 이 개발작업의 결과에 대해 확신에 차기 마련이지만, 그래도 Jasmine을 통해 테스트를 진행해보도록 하겠습니다 우선 이 파일을 hello.js로 src디렉토리에 저장합니다.
그 후 SpecRunner.html 파일의 <head>에 아래의 내용을 포함시킵니다. 내용을 추가시 스펙과 소스의 순서는 상관이 없습니다.
SpecRunner.html 파일은 Jasmine browser spec runner로써, 소스파일과 테스트파일 자스민 코드를 참조시키는 간단한 HTML 파일입니다.

 {% highlight html %}
    <script type="text/javascript" src="src/hello.js"></script>
 {% endhighlight %}

### 명세선언
이제 자스민으로 테스트하기 위해 spec 폴더 밑에 hello.spec.js라는 파일을 만들어 아래의 코드를 작성해 봅니다.
자스민은 실제 비지니스의 실무를 반영시키는 굉장히 표현적인 언어로써 작성을 도와줍니다.

{% highlight javascript %}
  describe("Hello World", function(){
    it("says hello", function() {
      expect(helloWorld()).toEqual("Hello world!");
    });
  });
{% endhighlight %}

위 코드는 Suite라고 합니다. 위 코드에서 Suite의 이름은 Hello world이고, 보통 어플리케이션의 컴포넌트로 선언합니다 물론 클래스일수도 있고 함수일수도 있고 다른 것이 될 수 도 있습니다.
여기서 "Hello World"는 영어 문자열이지, 개발언어가 아닙니다. Suite 안에, 익명함수(it()블록) 부분을 명세(specification) 또는 짧게 스펙(Spec)이라고 합니다.
위 Suite를 가지고 테스트를 했을 때, 정말로 "Hello World!"가 리턴됐다면, 이 체크는 Matcher라고 부릅니다 자스민은 사전선언된 다수의 매쳐들을 포함하고 있고 직접 작성을 할 수도 있습니다.
자스민은 영어같이 읽히기를 겨냥했기에, 보는 순간 쉽게 내용을 이해할 수 있습니다.
이제 작성이 끝났으니, SpecRunner.html 파일의 <head>에 아래의 내용을 포함시킵니다. 내용을 추가시 스펙과 소스의 순서는 상관이 없습니다

{% highlight html %}
  <script type="text/javascript" src="spec/hello.spec.js"></script>
{% endhighlight %}

테스트 진행결과는 아래와 같습니다.
![테스트이미지](imgs/jasmine_result.png)

### Matchers
앞의 테스트에서, 우리는 helloWorld()가 정말 "Hello world!"와 같은지 테스트 해보았습니다. 우리는 toEqual()을 사용하였는데 이것이 바로 Matcher입니다 이것은 기본적으로 expect function()의 인자가 되며, 기준을 만족하는지를 체크하게 됩니다.
만약 우리가 이전 테스트에서 기준을 바꾸고 싶다면, Matcher의 변경으로 우리는 같은 결과를 얻어낼 수 있습니다.
예를들어 테스트의 기준이 world를 포함하는걸로 바꼈다면 오리는 toEqual이 아닌 toContain이라는 Matcher를 아래와 같이 사용할 것입니다.

{% highlight javascript %}
  describe("Hello World", function(){
    it("says world", function() {
      expect(helloWorld()).toContain("world");
    });
  });
{% endhighlight %}


본 Get Started는 Evan Hahn의 JavaScript Testing with Jasmine에 나온 일부 내용을 발췌, 응용하였습니다.

