---
layout : tutorials
category : tutorials
title : VueJS 가이드 11 - Vue.js 다이나믹 컴포넌트로 예산 마무리하기 (1/2)
subcategory : setlayout
summary : VueJS를 통한 애플리케이션 개발에 대해 알아봅니다.
permalink : /tutorials/weplanet/11vuejs-dynamic-components1
author : danielcho
tags : vue javascript
title\_background\_color : F1F71A
---



> 본 포스팅은 [Matthias Hager](https://matthiashager.com) 의 [Vue.js Application Tutorial - Step 11: Finishing Budgets with Vue.js Dynamic Components](https://matthiashager.com/complete-vuejs-application-tutorial/vuejs-dynamic-components)를 저자의 허락하에 번역한 글입니다. 오탈자, 오역 등이 있다면 연락부탁드립니다.



당신은 손에 힘을 주며 우리의 최종 모듈인 트랜잭션으로 빨리 넘어가고 싶을 수도 있을 것이다. 우리는 아직 예산이 끝나지 않았지만 거의 다 왔다.

 

전 몇 단계에서 우리가 끝내야 할 아이템들을 목록으로 만들었었다.

- 예산 "월" 추가하기
- 생성된 달에 개별 예산 카테고리 추가하기
- 예산이 추가될 때마다 월 기록 업데이트하기
- 월 및 예산에 대한 ID를 자동으로 생성하기
- 사용자가 해당 월의 예산을 볼 수있도록 "월" 보기 컴포넌트 만들기
- `IndexedDB`에서 데이터 저장 및 로딩하기
- 각 컴포넌트에 대한 루트 추가하기
- 계정 및 예산 책정 탐색하기



위에 아이템들은 완전히 다 끝났다. 하지만 우린 사용자가 할 수 있어야 할 액션들도 목록으로 만들었다. 개발은 사용자의 관점에서 바라보는 게 항상 도움이 된다. 우린 이미 이렇게 하기 시작했지만 공식화시키진 않았다. 사실상 사용자 스토리는 [agile development](https://www.mountaingoatsoftware.com/agile/user-stories)의 큰 부분이다. 기본 전제는 개발 필요 조건을 다음 형식으로 쓴다는 것이다:

 

as a I want so that ___ 

 

이 형식을 무조건적으로 따르면 당신이 하는 모든 작업은 사용자를 위한 작업이 된다. 즉, 불필요한 작업을 하는 것도 피할 수 있을 것이다. 또한 사용자의 필요에 맞춰 작업의 우선순위를 정하는데도 도움이 된다. 필자가 마케터로서 사용자 피드백을 수집하는 데 중점을 두었음에도 불구하고, 개발 프로젝트를 진행할때에는 사용자 스토리에 전적으로 충실하진 않는다. 하지만 자주 꺼내 쓰는 도구이긴 하다. 한 걸음 뒤로 물러나게 하고, 자신이 하고 있는 일의 목적을 평가하게 만들며, 종종 오래된 문제에 새로운 관점을 가져 오거나, 새로운 관점을 제시해준다. 다음은 우리가 만든 사용자 목록이다.

사용자는 다음 작업들을 할 수 있어야 한다.

1. 이번 달 예산 보기


2. 예산 금액으로 지출 카테고리 추가하기


3. 카테고리에서 쓸 수 있는 금액이 얼마나 남았는지 확인하기


4. 카테고리에 책정된 예산 금액 업데이트하기


5. 지난 달 전체 예산을 복사하기


6. 지난 달 동안 각 카테고리에서 얼마나 많은 예산을 책정 했는지 지출은 얼마인지 보기


7. 이번 달 총 수입, 예산 및 얼마나 썼는지 확인하기



이것들이 어떻게 사용자 스토리 형식에 맞을지 쉽게 이해할 수 있다.

 

아이템 4와 5를 제외하고는 모든 걸 이미 끝냈다. 예전에 계정 및 예산에 대해 편집 보기를 만들었지만 예산 항목은 인라인으로 편집하기 때문에 약간 다르다. 사용자는 예산을 볼 수 있어야 하고, 변경하려는 예산 아이템에 대한 편집 링크를 클릭하여 새로운 값을 입력할 수 있어야 한다. (어라, 이건 사용자 스토리처럼 들리지 않는가!) 우리는 '보기' 모드와 '편집' 모드 간 빠르게 전환할 수 있어야 한다. 계정에서는 `props` 값을 보고 필드를 변경하여 생성 모드와 편집 모드를 전환했었다. 여기서도 그렇게 할 수 있겠지만 보기 모드는 편집 모드랑은 완전히 다르므로, 이 둘은 실제로 전환가능한 별도의 컴포넌트여야 한다.

 

다시 한 번 말하지만 Vue.js는 이미 우리보다 2 단계 앞서 있으므로 다이나믹 컴포넌트라는것을 제공한다. 다이나믹 컴포넌트를 사용하면 개발자는 다른 컴포넌트의 템플릿에 컴포넌트 플레이스홀더를 삽입 할 수 있게 해준다. 그럼 이 `parent` 컴포넌트는 플레이스홀더에 어떤 `child` 컴포넌트가 로드되는지를 변경할 수 있다. 이렇게 하면 `parent`가 이미 마운트된 후에도 언제든지 컴포넌트를 전환 할 수 있게 해준다. 우리의 경우 사용자가 버튼을 클릭하면 보기에서 편집으로 전환되는 것이다.

 

먼저 예산 아이템 테이블 행을 컴포넌트로 바꿔야 한다. 단지 몇 가지 td 요소일뿐이므로 자체 컴포넌트일 필요가 없을 것 같았지만 이제는 컴포넌트로 교체돼야 한다.

 

src/app/budgets/components/BudgetItem.vue

```
<template>
  <tr class="budget-item">
    <td><span class="subtitle is-5">{{ getCategoryById(value.category).name }}</span></td>
    <td><span class="subtitle is-5">${{ value.budgeted }}</span></td>
    <td><span class="subtitle is-5">${{ value.spent }}</span></td>
    <td><span class="subtitle is-5">${{ value.budgeted - value.spent }}</span></td>
    <td><a class='button' @click="$emit('edit-budget-category')">Edit</a></td>
  </tr>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'budget-item',

  props: ['value'],

  computed: {
    ...mapGetters(['getCategoryById'])
  }
};
</script>
```



src/app/budgets/components/CreateUpdateBudget.vue

```
...

        <tbody>
          <template
            v-for="value, key in selectedBudget.budgetCategories"
          >
            <budget-item v-model="value"></budget-item>
          </template>
          <CreateUpdateBudgetCategory v-on:add-budget-category="addBudgetCategory"></CreateUpdateBudgetCategory>
        </tbody>

...

import CreateUpdateBudgetCategory from './CreateUpdateBudgetCategory';
import BudgetItem from './BudgetItem';

export default {
  name: 'budget-create-edit-view',

  components: {
    Datepicker,
    CreateUpdateBudgetCategory,
    BudgetItem
  },

...
```



동시에 우리는 이 예산 카테고리를 편집하고 싶다는 이벤트를 보내는 편집 버튼을 추가했다. 나중에 이것을 위한 리스너를 만들 것이다. 우리는 이미 `CreateUpdateBudgetCategory.vue`가 있지만 생성만 할 수 있으므로 업데이트 능력을 추가할 시간이다.업데이트를 위해 뮤테이션 / 액션 쌍으로 시작한다. 또한 예산 카테고리를 ID로 가져올 게터가 필요하다.



src/app/budgets/vuex/mutations.js

```
...

  CREATE_BUDGET_CATEGORY (state, payload) {
    Vue.set(state.budgets[payload.budget.id].budgetCategories, payload.budgetCategory.id, payload.budgetCategory);
  },

  UPDATE_BUDGET_CATEGORY (state, payload) {
    state.budgets[payload.budget.id].budgetCategories[payload.budgetCategory.id] = payload.budgetCategory;
  }
};

```



src/app/budgets/vuex/actions.js

```
...

  });
};

export const updateBudgetCategory = ({ commit, dispatch, getters }, data) => {
  let newBudget = data.budgetCategory.budgeted;
  let oldBudget = getters.getBudgetCategoryById(data.budget.id, data.budgetCategory.id).budgeted;

  if (newBudget !== oldBudget) {
    dispatch('updateBudgetBalance', {
      budget: data.budget,
      param: 'budgeted',
      value: newBudget - oldBudget
    });
  }

  commit('UPDATE_BUDGET_CATEGORY', data);

  // save using the budget in our store
  saveBudget(getters.getBudgetById(data.budget.id));
};
```



src/app/budgets/vuex/getters.js

```
...

  },

  getBudgetCategoryById: (state, getters) => (budgetId, budgetCategoryId) => {
    return state.budgets && budgetId in state.budgets
      ? state.budgets[budgetId].budgetCategories && budgetCategoryId in state.budgets[budgetId].budgetCategories
        ? state.budgets[budgetId].budgetCategories[budgetCategoryId]
        : false
      : false;
  }
};
```

 

여기서 새로운 개념은 없다. 예산 카테고리를 업데이트할 때 사용자가 예산 금액을 변경했는지 체크하고 이 변화를 총 예산으로 전달한다. 게터 코드는... 글쎄, 체인화된 3진수에 대해 의문을 가질 수도 있다. if-else 문으로 쓸 수도 있지만 실제로 가독성을 높이는데 도움이 될 것 같진 않다. 이 코드는 단순히 데이터가 존재하는지 체크하고 데이터가 있으면 반환하고 없으면 false를 반환한다.

 

예산 카테고리를 편집하는 백엔드 로직이 이제 자리를 잡았다. 인터페이스를 추가한 다음 다이나믹 컴포넌트를 사용하여 인터페이스를 사용자에게 보여줄 방법을 찾아야한다.



src/app/budgets/components/CreateUpdateBudgetCategory.vue

```
...

<a class="button is-primary" @click.prevent="processSave">
  {{ editing ? 'Save' : 'Add' }}
</a>

...

components: {
    Multiselect
  },

  props: [
    'value'
  ],

  data: () => {
    return {
      budgetCategory: {},
      editing: false
    };
  },

  mounted () {
    this.loadCategories();
    if (this.value) {
      this.budgetCategory = Object.assign({}, this.value);

      // we need the selected category name and ID, but the budgetCategory object only holds the ID by default
      this.budgetCategory.category = this.getCategoryById(this.budgetCategory.category);

      this.editing = true;
    }
  },

  methods: {
    ...mapActions([
      'createCategory',
      'loadCategories'
    ]),

    processSave () {
      // we are passing the saves up to the budget because this budget
      // category view isn't aware of its parent budget object
      if (this.editing) {
        this.$emit('update-budget-category', this.budgetCategory);
      } else {
        this.$emit('add-budget-category', this.budgetCategory);
        this.budgetCategory = {};
      }
    },

    ...

  computed: {
    ...mapGetters([
      'getCategorySelectList',
      'getCategoryById'
    ])
  }
};
</script>

```



src/app/budgets/components/CreateUpdateBudget.vue

```
...

        <tbody>
          <template
            v-for="value, key in selectedBudget.budgetCategories"
          >
            <component
              :is="budgetCategoryComponent(value)"
              v-model="value"
              v-on:update-budget-category="saveBudgetCategory"
              v-on:edit-budget-category="activeBudgetCategory = value"
            ></component>
          </template>
          <CreateUpdateBudgetCategory v-on:add-budget-category="addBudgetCategory"></CreateUpdateBudgetCategory>
        </tbody>

...

  components: {
    Datepicker,
    CreateUpdateBudgetCategory,
    BudgetCategory
  },

  data: () => {
    return {
      selectedBudget: {},
      editing: false,
      activeBudgetCategory: null
    };
  },

  mounted () {
    if ('budgetId' in this.$route.params) {
      this.loadBudgets().then(() => {
        let selectedBudget = this.getBudgetById(this.$route.params.budgetId);
        if (selectedBudget) {
          this.editing = true;
          this.selectedBudget = Object.assign({}, selectedBudget);
        }
      });
    }
  },

  methods: {
    ...mapActions([
      'createBudget',
      'updateBudget',
      'loadBudgets',
      'createBudgetCategory',
      'updateBudgetCategory'
    ]),

    ...

    },

    saveBudgetCategory (budgetCategory) {
      // format it how our action expects
      budgetCategory.category = budgetCategory.category.id;
      this.updateBudgetCategory({
        budget: this.selectedBudget,
        budgetCategory: budgetCategory
      }).then(() => {
        this.selectedBudget = Object.assign({}, this.getBudgetById(this.$route.params.budgetId));
      });
    },

    budgetCategoryComponent (budgetCategory) {
      return this.activeBudgetCategory && this.activeBudgetCategory === budgetCategory ? 'create-update-budget-category' : 'budget-category';
    }

...
```

 

생성 / 업데이트 컴포넌트는 이제 업데이트 이벤트를 체인 위로 전달한다. 예산 카테고리는 `parent` 예산의 일부이지만 `parent`를 인식하지 못하기 때문에 예산 자체가 업데이트를 처리해야한다.

 

드디어 다이나믹 컴포넌트 부분으로 왔다. `<component></component>` 태그를 플레이스홀더로 사용한다. `:is` 속성은 어떤 컴포넌트를 쓸지 결정하기 위해 `budgetCategoryComponent(value)` 메서드를 실행한 결과에 의존하라고 지시한다. 이 메서드는 `activeBudgetCategory`가 현재 루프되는 예산 카테고리인지 체크한다. 그렇다면 `CreateUpdateBudgetCategory` 컴포넌트를 쓰고, 그렇지 않으면 `BudgetCategory`로 돌아간다.

 

이제 모든 것을 하나로 묶는데 필요한 이벤트 리스너로 방향을 바꾸자.

 

![](https://matthiashager.com/user/pages/complete-vuejs-application-tutorial/vuejs-dynamic-components/budgeterbium-budget-edit.PNG)



이 코드는 잘 작동하고 우리의 소규모 애플리케이션에 적합하다. 여기서 다이나믹 컴포넌트를 사용하는데 단점이 보이는가? 이 작업에 대한 다른 접근 방식을 생각해낼 수 있는가?

 

커밋 할 시간이다.



GIT :  [0e8972c](https://github.com/matthiaswh/budgeterbium/commit/0e8972c5e95146c7c320e37f2c1684b1e9ee1244)

