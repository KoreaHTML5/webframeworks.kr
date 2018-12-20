---
layout : tutorials
title : VueJs로 만드는 todoList#8 filter & plugin 사용법
category : tutorials
subcategory : setlayout
summary : filter 및 plugin에 대해 알아봅시다.
permalink : /tutorials/vuejs/v-filter-plugin
tags : javascript vuejs
author : ryanjang
---

## filter
지난 블로그에서 리스트를 추가 및 삭제하는 기능을 구현했었죠?  
이번엔 기존 리스트 데이터나 추가되는 리스트의 데이터를 화면에 출력해줄 때 filter로 데이터를 변경해보겠습니다.  

```html
<template>
    <div>
        <div style="height: 50px; width: 100%">
            <button class="btn-dark float-right" style="margin-right: 150px;" @click="changeList">변경</button>
        </div>
        <div class="mainTable">
            <div>
                <input type="text" v-model="todo">
                <button class="btn btn-dark" @click="addList(todo)" style="margin: 5px 10px">추가</button>
                <button class="btn btn-danger" @click="deleteList(selectedGroup)">삭제</button>
            </div>
            <table class="table">
                <thead>
                    <tr>
                        <th>선택</th>
                        <th>인덱스</th>
                        <th>순번</th>
                        <th>오늘의 할일</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in todoList" :key="item.id">
                        <td><input type="checkbox" :value="index" v-model="selectedGroup"></td>
                        <td v-if="index === 0" @click="routeDetailPage">인덱스가 0이면 출력</td>
                        <td v-else-if="index ===1">인덱스가 1이면 출력</td>
                        <td v-else>인덱스가 0도 1도 아니면 출력</td>
                        <td>{{item.id | toData}}</td>
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
      changeList: Function,
      addList: Function,
      deleteList: Function
    },
    filters: {
      toData(v) {
        return 'id는 ' + v + '입니다.'
      }
    },
    data () {
      return {
        selectedGroup: [],
        todo: ''
      }
    },
    methods: {
      routeDetailPage () {
        this.$router.push({path: '/detail', query: {id: 1}})
      }
    }
  }
</script>   
```

먼저 script내에 filters를 추가하고 안에 필요한 메소드를 정의하면 됩니다.  
그 후 리스트 중 변경하고 싶은 데이터를 선택하고 그 데이터 뒤에 | (메소드 이름)을 추가하면 끝입니다.  

엄청 간단하죠?  

결과를 확인해보면 v-for문으로 반복을 돌면서 들어오는 데이터를 toData 메소드가 캐치하여 'id는 *입니다.'라고 출력해주고 있습니다.  


## modal plugin 사용해보기 
어플리케이션을 만들다보다면 다양한 플러그인을 참조하여 사용해야 할 경우가 생기기 마련입니다.  
그래서 제가 프로젝트 진행하면서 썼던 플러그인 중 모달 플러그인을 설명드리겠습니다.  

```javascript
//main.js
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import VModal from 'vue-js-modal'

Vue.use(VModal)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
```
먼저 main.js파일을 위와 같이 수정해보겠습니다.  
못보던게 생겼죠?  
vue-js-modal 플러그인을 참조하고 있으며 해당 플러그인을 사용하기 위해 Vue.use(VModal)을 정의해주었습니다.
  
vue-js-modal 플러그인을 참조하려면 어떻게 해야하는지 기억나시나요?  
네, npm install vue-js-modal로 모듈을 설치해야합니다.
모두 설치하셨으면 이제 사용하러 가봅시다.  

```html
//TodoList.vue
<template>
    <div>
        <div style="height: 50px; width: 100%">
            <button class="btn-dark float-right" style="margin-right: 150px;" @click="changeList">변경</button>
        </div>
        <div class="mainTable">
            <div>
                <input type="text" v-model="todo">
                <button class="btn btn-dark" @click="addList(todo)" style="margin: 5px 10px">추가</button>
                <button class="btn btn-danger" @click="showModal">삭제</button>
            </div>
            <table class="table">
                <thead>
                    <tr>
                        <th>선택</th>
                        <th>인덱스</th>
                        <th>순번</th>
                        <th>오늘의 할일</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in todoList" :key="item.id">
                        <td><input type="checkbox" :value="index" v-model="selectedGroup"></td>
                        <td v-if="index === 0" @click="routeDetailPage">인덱스가 0이면 출력</td>
                        <td v-else-if="index ===1">인덱스가 1이면 출력</td>
                        <td v-else>인덱스가 0도 1도 아니면 출력</td>
                        <td>{{item.id | toData}}</td>
                        <td>{{item.todo}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <modal name="deleteConfirmModal" :width="300" :height="200">
            <div style="width: 300px; height:100px; padding: 60px 90px;">삭제하시겠습니까?</div>
            <div>
                <button class="btn btn-danger" style="margin-left: 70px; margin-right: 50px;" @click="modalClose('deleteConfirmModal')">아니오</button>
                <button class="btn btn-dark" @click="deleteList(selectedGroup)">네</button>
            </div>
        </modal>
        <modal name="errorModal" :width="300" :height="200">
            <div style="width: 300px; height:100px; padding: 60px 90px;">삭제할 대상을 선택해주세요.</div>
            <div>
                <button class="btn btn-danger" style="margin-left: 100px; margin-right: 50px;" @click="modalClose('errorModal')">알겠습니다.</button>
            </div>
        </modal>
    </div>
</template>

<script>
  export default {
    name: 'TodoList',
    props: {
      todoList: Array,
      changeList: Function,
      addList: Function,
      deleteList: Function
    },
    filters: {
      toData (v) {
        return 'id는 ' + v + '입니다.'
      }
    },
    data () {
      return {
        selectedGroup: [],
        todo: ''
      }
    },
    methods: {
      routeDetailPage () {
        this.$router.push({path: '/detail', query: {id: 1}})
      },
      modalClose (name) {
        this.$modal.hide(name)
      },
      showModal () {
        if (this.selectedGroup.length === 0) this.$modal.show('errorModal')
        else this.$modal.show('deleteConfirmModal')
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .mainTable {
        width: 50%;
        margin: auto;
    }
</style>
```  

```html
//Main.vue
<template>
    <div id="app">
        <div class="mainTitle" style="padding: 15px;">
            <h2 v-text="title"></h2>
            <p v-text="subTitle"></p>
            <h5>오늘의 할일 {{todoList.length}}가지</h5>
            <div v-show="showBoolean" v-html="mindControl"></div>
            <div v-if="randomNum < 3">3보다 작군요.</div>
            <div v-else-if="randomNum >= 3 && randomNum < 7">3보다 크거나 같고 7보다 작군요.</div>
            <div v-else>7이거나 7보다 크군요.</div>
            <div>{{randomNum}}</div>
            <div v-pre>{{이걸 보여주고 싶다!}}</div>
            <div style="width: 200px; height: 100px;" v-background="customColor">배경색</div>
            <div>
                <input v-model="title" placeholder="제목을 입력해보세요.">
            </div>
            <div>
                <textarea  v-model="subTitle" placeholder="부제목 입력해보세요."></textarea>
            </div>
        </div>
        <todo-list :todoList="todoList" :changeList="changeList" :addList="addList" :deleteList="deleteList"></todo-list>
        <div class="bottomTitle" style="padding: 15px;">
            <h2>VueJs로 만드는 todoList</h2>
            <h5>이번주 목표 {{goal}}가지</h5>
        </div>
    </div>
</template>

<script>

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
      subTitle: 'VueJs로 만드는 todoList',
      mindControl: `<h6 style="color: red">오늘 할 일을 내일로 미루지 말자</h6>`,
      showBoolean: false,
      randomNum: Math.floor(Math.random() * 10),
      customColor: 'red'
    }
  },
  watch: {
    todoList (val, oldVal) {
      console.log(val, oldVal)
      this.goal = val.length * 7
    }
  },
  methods: {
    changeList () {
      this.todoList = this.todoList.splice(0, this.todoList.length - 1)
    },
    addList (v) {
      this.todoList.push({id: this.todoList.length + 1, todo: v})
    },
    deleteList (selectedGroup) {
      selectedGroup.forEach(v => {
        this.todoList.splice(v, 1)
      })
      this.$modal.hide('deleteConfirmModal')
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
삭제는 기능 중에서도 중요한 기능이죠?  
보통은 꼭 삭제할건지 재확인을 하는데요.  
저희도 삭제하기 전 삭제할건지 확인을 해보겠습니다. 

우선 기존에는 삭제버튼을 누르면 바로 삭제가 되었어요.  
하지만 이젠 우린 모달을 쓸 수 있습니다.  
삭제 버튼에 @click 이벤트를로 showModal이라는 메소드를 호출해봅시다.  

그리고 해당 메소드에서 this.$modal.show(모달이름)으로 모달을 호출했는데요.
우선 호출할 모달을 만들어야겠죠?

TodoList.vue 파일의 template 하단에 모달 태그로 모달의 내용을 넣어봤습니다.  
삭제하시겠습니까? 라는 문구와 함께 아니요, 예 라는 버튼이 있습니다.  

아니오를 선택했을 경우는 modalClose 메소드를 호출하여 this.$modal.hide(모달이름) 메소드로 모달창을 닫게 해주었고,
예를 선택했을 경우에는 기존에 deleteList 메소드를 호출해서 selectedGroup에 담긴 인덱스 요소에 해당하는 리스트를 삭제해주었습니다.  

이 과정을 작성하다 보니 selectedGroup에 데이터가 없는 경우가 있더군요,  
그래서 모달을 하나 더 만들었습니다.  

삭제 버튼을 클릭했을 때 selectedGroup에 인덱스 데이터가 담겨있는지 확인한 후 담겨 있지 않으면 errorModal을 담겨있다면 deleteComfirmModal 창을 보여주었습니다.  
모달 이름은 modal 태그안에 name 속성으로 정의하였으면 모달의 크기는 :width와 :height로 바인딩 해주었습니다. 

추가로 한가지 팁을 드리자면 modal 태그 내에 @closed 이벤트를 사용하면 모달창이 닫힐 때 이벤트를 실행할 수 있어요!

```html
...
<modal name="deleteConfirmModal" :width="300" :height="200" @closed="initSelectedGroup">
    <div style="width: 300px; height:100px; padding: 60px 90px;">삭제하시겠습니까?</div>
    <div>
        <button class="btn btn-danger" style="margin-left: 70px; margin-right: 50px;" @click="modalClose('deleteConfirmModal')">아니오</button>
        <button class="btn btn-dark" @click="deleteList(selectedGroup)">네</button>
    </div>
</modal>
...
methods: {
  routeDetailPage () {
    this.$router.push({path: '/detail', query: {id: 1}})
  },
  modalClose (name) {
    this.$modal.hide(name)
  },
  showModal () {
    if (this.selectedGroup.length === 0) this.$modal.show('errorModal')
    else this.$modal.show('deleteConfirmModal')
  },
  initSelectedGroup() {
    this.selectedGroup = []
  }
}
...

```  

이렇게 @closed안에 initSelectedGroup 메소드를 활용하여 모달창이 닫혔을 때 selectedGroup을 초기화 시켜주었습니다.
리스트를 삭제한다면 selectedGroup을 초기화 시켜주어야 다음 삭제시에 문제가 없겠죠?    

## 정리
오늘은 리스트에 필터를 사용하여 원하는 데이터로 변경하는 방법과 플러그인을 사용하여 모달창을 활용할 수 있는 방법에 대해 알아보았습니다.  
플러그인을 사용할 때는 일단 구글링을 해봐야하죠.  
npm + 사용하고 싶은 플러그인과 관련된 단어, 예를 들어 npm vue modal 이런식으로 검색하면 관련된 모듈들이 많이 나옵니다.  
그러면 가장 상단에 있는 것부터 하나씩 들여다보세요.  
문서는 잘 정리되어 있는지, 데모도 있다면 한번 보시구요.  
가장 중요하게 생각하는건 아무래도 사용자의 평가를 판단할 수 있는 git repository의 별이라고 생각합니다.  
아무래도 별이 많은 모듈은 그만큼 사용자도 많고 많은 사람들이 좋게 평가했다는 뜻이니까요.
1000개 이상이면 믿고 쓰는거라 생각합니다. ^^
오늘 내용을 토대로 편하고 유용한 플러그인들을 참조하여 좋은 어플리케이션을 개발하길 바랍니다!  
    


