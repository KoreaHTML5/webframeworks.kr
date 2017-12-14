---
layout : tutorials
category : tutorials
title : VueJS 가이드 9 - 예산 끝내기 (3/7)
subcategory : setlayout
summary : VueJS를 통한 애플리케이션 개발에 대해 알아봅니다.
permalink : /tutorials/weplanet/9budget-app-vuejs3
author : danielcho
tags : vue javascript
title\_background\_color : F1F71A
---



> 본 포스팅은 [Matthias Hager](https://matthiashager.com) 의 [Vue.js Application Tutorial - Step 9: Racing Through Budgets](https://matthiashager.com/complete-vuejs-application-tutorial/budget-app-vuejs))를 저자의 허락하에 번역한 글입니다. 오탈자, 오역 등이 있다면 연락부탁드립니다.



예산 앱을 탐색하기에는 수동으로 URL을 조정하는 것보다 예산 목록 보기 페이지를 넣는 것이 간단할 것이다. 또한 계정을 리팩토링할 때 빠뜨린 예산 네이밍에서 `View`를 삭제 할 것이다.

 

src/app/budgets/routes.js

```
import * as components from './components';

export default [
  {
    path: '/budgets',
    component: components.BudgetsList,
    name: 'budgetsList'
  },
  {
    path: '/budgets/create',
    component: components.CreateUpdateBudget,
    name: 'createBudget'
  },
  {
    path: '/budgets/:budgetId/update',
    component: components.CreateUpdateBudget,
    name: 'updateBudget'
  }
];
```



src/app/budgets/components/index.js

```
export { default as BudgetsList } from './BudgetsList';
export { default as CreateUpdateBudget } from './CreateUpdateBudget';
```



src/app/budgets/components/BudgetsList.vue

```
<template>
  <div id="budgets-list">
    I'm a list of budgets!

    <router-link :to="{ name: 'createBudget' }">Add a budget</router-link>
    <router-link :to="{ name: 'accountsListView' }">View accounts</router-link>

    <ul>
      <li v-for="budget, key in budgets">
        {{ budget.month }}
        ${{ budget.budgeted }}
        ${{ budget.spent }}
        ${{ budget.income }}
        <router-link :to="{ name: 'updateBudget', params: { budgetId: budget.id } }">Edit</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'budgets-list',

  mounted () {
    this.loadBudgets();
  },

  methods: {
    ...mapActions([
      'loadBudgets'
    ])
  },

  computed: {
    ...mapState({
      'budgets': state => state.budgets.budgets
    })
  }
};
</script>

<style scoped lang='scss'>
#budgets-list-view {
}
</style>
```



src/app/budgets/components/CreateUpdateBudget.vue

```
<template>
  <divid="budget-create-edit-view">
    You can create and edit budgets with me, woot!

    <router-link:to="{ name: 'budgetsList' }">View all budgets</router-link>

    <formclass="form"@submit.prevent="processSave">
      <labelfor="month"class="label">Month</label>
      <pclass="control">
        <inputtype="text"class="input"name="month"v-model="selectedBudget.month">
      </p>
      <labelfor="budgeted"class="label">Budgeted amount</label>
      <pclass="control">
        <inputtype="text"class="input"name="budgeted"v-model="selectedBudget.budgeted">
      </p>
      <pclass="control">
        Spent: {{ selectedBudget.spent }}
      </p>
      <pclass="control">
        Income: {{ selectedBudget.income }}
      </p>
      <divclass="control is-grouped">
        <pclass="control">
          <buttonclass="button is-primary">Submit</button>
        </p>
        <pclass="control">
          <router-link:to="{ name: 'budgetsList' }"><buttonclass="button is-link">Cancel</button></router-link>
        </p>
      </div>
    </form>
  </div>
</template>
```



아직 깔끔하진 않지만 예산을 볼 수 있으며 현재의 애플리케이션을 탐색 할 수 있다.

 

![](https://matthiashager.com/user/pages/complete-vuejs-application-tutorial/budget-app-vuejs/budgeterbium-view-budgets.PNG)

GIT : [9c4c25f](https://github.com/matthiaswh/budgeterbium/commit/9c4c25f52a086da14f975ec75a0f6988d0020e35)


