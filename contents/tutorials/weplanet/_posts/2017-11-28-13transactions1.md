---
layout : tutorials
category : tutorials
title : VueJS 가이드 13 - Transaction (1/4)
subcategory : setlayout
summary : VueJS를 통한 애플리케이션 개발에 대해 알아봅니다.
permalink : /tutorials/weplanet/13transactions1
author : danielcho
tags : vue javascript
title\_background\_color : F1F71A
---



> 본 포스팅은 [Matthias Hager](https://matthiashager.com) 의 [Vue.js Application Tutorial - Step 13 - All Aboard the Transaction Train](https://matthiashager.com/complete-vuejs-application-tutorial/transactions)를 저자의 허락하에 번역한 글입니다. 오탈자, 오역 등이 있다면 연락부탁드립니다.



이제 드디어 애플리케이션의 마지막 모듈인 트랜잭션을 코딩할 준비가 되었다. 좋은 소식은 대부분의 코드가 예산 및 계정에서 이미 작성한 코드와 거의 동일하므로 튜토리얼의 첫 번째 부분은 빠르게 지나갈 것이다. 반복은 배우는데 좋다.

 

나쁜 소식은 대부분의 코드가 예산 및 계정에 이미 작성한 코드와 거의 동일하므로 튜토리얼의 첫 번째 부분에서는 새로운 개념을 가르칠 기회가 많이 없다는 것이다.

 

이 튜토리얼의 첫 번째 부분은 완전히 복사해서 붙여넣기 말고 혼자서 해보는 걸 강력하게 추천한다. 트랜잭션 및 비즈니스를 위한 백엔드 데이터 관리를 만들고 트랜잭션 목록으로 넘어간 다음 트랜잭션 편집 및 생성으로 가라. 하다가 모르겠으면 우리가 예산과 계정에서 이미 쓴 해당 코드를 참조하자. 그러나 너무 자주 거기에 의존하진 말자. 다 끝나면 여기로 돌아와서 필자가 생각해낸 것과 비교해보자. 당신이 더 나은 방법을 찾을 수도 있다!

 

> 필자 노트: 이건 필자가 놓쳤다! 너무 한 번에 많은 코드가 나올 것이다. 이 시점에서는 이해하기 어렵지 않을테지만, 그렇지 않다면 GitHub issue를 열거나 mwhager87(gmail)로 이메일을 보내자.

 



##데이터 백엔드

우리는 비즈니스와 트랜잭션, 둘 다 필요하다는 것을 알고 있다. 각각 생성, 업데이트, 삭제 및 로드해야 한다. 우리는 최소 규모의 서비스를 만들고 있기 때문에 지금은 비즈니스를 업데이트 하는 건 생략 할 것이다. (이것은 나중에 좋은 숙제 프로젝트가 될 것이다.) 항상 그렇듯이 우리는 뮤테이션으로 시작해서 액션으로 나아갈 것이다. 마지막으로 API 액션으로 넘어갈 것이다. 그 시점까지코딩하는 모든 것은 이전 모듈과 매우 비슷하다.

 

이 시점까지 우리는 입력을 `currency`로 다루는 건 잘 못하고 있었다. 실제로 살면서 돈을 처리하는 건 매우 복잡한 일이다. 그러나 우리의 애플리케이션은 모든 달러 입력을 `floats`로 바꾸는 단순한 경로를 취할 것이다. 그렇다, 이것은 나쁜 습관이고 프로덕션에 사용되어서는 안 된다! 이상한 반올림 오류가 있을 것이다. 하지만 우리의 목표는 JavaScript로 돈을 다루는 것에 대해 가르치는 게 아니니 지금은 괜찮다.

 

예산 모듈을 구축하면서 배운 건 선택 드롭다운을 채우기 위해선 비즈니스 게터가 필요하고 ID로 비즈니스를 불러오는 방법도 필요하다는 것이다. 경험과 계획을 짜는 것에는 장점이 있다.

 

src/app/transactions/vuex/mutations.js

```
import Vue from 'Vue';

const forceFloats = (o) => {
  o.amount = parseFloat(o.amount);
};

export default {
  CREATE_TRANSACTION (state, payload) {
    forceFloats(payload.transaction);
    Vue.set(state.transactions, payload.transaction.id, payload.transaction);
  },

  UPDATE_TRANSACTION (state, payload) {
    forceFloats(payload.transaction);
    state.transactions[payload.transaction.id] = payload.transaction;
  },

  DELETE_TRANSACTION (state, payload) {
    Vue.delete(state.transactions, payload.transaction.id);
  },

  LOAD_TRANSACTIONS (state, payload) {
    state.transactions = payload;

    Object.values(state.transactions).forEach((o) => { forceFloats(o); });
  },

  LOAD_BUSINESSES (state, payload) {
    state.businesses = payload;
  },

  CREATE_BUSINESS (state, payload) {
    state.businesses[payload.business.id] = payload.business;
  },

  DELETE_BUSINESS (state, payload) {
    Vue.delete(state.businesses, payload.business.id);
  }
};

```



src/app/transactions/vuex/actions.js

```
import { guid } from '../../../utils';
import { deleteTransaction as deleteTransactionFromAPI, deleteBusiness as deleteBusinessFromAPI, fetchBusinesses, fetchTransactions, saveBusiness, saveTransaction } from '../api';

const prepareTransaction = (getters, data) => {
  // code shared by createTransaction and updateTransaction

  // find the budget based on the date
  // we'll go ahead and do this for existing transactions in case the user changes the date
  // in the future we may want to only do it on a date change
  let budget = getters.getBudgetByDate(data.date);
  if (!budget) throw new Error('Could not find a budget for the date ' + data.date);
  data.budget = budget.id;

  // tell the budget category that the transaction is occurring so it can update its amount
  let budgetCategory = getters.getBudgetCategoryByBudgetAndCategory(budget.id, data.category);
  if (!budgetCategory) throw new Error('Could not find a budget category for ' + data.category);
  // don't dispatch yet, we are just preparing data here

  return { preparedData: data, budgetCategory: budgetCategory, budget: budget };
};

export const createTransaction = ({ commit, dispatch, getters }, data) => {
  let { preparedData, budgetCategory, budget } = prepareTransaction(getters, data);

  let id = guid();
  let transaction = Object.assign({ id: id }, preparedData);

  // update the budget category, which updates the budget spend total
  dispatch('updateBudgetCategorySpent', {
    budgetCategory: budgetCategory,
    budget: budget,
    amount: transaction.amount
  });

  // update the account balance
  dispatch('updateAccountBalance', {
    account: getters.getAccountById(data.account),
    amount: transaction.amount
  });

  commit('CREATE_TRANSACTION', { transaction: transaction });
  saveTransaction(transaction);
};

export const updateTransaction = ({ commit, getters }, data) => {
  // TODO: handle any change the user could make here! Including
  // updating budgets or account balances

  let { preparedData } = prepareTransaction(getters, data);

  commit('UPDATE_TRANSACTION', { transaction: preparedData });
  saveTransaction(preparedData);
};

export const deleteTransaction = ({ commit }, data) => {
  commit('DELETE_TRANSACTION', { transaction: data });
  deleteTransactionFromAPI(data);
};

export const loadTransactions = ({ state, commit }) => {
  // loads transactions if they're not already loaded
  if (!state.transactions || Object.keys(state.transactions).length === 0) {
    return fetchTransactions().then((res) => {
      commit('LOAD_TRANSACTIONS', res);
    });
  }
};

export const createBusiness = ({ commit, state }, data) => {
  let id = guid();
  let business = Object.assign({ id: id }, data);
  commit('CREATE_BUSINESS', { business: business });
  saveBusiness(business);

  return business;
};

export const loadBusinesses = ({ state, commit }) => {
  // loads businesses if they're not already loaded
  if (!state.businesses || Object.keys(state.businesses).length === 0) {
    return fetchBusinesses().then((res) => {
      commit('LOAD_BUSINESSES', res);
    });
  }
};

export const deleteBusiness = ({ commit }, data) => {
  commit('DELETE_BUSINESS', { business: data });
  deleteBusinessFromAPI(data);
};```

```



src/app/transactions/vuex/getters.js

```
​````javascript export default { getBusinessSelectList: (state, getters) => { return state.businesses &&Object.keys(state.businesses).length > 0 ?Object.values(state.businesses) : []; },getBusinessById: (state, getters) => (businessId) => { return state.businesses && businessId instate.businesses ? state.businesses[businessId] : false; } };
```



src/app/transactions/api.js

```
import localforage from 'localforage';
import { processAPIData } from '../../utils';

const TRANSACTION_NAMESPACE = 'TRANSACTION-';
const BUSINESS_NAMESPACE = 'BUSINESS-';

export const fetchTransactions = () => {
  return localforage.startsWith(TRANSACTION_NAMESPACE).then((res) => {
    return processAPIData(res);
  });
};

export const saveTransaction = (transaction) => {
  return localforage.setItem(
    TRANSACTION_NAMESPACE + transaction.id,
    transaction
  ).then((value) => {
    return value;
  }).catch((err) => {
    console.log('he\'s dead, jim, the transaction is dead', err);
  });
};

export const deleteTransaction = (transaction) => {
  return localforage.removeItem(
    TRANSACTION_NAMESPACE + transaction.id
  ).then(() => {
    return true;
  }).catch((err) => {
    console.log(err);
    return false;
  });
};

export const fetchBusinesses = () => {
  return localforage.startsWith(BUSINESS_NAMESPACE).then((res) => {
    return processAPIData(res);
  });
};

export const saveBusiness = (business) => {
  return localforage.setItem(
    BUSINESS_NAMESPACE + business.id,
    business
  ).then((value) => {
    return value;
  });
};

export const deleteBusiness = (business) => {
  return localforage.removeItem(
    BUSINESS_NAMESPACE + business.id
  ).then(() => {
    return true;
  }).catch((err) => {
    console.log(err);
    return false;
  });
};

```



src/app/transactions/vuex/index.js

```
// tie together all the pieces we just coded
import * as actions from './actions';
import mutations from './mutations';
import getters from './getters';

const state = {
  transactions: [],
  businesses: []
};

export default {
  state,
  actions,
  mutations,
  getters
};

```



많은 일들이 벌어지고 있는 큰 업데이트이다. 특히 트랜잭션 액션 파일에서는 더 그렇다. 모든 조각들을 다 읽어보고 무슨 일이 일어나고 있는지 확실히 해두자.

 

`prepareTransaction`기능은 `createTransaction`과 `updateTransaction`이 공유한다. `vuex` 저장소에 저장하기 위해 프론트엔드에서 보낸 데이터를  준비하는 것이다. 먼저 사용자가 선택한 날짜에 맞춰서 적절한 예산을 찾자. 그리고 그 월의 선택한 `budgetCategory`를 찾는다. 이걸 호출하는 메서드에 다시 보내주는 것이다. `saveTransaction`에서 추가 액션을 몇 개 보낸다는 걸 알아챘을 것이다. 하지만 우린 아직 `updateTransaction`에서 사용자가 수행할 수 있는 편집을 모두 고려하지 않았다. 모든 걸 최신으로 유지하기 위해서는 언젠가는 이 코드도 다 써야 할 것이다.

