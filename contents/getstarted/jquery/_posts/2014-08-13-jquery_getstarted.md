---
layout : getstarted
title : jQuery 시작하기
category : getstarted
summary : jQuery란 무엇이고 설치방법과 기본적인 사용법에 대해서 알아봅니다. 최근 웹 어플리케이션 개발할때 필수적으로 사용하는 라이브러리이니 만큼 익숙해지는 것이 좋습니다.
permalink : /getstarted/jquery
title_background_img : imgs/logo-jquery@2x.png
title_background_color : 0769AD
tags : jquery javascript html
author : nurinamu
---

# jQuery 시작하기

## jQuery란?
jQuery는 기본적으로 DOM manipulator 기능이 강력합니다. 보다 편하고 쉽게 DOM 객체에 접근 가능하게 해주며 추가적인 Wrapper 함수들을 통해 다양한 이벤트 처리, 속성 접근이 가능합니다.
jQuery는 또한 ajax 처리와 animation 처리를 간편하게 할 수 있도록 제공하고 있으며 브라우저 호환성이 우수합니다. jQuery는 다양한 Javascript Library / Framework에서 활용되고 있어 근래의 웹 기술 학습을 위해서는 거의 필수적으로 선수 학습을 해야합니다.

## 설치방법

jQuery는 홈페이지를 통해 download 받아서 사용하는 방법과 CDN을 통한 직접 사용 방법을 제공합니다.

### Download 받아서 사용하는 경우

[http://jquery.com/download/](http://jquery.com/download/) 에서 최신 버전의 jquery를 받을 수 있다.

{% highlight html linos %}
<!-- 아래 tag를 필요한 위치에 삽입한다. 일반적으로 head 안에 위치한다. -->
<script type=”text/javascript” src=”/path/to/jquery.js”></script>
{% endhighlight %}

### CDN을 이용하는 경우

CDN경로는 아래와 같고 해당 경로를 이용해서 script tag를 삽입하면 된다.

{% highlight html linos %}
<!-- 아래 tag를 필요한 위치에 삽입한다. 일반적으로 head 안에 위치한다. -->
<script type=”text/javascript” src=”/path/to/jquery.js”></script>
{% endhighlight %}

## 사용방법

### DOM 접근
가장 기본적인 jQuery의 사용 예로 DOM Object에 접근하는 방법입니다.
tag명, id, 속성들을 이용해 다양한 방식으로 접근할 수 있습니다.

{% highlight html linos %}
<body>
    <div id="first">
        <input type="text" name="title">
        <input type="button" name="sendBtn" value="SEND">
    </div>
</body>
{% endhighlight %}

{% highlight javascript linos %}
#기존 javascript를 이용한 DOM 접근
var bodyObj = document.getElementsByTagName('body');
var divObj = document.getElementsByID('first');
var inputObjs = document.getElementsByTagName('input');
var titleObj;
var buttonObj;
for(var i=0;i<inputObjs.length;i++){
  if(inputObjs[i].name == 'title'){
    titleObj = inputObjs[i];
  }else if(inputObjs[i].type == 'button'){
    buttonObj = inputObjs[i];
  }
}

#jQuery를 이용한 DOM 접근
var bodyObj = jQuery('body')[0];
var divObj = jQuery('#first')[0];
var inputJObjs = jQuery('input');
var titleObj = jQuery('input[name=title]')[0];
var buttonObj = jQuery('input[type=button]')[0];
{% endhighlight %}
