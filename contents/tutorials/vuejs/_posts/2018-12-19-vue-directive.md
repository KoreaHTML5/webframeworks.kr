---
layout : tutorials
title :  [VueJs로 만드는 todoList] #6 vue directive
category : tutorials
subcategory : setlayout
summary : vue directive에 대해 알아봅시다.
permalink : /tutorials/vuejs/vue-directive
tags : javascript vuejs
author : ryanjang
---

## vue directive란? 
directive를 직역하면 지령이란 뜻이죠?  
vue 엘리먼트 속성으로 사용되는 vue directive는 엘리먼트에게 뜻 그대로 지령을 내립니다.  
그럼 어떤 지령을 내리는지 알아봐야 하는데 그건 아래에 나열된 종류에 따라 다른 지령을 내립니다.  
 - v-text, v-html, v-show, v-if, v-else, v-else-if, v-pre, v-cloak, v-once
 - vue-directive custom  

이제 차례대로 하나식 알아보죠.    
  
### v-text
첫번째로 v-text입니다.  
엘리먼트에게 이 값을 텍스트로 보여줘라 라는 지령을 내립니다.  
아래 코드를 한번 같이 볼까요?

```html
/Main.vue
...
  <div class="mainTitle" style="padding: 15px;">
    <h2 v-text="title"></h2>
    <h5>오늘의 할일 {{todoList.length}}가지</h5>
  </div>
...
  data () {
    return {
      todoList: [],
      goal: 0,
      title: 'VueJs로 만드는 todoList'
    }
  }
...
```

기존에 있던 Main.vue 페이지에서 제목을 v-text 지시문으로 변경해보았습니다.  
v-text 속성 안에 data를 넣어주니 값을 텍스트로 보여주고 있죠?   

### v-html 
이번엔 v-html입니다.  
v-text를 보고 나니 바로 감이 오지 않나요?  
그렇습니다. 이것은 html data를 전달하면 화면에 출력해줍니다.  

```html
/Main.vue
...
  <div class="mainTitle" style="padding: 15px;">
    <h2 v-text="title"></h2>
    <h5>오늘의 할일 {{todoList.length}}가지</h5>
    <div v-html="mindControl"></div>
  </div>
...
  data () {
    return {
      todoList: [],
      goal: 0,
      title: 'VueJs로 만드는 todoList',
      mindControl: `<h6 style="color: red">오늘 할 일을 내일로 미루지 말자</h6>`
    }
  }
...
```

전달받은 html 데이터를 화면에 출력해주는걸 확인하셨나요?  

### v-show
이것도 이름에서 느낌이 바로 오시죠?  
show! 보여줄지 말지를 boolean값으로 결정할 수 있습니다.  

```html
/Main.vue
...
  <div class="mainTitle" style="padding: 15px;">
    <h2 v-text="title"></h2>
    <h5>오늘의 할일 {{todoList.length}}가지</h5>
    <div v-show="showBoolean" v-html="mindControl"></div>
  </div>
...
  data () {
    return {
      todoList: [],
      goal: 0,
      title: 'VueJs로 만드는 todoList',
      mindControl: `<h6 style="color: red">오늘 할 일을 내일로 미루지 말자</h6>`,
      showBoolean: false
    }
  }
...
```

showBoolean값을 false로 전달하니 화면에서 사라졌죠?  
당연히 true로 데이터 값을 변경하면 보인답니다.  

그런데 이 기능은 어디선가 보시지 않으셨나요?  
[VueJs로 만드는 todoList] #2 vue component 편에서 v-if와 v-else-if, v-else에 대해 간단히 설명한 적이 있죠?  
기억이 안나시는 분들을 위해 간단히 다시 보여드릴게요.  

```html
/Main.vue
...
  <div class="mainTitle" style="padding: 15px;">
      <h2 v-text="title"></h2>
      <h5>오늘의 할일 {{todoList.length}}가지</h5>
      <div v-show="showBoolean" v-html="mindControl"></div>
      <div v-if="randomNum < 3">3보다 작군요.</div>
      <div v-else-if="randomNum >= 3 && randomNum < 7">3보다 크거나 같고 7보다 작군요.</div>
      <div v-else>7이거나 7보다 크군요.</div>
      <div>{{randomNum}}</div>
  </div>
...
  data () {
    return {
      todoList: [],
      goal: 0,
      title: 'VueJs로 만드는 todoList',
      mindControl: `<h6 style="color: red">오늘 할 일을 내일로 미루지 말자</h6>`,
      showBoolean: false,
      randomNum: Math.floor(Math.random() * 10)
    }
  }
...
```

이번엔 랜덤 함수를 통해 0 ~ 9까지의 숫자 중 아무 값을 뽑아서 그 값에 따라 어떤 엘리먼트를 렌더링 해줄건지에 대해 보여드렸습니다.   
v-if로 3보다 작다라는 조건을 걸고 그게 아니면 v-else-if로 다음 조건을 걸고 또 그게 아니면 v-else를 통해 출력해라라는 지령이 보이시나요?  

처음보시는 분들은 여기서 한가지 의문점이 생기실겁니다.  
v-show도 보여주고 안보여줄지를 판단하고 v-if도 똑같은 기능을 하는데 어떤걸 써야할까라는 생각을 하셨나요?  

이 속성들도 computed와 watch 처럼 목적에 따라 사용해주셔야 합니다.  
  
먼저 v-show 같은 경우는 일단 DOM에 렌더링이 됩니다.  
그 이후 조건에 따라 CSS display 속성으로 보여줬다 감췄다를 반복하는데요.  
v-if는 조건을 먼저 판별한 후 false일 경우는 렌더링 자체를 안합니다.  
그리고 조건이 변경되면 다시 렌더링하여 보여주는데요.  
이러한 차이 때문에 자주 변경되는 것들은 v-show를 활용하고 그게 아니라면 v-if를 사용하는 것이 좋다고 하네요.  

### v-pre
이 속성은 엘리먼트에 속한 내용들을 컴파일 하지 않고 그대로 사용자에게 보여주길 원할 때 사용합니다.    

```html
/Main.vue
...
  <div class="mainTitle" style="padding: 15px;">
      <h2 v-text="title"></h2>
      <h5>오늘의 할일 {{todoList.length}}가지</h5>
      <div v-show="showBoolean" v-html="mindControl"></div>
      <div v-if="randomNum < 3">3보다 작군요.</div>
      <div v-else-if="randomNum >= 3 && randomNum < 7">3보다 크거나 같고 7보다 작군요.</div>
      <div v-else>7이거나 7보다 크군요.</div>
      <div>{{randomNum}}</div>
      <div v-pre>{{이걸 보여주고 싶다!}}</div>
  </div>
...
```

간단하죠?  

### v-cloak
여러가지 속성들을 사용하다보단 어떠한 조건에 따라 엘리먼트들이 명령을 받고 화면에 출력을 하게 되는데 이러한 과정에서 보여지지 말아야 할 엘리먼트들이 보이는 경우가 가끔 있습니다.  
그럴 떄 v-cloak를 사용할 수 있는데요.  
깜박이는 엘리먼트에 v-cloak 속성을 넣고 CSS로 [v-cloak] {display: none;} 값을 설정해주기만 하면 끝입니다!  


### v-once
once... 한 번만 입니다.  
무엇이 한 번만 일까요?  
바로 해당하는 엘리먼트의 데이터를 한 번만 렌더링 합니다.  
이 후에 data가 변경되어도 초기에 셋팅한 그 값을 그대로 가지고 있습니다.  
이 속성도 마찬가지로 해당하는 엘리먼트에 그냥 넣어주기만 하면 돼요!  

### vue-directive custom 하기 
이번엔 만들고 싶은 지령을 한번 만들어 보겠습니다.  
먼저 src 폴더에서 directive 폴더를 만들고 그 안에 index.js 파일을 만들어주세요.  
그리고 다음의 코드를 넣어봅시다. 

```javascript
// directive/index.js

// import Vue from 'vue'

export const background = {
  bind (el, binding, vnode) {
    const color = binding.value || 'blue'
    if (el) {
      el.style.backgroundColor = color
    }
  }
}

// Vue.directive('my-background', background)

```

이렇게 정의한 directive를 Main.vue 파일에서 사용하기 위해 다음과 같이 수정해볼게요.  

```html
// Main.vue
...
    <div>{{randomNum}}</div>
    <div v-pre>{{이걸 보여주고 싶다!}}</div>
    <div style="width: 200px; height: 100px;" v-background="customColor">배경색</div>
...
import TodoList from './comp/TodoList'
import {background} from '../../directive'

export default {
  name: 'app',
  directives: {
    background
  },
  components: {
    TodoList
  },
  data () {
    return {
      todoList: [],
      goal: 0,
      title: 'VueJs로 만드는 todoList',
      mindControl: `<h6 style="color: red">오늘 할 일을 내일로 미루지 말자</h6>`,
      showBoolean: false,
      randomNum: Math.floor(Math.random() * 10),
      customColor: 'red'
    }
  },

```  
customColor 변수의 값이 index.js의 background 로 넘어가서 엘리먼트의 속성을 정의해주고 있죠?
이런식으로 원하는 엘리먼트에 원하는 지령을 내릴 수 있답니다.  

## 정리
이번엔 vue-directive에 대해서 알아보았습니다.  
저도 각각의 속성별로 프로젝트를 진행하면서 많이 썼는데요.  
중요한 점은 이 속성을 썻는데 원하는 결과가 나온다고 막 쓰면 안됩니다.  
이 결과가 나오기 위한 속성 중 이 속성이 목적과 역할에 가장 부합한지 한번 더 고민해보시고 쓰신다면 더욱 훌륭한 어플리케이션을 만들어 낼 수 있습니다!    


