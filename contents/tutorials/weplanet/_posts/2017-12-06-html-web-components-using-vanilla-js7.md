---
layout : tutorials
category : tutorials
title : 바닐라 자바스크립트로 HTML 웹 컴포넌트 사용하기 (7/7)
subcategory : setlayout
summary : 바닐라 자바스크립트로 HTML 웹 컴포넌트 사용하기에 대해 알아봅니다.
permalink : /tutorials/weplanet/html-web-components-using-vanilla-js7
author : danielcho
tags : javascript 
title\_background\_color : F1F71A
---



> 본 포스팅은 [Ayush Gupta](https://ayushgp.github.io/)의 [HTML Web Component using Vanilla JavaScript Part3](https://ayushgp.github.io/html-web-components-using-vanilla-js-part-3/)를 저자의 허락하에 번역한 글입니다. 오탈자, 오역 등이 있다면 연락부탁드립니다.

  



## 컴포넌트 사용하기

두개의 입력 element와 체크박스를 사용하여 index.html 파일을 만들고 구성 요소의 속성을 업데이트하기 위해 모든 것들에 onchange 메소드를 정의하십시오. 속성들이 업데이트 되자마자, DOM에도 그 변화들이 반영될 것입니다. 



```
<html>

<head>
  <title>Web Component</title>
</head>

<body>
  <input type="text" onchange="updateName(this)" placeholder="Name">
  <input type="text" onchange="updateAddress(this)" placeholder="Address">
  <input type="checkbox" onchange="toggleAdminStatus(this)" placeholder="Name">
  <user-card username="Ayush" address="Indore, India" is-admin></user-card>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/webcomponentsjs/1.0.14/webcomponents-hi.js"></script>
  <script src="/UserCard/UserCard.js"></script>
  <script>
    function updateAddress(elem) {
      document.querySelector('user-card').setAttribute('address', elem.value);
    }

    function updateName(elem) {
      document.querySelector('user-card').setAttribute('username', elem.value);
    }

    function toggleAdminStatus(elem) {
      document.querySelector('user-card').setAttribute('is-admin', elem.checked);
    }
  </script>
</body>

</html>

```



모든 브라우저들이 웹 컴포넌트를 지원하지 않기 때문에, 우리는 `webcomponents.js` 파일을 추가해야 합니다. 디렉토리에서 우리의 구성 요소를 가져오기 위해 HTML 가져오기 구문을 사용하는 것을 참고하십시오. 

이 코드를 실행하기 위해, 정적인 파일 서버를 만들어야 합니다. 어떻게 하는지 모를 경우, [static-server](https://www.npmjs.com/package/static-server)나 [json-server](https://github.com/typicode/json-server)같은 단순한 정적 서버를 사용할 수 있습니다. 이 튜토리얼을 위해, 다음을 사용하여 [static-server](https://www.npmjs.com/package/static-server)를 만드십시오:



```
$ npm install -g static-server
```



이제, cd를 이용해 index.html 파일이 있는 폴더로 이동하고, 다음을 사용하여 서버를 구동하십시오:



```
$ static-server
```



브라우저를 열고 [localhost:9080](http://localhost:9080/)로 이동하시면, 우리가 만든 구성 요소를 보실 수 있습니다. 



![web-components-part-3](https://user-images.githubusercontent.com/7992943/32566632-8b030bde-c4de-11e7-98ff-9be1534c2c2b.gif)



## 언제 속성을 사용하는지에 대하여

이전 포스트에서 우리는 자녀 (하위) 구성 요소를 위해 API를 만들었습니다. 이를 통해 부모(상위) 컴포넌트가 initialize되며, 자녀(하위) 컴포넌트와 인터렉션할 수 있었습니다. 이 경우에, 우리가 만약 이미 부모 또는 다른 함수을 사용하지 않고 직접 제공하기를 원하는 config를 가지고 있었다면, 우린 그렇게 하지 못했을 것입니다. 



속성들을 이용하면 그 초기 config를 매우 쉽게 제공할 수 있습니다. 그렇다면 이 config는 `constructor` 나`connectedCallback` 에서 추출되어 구성 요소를 initialize할 수 있습니다. 컴포넌트들과 인터렉션 하려고 속성을 바꾸는 것은 피곤할 수도 있습니다. 다량의 json 데이터를 그 구성 요소로 옮긴다고 생각해 봅시다. 그것은 json 데이터를 문자열 속성으로 나타내야 하고, 컴포넌트에 쓰여질 때 분석되어야 합니다. 



우리는 인터렉션이 가능한 웹 컴포넌트를 만들 수 있는 세 가지 방법이 있습니다. 

1. 속성만을 이용하기: 이것은 본 포스트에서 나온 접근입니다. 우리는 컴포넌트를 시작하고, 바깥 세상과 컴포넌트를 상호작용 하기 위해 속성들을 사용했습니다. 
2. 만들어진 기능만을 사용하기: 이것은 우리가 컴포넌트들을 위해 만들었던 기능만을 사용하여 컴포넌트들을 시작하고 컴포넌트들과 상호작용했던 파트 2에서 보았던 접근법입니다.
3. 섞인 접근법 사용하기: 제 생각에는 이 방법이 사용되어야 합니다. 이 접근법에서, 우리는 속성을 이용하여 컴포넌트들을 시작하고, 이후에 모든 상호 작용을 위해 API 콜이 사용됩니다. 



