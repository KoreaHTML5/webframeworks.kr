---
layout : tutorials
title : React 앱의 데이터 흐름
category : tutorials
subcategory : setlayout
summary : React 앱의 단방향 데이터 흐름이 props와 state로 어떻게 표현되는지, props와 state 속성을 어떻게 사용하는지  심도깊게 알아봅니다.
permalink : /tutorials/react/react-dataflow
tags : javascript react
author : sairion
---

## One-way Data Flow

React 프로젝트의 메인 페이지를 보면, "one-way reactive data flow" 라고 설명이 되어 있습니다. 즉, React의 데이터 흐름은 단방향이고, Reactive하다는 특징을 가지고 있습니다. 좀 더 설명하면, 이전 글에서도 설명했듯이 데이터는 Parent로부터 Child로 흐르며, 데이터의 갱신에 반응하여 뷰 또한 갱신됩니다.

## Components Relationship

### Parent/Children
DOM의 parent-children 관계와 거의 비슷하며, React 컴포넌트들은 상위 컴포넌트, 하위 컴포넌트가 존재합니다. 다만 DOM의 `node.parentNode`와 같은 API는 없으므로, 하위 컴포넌트는 상위 컴포넌트에 대해 거의 알 수 없습니다.

### Owner / Ownee
`ReactOwner`는 ownee들의 `ref`를 획득할 수 있는 상위 컴포넌트입니다. 내부를 깊게 공부하다보면 나오는 토픽이긴 하나, 일반적인 애플리케이션 개발자가 알아야 할 정도는 아닙니다.

## Props

`props`는 parent로부터 받는 데이터이며 (자식 컴포넌트의 입장에서는) 불변성 데이터, 즉 값을 바꿀 수 없는 데이터라고 생각해도 됩니다 (`this.setProps()`와 같은 메서드가 있긴 하나, deprecated method이며 사용이 권장되지 않습니다). 아래의 *패턴: Smart and Dumb Components*에서 간략히 설명하겠지만, 많은 mutable state(변경 가능한 값)들은 Prop으로 대체 표현되거나 한 곳으로 몰아 넣을 수 있습니다.

props는 거의 대부분의 데이터를 표현하는 중요한 방법으로, React 라이브러리의 사용자는 `state`보다는 `props`의 사용에 더 익숙해져야 할 것입니다. `props`로 표현된 데이터는 이전 글에서 설명했듯이, 마운트와 업데이트 시 `React.Proptypes` API로 런타임 타입 체크가 가능해 잘못된 상황을 빨리 감지할 수 있는 이점도 있습니다.

### Controlled Components / Uncontrolled Components

폼을 구성하는 HTML 엘리먼트들(i.e. `<input>`, `<textarea>` `<option>`)은 React의 reactive data flow의 관점에서, 사용자의 입력을 통한 뷰 변경과 데이터의 변경이 동시에 일어나는 특수한 엘리먼트입니다. React에서는 Control이라는 개념으로 이를 제어합니다. 굉장히 단순(러프)하게 설명하자면, `value` prop이 주어진 엘리먼트들은 React에서 값의 변경을 제어하며, Controlled Component라고 칭해집니다. 자세한 정보는 역시 [공식 문서](https://facebook.github.io/react/docs/forms-ko-KR.html)를 참고합시다.

### Special property: `props.children`

props 중의 특수 프로퍼티로, 이 프로퍼티를 이용하여 자식 ReactElement를 다루거나 자식 프로퍼티의 DOM 엘리먼트의 위치를 기술할 수 있습니다. Wrapper 컴포넌트 등에서 많이 사용하게 됩니다.

### Special non-DOM attributes

([공식 문서](https://facebook.github.io/react/docs/special-non-dom-attributes.html))
`key`, `ref`, `dangerouslySetInnerHTML`는 다른 Props와 같이 HTML 어트리뷰트처럼 기술하지만, prop은 아닙니다. 즉, 자식 컴포넌트에서 `this.props.key` `this.props.ref` 등으로 접근할 수 없는, 휘발되어 버리는 특수 값이라는 것입니다. `key`는 튜토리얼의 초반부에서 비교조정 알고리즘을 설명하면서 다뤘으므로 생략합니다.

#### `ref`

`ref`는 자식 엘리먼트를 상위 컴포넌트에서 `this.refs` 오브젝트를 통해 named property로 접근할 수 있게 해주는 키 값입니다.

#### `dangerouslySetInnerHTML`

`dangerouslySetInnerHTML`는 그 이름이 암시하듯, 임의의 html 스트링을 통해 자식 html을 표현할 수 있으며 어쩔 수 없는 특수한 상황에서 사용합니다 (`svg` 스트링의 표현, html 태그가 포함된 국제화 스트링의 표현, 서버사이드 렌더링 시 인라인 `<script>` 엘리먼트의 텍스트 표현 등).

## State

State는 컴포넌트 안에서 변경이 가능한 데이터입니다. 일반적으로 컴포넌트 안의 state는 최소한으로 유지하고, 가능한 한 상위 컴포넌트로 이동해야 할 필요가 있습니다. 이는 변경 가능한 데이터의 관리가 무척 어렵기 때문입니다. (데이터를 불변 값으로 표현하는 것의 이점은 [이 글](http://gamecodingschool.org/2015/06/25/%EC%99%9C-%EB%B3%80%EC%88%98%EA%B0%80-%EB%82%98%EC%81%9C%EA%B0%80/)을 참고하시기 바랍니다)

`state`가 비록 변경이 가능한 값이긴 하나, 엄밀히 말하자면 `this.state` 자체가 mutable한 값은 아닙니다. 데이터의 갱신은 반드시 `setState(nextState)` 비동기 함수를 통해서 해야 합니다.

### State 사용의 예

State는 render를 통한 지속적인 동기화가 필요한 경우 데이터를 표현하기 좋습니다. 가령 1초마다 뷰가 업데이트가 되는 아날로그 시계를 만들어야 한다면, `setInterval()`과 같은 Timer API로 1초마다 변경된 각도를 `setState()`에 반영함으로서 구현이 가능할 것입니다.

하지만 우리가 시침과 분침과 초침을 만들어야 한다면, 그렇게 하면 안된다는 것을 자연히 깨닫게 됩니다 (세개의 타이머를 동시에 돌리는 것에 대해 아무런 거부감이 없는 특이한 사람이 아니라면 말이죠). `setState()` 함수는 는 상위 시계 컴포넌트 `<Clock />`으로 자연히 이동하게 되고, 시침, 분침, 초침은 props로 `<Minute now={this.state.now} />` 와 같이 상위 컴포넌트의 시간 `state`를 받게 설계를 하면 됩니다.

## 이게 끝입니다!

props와 state의 설명은 이정도면 된 것 같습니다.

하지만 처음 React를 접하시는 분들은 앱을 만들다 보면 궁금한 점들이 많이 생길 수 있습니다. 예를 들면,

- 데이터 값의 변화로 Parent 컴포넌트에 데이터의 갱신 여부를 전달하는 방법은 무엇이 있을까요?
- 수많은 단계를 거쳐야 하는 컴포넌트들도 계속 props를 주입해 내려야 할까요?

위와 같은 의문점들이 생기기 마련입니다. 개발 편의성과 실질적인 데이터 흐름의 요구사항을 만족시키기 위해서는 조금 더 공부해야 합니다 (공부에는 끝이 없죠). 그래서 일반적으로 React 앱을 작성하면 많이 구성하게 되는 데이터 흐름 방식을 정리해 보았습니다.

## 패턴: Smart and Dumb Components

[Smart and Dumb Components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0) 라는 에세이에서 [Dan Abramov](https://twitter.com/dan_abramov)는 React 컴포넌트들을 크게 두가지로 나눌 수 있다고 정의했습니다. 그것은 **Smart Component**와 **Dumb Component**입니다. 개념을 처음 접하는 분들은 조금 의아할 수 있겠지만, 일정 이상 규모의 React 애플리케이션을 작성해 보신 분들은 공감하실 분류입니다.

### Dumb Components

Dumb Components들은 Parent 컴포넌트에 의해 주어진 `props`만을 보여주고, 자신의 `state`를 거의 가지고 있지 않습니다. 아마 State를 줄이기 위해 충분히 노력했다면, 대부분의 컴포넌트들이 이런 형태를 가지게 될 것입니다.

사용자 정보를 수정하는 Form을 예시로 들어봅시다. Form 안의 input들은 모두 Dumb Component들로 구성해야 할 것입니다. 어떤 사용자들은 경우에 따라 일정 `<input />` 엘리먼트들을 보여주지 않거나, `disabled` 어트리뷰트를 줘야 할 수도 있습니다. 사용자의 정보에 대해 모든 input 컴포넌트가 알고 있어야 하는 것은 비효율적이므로, 자연히 상위 Form 컴포넌트가 하위 컴포넌트들으로 `props`를 주입해 컨트롤하는 형태로 구성될 것입니다. 그리고 하위 컴포넌트들을 컨트롤하는 것이 Smart Component입니다.

### Smart Components

위의 Form 예시를 계속 확장시켜 봅시다. 그렇다면 사용자 정보는 어디서 올까요? 물론 최상위 DOM 엘리먼트로부터 전달해 받을 수도 있습니다. 하지만 그것은 비효율적일 뿐더러, 수많은 상관없는 `props`들의 전달 행위로 인해 코드의 가독성을 떨어뜨릴 수 있습니다. 그래서 보통 `Flux` 아키텍쳐 구현 라이브러리를 이용합니다 (Flux를 잘 모르겠다면, [공식 튜토리얼](http://facebook.github.io/flux/docs/todo-list-ko-KR.html#content)을 참조하세요).

```javascript
var TextField = React.createClass({
    render() {
        return (
            <div className="text-field">
                <label>
                    <span>{this.props.label}</span>
                    <input {...this.props} />
                </label>
            </div>
        );
    }
});

var UserForm = React.createClass({
    mixins: [
        FluxStoreMixin(...) // Flux Store에서 `this.state.user`에 데이 연결
    ],
    // 값이 변할 때마다 state에 저장해 놓았다가 나중에 사용
    // i.e. localStorage에 임시 값을 저장, GA에 값을 전송, ...
    handleChange (e) {
        var nextState = {};
        var key = e.target.dataset['sync-id'];

        nextState[key] = e.target.value;
        this.setState(nextState);
    },
    render() {

        return (
            <form action="/some/where">
                <TextField label="이름" onChange={this.handleChange}
                           defaultValue={this.state.user.name}
                           data-sync-id="name" />
                <TextField label="Github ID" onChange={this.handleChange}
                           defaultValue={this.state.user.connections.github.id}
                           data-sync-id="gh-id" />
            </form>
        );
    }
});
...
```

굉장히 간단한 예제를 작성해 보았습니다만, 위와 같은 경우 UserForm은 Flux Store로부터 유저의 데이터를 받고, `<TextField />` 컴포넌트들에 prop으로 값들을 내리는 Smart Component이며, TextField 컴포넌트는 그것이 무엇인지 모르는 상태에서 단순히 값을 받아 연결하고, 표시하기만 하는 Dumb Component 입니다.

## 패턴: 상위 컴포넌트와 대화하기

하위 컴포넌트의 데이터 갱신에 따라 상위 컴포넌트를 업데이트해야한다면 어떻게 해야 할까요? 위와 같이 Flux 라이브러리를 사용하는 법도 있지만, 대부분의 경우는 함수를 prop으로 내리는 것이 정답에 가깝습니다.

```javascript
var Keypad = React.createClass({
    getInitialState() {
        return {
            input: ''
        };
    },
    handleInput(e) {
        this.setState({ input: this.state.input + e.target.dataset.value });
    },
    render() {
        return (
            <input value={this.state.input} disabled />
            <KeyInput onInput={this.handleInput} />
        )
    }
});

var KeyInput = React.createClass({
    render() {
        <div>
            <button data-value="1" onClick={this.props.handleInput}>1</button>
            <button data-value="2" onClick={this.props.handleInput}>2</button>
            ...
        </div>
    }
});
```

위의 예제는 간단한 입력을 위한 키패드를 구현한 것입니다. `KeyInput` 하위 컴포넌트에 클릭 핸들러를 전달하여, 상위 컴포넌트에서 `setState()`를 하면 상위 컴포넌트에서 값을 업데이트할 수 있습니다.

## Tips: class 어트리뷰트의 컨트롤

css 클래스를 계층적으로 적용시키고 싶을 때 사용하는 모듈로 [`classnames`](https://www.npmjs.com/package/classnames)가 있습니다. 공식 패키지는 아니나, 공식문서에서 추천하는 패키지입니다.

```javascript
classnames('a', 'b', 'c'); // => 'a b c'
classnames({ a: true, b: false, c: null }); // => 'a'
classnames('some-css-class', this.props.className); // => 'some-css-class' 와 추후 `className` prop 값을 합친다`
```

## Tips: props로 주어주는 객체의 컨트롤

```
...
render () {
    // this.props => { first: 1, second: 'second' }
    return <SomeChild {...this.props} second={2} /> // => props: { first: 1, second: 2 }
}
...

```

주로 오브젝트를 조작하거나 합칠 때 많이 사용하는 방법은 `React.addons.update` 함수 또는 Underscore/Lodash의 `_.extend` 함수를 사용하는 것입니다. 그 외에 `...` [JSX Spread Attribute](https://facebook.github.io/react/docs/jsx-spread.html)를 이용하는 법도 있습니다. Spread Attribute는 좀 더 마법같은 prop으로, 아직 표준은 아니지만 Babel등의 트랜스파일러를 이용하면 사용할 수 있습니다 (문서에 언급하고 있긴 하나, 표준화를 시도하고 있는 [Object Spread Property](https://github.com/sebmarkbage/ecmascript-rest-spread)도 있습니다).
