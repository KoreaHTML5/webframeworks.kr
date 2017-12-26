---
layout : tutorials
category : tutorials
title : 바닐라 자바스크립트로 HTML 웹 컴포넌트 사용하기 (1/7)
subcategory : setlayout
summary : 바닐라 자바스크립트로 HTML 웹 컴포넌트 사용하기에 대해 알아봅니다.
permalink : /tutorials/weplanet/html-web-components-using-vanilla-js1
author : danielcho
tags : javascript 
title\_background\_color : F1F71A
---



> 본 포스팅은 [Ayush Gupta](https://ayushgp.github.io/)의 [HTML Web Component using Vanilla JavaScript](https://ayushgp.github.io/html-web-components-using-vanilla-js/)를 저자의 허락하에 번역한 글입니다. 오탈자, 오역 등이 있다면 연락부탁드립니다.

  

웹 컴포넌트는 나온지 꽤 되었습니다. Google은 그것의 광범위한 채택을 위해 정말 노력하고 있지만, Opera와 Chrome을 제외한 거의 대부분의 브라우저는 웹 컴포넌트를 지원하고 있지 않습니다.

하지만 <https://www.webcomponents.org/polyfills> 에서 확인할 수 있는 polyfills를 사용하면, 나만의 웹 컴포넌트를 구축할 수 있습니다. 이 글에서는 스타일리쉬하고, 기능적이고, 마크업을 가지고 있는 자신만의 HTML 태그를 만드는 법을 알려드리려고 합니다.



## 서론

웹 컴포넌트는 웹 페이지와 웹 어플리케이션에서 사용가능한 새로운 정의(custom), 재사용 가능하고(reusable), 캡슐화된(encapsulated) HTML 태그를 만들 수 있게 해주는 웹 플랫폼 API의 세트입니다. 

웹 컴포넌트 기준에 만들어진 custom 컴포넌트와 위젯은 최신 브라우저에서 작동하고, JavaScript 라이브러리 또는 HTML로 작동하는 모든 구조와 함께 사용될 수 있습니다. 

현재 웹 컴포넌트를 지원하는 기능은 최근 HTML과 DOM 스펙에 추가되어 웹 개발자가 캡슐화된 스타일 및 사용자 지정 동작과 HTML을 쉽게 확장할 수 있게 해줍니다.

Vanilla JS / HTML / CSS 만을 사용해서 재사용 가능한 구성 요소를 만들게 해줍니다. 만약 HTML이 문제에 대한 해법을 제공하지 않으면, 이를 가능하게 하는 웹 컴포넌트를 만들면 됩니다. 

예를 들어, `id`와 연관되어 있는 사용자 데이터를 가지고 있고, 주어진 사용자 `id`를 가지고 와서 채우는 구성 요소를 원합니다. HTML은 다음과 같을 것입니다:



```
<user-card user-id="1"></user-card>
```



이것은 웹 컴포넌트의 꽤 쉬운 기본입니다. 이 튜토리얼은 유저 카드 구성 요소를 구축하는 데 집중할 것입니다. 



## Web Components 의 네가지 요소(pillars)

HTML과 DOM 기준은 웹 컴포넌트를 정의하는 데 도움이 되는 네 개의 새로운 기준 / API를 정의합니다. 

1. [Custom Elements](https://www.w3.org/TR/custom-elements/): 사용자 정의 요소와 웹 개발자는 새로운 HTML 태그를 만들거나, 존재하는 HTML 태그를 강화하거나, 다른 개발자들이 만든 컴포넌트를 확장할 수 있습니다. 이 API는 웹 컴포넌트의 기초입니다. 
2. [HTML Templates](https://www.html5rocks.com/en/tutorials/webcomponents/template/#toc-pillars): 클라이언트-사이드 템플릿을 위한 기본 DOM 기반의 접근법에 대한 새로운 `<template>` 요소를 정의합니다. 템플릿은 HTML로 `parse`되는 마크업 `fragments`을 선언하고, 페이지를 불러올 때는 사용되지 않지만, 추후 런타임 시점에 `instantiated`될 수 있습니다.
3. [Shadow DOM](https://dom.spec.whatwg.org/#shadow-trees): Shadow DOM은 컴포넌트 기반 어플리케이션을 만들기를 위한 도구로 디자인되었습니다. 이것은 웹 개발의 공통적인 문제점을 위한 해결책을 제시합니다. 이것은 컴포넌트를 위해 DOM과 범위를 구분시키고, CSS를 단순화시키는 등의 일을 합니다.
4. [HTML Imports](https://www.html5rocks.com/en/tutorials/webcomponents/imports/): HTML 템플릿이 새로운 템플릿을 만들게 해준다면, HTML imports는 다른 HTML 파일에서 템플릿을 가져오게 해줍니다. imports는 가지고 있는 구성 요소들을 HTML파일과 별개의 것으로 깔끔하게 정리해주어 코드를 더욱 깔끔하게 만듭니다. 참고 : HTML imports는 지금 많이 사용되지 않고 있으며, 추후 없어질 수 있습니다. 더 많은 정보를 위해 [this discussion](https://github.com/w3c/webcomponents/issues/645)을 읽어보십시오.



## 커스텀 Element 정의하기 

커스텀 element를 만들기 위해, 먼저 우리는 element가 작동하는 방법을 정의하는 커스텀 element 클래스를 정해야 합니다. 이 클래스는 `HTMLElement` 클래스를 확장합니다. 좀 돌아간다면, 커스텀 element의 lifecycle 방법을 먼저 얘기해야 합니다. 커스텀 element와 다음의 lifecycle callback을 사용할 수 있습니다: 

- `connectedCallback` — element가 DOM에 삽입될 때마다 불립니다. 
- `disconnectedCallback` —  element가 DOM에서 없어질 때마다 불립니다.
- `attributeChangedCallback` —  element의 속성이 더해지거나, 없어지거나, 업데이트되거나, 교체될 일어나는 행동



`UserCard`라고 불리는 폴더 안에 `UserCard.js` 라는 새로운 파일을 만드십시오. 



```
class UserCard extends HTMLElement {
  constructor() {
    // If you define a constructor, always call super() first as it is required by the CE spec.
    super();

    // Setup a click listener on <user-card>
    this.addEventListener('click', e => {
      this.toggleCard();
    });
  }

  toggleCard() {
    console.log("Element was clicked!");
  }
}

customElements.define('user-card', UserCard);

```



이 예시에서, 우리는 커스텀 element인 `user-card` 의 몇가지 행동을 정의하는 클래스를 설정했습니다.  `customElements.define('user-card', UserCard);call` 는 DOM에게 우리가 `user-card`  라고 불리는, `UserCard `에 의해 행동이 결정되는 새로운 커스텀 element를 만들었다는 것을 알려줍니다. 우리는 이제 HTML에서  `user-card`  를 사용할 수 있습니다. 



우리는 <https://jsonplaceholder.typicode.com/> 의 다음 API를 사용해 우리의 사용자 카드를 만들 것입니다. 다음은 데이터가 어떻게 생겼는지 보여주는 예시입니다:



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



### 템플릿 만들기 

이제, 이 데이터를 화면에 렌더링할 템플릿을 만들어 봅시다. 다음의 코드로 `UserCard.html` 라는 파일을 만듭니다. ­­­­­­

```
<template id="user-card-template">
  <div class="card__user-card-container">
    <h2 class="card__name">
      <span class="card__full-name"></span> (
      <span class="card__user-name"></span>)
    </h2>
    <p>Website: <a class="card__website"></a></p>
    <div class="card__hidden-content">
      <p class="card__address"></p>
    </div>
    <button class="card__details-btn">More Details</button>
  </div>
</template>
<script src="/UserCard/UserCard.js"></script>

```



참고: `card__`의 접두어를 가진 클래스를 사용하였습니다.이것은 이전 버전의 브라우저에서는 DOM을 shadow Dom과 분리할 수 없었기 때문입니다.



### 스타일링

우리는 이제 카드를 위한 템플릿을 만들었습니다. 이제, CSS를 이용해서 스타일링해 봅시다. UserCard 폴더 안에 다음과 같은 내용과 함께 UserCard.css라는 새로운 파일을 만들어 봅시다.

```
.card__user-card-container {
  text-align: center;
  display: inline-block;
  border-radius: 5px;
  border: 1px solid grey;
  font-family: Helvetica;
  margin: 3px;
  width: 30%;
}

.card__user-card-container:hover {
  box-shadow: 3px 3px 3px;
}

.card__hidden-content {
  display: none;
}

.card__details-btn {
  background-color: #dedede;
  padding: 6px;
  margin-bottom: 8px;
}

```



이제, `UserCard.html`  안 `<template>  `태그 앞에 다음의 태그를 사용하여 템플릿에 CSS파일을 포함시킵니다.



```
<link rel="stylesheet" href="/UserCard/UserCard.css">

```



우리의 스타일과 템플릿이 자리를 잡으면, 이제 컴포넌트를 만들 수 있습니다. 



### connectedCallback

이제 element를 만들고 그것을 DOM에 attach할 때 어떤 일이 발생해야하는지 정의해야 합니다. `constructor` 방법과 `connectedCallback` 방법에 차이점이 있음을 참고하십시오.

`constructor` 는 element가 만들어질 때 call되며, `connectedCallback` 는 구성 요소가 DOM에 삽입될 때 call됩니다. 이것은 리소스를 가져오거나, 렌더링 같은 setup 코드를 실행할 때 유용합니다. 

주의 : `UserCard.js` 파일 위에, `currentDocument` 를 정의합니다. 이것은 가져온 HTML의 스크립트를 가져온 HTML의 DOM에 접근할 때 필요합니다. 다음과 같이 정의하십시오.



```
const currentDocument = document.currentScript.ownerDocument;
```



우리의 `connectedCallback` 를 정의해 봅시다.



```
// Called when element is inserted in DOM
connectedCallback() {
  const shadowRoot = this.attachShadow({mode: 'open'});

  // Select the template and clone it. Finally attach the cloned node to the shadowDOM's root.
  // Current document needs to be defined to get DOM access to imported HTML
  const template = currentDocument.querySelector('#user-card-template');
  const instance = template.content.cloneNode(true);
  shadowRoot.appendChild(instance);

  // Extract the attribute user-id from our element. 
  // Note that we are going to specify our cards like: 
  // <user-card user-id="1"></user-card>
  const userId = this.getAttribute('user-id');

  // Fetch the data for that user Id from the API and call the render method with this data
  fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
      .then((response) => response.text())
      .then((responseText) => {
          this.render(JSON.parse(responseText));
      })
      .catch((error) => {
          console.error(error);
      });
}
```