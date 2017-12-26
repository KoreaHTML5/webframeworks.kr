---
layout : tutorials
category : tutorials
title : 바닐라 자바스크립트로 HTML 웹 컴포넌트 사용하기 (4/7)
subcategory : setlayout
summary : 바닐라 자바스크립트로 HTML 웹 컴포넌트 사용하기에 대해 알아봅니다.
permalink : /tutorials/weplanet/html-web-components-using-vanilla-js4
author : danielcho
tags : javascript 
title\_background\_color : F1F71A
---



> 본 포스팅은 [Ayush Gupta](https://ayushgp.github.io/)의 [HTML Web Component using Vanilla JavaScript Part2](https://ayushgp.github.io/html-web-components-using-vanilla-js-part-2/)를 저자의 허락하에 번역한 글입니다. 오탈자, 오역 등이 있다면 연락부탁드립니다.

  

이전 글을 통해서 커스텀 element, Shadow DOM, HTML Imports, template tag 을 위해 W3C에서 소개된 새로운 API 스펙을 사용한 vanilla JS Web Components 만드는 법에 대해 글을 쓴 적이 있습니다.



이전 글은 매우 간단하지만, 그렇게 유용하지는 않은 웹 컴포넌트를 만드는 법에 대해서 였습니다. 이번 글에서는 어떻게 다수의 컴포넌트를 만드는지, 그 컴포넌트들이 서로 상호 작용 하는지, 그리고 어떻게 코드를 정리하는지에 대해 알려드리려고 합니다. 이것들이 제가 웹 컴포넌트를 이용해 어플리케이션을 만들면서 배운 것입니다. 속성에 관해서는 다음 글에 이어집니다.



## 우리가 만들 것 

![webcomoponents](https://user-images.githubusercontent.com/7992943/32207972-794dd8de-be25-11e7-8333-37aece4c030c.gif)

우리는 세 가지 구성 요소를 만들어 볼 것입니다. 첫 번째 구성 요소는 사람들 리스트 입니다. 두 번째 구성 요소는 우리가 첫 번째 구성 요소에서 선택한 사람들의 정보를 보여주는 것 입니다. 상위 구성 요소들은 이러한 구성요소를 조직하여 우리가 독립적으로 하위 구성 요소들을 만들고, 서로 맞추어 볼 수 있게 해 줄 것입니다. 



## 코드 구조

우리는 우리의 구성 요소를 모두 포함하기 위해 `components` 디렉토리를 만들 것입니다. 각 구성 요소에는 각각의 HTML 템플릿, JS, 그리고 스타일 시트를 포함하고 있는 디렉토리가 있을 것입니다. 재사용되지 않고 다른 구성 요소를 만드는 데에만 사용되는 구성 요소들은 만들어진 구성 요소의 디렉토리에 위치할 것입니다. 따라서 우리의 경우 디렉토리의 구조는 다음과 같을 것입니다.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    

```
src/
  index.html
  components/
    PeopleController/
      PeopleController.js
      PeopleController.html
      PeopleController.css
      PeopleList/
        PeopleList.js
        PeopleList.html
        PeopleList.css
      PersonDetail/
        PersonDetail.js
        PersonDetail.html
        PersonDetail.css
```



우리는 다음 <https://jsonplaceholder.typicode.com/>의 API를 사용하여 플레이스 홀더 사용자 데이터를 가져올 것입니다. 다음은 데이터가 어떻게 생겼는지에 대한 예시입니다:



```
{
  id: 1,
  name: "Leanne Graham",
  username: "Bret",
  email: "Sincere@april.biz",
  address: {
    street: "Kulas Light",
    suite: "Apt. 556",
    city: "Gwenborough",
    zipcode: "92998-3874",
    geo: {
      lat: "-37.3159",
      lng: "81.1496"
    }
  },
  phone: "1-770-736-8031 x56442",
  website: "hildegard.org"
}
```



## 하위 컴포넌트

### 사람들 리스트 컴포넌트

`PeopleList` 구성 요소를 만드는 것에서부터 시작합시다. 다음과 같은 내용으로 `PeopleList` 파일을 만듭니다:



```
<template id="people-list-template">
  <style>
  .people-list__container {
    border: 1px solid black;
  }
  .people-list__list {
    list-style: none
  }

  .people-list__list > li {
    font-size: 20px;
    font-family: Helvetica;
    color: #000000;
    text-decoration: none;
  }
  </style>
  <div class="people-list__container">
    <ul class="people-list__list"></ul>
  </div>
</template>
<script src="/components/PeopleController/PeopleList/PeopleList.js"></script>
```



`ul.people-list__list`  는 우리가 알게 되는 이름의 리스트를 포함하고 있을 것입니다. 이제 `constructor`, `connectedCallback`, 그리고 IIFE 내부의 `render` functions로 클래스 `PeopleList` 를 만들어 봅시다. 



```
(function () {
  const currentDocument = document.currentScript.ownerDocument;

  // Private Methods will go here:
  // ...

  class PeopleList extends HTMLElement {
    constructor() {
      // If you define a constructor, always call super() first as it is required by the CE spec.
      super();
    }

    connectedCallback() {
      // Create a Shadow DOM using our template
      const shadowRoot = this.attachShadow({ mode: 'open' });
      const template = currentDocument.querySelector('#people-list-template');
      const instance = template.content.cloneNode(true);
      shadowRoot.appendChild(instance);
    }
    
    get list() {
      return this._list;
    }

    set list(list) {
      this._list = list;
      this.render();
    }

    render() {
      // ...
    }
  }

  customElements.define('people-list', PeopleList);
})();
```



`render` 메소드에서, 우리는 `<li>`을 이용하여 사람들의 이름 리스트를 만들어야 합니다. 그리고 각 구성 요소들을 위해 `CustomEvent`도 만들 것입니다. 구성 요소가 클릭될 때마다, id는 상위 DOM 트리의 이벤트와 전파됩니다. 

우리가 이것을 하는 이유는 우리의 자식 구성 요소가 부모 구성 요소나 형제 구성 요소로부터 독립적이게 만들기 위해서입니다. 우리는 부모 구성 요소에서 이 이벤트를 관찰하고, 그에 따라 형제 구성 요소를 업데이트시킬 것입니다. `render` 함수에 다음의 코드를 추가합니다:



```
render() {
  let ulElement = this.shadowRoot.querySelector('.people-list__list');
  ulElement.innerHTML = '';

  this.list.forEach(person => {
    let li = _createPersonListElement(this, person);
    ulElement.appendChild(li);
  });
}
```



IIFE안에, `_createPersonListElement(person)` 라고 불리는 클래스 정의 밖의 함수를 만듭니다. 이것은 사람들 정보와 `li` 요소를 만드는 데 사용될 것입니다. 참고: JS 코드 안에 프라이빗 함수를 사용하는 데 매우 좋은 방법이므로, 저는 이런 방식을 썼습니다.



```
function _createPersonListElement(self, person) {
  let li = currentDocument.createElement('LI');
  li.innerHTML = person.name;
  li.className = 'people-list__name'
  li.onclick = () => {
    let event = new CustomEvent("PersonClicked", {
      detail: {
        personId: person.id
      },
      bubbles: true
    });
    self.dispatchEvent(event);
  }
  return li;
}

```




