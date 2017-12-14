---
layout : tutorials
category : tutorials
title : VueJS 가이드 5 - 계정 수정 및 삭제 (2/2)
subcategory : setlayout
summary : VueJS를 통한 애플리케이션 개발에 대해 알아봅니다.
permalink : /tutorials/weplanet/5edit-delete-accounts2
author : danielcho
tags : vue javascript
title\_background\_color : F1F71A
---



> 본 포스팅은 [Matthias Hager](https://matthiashager.com) 의 [Vue.js Application Tutorial - Step 5: Edit & Delete Accounts](https://matthiashager.com/complete-vuejs-application-tutorial/edit-delete-accounts)를 저자의 허락하에 번역한 글입니다. 오탈자, 오역 등이 있다면 연락부탁드립니다.



이제 사용자는 목록에서 계정을 삭제할수 있다. 그리고 삭제하기 전에 확인 메시지가 보여질 것이다. 그리고 편집 페이지로 이동할 수 있다. 그 페이지는 계정을 로드하지 않고 생성 페이지와 같은 빈 양식으로 표시된다. 이제 URL 파라미터로 편집하려는 계정의 ID를 수신하고 있다. 그걸 가지고 계정을 조회 할 수 있다.

 

먼저 ID를 기반으로 실제 계정을 로드해야 한다. 이미 전체 계정 목록을 로드할 수 있는 방법이 있다. 그렇게 하고`CreateEditComponent`에서 조회하려고 한다. 이 해결책에는 두 가지 문제가 있다. 1) Vuex의 원리 중 하나이자 전반적으로 좋은 프로그래밍 습관은 컴포넌트에게 실제로 액세스해야하는 데이터에만 액세스하도록 하는 것이다. `CreateEditComponent`는 전체 계정 목록을 필요로 하지 않고 편집 중인 계정 목록만 필요하다. 2) ID를 기반으로 하나의 계정만 가져와야하는 경우가 있을 수도 있다. 그 기능을 중앙 장소로 옮기는 것이 낫지 않을까?

 

그렇게 하자. Vuex를 사용하여 ID를 기반으로 계정을 가져온 다음 이를 컴포넌트로 전달해 보자. 스토어 내 어디로 가야할까? 아무것도 mutate 하거나 액션을 넣지 않으며, 단순히 목록에서 값을 얻는다. Vuex는 이를 위해 완벽한 `getters` 기능을 제공한다. `accounts/vuex` 디렉토리에 `getters.js`를 추가하고 스토어에 로드하자. 그런 후 `CreateEditComponent`를`UpdateAccountaction`에 연결해서 편집할지, 생성할지를 결정하기 위해 컴포넌트가 로딩되었을 때 `accountId` 파라미터를 찾는 것이다.



src/app/accounts/vuex/getters.js

```
export default {
  getAccountById: (state, getters) => (accountId) => {
    return state.accounts && accountId in state.accounts ? state.accounts[accountId] : false;
  }
};
```



src/app/accounts/vuex/index.js

```
import * as actions from './actions';
import getters from './getters';
import mutations from './mutations';

const state = {
  accounts: {}
};

export default {
  state,
  actions,
  mutations,
  getters
};
```



src/app/accounts/components/CreateEditAccount.vue

```
<template>
  <div id="accounts-create-edit-view">
    You can create and edit accounts with me, yippee!

    <router-link :to="{ name: 'accountsListView' }">View all accounts</router-link>

    <form class="form" @submit.prevent="processSave">
      <label for="name" class="label">Name</label>
      <p class="control">
        <input type="text" class="input" name="name" v-model="selectedAccount.name">
      </p>
      <label for="category" class="label">Category</label>
      <p class="control">
        <span class="select">
          <select name="category" v-model="selectedAccount.category">
            <option v-for="value, key in categories" :value="key">{{ value }}</option>
          </select>
        </span>
      </p>
      <label for="balance" class="label">Balance</label>
      <p class="control">
        <input type="text" class="input" name="balance" v-model="selectedAccount.balance">
      </p>
      <div class="control is-grouped">
        <p class="control">
          <button class="button is-primary">Submit</button>
        </p>
        <p class="control">
          <router-link :to="{ name: 'accountsListView' }"><button class="button is-link">Cancel</button></router-link>
        </p>
      </div>
    </form>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { CATEGORIES } from '../../../consts';

export default {
  name: 'accounts-create-edit-view',

  data: () => {
    return {
      categories: CATEGORIES,
      selectedAccount: {},
      editing: false
    };
  },

  mounted () {
    if ('accountId' in this.$route.params) {
      let selectedAccount = this.getAccountById(this.$route.params.accountId);
      if (selectedAccount) {
        this.editing = true;
        this.selectedAccount = selectedAccount;
      }
      // TODO: the object does not exist, how do we handle this scenario?
    }
  },

  methods: {
    ...mapActions([
      'addAccount',
      'updateAccount'
    ]),

    resetAndGo () {
      this.selectedAccount = {};
      this.$router.push({ name: 'accountsListView' });
    },

    saveNewAccount () {
      this.addAccount(this.selectedAccount).then(() => {
        this.resetAndGo();
      });
    },

    saveAccount () {
      this.updateAccount(this.selectedAccount).then(() => {
        this.resetAndGo();
      });
    },

    processSave () {
      this.editing ? this.saveAccount() : this.saveNewAccount();
    }
  },

  computed: {
    ...mapGetters([
      'getAccountById'
    ])
  }
};
</script>

<style scoped lang='scss'>
#accounts-create-edit-view {
}
</style>
```



하나의 문제를 제외하고 모든 게 잘된다. 이 문제점을 찾아보자. 이것을 보여주는 아래 gif는 무시하자! 



다음을 시도해보자. 계정을 수정하기 시작하고 이름을 변경한 다음, 저장하지 않고 계정 목록에서 취소하고 나와 보자. 편집 내용이 남아있는가?



![](https://matthiashager.com/user/pages/complete-vuejs-application-tutorial/edit-delete-accounts/budgeterbium-editing-store-object.gif)이를 통해 스토어 내의 계정 오브젝트를 우린 직접 수정하고 있다는 것을 확인할 수 있다. 사실 이는 우리가 원했던 방식은 아니다. 일단 우리가 수정할 수 있는 오브젝트를 복사한다. 우린 직접 클론을 만들 수 있지만, 사실 우린 2개의 필드만 사용자가 수정할 수 있도록 해주면 된다. 우린 사용자가 계정 잔액을 직접 수정하길 원하지 않는다. 즉, 계정의 타입과 이름만 알면 된다. 



src/app/accounts/components/CreateEditAccount.vue

```
<p class="control">
  <input type="text" class="input" name="balance" v-model="selectedAccount.balance" v-if="!editing">
  <span v-else>To update your balance, add a balance adjusting transaction.</span>
</p>

...

if (selectedAccount) {
  this.editing = true;
  this.selectedAccount = {
    name: selectedAccount.name,
    category: selectedAccount.category,
    id: selectedAccount.id
  };
}
```



GIT : [6c3e206](https://github.com/matthiaswh/budgeterbium/commit/6c3e2069912247509aa48f10c17fdbc606d2664e)