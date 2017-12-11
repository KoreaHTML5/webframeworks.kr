---
layout : tutorials
category : tutorials
title : VueJS 가이드 4 - 계정 만들기 및 보기 (2/2)
subcategory : setlayout
summary : VueJS를 통한 애플리케이션 개발에 대해 알아봅니다.
permalink : /tutorials/weplanet/4create-list-accounts2
author : danielcho
tags : vue javascript
title\_background\_color : F1F71A
---



> 본 포스팅은 [Matthias Hager](https://matthiashager.com) 의 [Vue.js Application Tutorial - Step 4: Create & View Accounts](https://matthiashager.com/complete-vuejs-application-tutorial/create-list-accounts)를 저자의 허락하에 번역한 글입니다. 오탈자, 오역 등이 있다면 연락부탁드립니다.





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

계정을 만드려면 사용자가 식별 이름, 카테고리 및 초기 잔액을 입력해야 한다. 그리고 선택할 수 있는 정적 카테고리 목록을 제공할 것이다. 아직 양식 유효성에 대해 걱정하지는 말자. 내가 추가한 계정을 볼 수 있기를 바랄테니 목록 페이지에서 계정을 보는 첫 번째 반복을 추가하고 `list`와 `create` 사이의 일부 탐색 링크를 추가하자.

 

src/app/accounts/components/CreateEditAccount.vue

```
<template>
  <div id="accounts-create-edit-view">
    You can create and edit accounts with me, yippee!

    <router-link :to="{ name: 'accountsListView' }">View all accounts</router-link>

    <form class="form" @submit.prevent="saveNewAccount">
      <label for="name" class="label">Name</label>
      <p class="control">
        <input type="text" class="input" name="name" v-model="newAccount.name">
      </p>
      <label for="category" class="label">Category</label>
      <p class="control">
        <span class="select">
          <select name="category" v-model="newAccount.category">
            <option v-for="value, key in categories" :value="key">{{ value }}</option>
          </select>
        </span>
      </p>
      <label for="balance" class="label">Balance</label>
      <p class="control">
        <input type="text" class="input" name="balance" v-model="newAccount.balance">
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
import { mapActions } from 'vuex';
import { CATEGORIES } from '../../../consts';

export default {
  name: 'accounts-create-edit-view',

  data: () => {
    return {
      categories: CATEGORIES,
      newAccount: {}
    };
  },

  methods: {
    ...mapActions([
      'addAccount'
    ]),

    saveNewAccount () {
      this.addAccount(this.newAccount).then(() => {
        this.newAccount = {};
      });
    }
  }
};
</script>

<style scoped lang='scss'>
#accounts-create-edit-view {
}
</style>
```



src/app/accounts/components/AccountsListView.vue

```
<template>
  <div id="accounts-list-view">
    I'm a list of accounts!

    <router-link :to="{ name: 'createEditAccount' }">Add an account</router-link>

    <ul>
      <li v-for="account, key in accounts">
        {{ account.name }}
        <span class="tag is-small is-info">{{ categories[account.category] }}</span>
        ${{ account.balance }}
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { CATEGORIES } from '../../../consts';

export default {
  name: 'accounts-list-view',

  data () {
    return {
      categories: CATEGORIES
    };
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
// I also added names to our account routes
export default [
  {
    path: '/',
    component: components.AccountsListView,
    name: 'accountsListView'
  },
  {
    path: '/accounts/create',
    component: components.CreateEditAccount,
    name: 'createEditAccount'
  }
];
```



src/main.js

```
// I forgot to actually load the Bulma CSS earlier, so I'm going that now
// Import Vue
import Vue from 'vue';

// Import App Custom Styles
import AppStyles from './css/app.css';

// Import App Component
import App from './app';

import 'bulma/css/bulma.css';
...
```



src/consts.js

```
// We might want to create constants for each application and load them up our chain, but for now this is sufficient.
export const CATEGORIES = {
  'CREDIT_CARD': 'Credit Card',
  'CHECKING': 'Checking',
  'SAVINGS': 'Savings'
};
```



이제 많은 일들이 벌어지고 있다! 만약 이 글을 읽는 사람들이 기본적인 Vue.js 튜토리얼을 다 읽어보았다면, 이 역시 따라하기 쉬울 것이다. 또한 `diff`를 통해 `GitHub`에서 코드를 보거나 튜토리얼을 따라갈 때 각각 다른 커밋을 가져오는 것이 더 쉬울 수도 있다.

`Accounts`모델과 유사한 양식을 정의하자. 컴포넌트에 `newAccount` 객체가 있는 각 필드에 `v-model`을 연결하는 것으로 Vue의 양식과 모델을 다루는 것이 필자가 선호하는 방법이다. [다른 접근 방식](http://www.vue-cookbook.com/2016/03/27/vuex-form-strategies/)도 있다. 각 필드 편집 후에 자동으로 저장시키는 것이다. `Vuex`를 사용하면 스토어를 직접 편집하는게 아니고 액션 및 mutator를 통해 새로운 값을 전달하는 것이다. `newAccount` 객체를 편집하면서 한 번에 하나의 필드만 전달할 수도 있지만, 코드가 복잡해지고 사용자가 항목을 취소한 경우 저장된 객체를 삭제해야 하는 걸 일일이 기억해야 한다. 

다음 단계는 양식 데이터를 실제로 저장하는 것이다. 마침내 정의한 액션과 mutator를 사용한다. 우리의 코드는 `addAccount` 액션을 로드하고 실행할텐데, 그러면 실제로 스토어를 업데이트하는 `ADD_ACCOUNT` mutator가 불려온다. 이게 완료되면 `newAccount` 객체를 지우고 프로그래밍 방식으로 계정 목록으로 이동한다.



GIT : [d569fce](https://github.com/matthiaswh/budgeterbium/commit/d569fce06a9d0abb840b09938948d6a1e65f0a0b)