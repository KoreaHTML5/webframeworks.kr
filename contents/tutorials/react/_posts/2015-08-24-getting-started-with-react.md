---
layout : tutorials
title : React 시작하기
category : tutorials
subcategory : setlayout
summary : React가 어떤 동기에 의하여 만들어졌고, 어떤 것을 해 주는 라이브러리인지, 그리고 어떤 것은 아닌지 알아봅니다.
permalink : /tutorials/react/getting-started
tags : javascript react
author : sairion
---

# React 시작하기

이 글을 읽기 시작하시는 분들 중 React가 무엇인지 들어보신 분도 있고, 아닌 분도 있을 것 같습니다. 이 글에서는 React가 어떤 동기에 의하여 만들어졌고, 어떤 것을 해 주는 라이브러리인지, 그리고 어떤 것이 아닌지에 대해 알아볼 것입니다. 일종의 컨텍스트를 제공하는 글이라고 보셔도 될 것 같습니다.

## 페이스북은 왜 React를 만들었는가

페이스북은 왜 React를 만들었을까요? 이는 [React 공식 문서](http://facebook.github.io/react/docs/why-react-ko-KR.html)에 간략히 정리되어 있고,
(전) React 팀이었던 [Pete Hunt가 쓴 글](http://facebook.github.io/react/blog/2013/06/05/why-react.html)에 조금 더 자세히 써져 있습니다.  이 중 공식 문서의 내용을 조금 인용할까 합니다.

React의 문서에서 React는 "지속해서 데이터가 변화하는 대규모 애플리케이션을 구축하기" 위하여 만들어졌다고 써져 있습니다.
"지속해서 데이터가 변화"한다는 것은 뭘까요? 하나의 예로, React를 사용하고 있는 페이스북 웹 앱을 생각하면 될 것 같습니다.

페이스북의 글로벌 Notification 창 (지구본), 페이스북 그룹 리스트, 댓글 창, 채팅 창 같은 인터페이스들은 시간이 지날 수록 다른 사람들이 댓글을 달거나 말을 걸면 신호에 따라
서버에서 데이터를 요청해 업데이트하고, 이에 맞춰 뷰를 변경해줘야 합니다. 예를 들어 이 컴포넌트들을 jQuery로 작성했다고 생각합시다.  보통은 `jQuery.prototype.append` 와
`jQuery.prototype.remove` 와 같은 imperative (명령형) API를 이용해 뷰 데이터를 갱신해줘야 할 것입니다. 하지만 이런 컴포넌트들이 늘어날 때마다 일일히 관리를 해 주는
로직을 짜야 하는 것은 끔찍한 일이며, 코드의 유지보수성을 빠른 속도로 떨어뜨리는 원인이 됩니다. 유지보수를 신경쓰는 개발자들은 모델 데이터를 변경하는 로직과 뷰 로직을
분리하기 위해 나만의 '뷰 데이터 관리 도구'를 어딘가에 만들어, Separation of Concern (관심사의 분리)을 달성하게 되어 있습니다. 그렇기 때문에 Backbone.js이나
Angular.js와 같은 라이브러리들이 자연히 등장한 것이죠.

MV* 라이브러리의 선조격이면서, 아직도 웹에서 가장 많이 사용하고 있는 라이브러리 중 하나인 Backbone.js의 사용방식을 보면, pub-sub 패턴으로 앱을 작성합니다. 모델이 업데이트가 되었을 때
모델을 지켜보고 있는 뷰에서 Underscore 템플릿 API (`_.template`) 또는 Mustache나 Handlebars 등의 템플릿 라이브러리들을 이용하여 템플릿을 새로 렌더링합니다. Backbone 자체는 굉장히
심플하고 작은 라이브러리지만, 적지 않은 양의 절차적 API를 이용하여 이 업데이트 과정을 기술해야 합니다. 이런 과정들을 조금 덜 불편하게 하기 위해 Marionette 등의 헬퍼 라이브러리가 나와있긴 하지만,
줄의 양이 줄어드는 정도일 뿐이고 업데이트 과정을 일반화를 하더라도, 뷰 업데이트 로직을 직접 써야 하는 건 마찬가지입니다.

React를 살펴 보면, 생각보다 public하게 사용할 수 있는 API는 몇 개 되지 않습니다. 왜냐하면 React에서 사용하는 치환형 언어인 [JSX](http://facebook.github.io/react/docs/jsx-in-depth-ko-KR.html)를 통해
어떤 형태로 뷰 데이터가 보여져야 하는지에 대해 *선언적으로 기술*하기 때문입니다 (복잡한 로직을 가진 뷰라면 현실적으로는 완전히 선언적인 코드를 짜기는 어렵지만,
어쨌든 '우리가 보고 싶은 결과물을 써 놓는다' 라는 점은 같습니다). 명령형 API에 익숙한 입문자들이 가장 많이 하는 실수 중 하나는, jQuery의 DOM 조작 API를 이용해 `render()` 함수 안에서
DOM을 조작하려고 하는 것입니다. React는 중간 과정이 아닌 결과물을 기술하는 것이기 때문에 그럴 필요가 대체로 없습니다.

이런 점들 (관심사의 분리, 선언적인 API)을 볼 때, React라는 라이브러리가 만들어진 건 굉장히 자연스러운 웹 프론트엔드 개발의 진화의 흐름이라고 볼 수 있습니다.

## React는 무엇인가: 뷰 레이어

이미 익숙한 jQuery, Backbone.js이나 Angular.js 등의 라이브러리들을  놔두고 React를 써야 할 이유가 있을까요? 개념을 분명히 해두자면, React를 쓴다고 Backbone.js이나
Angular.js를 사용하지 못하는 것은 아닙니다. 오히려 그것들을 조합해 사용하는 사람들이 많습니다. 사례로는 2013년에 칸 아카데미가 기존의 Backbone 앱의 뷰 레이어를
React로 교체해 사용한 것이 유명합니다.

React는 일반적으로 MVC, MV* 패턴에서 뷰 레이어만을 담당한다고 생각하면 됩니다. Backbone.js를 생각하면 `Backbone.View` 만이 있는 샘입니다. 하지만 React는 특별히 어떤 형태의 모델이
사용될 것인지에 대한 가정을 하지 않으므로, 아무 라이브러리나 사용해도 무방하며, 작은 앱이라면 굳이 사용하지 않아도 상관없습니다. 데이터를 서버에서 가져온다거나 (ajax 요청), 데이터들을 조작한다거나
(underscore/lodash) location에 따라 다른 컴포넌트를 마운트해준다거나 (`Backbone.Router`, `angular-route`) 하는 기능은 직접 구현하거나, 상황에 맞는 라이브러리를 사용해야 합니다. 페이스북에서는
[Flux 아키텍쳐](http://facebook.github.io/flux/)을 이용하는데, 이를 React와 함께 사용할 수 있는 [자바스크립트 리퍼런스 구현](https://github.com/facebook/flux)이 공개해 놓았습니다. 최근에는
[Redux](https://github.com/rackt/redux) 등의 다른 선진적인 Flux 아키텍쳐 구현체들의 영향을 받은 [Flux-utils](https://github.com/facebook/flux/pull/254)를 포함시키기도 했습니다
(페이스북 메인 웹앱에서 사용하는 것은 아니고, [페이스북 광고 도구에서 사용한다고](https://www.youtube.com/watch?v=9qcBlN6-qwY) 알려져 있습니다).

React를 이용한 뷰의 작성은 컴포넌트를 통해서 하게 되어 있습니다.

## React는 무엇인가: 컴포넌트를 통한 뷰 작성

React는 Reactive한 단방향의 데이터 흐름을 가지고 있습니다. Reactive하다는 것은 상태(일반적인 의미에서의 state)가 바뀌면 뷰도 함께 업데이트가 된다는 것이며, 단방향이라는 것은 한 방향으로 데이터가
흐른다는 것입니다. 상태는 상위 컴포넌트 (Owner)에서 하위 컴포넌트 (Ownee)로 흐르게 되어 있는데, 이 데이터는 React에서 *prop*이라고 지칭되며, JSX에서는 HTML의 attribute처럼 작성됩니다.
예를 들어, 쇼핑몰의 쇼핑 카트를 React로 만들기 시작했다고 생각해봅시다. ([jsfiddle](http://jsfiddle.net/3zquhfeb/))

```javascript
// 참고: 동적으로 생성되는 모델의 경우 보통은 `Array.prototype.map` 을 이용하여
// 배열 형태 모델을 작성하고, key를 배정하지만 글의 목적에 맞게 간단하게 쓰기 위하여
// 정적으로 작성합니다.
var ShoppingCart = React.createClass({
    render () {
        return <div>
            <ShoppingItem name="kimchi" available={true} />
            <ShoppingItem name="rice" available={true} />
            <ShoppingItem name="curry" available={false} />
        </div>
    }
});

// 참고: 기존 html 엘리먼트가 아닌 한, 모든 커스텀 컴포넌트들의 이름은 대문자로
// 쓰여져야 하며 지켜지지 않으면 에러가 납니다.
var ShoppingItem = React.createClass({
    render () {
        return <div>
            <div>
                상품명: {this.props.name},
                구입가능: {this.props.available ? '가능' : '불가능'}
            </div>
        </div>
    }
});
```

컴포넌트 위계와 데이터 흐름을 설명하기 위해, 정말로 기본적인 React 컴포넌트들을 두가지 만들었습니다. 컴포넌트는 `ShoppingCart -> ShoppingItem` 형태의 위계를 가지게 되며,
더 많은 데이터를 표현해야 할 경우 더욱 작은 형태로 쪼개야 할 수도 있을 것입니다. 일반적인 쇼핑몰들은 수량을 써 줄 수도 있고,삭제 버튼이 있기도 합니다. 그런 것들은 당연히 ShoppingItem 아래에 써 줘야겠죠?
별도의 `<ShoppingItemQuantityController />` `<ShoppingItemRemoval />` 컴포넌트들을 만들 수도 있고, 컴포넌트 관리가 귀찮으니 `<ShoppingItem />` 안에 모두 넣어 버릴 수도 있을 것입니다.

하지만 컴포넌트들이 재사용을 위해 만들어졌다는 점을 생각해 볼 필요가 있습니다. 가령, `<ShoppingItemRemoval />` 을 만드는 것보다는 커스텀 버튼 컴포넌트를 만들어 전체 페이지들에 나오는 버튼들의
표현 로직, 인터랙션 로직 등을 일반화할 수도 있을 것입니다. 하지만 전체 페이지에 버튼이 몇 개 없고, 서로 생긴 것도 많이 다르고, 앞으로 버튼을 추가할 일이 없다면 과도한 일반화는 무의미할 것입니다.
이런 것들을 생각하여 컴포넌트들을 잘 설계하면 됩니다.

코드를 보면, 데이터는 `<ShoppingCart />`에서 `<ShoppingItem />`으로 흐르는 것이 명백합니다. kimchi,rice,curry 같은 단어들은 `<ShoppingCart />` 상위 컴포넌트의 `render()` 메서드에서 나타나는데,
`<ShoppingItem />` 에는 영 보이질 않는 것을 보면 그렇습니다. 위에서 말했듯이 `<ShoppingItem name="kimchi" available={true} />` 처럼 HTML attribute처럼 써준 것이 하위 컴포넌트로 상태를 주입하는 부분입니다.
이 약간 익숙한 듯하지만 생소한 느낌의 문법은 React에서 사용하는 ***JSX***라는 치환 문법이며, 자세한 것은 나중에 쓸 글에서 더 본격적으로 다룰 예정입니다만 공식 문서를 읽어보면 사용법을 금방 이해할 수 있을 것입니다.

또한 React는 컴포넌트 라이프사이클 훅을 제공합니다. 컴포넌트가 마운트(Owner에서 `React.CreateElement` 함수 호출로 새 컴포넌트 인스턴스를 만들거나, `React.render`로 DOM 컨테이너 위에 Render되는 순간) 되는 순간과
언마운트되는 시점, 업데이트되는 시점 등등에 불리는 함수들을 컴포넌트 스펙 오브젝트에서 인터페이스를 구현하듯이 작성해 주면 되며, 일종의 이벤트 훅 같은 것이라고 생각하면 편할 것 같습니다. 또한 모든 React 컴포넌트들은
HTML의 인라인 이벤트 핸들러같은 onClick 등의 prop을 넘김으로서 인터랙션을 표현할 수 있습니다. 이에 대해서는 컴포넌트에 대한 글에서 더 자세히 다루겠습니다.

## React는 무엇인가: Virtual DOM과 Reconciliation

React는 HTML Element들을 Virtual DOM을 이용해 표현한다고 했습니다. Virtual DOM은 가상의 HTML Element들을 가지고 있다가, (재)렌더링을 하면 필요한 부분만 업데이트(DOM 조작)하는 방식입니다. Virtual DOM은 사실
그 개념을 알고 나면 React의 구현 디테일에 불과합니다만, `key` prop 등 차후 여러 API들과 연관이 있기 때문에 개념을 알고 있을 필요는 있습니다.

React가 Virtual DOM을 만든 이유는 *Always re-render on update* 정책을 가지고 있기 때문입니다. jQuery 등을 이용하여 애플리케이션을 작성하면 모델이 업데이트되었을 때 필요한 컴포넌트들만 셀렉터를 이용하여
업데이트를 해주는 코드를 작성할 때가 많습니다. 하지만 React에서는 작성자가 원하는 결과물만을 선언적으로 작성하므로, 그런 코드를 짤 필요가 없다고 위에서 언급했습니다. 이것이 가능하려면, 일부보다는 해당 영역을
모두 새로 그리는 것이 바람직합니다.

하지만 jQuery로 이렇게 구현하면 단점이 있기 마련입니다. React를 사용하지 않는 상황을 가정하고, 위의 쇼핑 카트 예제에서 '가능/불가능'을 보여주는 부분만 jQuery 셀렉터로 업데이트하다가 쇼핑카트 전체를 지우고
새로 그리기 시작했다고 생각해봅시다. 저정도로 간단한 수준의 HTML 엘리먼트 트리라면 아무것도 아니겠지만, 카트 컴포넌트의 내용이 많아질수록 문제가 커집니다. 일단 속도가 늘어나는 엘리먼트의 양에 비례하여 더
많은 동기 DOM 조작 오퍼레이션을 수행해야 하므로 느려질 수 밖에 없습니다. 그리고 우리가 미처 신경쓰지 못하는 사용성 문제들이 발생합니다. 가령 '수량' 을 보여주는 인풋 박스가 있고 거기에 키보드 커서가 올려져
있었다면 업데이트 후 엘리먼트가 지워지고 새로 쓰여졌을 시, 커서가 사라져 있게 되는 문제가 있습니다. 또한 사용자가 업데이트하지 않은 정보들은 날아가버리게 됩니다.

React를 사용하면 이런 문제들은 해결됩니다. 가지고 있는 Virtual DOM 트리를 비교하면서 필요한 부분만 업데이트하기 때문입니다. 이것을 Reconciliation (비교조정)이라고 하며, 이 개념은
[React 공식 문서](http://facebook.github.io/react/docs/reconciliation-ko-KR.html)에 잘 설명되어 있습니다. 또한 React 팀의 Christopher Chedeau가 [기고한 React의 diffing 알고리즘에 대한 글](http://calendar.perfplanet.com/2013/diff/)
도 잘 설명하고 있습니다. 비록 동기 DOM 배치 오퍼레이션을 매 업데이트마다 수행하는 것보다는 낫겠지만, 글을 보면 업데이트 전, 업데이트 후의 가상 엘리먼트 트리를 비교해야 하는 문제가 있습니다.
이 문제는 가장 최신의 알고리즘도 `O(n^3)`의 시간 복잡도를 가지고 있는 수준이므로, 여러가지 가정들을 통해 알고리즘의 복잡도를 `O(n)`까지 낮췄다고 설명하고 있습니다.

이런 React 렌더러의 최적화와 가상화 덕에, 우리는 뷰 업데이트 로직은 거의 신경쓰지 않고 모델 데이터 관리와 결과물만 기술하면 됩니다. React의 Virtual DOM은 획기적인 아이디어이다 보니 다른 라이브러리들도 영향을
많이 받고 있는데, Ember.js에서도 [이를 도입](http://blog.nparashuram.com/2015/05/performance-boost-in-emberjs-from.html) 하였으며 [virtual-dom](https://github.com/Matt-Esch/virtual-dom) 이라는
별도 구현체도 있습니다. 또한 Virtual DOM을 넘어서 incremental update(증분 업데이트)를 표방한 구글의 [Incremental DOM](https://github.com/google/incremental-dom) 도 등장했습니다.

하지만 가상화에 따른 혜택들은 위에서 말한 것에 그치지 않습니다. 가상화라는 것은 기본적으로 브라우저 구현에 코드가 의존하는 것을 넘어선다는 것을 의미하며, 브라우저의 구현 디테일 차이들을 덜 신경써도 된다는 장점이 있습니다.
이 덕분에 [React Native](https://facebook.github.io/react-native/) 같은 프로젝트나, [React Canvas](https://github.com/Flipboard/react-canvas) 같이 결과물이 DOM으로 쓰여지지 않는 프로젝트들이
등장할 수 있었으며, React 팀에서는 이런 멀티 플랫폼적인 접근을 권장하기 위하여 최근 렌더러를 React에서 분리하려고 노력하고 있습니다 [(관련 이슈)](https://github.com/facebook/react/issues/4286)

그러면 이제부터는 React에 대해 흔히 사람들이 가지는 오해들을 짚어보겠습니다.

## React에 대한 오해: React는 빠르다

위에서 말한 비교조정 알고리즘은 `O(n^3)`에서 `O(n)`까지 시간 복잡도를 끌어올리긴 했지만, 어쨌든 여전히 비교하는 것 외에도 많은 관리 작업을 수행하기 때문에, React는 기본적으로 빠르지 않습니다.
가끔가다 'React는 빠르다'라는 주장이 나오면 '해주는 것에 비해서는 빠르다' 또는 '최적화를 잘 해주면 빨라진다' 정도로 받아들이면 되겠습니다 (만약 그런 것도 아니면, 허풍이겠지요). 최적화의 예를 들자면,
React는 기본적으로 런타임에서 invariant 등의 개발을 도와주는 기능들이 있는데, 이런 부분을 프로덕션 빌드를 통해 제거해야만 합니다. 특히 애니메이션이 많은 SPA를 만들다 보면 최적화의 필요성은 절실하게
느끼게 되는 부분이며, React의 최적화 방법에 대해서는 별도의 글로 더 자세히 쓰도록 하겠습니다.

## React에 대한 오해: JSX는 템플릿 언어다

초심자들이 쉽게 오해하는 부분입니다만, JSX는 일반적인 템플릿 언어들과는 다릅니다. JSX는 EcmaScript로 치환되는 간단한 치환/확장 언어로서, 지금은 사라진 언어 명세인 [E4X에 영향을 받아](http://blog.vjeux.com/2013/javascript/jsx-e4x-the-good-parts.html) 만들어졌습니다. React 컴포넌트와 React.DOM 가상 엘리먼트 생성자들은 트랜스파일러를 통해 `React.createElement`함수 콜으로 치환됩니다. 예를 들자면 다음과 같습니다.

```javascript
<div foo={0} bar={'baz'} />
// 치환 후
React.createElement('div', { foo: 0, bar: 'baz' });
```

JSX는 [Handlebars](http://guides.emberjs.com/v1.10.0/templates/displaying-a-list-of-items/) 나 [Jinja2](http://jinja.pocoo.org/docs/dev/)와 같이 자체적인 if-else, 반복문, 조건적 표현 블럭 등의 제어구조를 가지고 있지 않고, EcmaScript 표현식들을 `{}` 안에 써준다는 정도에 그치기 때문에 템플릿 언어라고 보기에는 무리가 있습니다.

JSX는 EcmaScript로 치환되는 언어일 뿐이므로, 그냥 함수 호출 식으로 써도 됩니다. 하지만 JSX의 트랜스파일 결과물이 오브젝트 형태로 표현되어야 한다는 의견이 있어 차후 버젼에서는 중첩 함수 호출 형태에서 벗어날 가능성이 있으며, 그걸 손으로 쓰면 가독성이 많이 떨어지므로 그냥 JSX로 쓰기를 권장합니다.

## React의 현실 세계 사용은?

현실적으로 이야기하자면, React나 React 생태계는 아직 성숙한 단계라고 보기에는 무리가 있습니다. 이미 왠만한 수준의 애플리케이션들을 만들 수 있을 정도로 많은 모듈들이 나와 있습니다만
(react-router, react-motion, redux, reflux, 등등..) 성숙도나 안정성은 React에 비해서는 약간 떨어지는 수준입니다. 페이스북에서 개발자 도구를 열어 `require('React').version` 을 쳐 보면 React의 최신 베타 릴리즈,
이 글을 쓰는 시점에서는 `0.14.0-beta3`, 를 프로덕션에서 사용하고 있다는 것을 [알 수 있습니다](https://twitter.com/sebmarkbage/status/632257978003951616). 이정도로 React는 굉장히 안정적인
라이브러리지만, 주변의 모듈들은 굉장히 빠른 속도로 개발되는 중이므로 API가 너무 자주 바뀌거나 문서도 없는 경우가 허다합니다.

이런 상황이다 보니, 블로그로 잘 정리된 사용례를 찾는 것보다 Github나 Gist를 찾아보는 노력이 많이 필요합니다. 또한 질문들은 IRC보다는 [Reactiflux](https://reactiflux.slack.com)라는 거대한 Slack 채팅방에서 많이 이뤄집니다.
Github 계정을 가지고 있다면, [React Korea Gitter 채팅방](https://gitter.im/reactkr/discuss)에서도 한국어로 도움을 받을 수 있습니다.

아직 성숙하지 않은 생태계라는 점을 고려하면 자료(영문)는 굉장히 많은 편이지만, 재사용 가능한 컴포넌트 모듈의 수는 많지 않습니다. 당장 무언가를 검색하면 4-5개 넘는 플러그인들이 쏟아져 나오는 jQuery나 Angular.js 등
다른 라이브러리 생태계와는 비교되는 수준이며, 뭔가 새로 만들어야 할 때가 적지 않습니다. 하지만 React를 jQuery나 jQuery 플러그인과 함께 사용해도 거의 무방하다는 점을 생각해보면, 안 써야 할 이유도 적다고 볼 수
있습니다. 또한 공식적으로는 IE8까지의 사용을 지원하고 있으므로, 한국의 웹 현실을 생각해 볼 때 상당히 끌리는 점도 있습니다.

## 더 읽을거리

[http://www.slideshare.net/floydophone/react-preso-v2](http://www.slideshare.net/floydophone/react-preso-v2)

위의 슬라이드는 전 React 팀 소속이었던 Pete Hunt가 2013년에 발표했던 'Rethinking Best Practices' 키노트의 슬라이드이며, 글을 쓰는 지금의 시점에서도 대부분 유효한 내용입니다. React의 철학에 대해서 전체적으로 잘 설명하고 있습니다.
