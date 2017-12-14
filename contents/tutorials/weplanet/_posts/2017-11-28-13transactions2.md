---
layout : tutorials
category : tutorials
title : VueJS 가이드 13 - Transaction (2/4)
subcategory : setlayout
summary : VueJS를 통한 애플리케이션 개발에 대해 알아봅니다.
permalink : /tutorials/weplanet/13transactions2
author : danielcho
tags : vue javascript
title\_background\_color : F1F71A
---



> 본 포스팅은 [Matthias Hager](https://matthiashager.com) 의 [Vue.js Application Tutorial - Step 13 - All Aboard the Transaction Train](https://matthiashager.com/complete-vuejs-application-tutorial/transactions)를 저자의 허락하에 번역한 글입니다. 오탈자, 오역 등이 있다면 연락부탁드립니다.

 



##목록 보기 (List View)

우리의 목록 보기는 (지금은...) 매우 간단할 것이다. 이것이 애플리케이션의 핵심 부분이며 사용자가 매일 돌아갈 부분인 걸 잊지 말자. 언젠가는 다루기 힘들어질 것이며 결국에는 사용자가 트랜잭션을 필터링하고 정렬할 수 있게 해야 할 것이다. 특히 트랜잭션 숫자가 어느 정도 되면 성능 문제가 생길 수도 있다. 수천 개의 트랜잭션을 로드하고 표시하는 것 정도는 Vue가 처리 할 수 있을테지만 3년 전 트랜잭션이 로드될 때까지 사용자를 기다리게 할 필요가 있을까? 연구에 따르면 사람들은 밀리 초 범위의 로딩 시간에도 매우 민감하다고 하니 이건 잘 고려해야 한다.하지만 이건 너무 미래를 바라보는 것이다. 최소 규모로 만들자!



지금 당장은 그냥 트랜잭션 목록을 보여 주기만 하면 된다. 이것들은 사용자가 인라인으로 편집할 것이기 때문에 목록의 각 트랜잭션에 컴포넌트를 사용하고 사용자가 편집하려고 클릭하면 동적으로 `CreateUpdate` 컴포넌트로 바꿀 것이다.



```
// src/app/transactions/components/TransactionsList.vue

<template>
  <div id="transactions-list">
    <nav class="level">
      <div class="level-left">
        <h1 class="title is-2">Transactions</h1>
      </div>
    </nav>

    <table class="table is-bordered">
      <thead>
        <tr>
          <th>Date</th>
          <th>Business</th>
          <th>Category</th>
          <th>Account</th>
          <th>Note</th>
          <th>Debit</th>
          <th>Credit</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <template
          v-for="transaction, key in sortedTransactions"
          :class="{ 'is-delinquent': false }"
        >
          <component
            :is="transactionComponent(transaction)"
            v-model="transaction"
            v-on:updated-transaction="activeTransaction = null"
            v-on:edit-transaction="activeTransaction = transaction"
          ></component>
        </template>
        <CreateUpdateTransaction></CreateUpdateTransaction>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

import CreateUpdateTransaction from './CreateUpdateTransaction';
import Transaction from './Transaction';
import { sortObjects } from '../../../utils';

export default {
  name: 'transactions-list',

  components: {
    Transaction,
    CreateUpdateTransaction
  },

  data () {
    return {
      activeTransaction: null
    };
  },

  mounted () {
    this.loadTransactions();
  },

  methods: {
    ...mapActions([
      'createTransaction',
      'updateTransaction',
      'loadTransactions'
    ]),

    transactionComponent (transaction) {
      if (this.activeTransaction && this.activeTransaction === transaction) {
        return 'CreateUpdateTransaction';
      }
      return 'Transaction';
    }
  },

  computed: {
    ...mapState({
      'transactions': state => state.transactions.transactions
    }),

    sortedTransactions () {
      return sortObjects(this.transactions, 'date', true); // sort in date order, oldest to newest
    }
  }
};
</script>

<style scoped lang='scss'>

# transactions-list {

}
</style>
```

 

트랜잭션을 날짜 역순으로 정렬해서 새로운 트랜잭션이 맨 위에 나오게 했는가? 필자도 처음에는 그랬다. 사람들은 아이템을 목록 또는 스프레드시트의 맨 아래에 추가하는 데 익숙하므로 날짜 순서를 오름차순으로 놓는 게 더 말이 된다. 결국에는 제일 최신 트랜잭션과 트랜잭션 행 추가하기가 디폴트로 보이게 자동으로 트랜잭션 페이지 맨 밑으로 스크롤 하는걸 원할 것이다. 이건 필자의 노트에 써야겠다!

 

다이나믹 트랜잭션 컴포넌트에서는 두 가지 이벤트를 듣는다. `edit-transaction`은 우리가 무언가를 편집하고 싶다는 것을보여주기 위해 Transaction에서 보내질 것이다. 편집이 끝나면 `CreateUpdateTransaction`은 `updated-transaction` 이벤트를 보내서 보기 모드로 다시 전환할 수 있다.

 

> 잠시만! 예산에서는 저장/업데이트 신호를 목록 보기로 보내 거기서 저장하지 않았나? 왜 트랜잭션에서는 그렇게 안하는 거지? 좋은 질문이다! 두 모듈의 데이터 모델을 보고 해답을 찾을 수 있는지 보자. 각budgetCategory는 budget 객체의 하위 항목이었다. 사용자는 카테고리를 주로 월 단위로 볼 것이니 이 모델이 가장 적합하다고 판단했었다. 이것때문에 전체 budget을 한 번에 저장해야 했다. transaction은 자식이 아닌 독립적인 객체이므로 저장할 모가 없으며 객체 자체가 알아서 할 것이다.


