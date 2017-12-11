---
layout : tutorials
category : tutorials
title : VueJS 가이드 4 - 계정 만들기 및 보기 (1/2)
subcategory : setlayout
summary : VueJS를 통한 애플리케이션 개발에 대해 알아봅니다.
permalink : /tutorials/weplanet/4create-list-accounts
author : danielcho
tags : vue javascript
title\_background\_color : F1F71A
---



> 본 포스팅은 [Matthias Hager](https://matthiashager.com) 의 [Vue.js Application Tutorial - Step 4: Create & View Accounts](https://matthiashager.com/complete-vuejs-application-tutorial/create-list-accounts)를 저자의 허락하에 번역한 글입니다. 오탈자, 오역 등이 있다면 연락부탁드립니다.



거의 모든 프로젝트 구조가 완료되었으므로 앱의 첫 번째 부분인 계정을 만들 차례이다. (드디어!) 이 모듈의 핵심은 사용자가 보유한 은행 또는 신용 계정을 나타내는 간단한 데이터 구조이다. 각 계정은 여러 트랜잭션에 연결되며 전체적인 잔액 및 기타 메타 데이터를 기록한다.

 

계정 객체는 결국 다음과 같이 나와야 한다.

 

```javascript
'jcijeojde88': {
    "id": "jcijeojde88",
    "category": "Credit Card",
    "name": "Chase Card"
    "balance": -237.94
}
```



ID를 객체의 키와 값으로 저장하는 것은 불필요한 것처럼 보일 수도 있다. 나중에 우리는 키가 없는 객체를 왔다갔다 쓸 것이며 객체 자체에 ID가 포함되어 있는 게 중요하다. ID를 객체 키로 사용하면 ID를 기반으로 객체를 쉽게 찾을 수 있게 해준다.

 

사용자가 할수 있어야 하는 것:

• 잔액이 나와 있는 모든 계정 목록 보기

• 계정 추가하기

• 계정 수정하기

• 계정 삭제하기

• 각 계정별로 필터링하고 그것에 연결된 모든 트랜잭션을 보기



그리고 지금은 이게 전부이다. 잠시 시간을 내서 애플리케이션의 이 섹션을 만드는데 필요한 첫 단계가 무엇인지 생각해보자.

 

생각해봤는가? 이것은 내가 생각해 낸 것들이다.

1. 저장소에 계정 객체를 추가하기 (인사이드-아웃으로 작업하고 있음을 기억하자)
2. 새 계정의 ID를 자동으로 생성하기
3. 필요한 컴포넌트가 사용자가 추가한 계정에 안전하게 액세스 할 수 있도록 인터페이스 만들기
4. 사용자가 취할 위의 각 작업에 대한 컴포넌트 만들기 (계정 추가, 계정 보기)
5. 각 컴포넌트에 대한 route 추가하기
6. 계정을 사용하여 애플리케이션의 탐색바 만들기 시작하기



이제 해야할 일에 대한 명확한 방향이 잡혔다. 시간을 갖고 앉아서 이 단계들에대해 생각해보는 건 실수를 피하고 효율적으로 작업하는데 중요하다!

 

Vuex는 언뜻 보기에는 매우 복잡해 보인다. 이 단순한 애플리케이션에 필요한 것보다 훨씬 구조적일수도있다. 그 생각에는 약간의 타당성이 있지만, 사후에 다 넣는 것보다좋은 인프라로 시작하는 것이 낫다. 또한 데이터베이스에 정보를 저장하고 데이터베이스에서 로드하는 방법을 구조화하는데도도움이 된다. 실제로 본다면 그것의 기능 및 장점이 더 명확해질 것이다.

 

이제 계정 객체를 추가하자.

 

```
// src/app/accounts/vuex/index.js

const state = {
  accounts: {}
};
```



스토어를 로드하는 방법 때문에 `state.accounts` 대신 `state.accounts.accounts`를 통해 이 계정 객체에 액세스 할 수 있다. 모든 계정을 `state.accounts`에 직접 로드할 수도 있겠지만 계정 레코드를 침해하지 않고서는 계정 모듈의 추가 정보를 저장할 수 없게 된다.

간단한 `mutation`을 만들어 계정을 추가할 것인데 먼저 해야 할게 있다. 추가할 계정마다 임의의 ID를 생성해야 한다. 여러 모듈에 사용을 할 것이기 때문에 소스 루트의 `utils.js` 파일에 간단한 [utility script](http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript) 를 넣어 사용할 것이다.

 

src/app/accounts/vuex/mutations.js

```
import { guid } from '../../../utils';

export default {
  ADD_ACCOUNT (state, payload) {
    let id = guid();
    state.accounts[id] = Object.assign({ id: id }, payload.account);
  }
};
```



src/utils.js

```
// thanks to http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
export const guid = function () {
  function s4 () {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
};
```



우리의 `ADD_ACCOUNT` 기능에서 ID를 키로 새로운 계정을 추가하자. 또한 ID를 속성으로 추가한다. `Object.assign({id: id }, payload.account)`은 ID만으로 새 객체를 만든 다음 `Vuex` 액션이 mutation에 제출할 계정으로 확장한다. 그 다음에 action을 만든다.

 

```
// src/app/accounts/vuex/actions.js

export const addAccount = ({ commit }, data) => {
  commit('ADD_ACCOUNT', { account: data });
};
```



현재  `addAccount`가 하는 것은 데이터를 올바른 mutator로 전달하는 것뿐이다. 나중에 `localStorage`에 저장하는 것과 같은 비동기 작업을 수행해야 한다. 그때 되면 액션들이 왜 `Vuex`의 필수적인 부분인지 분명해질 것이다.

이제 스토어는 계정을 추가할 준비가 되었다. 이를 위해 사용자 인터페이스를 만들어야 한다. `CreateEditAccount.vue`라고 부르자. 우리의 `Account`와 같은 객체를 생성하거나 편집하는 것은 매우 비슷한 일이다. 같은 양식 필드를 사용하는 것이기 때문에 필자는 거의 항상 이 둘을 결합시킨다. 계정을 만들 수 있게 되면 편집 할 수 있는 기능도 추가하자. 새로운 view는 보기도 라우팅되어야 한다.

 

src/app/accounts/components/CreateEditAccount.vue

```
<template>
  <div id="accounts-create-edit-view">
    You can create and edit accounts with me, yippee!
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'accounts-create-edit-view',

  methods: {
    ...mapActions([
      'addAccount'
    ])
  }
};
</script>

<style scoped lang='scss'>
#accounts-create-edit-view {
}
</style>
```



src/app/accounts/components/index.js

```
export { default as AccountsListView } from './AccountsListView';
export { default as CreateEditAccount } from './CreateEditAccount';
```



src/app/accounts/routes.js

```
...
export default [
  {
    path: '/',
    component: components.AccountsListView
  },
  {
    path: '/accounts/create',
    component: components.CreateEditAccount
  }
];
```



이제 `/accounts/create`를 들어가면 계정 생성에 대한 멋진 메시지를 볼 수 있을 것이다. 지금은 사실상 계정 목록 페이지를 홈페이지로 사용하고 있는거지만 URL 생성 시작 부분에 `/accounts`를 추가 한다. 

