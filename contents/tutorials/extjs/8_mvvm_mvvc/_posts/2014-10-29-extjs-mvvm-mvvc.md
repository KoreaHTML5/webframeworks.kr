---
layout : tutorials
title :  데이터 바인딩과 MVVM, MVVC 알아보기 
category : tutorials
subcategory : data-binding
summary : Ext JS5에서 새롭게 선보인 데이터 바인딩과 ModelView, ModelController에 대해 알아보자.
permalink : /tutorials/extjs/8_mvvm_mvvc
title_background_color : RGB(8, 78, 119)
tags : javascript framework Ext JS tutorial
author : benneykwag
---
#데이터 바인딩과 MVVM, MVVC 알아보기

버전 4에 이르러 MVC 패턴을 지원하기 시작했다. MVC 목적은 논리적인 체계에 따라 애플리케이션을 분리하는데 초점을 맞춘다. 각 분리된 애플리케이션은 목적에 따라 자신의 역할을 충실히 수행하게 된다. MVC 패턴과 같은 패턴을 모든 개발자가 배우고 사용하게 함으로서 코드 일관성을 유지할 수 있고, 유지 보수를 용이하게 하며, 이렇게 정리되고 분리된 코드는 더 크고 복잡한 애플리케이션을 만들 수 있는 기반을 제공한다.

* (M) 모델 : 모델은 데이터를 의미한다. 데이터는 데이터베이스 테이블과 매칭해 설명하곤 한다. 데이터베이스 테이블은 필드와 필드 타입을 정의하고 이러한 틀에 데이터를 보관하게 된다. 모델은 이러한 틀에서 표현할 수 있는 한 건의 데이터 또는 데이터를 담을 수 있는 공간을 의미한다. 이러한 모델데이터는 스토어를 이용해 반복적으로 저장되며. 그리드와 같은 반복된 데이터를 표시하는 뷰 클래스가 스토어를 참조한다.

* (V) 뷰 : 뷰는 시각적으로 표시되는 모든 컴포넌트며 로직을 포함하지 않는 클래스다.

* (C) 컨트롤러 : 컨트롤러는 뷰를 관리하는 클래스다. 이 클래스는 뷰에서 발생하는 모든 것을 감시하고 명령한다. ExtJS 4에서는 컨트롤러 역할이 전역적이였다. 즉 하나의 컨트롤러가 여러 개 뷰에서 발생하는 이벤트와 로직을 관리한다는 의미다. ExtJS 5에서는 뷰 컨트롤러(ViewController)를 이용해 뷰와 일대일로 매핑시켜 재활용과 컨트롤러를 재활용하고 난해한 사용을 방지할 수 있게 했다.

* (VM) 뷰모델 : 뷰모델은 뷰가 사용할 데이터를 관리하는 클래스다. 뷰와 뷰모델은 서로 호환되며 한쪽을 수정되면 다른 한쪽에 수정된 내용이 반영되는 양방향 데이터 바인딩이 가능하다.

##데이터 바인딩

컴포넌트에 추가된 bind 설정은 컴포넌트에 직접 데이터를 설정하게 한다. 이런 데이터설정은 데이터 변경에 즉각적으로 뷰가 반응하고 업데이트 하게 된다. 반대로 양방향 데이터 바인딩도 허용한다. 데이터가 변경되는 것과 반대로 뷰에서 데이터를 변경하면 데이터를 지닌 모델에게도 파생돼 원천 데이터가 변하게 된다.

다음 예제 코드는 Main 클래스 자식인 panel의 title을 설정하는 코드다. 뷰모델은 데이터 객체를 관리하는 클래스로 뷰에 종속적으로 데이터를 제공한다. 이때 데이터를 설정하기 위해 bind 설정이 이용된다.
{%highlight html%}
<!DOCTYPE HTML>
<html>
<head>
    <meta charset="UTF-8">
    <title>Table Layout</title>
    <link rel="stylesheet" type="text/css"
          href="/ext/packages/ext-theme-gray/build/resources/ext-theme-gray-all-debug.css">
    <script type="text/javascript" src="/ext/ext-all-debug.js"></script>
</head>
<body>
<script type="text/javascript">
    Ext.Loader.setConfig({
        enabled: true,
        paths: {
            'ext5': '/app'
        }
    });
    Ext.require([
        'ext5.view.chapter8.DataBind'
    ]);

    Ext.onReady(function () {
        var fp = Ext.create('ext5.view.chapter8.DataBind', {
            renderTo: document.body
        });
    });
</script>
</body>
</html>
{% endhighlight %}

클래스를 작성하자.
{%highlight html%}
Ext.define('ext5.view.chapter8.DataBind', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.chapter8-databind',
    width: 500,
    bodyPadding: 10,
    viewModel: { // #1
        data: { // #2
            title: 'Hello World',
            html: 'The html content',
            buttonText: 'A button'
        }
    },
    bind: { // #3
        title: '{title}',
        html: '{html}'
    },
    tbar: [{ // #4
        bind: '{buttonText}'
    }]
});
{% endhighlight %}
1. 뷰모델을 설정한다. 내부 코드는 bind에 제공할 데이터를 정의한다.
2. 데이터를 정의한다.
3. 이 클래스 Config인 title, html에 bind 설정으로 데이터를 설정하자.
4. tbar 내부에 버튼을 추가하는 코드다. tbar의 자식은 xtype을 설정하지 않으면 기본 버튼이 추가된다. bind:’{buttonText}’은 text: ‘A button’과 같다.

![](imgs/img01.png)<br>
**그림 1 뷰클래스에 뷰모델을 설정하고 클래스 내부 Config를 변경하였다.** 

뷰클래스 viewModel Cofig를 독립적인 클래스로 바꿔보자. 뷰클래스를 다음과 같이 수정하고 DataBindModel 클래스를 생성하고 구현한다.
{%highlight javascript%}
Ext.define('ext5.view.chapter8.DataBind', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.chapter8-databind',
    requires: ['ext5.view.chapter8.DataBindModel'],
    width: 500,
    bodyPadding: 10,
    viewModel : 'chapter8-databind',
    bind: {
        …
    },
    …
});
{% endhighlight %}

##뷰모델

뷰모델 클래스는 데이터 객체를 관리하는 클래스로 뷰에 종속적으로 데이터를 제공한다..
{%highlight javascript%}
Ext.define('ext5.view.chapter8.DataBindModel', {
    extend: 'Ext.app.ViewModel', // #1
    alias: 'viewmodel.chapter8-databind', // #2
    data: { // #3
        title: 'Hello World',
        html: 'The html content',
        buttonText: 'A button'
    }
});
{% endhighlight %}

1. ‘Ext.app.ViewModel’ 클래스를 확장한다.
2. 뷰클래스에서 참조할 수 있게 이름을 지정한다.
3. data config 내부에는 뷰에 설정할 config를 나열하고 데이터를 설정한다.

##뷰 컨트롤러

컨트롤러를 살펴보자. ExtJS 4 컨트롤러는 일대일 또는 일대다 관계로 사용했다. 이런 관계는 애플리케이션 크기가 커짐과 동시 서로 연관성이 증가하고 유지보수에 어려움을 낳을 수 단점이 있다. Ext JS5 뷰 컨트롤러는 뷰 클래스와 일대일 관계를 유지하고 생성

과 소멸을 같이 하게 돼 더 단순하고 코드가 서로 엉퀴지 않으므로 유지하기 쉽다는 장점을 가진다.

뷰 컨트롤러와 뷰는 리스너(listeners)와 레퍼런스(references)로 묶인다. 다시 뷰 클래스를 보자.

다음 코드에서 tbar 내부 버튼을 클릭하면 핸들러가 ‘onClickButton’를 실행한다. Ext JS 4는 정해진 메서드를 직접 호출하고 스코프를 설정해 번거롭지만 이 코드에서는 문자열로 간단히 표시한다. 이러한 형태 호출은 ‘onClickButton’이 구현되지 않아도 에러를 보이지 않는다. 이 문자열은 뷰 컨트롤러 onClickButton 메서드로 뷰가 사용할 컨트롤러는 뷰 내부에 controller: ‘main’ 코드로 설정된다.
{%highlight javascript%}
Ext.define('ext5.view.chapter8.DataBind', {
    extend: 'Ext.panel.Panel',
    …
    requires: [
        'ext5.view.chapter8.DataBindModel',
        'ext5.view.chapter8.DataBindController'
    ],
    viewModel: 'chapter8-databind',
    controller: 'chapter8-databind',
    bind: {
        …
    },
    tbar: [
        {
            bind: '{buttonText}',
            handler: 'onClickButton'
        }
    ]
});
{% endhighlight %}

뷰컨트롤러 클래스를 생성하자. 뷰에서 호출한 onClickButton 메서드를 구현한다..
{%highlight javascript%}
Ext.define('ext5.view.chapter8.DataBindController', {
    extend: 'Ext.app.ViewController',
    requires: [
        'Ext.MessageBox'
    ],
    alias: 'controller.chapter8-databind',
    onClickButton: function () { // #1
        Ext.Msg.confirm('Confirm', 'Are you sure?', 'onConfirm', this); // #2
    },
    onConfirm: function (choice) { // #3
        if (choice === 'yes') {
        }
    }
});
{% endhighlight %}

1. 뷰클래스 내부 리스너에서 호출한 메서드다.
2. ‘onConfirm’ 문자열은 (#3)을 의미하며 컨트롤러 내부에서 문자열로 메서드를 호출할 수 있다.
반대로 뷰 컨트롤러 내부에서 뷰 클래스 또는 뷰 클래스 내부 객체에 접근하려면 레퍼런스(reference)를 사용한다. 뷰 클래스 items에 자식 객체를 추가하고 레퍼런스를 설정하자.
{%highlight javascript%}
Ext.define('ext5.view.chapter8.DataBind', {
    …
    items: [{
        padding : '5 5 5 5',
        xtype : 'panel', // #1
        height: 50,
        reference : 'datapanel', // #2
        bind: {
            title : '{name}' // #3
        }
    }],
    …
});
{% endhighlight %}

1. 자식 객체로 panel을 추가한다.
2. 레퍼런스는 datapanel로 설정한다.
3. Panel 객체 제목을 설정할 수 있게 bind 설정을 준비한다.

뷰 컨트롤러 내부에서 뷰 클래스를 참조하는 코드는 다음과 같다.
{%highlight javascript%}
Ext.define('ext5.view.chapter8.DataBindController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.chapter8-databind',
    ….

    onConfirm: function (choice) {
        if (choice === 'yes') {
            var mypanel = this.getView().down(‘panel’); // #1
            var mypanel = this.lookupReference('datapanel'); // #2
            var mypanel = this.getReferences().datapanel; // #3
            mypanel.setTitle('레퍼런스를 통해 접근'); // #4
            this.getViewModel().set('name', '안녕하세요 ^^'); // #5
        }
    }
});
{% endhighlight %}

1. 컨트롤러 내부에서 this.getView()는 이 컨트롤러를 사용하는 뷰 클래스를 의미한다.
2. 이전 코드 reference 설정 중 ‘'datapanel'에 해당하는 객체다.
3. #2와 같은 결과를 얻는다.
4. setTitle() 메서드로 panel의 title 설정을 변경한다.
5. 뷰 클래스에 bind 설정을 미리 준비했다. 뷰 모델을 통해 데이터를 변경하면 bind로datapanel의 title이 변경된다.
