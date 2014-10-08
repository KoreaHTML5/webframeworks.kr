---
layout : getstarted
title : Modernizr
category : getstarted
subcategory : library
summary : 
permalink : /getstarted/modernizr
title_background_color : d91e76
title_color : FFFFFF
tags : modernizr
author : nurinamu
---

## Modernizr 란?
Modernizr란 사용자의 브라우저가 현재 가지고 있는 HTML5, CSS 기능들을 감지하고 지원여부를 판별하는 Javascript 라이브러리 입니다. 
다양한 브라우저에서 지원되는 기능을 하나씩 확인해가면서 개발하는 것은 현실적으로 불가능하기 때문에 Modernizr와 같은 라이브러리를 통해 필요기능을 감지하고
지원 여부에 따라 개발자가 동적으로 처리를 달리할 수 있습니다.

## Modernizr의 동작

Modernizr의 동작은 단순합니다. 자신이 확인하고자 하는 기능의 API를 호출해서 return true/false만 확인하면 됩니댜.
예를 들어 WebGL 지원여부를 확인하려면 아래와 같이 코드를 삽입하면 됩니다.

``` javascript
if (Modernizr.webgl){
   loadAllWebGLScripts(); // webgl assets can easily be > 300k
} else {
   var msg = 'With a different browser you’ll get to see the WebGL experience here: \
            get.webgl.org.';
   document.getElementById( '#notice' ).innerHTML = msg;
}
```

또는 지원 여부에 따라 Polyfill을 아래와 같이 간단하게 삽입할 수 도 있습니다. 

``` javascript
Modernizr.load({
  test: Modernizr.geolocation,
  yep : 'geo.js',
  nope: 'geo-polyfill.js'
});
```

Modernizr는 다양한 브라우저에서 동작합니다.
IE6 이상, Firefox 3.5 이상, Opera 9.6 이상, Safari 2 이상, Chrome. 
그리고 모바일에서 Safari, Android's WebKit browser, Opera Mobile, Firefox Mobile에서 동작됩니다.

## 설정방법
Modernizr는 설치형으로 웹사이트에서 다운받아 사용됩니다.

```
http://modernizr.com/download/
```