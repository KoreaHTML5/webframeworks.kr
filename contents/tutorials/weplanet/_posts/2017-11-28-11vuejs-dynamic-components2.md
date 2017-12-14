---
layout : tutorials
category : tutorials
title : VueJS 가이드 11 - Vue.js 다이나믹 컴포넌트로 예산 마무리하기 (2/2)
subcategory : setlayout
summary : VueJS를 통한 애플리케이션 개발에 대해 알아봅니다.
permalink : /tutorials/weplanet/11vuejs-dynamic-components2
author : danielcho
tags : vue javascript
title\_background\_color : F1F71A
---



> 본 포스팅은 [Matthias Hager](https://matthiashager.com) 의 [Vue.js Application Tutorial - Step 11: Finishing Budgets with Vue.js Dynamic Components](https://matthiashager.com/complete-vuejs-application-tutorial/vuejs-dynamic-components)를 저자의 허락하에 번역한 글입니다. 오탈자, 오역 등이 있다면 연락부탁드립니다.



이 시점에서 사용자는 4번 아이템이었던 예산 카테고리를 편집을 할 수 있다. 마지막 작업은 사용자가 예산 전체를 한 달에서 다른 달로 복사할 수 있게 해주는 것이다. 이것은 당신이 생각했던 것보다 쉽게 끝날 수도 있다. 우린 이 파트를 한 번에 해결하려고 한다. 한 가지 예외를 제외하고는...

 

src/app/budgets/vuex/actions.js

```
...

export const duplicateBudget = ({ commit, dispatch, getters, state }, data) => {
  /*
  * Expects an existing budget object, budget, and an budget to be copied, baseBudget
  * Duplicates all budget categories and budgeted amounts to the new budget
   */
  if (!(data.budget && data.baseBudget)) return Promise.reject(new Error('Incorrect data sent to duplicateBudget'));

  // clone our object in case we received something from the store
  let budget = Object.assign({}, data.budget);

  // let's reset some information first
  budget.budgeted = 0;
  budget.budgetCategories = null;
  // note that we don't reset the spent or income because we aren't
  // changing any transactions, which are what determine those values
  // but the individual category spent/income will need to be recalculated

  commit('UPDATE_BUDGET', { budget: budget });

  budget = getters.getBudgetById(budget.id);

  if ('budgetCategories' in data.baseBudget) {
    Object.keys(data.baseBudget.budgetCategories).forEach((key) => {
      dispatch('createBudgetCategory', {
        budget: budget,
        budgetCategory: {
          category: data.baseBudget.budgetCategories[key].category,
          budgeted: data.baseBudget.budgetCategories[key].budgeted,
          spent: 0 // TODO: grab this value when we have transactions!
        }
      });
    });
  }

  saveBudget(budget);

  return budget;
};

```



src/app/budgets/components/CreateUpdateBudget.vue

```
...

        <tfoot>
          <tr>
            <td>
              Copy entire budget from:
              <select
                class="select"
                @change="processDuplicateBudget($event.target.value)"
              >
                <option
                  v-for="value, key in budgets"
                  :value="key"
                >
                  {{ value.month | moment }}
                </option>
              </select>
            </td>
            <td>${{ selectedBudget.budgeted }}</td>

...

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import Datepicker from 'vuejs-datepicker';

import CreateUpdateBudgetCategory from './CreateUpdateBudgetCategory';
import BudgetCategory from './BudgetCategory';
import { moment } from '../../../filters';

export default {
  name: 'budget-create-edit-view',

  components: {
    Datepicker,
    CreateUpdateBudgetCategory,
    BudgetCategory
  },

  data: () => {
    return {
      selectedBudget: {},
      editing: false,
      activeBudgetCategory: null,
      lastBudget: null
    };
  },

  filters: {
    moment
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
      'updateBudgetCategory',
      'duplicateBudget'
    ]),

    resetAndGo () {
      this.selectedBudget = {};
      this.$router.push({ name: 'budgetsList' });
    },

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

    processSave () {
      this.$route.params.budgetId ? this.saveBudget() : this.saveNewBudget();
    },

    addBudgetCategory (budgetCategory) {
      if (!budgetCategory.category) return;

      this.createBudgetCategory({
        budget: this.selectedBudget,
        budgetCategory: {
          category: budgetCategory.category.id,
          budgeted: budgetCategory.budgeted,
          spent: 0
        }
      }).then(() => {
        this.selectedBudget = Object.assign({}, this.getBudgetById(this.$route.params.budgetId));
      });
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
    },

    processDuplicateBudget (budgetId) {
      if (confirm('Are you sure you want to duplicate that budget? Doing this will overwrite all existing data for this month (transaction data will NOT be erased).')) {
        this.duplicateBudget({
          budget: this.selectedBudget,
          baseBudget: this.getBudgetById(budgetId)
        }).then((budget) => {
          this.selectedBudget = budget;
        });
      }
    }
  },

  computed: {
    ...mapGetters([
      'getBudgetById',
      'getCategoryById'
    ]),

    ...mapState({
      'budgets': state => state.budgets.budgets
    })
  }
};
</script>

```



액션 코드는 먼저 이번 달의 예산을 지우고난 후 사용자가 복사하는 이전 예산에서 모든 카테고리를 루프하여 이번 달 예산에 추가한다. 우리는 기존의 액션과 뮤테이션을 사용하는 것이므로 새로 쓸 뮤테이션은 없다.

 

보기 측면에서는 사용자에게 기존 예산이 다 들어있는 드롭다운을 보여준다. 사용자가 여러 해 예산 데이터를 가지게 되면 인터페이스는 제대로 작동하지 않을 수도 있지만 지금으로서는 충분하다. 사용자가 선택 값을 바꾸면 복제 프로세스를 시작한다. (`$event`는 모든 이벤트를 위해 Vue가 주는 특별한 배리어블이다. `$event.target.value`는 선택 요소의 새로운 값을 가지고 있을 것이다. 그리고 이 값이 우리가 설정하는 options 요소 예산 ID가 되는 것이다.)

 

기존 데이터를 덮어쓰기 하기 전에 사용자가 자기가 뭘 하고 있는지 아는지 확인하자. 이것은 항상 좋은 생각이다! 그런 다음 우리가 만든 액션을 현재 예산과 이전 예산에게 보낸다. 이게 끝나고 선택한 예산을 업데이트하면 끝이다.

 

GIT :  [91820c8](https://github.com/matthiaswh/budgeterbium/commit/91820c8d0357c0679ce07a0db7a5c253ac54c1b5)

 

아직 시행 못한 작은 조각들이 남아있는데 완성된 애플리케이션에서는 이것들을 원할 것이다. 예산 카테고리 줄 삭제하기, 편집 취소하기, 그리고 실제 세계에서 몇 분만 사용해도 발견할 수 있을만한 수십가지의 다른 것들이 있을 것이다. 필자는 지금 이 자리까지 온 것에 대해 만족하고 있으며 마지막 모듈인 트랜잭션으로 넘어갈 준비가 되었다. 그동안은 시행하고 싶었던 추가적 기능들을 마음대로 넣어도 된다!

 

> 중복 예산 선택 상자에서 예산들의 순서가 다른가? 그렇지 않다면 이전 예산 월들을 추가해보고 다시 확인해보자.여러 곳에서 예산 목록을 보고 있을 것이고 거의 항상 정렬돼있길 원할 테니 일종의 DRY 솔루션을 갖고 있는 게 좋을 것이다. 다음 섹션으로 이동하기 전에 한 번 시도해보자.우리는 이미 `BudgetsList.vue`에 정렬 가능을 썼음을 기억하자. [6e4737e](https://github.com/matthiaswh/budgeterbium/commit/6e4737e21fcb5b191ee8874431944ff688cbb16d)에서 필자의 솔루션을 볼 수도있다.