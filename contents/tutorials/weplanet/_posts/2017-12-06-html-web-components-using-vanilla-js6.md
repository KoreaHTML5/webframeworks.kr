---
layout : tutorials
category : tutorials
title : 바닐라 자바스크립트로 HTML 웹 컴포넌트 사용하기 (6/7)
subcategory : setlayout
summary : HTML Web Component using Vanilla JavaScript에 대해 알아봅니다.
permalink : /tutorials/weplanet/html-web-components-using-vanilla-js6
author : danielcho
tags : javascript 
title\_background\_color : F1F71A
---



> 본 포스팅은 [Ayush Gupta](https://ayushgp.github.io/)의 [HTML Web Component using Vanilla JavaScript Part3](https://ayushgp.github.io/html-web-components-using-vanilla-js-part-3/)를 저자의 허락하에 번역한 글입니다. 오탈자, 오역 등이 있다면 연락부탁드립니다.

  

이것은 제가 쓰고 있는 웹 컴포넌트 관련 튜토리얼의 세 번째 파트입니다. 이번 파트에서는 속성들을 언제, 어떻게 쓰는지와, 그 속성들을 다루는 커스텀 element 스펙에 대해서 알아볼 것입니다. 이 시리즈의 앞선 글들을 먼저 확인해주시기 바랍니다.



Quoting from MDN:

> HTML 요소들은 속성을 가지고 있습니다. 속성은 element를 구성하거나 사용자가 원하는 표준을 충족시키기 위해 다양한 방식으로 행동을 조정하는 additional value 입니다.





## 무엇을 만들 것인가?

우리는 `username`, `address` and `is-admin` 의 속성을 가지고 `UserCard` 컴포넌트를 만들 것입니다.  우리는 이러한 속성의 변경 사항을 지켜볼 것이고 컴포넌트를 이에 따라 업데이트할 것입니다. 





## 속성 가져오기와 준비하기 

우리는 다음과 같은 HTML 코드로 속성들을 쉽게 정의할 수 있습니다.



```
<user-card username="Ayush" address="Indore, India" is-admin></user-card>
```



우리는 `getAttribute(attrName)` 과 `setAttribute(attrName, newVal)` 메소드를 이용하여 속성을 가져오고 준비하기 위해 JavaScript의 DOM API를 사용할 수 있습니다. 예를 들면 다음과 같습니다.



```
let myUserCard = document.querySelector('user-card')
myUserCard.getAttribute('username') // Ayush
myUserCard.setAttribute('username', 'Ayush Gupta') 
myUserCard.getAttribute('username') // Ayush Gupta
```



## 속성 변화 관찰하기

커스텀 element spec v1은 속성 변경 사항을 살펴보고 이러한 변화에 대해 조치를 취하는 쉬운 방법을 정의합니다. 우리의 컴포넌트를 만들 때 우리는 다음과 같은 두 가지를 정의해야 합니다.

1. `Observed Attributes`  : 속성이 바뀔 때 알림을 받기 위해서는, 관찰된 속성들이 정의되어야 합니다. 즉, 정적인 `observedAttributes` getter가 속성 이름들이 리턴되는 element 클래스에 위치할 때 정의되어야 합니다. 
2. `attributeChangedCallback(attributeName, oldValue, newValue, namespace)`: 속성이 바뀌거나, 중단되거나, 삭제되거나, element에 대체될 때 호출되는 주기 방식. 관찰된 속성에만 호출됩니다. 



## UserCard 컴포넌트 생성

UserCard 컴포넌트를 만들어 봅시다. 우리는 이를 본 시리즈의 초반부에 다루었던 것과 동일하게 처리할 것입니다. 프로젝트 디렉토리에 `index.html` 파일을 만드십시오. 그리고 다음 파일들과 UserCard 디렉토리를 만드십시오. `UserCard.html`, `UserCard.css` 그리고 `UserCard.js`  입니다. 

`UserCard.js` 파일을 열고 다음 코드를 입력하십시오.



```
(async () => {
  const res = await fetch('/UserCard/UserCard.html');
  const textTemplate = await res.text();
  const HTMLTemplate = new DOMParser().parseFromString(textTemplate, 'text/html')
                           .querySelector('template');

  class UserCard extends HTMLElement {
    constructor() { ... }
    connectedCallback() { ... }
    
    // Getter to let component know what attributes
    // to watch for mutation
    static get observedAttributes() {
      return ['username', 'address', 'is-admin']; 
    }

    attributeChangedCallback(attr, oldValue, newValue) {
      console.log(`${attr} was changed from ${oldValue} to ${newValue}!`)
    }
  }

  customElements.define('user-card', UserCard);
})();

```



이제 기본 프레임워크가 준비되었기에, 이 컴포넌트를 구축해봅시다. 



### 속성을 이용하여 시작하기 

우리의 마크업 (즉 HTML)에 컴포넌트를 만들 때, 우리는 컴포넌트를 시작할 때 사용할 시작 값을 제공할 것입니다. 예를 들어,



```
<user-card username="Ayush" address="Indore, India" is-admin="true"></user-card>
```



이제 `connectedCallback`에서, 이러한 속성들을 가지고 각각에 해당하는 변수를 정의할 것입니다. 



```
connectedCallback() {
  const shadowRoot = this.attachShadow({ mode: 'open' });
  const instance = HTMLTemplate.content.cloneNode(true);
  shadowRoot.appendChild(instance);

  // You can also put checks to see if attr is present or not
  // and throw errors to make some attributes mandatory
  // Also default values for these variables can be defined here
  this.username = this.getAttribute('username');
  this.address = this.getAttribute('address');
  this.isAdmin = this.getAttribute('is-admin');
}

// Define setters to update the DOM whenever these values are set
set username(value) {
  this._username = value;
  if (this.shadowRoot)
    this.shadowRoot.querySelector('#card__username').innerHTML = value;
}

get username() {
  return this._username;
}

set address(value) {
  this._address = value;
  if (this.shadowRoot)
    this.shadowRoot.querySelector('#card__address').innerHTML = value;
}

get address() {
  return this._address;
}

set isAdmin(value) {
  this._isAdmin = value;
  if (this.shadowRoot)
    this.shadowRoot.querySelector('#card__admin-flag').style.display = value == true ? "block" : "none";
}

get isAdmin() {
  return this._isAdmin;
}

```



### 속성 변화 관찰하기

 `attributeChangedCallback` 은 관찰된 속성이 바뀌면 호출됩니다. 따라서 우리는 속성이 바뀔 때 무슨 일이 일어나는지 정의해야 합니다. 다음을 포함하는 함수를 다시 쓰십시오.



```
attributeChangedCallback(attr, oldVal, newVal) {
  const attribute = attr.toLowerCase()
  console.log(newVal)
  if (attribute === 'username') {
    this.username = newVal != '' ? newVal : "Not Provided!"
  } else if (attribute === 'address') {
    this.address = newVal !== '' ? newVal : "Not Provided!"
  } else if (attribute === 'is-admin') {
    this.isAdmin = newVal == 'true';
  }
}

```



이제 우리의 컴포넌트 세팅을 완료하기 위해 사용할 템플릿을 만드십시오.

UserCard.html

```
<template id="user-card-template">
  <h3 id="card__username"></h3>
  <p id="card__address"></p>
  <p id="card__admin-flag">I'm an admin</p>
</template>

```

