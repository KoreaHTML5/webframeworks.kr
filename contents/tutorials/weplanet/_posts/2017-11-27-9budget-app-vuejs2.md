---
layout : tutorials
category : tutorials
title : VueJS 가이드 9 - 예산 끝내기 (2/7)
subcategory : setlayout
summary : VueJS를 통한 애플리케이션 개발에 대해 알아봅니다.
permalink : /tutorials/weplanet/9budget-app-vuejs2
author : danielcho
tags : vue javascript
title\_background\_color : F1F71A
---



> 본 포스팅은 [Matthias Hager](https://matthiashager.com) 의 [Vue.js Application Tutorial - Step 9: Racing Through Budgets](https://matthiashager.com/complete-vuejs-application-tutorial/budget-app-vuejs))를 저자의 허락하에 번역한 글입니다. 오탈자, 오역 등이 있다면 연락부탁드립니다.



수정 코드를 넣어도 된다. 생성과 매우 비슷하며 우리가 만들어야 할 제일 큰 부분은 `loadBudgets` 방법이다.

 

src/app/budgets/vuex/mutations.js

```
export default {
  CREATE_BUDGET (state, payload) {
    state.budgets[payload.budget.id] = payload.budget;
  },

  UPDATE_BUDGET (state, payload) {
    state.budgets[payload.budget.id] = payload.budget;
  },

  LOAD_BUDGETS (state, payload) {
    state.budgets = payload;
  }
};
```



src/app/budgets/vuex/actions.js

```
import { guid } from '../../../utils';
import { saveBudget, fetchBudgets } from '../api';

export const createBudget = ({ commit }, data) => {
  let id = guid();
  let budget = Object.assign({ id: id }, data);

  commit('CREATE_BUDGET', { budget: budget });
  saveBudget(budget).then((value) => {
    // we saved the budget, what's next?
  });
};

export const updateBudget = ({ commit }, data) => {
  commit('UPDATE_BUDGET', { budget: data });
  saveBudget(data);
};

export const loadBudgets = (state) => {
  if (!state.budgets || Object.keys(state.budgets).length === 0) {
    return fetchBudgets().then((res) => {
      state.commit('LOAD_BUDGETS', res);
    });
  }
};
```



src/app/budgets/vuex/getters.js

```
export default {
  getBudgetById: (state, getters) => (budgetId) => {
    return state.budgets && budgetId in state.budgets ? state.budgets[budgetId] : false;
  }
};
```



src/app/budgets/api.js

```
import localforage from 'localforage';
import { processAPIData } from '../../utils';

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

export const fetchAccounts = () => {
  return localforage.startsWith(BUDGET_NAMESPACE).then((res) => {
    return processAPIData(res);
  });
};
```



src/app/budgets/components/CreateUpdateBudget.vue

```
<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'budget-create-edit-view',

  data: () => {
    return {
      selectedBudget: {}
    };
  },

  mounted () {
    if ('budgetId' in this.$route.params) {
      this.loadBudgets().then(() => {
        let selectedBudget = this.getBudgetById(this.$route.params.budgetId);
        if (selectedBudget) {
          this.selectedBudget = Object.assign({}, selectedBudget);
        }
      });
    }
  },

  methods: {
    ...mapActions([
      'createBudget',
      'updateBudget',
      'loadBudgets'
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

    saveBudget () {
      this.updateBudget(this.selectedBudget).then(() => {
        this.resetAndGo();
      });
    },

    processSave () {
      this.$route.params.budgetId ? this.saveBudget() : this.saveNewBudget();
    }
  },

  computed: {
    ...mapGetters([
      'getBudgetById'
    ])
  }
};
</script>
```



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
  },
  {
    path: '/budgets/:budgetId/update',
    component: components.CreateUpdateBudget,
    name: 'updateBudget'
  }
];
```



src/app/budgets/vuex/index.js

```
import * as actions from './actions';
import mutations from './mutations';
import getters from './getters';

const state = {
  budgets: {}
};

export default {
  state,
  actions,
  mutations,
  getters
};
```



src/app/budgets/vuex/getters.js

```
export default {
  getBudgetById: (state, getters) => (budgetId) => {
    return state.budgets && budgetId in state.budgets ? state.budgets[budgetId] : false;
  }
};
```





휴! 말했듯이 예산 코딩은 빨리빨리 넘어갈 것이다. 대부분은 계정 코드와 비슷하다. 이 시점에서 사용자들은...

- 예산 생성 페이지 들어갈 수 있다
- 로컬 데이터베이스에 유지되는 간단한 예산 객체를 만들 수 있다
- 해당 ID에 대한 예산 수정 페이지에 들어가서 방금 생성한 예산을 수정할 수 있다



우리가 방금 쓴 모든 것들은 위에 작업들을 지원한다. 자, 이제 커밋하기 좋은 시간이다.

 

GIT : [c61314f](https://github.com/matthiaswh/budgeterbium/commit/c61314f89b00debf32361e72f3c4134e2c4662cd)

