---
layout : tutorials
category : tutorials
title : VueJS 가이드 6 - Vue.js 애플리케이션에 LocalStorage 추가하기 (3/3)
subcategory : setlayout
summary : VueJS를 통한 애플리케이션 개발에 대해 알아봅니다.
permalink : /tutorials/weplanet/6localstorage-vuejs3
author : danielcho
tags : vue javascript
title\_background\_color : F1F71A
---



> 본 포스팅은 [Matthias Hager](https://matthiashager.com) 의 [Vue.js Application Tutorial - Step 6: Adding LocalStorage to our Vue.js Application](https://matthiashager.com/complete-vuejs-application-tutorial/localstorage-vuejs)를 저자의 허락하에 번역한 글입니다. 오탈자, 오역 등이 있다면 연락부탁드립니다.





이제 우리의 식별자로 시작하는 모든 레코드를 얻기 위해 `localforage.startsWith (ACCOUNT_NAMESPACE)`를 불러올 수 있다. 다음 단계에서는 많은 일이 일어날 테니 잘 따라오자!

 

src/app/accounts/vuex/actions.js

```
import { guid } from '../../../utils';
import { removeAccount, saveAccount, fetchAccounts } from '../api';

export const addAccount = ({ commit }, data) => {
  let id = guid();
  let account = Object.assign({ id: id }, data); // copy the data into a new object with the generated ID
  commit('ADD_ACCOUNT', {account: account});
  saveAccount(account).then((value) => {
    // we've saved the account, what now?
  });
};

export const updateAccount = ({ commit }, data) => {
  commit('UPDATE_ACCOUNT', {account: data});
  saveAccount(data);
};

export const deleteAccount = ({ commit }, data) => {
  commit('DELETE_ACCOUNT', { account: data });
  removeAccount(data);
};

export const loadAccounts = (state) => {
  // loads accounts only if they are not already loaded
  // later we might want to be able to force reload them
  if (!state.accounts || Object.keys(state.accounts).length === 0) {
    return fetchAccounts().then((res) => {
      let accounts = {};
      Object.keys(res).forEach((key) => { accounts[res[key].id] = res[key]; });
      state.commit('LOAD_ACCOUNTS', accounts);
    });
  }
};
```



src/app/accounts/api.js

```
import localforage from 'localforage';

const ACCOUNT_NAMESPACE = 'ACCOUNT-';

export const fetchAccounts = () => {
  return localforage.startsWith(ACCOUNT_NAMESPACE).then((res) => {
    return res;
  });
};

export const saveAccount = (account) => {
  return localforage.setItem(
    ACCOUNT_NAMESPACE + account.id,
    account
  ).then((value) => {
    return value;
  }).catch((err) => {
    console.log('oops! the account was too far gone, there was nothing we could do to save him ', err);
  });
};

export const removeAccount = (account) => {
  return localforage.removeItem(
    ACCOUNT_NAMESPACE + account.id
  ).then(() => {
    return true;
  }).catch((err) => {
    console.log(err);
    return false;
  });
};
```



src/app/accounts/vuex/mutations.js

```
import Vue from 'vue';

export default {
  ADD_ACCOUNT (state, payload) {
    state.accounts[payload.account.id] = payload.account;
  },

  UPDATE_ACCOUNT (state, payload) {
    state.accounts[payload.account.id] = payload.account;
  },

  DELETE_ACCOUNT (state, payload) {
    Vue.delete(state.accounts, payload.account.id);
  },

  LOAD_ACCOUNTS (state, payload) {
    state.accounts = payload;
  }
};
```



src/app/accounts/components/CreateEditAccount.vue

```
...

  mounted () {
    if ('accountId' in this.$route.params) {
      this.loadAccounts().then(() => {
        let selectedAccount = this.getAccountById(this.$route.params.accountId);
        if (selectedAccount) {
          this.editing = true;
          this.selectedAccount = {
            name: selectedAccount.name,
            category: selectedAccount.category,
            id: selectedAccount.id
          };
        }
      // TODO: the object does not exist, how do we handle this scenario?
      });
    }
  },

  methods: {
    ...mapActions([
      'addAccount',
      'updateAccount',
      'loadAccounts'
    ]),

...
```



사용자가 계정을 편집하려고하면 `mounted` 훅에서 `loadAccounts`를 불러온다. 이렇게 하면 계정이 로드되었는지 확인하고, 로드되지 않은 경우 우리의 API에서 로드된다. 이게 더 복잡한 애플리케이션이였다면 더 많은 시나리오가 필요했을 수 있다. 만약 다른 사람이 API 엔드의 데이터를 변경했는데 다시 로드해야 하는 경우에는 어떻게 해야할까? 하지만 우리의 단순한 목적을 위해, 사용자가 `Vuex` 스토어에서 작업하고 있는 데이터의 복사본이 가장 최신 데이터라고 가정하므로 이미 로드된 데이터는 데이터베이스에서 로드하지 않는다. (우리의 애플리케이션 같은 경우에도 여러 탭에서 사용하면 문제가 발생할 수 있으니 주의하자!) 이건 API가 결정하지 않고 `Vuex` 스토어가 결정하게 하는 게 중요하다. API는 데이터를 쿼리하는 일만 해야 한다.

 

데이터가 로드되면 컴포넌트는 사용자가 편집하려는 계정을 가져온다. 기존 계정을 편집하고 페이지를 새로 고치면 아직 데이터가 있어야 한다. 마지막으로 필요한 경우 목록 페이지에 계정을 로드해야 한다.



```
 // /src/app/accounts/components/AccountsListView.vue
...

data () {
    return {
      categories: CATEGORIES
    };
  },

  mounted () {
    this.loadAccounts();
  },

  methods: {
    ...mapActions([
      'deleteAccount',
      'loadAccounts'
    ]),

...
```



이제 좀 됐다! 하루 종일 애플리케이션을 다시 로드해도 여전히 계정을 볼 수 있다. 다시 한 번말 하지만, 컴포넌트는 데이터가 어디서 오는지에 대해 신경 쓰지 않아도 된다. 컴포넌트는 데이터를 요구할 것이고 데이터는 존재하거나 존재하지 않을 것이다.

 

GIT : [f144a6e](https://github.com/matthiaswh/budgeterbium/commit/f144a6e69530343995a2e2161af23f86c43a3605)



우리가 `IndexedDB`의 껄끄러운 부분까지 다루는 것을 피하는게 아니라면 [큰 개념에 대해 읽는 것](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Basic_Concepts_Behind_IndexedDB)이 좋을 것이다.

