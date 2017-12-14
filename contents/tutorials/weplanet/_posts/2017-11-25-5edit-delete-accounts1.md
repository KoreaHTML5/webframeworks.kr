---
layout : tutorials
category : tutorials
title : VueJS 가이드 5 - 계정 수정 및 삭제 (1/2)
subcategory : setlayout
summary : VueJS를 통한 애플리케이션 개발에 대해 알아봅니다.
permalink : /tutorials/weplanet/5edit-delete-accounts1
author : danielcho
tags : vue javascript
title\_background\_color : F1F71A
---



> 본 포스팅은 [Matthias Hager](https://matthiashager.com) 의 [Vue.js Application Tutorial - Step 5: Edit & Delete Accounts](https://matthiashager.com/complete-vuejs-application-tutorial/edit-delete-accounts)를 저자의 허락하에 번역한 글입니다. 오탈자, 오역 등이 있다면 연락부탁드립니다.



이제 모든 기존 계정을 추가하고 볼 수 있게 되었으므로, 트랜잭션으로 전환하여 사용자가 즉시 해당 계정을 만들고 보고 싶을 수 있다. 확실히 즉각적인 만족감을 채워 주긴 할 것이다. 하지만 계정에서 처리해야 할 작업이 남아있으니 안정된 장소에 도달하기 전에는 넘어가지 말자. 우리는 다음 단계로 넘어 가기 전에 하나의 섹션을 완성해야하는 모듈 방식으로 작업하고 있다는 것을 기억하자.

 

다음으로 사용자가 해야 할 일은 계정을 수정하는 것이다. 실제로 편집할 곳은 많지 않다. 이름이나 카테고리만 변경하면 된다. 생성 후 계정 잔액을 변경할 수 있도록 해야할까? 결국 사용자는 트랜잭션를 통해서만 잔액을 업데이트할 것이다. 지불 할 때 잔액을 줄이고 월급을 받으면 잔액을 늘려주는 식이다. 계정이 만들어지고, 최초의 잔액을 입력해고 나서는 사용자가 계정을 직접 수정할 수 없어야 한다. (이것은 프로그래밍 원리가 아닌 소프트웨어의 기능인 것이다.)

 

잔액이 없는 것 빼고는 편집 양식은 생성 양식과 동일하다. 하지만 동작하는 방식은 약간 다르다.`addAccount`를 원하지 않으니 새로운 `updateAccount`를 생성하자. 코드를 통해 생각하면서 `CreateEditAccount.vue`에서 변수명에 의문을 가질수도 있다. 지금 우리가 만들고 있는 계정의 이름은 `newAccount`이다. 단순화시키고 편집할 때 동일한 변수를 사용하는 게 좋다. 그 이름으로 남겨 둘 수 있으며 일단 편집 기능을 추가하면 기능이 변경되지 않는다. 하지만 나중에 이 코드를 다시 살펴보면 혼란스러울 수 있다.

 

이제 그 변화를 주기에 좋은 시간이다. IDE의 리팩토링 도구를 사용하거나 파일에서 검색/바꾸기를 써서 이름을 `selectedAccount`로 바꾸자.

 

우리는 인사이드-아웃으로 작업하기 때문에 계정을 편집하고 삭제하기 위해 뮤테이터/액션을 추가하는 것으로 시작한다.



src/app/accounts/vuex/mutations.js

```
export default {
  ADD_ACCOUNT (state, payload) {
    let id = guid();
    state.accounts[id] = Object.assign({ id: id }, payload.account);
  },

  UPDATE_ACCOUNT (state, payload) {
    state.accounts[payload.account.id] = payload.account;
  },

  DELETE_ACCOUNT (state, payload) {
    Vue.delete(state.accounts, payload.account.id);
  }
};
```



src/app/accounts/vuex/actions.js

```
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



우리는 계정 목록에서 편집 및 삭제 링크를 추가 할 것이다. 삭제 링크는 삭제를 확인한 다음 탐색(navigating)하지 않고 삭제한다. 수정 링크는 `CreateEditAccount` 컴포넌트를 사용할 편집 경로를 가리키는 것이다. 이를 위해 라우팅을 설치해야 한다.



src/app/accounts/components/AccountListView.vue

```
<template>
  <div id="accounts-list-view">
    I'm a list of accounts!

    <router-link :to="{ name: 'createAccount' }">Add an account</router-link>

    <ul>
      <li v-for="account, key in accounts">
        {{ account.name }}
        <span class="tag is-small is-info">{{ categories[account.category] }}</span>
        ${{ account.balance }}
        <a @click="confirmDeleteAccount(account)">Delete</a>
        <router-link :to="{ name: 'editAccount', params: { accountId: account.id } }">Edit</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { CATEGORIES } from '../../../consts';

export default {
  name: 'accounts-list-view',

  data () {
    return {
      categories: CATEGORIES
    };
  },

  methods: {
    // this imports our vuex actions and maps them to methods on this component
    ...mapActions([
      'deleteAccount'
    ]),

    confirmDeleteAccount (account) {
      // note that these are backticks and not quotation marks
      if (confirm(`Are you sure you want to delete ${account.name}?`)) {
        this.deleteAccount(account);
      }
    }
  },

  computed: {
    ...mapState({
      'accounts': state => state.accounts.accounts
    })
  }
};
</script>

<style scoped lang='scss'>
#accounts-list-view {
}
</style>
```



src/app/accounts/routes.js

```
import * as components from './components';

export default [
  {
    path: '/',
    component: components.AccountsListView,
    name: 'accountsListView'
  },
  {
    path: '/accounts/create',
    component: components.CreateEditAccount,
    name: 'createAccount' // note that we changed this since we are using separate routes for create and edit
  },
  {
    path: '/accounts/:accountId/edit', // the URL accepts an accountId parameter
    component: components.CreateEditAccount,
    name: 'editAccount'
  }
];
```



