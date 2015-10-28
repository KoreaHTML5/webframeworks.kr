---
layout : tutorials
title : React와 애니메이션
category : tutorials
subcategory : intro
summary : React에서 웹 애니메이션을 하는 방법들을 알아봅시다.
permalink : /tutorials/react/react-animation
tags : javascript react es2015 es6 es7 jsx animation
author : sairion
---

## 웹 애니메이션의 문제

웹에서의 애니메이션을 하는 방법은 굉장히 다양합니다. 캔버스를 이용한 비트맵 기반 애니메이션부터 가장 쉽게 구현할 수 있는 CSS Transition과 CSS Animation, 그리고 새로운 (아무도 관심 없는) Web Animations 스펙도 존재합니다. React를 이용해 웹에서 애니메이션을 한다고 하면 대부분의 경우 CSS Transition의 구현이라고 봐도 될 것 같습니다. 이 글에서는 React에서 사용하는 DOM 기반의 애니메이션 솔루션에 대해 알아봅니다.

## DOM 애니메이션은 무엇인가?

React 프로젝트의 메인테이너 중 하나인 [chenglou](https://github.com/chenglou)는 React의 애니메이션 관련 문제를 담당하고 있는 사람입니다. chenglou는 React에서의 애니메이션 동작을 다음의 7가지로 [정의한 바](https://medium.com/@chenglou/react-motion-and-animated-4b3edf671cba) 있습니다:

1. 아이템의 프로퍼티를 보간(interpolating)한다.
2. 애니메이션의 타임라인을 관리한다.
3. 많은 아이템들과 연동된 애니메이션을 한다 (예: staggering).
4. unmount 직전 애니메이션을 한다.
5. 추상화 계층(컴포넌트)을 넘어 child를 애니메이션한다.
6. View와 View 너머의 애니메이션을 한다.
7. 기타 등등

이는 다른 웹 애니메이션 라이브러리들에게도 마찬가지로 적용되는 부분입니다. 단지, 대부분의 애니메이션 라이브러리들은 일부(주로 1~3)에만 초점이 맞춰져 있었다는 점을 chenglou는 위의 글에서 지적합니다.

`jQuery.fn.animate` 등 다른 라이브러리들을 통해 trivial한 수준 이상의 애니메이션을 해보신 분들은 4,5,6이 imperative API를 사용하면 얼마나 어렵고 귀찮은 문제인지 아실 겁니다. 특히 애니메이션은 비동기적인 로직이므로 문제는 더 복잡해기 마련입니다. React에서도 문제가 어렵기는 마찬가지입니다. 고도의 추상화가 이뤄진 뷰 레이어 때문에 직접 DOM을 다루는 상황보다 더 잘 알고 써야 할 필요도 있습니다.

아래에서는 React에서 애니메이션을 하는 방법, 라이브러리 등을 정리해 보겠습니다.

## 기존의 DOM 애니메이션 라이브러리를 사용

충분히 경험이 있으신 웹 개발자 분들은 이미 알고 계시겠지만, 웹 애니메이션을 다루는 라이브러리들은 이미 많이 나와 있습니다. React에서, 비록 unsafe하고 권장되지 않는 방식이긴 하나, 기존 앱을 마이그레이션하거나 하는 경우 충분히 고려해봐야 하는 방법입니다.

React 앱의 라이프사이클을 생각해봐야 하는데, 특정 DOM 엘리먼트가 존재한다고 가정할 수 있는 상황 (`componentDidMount`, `componentWillUnmount`, `componentDidUpdate`)에 애니메이션을 동작시켜야 존재하지 않는 노드에 대해 오퍼레이션을 하는 상황을 막을 수 있습니다. 또한 `shouldComponentUpdate` 를 컨트롤해 DOM state가 의도치 않게 변경되는 상황을 막아야 하며, 가능하면 리프(leaf) 엘리먼트를 조작하는 상황을 만드는 것이 쉬울 것입니다.

### DOM 기반 웹 애니메이션 라이브러리

피쳐 측면에서 가장 완성도가 높은 것으로 알려져 있는 라이브러리로는 [Velocity](http://julian.com/research/velocity/)와 [Greensock](http://greensock.com/)이 있고, 최근의 강자로는 [popmotion](http://popmotion.io/)이 있습니다. Velocity의 경우 React와 사용하려는 시도가 많이 있어, 트위터에서 개발한 [velocity-react](https://github.com/twitter-fabric/velocity-react) 같은 라이브러리를 사용하는 것도 하나의 방법입니다.

이러한 라이브러리들은 stagger나 decay 등의 일반적인 애니메이션 패턴들이 미리 만들어져 있어, 몇 개의 메서드만 사용해서 쉽게 애니메이션을 할 수 있다는 장점이 있습니다.

## CSSTransitionGroup

[애니메이션 공식 문서](https://facebook.github.io/react/docs/animation-ko-KR.html)

(React에서는 애니메이션 addon을 제공하는데, 고수준 API인 `CSSTransitionGroup` 와 저수준 API인 `ReactTransitionGroup` 두가지가 있습니다. 보통은 `CSSTransitionGroup`을 이용하게 되므로 이쪽만 설명하도록 하겠습니다)

클래스 기반의 CSS 트랜지션은 상당히 단순한 멘탈 모델에서 구현을 할 수 있다는 점이 장점입니다. Tweening을 어떻게 할 지 선언적으로 써 주기만 하면 되는 것이죠. 또한 렌더링 파이프라인을 브라우저에서 전적으로 관리할 수 있어 성능상의 큰 이점이 있습니다. 하지만 자바스크립트로 중간 지점에서 컨트롤을 할 수 없다는 단점, 그리고 CSSTransitionEnd 이벤트의 구현이 브라우저마다 들쭉날쭉하다는 (특히 사파리에서의 off-screen 버그는 유명합니다) 문제가 있습니다. 이런 문제들은 CSSTransitionGroup에서도 마찬가지로 존재합니다.

CSSTransitionGroup의 API는 굉장히 단순합니다. 마운트와 언마운트시 transitionName에 `-enter` `-enter-active` 등의 현재 상태를 표현하는 클래스를 교환해주는 것에 불과합니다. jQuery로 css 애니메이션을 할 때 'active', 'inactive' 등의 상태를 붙여서 애니메이션을 하는 것처럼 말이죠. css는 SCSS로 작성하면 훨씬 편리하게 작성할 수 있고, 믹스인을 사용하여 transitionName과 패러미터를 주는 식으로 [줄여 쓸 수 있습니다](http://stackoverflow.com/questions/31553622/defining-react-csstransitiongroup-animations-with-stylus-mixin).

CSSTransitionGroup은 원래 CSSTransitionEnd 이벤트에 동작을 의존하여, 애니메이션이 로직에 포함된 경우 (i.e. 버튼을 누른 다음 트랜지션 후 폼이 나온다든지) 오류가 나면 마운트가 되지 않아 앱이 중단되는 큰 문제가 발생할 수 있습니다. 이런 문제 때문에 Khan Academy에서 발표한 TimeoutTransitionGroup이라는 별도 구현이 있었는데, 이는 트랜지션 직전에 타이머를 발생시켜 시간이 지나면 마운트가 반드시 되도록 보장한 것입니다. React 0.14.0에서는 이 구현 방식을 받아들여 타이머를 이용하고 있습니다.

## React-motion : 차세대 React 애니메이션 툴킷

[react-motion](https://github.com/chenglou/react-motion)은 chenglou의 라이브러리로, react-europe 2015 컨퍼런스의 ["The State of Animation in React"](https://www.youtube.com/watch?t=56&v=1tavDv5hXpo) 키노트 세션에서 처음 발표되었습니다. chenglou는 이 라이브러리가 차후 CSS Transition Group을 대체할 것이라고 밝힌 바 있습니다. 따라서 앞으로 공식 라이브러리로 격상될 가능성이 있습니다.

React-motion은 Motion, StaggeredMotion, TransitionMotion 등의 트랜지션 컨테이너들을 제공하며 함수를 children으로 받아 계층적, 선언적으로 애니메이션을 표현할 수 있습니다. TransitionMotion 같은 컨테이너는 CSSTransitionGroup과 비슷하게 `willEnter` / `willLeave` 콜백을 남겨, 마운트와 언마운트시의 로직을 표현하는 것도 가능합니다. 자세한 API는 공식 저장소를 확인하시기 바랍니다.

## 찬조 출연: Animated

Animated는 React Native를 위한 애니메이션 라이브러리이며, React의 메인테이너인 [vjeux](https://github.com/vjeux)에 의해 개발되었습니다. 원래는 React Native 버젼만 있었지만 최근 웹 버젼의 프로토타입이 머지되었으며, 차후 React-motion과 하나의 라이브러리로 통일될 가능성이 높습니다.

[참고](http://blog.vjeux.com/2015/javascript/react-rally-animated-react-performance-toolbox.html)

## 보너스: React를 이용한 캔버스 애니메이션

[react-three](https://github.com/Izzimach/react-three)는 three.js API의 바인딩으로 React를 이용한 DOM 애니메이션 라이브러리들과는 달리 캔버스를 조작하는 라이브러리라는 차이가 있습니다. 비슷한 라이브러리로 [gl-react](https://github.com/ProjectSeptemberInc/gl-react)도 존재합니다. (gl-react의 경우는 좀 더 로우레벨의 바인딩이며, react-native 바인딩도 지원한다는 차이가 있습니다)
