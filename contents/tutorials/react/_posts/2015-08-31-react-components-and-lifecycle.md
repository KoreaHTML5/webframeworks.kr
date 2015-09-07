---
layout : tutorials
title : React 컴포넌트와 컴포넌트 라이프사이클
category : tutorials
subcategory : intro
summary : React에 사용자에게 노출되어 있는 API 중 가장 중요한 것이 컴포넌트 API와 컴포넌트 라이프사이클 메서드입니다. 사용자는 이를 통해 앱의 뷰 로직 플로우를 컨트롤할 수 있습니다. 이 글에서는 React 컴포넌트에 대해 알아보고, 컴포넌트 라이프사이클이 어떻게 작동하는지, 컴포넌트 API를 어떻게 사용해야 하는지에 대해 알아봅니다.
permalink : /tutorials/react/components-and-lifecycle
tags : javascript react
author : sairion
---

# React 컴포넌트와 컴포넌트 라이프사이클

React는 [이전 글](/tutorials/react/getting-started/)에서 컴포넌트로 뷰를 작성한다고 설명했습니다. 그러면 이제 본격적으로 컴포넌트를 어떻게 작성하고, React에서 제공하는 API들은 무엇인지 알아보도록 하겠습니다.

## React 컴포넌트 클래스를 작성하는 법: 클래식과 새로운 API

사용자가 작성하는 React 컴포넌트 클래스는 대문자로만 작성해야 하며, 소문자로 시작하는 컴포넌트 이름은 모두 HTML 엘리먼트로 간주됩니다 (따라서 custom element를 사용하는 것은 현재 시점에서는 어렵습니다).

React 컴포넌트는 여러가지 방법으로 작성할 수 있습니다. 대표적인 두가지를 소개합니다.

1. ES5 스펙 API를 이용하는 'Classic' 컴포넌트 클래스: `React.createClass(spec)` 생성자

2. 새로운 컴포넌트 클래스: `React.Component`의 상속

`React.Component`를 이용한 새로운 컴포넌트 클래스는 `React 0.13.0-beta-1`에서 처음 등장했습니다 ([자세한 소개 글](https://facebook.github.io/react/blog/2015/01/27/react-v0.13.0-beta-1.html)). 전체적으로 봤을 때 기능상의 큰 차이가 있는 것은 아니며, 클래식 API도 향후 deprecate되는 것이 아니라 계속 유지될 예정이므로 어떤 쪽을 사용해도 무방합니다. 하지만 알아둬야 할 차이점들이 존재합니다.

`React.createClass()` 함수에 스펙 오브젝트를 넣었을 때, 구현한 컴포넌트 API 함수들과 라이프사이클 메서드들은 자동적으로 인스턴스에 bind됩니다 (이것을 autobind라고 하며, 원래는 별도의 정적 멤버 함수가 존재하다가 차후 기본 기능으로 자리잡았습니다). 이렇게 bind가 되면 일일히 `Function#bind` 또는 `Function#apply`를 이용해 바깥 스코프의 this를 런타임에서 조작하거나, 선언시에 읽기 힘들게 컴포넌트 API 함수들을 bind할 필요가 없어집니다. 하지만 autobind는 `React.createClass`를 통해 생겨난 객체가 많아질 때 그만큼 [초기 기동 시간을 저하](https://twitter.com/cpojer/status/632282293793484801)시킬 수 밖에 없고, React는 클래스 라이브러리가 아니라 뷰 라이브러리이니 만큼, 더 원래 기능을 잘 할 수 있는 네이티브 API로 기능을 이전하는  것이기도 합니다. 이것이 Plain class (Plain function)를 이용하는 클래스 API가 등장한 이유입니다.

### 차이점 1: Autobind의 여부

클래식 API를 사용한 컴포넌트 클래스의 형태는 다음과 같습니다.

```javascript
var React = require('react');

var Hello = React.createClass({
    render: function() {
        return <div>Hello</div>;
    }
});
```

그리고 `React.Component`를 이용한 컴포넌트 클래스의 형태는 다음과 같습니다.

```javascript
import React, {Component} from 'react'; // ECMAScript 모듈 임포트: JSX가 차후 React.createElement(...)
                                        // 으로 변환되므로 이렇게 `React`또한 임포트해야 함

class Hello extends Component {
    render () {
        return <div>Hello</div>;
    }
}
```

새 언어 명세를 사용하는 것 외에는 별로 다른 게 없어 보입니다.

약간 작위적인 예제지만, 'Hello'를 눌렀을 때 'World'로, 'World'를 눌렀을 때 'Hello'로 변하는 인터랙션을 추가해 봅시다. [jsfiddle](https://jsfiddle.net/sairion/e2v1rgkj/)

```javascript
class Hello extends React.Component {
    helloClicker (e) {
        var targ = e.target;
        targ.textContent = this.helloText(targ.textContent);
    }
    helloText (text) {
        return text === 'Hello' ? 'World' : 'Hello';
    }
    render () {
        return <div onClick={this.helloClicker}>Hello</div>;
    }
}

React.render(<Hello />, document.getElementById('container'));
```

Hello를 눌렀을 때, `Uncaught TypeError: Cannot read property 'helloText' of undefined` 같은 에러가 콘솔에서 뜨는 것을 볼 수 있습니다. 전형적인 이벤트 핸들러가 `this`가 개체에 바인딩되지 않았을 때 생기는 문제입니다. 클래식 API로 선언한 컴포넌트 클래스에서는 this가 자동으로 바인딩되므로, 이런 문제가 생기지 않습니다.

```javascript
class Hello extends React.Component {
    helloClicker (e) {
        var targ = e.target;
        targ.textContent = this.helloText(targ.textContent);
    }
    helloText (text) {
        return text === 'Hello' ? 'World' : 'Hello';
    }
    render () {
        return <div onClick={this.helloClicker.bind(this)}>Hello</div>;
    }
}

React.render(<Hello />, document.getElementById('container'));
```

따라서 일반적으로 자바스크립트를 작성하듯, 다음과 같이 `this.helloClicker.bind(this)`를 클릭 핸들러로 고쳐주면 됩니다. 이제 잘 작동하는 것을 볼 수 있습니다. [jsfiddle](https://jsfiddle.net/sairion/e2v1rgkj/1/)

### 차이점 2: 믹스인의 사용

그 외의 중요한 차이점으로는 `React.Component` API는 mixin을 사용하지 못한다는 점이 있습니다. 한 때 mixin의 단점(불분명한 인풋과 아웃풋 등)들을 들어 [React에서 mixin을 모두 제거하자는 움직임](https://medium.com/@dan_abramov/mixins-are-dead-long-live-higher-order-components-94a0d2f9e750)이 일기도 했지만, 현재는 mixin도 여전히 유용하다는 관점이 일반적인 상황입니다. 그래서 새 API의 도입이 약간 주춤하긴 했지만, `React.Component` API를 사용하는 경우 HOC(Higher Order Component) 또는 ES7 데코레이터를 제공하는 [라이브러리](https://github.com/rackt/react-redux/blob/301730aed92260ab45b979d8faabc51987603f3c/README.md#support-for-decorators)가 간혹 있습니다. 만약 mixin이 중요한 업데이트 로직을 지배하는 라이브러리 (i.e. [Reflux](https://github.com/reflux/refluxjs))를 사용한다면, 클래식 API를 이용합시다.

일단 이 글에서는 일반적으로 많이 사용되고 있는 클래식 컴포넌트를 기준으로 설명합니다.

## 컴포넌트 스펙

컴포넌트 클래스는 스펙 오브젝트, 또는 클래스를 작성함으로써 작성할 수 있다는 것을 위에서 설명했습니다. 그렇다면 스펙에 들어갈 수 있는 것은 무엇이 있을까요?

### `mixin`

([공식 문서](https://facebook.github.io/react/docs/reusable-components-ko-KR.html)) `mixin`은 일반적으로 많이 사용하는 믹스인과 거의 같습니다만, 스펙 오브젝트에 배열로 기술하며, 요소들은 오브젝트 또는 오브젝트를 반환하는 함수 호출문들이 들어가 있으면 됩니다. mixin은 순서대로 불린다는 점, 믹스인 안의 스펙 메서드들과 라이프사이클 메서드들이 체이닝되어 불린다는 점은 문서에 써 있지만, 그 라이프사이클 메서드들이 어떤 식으로 체이닝되어 불리는지에 대해서는 써 있지 않습니다. 믹스인은 라이브러리에서도 많이 이용하지만, 문서에서 설명하듯 Cross-cutting concerns를 해결하기 위해 직접 작성하게 될 때도 자주 있기 마련이므로, 이런 문제에 대해 잘 알고 있어야 합니다.

`getInitialState()`의 경우 여러 개의 함수가 있을 경우, 그 최종 값은 머지됩니다. 즉 스펙에서 (편의상 약어 사용) `gIS() => { a: 1 }`를 쓰고 믹스인에서 `gIS() => { b: 1 }`를 썼다고 합시다. 그러면 최종적으로 사용자가 기대하게 되는 값은 `gIS() => { a: 1, b: 1}`이 됩니다. 하지만 유의할 점은 key가 중복되는 경우 invariant error를 던진다는 점입니다.

### `render()`

위에서 사용한 `render ()` 함수는 최소한으로 구현해야 하는 인터페이스이며, 컴포넌트가 어떤 `ReactElement`를 반환해야 하는지를 기술합니다. 처음에 실수하기 좋은 부분은, 하나의 Root node만을 반환해야 한다는 점입니다. 즉 `<div></div><div></div>` 를 반환할 수는 없고, `<div></div>`를 반환하는 것만 가능합니다. 여러 개의 엘리먼트를 반환해야 한다면, `<div />` 등의 Wrapper 엘리먼트로 한번 싸 주는 것이 보통입니다.

### `statics`

`statics`는 클래식 API에서 필요한 스펙 프로퍼티로, 정적으로 사용해야 하는 API를 표현할 때 사용합니다. (`React.Component` 를 서브클래싱하는 경우에는 ES2015의 [`static` 키워드](https://github.com/lukehoban/es6features/blob/d1db5467d5540cb05ff08871b0d68a670c2c337f/README.md#classes)를 이용해 표현하면 됩니다) 일반적인 OOP의 정적 멤버/함수처럼 인스턴스를 `this`로 참조할 수 없어 제한적이며 직접 사용할 일이 많지는 않은 것 같습니다. 외부 라이브러리 인터페이스로 사용하는 경우가 종종 있습니다.

### `getInitialState()` 와 `getDefaultProps()`

이 스펙 프로퍼티들은 컴포넌트가 마운트하기 전 기본 `state`와 `props` 값을 지정하며, 오브젝트 또는 `null`을 반환하면 됩니다 (기본값은 `null`) [신경써야 할 점](https://facebook.github.io/react/tips/props-in-getInitialState-as-anti-pattern-ko-KR.html)은, `getInitialState()`에 Parent에서 받은 props를 주입하는 것에 대해서는 언제나 고려해 볼 필요가 있다는 것입니다.

### `propTypes`

React에서는 `propTypes` 와 같은 스펙도 존재하는데, 이는 컴포넌트의 상위 컴포넌트가 주입하는 prop의 type를 런타임에서 체크해주는 것입니다. 이를 통해 안전한 컴포넌트 작성에 큰 도움을 받을 수 있습니다. (자세한 API는 [공식 문서](https://facebook.github.io/react/docs/reusable-components-ko-KR.html#prop-validation)를 참조하시길 바랍니다)

나머지 라이프사이클 인터페이스들은 아래에서 설명하겠습니다.

## 컴포넌트 라이프사이클 API

라이프사이클 API는 위의 스펙 오브젝트에 메서드를 구현함으로서 작동합니다. 약간 이름이 길다고 느낄 수도 있는데, 네이밍에 비교적 일관성이 있어서 익숙해지면 쉽게 외울 수 있을 것 같습니다. 컴포넌트 라이프사이클은 언제나 단순히 기대하는 것처럼 작동하지는 않으므로, 스펙 문서를 잘 읽어둘 필요가 있습니다. 의문 사항이 있으면 공식 문서를 작업할 때마다 참고합시다.

라이프사이클 API들은 그 시제 (will, Did)에 따라 다른 값들을 주게 됩니다. 가령, `componentWillMount` 안에서의 `this.state`는 지금의 `state`일 테고, 인자로 주어지는 `state`는 미래의 `state`이게 됩니다.

모든 라이프사이클 메서드들이 인자 값을 주지는 않으므로, [공식 문서](https://facebook.github.io/react/docs/component-specs-ko-KR.html)의 인자 시그니쳐를 참고합시다.

(라이프사이클 API들은 세번째 인자 값으로 context라는 값을 주기도 합니다. Context는 문서화되어 있지 않지만 라이브러리 제작자들이 많이 사용하고 있는 특별한 속성입니다. 하지만 언제 사라지거나 API가 바뀔 지 모르므로 사용에 있어서는 신중을 가해야 합니다.)

### `componentWillMount()`: 마운트 직전 한번

마운트 직전에 불리는 메서드이며, 마운트 직전에 하고 싶은 것들 (i.e. 방문자가 어떤 페이지를 방문했는지 구글 애널리틱스에 신호)을 할 수 있습니다. 당연하지만, 이 시점에서 DOM 엘리먼트의 리퍼런스를 획득할 수는 없습니다.

### `componentDidMount()`: 마운트 직후 한번

`componentDidMount()`는 하위 컴포넌트들에서 상위 컴포넌트의 순서로 불리며, 이 시점부터는 DOM 엘리먼트의 리퍼런스를 획득할 수 있습니다.

### `componentWillReceiveProps(nextProps)`: 업데이트 직전

예를 들자면 `componentWillReceiveProps ()`같은 것은 앱 시작 초기에는 작동하지 않으므로 (컴포넌트는 props를 받을 것이다..? 그러면 props가 주입되는 시점에는 작동하겠지!) 하고 생각하면 이상하게 작동하는 것을 보게 될 것.

### `componentWillUpdate(nextProps, nextState)`: 업데이트 직전

새로운 `props` 또는 `state`가 반영되기 직전 새 값들을 받습니다. 이 메서드 안에서 `this.setState()`를 사용하면 무한 루프가 일어나게 되므로, 사용할 수 없습니다.

### `componentDidUpdate(prevProps, prevState)`: 업데이트 직후

DOM에 update가 반영된 직후 불립니다.

### `componentWillUnmount()`: 언마운트 직전 한번

상위 컴포넌트가 언마운트를 했을 때, 또는 상위 API를 통해 언마운트가 되었을 때 불리며, 컴포넌트 안의 로직을 클린업해야 할 때 필요합니다. 특히 내부에서 타이머를 작동시키거나 비동기 API를 호출하고 있을 때 클린업을 하기에 유용합니다.

### `shouldComponentUpdate(nextProps, nextState) => boolean`: 업데이트 직전의 직전 (`props`, `state` 모두 해당)

라이프사이클 메서드 중 유일하게 값을 반환해야만 하는 함수이며, `Boolean {true | false}` 값을 반환하면 됩니다. 최적화 또는 update의 side-effect로 인한 재 렌더를 방지하기 위해 사용하며, React는 상위 컴포넌트가 re-render를 할 경우 하위 컴포넌트들도 모두 새로 render를 하므로 상위 컴포넌트에서 최적화를 실행하게 될 때가 많습니다. 만약 `shouldComponentUpdate()`의 로직이 너무 복잡해진다면, `props`와 `state`에 대한 리팩터링을 해야 할 때인지 의심해 봐야 할 필요가 있습니다.

## 라이프사이클 API의 순서와 사이클

이에 대해 간단히 정리되어 있는 [gist](https://gist.github.com/fisherwebdev/8f6cb895348c587c8f1e)가 있습니다.

그리고 제가 어떤 순서로 불리는지 라이브로 확인할 수 있는 [jsfiddle](https://jsfiddle.net/sairion/jejt34by/3/)을 만들었으니 확인하세요.

[Shallow render](http://facebook.github.io/react/docs/test-utils-ko-KR.html#shallow-rendering)(얕은 렌더링)을 할 경우는 약간 차이가 있습니다. Shallow render를 간단하게 설명하자면, 컴포넌트를 테스트 용도로 한 레벨 깊이에서만 Render하는 것이며, 이는 브라우저 DOM 호스트 오브젝트 또는 JSDOM과 같은 가상환경이 없어도 작동하는 이점이 있습니다. Shallow render에 대해서는 잘 설명되어 있는 [gist](https://gist.github.com/jondlm/514405bea50fad6fd905)가 있으니 참고하세요.

## 컴포넌트 API

([공식 문서](https://facebook.github.io/react/docs/component-api-ko-KR.html))
그 외 중요한 API로서 알아야 할 것은, 컴포넌트 스펙 프로퍼티 또는 컴포넌트 라이프사이클 메서드 안에서 `this`로 접근하는 인스턴스의 메서드들입니다. 사실상 `this.setState()`만 쓴다고 생각하면 되며 나머지는 나중에 '이런 건 없나...?' 하고 찾아 보면 됩니다. `setState()` 외에는 글을 쓰는 시점에서는 대부분 없어질 예정이고, bad practice로 간주되어 사용이 권장되지 않습니다.

### `setState(nextState, callback)`

비동기 배치 업데이트 함수로, state의 업데이트는 this.state에 바로 값을 assign하는 것이 아니라 setState를 통해서만 해야 합니다. 비동기 함수이기 때문에 당연히 콜백이 있습니다. 첫번째 인자로 함수 `function (previousState, currentProps) {}` 를 넣어 업데이트 로직을 넣는 것도 가능합니다. setState 후에는 업데이트가 진행되지만, `componentWillReceiveState()` 같은 라이프사이클 메서드는 없다는 것을 복기할 필요가 있습니다. setState 직후의 로직은 콜백 함수로, 라이프사이클 메서드로는 `componentWillUpdate()`에 작성하면 됩니다.

### `forceUpdate(callback)`

만약 state나 prop의 깊은 값이 비 명시적으로 바뀌었다면 React에서 이를 감지할 방법은 없습니다. Backbone 등의 외부 라이브러리를 이용해 staet를 바인딩했을 때 이런 일이 흔한데, 이럴 때는 `forceUpdate()` 메서드를 사용하여 직접 업데이트를 해야 합니다. React를 직접 지원하는 Flux 라이브러리들을 이용하면 이런 메서드를 쓸 일은 거의 없습니다.

### `getDOMNode()`

마운트되어 있는 컴포넌트의 DOM 엘리먼트 리퍼런스를 받기 위해 사용하며, Top Level API인 `React.findDOMNode(component)`로 대체되었으니 가능하면 사용하지 않는 것이 좋습니다.
