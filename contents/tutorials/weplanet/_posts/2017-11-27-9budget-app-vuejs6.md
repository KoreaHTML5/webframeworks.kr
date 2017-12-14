---
layout : tutorials
category : tutorials
title : VueJS 가이드 9 - 예산 끝내기 (6/7)
subcategory : setlayout
summary : VueJS를 통한 애플리케이션 개발에 대해 알아봅니다.
permalink : /tutorials/weplanet/9budget-app-vuejs6
author : danielcho
tags : vue javascript
title\_background\_color : F1F71A
---



> 본 포스팅은 [Matthias Hager](https://matthiashager.com) 의 [Vue.js Application Tutorial - Step 9: Racing Through Budgets](https://matthiashager.com/complete-vuejs-application-tutorial/budget-app-vuejs))를 저자의 허락하에 번역한 글입니다. 오탈자, 오역 등이 있다면 연락부탁드립니다.



이제 사용자는 특정 월 예산의 `budgetCategories`에 객체를 추가해야 한다. 우리가 언제 어디서 `budgetCategories`를 만들었는지 궁금할 수도 있다. 답은 우리는 이걸 만든 적이 없다는 것이다. 데이터를 확인할 정의된 테이블이 있는 관계형 데이터베이스도 없으며, 저장 과정 중에 최소한의 데이터 유효성 검사만 수행하는 것이다. 예산 저장 코드로 돌아가 예산 객체에 확실히 추가를 하거나 사용자가 실제로 예산에 카테고리를 추가할 때 해당 예산을 확인할 수 있다. 우리는 후자로 할 것이다.

 

이번에도 역시 데이터 레이어부터 시작한다. 예산 카테고리에 대해 생각해 보면, 추가할 때 예산 잔액을 업데이트해야한다는 것을 깨달을 수 있다. 그리고 사용자가 수동으로 월 예산을 설정할 수 있도록 한 것이 실수였을 수도 있다. 지출한 금액처럼 이건 완전히 다른 팩터에 의해 통제되어야 한다. 지금 이 부분을 수정하여 $0 잔액으로 예산을 시작하게 하여 예산 카테고리를 추가 할 때 유형 문제가 발생하지 않도록 하자.

 

src/app/budgets/vuex/mutations.js

```
import Vue from 'vue';
...
  UPDATE_BUDGET_BALANCE (state, payload) {
    if (!(payload['param'] === 'budgeted' || payload['param'] === 'spent') || payload['param'] === 'income') {
      throw new Error('UPDATE_BUDGET_BALANCE expects either { param: "budgeted" } or { param: "spent" } or { param: "income" }');
    }

    state.budgets[payload.budget.id][payload.param] += parseFloat(payload.value);
  },

  CREATE_EMPTY_BUDGET_CATEGORY_OBJECT (state, payload) {
    Vue.set(state.budgets[payload.id], 'budgetCategories', {});
  },

  CREATE_BUDGET_CATEGORY (state, payload) {
    Vue.set(state.budgets[payload.budget.id].budgetCategories, payload.budgetCategory.id, payload.budgetCategory);
  }
...
```



src/app/budgets/vuex/actions.js

```
import moment from 'moment';
import { guid } from '../../../utils';
import { saveBudget, fetchBudgets, saveCategory, fetchCategories } from '../api';

const verifyUniqueMonth = (budgets, budget) => {
  // accepts a list of budgets, and the budget being updated
  // returns true if there is no date collision
  // returns false if a budget already exists in budgets with the same month as budget
  let month = moment(budget.month);
  return !Object.values(budgets).find((o) => {
    if (o.id === budget.id) return false; // it's the budget we're examining, let's not check if the months are the same
    return month.isSame(o.month, 'month');
  });
};

export const createBudget = ({ commit, state }, data) => {
  if (!verifyUniqueMonth(state.budgets, data)) {
    return Promise.reject(new Error('A budget already exists for this month.'));
  }

  let id = guid();
  let budget = Object.assign({ id: id }, data);

  budget.budget = 0;
  budget.spent = 0;
  budget.income = 0;

  commit('CREATE_BUDGET', { budget: budget });
  saveBudget(budget).then((value) => {
    // we saved the budget, what's next?
  });
};

export const updateBudget = ({ commit, state }, data) => {
  if (!verifyUniqueMonth(state.budgets, data)) {
    return Promise.reject(new Error('A budget already exists for this month.'));
  }

  commit('UPDATE_BUDGET', { budget: data });
  saveBudget(data);
};

export const loadBudgets = ({ state, commit }) => {
  if (!state.budgets || Object.keys(state.budgets).length === 0) {
    return fetchBudgets().then((res) => {
      commit('LOAD_BUDGETS', res);
    });
  }
};

export const updateBudgetBalance = ({ commit, getters }, data) => {
  /*
  Accepts a budget and a parameter-value to be updated
    param: budgeted|spent
    value: num
   */

  commit('UPDATE_BUDGET_BALANCE', data);
  saveBudget(getters.getBudgetById(data.budget.id));
};

export const createCategory = ({ commit, state }, data) => {
  let id = guid();
  let category = Object.assign({ id: id }, data);
  commit('CREATE_CATEGORY', { category: category });
  saveCategory(category);
};

export const loadCategories = ({ state, commit }) => {
  if (!state.categories || Object.keys(state.categories).length === 0) {
    return fetchCategories().then((res) => {
      commit('LOAD_CATEGORIES', res);
    });
  }
};

export const createBudgetCategory = ({ commit, dispatch, getters }, data) => {
  // create an empty budget categories object if it doesn't exist
  if (!data.budget.budgetCategories || Object.keys(data.budget.budgetCategories).length === 0) {
    commit('CREATE_EMPTY_BUDGET_CATEGORY_OBJECT', data.budget);
  }

  let id = guid();
  let budgetCategory = Object.assign({ id: id }, data.budgetCategory);

  commit('CREATE_BUDGET_CATEGORY', { budget: data.budget, budgetCategory: budgetCategory });

  // save using the budget in our store
  saveBudget(getters.getBudgetById(data.budget.id));

  dispatch('updateBudgetBalance', {
    budget: data.budget,
    param: 'budgeted',
    value: budgetCategory.budgeted
  });
};
```



src/app/budgets/components/CreateUpdateBudget.vue

```
...
<p class="control">
  <datepicker name="month" input-class="input" format="MMMM yyyy" v-model="selectedBudget.month"></datepicker>
</p>
<p class="control">
  Budgeted: ${{ selectedBudget.budget }}
</p>
<p class="control">
  Spent: ${{ selectedBudget.spent }}
</p>
<p class="control">
  Income: ${{ selectedBudget.income }}
</p>
...

```



여기서 많은 인터랙션이 일어나고 있으니 코드를 잘 살펴보자. 새로운 예산 카테고리를 추가할뿐만 아니라 추가되면 예산의 총 잔액을 업데이트하게 불러올 것이다.

 

`Vue.set ()` 에 당황할 수도 있다. Vue는 객체 추가 또는 삭제를 감지할 수 없기 때문에([Vue cannot detect object additions or deletions](https://vuejs.org/v2/guide/reactivity.html)) 객체에 새 속성을 추가하거나 기존 속성을 삭제하려면 `Vue.set()` 및 `Vue.delete()`를 각각 사용해야한다. 이렇게 해야 Vue가 업데이트에 대해 반응을 할 수 있다.


