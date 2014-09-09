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

``` html
<!-- 아래 tag를 필요한 위치에 삽입한다. 일반적으로 head 안에 위치한다. -->
<script type=”text/javascript” src=”/path/to/jquery.js”></script>
```

### CDN을 이용하는 경우

CDN경로는 아래와 같고 해당 경로를 이용해서 script tag를 삽입하면 된다.

``` html
<!-- 아래 tag를 필요한 위치에 삽입한다. 일반적으로 head 안에 위치한다. -->
<script type=”text/javascript” src=”/path/to/jquery.js”></script>
```

## 사용방법

### DOM 접근
가장 기본적인 jQuery의 사용 예로 DOM(Document Object Model)에 접근하는 방법입니다.
tag명, id, 속성들을 이용해 다양한 방식으로 접근할 수 있습니다.

``` html
<body>
    <div id="first">
        <input type="text" name="title">
        <input type="button" name="sendBtn" value="SEND">
    </div>
</body>
```

``` javascript
//기존 javascript를 이용한 DOM 접근
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

//jQuery를 이용한 DOM 접근
var bodyObj = jQuery('body')[0];
var divObj = jQuery('#first')[0];
var inputJObjs = jQuery('input');
var titleObj = jQuery('input[name=title]')[0];
var buttonObj = jQuery('input[type=button]')[0];

var bodyObj = jQuery('body')[0];  //tag로
var divObj = jQuery('#first')[0];  //id 값으로
var inputJObjs = jQuery('input');  // 해당 tag가 모두 접근된다.
var titleObj = jQuery('input[name=title]')[0]; // input tag이면서 name속성값이 title인 DOM에 접근
var buttonObj = $('input[type=button]')[0]; // tag와 type값으로 접근, $는 jQuery의 축약지시자이다.
```

### Event 처리
JQuery에서는 Web page에서 발생하는 각종 Event Handler들을 제공합니다.
해당 이벤트들을 callback을 통해서 처리할 수 있습니다. 사용 방법은 기본적으로 아래와 같은 패턴입니다.

``` javascript
>>>>>>> Stashed changes
function callback(evt){
  if(evt)console.log(evt);
}

$(obj).mouseover(callback);  //obj에서 mouseover 이벤트가 발생하면 callback함수가 호출됩니다.
$(obj).on('mouseover', callback); //위와 동일한 코드이지만 on 함수를 통해서 event 명을 문자열로 처리할 수 있습니다.
```

몇 가지 중요한 Event 함수들을 확인해보면 아래와 같습니다.

##### [.ready()](http://api.jquery.com/ready/)
해당 DOM이 로드가 완료되면 설정된 callback함수가 호출이 됩니다. 예를 들어 document에 ready함수를 호출하면 HTML DOM 전체가 로드가 되면 호출이됩니다.

``` javascript
$(document).ready(function(){
    //HTML 페이지가 모두 로딩되었을때 수행될 코드를 입력하면 됩니다.
});
```

##### [.on()](http://api.jquery.com/on/)
이 함수를 통해 DOM에서 발생하는 DOM event 또는 custom event에 대해 callback을 추가할 수 있습니다.

``` html
<div>
  <span class="title">제목</span>
  <p>단락글</p>
</div>

``` javascript
$('div').on('click', callback); //div 어디든 click을 하면 callback이 호출된다.
$('div').on('click','p', callback); //div 내의 'p' tag 영역을 click하면 callback이 호출된다.
```

##### [.click()](http://api.jquery.com/click/)
해당 DOM을 클릭한 경우에 설정된 callback이 호출됩니다.

``` javascript
$('#button').click(callback); // id가 button인 영역을 click하면 callback함수가 호출된다.
$('#button').on('click', callback); //이런 방식도 .click()함수와 동일하게 동작한다.
```

보다 많은 Event 관련 함수들을 확인하려면 [여기](http://api.jquery.com/category/events/)에서 확인하면 됩니다.
