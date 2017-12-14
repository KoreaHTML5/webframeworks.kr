---
layout : tutorials
category : tutorials
title : VueJS 가이드 6 - Vue.js 애플리케이션에 LocalStorage 추가하기 (1/3)
subcategory : setlayout
summary : VueJS를 통한 애플리케이션 개발에 대해 알아봅니다.
permalink : /tutorials/weplanet/6localstorage-vuejs1
author : danielcho
tags : vue javascript
title\_background\_color : F1F71A
---



> 본 포스팅은 [Matthias Hager](https://matthiashager.com) 의 [Vue.js Application Tutorial - Step 6: Adding LocalStorage to our Vue.js Application](https://matthiashager.com/complete-vuejs-application-tutorial/localstorage-vuejs)를 저자의 허락하에 번역한 글입니다. 오탈자, 오역 등이 있다면 연락부탁드립니다.



당신은 어떨지 모르겠지만 필자는 Budgeterbium을 로드하거나 변경할 때마다 계정 이름을 다시 입력하는 것이 썩 좋은 방법은 아니라고 생각한다. 이 부분을 고쳐보려고 한다.

 

우리는 서버를 사용하고 싶지 않기 때문에 사용자의 브라우저에 데이터를 저장한다. 물론 약간의 제약이 있지만 쉽고 어느 정도 안전하다. 로컬 스토리지의 상태는... 뭔가 부족하다랄까? 혼란스럽다고할까? 계속 변하는 상태라고 할까? 그래서 우리는 이 부분을  무시하고 간단한 JavaScript 플러그인을 사용하여 인터페이스를 만들어보려고 한다. `localForage`는 `IndexedDB`, `WebSQL` 및 `localStorage`에 단순하고 통일된 API를 제공한다.

 

`localForage`를 사용하여 데이터를 저장하고 검색하는데 필요한건 이게 전부이다.



```
localforage.setItem('key', 'francis scott?').then((value) => {
  console.log('woot! we saved ' + value);
}).catch((err) => {
  console.log('he\'s dead, jim!');
});

// next time we load the page we can do this
localforage.getItem('key').then((value) => {
  console.log('oh say can you see, ' + value);
}).catch((err) => {
  console.log('the rockets red glare has blinded me');
});
```



필요한건 이게 거의 전부이다.

 

데이터를 저장하기 전에 데이터베이스를 구성할 수 있다. `localForage`는 이름과 크기를 설정하게 해주고 3개의 저장 드라이버 옵션 중에서 선택할 수 있게 해준다. `IndexedDB`는 우리가 원하는 기본 값이니 아무 것도 할 필요가 없다.

 

3단계에서 `localForage`를 설치했으므로 데이터베이스를 구성할 수 있게 애플리케이션이 로드될 때 같이 로드하면 된다.



```
// src/main.js

import Vue from 'vue';
import localforage from 'localforage';
import 'bulma/css/bulma.css';

import { App } from './app';
import router from './router';
import store from './store';

localforage.config({
  name: 'budgeterbium'
});

...
```



이제 데이터를 저장할 준비가 되었다! 평소대로 코드를 작성하기 전에 생각을 먼저 해보자. 먼저 생각나는 것은 데이터 일관성 보장이다. 가장 좋은 방법은 데이터를 쓰거나 리콜하는 장소를 하나만 가지는 것이다. 우리는 이미 `vuex` 스토어를 가지고 있다. 완벽해 보인다.

 

우리가 `mutator`를 직접 호출하는 대신 액션을 사용하는 이유에 대해 이야기했을 때를 기억하는가? 가장 큰 이유는 액션은 비동기적일 수 있지만 `mutator`는 그럴 수 없다는 것이다. `IndexedDB`는 비동기적으로 작동하기 때문에 우리는 `mutator`에 데이터베이스 관련 코드를 넣으면 안된다. `mutator`는 `vuex` 스토어에서 정보를 저장하거나 가져오는데에만 쓰여야 한다. 데이터베이스에서 정보를 저장하고 가져오는 건 그 경계를 넘어서므로 액션을 사용하여 `mutator`를 호출하여 이것들과 관련된 다른 작업들도 수행하자.

 

각 `IndexedDB` 데이터베이스는 키 - 값 테이블로 구성된다. 각 객체 유형 (계정, 예산, 거래)별로 별도의 테이블을 사용하는 대신 키를 식별자에 추가할 것이다. 각 계정을 데이터베이스에 레코드 또는 키 - 값 쌍으로 저장할 것이다. 전체 `accounts` 개체를 단일 레코드로 저장할 수 있지만 그렇게 하면 `IndexedDB`의 몇 가지 이점과 기능을 무시하는 것이다. 또한. 각 항목을 자체 레코드로 저장하면 전체 목록을 커밋하지 않고도 개별 항목을 저장할 수 있다. ID가`2df9c687`인 계정은 `ACCOUNT-2df9c687` 키와 함께 저장되는 것이다.

 

사용자가 계정을 추가, 업데이트 또는 삭제할 때 이를 데이터베이스에 저장해야 한다. 지금 코드가 어떻게 생겼는지 보자.

```

// /src/app/accounts/vuex/actions.js

export const addAccount = ({ commit }, data) => {
  commit('ADD_ACCOUNT', { account: data });
};

export const updateAccount = ({ commit }, data) => {
  commit('UPDATE_ACCOUNT', { account: data });
};

export const deleteAccount = ({ commit }, data) => {
  commit('DELETE_ACCOUNT', { account: data });
};
```

 

이 정도면 간단하다- 각 액션은 해당 `mutator`를 사용하여 저장소에 커밋한다. 이 코드를 보는 동안 몇 가지 질문이 떠올랐다.

1. 로컬 스토리지에 저장하는 것은 비동기 작업이다. 저장하기 전 아니면 후에 스토어에 커밋 해야 할까?


2. 저장한 후에 커밋하면 저장한 후에 새 계정이 표시 될 것이라고 사용자에게 어떻게 알려줘야 할까?


3. 저장하기 전에 커밋하면 저장하는 동안 발생한 오류를 어떻게 처리해야할까?


4. 아직 생성된 ID가 없는데 커밋하기 전에 새 계정을 저장하려면 어떻게 해야 할까?



이전 또는 이후에 저장해야하는지에 대한 옳고 그른 대답은 없다. 이는 애플리케이션의 필요와 디자인에 따라 다르다. `Budgeterbium`에서는 서버가 응답하거나 스토리지에 저장할 때까지 기다림 없이 가능하면 모든 게 순간적으로 일어나는것을 원한다. 즉, 스토어에 먼저 커밋한 다음 사용자가 계속 애플리케이션을 사용하는 동안 스토리지에 저장한다는 뜻이다.

 



