---
layout : tutorials
category : tutorials
title : 바닐라 자바스크립트로 HTML 웹 컴포넌트 사용하기 (2/7)
subcategory : setlayout
summary : 바닐라 자바스크립트로 HTML 웹 컴포넌트 사용하기에 대해 알아봅니다.
permalink : /tutorials/weplanet/html-web-components-using-vanilla-js2
author : danielcho
tags : javascript 
title\_background\_color : F1F71A
---



> 본 포스팅은 [Ayush Gupta](https://ayushgp.github.io/)의 [HTML Web Component using Vanilla JavaScript](https://ayushgp.github.io/html-web-components-using-vanilla-js/)를 저자의 허락하에 번역한 글입니다. 오탈자, 오역 등이 있다면 연락부탁드립니다.

  

### 유저 데이터 렌더링

우리는 이제 `connectedCallback`  을 가지고 있습니다. shadow root 를 만들었고 템플릿의 클론을 이에 attach 했습니다. 이제 우리는 그 클론을 더 만들어보려고 합니다. 그러기 위해서, 우리의 `fetch` call에서  `render` 메소드을 call 했습니다. 이제 `render` 메소드와  `toggleCard` 메소드를 call할 것입니다. 



```
render(userData) {
  // Fill the respective areas of the card using DOM manipulation APIs
  // All of our components elements reside under shadow dom. So we created a this.shadowRoot property
  // We use this property to call selectors so that the DOM is searched only under this subtree
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
```



이제 구성 요소를 갖추었으므로, 프로젝트에 그들 모두 사용할 수 있습니다. 따라서 이 튜토리얼을 위해 `index.html` 라는 새로운 HTML 파일을 만들고 다음 코드를 입력해야 합니다:



```
<html>

<head>
  <title>Web Component</title>
</head>

<body>
  <user-card user-id="1"></user-card>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/webcomponentsjs/1.0.14/webcomponents-hi.js"></script>
  <link rel="import" href="./UserCard/UserCard.html">
</body>

</html>
```



모든 브라우저가 웹 컴포넌트를 지원하지는 않기 때문에, 우리는 webcomponents.js 파일을 추가해야 합니다. 우리의 구성 요소를 디렉토리에서 가져오기 위해 HTML import statement 를 사용한다는 것을 참고하십시오.

이 코드를 실행하기 위해, 정적 파일 서버를 만들어야 합니다. 어떻게 하는지 모를 경우 [`static-server`](https://www.npmjs.com/package/static-server)와 [`json-server`](https://github.com/typicode/json-server)같은 단순한 정적 서버를 만들 수 있습니다. 



```
$ npm install -g static-server
```



이제, `cd`  를 사용해 index.html 파일이 있는 폴더로 이동한 후 다음을 이용하여 서버를 실행하십시오:



```
$ static-server
```



브라우저를 열고 [localhost:3000](http://localhost:3000/)로 이동하시면, 우리가 방금 만든 구성 요소를 보실 수 있습니다:

