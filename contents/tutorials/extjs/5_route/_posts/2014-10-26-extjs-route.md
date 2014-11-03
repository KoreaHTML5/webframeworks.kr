---
layout : tutorials
title :  ExtJS Route를 활용하기
category : tutorials
subcategory : pageloading
summary : 브라우저의 해시정보를 활용해 ExtJS는 라우터를 지원하게 한다. 이 라우터를 활용하는 방법에 대해 알아본다.  
permalink : /tutorials/extjs/5_route
title_background_color : RGB(8, 78, 119)
tags : javascript framework Ext JS tutorial
author : benneykwag
---
웹 페이지는 사용자가 클릭한 링크를 통해 페이지를 찾고 실행한다. 이는 링크가 하나의 파일로 존재하는 페이지 형태 시스템일 것이다. 이 때 브라우저 “뒤로”가기 버튼이나 “앞으로”가기 버튼을 이용해 컨텐츠의 전후로 이동할 수 있는 장점이 있다. 그러나 Ext JS와 같이 단일 페이지 애플리케이션 형태로 개발될 때 새로운 페이지를 로드하며 실행되지 않으며 브라우저 버튼에 반응하면 전혀 다른 페이지로 이동한다. 이러한 문제를 해결하고 애플리케이션 내부에서 url주소를 해독해 이용하기 위해 라우터를 활용한다.

라우터는 브라우저의 히스토리 스택을 사용해 애플리케이션의 상태를 추적하는 것이 주 목적이다.

##URI 해시란?

브라우저가 인터넷을 탐색하기 위해 사용하는 것이 URI다. http://myurl.com/mypage/admins#userid/0710

URI는 일반적이므로 익숙할 것이다. 마지막 #userid/0710는 해시 또는 조각 식별자라고 부른다. 해시는 서버에 전달되지 않으며 브라우저 스택에 쌓여 클라이언트 측 응용프로그램을 제어하는 데 사용된다. 위 주소는 실행 즉시 서버에 관련 요청이 전달되고 브라우저에는 포함된 해시 정보가 hashchange 이벤트를 발생시킨다. 이렇게 축적된 해시 정보는 뒤로가기 버튼에 이전 URI 정보로 출력된다.

디폴트 해시 설정

애플리케이션이 시작됨과 동시에 URI에 해시 정보를 설정하려면 application.js 파일 내부에 다음과 같이 defaultToken을 설정하거나 init 메서드 내부에 this.setDefaultToken 설정을 추가한다.

{%highlight javascript%}
 Ext.define('ext5.Application', {
    extend: 'Ext.app.Application',  
    …
    defaultToken: 'root',

    init: function () {
    this.setDefaultToken('root');
    }
});
 {% endhighlight %}
위 코드는 브라우저 URI 정보 끝단에 #root를 추가한다.

##라우팅 구현

라우터 클래스는 ExtJS MVC 응용프로그램 내부에서 해시 변화를 추적하고 핸들링할 수 있게 Ext.util.History 클래스를 사용한다. 라우터 설정은 컨트롤러에 포함해야 한다. 뷰 컨트롤러와 컨트롤러 모두 같이 설정할 수 있다. 필요에 따라 뷰 컨트롤러를 사용할지 컨트롤러를 사용할지 결정하기 바란다. 아래 코드는 app폴더에 controller폴더를 생성하고 Route.js파일로 컨트롤러를 구현한 것이다. 라우팅이 대부분 애플리케이션 전체에 영향을 미칠 때를 가정해 구현한다.
{%highlight javascript%}
Ext.define('ext5.controller.Route', {
    extend: 'Ext.app.Controller',
    alias: 'controller.route',
    config: {
        routes : {
            'user' : 'findUser'
        }
    },
    findUser: function() {
        this.redirectTo('user/1234');
        console.log('해시를 인식함..')
    }
});
 {% endhighlight %}

 컨트롤러가 애플리케이션에서 인식되게 Application.js에 등록하는 과정을 잊어선 안된다.
 {%highlight javascript%}
 Ext.define('ext5.Application', {
    extend: 'Ext.app.Application',
    name: 'ext5',
    controllers: [
        'Route'
    ],
    stores: [
    ],
    launch: function () {
    }
});
 {% endhighlight %}
브라우저 주소창에 http://localhost:1841/#user를 입력하고 브라우저를 실행하면 컨트롤러는 이를 인식하고 해시 정보인 user를 해석하게 fundUser findUser메서드에 전달한다. 이때 redirectTo() 메서드를 이용해 해시 정보를 내부에서 변경할 수 있다.
![](imgs/img01.png)<br>
**그림 1 애플리케이션에 해시정보를 설정했다.**

###매개변수 사용

해시 정보는 매개변수 즉 매개변수를 포함할 수 있고 이를 해석할 수 있다. 이때 action과 before 이벤트를 리스닝한다. Route컨트롤러를 다시 수정하자.
{%highlight javascript%}
routes : {
    'user' : 'findUser',
    'param/:id': { // #1
        before : 'beforeHandleRoute' , // #2
        action: 'handleRoute' // #3
    }
},
beforeHandleRoute: function(id, action) { // #4
    console.log('routing start',id);
    if(id == 100){ // #5
        console.log('routing stop');
        action.stop(); // #6
        return false; // #7
    }
    console.log('routing continue')
    action.resume(); // #8
},
handleRoute: function(id) { // #9
    console.log('routing finish', id);
},
 {% endhighlight %}

1. URI 형식은 http://localhost:1841/#param/100이다. 매개변수는 param이고 이 변수에 할당되는 값은 100이다.
2. 해시 정보를 변경하기 전에 before 이벤트가 발생한다. beforeHandleRoute 메서드를 호출한다.
3. Action 이벤트는 해시를 변경한 이후에 실행된다.
4. 해시 정보를 변경할 것인지 판단할 수 있다. (#5) 매개변수로 입력된 값이 100이면 (#6) action.stop()을 호출해 변경을 취소한다. (#7) false를 반환해 이후 코드 실행을 막는다.
8. 매개변수 값이 해시 정보를 변경한다. 이때 action.resume()를 호출하며 action은 꼭 stop()이나 resume() 메서드가 실행돼야 한다.
9. 해시 정보가 수정된 후에 실행되는 메서드다. 로직이 필요하면 여기 구현하면 된다.
![](imgs/img02.png)<br>
**그림 2 해시에 매개변수를 사용할 수 있게 설정한다.**

###매개변수 형식 지정

매개변수는 conditions를 통해 원하는 형식을 지정할 수 있다. 기존 라우터 코드에 conditions를 추가하자. 코드는 입력되는 매개변수 값을 숫자로 제한하므로 숫자 이외에는 작동하지 않는다.
{%highlight javascript%}
routes : {
    'param' : 'findUser',
    'param/:id': {
        action: 'handleRoute',
        before: 'beforeHandleRoute',
        conditions: {
            ':id':'([0-9]+)'
        }
    }
},
 {% endhighlight %}
매개변수 형식이 맞지 않거나 routes 내부에 설정되지 않은 종류에 해시 정보가 입력되면 unmatchedroute 이벤트가 발생한다. app.js 내부에서 이 이벤트 리스너를 구현할 수 있다.
{%highlight javascript%}
Ext.application({
    name: 'ext5',
    extend: 'ext5.Application',
    autoCreateViewport: 'ext5.view.main.Main',
    listen : {
        controller : {
            '#' : {
                unmatchedroute : 'onUnmatchedRoute'
            }
        }
    },
    onUnmatchedRoute : function(hash) {
        console.log('unmatchedroute ...')
    }
});
{% endhighlight %}
![](imgs/img03.png)<br>
**그림 3 해시에 매개변수 형식을 지정해 필터링 할 수 있다.**