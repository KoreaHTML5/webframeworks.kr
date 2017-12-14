---
layout : tutorials
category : tutorials
title : VueJS 가이드 9 - 예산 끝내기 (7/7)
subcategory : setlayout
summary : VueJS를 통한 애플리케이션 개발에 대해 알아봅니다.
permalink : /tutorials/weplanet/9budget-app-vuejs7
author : danielcho
tags : vue javascript
title\_background\_color : F1F71A
---



> 본 포스팅은 [Matthias Hager](https://matthiashager.com) 의 [Vue.js Application Tutorial - Step 9: Racing Through Budgets](https://matthiashager.com/complete-vuejs-application-tutorial/budget-app-vuejs))를 저자의 허락하에 번역한 글입니다. 오탈자, 오역 등이 있다면 연락부탁드립니다.





##Vue-Multiselect로 즉석에서 카테고리 만들기

우리는 사용자의 예산을 만드는 프로세스를 가능하면 부드럽고 원활하게 만들어야 한다. 필요한 모든 카테고리를 이미 만들었으면 드랍다운 목록에서 선택하는 것이 가능하다. 그러나 기존 카테고리에 지정하는 것만큼 쉽게 새로운 카테고리를 만들 수 있어야 한다. 이를 위해서는 [vue-multiselect](https://monterail.github.io/vue-multiselect/)를 사용하자. 사용자가 입력을 시작하면 주어진 옵션에서 완료하거나 자신이 원하는 새 값을 사용할 수 있는 드랍다운 선택 옵션을 준다. 사용자들이 새로운 값을 사용하면 우리는 그 카테고리를 바로 생성하면 된다.

 

```
npm installvue-multiselect@next --save
```

 

지금 빈 `CreateUpdateBudgetCatergory` 컴포넌트를 만들고 나중에 `vue-multiselect`에 연결시키자. 이걸 `CreateUpdateBudget.vue`에 넣을 것을 기억하자.

 

```
// /src/app/budgets/components/CreateUpdateBudgetCategory.vue
<template>
  <div id="budget-category-create-edit-view">
    <form class="form" @submit.prevent="processSave">
      <div class="control is-horizontal">
        <div class="control is-grouped">
          <div class="control is-expanded">
            <input type="text" v-model="budgetCategory.category">
          </div>
          <div class="control is-expanded">
            $<input type="number" class="input" v-model="budgetCategory.budgeted" />
          </div>
          <div class="control is-expanded">
            {{ budgetCategory.spent }}
          </div>
          <button @click.prevent="processSave">Add</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'budget-categorycreate-edit-view',

  components: {
  },

  data: () => {
    return {
      budgetCategory: {}
    };
  },

  mounted () {
  },

  methods: {
    ...mapActions([
    ]),

    processSave () {
    }
  },

  computed: {
    ...mapGetters([
    ])
  }
};
</script>
```



이걸 설치하고 `CreateUpdateBudget.vue`에서 사용하는 건 쉽다. `datepicker`에서 이미 했던 과정이다.

 

```
// /src/app/budgets/components/CreateUpdateBudget.vue
...

</div>
    </form>

    <create-update-budget-category></create-update-budget-category>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Datepicker from 'vuejs-datepicker';

import CreateUpdateBudgetCategory from './CreateUpdateBudgetCategory';

export default {
  name: 'budget-create-edit-view',

  components: {
    Datepicker,
    CreateUpdateBudgetCategory
  },
  ...
```



예산 수정페이지를 보면 우울하게도 레이블도 없고 디자인도 안된 필드가 보일 것이다. 우리는 곧 디자인을 멋지게 꾸밀 것이다, 약속한다!

 

예산 카테고리는 별개의 객체가 아니고 `budget` 객체의 일부이기 때문에, `CreateUpdateBudgetCategory` 컴포넌트가 `parent`를 인식할수 있게 할 것인지 결정해야 한다. `parent` 예산 객체를 `prop`으로 전달하여, 예산 카테고리 컴포넌트가 예산을 저장하게 할 수 있다. 아니면 `budgetCategory` 객체를 다시 `CreateUpdateBudget`에 전달하여 `budget`을 저장하게 할 수도 있다. 일반적으로 데이터는 위쪽으로 흘러야 하고 컴포넌트는 `parent`를 인식하면 안된다. 즉, 컴포넌트에게는 자체 URL에서 로드가 되던 다른 페이지의 일부로 로드가 되던 상관이 없다는 것이다. 이렇게 하면 `child` 컴포넌트는 주위에서 일어나는 모든 것들로부터 분리될 수 있으므로, 훨씬 더 유용해진다.

 

사용자가 예산 카테고리를 추가할 때 그 컴포넌트는 `parent` 컴포넌트가 저장을 수행할 수 있도록 이벤트를 보내야 한다. 어려운 작업들은 Vue.js가 이미 처리하였고, 위쪽으로 전달되는 이벤트를 내보낼 수 있는 방법을 제공한다. 그러면 컴포넌트의 `ancestors`가 이를 듣는 것이다. 이걸`processSave` 메서드에 넣자.



```
// /src/app/budgets/components/CreateUpdateBudgetCategory.vue
...
processSave () {
  this.$emit('add-budget-category', this.budgetCategory);
  this.budgetCategory = {};
}
...
```



이제 `CreateUpdateBudget.vue`는 `CreateUpdateBudgetCategory` 컴포넌트에서 `add-budget-category` 이벤트를 받고 응답할 수 있다. 이런 경우 이벤트에서 보낸 정보를 사용하여, 선택한 예산 객체에서 예산 카테고리를 생성해야 한다. 데이터레이어는 이미 코딩했기 때문에 그냥 모든 걸 다 묶어주기만 하면 된다.

 

```
// /src/app/budgets/components/CreateUpdateBudget.vue
...
<CreateUpdateBudgetCategory v-on:add-budget-category="addBudgetCategory"></CreateUpdateBudgetCategory>

...

...mapActions([
  'createBudget',
  'updateBudget',
  'loadBudgets',
  'createBudgetCategory'
]),

...
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
    this.selectedBudget = this.getBudgetById(this.$route.params.budgetId);
  });
}

...
```



먼저 `CreateUpdateBudgetCategory` 컴포넌트에서 `add-budget-category` 이벤트를 `listen`한다. 이 컴포넌트가 `addBudgetCategory` 메서드를 불러야 한다. 이렇게 해야 데이터를 올바른 형식으로 놓고 우리가 만든 `createBudgetCategory` 액션을 보내는 것이다. 그 후에는 선택한 예산을 다시 로드한다. 이 부분이 필요한 이유는 원본이 아니고 `Vuex` 예산 객체의 클론을 가지고 편집 및 작업을 하기 때문이다. 따라서 업데이트가 자동으로 되지 않는 것이다. 

 

이제 사용자는 예산 카테고리를 추가하고 총 예산 금액의 변화를 볼 수 있다. 하지만 실제 예산 카테고리는 볼 수 없다. 지금은 그냥 간단한 테이블로 보여주자.



```
// /src/app/budgets/components/CreateUpdateBudget.vue
...
      </form>

      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Budgeted</th>
            <th>Spent</th>
            <th>Remaining</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="bc in selectedBudget.budgetCategories">
            <td>{{ getCategoryById(bc.category).name }}</td>
            <td>${{ bc.budgeted }}</td>
            <td>${{ bc.spent }}</td>
            <td>${{ bc.budgeted - bc.spent }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td></td>
            <td>${{ selectedBudget.budgeted }}</td>
            <td>${{ selectedBudget.spent }}</td>
            <td>${{ selectedBudget.budgeted - selectedBudget.spent }}</td>
          </tr>
        </tfoot>
      </table>

      <CreateUpdateBudgetCategory v-on:add-budget-category="addBudgetCategory"></CreateUpdateBudgetCategory>
      ...

...mapGetters([
  'getBudgetById',
  'getCategoryById'
])
...
```

 

여전히 카테고리를 보지 못한다는 것을 빼고는 잘 작동한다. 근데 이건 우리가 아직 추가하지 않아서다! 그럼 이걸 고치고, 그때쯤다시 커밋을 하자.

 

`Vue-multiselect`는 Vue 2의 `v-model` 디렉티브와 원활하게 작동할 것이다. 사실 필자는 `v-model`을 사용할 때 새로운 카테고리를 만드는데 어려움을 겪었다. 그래서 우리는 값을 직접 설정하고, 이벤트를 받을 것이다. 먼저 컴포넌트를 임포트하고 간단한 `input`을 `multiselect`으로 바꾸자.

 

```
// /src/app/budgets/components/CreateUpdateBudgetCategory.vue
...
<multiselect
    :value="budgetCategory.category"
    :taggable="true"
    @tag="handleCreateCategory"
    @input="updateCategorySelection"
    :options="getCategorySelectList"
    placeholder="Select or create a category"
    label="name"
    track-by="id"

> </multiselect>
> </div>
> <div class="control is-expanded">
> $<input type="number" class="input" v-model="budgetCategory.budgeted" />
> </div>

...
import Multiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.min.css';

export default {
  name: 'budget-category-create-edit-view',

  components: {
    Multiselect
  },
...
```



이 컴포넌트 태그에서는 많은 일들이 일어나고 있다. 우린 이 값을 `budgetCategory.category`에 연결한다. Vue.js `props` 은 한 방향으로만 동기화된다는 것을 기억하자. `multiselect` 값의 변화는 코드에서 자동으로 인식되지 않는다. (우리가 `v-model`을 썼다면 동기화되었을 것이다.) 변화에 반응하는 방법이 필요하니 값이 변할 때 `multiselect`가 보내는 `@update` 이벤트를 사용하자.

 

그리고`multiselect`는 우리가 태그할 수 있어야 한다. `multiselect`의 이 기능은 새로운 카테고리를 사용자가 즉석에서 만들 수 있게 해줄 것이며, `@tag` 이벤트를 내보낼 때 우리는 응답할 수 있다. `:options`는 `multiselect`에게 드랍다운 옵션들을 제공한다. 어레이로 되어 있어야 한다. 마지막으로 `label`과 `track-by`는 `options` 어레이의 객체 속성에 매핑된다. `category` 객체에서 중요한 두 값은 `name`과 `id`이다.

 

우리는 아직 3가지 메서드를 더 만들어야 한다:

`handleCreateCategory`,`updateCategorySelection`, `getCategorySelectList`

 

```
// /src/app/budgets/components/CreateUpdateBudgetCategory.vue
...
handleCreateCategory (category) {
  let newCategory = { name: category };
  this.createCategory(newCategory).then((val) => {
    this.updateCategorySelection(val);
  });
},

updateCategorySelection (category) {
  // if using v-model and not using Vue.set directly, vue-multiselect seems to struggle to properly
  // keep its internal value up to date with the value in our component. So we're skipping v-model
  // and handling updates manually.
  this.$set(this.budgetCategory, 'category', category);
}
...
```



사용자가 카테고리를 선택하면 우리는 `Vue.set`을 사용하여 편집 중인 객체를 업데이트한다. `@tag` 이벤트에 대한 응답으로 우리는 새로운 카테고리를 만들고, 그 후에 업데이트한다.

 

`CREATE_CATEGORY` 뮤테이션에 작은 수정을 해줘야 사용자가 새로운 카테고리를 만들 때 우리가 업데이트 받을 수 있다.

 

```
// /src/app/budgets/vuex/mutations.js
...
CREATE_CATEGORY (state, payload) {
  Vue.set(state.categories, payload.category.id, payload.category);
},
...
```



그런 다음 게터를 예산 카테고리의 넣을 것이다. 이는  `categories` 객체를 flat 어레이로 간단하게 전환시켜준다.  



```
// /src/app/budgets/vuex/getter.js
...
getCategorySelectList: (state, getters) => {
  return state.categories && Object.keys(state.categories).length > 0 ? Object.values(state.categories) : [];
}
```



자 이제 커밋 할 시간이다.



GIT :  [7b2f9f3](https://github.com/matthiaswh/budgeterbium/commit/7b2f9f34b5bf645f7efc513528bbe8117c650463)

 



참고로 개발 중에 로컬 데이터베이스가 지저분해지면 Chrome을 사용하는게 좋다.





![](https://matthiashager.com/user/pages/complete-vuejs-application-tutorial/budget-app-vuejs/budgeterbium-vuejs-localstorage.gif)

 

아직 끝내야할 작업이 남았고 필자의 노트에는 고려해야할 여러 아이템들이 있지만, 예산 관련 튜토리얼은 이 정도면 충분하다고 생각한다. 꽤 길어졌지만 너무 다루기 힘들 정도는 아니었으면 좋겠다. 항상 그렇듯이 GitHub 보관소에서 코드를 탐색해보고 커밋 기록을 탐색하여 코드의 변화를 확인할 수 있다. 다음 업데이트에서는 간단하면서도 강력한 탐색 객체를 만드는 동시에 애플리케이션 스타일링을 다룰 것이다.