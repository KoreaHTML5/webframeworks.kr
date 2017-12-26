---
layout : tutorials
category : tutorials
title : 바닐라 자바스크립트로 HTML 웹 컴포넌트 사용하기 (5/7)
subcategory : setlayout
summary : 바닐라 자바스크립트로 HTML 웹 컴포넌트 사용하기에 대해 알아봅니다.
permalink : /tutorials/weplanet/html-web-components-using-vanilla-js5
author : danielcho
tags : javascript 
title\_background\_color : F1F71A
---



> 본 포스팅은 [Ayush Gupta](https://ayushgp.github.io/)의 [HTML Web Component using Vanilla JavaScript Part2](https://ayushgp.github.io/html-web-components-using-vanilla-js-part-2/)를 저자의 허락하에 번역한 글입니다. 오탈자, 오역 등이 있다면 연락부탁드립니다.

  



### PersonDetail 컴포넌트

우리는 사람들의 이름을 정렬할` PeopleList` 컴포넌트를 만들었습니다. 그리고 우리는 구성 요소에서 사람들 이름이 클릭될 때 그 사람의 디테일을 보일 수 있는 컴포넌트 또한 만들고 싶습니다. 따라서, 지난 `UserCard` 튜토리얼에서 사용했던 구성 요소를 재사용합시다. 어떻게 이 구성 요소를 만드는지에 대한 디테일까지는 들어가지 않겠지만, 그냥 그 코드를 여기에 추가하십시오. 지난 포스트에서 이것에 대해서 더 읽어 보실 수 있습니다. 





#### 템플릿

`PersonDetail.html` 파일을 열고 다음의 코드를 입력하십시오:

```
<template id="person-detail-template">
  <link rel="stylesheet" href="/components/PeopleController/PersonDetail/PersonDetail.css">
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
<script src="/components/PeopleController/PersonDetail/PersonDetail.js"></script>
```





#### 스타일링 

우리의 카드의 템플릿을 만들었습니다. 이제 CSS를 이용해서 스타일링해 봅시다. UsedCard 폴더에서 다음의 내용을 입력하여 새로운 `PersonDetail.css` 파일을 만들어 봅시다: 

```
.card__user-card-container {
  text-align: center;
  border-radius: 5px;
  border: 1px solid grey;
  font-family: Helvetica;
  margin: 3px;
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





#### 컴포넌트 작성

`/components/PeopleController/PersonDetail/PersonDetail.js` 파일을 만들고 다음 코드를 입력하여 `PeopleDetail` 컴포넌트에 아래의 코드를 넣어 기능을 추가하십시오.



```
(function () {
  const currentDocument = document.currentScript.ownerDocument;

  class PersonDetail extends HTMLElement {
    constructor() {
      // If you define a constructor, always call super() first as it is required by the CE spec.
      super();

      // Setup a click listener on <user-card>
      this.addEventListener('click', e => {
        this.toggleCard();
      });
    }

    // Called when element is inserted in DOM
    connectedCallback() {
      const shadowRoot = this.attachShadow({ mode: 'open' });
      const template = currentDocument.querySelector('#person-detail-template');
      const instance = template.content.cloneNode(true);
      shadowRoot.appendChild(instance);
    }

    // Creating an API function so that other components can use this to populate this component
    updatePersonDetails(userData) {
      this.render(userData);
    }

    // Function to populate the card(Can be made private)
    render(userData) {
      this.shadowRoot.querySelector('.card__full-name').innerHTML = userData.name;
      this.shadowRoot.querySelector('.card__user-name').innerHTML = userData.username;
      this.shadowRoot.querySelector('.card__website').innerHTML = userData.website;
      this.shadowRoot.querySelector('.card__address').innerHTML = `<h4>Address</h4>
      ${userData.address.suite}, <br />
      ${userData.address.street},<br />
      ${userData.address.city},<br />
      Zipcode: ${userData.address.zipcode}`
    }

    toggleCard() {
      let elem = this.shadowRoot.querySelector('.card__hidden-content');
      let btn = this.shadowRoot.querySelector('.card__details-btn');
      btn.innerHTML = elem.style.display == 'none' ? 'Less Details' : 'More Details';
      elem.style.display = elem.style.display == 'none' ? 'block' : 'none';
    }
  }

  customElements.define('person-detail', PersonDetail);
})()
```



`peopleList` 컴포넌트에서 사람이 클릭되었을 때 이 함수를 이용하여 컴포넌트를 업데이트할 수 있도록 `updatePersonDetails(userData)` 함수를 만들었습니다. 속성들을 사용하여 함수를 만들 수도 있었습니다. 



### 부모 컴포넌트 

이제 `PeopleList` 구성 요소와 `PersonDetail` 구성 요소를 갖추었으니, 부모 구성 요소인 `PeopleController` 를 만들어 봅시다. `PeopleController.html` 파일을 열고 템플릿을 만드십시오. HTML 가져오기를 이용하여 안에 있는 구성 요소를 모두 가져옵니다.

참고: HTML 가져오기는 기준에서 벗어나며 모듈 가져오기로 대체되어야 합니다. 이 튜토리얼의 목적을 위해 우리는 HTML 가져오기만을 쓸 것입니다. [MDN 블로그](https://hacks.mozilla.org/2015/06/the-state-of-web-components/)에서 더 많은 정보를 찾을 수 있으며, 그것들을 사용할 수 있습니다.



```
<template id="people-controller-template">
  <link rel="stylesheet" href="/components/PeopleController/PeopleController.css">
  <people-list id="people-list"></people-list>
  <person-detail id="person-detail"></person-detail>
</template>
<link rel="import" href="/components/PeopleController/PeopleList/PeopleList.html">
<link rel="import" href="/components/PeopleController/PersonDetail/PersonDetail.html">
<script src="/components/PeopleController/PeopleController.js"></script>
```



`PeopleController.css ` 파일을 열고 다음의 코드를 추가하십시오.



```
#people-list {
  width: 45%;
  display: inline-block;
}
#person-detail {
  width: 45%;
  display: inline-block;
}
```



`PeopleController.js` 파일을 열고 `PeopleController` 클래스를 만드십시오. 우리는 사용자들의 데이터를 얻기 위해 API를 호출할 것입니다. 이것은 이전에 정의한 두 가지 구성 요소를 이용할 것이고, PeopleList 구성 요소를 많이 만듦과 동시에 이 데이터의 첫 번째 사용자를 `PeopleDetail` 구성 요소의 시작 데이터로 제공할 것입니다.



```
(function () {
  const currentDocument = document.currentScript.ownerDocument;

  class PeopleController extends HTMLElement {
    constructor() {
      super();
      this.peopleList = [];
    }

    connectedCallback() {
      const shadowRoot = this.attachShadow({ mode: 'open' });
      const template = currentDocument.querySelector('#people-controller-template');
      const instance = template.content.cloneNode(true);
      shadowRoot.appendChild(instance);

      _fetchAndPopulateData(this);
    }
  }

  // Private functions here

  customElements.define('people-controller', PeopleController);
})()
```



이제 우리는 이 데이터를 API에서 가져 오고 자녀 컴포넌트를 많이 만들어야 합니다. 또 추가로, 우리는 `PersonDetail` 객체를 업데이트할 수 있도록 컴포넌트의 `PersonClicked` 이벤트를 기다려야 합니다. 즉, 우리는 아래 2개의 프라이빗 함수를 만들 수 있습니다. 

```
  function _fetchAndPopulateData(self) {
  let peopleList = self.shadowRoot.querySelector('#people-list');
  fetch(`https://jsonplaceholder.typicode.com/users`)
    .then((response) => response.text())
    .then((responseText) => {
      const list = JSON.parse(responseText);
      self.peopleList = list;
      peopleList.list = list;

      _attachEventListener(self);
    })
    .catch((error) => {
      console.error(error);
    });
}

function _attachEventListener(self) {
  let personDetail = self.shadowRoot.querySelector('#person-detail');

  //Initialize with person with id 1:
  personDetail.updatePersonDetails(self.peopleList[0]);

  // Watch for the event on the shadow DOM
  self.shadowRoot.addEventListener('PersonClicked', (e) => {
    // e contains the id of person that was clicked.
    // We'll find him using this id in the self.people list:
    self.peopleList.forEach(person => {
      if (person.id == e.detail.personId) {
        // Update the personDetail component to reflect the click
        personDetail.updatePersonDetails(person);
      }
    })
  })
}
```





## 컴포넌트 사용

이제 우리는 컴포넌트를 모두 갖추었으니, 프로젝트를 위해 사용해볼 수 있습니다. 이 튜토리얼을 위해서, index.html라는 새로운 HTML 파일을 만들고 다음의 코드를 입력하십시오.



```
<html>

<head>
  <title>Web Component Part 2</title>
</head>

<body>
  <people-controller></people-controller>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/webcomponentsjs/1.0.14/webcomponents-hi.js"></script>
  <link rel="import" href="./components/PeopleController/PeopleController.html">
</body>

</html>
```



모든 브라우저가 웹 컴포넌트를 지원하지 않으므로, 우리는 `mponents.js` 파일을 추가해야 합니다. 우리의 컴포넌트를 디렉토리에서 가져오기 위해 HTML 가져오기 구문을 쓰는 것을 참고하십시오. 



이 코드를 실행하기 위해, 우리는 정적인 파일 서버를 만들어야 합니다. 어떻게 하는지 모른다면, [`static-server`](https://www.npmjs.com/package/static-server)나 [`json-server`](https://github.com/typicode/json-server)같은 단순한 정적인 서버를 사용할 수 있습니다. 다음을 이용하여 `static-server`를 설치하십시오:



```
$ npm install -g static-server
```



이제, ` cd` 를 이용해 index.html 파일을 가지고 있는 폴더로 가서 다음을 이용해 서버를 구동하십시오:



```
$ static-server
```



브라우저를 열고 [localhost:9080](http://localhost:9080/)로 가면, 우리가 방금 만든 구성 요소를 볼 수 있습니다. 



제가 이 튜토리얼들과 함께 사용하기 위해 만든 [github repository](https://github.com/ayushgp/web-components-tutorial) 를 확인해보실 수 있습니다. 웹 컴포넌트를 사용하는 이 접근 방법에 대해 어떻게 생각 하시는지 알려주시고, 이 게시물 또는 여기에서 설명된 방법 등을 향상시킬 수 있는 방법에 대해서도 말해주십시오.

