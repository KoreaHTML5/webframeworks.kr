---
layout : tutorials
title :  [VueJs로 만드는 todoList] #1 메인 페이지 레이아웃 및 Data binding
category : tutorials
subcategory : setlayout
summary : 메인 페이지 레이아웃 및 Data binding을 통해 DOM에 원하는 데이터를 출력해봅니다.
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

여기서 알아둬야 할 부분들은  
- npm i [npm 모듈 이름] --save로 필요한 라이브러리 모듈을 설치할 수 있으며, 설치한 모듈은 package.json에서 확인할 수 있다.  
- 그리고 main.js 파일에서 모듈을 import하면 라이브러리를 사용할 수 있다 정도입니다.  
참고로 main.js에서는 전역으로 사용할 라이브러리에 대해 참조하는게 좋습니다.
특정 페이지에서 필요한 경우 해당 컴포넌트에서 import하여 사용할 수 있습니다.
자세한 사용법은 npm [라이브러리 명]으로 검색하셔서 설정하는 방법을 참조하시면 좋을 듯 합니다.  

## 페이지 만들기

이제 todoList를 만들어 볼텐데요.  
일단 별다른 기능없는 제목과 테이블로 구성된 간단한 하나의 페이지를 만들어 봅시다.  
우선 App.vue파일을 열어서,  

```html
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

첫번째는 template으로 html소스들이 들어가며 vue문법을 통해서 data를 바인딩하거나 필요한 method를 실행할 수 있습니다.  

두번째는 script 부분인데 각종 라이브러리나 관련된 component, 또는 util 파일 등을 참조할 수 있으며, javascript로 페이지에 필요한 기능들을 명시할 수 있습니다.  
대부분의 기능을 추가하기 위한 작업들은 이 부분에서 진행되니 프로젝트를 진행하면서 자세히 설명드리겠습니다.  

세번째는 style로 현재 페이지에서 필요한 css를 추가할 수 있습니다.  
위에 보시면 class를 정의하고 template의 필요한 부분에 사용하고 있는 걸 알 수 있습니다.  

그리고 table 태그를 보시면 class="table"로 bootstrap 클래스를 참조하여 style한 것을 알 수 있습니다.  
main.js에 참조하였으니 모든 .vue 파일에서 bootstrap 클래스를 사용할 수 있습니다.

## Data binding
Data binding이란 VueJs의 binding expressions을 사용하여 script와 DOM간의 데이터를 주고받는 과정을 의미합니다.  
table 태그 내 데이터를 template내에 직접 작성하지 않고 script내에 데이터를 정의하여 template에 바인딩 해보도록 하겠습니다.

#### 단방향 바인딩
바인딩에는 단방향과 양방향 바인딩이 있는데, 우선 단방향 바인딩에 대해 알아보겠습니다.  
단방향 바인딩이란 말 그대로 바인딩을 한쪽 방향으로만 하는 것입니다.  
우선 App.js 파일을 다음과 같이 수정해보겠습니다.

```html
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
            <td>{{todo1}}</td>
          </tr>
          <tr>
            <td>2</td>
            <td>{{todo2}}</td>
          </tr>
          <tr>
            <td>3</td>
            <td>{{todo3}}</td>
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
  },
  data() {
    return {
      todo1: '아침 먹기',
      todo2: '점심 먹기',
      todo3: '저녁 먹기'
    }
  }
}
</script>

```

위와 같이 소스코드를 수정하여 결과를 확인해보셨나요?  
이전에 보이던 화면과 똑같음을 알 수 있습니다.   
즉 data 내에 데이터를 정의해주고 template에서 Mustache(이중 괄호문)으로 데이터를 바인딩해주면 됩니다.  
하지만, 보통 테이블을 쓸 때는 위와 같이 쓰기보다는 tbody의 내용을 반복문으로 돌려서 보여주는데요.  
이번엔 아래와 같이 수정해보겠습니다.
 
```html
<template>
  <div id="app">
    <div class="mainTitle">
      <h2>VueJs로 만드는 todoList</h2>
    </div>
    <div class="mainTable">
      <table class="table">
        <thead>
          <tr>
            <th>인덱스</th>
            <th>순번</th>
            <th>오늘의 할일</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in todoList" :key="item.id">
            <td>{{index}}</td>
            <td>{{item.id}}</td>
            <td>{{item.todo}}</td>
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
  },
  data() {
    return {
      todoList: [
        {id: 1, todo: '아침 먹기'},
        {id: 2, todo: '점심 먹기'},
        {id: 3, todo: '저녁 먹기'}
      ]
    }
  }
}
</script>

```

여기서는 todoList라는 데이터를 array로 정의하고 v-for문을 이용해 array에 포함된 데이터를 출력하였습니다.  
딱 보시면 감이 오셨겠지만 v-for는 array내 데이터를 반복으로 출력해주는 역할을 하며 item과 index로 데이터를 표현하고 있습니다.    
그 옆에 key는 엘리먼트의 재사용 및 재정렬에 필요한 힌트를 제공해주는 역할을 합니다. array 내 데이터 중 유니크한 값을 넣어주면 됩니다.  
key옆에는 : 표시가 있죠?  
이것은 v-bind: 의 약어인데 HTML 속성에는 Mustache(이중 괄호문)을 사용할 수 없어서 이와 같은 표현으로 사용합니다.

이 부분에서 조건문을 걸어서 테이블 내용을 다르게 출력해볼까요?
```html
 <tbody>
    <tr v-for="(item, index) in todoList" :key="item.id">
        <td v-if="index === 0">인덱스가 0이면 출력</td>
        <td v-else-if="index ===1">인덱스가 1이면 출력</td>
        <td v-else>인덱스가 0도 1도 아니면 출력</td>
        <td>{{item.id}}</td>
        <td>{{item.todo}}</td>
    </tr>
 </tbody>
```
이렇게 수정하면 인덱스의 조건에 따라 내용이 다르게 출력됨을 알 수 있습니다.  
v-if는 조건문으로 필요한 조건을 javascript로 작성하면 원하는 조건에 대해 원하는 내용을 보여줄 수 있습니다.  
비슷한 문법으로는 v-show가 있는데 마찬가지로 조건을 작성하면 원하는 내용만 출력할 수 있습니다.  
그렇다면 둘의 차이는 뭘까요?  
그것은 v-if 같은 경우는 조건이 일치하지 않을 때 DOM에 렌더링이 되지 않지만, v-show같은 경우는 조건이 참이든 거짓이든 일단 DOM에 렌더링 되며 그 이후 조건에 따라 CSS기반 토글형식으로 보여줍니다.  
이러한 차이점을 생각해봤을 때 v-if는 DOM에 사라졌다가 나타났다 하기 위한 토글비용이 높은 편이며, v-show는 초기 렌더링 비용이 높은 편이니 매우 자주 바뀐다면 v-show를 사용하는게 좋고 특정 조건에 따라 단순히 데이터를 보여주는 형식이면 v-if가 더 낫겠죠?  






