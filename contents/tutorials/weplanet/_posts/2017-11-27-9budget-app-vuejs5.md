---
layout : tutorials
category : tutorials
title : VueJS 가이드 9 - 예산 끝내기 (5/7)
subcategory : setlayout
summary : VueJS를 통한 애플리케이션 개발에 대해 알아봅니다.
permalink : /tutorials/weplanet/9budget-app-vuejs5
author : danielcho
tags : vue javascript
title\_background\_color : F1F71A
---



> 본 포스팅은 [Matthias Hager](https://matthiashager.com) 의 [Vue.js Application Tutorial - Step 9: Racing Through Budgets](https://matthiashager.com/complete-vuejs-application-tutorial/budget-app-vuejs))를 저자의 허락하에 번역한 글입니다. 오탈자, 오역 등이 있다면 연락부탁드립니다.





##Vue.js로 목록 정렬하기

Vue.js는 계산된 속성들을 사용하여 아이템 목록을 필터링하거나 정렬하는 것을 매우 간단하게 만들어준다. 계산된 속성들은 안에 있는 데이터가 바뀔 때 자동으로 업데이트되므로 다시 정렬할 필요가 없다. 그냥 바로 된다. 우리에게 남겨진 일은 그저 각 예산의 날짜 객체를 비교해야 하는 것뿐이다. 데이터 스토리지에 대한 우리의 접근 방식이 부정적인 영향을 미치는 것은 이번이 처음이다. 만약에 모든 예산이 목록에 있었다면 우리는 다음과 같이 할 수 있다.

 

`budgets.sort((a,b)=> { return a.month - b.month; });`

 

만약 우리가 진정한 관계형 데이터베이스를 사용하고 있었다면 쿼리를 사용하여 데이터베이스가 데이터 구조를 정렬할 수 있도록 했을 것이다.

 

그렇다고 해결 방법이 그렇게 어려운건 아니다. 객체의 키는 `Object.keys(obj)`를 불러와서 어레이로 가져올 수 있다. 이미 이렇게 몇 번 했다. 이 어레이는 반복하여 결과를 정렬 할 수 있다. 마지막으로, 사실 결과가 키 - 값 형식으로 있어야하는 건 아니다. 이 템플릿은 값만 필요하기 때문에 값만 줄 것이다.



```
// /src/app/budgets/components/BudgetsList.vue
...
  computed: {
    ...mapState({
      'budgets': state => state.budgets.budgets
    }),

    sortedBudgets () {
      let sortedKeys = Object.keys(this.budgets).sort((a, b) => {
        return this.budgets[b].month - this.budgets[a].month;
      });

      return sortKeys.map((key) => {
        return this.budgets[key];
      });
    }
  }
...
```

 

아주 멋지거나 효율적인 코드는 아닐 수도 있지만 작동은 한다. 또한 예산의 순서를 `b - a`로 바꿔서 제일 최근에 것일 먼저 보이게 했다. 그런 다음 결과 값들을 어레이로 반환한다. 새로운 객체를 반환할 수도 있었지만 이렇게 하면 템플릿이 조금 더 간단하게 만들어진다.

 

```
<li v-for="budger in sortedBudgets">
```



##유니크 값인지 체크하기

이제 우리는 사용자가 같은 달에 여러 예산을 만들지 못하도록 예산 월이 유니크한지 체크해야 한다. 이걸 할 수 있는 (해야 하는) 곳이 두 군데가 있다. 첫 번째는 양식 유효성 검사를 통한 방식이다. 양식 유효성 검사는 나중에 더 자세하게 다룰 것이다. 유효한지 체크해야 할 더 중요한 곳은 데이터 레이어다. 서버 벡엔드를 사용하는 게 아니기 때문에 데이터 품질 및 완전성 확인은`Budgeterbium`한테 달렸다. 객체를 스토어에 저장할 때 충돌이 없는지 확인해야한다는 것이다. 이걸 확인하기 위해 `createBudget`과 `updateBudget` 액션을 쓸 것이다.

 

```
// /src/app/budgets/vuex/actions.js
import moment from 'moment';
import { guid } from '../../../utils';
import { saveBudget, fetchBudgets } from '../api';

const verifyUniqueMonth = (budgets, budget) => {
  // accepts a list of budgets, and the budget being updated
  // returns true if there is no date collision
  // returns false if a budget already exists in budgets with the same month as budget
  let month = moment(budget.month);
  return !Object.values(budgets).find((o) => {
    return month.isSame(o.month, 'month');
  });
};

export const createBudget = ({ commit, state }, data) => {
  let unique = verifyUniqueMonth(state.budgets, data);

  if (!unique) {
    return Promise.reject(new Error('A budget already exists for this month.'));
  }

  let id = guid();
...
```



`verifyUniqueMonth` 기능은 단순히 모든 예산을 루프하고 저장된 예산과 일치하는 것을 찾으면 true를 반환한다. 그 후에는 `Promise.reject`를 새로운 에러와 함께 반환한다. 코드가 단순히 에러, `throw new Error()`를 하면 Vue.js 컴포넌트는 `try...catch` 블록에 저장 코드를 래핑해야 한다. 이미 `saveBudget().then()` 같은 Promises를 사용하고 있으니 그 메서드를 계속 사용하자. 그런 다음 컴포넌트에서 리젝션을 보다 잘 처리한다. 이번 달 예산이 이미 존재하는 경우 지금은 `redirection` 하지 말고 간단하게 사용자에게 경고를 주자. 나중에 제대로 된 에러 처리를 추가할 것이다.



```
// /src/app/budgets/components/CreateUpdateBudget.vue
...

saveNewBudget () {
      this.createBudget(this.selectedBudget).then(() => {
        this.resetAndGo();
      }).catch((err) => {
        alert(err);
      });
    },

    saveBudget () {
      this.updateBudget(this.selectedBudget).then(() => {
        this.resetAndGo();
      }).catch((err) => {
        alert(err);
      });
    },
...
```

 

rejection을 처리하는데 한 줄 이상 필요하면 따로 메서드를 만드는 게 낫다. 이 부분을 다 했으면, 사용자가 예산 아이템을 만들거나 업데이트하려고 할 때 예산 항목에서 이미 해당 월을 사용 중인 경우 못하게 만들자.

 

우리의 체크리스트를 다시 확인해보자. 전부 완료했다. 

- 사용자가 날짜 선택 도구로 선택하도록 한다. - X
- "월 / 년" 포맷으로 해놓는다. - X
- 날짜 객체 (또는 이와 유사한 객체)에 저장한다. - X
- 데이터베이스에 저장할 때 JSON에서 또는 JSON으로 처리한다. - X
- 예산 목록을 월별로 정렬한다. - X
- 사용자가 매월 1개의 예산만 추가할 수 있는지 확인한다. - X



GIT :  [da59844](https://github.com/matthiaswh/budgeterbium/commit/da598446092745358da0e25887028a0b5db272ad)



##예산 카테고리

8번째 세션을 다시 보자. 이제 사용자가 이번 달의 예산 카테고리를 추가할 수 있게 해줄 시간이다. 이것은 우리가 이미 계획하기 시작했던 것이다. 카테고리는 중간 `budgets` 객체와 같이 ID로 월 예산에 링크된 개별 데이터 객체이다. 링크된 데이터로 작업 하는 것은 이번이 처음이기 때문에, 이 부분에서는 조금 천천히 가자. 



관계형 데이터베이스가 익숙하다면 이게 기본적으로 다-대-다 관계라는 것을 알고 있을 것이다. `budget`은 `budgetCategories`를 통해 많은 `categories`를 가지고 있다. 각 `budgetCategories` 객체에는 모 예산에서 합해야하는 예산 금액과 지출액이 있다. 사용자가 이번 달의 예산을 만들 때 일관성을 유지할 수 있도록 기존 카테고리를 제공해야 한다. 그러나 새로운 카테고리를 즉석에서 생성할 수 있도록 만들어야 한다.

 

사용자는 별도의 페이지에 예산 카테고리를 추가하지 않고, 한 달 예산 전체를 예산 수정 페이지에서 만들 것이다. 이를 위해서는 이 페이지에서 임포트하고 사용할 컴포넌트 몇 개를 만들어야 한다. 먼저 데이터 레이어로 시작해야 한다. 스토어, 뮤테이터, 액션 및 API를 업데이트하자. `budgetCategories`는 결국 모 `budget` 객체의 일부로 저장될 것이지만 개별 `categories` 객체를 추가하긴 해야 한다.

 

src/app/budgets/vuex/index.js

```
import * as actions from './actions';
import mutations from './mutations';
import getters from './getters';

const state = {
  budgets: {},
  categories: {}
};

export default {
  state,
  actions,
  mutations,
  getters
};
```



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
  },

  CREATE_CATEGORY (state, payload) {
    state.categories[payload.category.id] = payload.category;
  },

  UPDATE_CATEGORY (state, payload) {
    state.categories[payload.category.id] = payload.category;
  },

  LOAD_CATEGORIES (state, payload) {
    state.categories = payload;
  }
};
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
```



src/app/budgets/api.js

```
import localforage from 'localforage';
import { processAPIData } from '../../utils';

const BUDGET_NAMESPACE = 'BUDGET-';
const CATEGORY_NAMESPACE = 'CATEGORY-';

export const saveBudget = (budget) => {
  budget = Object.assign({}, budget); // clone our object so we can manipulate it before saving
  budget.month = budget.month.toJSON();

  return localforage.setItem(
    BUDGET_NAMESPACE + budget.id,
    budget
  ).then((value) => {
    return value;
  }).catch((err) => {
    console.log('had a little trouble saving that budget', err);
  });
};

export const fetchBudgets = () => {
  return localforage.startsWith(BUDGET_NAMESPACE).then((res) => {
    let budgets = processAPIData(res);
    Object.keys(budgets).forEach((o) => {
      budgets[o].month = new Date(budgets[o].month);
    });

    return budgets;
  });
};

export const saveCategory = (category) => {
  return localforage.setItem(
    CATEGORY_NAMESPACE + category.id,
    category
  ).then((value) => {
    return value;
  }).catch((err) => {
    console.log('category problems abound! ', err);
  });
};

export const fetchCategories = () => {
  return localforage.startsWith(CATEGORY_NAMESPACE).then((res) => {
    return processAPIData(res);
  });
};
```



GIT :  [9ed4b99](https://github.com/matthiaswh/budgeterbium/commit/9ed4b9982c6f81da4a56c1b8ad9332e9ee87e4d7)

우린 분명 어떤 작은 조각 하나가 필요할 것이다. 바로 ID를 기반으로 카테고리를 잡는 게터이다.

 

```
// /src/app/budgets/vuex/getters.js
export default {
  getBudgetById: (state, getters) => (budgetId) => {
    return state.budgets && budgetId in state.budgets ? state.budgets[budgetId] : false;
  },

  getCategoryById: (state, getters) => (categoryId) => {
    return state.categories && categoryId in state.categories ? state.categories[categoryId] : false;
  }
};
```


