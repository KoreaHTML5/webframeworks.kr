---
layout : tutorials
title :  [VueJs로 만드는 todoList] #3 vue router
category : tutorials
subcategory : setlayout
summary : vue router 대해 알아봅시다.
permalink : /tutorials/vuejs/vue-router
tags : javascript vuejs
author : ryanjang
---

## vue-router란 무엇인가요?
컴포넌트별 주소를 맵핑하여 어떤 특정 액션이 있었을 때 그 주소로 이동하면 주소에 맵핑된 컴포넌트를 보여주는 역할을 합니다.  
어떤 역할인지 감이 오시나요?  
바로 실습을 하면서 자세히 알아봅시다.  

우선 npm install vue-router --save로 라이브러리를 설치해봅시다.  
모두 설치되셨나요?

그럼 vue-router를 설정할 폴더 및 파일과 전체적인 소스 디렉토리를 변경해보겠습니다.  
디렉토리와 파일명을 아래와 같이 변경해주세요.

```sh
├── README.md
├── babel.config.js 
├── package-lock.json
├── package.json 
├── public 
│   ├── favicon.ico
│   └── index.html
└── src
    ├── App.vue #변경
    ├── assets
    │   └── logo.png
    ├── components #변경
    │   └── main
    │       └── Main.vue #변경
    │       └── MainDetail.vue #변경
    │       └── comps
    │           └── TodoList.vue #변경
    ├── router
    │   └── index.js #변경
    │   └── main.js #변경  
    └── main.js #변경
```

디렉토리 및 파일을 추가, 변경하셨다면 차례대로 파일에 들어갈 소스를 알려드리면서 설명해보도록 하겠습니다.  
먼저 App.js 파일을 변경해보죠.  

```html
<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
  export default {
    name: 'app'
  }
</script>

<style>
    #app {
        width: 100%;
        height: 100%;
    }
</style>

```

기존에 있던 App.js 파일의 내용을 모두 지우고 router-view라는게 생겼죠?  
저 부분에서 이제 주소에 할당된 컴포넌트를 넣어서 보여줄겁니다.  
다음은 기존에 있던 App.vue의 내용을 main.vue로 복사 및 붙여넣기 해주시고 TodoList는 이전 내용 그대로 둡니다.    

그리고 리스트를 클릭했을 때 router를 통해 진입할 새로운 페이지인 MainDetail.vue 파일을 아래와 같이 추가해주세요.
```html
<template>
    <div id="app">
        <div class="mainTitle" style="padding: 15px;">
            <h2>1번째 할 일</h2>
        </div>
        <div style="margin: auto; width: 80%">
            1. 아침 먹기
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
        order: 0,
        content: ''
      }
    },
    methods: {
      showListLength() {
        const length = this.todoList.length
        alert(length)
      }
    }
  }
</script>

<style>
</style>

```

이제 vue-router를 사용하기 위해 설정을 해봅시다.  
먼저 router 폴더의 main.js파일입니다.  

```javascript
import Main from '../components/main/Main'
import MainDetail from '../components/main/MainDetail'

export default [
  {
    path: '/',
    component: Main
  },
  {
    path: '/detail',
    component: MainDetail
  }
]

```

페이지로 사용할 컴포넌트를 불러오고 그것을 경로 값에 따라 정의해주었습니다.  
간단하죠?  
 
그 다음은 index.js 파일을 보겠습니다.  
 
```javascript
import Vue from 'vue'
import Router from 'vue-router'
import main from './main'

Vue.use(Router)


const router = new Router({
  mode: 'history',
  routes: [...main],
  scrollBehavior(to, from, savedPosition) {
    if (to === from) {
      return savedPosition
    }
    return {x: 0, y: 0}
  }
})

export default router
```

처음에 설치한 vue-router를 import하여 정의합니다.     
그런 다음 vue.use를 통해서 정의한 모듈을 참조하고 Router에 대한 옵션을 설정해줍니다.  
옵션을 훑어보면 
- mode라는 것이 있는데 이것은 브라우져 내부 객체의 설정값 중 원하는 설정을 선택할 수 있으며 보통 history로 설정합니다.  
- routes는 잠시 후 소개할 component별 경로입니다.
- scrollBehavior는 스크롤에 따라 특정액션을 취할 수 있는 설정 값인데 기본값으로 설정해주었습니다.  

이렇게 설정한 index.js 파일은 상위 디렉토리의 main.js에서 참조해주기만 하면 사용할 준비가 끝납니다!

```javascript
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router
}).$mount('#app')

```

이제 설정은 끝났으니 사용해보기만 하면 되겠죠?  

그럼 TodoList.vue 파일에서 한번 사용해보도록 하죠.  

```html
<template>
    <div>
        <div style="height: 50px; width: 100%">
            <button class="btn-dark float-right" style="margin-right: 150px;" @click="showListLength">총 개수</button>
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
                    <td v-if="index === 0"><router-link :to="{path: '/detail'}">인덱스가 0이면 출력</router-link></td>
                    <td v-else-if="index ===1">인덱스가 1이면 출력</td>
                    <td v-else>인덱스가 0도 1도 아니면 출력</td>
                    <td>{{item.id}}</td>
                    <td>{{item.todo}}</td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
```

template내의 리스트 첫번째를 보시면 router-link가 새로 생겼습니다.  
저렇게 :to라는 속성으로 아까 router 폴더의 main.js 파일에 정의해두었던 경로 중 원하는 경로를 path 값에 할당해주면 됩니다.   
한 번 테스트 해보세요!  
잘 되나요?

그럼 router를 다른 방법으로도 사용해볼게요. 

```html
<template>
    <div>
        <div style="height: 50px; width: 100%">
            <button class="btn-dark float-right" style="margin-right: 150px;" @click="showListLength">총 개수</button>
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
                    <td v-if="index === 0" @click="routeDetailPage">인덱스가 0이면 출력</td>
                    <td v-else-if="index ===1">인덱스가 1이면 출력</td>
                    <td v-else>인덱스가 0도 1도 아니면 출력</td>
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
    name: 'TodoList',
    props: {
      todoList: Array,
      showListLength: Function
    },
    methods: {
      routeDetailPage() {
        this.$router.push({path: '/detail'})
      }
    }
  }
</script>
```

바로 느낌이 오시죠?  
클릭 이벤트를 통해서 메소드를 호출한 다음 this.$router.push()로 원하는 경로에 이동할 수 있습니다.      

보통 router를 사용하면서 가장 많이 사용하는 옵션이 query 입니다.  
우리는 router로 페이지를 이동하면서 그 페이지에 필요한 정보를 전달하는 경우가 있는데요.  
그럴 때 this.$router.push({path: '/detail', query: {id: 1}})와 같이 사용해보세요.  

수정 후 한번 확인해보셨나요?  
주소 뒤에 router에서 정의한 id값이 따라갔죠?  
이렇게 간단히 필요한 데이터도 보낼 수 있답니다.  

## 정리
오늘은 router에 대해 배워보았습니다.  
설정이 그렇게 어렵지 않았을 것 같습니다.(맞나요? ^^;)    
설정만 잘 하면 router-link나 메소드를 통해 페이지를 이동하는 것이 엄청 간편합니다.  
앞으로 너무나 자주 쓰이니 많은 도움이 되었으면 좋겠습니다.  
 
