---
layout : tutorials
title :  VueJs로 TodoList 만들기를 시작합니다.
category : tutorials
subcategory : setlayout
summary : VueJs 프로젝트 셋팅에 필요한 기본적인 정보를 알아봅시다.
permalink : /tutorials/vuejs/getting-started
tags : javascript vuejs
author : ryanjang
---

## bootstrap 사용하기

bootstrap은 익숙하신 분들이 많으실텐데요.
반응형 웹사이트를 개발하기 위해 필요한 UI 프레임워크이죠.
그럼 사용하기 위한 설정을 해보겠습니다.
우선 터미널에서 npm i bootstrap jquery popper.js --save를 입력해줍니다.
그럼 package.json에 boostrap과 jquery, popper.js 모듈이 추가된 걸 확인하실 수 있습니다.

```json
"dependencies": {
    "bootstrap": "^4.1.3",
    "jquery": "^3.3.1",
    "popper.js": "^1.14.6",
    "vue": "^2.5.17"
  },
```

그런 다음 src 디렉토리의 main.js 파일을 열어서

```javascript
import Vue from 'vue'
import App from './App.vue'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')

```

위와 같이 import해주면 bootstrap을 사용하기 위한 설정이 끝납니다.
간단하죠?

여기서 알아둬야 할 부분들은 npm i [npm 모듈 이름] --save로 필요한 라이브러리 모듈을 설치할 수 있으며, 설치한 모듈은 package.json에서 확인할 수 있다.
그리고 main.js 파일에서 모듈을 import하면 라이브러리를 사용할 수 있다 정도입니다.
참고로 main.js에서는 전역으로 사용할 라이브러리에 대해 참조하는게 좋습니다.
특정 페이지에서 필요한 경우 해당 컴포넌트에서 import하여 사용할 수 있습니다.
자세한 사용법은 npm [라이브러리 명]으로 검색하셔서 설정하는 방법을 참조하시면 좋을 듯 합니다.  

## 기본 페이지 만들기

이제 todoList를 만들어 볼텐데요.
일단 별다른 기능없는 제목과 테이블로 구성된 간단한 하나의 페이지를 만들어 봅시다.
우선 App.vue파일을 열어서,

```vue
// src/App.vue

<template>
  <div id="app">
    <div class="mainTitle">
      <h2>VueJs로 만드는 todoList</h2>
    </div>
    <div class="mainTable">
      <table class="table">
        <thead>
          <tr>
            <th>순번</th>
            <th>오늘의 할일</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>아침 먹기</td>
          </tr>
          <tr>
            <td>2</td>
            <td>점심 먹기</td>
          </tr>
          <tr>
            <td>3</td>
            <td>저녁 먹기</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>

export default {
  name: 'app',
  components: {
  }
}
</script>

<style>
  .mainTitle {
    padding: 15px;
  }
  .mainTable {
    width: 50%;
    margin: auto;
  }
</style>


```

위와 같이 입력하면 화면에 간단한 제목과 함께 테이블이 생성된 걸 확인할 수 있는데요.
이렇게 파일의 내용 중 일부를 수정하면 vue Loader기능이 실행되어 새로고침 필요없이 자동으로 페이지를 수정해줍니다.
현재 App.vue 파일은 총 세가지로 나뉘어져 있죠?

첫번째는 template으로 html소스들이 들어가며 vue문법을 통해서 data를 삽입할 수 있습니다.

두번째는 script 부분인데 각종 라이브러리나 관련된 component, 또는 util파일을 참조할 수 있으며, javascript로 페이지에 필요한 기능들을 명시할 수 있습니다.
대부분의 기능을 추가하기 위한 작업들은 이 부분에서 진행되니 프로젝트를 진행하면서 자세히 설명드리겠습니다.

세번째는 style로 현재 페이지에서 필요한 css를 추가할 수 있습니다.
위에 보시면 class를 정의하고 template의 필요한 부분에 사용하고 있는 걸 알 수 있습니다.

그리고 table 태그를 보시면 class="table"로 bootstrap 클래스를 참조하여 style한 것을 알 수 있습니다.
main.js에 참조하였으니 모든 .vue 파일에서 bootstrap 클래스를 사용할 수 있습니다.    



