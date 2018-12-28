---
layout : getstarted
title : Webpackupdate
category : getstarted
subcategory : tool
summary : 자바스크립트 모듈 번들러인 웹팩(Webpack)에 알아봅니다. 
permalink : /getstarted/webpackupdate
title_background_color : AED5E6
title_color : FFFFFF
tags : webpack javascript reactjs build
author : ryanjang
---

# [webpack](http://webpack.github.io)



## 개요 

Gulp, Grunt와 더불어 Webpack은 자바스크립트 빌드 도구입니다. 사실 출시 된지는 몇 년 되었지만 최근 리엑트 프로젝트에서 사용되면서 관심을 갖게 되었습니다. 그래서 요즘은 대부분의 자바스크립트 프로젝트에 웹팩을 사용하는 분위기 이며 Grunt, Gulp도 대체하는 것 같습니다. ECMAScript 2015의 트랜스파일러인 바벨(Babel)을 웹팩과 함께 사용하면서 웹팩의 활용도는 점점 증가하고 있습니다.



## 기본 철학

Webpack의 두가지 핵심 철학: * 모든것은 module이다. * JS 파일들은 모듈(modules)이 될 수 있다. 또한 다른 모든 것(CSS, Images, HTMLS..)들도 모듈(modules)이 될 수 있다. 즉 `require(“myJSfile.js”)` 또는 `require(“myCSS.css”)` 를 할 수 있다. 이는 다루기 쉬운 작은 조각으로 나누거나, 재사용할 수 있다는걸 의미합니다.





## 참고 자료

[공식 가이드](http://webpack.github.io)





## 튜토리얼



[Webpack의 혼란스런 사항들](http://webframeworks.kr/tutorials/translate/webpack-the-confusing-parts/)