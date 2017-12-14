---
layout : tutorials
category : tutorials
title : VueJS 가이드 9 - 예산 끝내기 (1/7)
subcategory : setlayout
summary : VueJS를 통한 애플리케이션 개발에 대해 알아봅니다.
permalink : /tutorials/weplanet/9budget-app-vuejs1
author : danielcho
tags : vue javascript
title\_background\_color : F1F71A
---



> 본 포스팅은 [Matthias Hager](https://matthiashager.com) 의 [Vue.js Application Tutorial - Step 9: Racing Through Budgets](https://matthiashager.com/complete-vuejs-application-tutorial/budget-app-vuejs))를 저자의 허락하에 번역한 글입니다. 오탈자, 오역 등이 있다면 연락부탁드립니다.



이제 슬슬 시작할 때다. 예산 책정 모듈의 대부분은 본질적으로 우리가 이미 계정 파트에서 만들었던 것과 비슷하니, 유사한 부분들은 빨리빨리 지나가려고 한다. 그렇다고 실수를 해도 된다는 의미는 아니고, 새로운 개념이 나오면 대충 넘어가진 않을 것이다.

 

이제 로컬 스토리지에서 데이터를 저장하고 가져오는 건 익숙하니 새로운 모듈을 만들면서 그때그때 처리할 것이다. 그리고 이제 애플리케이션의 큰 부분들을 만들어 낼 테니 좀 더 자주 커밋하기 시작할 것이다.

 

평소대로 우린 데이터 레이어로 시작한다. 빈 객체를 예산에 넣자. 단일의 `budget` 객체는 한 달을 나타날 것이며, 각각 예산 아이템들이 들어가 있을 것이다.

 

```
// /src/app/budgets/vuex/index.js
import * as actions from './actions';
import mutations from './mutations';
import getters from './getters';

const state = {
budgets: {}

...
```



우리는 사용자들이 예산을 생성, 로드, 업데이트 및 삭제할 수 있어야 하는 것을 알고 있다. 즉흥적으로 본다면, 한 번에 이 기능들을 다 코딩하고 싶을테지만, 하나하나 천천히 하는게 더 좋을 것이다. 이렇게 해야 중요한 부분들을 놓치지 않을 것이며 다음 단계로 넘어가기 전에 다양한 컴포넌트를 제대로 작동하는 상태로 만들 수 있다. (테스트 중심 개발 접근 방식을 사용하면 비교적 천천히 개발하게 될 것이며, 보다 체계적으로 작업하게 해줄 것이다.)

 

생성으로 시작하자. 우리는 1) `mutator`를 넣어야하고,2) 액션을 넣어야하며, 3) 로컬스토리지에 저장해야 한다.

 

src/app/budgets/vuex/mutations.js

```
export default {
  CREATE_BUDGET (state, payload) {
    state.budgets[payload.budget.id] = payload.budget;
  }
};
```



src/app/budgets/vuex/actions.js

```
import { guid } from '../../../utils';
import { saveBudget } from '../api';

export const createBudget = ({ commit }, data) => {
  let id = guid();
  let budget = Object.assign({ id: id }, data);

  commit('CREATE_BUDGET', { budget: budget });
  saveBudget(budget).then((value) => {
    // we saved the budget, what's next?
  });
};
```



src/app/budgets/api.js

```
import localforage from 'localforage';

const BUDGET_NAMESPACE = 'BUDGET-';

export const saveBudget = (budget) => {
  return localforage.setItem(
    BUDGET_NAMESPACE + budget.id,
    budget
  ).then((value) => {
    return value;
  }).catch((err) => {
    console.log('had a little trouble saving that budget', err);
  });
};
```



지금까지는 계정 파트에서 한 코딩과 비슷해보인다.

 

이제 컴포넌트를 만들고, 라우팅시키고, 임시로 사용할 탐색(navigation) 링크를 넣자. 아직 예산 아이템을 넣는 것에 대해서는 신경 쓰지 말자. 사용자는 자신들의 수입 및 지출을 직접 수정할 수 없다. 이건 트랜잭션을 통해서 업데이트되기 때문이다. 계정에서 그랬던 것처럼 여기에서는 생성과 수정 모드 간에 별 차이가 없다.

 

src/app/budgets/routes.js

```
import * as components from './components';

export default [
  {
    path: '/budgets',
    component: components.BudgetsListView
  },
  {
    path: '/budgets/create',
    component: components.CreateUpdateBudget,
    name: 'createBudget'
  }
];
```



src/app/budgets/components/index.js

```
export { default as BudgetsListView } from './BudgetsList';
export { default as CreateUpdateBudget } from './CreateUpdateBudget';
```



src/app/budgets/components/CreateUpdateBudget.vue

```
<template>
  <div id="budget-create-edit-view">
    You can create and edit budgets with me, woot!

    <form class="form" @submit.prevent="processSave">
      <label for="month" class="label">Month</label>
      <p class="control">
        <input type="text" class="input" name="month" v-model="selectedBudget.month">
      </p>
      <label for="budgeted" class="label">Budgeted amount</label>
      <p class="control">
        <input type="text" class="input" name="budgeted" v-model="selectedBudget.budgeted">
      </p>
      <p class="control">
        Spent: {{ selectedBudget.spent }}
      </p>
      <p class="control">
        Income: {{ selectedBudget.income }}
      </p>
      <div class="control is-grouped">
        <p class="control">
          <button class="button is-primary">Submit</button>
        </p>
      </div>
    </form>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'budget-create-edit-view',

  data: () => {
    return {
      selectedBudget: {}
    };
  },

  methods: {
    ...mapActions([
      'createBudget'
    ]),

    resetAndGo () {
      this.selectedBudget = {};
      // todo: redirect here
    },

    saveNewBudget () {
      this.createBudget(this.selectedBudget).then(() => {
        this.resetAndGo();
      });
    },

    processSave () {
      this.$route.params.budgetId ? this.saveNewBudget() : false;
    }
  }
};
</script>
```



이제 `/budgets/create`로 이동 할 수 있고, 간단한 예산 객체를 추가하고 스토어에서 확인할 수 있다.

 

![](https://matthiashager.com/user/pages/complete-vuejs-application-tutorial/budget-app-vuejs/budgeterbium-budget-object.PNG)







 

