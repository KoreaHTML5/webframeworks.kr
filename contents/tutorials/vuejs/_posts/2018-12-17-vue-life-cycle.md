---
layout : tutorials
title :  [VueJs로 만드는 todoList] #4 vue life cycle
category : tutorials
subcategory : setlayout
summary : vue life cycle에 대해 알아봅시다.
permalink : /tutorials/vuejs/vue-router
tags : javascript vuejs
author : ryanjang
---

## Life cycle이란 무엇인가요? 
처음 들어보시는분들은 무척이나 생소하실겁니다.  
저도 처음 vue를 공부하기 시작했을 때 vue 문서를 보며 이게 도대체 무엇인지 전혀 이해가지 않았어요..   
우선  vue 가이드 문서에 있는 life cycle 다이어그램부터 볼까요?

![show-diagram](../imgs/img10.png)

여러분들은 이해가 가시나요?  
먼저 간략히 설명을 드리자면 페이지가 사용자에게 보여지기까지의 시점을 정리한 도표이며 각 시점별로 우리는 원하는 이벤트를 호출할 수 있습니다.    

이해가 가지 않으신다면 빨간색 테두리 안에 있는 시점(훅)별로 한번 설명을 드려 보겠습니다.  

### beforeCreate
다이어그램의 첫번째 시점이죠?  
당연히 모든 시점 중 가장 먼저 실행됩니다.  
하지만 여기선 컴포넌트내 정의한 메소드나 데이터가 생성되지 않아서 접근할 수가 없습니다.  
이 뜻은 여기서 뭔가 페이지에 필요한 메소드를 호출한다던지 필요한 데이터에 접근하여 수정하려하던지 하는 작업은 할 수가 없겠죠?  


### created
두번째부터는 데이터 및 메소드에 접근할 수 있습니다!  
하지만 아직 템플릿과 virtual Dom(가상돔)은 마운트되거나 렌더링 되지 않았습니다.  

### beforeMount
이 부분은 마운트 직전에 호출되는 부분인데 대부분의 사용자들이 이 시점에서 어떠한 작업도 안한다고 합니다. 
사실상 필요성을 못느끼는 부분이기도 하고 서버사이드 렌더링에서는 호출되지 않는 이유가 있네요.    

### mounted
모든 시점 중 이 훅이 제일 많이 사용된다고 합니다.  
왜냐하면 컴포넌트 및 데이터, 메소드 등 모두 접근이 가능하기 때문입니다.  
하지만 사용목적에 따라 created에서 data나 메소드에 접근하는 경우도 많으니 참고하세요.  

### beforeUpdate
단어 그대로 업데이트되기 전에 실행되는 훅입니다.  
그럼 어디가 업데이트 되기 전 일까요?  
바로 DOM입니다.  
data가 업데이트되면 DOM은 다시 렌더링 되고 패치되는데 이 시점 직전을 의미합니다.    

### updated   
이 훅은 data가 변경되고 DOM이 다시 렌더링 된 후를 의미합니다.  
해당 훅에서 실행하고 싶은 메소드나 접근하고 싶은 데이터가 있다면 이용하시면 됩니다.   

### beforeDestroy
destroy는 파괴하다라는 의미를 가지고 있죠?  
뜻과 유사하게 해당 페이지를 벗어나기 직전을 의미합니다.  
만약 어떤 페이지에서 다른페이지로 이동하는 순간에 어떤 액션을 취해줘야 할 경우가 생긴다면 유용하게 쓸 수 있겠죠?  

### destroyed
이 훅은 모든 인스턴스가 사라진 후에 실행되며, 서버사이드 렌더링시에는 호출되지 않는 훅입니다. 



이렇게 다이어그램에 있던 총 8가지 훅에 대해 간단히 알아보았습니다.  
그럼 실습을 통해 이해도를 더 높여 볼까요?  

우선 Main.vue 페이지에서 script 부분을 아래와 같이 변경해보겠습니다.  
  
```html
<script>

import TodoList from './comp/TodoList'

export default {
  name: 'app',
  components: {
    TodoList
  },
  data () {
    return {
      todoList: [
        {id: 1, todo: '아침 먹기'},
        {id: 2, todo: '점심 먹기'},
        {id: 3, todo: '저녁 먹기'}
      ]
    }
  },
  methods: {
    showListLength () {
      const length = this.todoList.length
      alert(length)
    }
  },
  beforeCreate () {
    console.log('beforeCreate')
  },
  created () {
    console.log('created')
  },
  beforeMount () {
    console.log('beforeMount')
  },
  mounted () {
    console.log('mounted')
  },
  beforeUpdate () {
    console.log('beforeUpdate')
  },
  updated () {
    console.log('updated')
  },
  beforeDestroy () {
    console.log('beforeDestroy')
  },
  destroyed () {
    console.log('destroyed')
  }
}
</script>
```  
 
훅 별로 실행되는지 확인하기 위해 개발자 도구 창을 열어서 console 탭을 열어보세요.  
그리고 새로고침을 하면 어떤 훅이 실행되었는지 확인되시나요?  
눈에 보이진 않지만 총 4가지 beforeCreate, created, beforeMount, mounted가 상기 설명드린 시점에 실행되었습니다.  
  
그럼 나머지 4가지도 확인해볼까요? 
먼저 beforeUpdate, updated를 확인해보겠습니다.

```html
// Main.vue
<template>
    <div id="app">
        <div class="mainTitle" style="padding: 15px;">
            <h2>VueJs로 만드는 todoList</h2>
        </div>
        <todo-list :todoList="todoList" :changeList="changeList"></todo-list>
    </div>
</template>
<script>

import TodoList from './comp/TodoList'

export default {
  name: 'app',
  components: {
    TodoList
  },
  data () {
    return {
      todoList: [
        {id: 1, todo: '아침 먹기'},
        {id: 2, todo: '점심 먹기'},
        {id: 3, todo: '저녁 먹기'}
      ]
    }
  },
  methods: {
    changeList () {
      this.todoList = [
        {id: 2, todo: '점심 먹기'},
        {id: 3, todo: '저녁 먹기'}
      ]
    }
  },
  beforeCreate () {
    console.log('beforeCreate')
  },
  created () {
    console.log('created')
  },
  beforeMount () {
    console.log('beforeMount')
  },
  mounted () {
    console.log('mounted')
  },
  beforeUpdate () {
    console.log('beforeUpdate')
  },
  updated () {
    console.log('updated')
  },
  beforeDestroy () {
    console.log('beforeDestroy')
  },
  destroyed () {
    console.log('destroyed')
  }
}
</script>

// TodoList.vue
<template>
    <div>
        <div style="height: 50px; width: 100%">
            <button class="btn-dark float-right" style="margin-right: 150px;" @click="changeList">변경</button>
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
```

Main.vue 파일에서 기존에 있던 showListLength 메소드 대신 chaneList라는 메소드로 변경해주었고, 그 메소드를 자식컴포넌트로 전달하여 메소드를 실행할 수 있게 하였습니다.     
새로생긴 변경 버튼을 클릭해보세요.  
리스트가 변경된 것이 확인되나요?  

그럼 이제 콘솔창을 확인해봐야겠죠?  
beforeUpdate와 updated 훅이 실행되었습니다.

다음은 beforeDestroy와 destroyed입니다.  
이 부분은 바로 전에 배웠던 router를 활용하면 확인할 수 있습니다.   
그럼 1번째 리스트 인덱스 부분을 클릭해볼까요?  

콘솔창에 beforeDestroy와 destroyed가 찍혔죠?  
이것은 페이지가 이동되면서 이동 전의 페이지가 닫기면서(destroy) 실행된 것입니다.  

## 정리
이렇게 총 8가지 훅에 대해 알아보았습니다.  
이 훅을 잘 이용하시면 서버로부터 데이터를 받는 시점, 사용자가 데이터를 수정하는 시점, 다음 페이지로 이동하는 시점 등등에서 메소드를 활용하여 
원하시는 어플리케이션을 만드는데 훨씬 수월하게 개발하실 수 있을거에요.  
지금 당장 이해가 되지 않아도 충분히 괜찮습니다.  
컴포넌트별로 기능을 개발하다보면 이런 시점에 이런 기능을 해야하는데 어떻게 하지 라는 의문이 생길거에요.  
그럴 때 이 훅을 참조하면서 사용하시면 훨씬 더 이해가 잘 될 겁니다!    
