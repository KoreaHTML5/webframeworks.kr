---
layout : tutorials
category : tutorials
title : VueJS 가이드 13 - Transaction (4/4)
subcategory : setlayout
summary : VueJS를 통한 애플리케이션 개발에 대해 알아봅니다.
permalink : /tutorials/weplanet/13transactions4
author : danielcho
tags : vue javascript
title\_background\_color : F1F71A
---



> 본 포스팅은 [Matthias Hager](https://matthiashager.com) 의 [Vue.js Application Tutorial - Step 13 - All Aboard the Transaction Train](https://matthiashager.com/complete-vuejs-application-tutorial/transactions)를 저자의 허락하에 번역한 글입니다. 오탈자, 오역 등이 있다면 연락부탁드립니다.

 



## 데이터 업데이트하기

이 튜토리얼의 앞선 단계에서 필자가 `vuex`의 이점을 지지할 때를 기억하는가? 필자도 못한다. 하지만 실제로 그 이점을 곧 보게 될 것이다. `Vuex`는 모든 데이터 조작이 일어나는 중심 허브이다. 제대로 된 채널을 거치지 않는 한 아무것도 데이터를 변경할 수 없다. 제대로 된 채널이란 액션을 트리거해서 뮤테이션을 커밋하고 그게 센트럴 스토어를 업데이트해서 나머지 애플리케이션에 반영되는 것이다.

 

이전에 우리는 트랜잭션을 생성하거나 업데이트 할 때 연속적으로 영향을 주는 사항들을 확인했었다. 하나씩 할 것이므로 여기 다시 쓰겠다.

- 트랜잭션 날짜를 기준으로 어떤 예산을 업데이트해야 하는지 파악하기
- 이번 달의 예산에서 선택한 카테고리에서 나간 트랜잭션 금액 업데이트하기 
- 선택한 계정에서 금액 공제하기 (또는 추가하기) 
- 예산 합계도 업데이트되도록 하기

첫 번째 단계는 날짜를 기준으로 예산을 찾는 것이다. 이것은 누가 봐도 예산 문제가 아니고 트랜잭션 문제이며 필자는 게터가 필요한 상황이라고 생각한다. 이렇게 하면 그냥 기존 예산을 반복하여 주어진 날짜와 일치하는 예산을 찾는 것이다. 우리가 쓴 `actions.js` 파일을 다시 보면 아직 만들어야하는 `getBudgetCategoryByBudgetAndCategory` 게터를 불러왔다는 걸 알 수 있을 것이다. 저 이름을 보고도 저게 무엇을 하는지 모르겠다면 더 이상 뭐 어떻게 할 수가 없다.

 

```
// /src/app/budgets/vuex/getters.js

...

  },

  getBudgetCategoryByBudgetAndCategory: (state, getters) => (budgetId, categoryId) => {
    let budget = getters.getBudgetById(budgetId);
    if (!budget) return false;

    return budget.budgetCategories ? Object.values(budget.budgetCategories).find((o) => { return o.category === categoryId; }) : false;
  },

  getBudgetByDate: (state, getters) => (date) => {
    if (!state.budgets) return false;

    let month = moment(date);
    return Object.values(state.budgets).find((o) => {
      return month.isSame(o.month, 'month'); // remember this checks month and year are the same https://momentjs.com/docs/#/query/is-same/
    });
```



이제 `budgetCategory`의 잔액과 계정 잔액을 업데이트하는 방법이 필요하다.

 

/src/app/budgets/vuex/actions.js

```
export const updateBudgetCategorySpent = ({ commit, dispatch, getters }, data) => {
  // expects data.budget, data.budgetCategory, and data.spent
  // spent should always be the amount spent on a transaction, not a total amount
  commit('UPDATE_BUDGET_CATEGORY_BALANCE', { budget: data.budget, value: data.amount, budgetCategory: data.budgetCategory, param: 'spent' });

  dispatch('updateBudgetBalance', {
    budget: data.budget,
    param: 'spent',
    value: data.budget.spent + data.amount
  });

  // save using the budget in our store
  saveBudget(getters.getBudgetById(data.budget.id));
};
```



/src/app/budgets/vuex/mutations.js

```
...

  UPDATE_BUDGET_CATEGORY_BALANCE (state, payload) {
    if (!(payload['param'] === 'budgeted' || payload['param'] === 'spent')) {
      throw new Error('UPDATE_BUDGET_BALANCE expects either { param: "budgeted" } or { param: "spent" }');
    }

    state.budgets[payload.budget.id].budgetCategories[payload.budgetCategory.id][payload.param] += parseFloat(payload.value);
  }
```



/src/app/accounts/vuex/actions.js

```
...

export const updateAccountBalance = ({ commit, getters }, data) => {
  /*
  Accepts a transaction amount and sums that with the current balance
    account: account
    amount: num
   */
  commit('UPDATE_ACCOUNT_BALANCE', data);
  saveAccount(getters.getAccountById(data.account.id)); // save the updated account
};
```



/src/app/accounts/vuex/mutations.js

```
...

  UPDATE_ACCOUNT_BALANCE (state, payload) {
    state.accounts[payload.account.id].balance += parseFloat(payload.amount);
  },

...
```



여기서 마지막으로 한 가지 더. 계정과 예산을 위한 뮤테이션 코드를 보는 동안 문제가 될 만한걸 찾았는가? 돈 관련 데이터는 절대로 `floats`로 쓰면 안 된다! 처음에는 간단하게 하고 싶어서 그랬지만, 실제로 이것은 처음부터 했어야 하는 것이다. 아마 당신의 테스트 데이터베이스는 지금 다양한 종류의 틀린 숫자로 채워져 있을 것이다. 지금 당장 이 문제를 해결하자. 

 

뮤테이션 파일에 많은 변화가 있으므로 여기에 다 쓰겠다. 이 코드에서 얼마나 많은 `floats`를 썼는지 봐라.

 

/src/app/budgets/vuex/mutations.js

```
import Vue from 'vue';

const forceBudgetFloats = (o) => {
  o.budgeted = parseFloat(o.budgeted);
  o.income = parseFloat(o.income);
  o.spent = parseFloat(o.spent);

  if (o.budgetCategories && Object.keys(o.budgetCategories).length > 0) {
    Object.values(o.budgetCategories).forEach((bc) => { forceBudgetCategoryFloats(bc); });
  }
};

const forceBudgetCategoryFloats = (o) => {
  o.budgeted = parseFloat(o.budgeted);
  o.spent = parseFloat(o.spent);
};

export default {
  CREATE_BUDGET (state, payload) {
    forceBudgetFloats(payload.budget);
    state.budgets[payload.budget.id] = payload.budget;
  },

  UPDATE_BUDGET (state, payload) {
    forceBudgetFloats(payload.budget);
    state.budgets[payload.budget.id] = payload.budget;
  },

  LOAD_BUDGETS (state, payload) {
    state.budgets = payload;

    Object.values(state.budgets).forEach((o) => {
      forceBudgetFloats(o);
    });
  },

  UPDATE_BUDGET_BALANCE (state, payload) {
    if (!(payload['param'] === 'budgeted' || payload['param'] === 'spent') || payload['param'] === 'income') {
      throw new Error('UPDATE_BUDGET_BALANCE expects either { param: "budgeted" } or { param: "spent" } or { param: "income" }');
    }

    state.budgets[payload.budget.id][payload.param] += parseFloat(payload.value);
  },

  CREATE_CATEGORY (state, payload) {
    Vue.set(state.categories, payload.category.id, payload.category);
  },

  UPDATE_CATEGORY (state, payload) {
    state.categories[payload.category.id] = payload.category;
  },

  LOAD_CATEGORIES (state, payload) {
    state.categories = payload;
  },

  CREATE_EMPTY_BUDGET_CATEGORY_OBJECT (state, payload) {
    Vue.set(state.budgets[payload.id], 'budgetCategories', {});
  },

  CREATE_BUDGET_CATEGORY (state, payload) {
    forceBudgetCategoryFloats(payload.budgetCategory);
    Vue.set(state.budgets[payload.budget.id].budgetCategories, payload.budgetCategory.id, payload.budgetCategory);
  },

  UPDATE_BUDGET_CATEGORY (state, payload) {
    forceBudgetCategoryFloats(payload.budgetCategory);
    state.budgets[payload.budget.id].budgetCategories[payload.budgetCategory.id] = payload.budgetCategory;
  },

  UPDATE_BUDGET_CATEGORY_BALANCE (state, payload) {
    if (!(payload['param'] === 'budgeted' || payload['param'] === 'spent')) {
      throw new Error('UPDATE_BUDGET_BALANCE expects either { param: "budgeted" } or { param: "spent" }');
    }

    state.budgets[payload.budget.id].budgetCategories[payload.budgetCategory.id][payload.param] += parseFloat(payload.value);
  }
};

```



/src/app/accounts/vuex/mutations.js

```
import Vue from 'vue';

export default {
  CREATE_ACCOUNT (state, payload) {
    payload.account.balance = parseFloat(payload.account.balance);
    state.accounts[payload.account.id] = payload.account;
  },

  UPDATE_ACCOUNT (state, payload) {
    payload.account.balance = parseFloat(payload.account.balance);
    state.accounts[payload.account.id] = payload.account;
  },

  UPDATE_ACCOUNT_BALANCE (state, payload) {
    state.accounts[payload.account.id].balance += parseFloat(payload.amount);
  },

  DELETE_ACCOUNT (state, payload) {
    Vue.delete(state.accounts, payload.account.id);
  },

  LOAD_ACCOUNTS (state, payload) {
    state.accounts = payload;

    Object.values(state.accounts).forEach((o) => { o.balance = parseFloat(o.balance); });
  }
};

```



당신은 모르겠지만 필자는 지금 너무 숨이 찬다. 커밋해야겠다.



GIT :  [572a573](https://github.com/matthiaswh/budgeterbium/commit/572a573f3a437ebde8e2c73e7debd9bb3b75ad53)

 



 

