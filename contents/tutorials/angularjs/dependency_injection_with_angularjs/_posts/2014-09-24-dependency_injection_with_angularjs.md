---
layout : tutorials
title : 서비스 개발을 위한 의존관계 주입 알아보기
category : tutorials
subcategory : angularjs
summary : 서비스 개발을 위한 의존관계 주입 알아보기
permalink : /tutorials/angularjs/dependency_injection_with_angularjs
title_background_color : DD1B16
title_color : FFFFFF
tags : javascript framework angularjs tutorials
author : jeadoko
---

## 서비스?

AngularJS에서 서비스는 웹 서비스나 RESTful 서비스 등을 말하 는 것이 아니고 단순히 생각하면 $provide를 이용해 만들어지는 객체이다. AngularJS의 서비스들은 다양한 특징을 가지고 있는데 다음은 AngularJS 서비스에 대한 특징을 설명한다.

1. 의존관계 주입을 통해 런타임<sup>runtime</sup>시 다른 컴포넌트와 의존관계에 있을 때 주입된다.
2. 싱글톤으로 단일 인스턴를 가진다.
3. 하나의 로직에 대한 단일한 책임을 가지고 어플리케이션에서 공통으로 사용될 수 있다. 가령 Ajax 처리에 대한 책임만을 가지고 여러 컴포넌트에서 사용되는 $http서비스가 그러하다.
4. 여러 컴포넌트들의 다리역할을 한다. 서비스는 컨트롤러, 지시자, 필터, 그리고 다른 서비스에 주입되므로 다른 컴포넌트 간에 느슨하게 연결<sup>loosely coupled</sup>하며 서 로 커뮤니케이션을 하게 하는 매개체 역할을 하게 된다.

AngularJS는 다양한 미리 만들어진 서비스를 제공한다. 가령 Ajax를 위한 $http 서비스, 로깅처리를 위한 $log 서비스들이 그러하다. 그리고 또한 우리가 원하는 기능에 대한 서비스를 만들 수 있다. 서비스를 애기하기 전에 우리는 이번 튜토리얼에서 의존관계 주입에 대하여 먼저 살펴보도록 하겠다.

## 의존관계 주입

하나의 객체가 다른 객체를 사용하는 순간 의존관계가 성립된다. 그러므로 어느 애플리케이 션이든 여러 객체 사이에 의존관계가 필연적으로 성립될 수밖에 없다. AngularJS 개발자 문서에서는 자바스크립트 상에서 객체들 사이의 의존관계가 크게 세 가지 경우에 생성된다고 한다

1. new키워드를통한의존관계성립
2. 전역변수 참조를 통한 의존관계 성립
3. 인자를 통하여 참조를 전달받아 의존관계 성립

처음 1번과 2번은 의존관계가 강하게 연결됐다고 하고 3번은 느슨하게 연결됐다고 한다. 왜 그 런지 코드를 통해 살펴보자. 다음은 new 키워드로 만들어진 의존관계를 보여주는 예제 코드다.

{% highlight javascript %}
function demoCtrl(){
    var bookmark = new UserResource(new Ajax(), new JsonParser());
}
{% endhighlight %}

위 데모 컨트롤러 함수는 UserResource 생성자 함수가 bookmark 객체를 어떻게 생성해야 하는지 **너무 잘 알고** 있다. 다시말하면 데모 컨트롤러가 UserResource 객체를 생성하기 위해 Ajax 객체와 JsonParser 객체가 인자로 필요하다는 것까지 알고 있는 것이다.

데모 컨트롤러가 UserRsource 객체 생성에 대한 책임을 가지면 어떤 문제가 있을까? 가령 UserResource가 Ajax 요청을 사용하지 않고 쿠키나 로컬DB에서 데이터를 가지고와야 하거나 JSON 형식의 데이터가 아니라 XML 형식으로 바뀐다면 UserResource 생성자 함수를 사용하는 모든 컨트롤러 소스를 다 수정해야 할 것이다. 

그럼 UserResource가 어떻게 객체를 생성 하는지 알지 못하도록 팩토리 함수를 전역변수로 만들어 이러한 문제점을 없애보자.

{% highlight javascript %}
var factory = {
    getBookmarkResource: function(){ return new BookmarkResource(factory.getAjax(), factory.getJsonParser(); },
    getAjax : function(){ return new Ajax(); },
    getJsonParser : function(){ return new JsonParser(); }
}
function demoCtrl(){
    var bookmarkResource = factory.getBookmarkResource();
}
{% endhighlight %}

위 코드와 같이 팩토리를 이용해 bookmarkResource 객체를 얻게 되면 데모 컨트롤러는 BookmarkResource가 어떻게 생성되는지 몰라도 된다. 이는 나중에 Ajax를 사용하지 않거나 JSON 형식이 아닌 XML 형식으로 데이터 형식이 바뀌게 되어도 모든 컨트롤러 함수를 수정 할 필요없이 팩토리 객체만 수정하면 된다. 앞의 new 키워드를 통한 예제에서 발생한 문제점인 데모 컨트롤러가 어떻게 BookmarkResource를 생성하는지 알고 있는 문제는 해결했지만 아직 다른 문제점이 있다. 바로 테스트 하기 어렵다는 문제점이다. 

데모 컨트롤러의 단위 테스트를 하기 위해 전역 객체인 팩토리 객체를 테스트용으로 변경하여 사용할 수 있지만 단위 테스트마다 팩토리 객체에 대한 상태를 초기화해야 하고 본질적인 테스트의 어려움은 없애기 어렵다. 그리고 아직 전역 객체와의 강한 결합은 존재 한다. 그럼 마지막으로 인자를 참조하여 만들어진 의존관계를 살펴보자.

{% highlight javascript %}
function demoCtrl(BookmarkResource){
    var bookmarkResource = BookmarkResource.get();
}
{% endhighlight %}

위 코드는 데모 컨트롤러가 BookmarkResource를 인자로 전달받아 의존관계가 성립 된 것을 볼 수 있다. 이렇게 인자를 통하여 BookmarkResource를 데모 컨트롤러가 주입을 받아 의존관계 주입이 되는 것이다. 의존관계 주입(DI)을 통하여 데모 컨트롤러와 BookmarkResource는 약한 결합을 갖게 됐다. 데모 컨트롤러는 bookmarkResource 객체가 어떻게 생성되는지 알 필요도 없고 demoCtrl 단위 테스트에서도 얼마든지 필요한 가짜<sup>mock</sup> BookmarkResource를 주입받을 수있다. 이는 단위 테스트를 매우 쉽게 해준다. 이 처럼 AngularJS에서는 주입되는 대상을 서비스라 하여 BookmarkResource를 서비스로서 개발하고 이를 컨트롤러나 다른 서비스 혹은 지시자 등에 주입되는 방식인 DI를 이용해 컴포넌 트별 의존관계를 정의할 수 있다.

## 서비스 만들기
우리는 앞에서 의존관계 주입이 주는 이점을 살펴봤다. 그럼 이제 DI의 단위가 되는  AngularJS의 서비스를 정의하는 방법을 간단한 예제를 통해 알아보자. 서비스를 만들려면 모듈 인스턴스가 필요하다. angular.module함수를 이용해 모듈을 만들면 모듈 인스턴스를 얻을 수 있다. 이 모듈 인스턴스는 서비스를 만들 수 있는 다양한 메서드를 제공한다. 그럼 간단하게 주어진 이름에 인사 하는 AngularJS Hello 서비스를 만들어 보자.

{% highlight javascript %}
angular.module('sampleApp', [])
    //factory 메소드의 첫번째 인자로 서비스 이름을 주고 다음으로 서비스를 제공하는 팩토리 함수를 정의한다.
    .factory('hello', [function () {
        return {
            say : function (name) {
                return "hello " + name;
            }
        }; 
    }])
    //서비스 이름인 hello를 컨트롤러 함수 인자로 주면 위 hello 팩토리 함수가 반환하는 객체가 주입된다.
    controller('mainCtrl', function ($scope, hello) { 
        $scope.greeting = hello.say("제이");
     });
{% endhighlight %}

위 코드에서 보는 것과 같이 모듈 인스턴스의 factory() 메서드를 이용하면 특정 서비스 객체를 반환하는 팩토리 함수를 정의할 수 있다. 아래 그림은 AngularJS 내부적으로 어떻게 서비스 객체가 만들어지고 다른 컴포넌트에 주입이 되는지 설명하는 그림이다.

{% bimg imgs/di_tutorial_01.png 600x300 %}
AngularJS 서비스 인스턴스 주입절차{% endbimg %}

위 그림을 보면 $provide.factory(...)를 볼 수 있다. 사실 모듈 API의 factory 함수는 $provide.factory 함수의 레퍼런스에 불과 하다. 편의성을 위해 모듈 인스턴스의 factory 메소드를 통해 $provide.factory 메소드를 호출한다. 이렇게 등록된 서비스 팩토리 함수는 나중에 $injector가 서비스 객체를 생성할 때 호출된다. 위 그림에서 보는 바와 같이 AngularJS 내부에서 등록된 컨트롤러를 호출할때 $injector.invoke 메소드를 사용하는데 이때 컨트롤러가 주입받고자 하는 인자의 이름을 $injector.get("인자 이름")으로 가지고와 해당 인자이름에 해당하는 팩토리 함수를 실행시켜 객체를 반환받아 그 객체를 invoke하는 함수의 인자로 전달한다.

## $provie와 $injector

$provide는 factory외에 서비스를 정의할 수 있는 4개의 메서드를 더 제공한다. 아래는 서비스를 정의하는 $provide 메서드 목록이다.

1. $provide.value('이름', 값)
2. $provide.factory('이름', 펙토리 함수)
3. $provide.service('이름', 생성자 함수)
4. $provide.provider('이름', 프로바이더 함수)
5. $provide.constant('이름', 값)

사실 constant 메소드를 제외한 value, factory, service 메소드는 provider 메소드의 레퍼함수이다. 즉, 내부에서 $provide.provider를 호출한다. 우선 $provide.provider 메소드를 사용하여 간단한 서비스를 등록하여 보자.

{% highlight javascript %}
angular.module('sampleApp', [])
    .provider('hello', [function () {
        var defaultGreeting = "hello";
        //Module.config에서 전달받은 helloProvider를 통하여 사용할 수 있다.
        this.setGreeting = function(newGreeting){
            defaultGreeting = newGreeting;
        };
        //프로바이더 함수는 $get 메소드를 구현해야한다. 추후에 $injector에 의해 호출된다.
        this.$get = [function(){
            return {
                say : function (name) {
                    return defaultGreeting + " " + name;
                }
            }
        }];
    }])
    //서비스 이름인 hello를 컨트롤러 함수 인자로 주면 위 $injector가 호출한 this.$get에 연결된 함수의 반환값이 인자로 주어진다.
    controller('mainCtrl', function ($scope, hello) { 
        $scope.greeting = hello.say("제이");
     });
{% endhighlight %}

위의 코드에서는 hello 서비스를 정의하는 helloProvider함수를 provide 메소드를 이용하여 정의하였다. 이렇게 정의된 helloProvider는 모듈의 config 메소드를 이용하여 전달받을 수 있고 프로바이더의 메소드를 통하여 서비스에 대한 설정을 할 수 있다. 위에서는 기본 환영문구를 설정할 수 있도록 setGreeting 메소드를 만들었다. 그럼 factory와 service의 차이점을 보기위해 어떻게 provider 사용하는지 AngularJS 내부 소스를 살펴보자.

{% highlight javascript %}
function factory(name, factoryFn) { 
    return provider(name, { $get: factoryFn }); 
}

function service(name, constructor) {
    return factory(name, ['$injector', function($injector) {
        return $injector.instantiate(constructor);
    }]);
}

function value(name, val) { 
    return factory(name, valueFn(val)); 
}
{% endhighlight %}

위 코드를 보면 factory는 전달받은 팩토리 함수를 $get에 바로 전달한다. 즉 팩토리 함수가 반환한 값이 서비스 객체가 된다. service를 보면 결국 factory를 호출하는데 그 내부에서 전달받은 생성자 함수를 객체화하여 그 결과를 반환한다. $injector.instantiate 메소드를 사용하면 생성자 함수의 인자를 DI로 전달할 수 있다. 즉 생성자 함수의 의존관계를 $provide로 등록된 서비스를 주입하며 생성한다.

## References

- [angularjs official document](https://docs.angularjs.org/)
- [시작하세요 angularjs 프로그래밍](http://wikibook.co.kr/beginning-angularjs/)
