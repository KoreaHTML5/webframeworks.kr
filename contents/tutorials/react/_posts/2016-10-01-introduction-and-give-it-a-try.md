---
layout : tutorials
title : React 소개 및 맛보기
category : tutorials
summary : React의 특징을 알아보고 webpackbin 도구를 사용하여 간단한 맛보기를 진행해봅니다.
permalink : /tutorials/react/react-intro-and-give-it-a-try
tags : javascript react
author : velopert
---
# React 강좌 01: 소개 및 맛보기
> 이 강좌에서는 React에 대한 간략한 정보와 특징에 대하여 알아보고,
>간단한 예제를 통해 React를 사용해보도록 하겠습니다.
>
>본 강좌는 ReactJS를 처음 배우는 JavaScript 개발자들을 대상으로 작성됐으며 앞으로 연재될 강좌를 수월하게 진행하려면,
>Javascript, HTML5, CSS에 대한 전반적인 지식이 필요합니다.
>
>또한, 앞으로 사용 될 자바스크립트 문법은 ECMAScript 6 이므로, 배경지식을 알고있으면 도움이 됩니다.
>허나, 이에 대해서 아직 잘 알지 못하더라도 강좌를 진행하면서 차근차근 배워나갈 예정이니 걱정하지 않으셔도 됩니다.

## React ?
React는 페이스북에서 개발한 유저인터페이스 라이브러리로서 개발자로 하여금 재사용 가능한 UI를 생성 할 수 있게 해줍니다. 이 라이브러리는 현재 페이스북, 인스타그램, 야후, 넷플릭스를 포함한 많은 큰 서비스에서 사용되고 있습니다.

이 라이브러리는 Virtual DOM 이라는 개념을 사용하여 상태의 변함에 따라 선택적으로 유저인터페이스를 렌더링합니다.
따라서, 최소한의 DOM 처리로 컴포넌트들을 업데이트 할 수 있게 해줍니다.

## Virtual DOM 은 어떻게 작동하지?

### DOM 이해하기
우선 DOM 이 뭔지 제대로 짚고 넘어갑시다. DOM 은 Document Object Model 의 약자입니다. 이는 객체를 통하여 구조화된 문서를 표현하는 방법이며, XML 혹은 HTML 로 작성됩니다. 웹 브라우저는 이 DOM 을 활용하여 객체에 JavaScript 와 CSS 를 적용하지요. DOM 은 트리 형태로 되어있어서, 특정 node 를 찾을 수도 있고, 수정 할 수도 있고, 제거하거나 원하는 곳에 삽입 할 수도 있습니다.

#### DOM 의 문제점
요즘의 DOM API 는 수많은 플랫폼, 그리고 수많은 브라우저에서 사용되고 있는데, 이 DOM 에는 치명적인 문제점이 하나 있습니다. 그것은 바로, 동적 UI 에 최적화되어 있지 않다는 것 있습니다. HTML 은 자체적으로는 정적이잖아요. 그렇죠? 물론, 이는 자바스크립트나 jQuery 를 사용하여 손을 볼 수 있습니다.

하지만, 요즘의 큰 규모의 웹 어플리케이션, 예를 들어 트위터나 페이스북을 생각해보세요. 스크롤을 좀 내리다 보면, 정말 수많은 데이터가 로딩됩니다. 그리고 각 데이터를 표현하는 요소(element)들이 있겠죠. 그 요소들의 개수가 몇백 개, 몇천 개 단위로 많아진다면 (예: 페이스북에서 포스트 한 개를 표현 할 때 사용되는 `<div>` 요소의 개수는 약 100개 입니다) 이야기가 좀 달라집니다. 이렇게 규모가 큰 웹 어플리케이션에서 DOM 에 직접 접근하여 변화를 주다 보면, 성능상의 이슈가 조금씩 발생하기 시작합니다. 좀 느려진다는 건데요, 일부 문서에서는 이를 두고 요즘의 자바스크립트 엔진은 매우 빠른 반면, DOM 은 느리다 라고 하는데, 이것은 정확한 사실이 아닙니다.

DOM 자체는 빠릅니다. DOM 자체를 읽고 쓸 때의 성능은 자바스크립트 객체를 처리 할 때의 성능과 비교해서 다를 게 없습니다. 단, 브라우저 단에서 DOM 의 변화가 일어나면, 브라우저가 CSS 를 다시 연산하고, 레이아웃을 구성하고, 웹 페이지를 리페인트 하는데, 이 과정에서 시간이 허비되는 것 이랍니다.

#### 해결법

HTML 마크업을 시각적인 형태로 변환을 하는 것은 브라우저의 주 역할이기 때문에, 이를 처리 할 때 컴퓨터 자원이 사용되는 것은 어쩔 수 없습니다. 결국엔, 이 문제를 해결하기 위해서 DOM 조작을 아예 안 할 수는 없으니까, 적어도 최소한의 DOM 조작을 통하여 우리의 작업을 처리하는 방식으로 이를 개선 할 수는 있습니다. 예를 들어, DOM 업데이트를 4번 하면 브라우저에서 redraw 과정이 4번 이뤄지는데, 이를 묶어서 처리하거나, 우리가 원하는 최종 결과에는 영향을 끼치지 않아서 필요하지 않은 업데이트는 생략하게 하면 성능이 많이 개선되겠죠?

React는, Virtual DOM 이라는 방식을 사용함으로써 DOM 업데이트를 추상화하여, DOM 처리를 횟수를 최소화하고, 효율적으로 진행합니다.

### Virtual DOM
Virtual DOM 을 사용하면, 실제 DOM 에 접근하여 조작하는 대신에, 이를 추상화 시킨 자바스크립트 객체를 구성하여 사용합니다. 이는 마치 실제 DOM 의 가벼운 사본과도 비슷하죠.

React 에서 데이터가 변하여 브라우저상의 실제 DOM 을 업데이트 할 때에는 다음과 같이 3가지 절차를 밟습니다:  

1. 데이터가 업데이트되면, 전체 UI 를 Virtual DOM 에 리렌더링 합니다.
2. 이전 Virtual DOM 에 있던 내용과 현재의 내용을 비교합니다.
3. 바뀐 부분만 실제 DOM 에 적용이 됩니다.

#### 오해
Virtual DOM을 사용한다고 해서, 사용하지 않았을 때와 비해 무조건 빠른 것은 아닙니다.   
React 매뉴얼에 따르면, 다음과 같은 문장이 있습니다:


>우리는 다음 문제를 해결하기 위해 React를 만들었습니다: 지속해서 데이터가 변화하는 대규모 애플리케이션을 구축하기.

예, 그렇습니다. 결국엔 적절한 곳에 사용해야 React 가 비로소 지니고 있는 진가를 발휘하게 됩니다. React 를 사용하지 않아도 코드 최적화를 열심히 하면 DOM 작업이 느려지는 문제를 개선 할 수 있고, 또 매우 간단한 작업의 경우엔 (예: 단순 라우팅 정도만 있는 정적인 웹페이지) 오히려 React 를 사용하지 않는 편이 더 나은 성능을 보이기도 합니다.

반면에, React 와 Virtual DOM 이 우리에게 언제나 제공해 줄 수 있는 것은 바로 업데이트 처리에 대한 간결함입니다. UI 를 업데이트하는 과정에서 생기는 복잡함을 모두 해소해주고, 업데이트에 더욱 쉽게 접근 할 수 있게 해줍니다.

## 특징
- **Virtual DOM** 을 사용합니다
- **JSX**: JSX 는 JavaScript 의 확장 문법입니다. DOM 엘리먼트들을 만들 때 JavaScript 형식으로 작성해야 하는 것을, XML 과 비슷한 형태로 작성할 수 있게 해줍니다. 이를 사용하는것은 권장사항이고 필수는 아닙니다. 하지만 사용하지 않으면 좀 불편합니다.
- **Components** React는 모두 Component 에 대한 것 입니다. React 개발을 할 때는 모든 것을 Component 로서 생각해야 합니다. 컴포넌트에 대한 자세한 내용은 앞으로 작성 될 강좌에서 다루겠습니다.

## 장점
- Virtual DOM 을 사용한 어플리케이션의 성능 향상
- 클라이언트에서도 렌더링 될 수 있고, 서버측에서도 렌더링 될 수 있음 (이를 통해 브라우저측의 초기 렌더링 딜레이를 줄이고, SEO 호환도 가능해집니다)
- Component 의 가독성이 매우 높고 간단하여 쉬운 유지보수가 가능해집니다.
- 프레임워크가 아닌 라이브러리서 다른 프레임워크들과 사용이 가능합니다. React 에선 UI만 신경쓰고, 빠져있는 부분은 본인이 좋아하는 라이브러리를 사용하여 stack 을 본인의 입맛대로 설정 할 수 있음

## 제한
- 어플리케이션의 View 레이어만 다루므로 이 외의 부분은 다른 기술을 사용해야 합니다 (예를 들어 Ajax, Router 등의 기능은 직접 구현하거나 다른 모듈을 설치하여 사용합니다. 하지만 그 과정이 그렇게 복잡하지 않습니다.
- React 버전 v15부터 IE8 이하 버전을 지원하지 않습니다. (IE8 이하 버전을 지원해야 할 경우 v0.14 버전을 사용 해야 합니다)

> 페이스북은 React 버전을 v0.14 에서 v15로 *껑충* 띄웠습니다. 그 이유는 production 에서 사용해도 된다고 안정성을 약속한다는것을 강조하기 위함이라고 합니다.


## 맛보기
React 프로젝트를 시작하려면 Node.js 와 NPM 을 설정하고 이것저것 설정을 많이 해야합니다. 그치만, 그 과정을 생략하고 먼저 React 맛보기를 해보기 위하여 유용하고 편한 웹서비스인 webpackbin 을 사용해보록 하겠습니다.

### [webpackbin](http://www.webpackbin.com/) 접속
webpackbin 은 NPM 설치 없이도 브라우저에서 webpack 을 사용하여 프로젝트를 생성 할 수 있게 해주는 도구입니다.

###  상단의 Boilerplates > React 클릭
Boilerplates 기능을 이용하면 미리 준비된 React 프로젝트를 바로 클론하여 React 프로젝트를 단숨에 시작 할 수 있습니다.   
좌측 에디터에 index.html, main.js, HelloWorld.js 파일이 생성되었지요? HelloWorld.js 파일을 열어보세요.

### HelloWorld.js
```javascript
import React from 'react';

function HelloWorld () {
  return (
    <h1>Hello World!</h1>
  );
}

export default HelloWorld;
```
코드의 상단에선 React 를 import 했습니다. 이 import 는 공식적으로 업데이트된 자바스크립트 문법인 ECMAScript2015(ES6) 의 문법이며, `var React = require('react');` 와 동일한 의미 입니다.원래는 이렇게 모듈을 require 을 하는것은 Node.js 의것 입니다. 클라이언트사이드에선 보통 html 태그에서 script 르 통하여 여러 파일을 불러오지 이렇게 require 을 하지 않습니다. 지원하지도 않구요.

하지만, webpack 이라는 도구를 사용하여 마치 Node.js 에서 require 하는것과 같이 모듈을 불러올 수 있게 하는 것 입니다. webpack 은 이렇게 import(혹은 require) 한 모듈들을 불러와서 한 파일로 합칩니다. 이 작업을 **번들링(bundling)** 이라고 합니다.

import 하단에 있는 코드는 [Stateless Functions](https://facebook.github.io/react/docs/reusable-components.html) 를 통하여 HelloWorld 라는 컴포넌트를 선언하는 코드입니다.

`return (<h1>HelloWorld</h1>)` 이런식으로 HTML 같은 코드가 `'` 나 `"` 도 없이 그냥 적혀있죠? 이 코드는 JSX 코드입니다. 이 코드는 webpack 에서 번들링 과정을 거치면서 webpack 에서 사용하는 babel-loader 를 통하여 JavaScript 로 변환됩니다. 위 JSX 코드가 JavaScript 로 변환되면 다음과 같습니다.

```javascript
  return React.createElement(
    "h1",
    null,
    "Hello World!"
  );
```

 이번엔 main.js 파일을 열어보세요

### main.js
```javascript
import React from 'react';
import {render} from 'react-dom';
import HelloWorld from './HelloWorld.js';

render(<HelloWorld/>, document.querySelector('#app'));
```
HelloWorld.js 에서 만든 컴포넌트를 여기서 불러와서 페이지에 렌더링합니다.

이 파일은 webpack 의 entry 파일입니다. 여기서부터 import 하는 파일들을 재귀적으로 모두 불러와서 하나의 파일로 합치는거죠.
 React 컴포넌트를 페이지에 렌더링 할 때에는 react-dom 모듈을 불러와서 render 함수를 통하여 처리합니다.

여기서 render 함수의 첫번째 파라미터는 렌더링 할 JSX 형태 코드입니다. 여기서는 HelloWorld 컴포넌트를 렌더링하도록 설정하였습니다. 이런식으로, 컴포넌트를 만들면 `<컴포넌트이름/>` 이런식으로 HTML 태그를 작성하듯이 쓸 수 있는겁니다.

 두번째 파라미터는 렌더링 할 HTML 요소입니다. 여긴 id가 app 인 요소에 렌더링을 하게 설정했네요. 이 요소는 index.html 에서 찾아 볼 수 있습니다.

### index.html
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8"/>
  </head>
  <body>
    <div id="app"></div>
    <script src="main.js"></script>
  </body>
</html>
```

### 컴포넌트에 속성을 줘보자
HelloWorld 컴포넌트에 속성을 만들어봅시다. 코드를 다음과 같이 수정하세요.  
#### HelloWorld.js
```javascript
import React from 'react';

function HelloWorld (props) {
  return (
    <h1>Hello {props.name}!</h1>
  );
}

export default HelloWorld;
```

함수에 props 파라미터를 추가하고, 이 props.name 값을 JSX 안에서 렌더링하도록 하였습니다.  
JavaScript 값을 JSX에서 렌더링 할 때에는 `{ }`안에 감싸면 됩니다.

코드를 저장하고, 이제 main.js 를 열어서 다음과 같이 수정하세요.

#### main.js

```
import React from 'react';
import {render} from 'react-dom';
import HelloWorld from './HelloWorld.js';

render(<HelloWorld name="velopert"/>, document.querySelector('#app'));
```

위와 같이 HelloWorld 컴포넌트에 name 값을 설정해주고저장을 하세요.
> 상단의 Live 버튼을 누르면 코드가 수정 될 때마다 바로 반영이 됩니다.


## 마무리
한건 별로 없지만 맛보기가 끝났습니다.지금까지 다룬 내용은 새발의 피일 뿐 입니다. 다음 강좌에서는 작업환경을 PC에 직접 설정하고 React 를 공부 할 준비를 해보겠습니다.
