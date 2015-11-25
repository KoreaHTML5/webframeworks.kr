---
layout : tutorials
title : React 앱의 최적화 전략
category : tutorials
subcategory : intro
summary : 프로덕션을 위한 React 앱을 만들었으면, 이제 최적화에 대해 알아볼 때가 되었습니다. React 앱의 일반적인 최적화 전략을 알아봅시다.
permalink : /tutorials/react/react-optimization
tags : javascript react optimization immutable
author : sairion
---

React는 virtual DOM 표현을 통해 DOM node를 자바스크립트 오브젝트로 표현하고, 비교조정 알고리즘을 통해 실제 DOM 업데이트 시 필요한 변경점만 반영한다는 것을 이전 글에서 다뤘습니다. 또한 React에서는 다양한 라이프사이클 메서드를 통해 컴포넌트의 생명주기 관리 API를 제공한다는 것을 이야기했습니다. 이와 같은 기반 지식들을 토대로 앱을 만들었으면, 이제 React 앱을 프로덕션에서 동작시키기 위한 지식들이 필요합니다. 앞으로 최적화, 그리고 개발과 배포에 대해 알아보겠습니다.

## 기본적인 최적화: `shouldComponentUpdate()` 활용 전략

`shouldComponentUpdate()` (이하 sCU)는 이전 글에서 다루었듯이, 뷰 갱신 직전에 갱신 여부를 이 메서드에서 반환된 Boolean 값에 따라 결정합니다. 최적화를 위해 기본적으로 이 메서드를 구현해주면 됩니다. 일반적으로 너무 많은 뷰 갱신이 이뤄지는 경우 이 메서드를 통해 성능 최적화를 쉽게 달성할 수 있습니다.

최적화 포인트를 분명한 한 두 군데(주로 큰 렌더 트리의 루트)에 설정해 구현하기를 권장합니다. sCU를 이용한 최적화를 필요 이상으로 남발하면 React의 기본 업데이트 전략이 무의미해지는 것도 있고 상위 컴포넌트가 주입하는 `prop`의 스펙이 바뀔 때마다 sCU를 변경해주는 것도 유지보수 측면에서 blocker가 될 가능성이 높습니다.

그 외 주의해야 할 점은, `this.forceUpdate()` 메서드는 sCU 체크를 무시한다는 점입니다.

## `shouldComponentUpdate()`안에서의 단순 비교의 한계

sCU 메서드를 통한 단순 비교는 한계가 있습니다. 특히 새로이 반환되는 함수(bound function)나 플레인 오브젝트를 비교하는 것은 어렵습니다. 특이한 경우가 아닌 이상은 웹 앱은 일반적으로 브라우저 API에서 반환되거나 서버에서 반환된 오브젝트들을 비교하게 되므로, sCU 메서드 안에서 값을 단순 비교하는 것은 갈수록 점점 어려워지기 마련입니다. 이를 위해 React에서는 기본적으로 불변성 자료 구조 (immutable data structure) 컨테이너를 사용하기를 권장합니다.

## 더 나은 최적화: Immutable.js와 같은 불변성 자료 구조를 이용하기 

불변성 자료 구조는 일반적으로 외부 인터페이스를 불변 상태로 강제하고 내부에서 데이터 공유를 통해 최적화를 하는 자료 구조를 지칭합니다. 자바스크립트에는 불변 자료 구조를 활용하는 언어 Clojure의 자료구조를 이식한 [Mori](http://swannodette.github.io/mori/), 그리고 이의 영향을 받아 구현한 [Immutable.js](https://facebook.github.io/immutable-js/), 순수 자바스크립트 오브젝트처럼 컨테이너를 사용할 수 있게 구현한 [seamless-immutable](https://github.com/rtfeldman/seamless-immutable)과 같은 라이브러리가 있습니다. 

이와 같은 라이브러리들은 자료가 업데이트될 시 새로운 오브젝트 리퍼런스를 생성하므로, sCU 메서드 안에서 `===` 오퍼레이터를 통해 오브젝트가 같은 리퍼런스를 가지고 있는지만 체크하면 됩니다. 이를 통해 비교 로직이 더 간단해지기도 하고, 가변(mutable) 오브젝트의 비교 문제를 해결할 수 있습니다. 가변 오브젝트라면 값은 똑같지만, 오브젝트 자체는 다른 경우를 감별하기 어려울 수 있고 원하지 않는 동작으로 이어질 수 있습니다.

자세한 정보는 최적화에 관련한 공식 문서와 다음 글타래들을 읽어보시길 추천합니다.

[성능 심화 - 공식 문서](https://facebook.github.io/react/docs/advanced-performance-ko-KR.html)
[Immutable Data and React - 꿀벌개발일지](http://ohgyun.com/585)

## React의 최적화 빌드

React 내부에서는 `process.env.NODE_ENV`가 스트링 `'production'`인지 여부에 따라 프로덕션 모드로 작동할 것인지, 개발 모드로 작동할 것인지 여부를 결정합니다. React는 개발 모드에서 수많은 개발자 편의를 위한 런타임 체크를 수행하기 때문에, 이를 그대로 프로덕션에서 사용해서는 안됩니다. 실제 퍼포먼스 측정 또한 최적화 빌드를 기준으로 하는 것이 좋습니다.

## React 앱의 퍼포먼스 측정: Performance Tools

React는 기본적으로 퍼포먼스 측정 도구를 내장하고 있습니다. 퍼포먼스 측정 도구의 사용법에 대해서는 문서에 잘 작성되어 있습니다만, 성능 측정은 디버깅과 같이 프로젝트 구조에 대한 맥락을 계속 파악하면서 하는 것이 좋아 일반적인 기법을 설명하기는 어렵습니다. 다행히도, 참고하기 좋은 굉장히 좋은 사례가 있습니다. [Paul Irish의 레딧 모바일 앱 퍼포먼스 audit](https://github.com/reddit/reddit-mobile/issues/247) 이슈를 참고하면, `Perf.printInclusive()` `Perf.printExclusive()` `Perf.printWasted(measurements)` API를 사용해서 렌더 시간 낭비가 심한 컴포넌트들을 추적하는 기법의 사용을 볼 수 있습니다.

그 외 [react-render-visualizer](https://github.com/redsunsoft/react-render-visualizer)와 같은 여러가지 퍼포먼스 도구들이 있으니 Github을 늘 주목하시기 바랍니다!

## 마치며

이정도면 React의 퍼포먼스에 대한 기본적인 지식은 거의 다 설명한 것 같습니다. React에서 Virtual DOM을 통해 자동적으로 관리해주는 부분이 있긴 하지만, 그럼에도 불구하고 결국 사용자의 결정에 따라 퍼포먼스 특성은 달라지기 마련입니다. 퍼포먼스 문제가 발생하기 시작하기 전에 최적화를 시작할 필요는 없습니다! 하지만 앱이 커질수록 더 나은 퍼포먼스에 대한 요구가 생기기 마련이니, 프로젝트 구조를 효율적이고 간결하게 유지하려는 노력은 계속되어야 합니다.

이 글의 내용이 대부분 런타임 상의 최적화를 다뤘다면, 다음 글에서는 Webpack과 같은 모듈 번들러를 이용해 컴파일 타임 최적화를 할 수 있는 기법 또한 알아보겠습니다. 이와 같은 도구를 통해 개발자는 모듈 번들러를 이용해 필요없는 의존성을 최대한 줄이고 HTTP 캐시를 통한 최적화를 달성할 수 있습니다.

## 더 읽어보기

['Respectable React Components' - React 퍼포먼스에 관한 슬라이드](http://kelle.co/react-perf-slides/)
