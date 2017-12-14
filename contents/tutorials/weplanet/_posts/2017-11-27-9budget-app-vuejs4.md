---
layout : tutorials
category : tutorials
title : VueJS 가이드 9 - 예산 끝내기 (4/7)
subcategory : setlayout
summary : VueJS를 통한 애플리케이션 개발에 대해 알아봅니다.
permalink : /tutorials/weplanet/9budget-app-vuejs4
author : danielcho
tags : vue javascript
title\_background\_color : F1F71A
---



> 본 포스팅은 [Matthias Hager](https://matthiashager.com) 의 [Vue.js Application Tutorial - Step 9: Racing Through Budgets](https://matthiashager.com/complete-vuejs-application-tutorial/budget-app-vuejs))를 저자의 허락하에 번역한 글입니다. 오탈자, 오역 등이 있다면 연락부탁드립니다.



개발 노트를 계속 사용하고 있는가? 필자의 공책에는 이미 많은 것들이 쓰여있다. 제일 중요한 아이템은 예산 월을 날짜로 처리해야 한다는 것이다.

- 사용자가 날짜 선택 도구로 선택하도록 한다. 
- "월 / 년" 포맷으로 해놓는다. 
- 날짜 객체 (또는 이와 유사한 객체)에 저장한다. 
- 데이터베이스에 저장할 때 JSON에서 또는 JSON으로 처리한다.
- 예산 목록을 월별로 정렬한다.
- 사용자가 매월 1개의 예산만 추가할 수 있는지 확인한다.




우리는 2개의 라이브러리를 사용할 것이다. [Vuejs-datepicker](https://github.com/charliekassel/vuejs-datepicker)는 사용자에게 날짜를 선택할 수 있는 위젯을 제공한다. 안타깝게도 달을 직접 고를 수 있는 옵션을 주진 않지만 이거면 충분하다. [Moment.js](https://momentjs.com/)는 날짜와 시간을 `parse`, `format`, `manipulate` 하게 해준다. 딱히 이게 필요한건 아니지만 많은 날짜 작업을 쉽게 해줄 것이다.

 

```
npm install vuejs-datepicker;moment --save
```

 

예산에 있는 달 필드에 추가하는 건 쉽다. 우리는 1) datepicker 컴포넌트를 우리의 컴포넌트에 등록하고, 2) 템플릿에 datepicker를 임포트해서 설치하고, 3) v-model을 사용하여 예산 달에 값을 연결시켜야 한다.

 

```
// /src/app/budgets/components/CreateUpdateBudget.vue

...
<form class="form" @submit.prevent="processSave">
      <label for="month" class="label">Month</label>
      <p class="control">
        <datepicker name="month" input-class="input" format="MMMM yyyy" v-model="selectedBudget.month"></datepicker>
      </p>
      <label for="budgeted" class="label">Budgeted amount</label>

...

<script>
import { mapActions, mapGetters } from 'vuex';
import Datepicker from 'vuejs-datepicker';

export default {
  name: 'budget-create-edit-view',

  components: {
    Datepicker
  },

  data: () => {

...
```



예산은 아무데나 저장하면 안되고 데이터베이스에 저장하기 전에 이 새로운 날짜 객체를 처리하고 불러올 때 날짜 객체로 다시 변환 시켜야 한다. 저장할 때는 날짜 객체를 JSON으로 변환해야 한다. 불러올 때는 JSON 스트링에서 새로운 날짜 객체를 만든다.

 

```
// /src/app/budgets/vuex/api.js
import localforage from 'localforage';
import { processAPIData } from '../../utils';

const BUDGET_NAMESPACE = 'BUDGET-';

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
```



이제 이게 다 끝났으니 예산 목록 페이지로 돌아가서 달이 (보기 흉한) datetime 값으로 나타나있는 것을 확인하자.

 

![](https://matthiashager.com/user/pages/complete-vuejs-application-tutorial/budget-app-vuejs/budgeterbium-ugly-datetime.PNG)



간단한 필터를 만들어서 이 정보를 사용자 친화적인 형식으로 만들자. 필터라는 용어에 당황할 수도 있겠지만 Vue.js에서 필터는 텍스트 포맷팅에 주로 쓰인다. 우리의 프로젝트 구조에서는 필터를 계획한 적이 없지만 핵심 디렉터리에 `filter.js` 파일을 넣을 것이다. 이 날짜 형식의 필터는 여러 곳에서 사용될 것이다. 예산 모듈에만 해당되면 거기에 넣었을 것이다.

 

필터는 그저 템플릿에 값을 여러 인수와 같이 받아서, 값을 변경하고, 결과를 반환하는 것이다. 우리의 필터는 기본 날짜 객체를 전달하며 `moment.js`를 사용하여 형식을 지정하고, 포맷팅된 날짜를 반환하는 것이다. 항상 `MMMM yyyy` 형식을 쓰도록 하드코딩을 할 수도 있지만 다른 곳에서는 다른 형식을 쓰고 싶을 수도 있으니 유연하게 만들자. `MMMM yyyy`를 디폴트로 만들 것이지만 포맷 인수가 전달될 수 있게 허용할 것이다.



```
// /src/filters.js
import momentjs from 'moment';

export const moment = (date, format) => {
  format = format || 'MMMM YYYY';
  return momentjs(date).format(format);
};
```



`vuejs-datepicker`와 `moment.js`는 살짝 다른 포맷팅 인수를 쓰는 걸 염두하자.

 

그 후, `BudgetsList.vue`에 필터를 임포트해서 설치하고 목록에 사용하자.



```
 // /src/app/budgets/components/BudgetsList.vue
...

<li v-for="budget, key in budgets">
        {{ budget.month | moment }}
        ${{ budget.budgeted }}

...

import { moment } from '../../../filters';

export default {
  name: 'budgets-list',

  filters: {
    moment
  },

  mounted () {

...
```



이제 우리의 목록은 이렇게 생겼다:



 ![](https://matthiashager.com/user/pages/complete-vuejs-application-tutorial/budget-app-vuejs/budgeterbium-budget-list-dates.PNG)



만약 날짜를 다른 형식으로 보여주고 싶으면 인수를 필터에 전달시키면 된다. 아직은 표준 `JavaScript` 날짜 형식으로 날짜를 처리하고 있다는 것을 알고 있자. 날짜 표시 및 계산에만 `moment.js`를 쓰고 있는 것이다. 



`{{ budget.month | moment('MMM YYYY') }}`



GIT : [e2c8ae5](https://github.com/matthiaswh/budgeterbium/commit/e2c8ae5833e1be61bca726ecd0dc7653018387f0)



이제 우리의 목록에 있던 아이템들 중 첫 3개를 해결했다. 다음 단계에서는 예산 목록을 월별로 정렬하고, 한 달에 예산이 2개를 초과하지 않도록 해야 한다.


