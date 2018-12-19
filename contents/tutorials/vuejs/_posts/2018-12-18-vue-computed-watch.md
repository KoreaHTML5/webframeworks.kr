---
layout : tutorials
title :  [VueJs로 만드는 todoList] #5 vue computed VS watch
category : tutorials
subcategory : setlayout
summary : vue computed와 watch 속성에 대해 알아봅시다.
permalink : /tutorials/vuejs/vue-computed-watch
tags : javascript vuejs
author : ryanjang
---

## computed와 watch 
이번에 소개해드릴 부분은 computed와 watch라는 속성입니다.  
단어를 통해 느껴지는 부분은 무엇인가 계산한다거나 어떤 대상을 바라보고 있는 듯한 느낌이 들죠?  

그럼 computed부터 한번 살펴볼까요?

### computed
이 속성은 computed내에 종속되어 있는 데이터를 감시하다가 변경되는 부분이 발생하면 실행됩니다.  
예를 들어, a라는 데이터가 있는데 a가 변경됨에 따라 원하는 데이터로 변경하여 사용자에게 보여줄 때 사용합니다.  
사용 빈도가 매우 높은 편이니 실습을 통해 알아보겠습니다.  

```html
<template>
    <div id="app">
        <div class="mainTitle" style="padding: 15px;">
            <h2>VueJs로 만드는 todoList</h2>
            <h5>오늘의 할일 {{todoList.length}}가지</h5>
        </div>
        <todo-list :todoList="todoList" :changeList="changeList"></todo-list>
        <div class="bottomTitle" style="padding: 15px;">
            <h2>VueJs로 만드는 todoList</h2>
            <h5>이번주 목표 {{thisWeekGoal}}가지</h5>
        </div>
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
  computed: {
    thisWeekGoal () {
      return 7 * this.todoList.length
    }
  },
  methods: {
    changeList () {
      this.todoList = this.todoList.splice(0, this.todoList.length - 1)
    }
  }
}
</script>

<style>
    .mainTitle {
        padding: 15px;
    }
    .bottomTitle {
        padding: 15px;
        float: right
    }
</style>



```

위 예제는 오늘 할 일의 개수를 todoList.length를 통해 표현하고 이번주 목표 개수를 오늘 할 일의 개수에 7을 곱해주었습니다.  
오늘 할 일이 3가지이면 이번주 목표 개수는 21가지가 되겠죠?   

이렇게 리스트의 개수를 가지고 자동으로 이번주 목표 개수를 계산할 필요가 있다면 computed 속성을 이용할 수 있습니다.  
script내 computed속성을 추가하고 thisWeekGoal이라는 함수로 리스트 개수에 7을 곱하여 반환해주었습니다.  
이 함수는 template내에 원하는 곳에 삽입하였고 화면을 통해 결과를 확인하면 이번주 목표 개수가 출력된 것을 확인할 수 있습니다.  

아까 설명드렸다시피 computed는 종속된 데이터를 감시하고 있는다고 했죠?  
위에서 changeList의 메소드 내용을 조금 변경해 보았습니다. 
splice()라는 함수를 이용해서 todoList의 마지막 요소를 삭제해볼게요.  
todoList에 변경이 일어난다면 어떻게 될까요?
  
어디 한번 변경버튼을 눌러봅시다.  
무엇이 변경되었는지 확인되시나요?  
오늘의 할 일이 2가지로 변경됨에 따라 이번주 목표가 14가지로 변경되었습니다!  

하지만 제가 처음 이 속성을 접했을 때 그냥 메소드로 똑같이 사용하면 안될까라는 의문이 들었습니다.  
메소드로 똑같은 결과가 나오도록 바꿔보겠습니다.  

```html
<template>
    <div id="app">
        <div class="mainTitle" style="padding: 15px;">
            <h2>VueJs로 만드는 todoList</h2>
            <h5>오늘의 할일 {{todoList.length}}가지</h5>
        </div>
        <todo-list :todoList="todoList" :changeList="changeList"></todo-list>
        <div class="bottomTitle" style="padding: 15px;">
            <h2>VueJs로 만드는 todoList</h2>
            <h5>이번주 목표 {{thisWeekGoal()}}가지</h5>
        </div>
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
  computed: {
  },
  methods: {
    changeList () {
      this.todoList = this.todoList.splice(0, this.todoList.length - 1)
    },
    thisWeekGoal () {
      return 7 * this.todoList.length
    }
  }
}
</script>

<style>
    .mainTitle {
        padding: 15px;
    }
    .bottomTitle {
        padding: 15px;
        float: right
    }
</style>

```

이렇게 변경해도 결과는 똑같죠?  
하지만 당연히 차이가 있습니다.  
  
computed 속성은 종속 대상을 캐싱(저장)한다고 하네요.  
이 의미는 종속 대상이 변경될 때만 실행된다! 라는 점, 변경이 일어나지 않으면 절대로 업데이트 되지 않는다! 라는 점을 의미합니다.    
그렇다면 목적에 따라 computed를 사용해야 할 일이 분명 있음을 알 수 있습니다.   

### watch
watch 속성은 computed와 비슷한 기능을 합니다.  
watch는 특정 데이터를 바라보고 있다가 해당 데이터가 변경되면 실행됩니다.  

먼저 아래 코드를 한번 살펴 볼까요?

```html
<template>
    <div id="app">
        <div class="mainTitle" style="padding: 15px;">
            <h2>VueJs로 만드는 todoList</h2>
            <h5>오늘의 할일 {{todoList.length}}가지</h5>
        </div>
        <todo-list :todoList="todoList" :changeList="changeList"></todo-list>
        <div class="bottomTitle" style="padding: 15px;">
            <h2>VueJs로 만드는 todoList</h2>
            <h5>이번주 목표 {{goal}}가지</h5>
        </div>
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
      todoList: [],
      goal: 0
    }
  },
  watch: {
    todoList (newVal, oldVal) {
      console.log(newVal, oldVal)
      this.goal = newVal.length * 7
    }
  },
  methods: {
    changeList () {
      this.todoList = this.todoList.splice(0, this.todoList.length - 1)
    }
  },
  mounted () {
    this.todoList = [
      {id: 1, todo: '아침 먹기'},
      {id: 2, todo: '점심 먹기'},
      {id: 3, todo: '저녁 먹기'}
    ]
  }
}
</script>

<style>
    .mainTitle {
        padding: 15px;
    }
    .bottomTitle {
        padding: 15px;
        float: right
    }
</style>

```

script내의 watch 속성으로 todoList라는 함수를 정의했습니다.  
이렇게 컴포넌트에 있는 데이터 중 데이터가 변할 때를 감지하여 특정 이벤트를 호출하거나 다른 데이터의 값을 변경하고 싶을 때 그 데이터의 이름으로 함수를 정의하여 쓸 수 있는데요.  

지금 제가 watch 속성을 통해서 어떤 변화를 주고 있는지 느낌이 오시나요?  

우선 todoList의 초기값을 빈 배열로 설정하고 mounted 훅에서 초기값을 변경해주었습니다.  
이렇게 되면 watch에서 보고 있던 todoList 함수가 데이터 변경을 감지하고 실행됩니다.  

함수의 파라미터를 확인하면 newVal, oldVal이라고 되어있죠?  
newVal는 todoList가 변한 값이고, oldVal는 todoList가 변하기 전 값입니다.  

그럼 우리는 변한 값을 가져와서 데이터의 길이에 7을 곱해준 다음 goal이라는 변수에 할당해봅시다.  
이제 goal은 이번주 목표치가 되었습니다.  
화면에서 확인할 수 있죠?  
그리고 변경 버튼을 눌러 다시 todoList의 값을 변경해주면 바뀐 리스트의 길이에 따라 목표 개수가 달라지는 걸 확인할 수 있습니다.   

처음 접하신 분들은 computed 속성과 많이 닮아있는 느낌을 확실히 받으셨을 겁니다.  

그럼 두 속성은 어떤 차이가 있을까요?  


### computed와 watch의 차이점
두 속성은 비슷한 기능을 하지만 목적에 따라 명확히 구분해서 사용하는 것이 좋습니다.  
먼저 computed 같은 경우는 종속된 데이터가 변경됨에 따라 새로운 데이터를 변형해서 리턴해주죠?  
이런식으로 어떤 데이터를 받아서 다른 데이터를 가공하여 그 데이터를 사용자에게 보여줄 때는 computed 속성을 사용하는 것이 좋습니다.  
그 이유는 코드 반복이 더 적고 우수한 성능을 나타내기 때문이라고 합니다.      

그럼 watch는 언제 쓰면 좋을까요?   
특정 데이터(하나의 데이터)를 바라보다가 변경된 데이터로 어떤 로직을 수행해야 할 때가 적절합니다.  
computed 같은 경우는 종속된 데이터를 받아서 변형한 데이터를 리턴하지만 watch 같은 경우는 리턴할 필요없이 함수 내에서 필요한 메소드를 호출하거나 기존 데이터에 새로운 데이터를 정의할 수 있습니다.  


## 정리
이번엔 computed와 watch 속성에 대해 알아봤습니다.  
이해가 잘 되었는지 모르겠네요. ^^;  
공식 문서에 따르면 computed 속성을 사용할 수 있는 곳에 watch 속성을 사용하는 것은 바람직하지 않다라고 하네요.  
아무래도 성능에 이슈가 있기 때문이겠죠?  
상기 설명드린 바와 같이 각각의 목적에 알맞게 computed와 watch를 사용하는 것이 포인트인 것 같습니다!
