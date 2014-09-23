---
layout : tutorials
title : ExtJS5 Class System
category : tutorials
summary : ExtJS는 300여개 이상의 클래스와 이를 기반으로 하는 아키텍쳐를 가졌다. 객체지향 언어를 표방해 상속, 다중 상속, 이벤트를 통한 접근 등 고급 언어에서 볼 수 있는 거의 모든 개념을 탑재해 다양하고 복잡한 애플리케이션을 구현할 수 있다.
permalink : /tutorials/extjs/1_class_system
title_background_color : RGB(8, 78, 119)
tags : javascript framework Ext JS tutorial
author : benneykwag
---

#클래스 시스템
ExtJS는 300여개 이상의 클래스와 이를 기반으로 하는 아키텍쳐를 가졌다. 객체지향 언어를 표방해 상속, 다중 상속, 이벤트를 통한 접근 등 고급 언어에서 볼 수 있는 거의 모든 개념을 탑재해 다양하고 복잡한 애플리케이션을 구현할 수 있다.

자바스크립트는 유연한 언어다. 그러나 이러한 유연함이 많은 코딩 스타일과 기법 등을 낳게 됐고 코드를 예측하거나 유지하는 데 많은 비용을 지불하게 됐다. ExtJS 클래스 시스템은 캡슐화를 지원하고, 표준코딩 컨벤션을 사용 할 수 있어 작성된 코드의 예측과 확장이 용이하다.
ExtJs 클래스 시스템을 통해 시간이 지날수록 애플리케이션의 가치는 증가하고 안정적인 유지보수가 가능해 진다.

##클래스 선언과 생성
클래스는 Ext JS 컴포넌트의 최소 단위로 이 클래스를 만드는 방법과 만들어진 클래스를 실행하는 방법에 대해 알아야한다.

[Getting Start]({{site.baseurl}})에서 간단한 Panel클래스를 상속하여 정의했고 정의된 클래스를 HTML파일에서 호출(인스턴스)해 브라우저에 의도한 UI가 보이도록 했다.
Ext JS는 UI프레임웍으로 대부분의 클래스가 정해진 형태를 가지며 이러한 특징적인 형태는 Api에 잘 정리되어 있을 것이다. 우리가 할일은 구현하길 원하는 형태의 클래스가 존재하고 원하는 기능에 얼마나 유사한지 판단하는 것이다.

아래 코드는 전형적인 클래스의 선언방법을 보여주고 있다. 코드는 클래스를 선언하기 위해 Api의 ‘Ext.panel.Panel’클래스를 확장하였다. Panel클래스의 전형적인 모습이 우리가 구현할 클래스 모습 또는 기능이 적합하다는 사전 판단이 있어야 할 것이다.


html : /examples/chapter2/2_DefineClass.html
{% highlight html linos %}
<!DOCTYPE HTML>
<html>
<head>
    <meta charset="UTF-8">
    <title>2_DefineClass.html</title>
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
        'ext5.view.chapter2.DefineClass'
    ]);

    Ext.onReady(function () {
        Ext.create('ext5.view.chapter2.DefineClass', {
            renderTo: document.body,
            width: '100%',
            height: 150,
            bodyPadding: 5
        });
    })

</script>
</body>
</html>
{% endhighlight %}

javascript : /app/view/chapter2/DefineClass.js
{% highlight javascript linos %}
Ext.define('ext5.view.chapter2.DefineClass', { // #1
    extend: 'Ext.panel.Panel', // #2
    alias : 'widget.chapter2-defineclass',// #3
    initComponent: function () { // #4
        var me = this;
        Ext.apply(me, {   // #5
            title: '안녕하세요 환영합니다.^^',
            items: [  // #8
                {
                    xtype: 'button',
                    text: 'Click Me!'
                }
            ]
        });
        me.callParent(arguments); // #6
        me.on('render', function(component){    // #7
             console.log(‘클래스가 브라우저에 렌더링될 때 실행되요.’);
        });
    }
});
{% endhighlight %}

- #1. Ext.define 함수를 이용해 클래스를 정의했다. 클래스명은 문자와 숫자가 포함될 수 있고 밑줄은 권장 않는다. 패키지는 콤마(.)으로 구분하며 아래 예시처럼 최상위 이름과 최종 이름은 카멜 표기법을 사용한다. 그외 소문자 표현을 권장한다.
예) MyClass.form.action.AutoLoad
- #2. 확장하려는 클래스를 명시한다. Api에서 제공하는 수많은 클래스 중 하나를 선택 적절히 수정해 원하는 기능을 구현한다.
- #3. 클래스의 함축적인 약칭이며 위젯명이라 불린다. 이와 동일하게 쓸수 있는 표현은 xtype으로 아래 예에서 보듯 xtype으로 사용할 경우 ‘widget’ prefix를 제거한 상태로 사용한다.
예) alias : ‘widgt.chapter2-defineclass’  >> xtype : ‘chapter2-defineclass’
- #4. 확장할 클래스 기능을 재정의 할 때 initComponent 메소드를 사용한다. 이는 확장한 부모클래스의 구성요소를 초기화하고 사용자가 정의한 클래스에 원하는 로직이 작동될 수 있게 한다.
이 메서드는 (#6)me.callParent(arguments)를 꼭 필요로 하며 없을 경우 클래스가 작동하지 않을 것이다.
- #5. Ext.apply 메서드는 set메서드에 의해 특정 오브젝트에 속성을 추가하는 메소드다. 첫번째 인자는 추가할 대상 오브젝트이고 두번째 인자는 추가할 속성의 오브젝트이다.
코드에서 Ext.apply의 첫번째 인자는 this를 참조하는 me변수 이다. 이 me변수는 this를 참조하고 있고 this는 Ext.panel.Panel클래스를 확장한 DefineClass클래스 자신을 의미한다. 즉 DefineClass클래스에 두번째 인자인 title, items등의 구성요소를 DefineClass의 것으로 만들겠다는 의미이다.
이러한 코드는 일반적으로 클래스를 정의하고 변경하는 방법이며 아래 예도 동일한결과를 보인다.
{% highlight javascript linos %}
this.title = “안녕하세요 환영합니다.”;
this.items = [
    {
        xtype: 'button',
        text: 'Click Me!'
    }
];
{% endhighlight %}
- #7. on구문은 이벤트리스너를 정의하는 함축적인 사용법이다. me.on이라면 DefineClass에 이벤트리스너를 추가한다는 의미로 me.on이후에는 이벤트의 이름과 발생 후 어떤 일을 할 것인지 정의하는 function구문이 필요하게 된다.<br>
    me : 이벤트리스너가 감시할 대상<br>
on : on구문 앞쪽에 위치한 대상에 이벤트 리스너를 추가한다.<br>
render : 해당 클래스가 렌더링시 발생하는 이벤트이다.<br>
function : render이벤트가 발생되면 즉각 호출되어 구현된 내부 내용을 실행할 것이다.<br>
- #8. items는 Container클래스에 자식을 추가하는 구성요소로 Api 중 Ext.container.Container클래스를 확장한 클래스들만 존재한다. Container 클래스는 내부에 자식을 추가하고 배치하는(레이아웃) 기능을 가지며 Ext.panel.Panel클래스 또한 Container클래스를 확장하여 만들어진 코어 클래스이다.

클래스를 정의 했다면 정의된 클래스를 인스턴스화 하는 방법 즉 실행방법에 대해 알아보자.

2_DefineClass.html파일 내부에서 확인되듯이 Ext.create메소드를 통해 정의된 클래스를 인스턴스화 할 수 있다.
{% highlight javascript linos %}
Ext.create('ext5.view.chapter2.DefineClass', {
    renderTo: document.body,
    width: '100%',
    height: 150,
    bodyPadding: 5
});
{% endhighlight %}

UI클래스의 특징상 브라우저에 렌더링 과정에 필요하므로 renderTo구성요소를 정의하게 된다. document.body는 HTML파일 내부 BODY태그로 BODY에 직접 렌더링한다는 의미다. 아래 예처럼 특정 DIV태그에 id를 부여해 해당 UI클래스가 보이도록 할수 있다.
{% highlight html %}
 <div id=”header”></div>
{% endhighlight %}
이 경우 renderTo : ‘header’로 설정하면 될 것이다.

또 다른 방법으로 Ext.widget메소드를 이용할 수 있다. Ext.widget메소드는 클래스가 가진 위젯명으로 인스턴스화 하는 것으로 사용법은 기존 Ext.create를 대체하면 된다.
{% highlight javascript %}
Ext.widget('chapter2-defineclass', {
    renderTo: document.body,
    width: '100%',
    height: 150,
    bodyPadding: 5
});
{% endhighlight %}

![](imgs/img2-01.png)<br>
그림 2-1 클래스 선언과 생성

##Config 구성요소
Ext JS 클래스 시스템은 config(구성요소) 기능을 제공한다. 클래스에 config 옵션을 정의하면 클래스 시스템은 자동으로 3개의 메서드(getter, setter, apply)를 생성한다.
이를 이용해 클래스에 매개변수를 전달해 값을 설정하고 수정할 수 있어 코드 라인이 줄어들고API 사이의 일관성을 유지할 수 있는 장점을 제공한다.
{% highlight javascript %}
Ext.define('ext5.view.chapter2.ClassConfig', {
    extend: 'Ext.panel.Panel',
    xtype: 'chapter2-classconfig',
    title: ‘ClassConfig’,

    config: {   // #1
        subject: '제목을 입력하세요',    // #2

        bottomBar: {    // #3
            height: 50,
            width: 200
        }
    },

    applySubject: function (subject) {  // #4
        if (!Ext.isString(subject) || subject.length === 0) {
            console.log('제목은 반드시 입력해야 합니다.');
        }
        else {
            return subject;
        }
    },

    applyBottomBar: function (bottomBar) {  // #5
        if (bottomBar) {    // #6
            if (!this.bottomBar) {  // #7
                return Ext.create('MyInnerClass', bottomBar);
            }
            else {
                this.bottomBar.setConfig(bottomBar);    // #8
            }
        }
    }
});

// ClassConfig.js 파일내부에 ClassConfig클래스 하단에 같이 기술했다.
Ext.define('MyInnerClass', {    // #9
    config: {
        height: undefined,
        width: 100
    }
});
{% endhighlight %}
- #1. config설정을 통해 사용자 클래스 config를 정의한다.
- #2. subject config를 정의하고 설정한다.
- #3. bottomBar를 정의한다. subject과 달리 Object 형태의 config다.
- #4. subject config를 설정하기 위한  apply 메서드다. 사용자가 세터메서드를 실행하면 자동적으로 호출되는 메서드로 이 메서드가 반환하는 값이 클래스에 최종 설정된다.
- #5. bottomBar를 설정하기 위한 apply 메서드다.
- #6. 인자로 전달되는 bottomBar 변수가 정상일 때 작동한다.
- #7. this.bottomBar가 비어있을 때 작동한다. this.bottomBar는 #1에서 설정한 bottomBar를 의미한다.
- #8. (#7)조건의 반대일 때 실행되며 this.bottomBar에 새롭게 전달받은 인자를 설정하는 코드다.
- #9. config를 가진 클래스로 (#7) 조건일 때 이 클래스가 생성되고 인자로 전달된 bottomBar가 이 클래스에 설정된다.

클래스 정의가 끝났다면 이 클래스를 생성하고 테스트 할 코드를 HTML파일 내부에 기술한다. 샘플용 HTML파일을 카피하여 아래 내용대로 코딩하자. 언급한 내용 이외는 동일하다.

HTML 파일명 : /examples/chapter2/4_ClassConfig.html
{% highlight html %}
<!DOCTYPE HTML>
<html>
<head>
    <meta charset="UTF-8">
    <title>4_ClassConfig</title>
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
        'ext5.view.chapter2.ClassConfig'
    ]);
    Ext.onReady(function () {
        var myWindow = Ext.create('ext5.view.chapter2.ClassConfig', {
            subject: '안녕하세요 ^^',      // #1
            renderTo: document.body,
            bottomBar: {    // #2
                height: 60
            }
        });
        console.log(myWindow.getSubject()); // #3
        myWindow.setSubject('반갑습니다.^^');  // #4
        console.log(myWindow.getSubject()); // #5
        myWindow.setSubject(null); // #6
        myWindow.setBottomBar({ height: 100 }); // #7
        console.log(myWindow.getBottomBar().getHeight()); // #8
    })

</script>
</body>
</html>
{% endhighlight %}

- #1. 클래스를 생성하면서 subject config를 설정한다.
- #2. 클래스를 생성하면서 bottomBar config를 설정하는 코드다. height를 60으로 전달한다.
- #3. 게터를 이용해 subject config를 확인한다. (#1)로 인해 실행 결과는 “안녕하세요”로 출력된다.
- #4. 세터를 이용해 subject config를 다시 설정한다. (#5)에서 다시 확인하면 “반갑습니다^^”가 출력된다.
- #5. 게터를 이용해 (#4)에서 설정한 값을 확인한다.
- #6. 세터를 이용해 subject config를 null로 설정한다. ClassConfig 클래스 내부의 applySubject메서드를 다시 확인하면 null 값이 입력 될 경우 “타이틀은 반드시 입력해야 합니다”라고 출력하게 돼 있다.
- #7. 세터를 이용해 bottomBar config를 설정한다. 이 config는 Object 타입으로 여기에서는 height만 100으로 설정했다.
- #7. (#7)에서 설정된 bottomBar의 height값을 게터를 이용해 확인한다. 당연히 100이 출력된다.

![](imgs/img2-02.png)<br>
**그림 2-2 클래스 구성요소(config)**
[참고] 샘플 실행시 아래와 같은 메시지를 보일 경우 크롬 실행 옵션을 조정할 수 있습니다.

XMLHttpRequest cannot load http://prosperent.com/settings/getinterfacesettings. The 'Access-Control-Allow-Origin' header has a value 'http://localhost' that is not equal to the supplied origin. Origin 'http://localhost:1841' is therefore not allowed access.

크롬이 설치된 위치로 명령프롬프트로 이동한 후 아래 명령을 실행하면 크롬이 실행되며 실행옵션이 설정됩니다.
C:\Program Files (x86)\Google\Chrome\Application>chrome.exe --allow-file-access-
from-files

![](imgs/img2-03.png)<br>
**그림 2-3 크롬 엑세스 오류 발생시 실행옵션 설정하기**
##스태틱
모든 클래스에는 스태틱 변수와 메서드를 정의할 수 있다. static은 인스턴스를 생성하지 않고 접근 할 수 있다. 즉 create로 생성하지 않고 ‘클래스명.변수’ 또는 ‘클래스명.메서드’로 접근한다.

HTML파일 : /examples/chapter2/5_ClassStatic.html
{% highlight html %}
<!DOCTYPE HTML>
<html>
<head>
    <meta charset="UTF-8">
    <title>Class Static</title>
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
        'ext5.view.chapter2.ClassStatic'
    ]);
    Ext.onReady(function () {
        var myWindow = Ext.create('ext5.view.chapter2.ClassStatic', {
            title: '안녕하세요 ^^',
            renderTo: document.body,
            bottomBar: {
                height: 60
            }
        });
        var static1 = ext5.view.chapter2.ClassStatic.student('홍길동');
        var static2 = ext5.view.chapter2.ClassStatic.student('김철수');
        console.log(static2.getStudentName());
        console.log(ext5.view.chapter2.ClassStatic.studentCount);
    })

</script>
</body>
</html>
{% endhighlight %}

{% highlight javascript %}
Ext.define('ext5.view.chapter2.ClassStatic', {
    extend: 'Ext.panel.Panel',
    xtype: 'chapter2-classstatic',
    config : {
        studentName : null
    },
    statics : {
        studentCount : 0,
        student : function(studentName) {
            return new this({	// 강제로 생성자 호출
                studentName : studentName,
                studentCount: this.studentCount++
            });
        }
    }
});
{% endhighlight %}

![](imgs/img2-04.png)<br>
그림 2-4 Static Class의 실행결과

##동적 클래스 로딩과 Alias
동적 클래스 로딩은 빠른 페이지 로딩보다는 유연성이 중요한 개발 환경에서 사용한다. 자바스크립트를 사용하기 위해 HTML 파일 내부에 다음과 같이 자바스크립트 파일을 포함시키는 것이 일반적이다.


{% highlight html %}
<script type="text/javascript" src="../../app/view/chapter2/RequireClass.js"></script>
<script type="text/javascript" src="../../app/view/chapter2/DynamicPanel.js"></script>
{% endhighlight %}

Ext JS는 개발모드가 완료되면 운영단계에서는 모든 클래스 파일을 하나로 모아 압축하고 최적화 하는 과정을 통해 한 개의 파일만 배포하게 된다. 이 경우 압축 및 최적화 과정을 거치며 소스코드는 작은용량과 빠른 실행성능을 보이게 되는 것이다.

이와는 달리 개발환경에서는 발생된 에러의 위치(클래스의 라인)와 에러 종류에 따른 디버깅 메시지가 구체적이여야 하기에 Api의 모든 클래스와 개발자가 작성하는 클래스가 하나의 클래스당 하나의 파일로 존재하고 사람이 읽을 수 있어야한다..

문제는 Ext JS가 방대한 량의 클래스 파일을 가지고 있고 각 클래스가 서로 연결되어 있어 하나의 클래스가 실행되기 위해 미리 로드되야 할 클래스 파일이 수십개에 이를 수 있을 것이다. 이 경우 HTML파일에 조각난 자바스크립트 파일을 순서에 맞추어 로딩시킨다는 것은 불가능할 것이다. 이를 위해 Ext JS는 필요한 클래스를 동적으로 로딩하도록 require 설정을 지원한다.


html : /examples/chapter2/6_DynamicClassLoading.html
{% highlight javascript %}
<!DOCTYPE HTML>
<html>
<head>
    <meta charset="UTF-8">
    <title>Class 동적로</title>
    <link rel="stylesheet" type="text/css"
          href="/ext/packages/ext-theme-gray/build/resources/ext-theme-gray-all-debug.css">
    <script type="text/javascript" src="/ext/ext-all-debug.js"></script>
    <!--<script type="text/javascript" src="../../app/view/chapter1/RequireClass.js"></script>-->
    <!--<script type="text/javascript" src="../../app/view/chapter1/DynamicPanel.js"></script>-->
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
        'ext5.view.chapter2.DynamicPanel'
    ]);
    Ext.onReady(function () {
        Ext.create('ext5.view.chapter2.DynamicPanel', {
            title: '안녕하세요 ^^',
            renderTo: document.body
        });
    })

</script>
</body>
</html>
{% endhighlight %}
javascript
    - /app/view/chapter2/RequireClass.js<br>
    - /app/view/chapter2/ DynamicPanel.js

동적로딩의 대상이 될 클래스 파일을 생성하자. Ext.panel.Panel클래스를 확장하고 html config만 존재하는 단순한 클래스다.
{% highlight javascript %}
Ext.define('ext5.view.chapter2.RequireClass', {
    extend: 'Ext.panel.Panel',
    xtype: 'chapter2-requireclass',
    title: '동적 로딩된  클래스입니다.'
});
{% endhighlight %}
RequireClass 클래스를 로딩하기 위해 DynamicPanel 클래스를 정의한다. 이 클래스는 HTML파일에서 호출될 것이다.
{% highlight javascript %}
Ext.define('ext5.view.chapter2.DynamicPanel', {
    extend: 'Ext.panel.Panel',
    requires: ['ext5.view.chapter2.RequireClass'],  // #1
    xtype : 'chapter2-dynamicloading',
    title: 'DynamicPanel',

    otherContent: [{    // #2
        type: '동적로딩 클래스',
        path: 'app/view/chapter2/RequireClass.js'
    }],

    items: [{
        xtype: 'chapter2-requireclass'  // #3
    }]
});
{% endhighlight %}
- #1. DynamicPanel 클래스에서 동적 로딩해 사용할 클래스를 정의한다.
- #2. 이 샘플과는 무관하나 이 책의 마지막 샘플에서 사용할 관련 클래스 정보이다.
- #3. (#1)에서 로딩한 클래스의 위젯명을 items에 추가했다. 만약 (#1)이 없다면 정상적으로 작동하지 않는다.

위 코드를 실행하고 개발자 도구의 Elements 탭에서 동적 로딩된 클래스를 확인 할 수 있다. 동적 로딩된 클래스는 항상 주소 끝에 “?_dc=1406827960731”와 같은 파라미터를 붙여 브라우저 캐시에 저장되지 않게 있다.
![](imgs/img2-05.png)<br>
**그림 2-5 클래스 동적로딩 결과 확인**

다시 (#1)을 주석으로 처리하고 실행하자. 콘솔에는 chapter2-requireclass.js를 찾을수 없다는 에러로그가 출력된다.

![](imgs/img2-06.png)<br>
**그림 2-6 동적클래스 로딩(require) 설정이 제거된 상태에서 실행한 결과.**

requires 설정은 브라우저에 클래스가 로딩되게 하고 이렇게 로딩된 클래스는 ExtJS 클래스 매니저에 의해 메모리에서 검증 과정을 거친다. 이 과정에 클래스명과 위젯명은 하나의 쌍으로 사용할 수 있게 되고 이후에는 함축적인 위젯명을 사용할 수 있게 된다.

위젯명은 alias 외에 xtype으로도 사용할 수 있다. xtype으로 사용할 경우 “widget”이라는 prefix는 제외하고 사용한다.

- alias: 'widget.chapter2-requireclass'
- xtype: 'chapter2-requireclass'

## References

- [Ext JS5 document](http://docs.sencha.com/extjs/5.0/)
