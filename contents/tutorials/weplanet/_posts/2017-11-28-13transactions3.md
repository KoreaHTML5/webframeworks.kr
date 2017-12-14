---
layout : tutorials
category : tutorials
title : VueJS 가이드 13 - Transaction (3/4)
subcategory : setlayout
summary : VueJS를 통한 애플리케이션 개발에 대해 알아봅니다.
permalink : /tutorials/weplanet/13transactions3
author : danielcho
tags : vue javascript
title\_background\_color : F1F71A
---



> 본 포스팅은 [Matthias Hager](https://matthiashager.com) 의 [Vue.js Application Tutorial - Step 13 - All Aboard the Transaction Train](https://matthiashager.com/complete-vuejs-application-tutorial/transactions)를 저자의 허락하에 번역한 글입니다. 오탈자, 오역 등이 있다면 연락부탁드립니다.

 



##트랜잭션 보기 및 편집하기

우리는 2개의 컴포넌트가 필요하다. 하나는 트랜잭션을 목록에 한 부분으로 간단하게 보기 위해, 그리고 또 하나는 트랜잭션을 생성 / 업데이트하기 위해. 트랜잭션을 편집할 때 사용자는 새로운 `business` 객체도 만들 수 있어야 한다. 그 비즈니스에 대해 필요한 정보는 이름뿐이다. 여긴 그저 사용자가 힘들게 번 돈을 어디다 쓰는지 기록하는 플레이스홀더일 뿐이다.

 

이 컴포넌트는 많은 `lookup`을 하게될 것이다. 근본적으로 우리가 만든 모든 것을 묶어주는 것이다. (예산, 카테고리, 계정 및 비즈니스) 여기서도 나중에는 성능 향상을 위해서 작업을 좀 해야 할 것이다. 지금은 일단 애플리케이션이 데이터베이스에 저장한 모든 데이터를 한 조각 한 조각 다 로드 할 것이다.

 

`transaction`이 핵심이므로 애플리케이션에 많은 영향을 줄 수 있다. 사용자가 식료품을 사는데 신용카드로 100 달러를 쓰면 애플리케이션은 다음을 해야 한다.

- 신용 카드 계좌에서 100 달러 공제
- 트랜잭션 날짜를 기준으로 어떤 예산을 업데이트해야하는지 파악
- 이번 달의 예산에 식료품 카테고리에서 100 달러를 썼다고 표시
- 예산 합계도 업데이트되도록 하기

작은 생성 / 업데이트 컴포넌트 치고는 할 일이 많은 것 같다. 이 정도의 많은 비즈니스 로직은 다른데서 일어나야 한다고 생각하고 있다면, 정확하다! 필자가 이걸 쓸 때는 컴포넌트가 어느 정도 기능적이기만 하면 된다 생각하고 쓴 것이다. 트랜잭션 추가 및 편집을 넣을 수 있겠지만 애플리케이션에게는 영향이 없다. 여기서는 왔다갔다한 걸 안보여주고 다 한꺼번에 보여준 것이지만 만약 너무 많은 일들이 일어나 뭐가뭔지 모르겠다면 커밋 로그를 봐도 된다.

 

src/app/transactions/components/Transaction.vue

```
<template>
  <tr class="transaction">
    <td>
      <span class="subtitle is-5">{{ value.date | moment('YYYY-MM-DD') }}</span>
    </td>
    <td><span class="subtitle is-5">{{ getBusinessById(value.business).name }}</span></td>
    <td><span class="subtitle is-5">{{ getCategoryById(value.category).name }}</span></td>
    <td><span class="subtitle is-5">{{ getAccountById(value.account).name }}</span></td>
    <td><span class="subtitle is-5">{{ value.note }}</span></td>
    <td><span class="subtitle is-5" v-if="value.amount < 0">${{ value.amount }}</span></td>
    <td><span class="subtitle is-5" v-if="value.amount > 0">${{ value.amount }}</span></td>
    <td><a class='button' @click.prevent="$emit('edit-transaction')">Edit</a></td>
  </tr>
</template>

<script>
import { moment } from '../../../filters';
import { mapGetters } from 'vuex';

export default {
  name: 'transaction',

  props: ['value'],

  filters: {
    moment
  },

  computed: {
    ...mapGetters([
      'getCategoryById',
      'getAccountById',
      'getBusinessById'
    ])
  }
};
</script>

```



src/app/transactions/components/CreateUpdateTransaction.vue

```
<template>
  <tr class="transaction-create-update">

​```
<td>
  <span class="subtitle is-5">
    <p class="control has-icon has-addons">
      <datepicker name="month" input-class="input" v-model="transaction.date"></datepicker>
      <span class="icon">
        <i class="fa fa-calendar" aria-hidden="true"></i>
      </span>
    </p>
  </span>
</td>

<td>
  <multiselect
    :value="transaction.business"
    @input="updateSelection('business', $event)"
    :taggable="true"
    @tag="handleCreateBusiness"
    :options="getBusinessSelectList"
    placeholder="Select a business"
    label="name"
    track-by="id"
  ></multiselect>
</td>

<td>
  <multiselect
    :value="transaction.category"
    @input="updateSelection('category', $event)"
    :options="getCategorySelectList"
    placeholder="Select a category"
    label="name"
    track-by="id"
  ></multiselect>
</td>

<td>
  <multiselect
    :value="transaction.account"
    @input="updateSelection('account', $event)"
    :options="getAccountSelectList"
    placeholder="Select an account"
    label="name"
    track-by="id"
  ></multiselect>
</td>

<td>
  <p class="control">
    <input type="text" class="input" v-model="transaction.note" />
  </p>
</td>

<td>
  <p class="control has-icon">
    <input type="number" step="0.01" class="input" v-model="debit" />
    <span class="icon">
      <i class="fa fa-usd" aria-hidden="true"></i>
    </span>
  </p>
</td>

<td>
  <p class="control has-icon">
    <input type="number" step="0.01" class="input" v-model="credit" />
    <span class="icon">
      <i class="fa fa-usd" aria-hidden="true"></i>
    </span>
  </p>
</td>

<td>
  <a class="button is-primary" @click.prevent="processSave">
    {{ editing ? 'Save' : 'Add' }}
  </a>
</td>
​```

  </tr>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Datepicker from 'vuejs-datepicker';
import Multiselect from 'vue-multiselect';

export default {
  name: 'transaction-create-update',

  props: ['value'],

  components: {

​```
Datepicker,
Multiselect
​```

  },

  data () {

​```
return {
  transaction: {},
  debit: null,
  credit: null,
  editing: false
};
​```

  },

  mounted () {

​```
this.loadTransactions();
this.loadBudgets();
this.loadCategories();
this.loadAccounts();
this.loadBusinesses();

if (this.value) {
  this.transaction = Object.assign({}, this.value);

  // we need the selected category, account, and business name and ID, but the object only holds their IDs by default
  this.transaction.category = this.getCategoryById(this.transaction.category);
  this.transaction.account = this.getAccountById(this.transaction.account);
  this.transaction.business = this.getBusinessById(this.transaction.business);

  if (this.transaction.amount > 0) this.credit = this.transaction.amount;
  else this.debit = this.transaction.amount;

  this.editing = true;
}
​```

  },

  methods: {

​```
...mapActions([
  'loadTransactions',
  'loadCategories',
  'loadAccounts',
  'loadBudgets',
  'createBusiness',
  'createTransaction',
  'updateTransaction',
  'deleteTransaction',
  'loadBusinesses',
  'deleteBusiness'
]),

processSave () {
  if (this.editing) {
    // TODO: I hate this - have to remember to change it if we change how transaction stores data
    // surely there is a better way?
    this.updateTransaction({
      account: this.transaction.account.id,
      amount: this.transaction.amount,
      business: this.transaction.business.id,
      budget: this.transaction.budget,
      category: this.transaction.category.id,
      date: this.transaction.date,
      note: this.transaction.note,
      id: this.transaction.id
    }).then(() => {
      this.$emit('updated-transaction', this.transaction);
    });
  } else {
    this.createTransaction({
      account: this.transaction.account.id,
      amount: this.transaction.amount,
      business: this.transaction.business.id,
      category: this.transaction.category.id,
      note: this.transaction.note,
      date: this.transaction.date
    }).then(() => {
      this.transaction = {};
    });
  }
},

updateSelection (name, obj) {
  // if using v-model and not using Vue.set directly, vue-multiselect seems to struggle to properly
  // keep its internal value up to date with the value in our component. So we're skipping v-model
  // and handling updates manually.
  this.$set(this.transaction, name, obj);
},

handleCreateBusiness (business) {
  let newBusiness = { name: business };
  this.createBusiness(newBusiness).then((val) => {
    this.updateSelection('business', val);
  });
}
​```

  },

  computed: {

​```
...mapGetters([
  'getCategoryById',
  'getAccountById',
  'getCategorySelectList',
  'getAccountSelectList',
  'getBusinessSelectList',
  'getBusinessById'
])
​```

  },

  watch: {

​```
credit: function (val) {
  this.transaction.amount = Math.abs(val);
},

debit: function (val) {
  this.transaction.amount = -Math.abs(val);
}
​```

  }
};
</script>
```



src/app/accounts/vuex/getters.js

```
export default {
  getAccountById: (state, getters) => (accountId) => {

​```
return state.accounts && accountId in state.accounts ? state.accounts[accountId] : false;
​```

  },

  getAccountSelectList: (state, getters) => {

​```
return state.accounts && Object.keys(state.accounts).length > 0 ? Object.values(state.accounts) : [];
​```

  }
};
```



> 선택 목록에 계정을 로드하기 위해 getter를 추가한 걸 확인하자.

 

이 코드에서 별로 만족스럽지 않은 두 곳이 있다. 이미 봤을 것이다. `processSave()` 코드는 다소 장황하고 다루기 힘들다. 필자는 이것을 코딩하면서 개인적으로 TODO 노트를 남겼다. (그리고 필자의 프로그래머의 공책에도 메모해놓았다.) 장황하고 반복적인 것보다 더 나쁜 건 트랜잭션에 변경을 주고 편집하는 것을 잊어버리면 코드가 나중에 깨질 수도 있다는것이다. 필자는 뒤에 나오는 릴리스에 필자만의 코드로 이 문제를 고치겠지만 지금은 한 번 직접 해보자.

 

두 번째는 필자가 `credit` 하고 `debit`을 위해 설정 한 `watcher`이다. 이 코드는 `debit` 필드에 입력된 값은 항상 음수이고 `credit` 필드는 항상 양수인지 확인한다. 애플리케이션을 매핑할 때, `credit` 및 `debit`을 위한 별도의 필드가 필요한 이 접근법이 실제로 어떻게 작동 할지에 대해 충분히 생각하지 않았다. 필드에 사용자가 직접 음수 부호를 추가하는 것보다 두 필드를 사용하는 것이 정말 더 나을까? 사용자는 크레딧보다 데빗을 더 많이 입력 할 것이므로 마이너스 부호를 잊을 가능성이 매우 높다. 사용자한테 이게 더 낫다면 작동하게 할 프로그래밍 방법을 찾아야 한다.그래서 이걸 한 것이지만 아직 그렇게 휼륭하지는 않다.

 

아직 커밋하지 않았다면 지금 하자! 다음으로 넘어가기 전에 루트와 내비게이션을 추가하여 이 섹션을 사용할 수 있게 만들자.

 

/src/app/transactions/routes.js

```
import * as components from './components';

export default [
  {
    path: '/transactions',
    name: 'transactionsList',
    component: components.TransactionsListView
  }
];
```



/src/app/navigation/components/Navigation.vue

```
...

  <li><router-link :to="{ name: 'budgetsList' }">Budgets</router-link></li>
  <li><router-link :to="{ name: 'transactionsList' }">Transactions</router-link></li>

...
```





