---
layout : tutorials
category : tutorials
title : VueJS 가이드 10 - 스타일링과 네비게이션 (2/2)
subcategory : setlayout
summary : VueJS를 통한 애플리케이션 개발에 대해 알아봅니다.
permalink : /tutorials/weplanet/10styling-navigation2
author : danielcho
tags : vue javascript
title\_background\_color : F1F71A
---



> 본 포스팅은 [Matthias Hager](https://matthiashager.com) 의 [Vue.js Application Tutorial - Step 10: Styling & Navigation](https://matthiashager.com/complete-vuejs-application-tutorial/styling-navigation)를 저자의 허락하에 번역한 글입니다. 오탈자, 오역 등이 있다면 연락부탁드립니다.



시간을 좀 갖고 코드를 살펴본 후 코드에 문제가 있는지 살펴보자. 그 후에 진행을 이어가는게 좋을 것 같다. 

 

선택한 계정을 컴포넌트의 `mounted` 메서드에 로드한다. 이는 Vue 라이프 사이클의 일부이다. 하지만 Vue.js는 꽤 똑똑하다.사용자가 똑같은 컴포넌트를 사용하여 두 개의 다른 루트 사이를 탐색할 때 Vue는 실제로 그 컴포넌트를 삭제하고 새로운 컴포넌트를 만들지 않는다. 같은 Vue 인스턴스를 재사용하여 효율화한다. 이를 통해 lifecycle hooks를 불러오지 않고, `mounted` 코드는 절대 새 계정을 로드하지 않는다.

 

URL에서 변화를 모니터링하고 루트의 `accountId` 파라미터가 변경될 때마다 계정이 코드를 로드하도록 할 수 있다. 이는 확실하게 작동할 것이며, 많은 일이 필요한 것도 아니다. 하지만 컴포넌트가 `vue-router`와 밀접하게 coupling되어 있다는 근본적인 문제를 해결하지 못한다. 더 나은 해결책은 `vue-router`가 2.2 릴리스에서 준 `prop` 기능을 사용하는 것이다. 이걸 사용하면 루트 파라미터를 컴포넌트에 `prop`으로 전달할 수 있다. `accountId`를 `prop`으로 받게되며, 계정을 다시 로드하기 위하여 변경되는 것들을 지켜볼 수 있다. 그러면 URL이 변경될 때마다 업데이트가 실행될 것이다.

 

`this.$route.params` 쓸 때는 결합되어 있는데, 이 부분은 decoupled된 이유가 뭘까? `props`은 Vue 컴포넌트 자체의 일부이며, 라우터를 통해 컴포넌트가 로드될 때 주입되는 값이 아니다. `vue-router`에서 보내거나 이 컴포넌트를 다른 컴포넌트에 직접 포함시키면 전달될 수도 있다. 우리의 컴포넌트는 더 이상 `vue-router` 사용에 의존하지 않는 것이다.

 

또한 컴포넌트가 처음 마운트되고 URL이 변경될 때 부를 수 있게 로딩 코드를 자체 메서드로 옮길 것이다.



src/app/accounts/components/CreateUpdateAccount.vue

```
...

export default {
  name: 'accounts-create-edit-view',
  props: ['accountId'],

  data: () => {
    return {
      categories: CATEGORIES,
      editing: false,
      selectedAccount: {}
    };
  },

  mounted () {
    if (this.accountId) {
      this.loadAccount();
    }
  },

  methods: {
    ...mapActions([
      'createAccount',
      'updateAccount',
      'loadAccounts'
    ]),

    resetAndGo () {
      this.selectedAccount = {};
      this.$router.push({ name: 'accountsList' });
    },

    saveNewAccount () {
      this.createAccount(this.selectedAccount).then(() => {
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
    },

    loadAccount () {
      let vm = this;
      this.loadAccounts().then(() => {
        let selectedAccount = vm.getAccountById(vm.accountId);
        if (selectedAccount) {
          vm.editing = true;
          vm.selectedAccount = Object.assign({}, selectedAccount);
        }
      // TODO: the object does not exist, how do we handle this scenario?
      });
    }
  },

  computed: {
    ...mapGetters([
      'getAccountById'
    ])
  },

  watch: {
    accountId (newId) {
      if (newId) {
        this.loadAccount();
      }
      this.editing = false;
      this.selectedAccount = {};
    }
  }
};

...
```



src/app/accounts/routes.js

```
...

{
    path: '/accounts/:accountId/update',
    component: components.CreateUpdateAccount,
    name: 'updateAccount',
    props: true
  }
];
```



> `selectedAccount`를 `accountId` prop에 따라 변경되는 computed 속성으로 설정하려고 생각했을 수 있다. 훌륭한 생각이다! 그러나 Vue.js computed 속성은 동기화 방식이어야 한다. `loadAccounts`를 부르고 로컬 스토리지가 데이터를 가져올 때까지 기다려야하기 때문에 여기선 computed 속성을 쓸 수 없다.
>

 

이제 완벽히 작동하고, 스타일링된 네비게이션 바를 만들었다!



GIT : [ae09000](https://github.com/matthiaswh/budgeterbium/commit/ae0900071073c3b8a858b04f8c30fbf67e826e87)