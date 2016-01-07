---
layout : tutorials
title : React 앱의 개발과 배포
category : tutorials
subcategory : test
summary : React 앱은 어떻게 개발하고 배포해야 하는지 알아봅니다.
permalink : /tutorials/react/react-development-and-distribution
tags : javascript react distribution webpack development
author : sairion
---

## 리액트 앱의 빌드

일반적으로 React 앱은 [Webpack](https://webpack.github.io/) 또는 [Browserify](http://browserify.org/)를 이용하여 빌드합니다. 이 글에서는 React 프로젝트들에서 많이 사용되는 Webpack의 설정 방법을 다룹니다.

## Webpack이란 무엇인가?

Webpack은 '모듈 번들러'를 표방합니다. 모듈 번들러는 일종의 가상 모듈 로더라고 볼 수 있습니다. AMD, CommonJS등의 모듈을 이용한 프로젝트 내의 의존성 관계를 이해하고, 모듈들을 변경하고 합치는 빌드를 할 수 있습니다. 그 외에 Webpack은 모듈 개발을 위한 여러가지 편의성 도구, 다양한 컴파일러 훅 API 등을 제공합니다. 편의성 도구의 대표적인 예로 Webpack에서 빌드되고 있는 에셋을 서빙하는 [webpack-dev-server](https://webpack.github.io/docs/webpack-dev-server.html)가 있습니다. 또한 노출되어 있는 수많은 내부 API를 이용하여 플러그인을 만들 수 있습니다.

React 프로젝트는 CommonJS 모듈을 이용하여 작성되어 있습니다. 따라서 모듈 번들러를 사용하지 않으면, `<script>` 태그 빌드로 React를 전역변수로 노출하여 이용은 가능하나 토이 프로젝트 수준의 앱을 만드는 것이 아니라면 모듈 번들러를 사용하는 것이 좋습니다. Webpack을 이용하면 의존성을 효율적으로 컨트롤할 수 있고, 개발 편의를 증진시킬 수 있습니다.

Webpack은 기본적으로 강력한 watch 모드를 내장하고 있습니다. (`--watch`) [MemoryFS](https://github.com/webpack/memory-fs)라는 메모리 캐시 구현을 사용해, 빠르게 갱신 빌드를 할 수 있으며, webpack-dev-server에 내장된 핫 로딩 기능을 이용할 수 있습니다. React 라이브러리의 핫 로딩을 구현한 [react-transform](https://github.com/gaearon/react-transform-boilerplate) 프로젝트가 유명합니다.

## Webpack의 두 기둥: 플러그인과 로더

Webpack을 사용하면 수많은 플러그인과 로더들을 설정하느라 시간을 보내게 됩니다. 그만큼 많은 기능이 Pluggable한 것이 Webpack의 특징입니다. 플러그인과 로더의 기능상의 구분이 애매하기는 하나, 로더는 `*-loader`와 같은 스트링으로 로컬 패키지를 찾는다는 점, 주로 모듈을 자바스크립트로 호환 가능한 형태로 변환하기 위하여 사용한다는 점, 플러그인은 Webpack 자체의 기능을 강화하는 데에 주로 쓰인다는 점이 다르다고 볼 수 있습니다. (물론 경계가 애매한 플러그인들도 있긴 합니다)

React로 앱을 작성하면 가장 많이 쓰는 로더는 ES2015 등을 사용하는 모듈을 변형해주는 [babel-loader](https://github.com/babel/babel-loader) 입니다. 그 외에 플러그인은 `webpack.DefinePlugin`(변수 치환 기능, `process.env.NODE_ENV`를 변경하여 React 프로덕션 빌드를 만들 때 사용), `webpack.optimize.UglifyJsPlugin`(프로덕션을 위한 Uglify/Minification을 하기 위해 사용) 등을 사용하게 됩니다.

## Webpack의 빌드 설정

Webpack에서 초심자들이 가장 난해하게 느끼는 부분이 Webpack의 설정과 구동입니다. 특히 Webpack은 사용 방법이 커맨드 라인, 설정 파일, 내부 명령형 API 세가지로 다양한 데 비해 문서나 기능의 완성도는 조금씩 떨어지는 감이 있습니다. 또한 각 API마다 기능이 조금씩 차이가 있기도 합니다. 이러한 이유로 처음 사용에 어려움을 느낄 때가 많은데, 어쨌든 가장 추천하는 방법은 `webpack.config.js`같은 설정 파일을 이용하는 것입니다. 자세한 설정 방법은 문서를 참고해 봅시다.

[Webpack 공식 설정 문서](http://webpack.github.io/docs/configuration.html)

웹팩의 설정은 방대하기 때문에 글로 설명하는 것보다는 실제로 경험해보는 것이 도움이 될 것 같습니다. Webpack 프로젝트에서는 설정의 어려움을 고려해서인지 수많은 [기능 별 예제](https://github.com/webpack/webpack/commit/8afbfe13e83f1d4ef06356a5f2a9a9d6d2c446e1)들을 가지고 있습니다. 또한 [React 앱 보일러플레이트들](https://github.com/search?utf8=%E2%9C%93&q=react+boilerplate)을 참고하는 것도 하나의 방법입니다.

### Webpack 빌드 설정 전략

Webpack의 빌드 설정은 앱의 형태에 따라서 변해야 합니다.

웹사이트에서 AMD 모듈을 사용하는 경우라면, 번들을 페이지에 따라 split하거나 React를 vendor 의존성 패키지로 분리 할 수도 있습니다. 일반적으로 CommonJS/ES 모듈을 이용하는 React SPA 앱이라면 네트워크 요청을 줄이기 위해 하나의 파일로 번들링합니다.

비 JS(css, 이미지 등) 의존성에 대해서 생각하는 것도 중요한데, 캐싱 전략이 다르거나 다른 업데이트 주기를 가진 의존성(i.e. 이미지, json 등)까지 함께 뭉쳐버린다면 매번 사용자는 배포 이후 새로운 번들을 받아야 해서 캐시 혜택을 받지 못하게 되는 점을 생각해봐야 합니다. 메인 비즈니스/UI 로직을 가지고 있는 모듈과 비슷한 업데이트 주기를 가지고 있거나, 비-JS 모듈의 크기가 작다면 그냥 하나로 뭉쳐 버리는 것이 개발의 편의성 측면에서 유리할 것입니다.

## Webpack 기반의 브라우저 테스트: Karma-Webpack

React 앱을 Webpack으로 빌드하는 패스를 택했다면, 역시 브라우저측의 빌트인과 DOM이 연관된 테스트가 문제입니다. Jest를 이용해 JSDOM 기반의 테스트를 하는 방법과 karma-webpack을 이용한 테스트를 하는 두가지 방법이 있는데, Jest에 대해서는 Jest 공식 문서에 자세히 나와 있으므로, karma-webpack에 대해서만 간단히 설명하겠습니다.

Karma 자체에 karma-webpack 플러그인을 연동해서 사용하는 방식이지만, 소스를 모듈 번들러로 빌드하게 되므로 모든 면에서 번들러를 신경써야 하는 점이 단점입니다. Karma 또는 Webpack 쪽의 테스트 플러그인을 추가할 때마다 작동 여부를 확인하기 전까지 벌벌 떨어야 하지만, 브라우저 기반 테스트이므로 신뢰도가 JSDOM 기반의 테스트보다 높다는 장점이 있습니다.

모듈의 수가 많다면 필연적으로 테스트 스위트를 하나의 번들로 구성할 수 밖에 없습니다. 그러지 않는다면, 각 테스트 모듈의 수만큼 O(n)으로 빌드 속도가 늘어납니다. 이에 대해서는 karma-webpack 공식 문서에 써져 있습니다. 하지만 이렇게 빌드를 하면 테스트 컨텍스트가 격리되지 않는 심각한 문제가 있습니다. (Flux의 예를 들자면, 액션으로 변경된 store가 다음 테스트에서도 공유되는 상황이 이어집니다!)

Mocha를 사용하면 Chai와 Sinon과 같은 테스트 헬퍼를 사용하게 될 가능성이 높은데, 이런 것들은 Karma 플러그인으로 넣는 것이 좋습니다. Sinon의 경우 정적 분석이 안 되는 문제로 Webpack으로 번들링이 되지 않습니다. 이런 여러가지 현실적인 문제 때문에 프로젝트가 브라우저 기능에 크게 의존하지 않는다면 (웹소켓 클라이언트 테스트가 필요하다든지 웹 워커 테스트가 필요하다든지), Jest를 사용하는 것을 권장합니다.

## 함께 읽기

Webpack의 일반적인 설정 방식과 관련 플러그인들을 설명한 글입니다. 거의 베스트 프랙티스이니, 잘 모를 때는 이를 따라서 하면 좋을 것 같습니다.

http://webpack.github.io/docs/list-of-hints.html
