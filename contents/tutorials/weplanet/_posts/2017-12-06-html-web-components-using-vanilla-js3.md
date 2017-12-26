---
layout : tutorials
category : tutorials
title : 바닐라 자바스크립트로 HTML 웹 컴포넌트 사용하기 (3/7)
subcategory : setlayout
summary : 바닐라 자바스크립트로 HTML 웹 컴포넌트 사용하기에 대해 알아봅니다.
permalink : /tutorials/weplanet/html-web-components-using-vanilla-js3
author : danielcho
tags : javascript 
title\_background\_color : F1F71A
---



> 본 포스팅은 [Ayush Gupta](https://ayushgp.github.io/)의 [HTML Web Component using Vanilla JavaScript](https://ayushgp.github.io/html-web-components-using-vanilla-js/)를 저자의 허락하에 번역한 글입니다. 오탈자, 오역 등이 있다면 연락부탁드립니다.

  



## 팁과 트릭 

웹 컴포넌트에 대한 이 짤막한 글에서 다루지 못한 것들이 많이 있습니다. 웹 컴포넌트를 개발할 때 유용했던 팁과 트릭을 간략하게 알려드리려고 합니다.



### 컴포넌트 이름짓기

- 사용자 지정 구성 요소 이름은 대쉬를 포함하고 있어야 합니다. 따라서 `<my-tabs>` 나 `<my-amazing-website>` 는 유효한 이름이지만, `<foo> `나  `<foo_bar>` 는 그렇지 않습니다. 이러한 요구 사항은 HTML 분석이 커스텀 element와 일반 element를 구별할 수 있도록 하기 위한 것입니다. 
- 태그가 HTML에 추가될 때 호환성을 보장합니다. 같은 태그를 한번 이상 등록할 수 없습니다. 
- HTML이 몇 개의 구성 요소만 자동 닫기를 허용하기 때문에, 커스텀 element들은 자동 닫기를 할 수 없습니다. 언제나 닫기 태그 (`<app-drawer></app-drawer>`)를 사용하십시오. 




### 확장 컴포넌트

컴포넌트를 만들 동안 상속을 사용할 수 있습니다. 예를 들어, `UserCard` 를 두 종류의 사용자를 위해 만들고 싶다면, 먼저 일반 UserCard를 만든 후 두 개의 특수 사용자 카드로 확장하십시오. 컴포넌트의 상속에 대한 더 많은 정보는 이 [Google web developers’ article](https://developers.google.com/web/fundamentals/web-components/customelements#extend) 를 참고하십시오.



### 라이프사이클 콜백

우리는 element가 DOM에 attach되자마자 call 되는 `connectedCallback` 을 만들었습니다. 우리는 element가 DOM에서 제거되자마자 콜 되는 `disconnectedCallback` 역시 만들었습니다.  `attributesChangedCallback(attribute,oldval,newval)` 은 우리가 커스텀 element 속성을 바꿀 때 call 됩니다. 



### Element는 클래스의 instance

element가 클래스의 instance들이기 때문에, 이 클래스에서 퍼블릭 방식을 정의하면 다른 커스텀 element / 스크립트가 해당 속성을 변경하는 대신, 이 element들과 상호작용할 수 있습니다. 



### 프라이빗 메소드 정의

프라이빗 메소드를 여러 방법으로 정의할 수 있습니다. 저는 쓰기 쉽고 이해하기 쉬운 IIFE를 사용하는 것을 선호합니다. 예를 들어, 복잡한 내부 작업이 있는 구성 요소를 만들고 있다면, 다음과 같이 할 수도 있습니다:



```
(function() {

  // Define private functions here with first argument as self
  // When calling these functions, pass this from the class 
  // This is a way you can use private functions in JS
  function _privateFunc(self, otherArgs) { ... }

  // Now this is available only in this scope and can be used by your class here:
  class MyComponent extends HTMLElement {
    ...

    // Define functions like this that are accessible to interact with this element.
    doSomething() {
      ...
      _privateFunc(this, args)
    }
    ...
  }

  customElements.define('my-component', MyComponent);
})()
```



### 클래스 정의 Freeze

새로운 속성이 추가되는 것을 막기 위해 클래스 정의를 freeze할 수 있습니다. 기존 속성이 제거되는 것을 막고, 기존 속성이나 그 열거성, 용이성 등이 바뀌는 것을 막고, 시제품이 바뀌는 것 또한 막는 것을 다음을 이용해서 할 수 있습니다:

```
class MyComponent extends HTMLElement { ... }
const FrozenMyComponent = Object.freeze(MyComponent);
customElements.define('my-component', FrozenMyComponent);
```





## 결론

웹 컴포넌트에 대한 튜토리얼은 매우 제한적입니다. 웹 컴포넌트를 따라다니는 React에 부분적인 책임이 있습니다. 이 글이 의존성 없이 자신만의 커스텀 컴포넌트를 만드는 데 충분한 정보를 주었기를 바랍니다. [커스텀 컴포넌트 API spec](https://www.w3.org/TR/custom-elements/)에서 웹 컴포넌트에  대한 더 많은 정보를 확인할 수 있습니다. 

이 글에서 우리는 겨우 웹 컴포넌트의 표면만을 살펴 보았습니다. 제가 웹 컴포넌트에 대한 튜토리얼을 더 쓰기를 바라시는 분들은, 저에게 연락주시기 바랍니다. 그리고 다음 튜토리얼의 일부를 읽어 보실 수 있습니다 : [HTML Web Component using Vanilla JS - Part 2](https://ayushgp.github.io/html-web-components-using-vanilla-js-part-2/)



### 업데이트 

제가 [삭제되거나 / 무언가로 대체될 수 있는 HTML 가져오기를 사용하지 말라는 말](https://github.com/w3c/webcomponents/issues/645)을 지속적으로 들었습니다. 그래서 여기 HTML을 자체 파일로 유지하고 JS에서 다시 가져오는 법에 대해 Yuri Karadzhov가 추천한 다른 접근법이 있습니다:



HTML 파일에서 `script` 태그를 삭제하고, `<link rel="import" href="..."> `문구를 `index.htm`l에서 삭제합니다. 우리가 HTML을 다시 가져오고 `template` 태그로 직접 분석하므로, 아까 템플릿을 선택하기 위해 사용하던 `currentDocument`를 정의할 필요가 없습니다. 다음과 같이 UserCard 구성 요소를 다시 작성할 수 있습니다:



```
(async () => {
  const res = await fetch('/UserCard/UserCard.html');
  const textTemplate = await res.text();

  // Parse and select the template tag here instead 
  // of adding it using innerHTML to avoid repeated parsing
  // and searching whenever a new instance of the component is added.
  const HTMLTemplate = new DOMParser().parseFromString(textTemplate, 'text/html')
                           .querySelector('template');

  class UserCard extends HTMLElement {
    constructor() { ... }

    connectedCallback() {
      const shadowRoot = this.attachShadow({ mode: 'open' });

      // Clone the template and the cloned node to the shadowDOM's root.
      const instance = HTMLTemplate.content.cloneNode(true);
      shadowRoot.appendChild(instance);

      const userId = this.getAttribute('user-id');
      //...
    }
    render(userData) { ... }
    toggleCard() { ... }
  }

  customElements.define('user-card', UserCard);
})();
```

