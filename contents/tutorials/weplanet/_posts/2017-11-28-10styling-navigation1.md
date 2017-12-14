---
layout : tutorials
category : tutorials
title : VueJS 가이드 10 - 스타일링과 네비게이션 (1/2)
subcategory : setlayout
summary : VueJS를 통한 애플리케이션 개발에 대해 알아봅니다.
permalink : /tutorials/weplanet/10styling-navigation1
author : danielcho
tags : vue javascript
title\_background\_color : F1F71A
---



> 본 포스팅은 [Matthias Hager](https://matthiashager.com) 의 [Vue.js Application Tutorial - Step 10: Styling & Navigation](https://matthiashager.com/complete-vuejs-application-tutorial/styling-navigation)를 저자의 허락하에 번역한 글입니다. 오탈자, 오역 등이 있다면 연락부탁드립니다.



이 애플리케이션에 화장을 좀 해주자. 이 업데이트의 대부분은 CSS 스타일링이다. 이 파트는 Vue 튜토리얼의 범위 밖의 내용이니, 세부사항으로 지루하게 만들지 않고 간단하게 처리하자. 차이점은 대충 훑어봐도 무방하지만, 몇 개의 HTML 요소들을 옮기고 바꾸기 때문에 잘 살피지 않으면 뭐가 에러가 날 수도 있다. 

 

GIT : [13a1e37](https://github.com/matthiaswh/budgeterbium/commit/13a1e375cef2ff6eae9fa21660c41ccbe99e3101)

 

마지막으로 하나 더. 네비게이션에 대한 스타일이 필요하긴 하다. 주요 네비게이션을 자체 Vue.js 컴포넌트로 만들 것이고, 이는 static content로 처리할 것이다. 이미 우린 컴포넌트 생성 방법을 알고 있기 때문에, 논의할 내용은 많지 않다.

 

GIT : [bbffd79](https://github.com/matthiaswh/budgeterbium/commit/bbffd79912ac159ac97a92b099368b7e5591ec88)

 

필자의 첫 직감으로는 static 접근 방식이 충분하지 않다는 것이다. 네비게이션 컴포넌트는 애플리케이션에 추가되는 모든 View의 존재에 대해 알아야한다. 그리고 View를 추가할 때 새로운 링크를 추가하기 위해 네비게이션으로 돌아와야 한다. 또한 사용자의 계정을 각각의 잔액과 함께 메인 네비게이션 바에 표시하고 싶을 수도 있다. 네비게이션을 계정 모듈과 밀접하게 연결시키는 (공유된) `Vuex` state에서 정보를 로드할 수 있다. 계정이 저장되는 방법을 변경하면 네비게이션을 변경해야하는 것도 기억해야 한다. 그리고 컴포넌트는 가능하면 분리되어 있어야 한다. 코드의 다른 부분을 업데이트하지 않고도 계정을 변경할 수 있어야하는 것이다.

 

필자는 계정 모듈이 스스로 등록할 수 있는 네비게이션 객체가 있는 게 낫다고 생각한다. 그런 다음 계정은 네비게이션 객체에게 계정 목록을 잔액과 함께 보여주고 싶다는 것을 전달하고, 정보를 최신 상태로 유지해야 한다고 전달할 것이다. 이건 `vue-router`가 작동하는 방식과 비슷하게 들린다. 우리는 이것을 네비게이션을 위한 글로벌 객체와 함께 독립적이고 재사용할 수 있는 플러그인으로 만들 수 있다. 이것을 사용하는 개발자는 CSS을 네비게이션 바로 간단히 오버라이드하고 유연성이 더 필요하면 자체HTML을 만들면 될 것이다.

 

간단하고 멋진 프로젝트처럼 들린다. 그러나 개발자의 책임 중 일부는 어떤 일이 작업 범위를 벗어나는지 식별하는 것이며, 단기적으로 작동하는 간단하고 빠른 경로를 택할지, 아니면 시간은 좀 더 걸리지만 장기적인 이점을 갖는 보다 유연한 옵션을 택할지 결정하는 것이다. 당신이 단독 개발자이고 참견할 사람이 없는 경우는 특히 더 그렇다. 우리는 여기서 최소한의 사용가능한 애플리케이션을 만드려고 한다. 더 복잡한 네비게이션 컴포넌트는 장기 비전 보드에 올라가 있을수도 있지만, 현재로서는 우리가 처리 할 수 있는 것보다 더 많이 올리는 것뿐이다.

 

그렇다고 이 책임감을 핑계로 대충 코드를 쓰면 안 된다!

 

지금은 그냥 간단하게 계정을 루프하여 각 계정의 잔액을 표시하자. 탐색에 계정 정보가 필요할 테니 컴포넌트가 마운트될 때 로드하자. (이건 우리가 피하고 싶었던 가까운 커플링의 한 예이기도 하다.)

 

```
// /src/app/navigation/components/Navigation.vue
<template>
  <div id="navigation-view">
    <ul>
      <li>
        <router-link :to="{ name: 'accountsList' }">Accounts</router-link>
        <ul>
          <li
            v-for="account in accounts"
          >
            <router-link :to="{ name: 'updateAccount', params: { accountId: account.id } }">
              {{ account.name }} <span>${{ account.balance }}</span>
            </router-link>
          </li>
        </ul>
      </li>
      <li><router-link :to="{ name: 'budgetsList' }">Budgets</router-link></li>
    </ul>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'navigation',

  mounted () {
    this.loadAccounts();
  },

  methods: {
    ...mapActions(['loadAccounts'])
  },

  computed: {
    ...mapState({
      accounts: state => state.accounts.accounts
    })
  }
};
</script>

<style scoped lang='scss'>
  ul {
    margin-top: 50px;

    li {
      border-bottom: 2px solid rgb(31, 78, 93);
      font-size: 1.8em;
      padding-left: 20px;
      margin: 18px 20px;

      a {
        color: #ffffff;
      }

      ul {
        margin-top: 20px;

        li {
          font-size: 0.6em;
          border: none;

          span {
            float: right;
          }
        }
      }
    }
  }
</style>
```



![](https://matthiashager.com/user/pages/complete-vuejs-application-tutorial/styling-navigation/budgeterbium-navigation.PNG)



불행히도 이건 `CreateUpdateAccount.vue`에 버그를 나타내고 있다. 계정을 수정하는 사이를 직접 살펴보면 URL은 변경되지만, 선택한 계정은 처음으로 수정한 계정에 멈춰 있는 걸 볼 수 알수 있다.