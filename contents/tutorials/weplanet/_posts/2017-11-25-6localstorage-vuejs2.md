---
layout : tutorials
category : tutorials
title : VueJS 가이드 6 - Vue.js 애플리케이션에 LocalStorage 추가하기 (2/3)
subcategory : setlayout
summary : VueJS를 통한 애플리케이션 개발에 대해 알아봅니다.
permalink : /tutorials/weplanet/6localstorage-vuejs2
author : danielcho
tags : vue javascript
title\_background\_color : F1F71A
---



> 본 포스팅은 [Matthias Hager](https://matthiashager.com) 의 [Vue.js Application Tutorial - Step 6: Adding LocalStorage to our Vue.js Application](https://matthiashager.com/complete-vuejs-application-tutorial/localstorage-vuejs)를 저자의 허락하에 번역한 글입니다. 오탈자, 오역 등이 있다면 연락부탁드립니다.



하지만 아직 ID 문제가 남았다. 이전에 `mutator`에서 ID를 생성하도록 선택했었다. 항상 `commit`을 통해 프록싱하여 뮤테이터를 직접 호출하지 않는다. 불행히도 `commit`은 아무것도 반환하지 않으므로 방금 만든 계정을 직접 가져올 수 있는 방법이 없다. 그래서 액션에서 ID를 생성해야 한다는 것이다. 어차피 ID를 생성하는 것은 아마도 `mutator`의 목적 범위 밖일 것이다.



src/app/accounts/vuex/mutations.js

```
import Vue from 'vue';

export default {
  ADD_ACCOUNT (state, payload) {
    state.accounts[payload.account.id] = payload.account;
  },

  UPDATE_ACCOUNT (state, payload) {
    state.accounts[payload.account.id] = payload.account;
  },

  DELETE_ACCOUNT (state, payload) {
    Vue.delete(state.accounts, payload.account.id);
  }
};
```



src/app/accounts/vuex/actions.js

```
import localforage from 'localforage';

import { guid } from '../../../utils';

const ACCOUNT_NAMESPACE = 'ACCOUNT-';

const saveAccount = (account) => {
  return localforage.setItem(
    ACCOUNT_NAMESPACE + account.id,
    account
  ).then((value) => {
    return value;
  }).catch((err) => {
    console.log('oops! the account was too far gone, there was nothing we could do to save him ', err);
  });
};

export const addAccount = ({ commit }, data) => {
  let id = guid();
  let account = Object.assign({ id: id }, data);
  commit('ADD_ACCOUNT', {account: account});
  saveAccount(account).then((value) => {
    // we've saved the account, what now
  });
};

...
```



괜찮다. 우리는 액션 기능에서 새 계정 ID를 생성하고 `Vuex` 스토어에 커밋하고 `localForage`를 통해 만든 계정을 저장하는 것이다. 우리는 프로덕션 코드에서 매우 중요한 두 가지인 실제 오류 처리 또는 데이터 검증을 수행하는 게 아니다. 지금 입력란을 채우지 말고 새 계정을 추가해보자. 노트가 있다면 이 내용을 처리해야할 항목으로 메모해놓자.

 

`ADD_ACCOUNT`와 `UPDATE_ACCOUNT`가 이제 동일하다는 점은 주목할 가치가 있다. 아마도 코드를 드라이하게 만들고 싶을 것이다. 나는 의미론적 목적을 위해 이 둘을 분리시켰고, 나중에 각각의 다른 `mutator`마다 서로 다른 기능을 수행해야 할 수도 있다. 나중에 리팩토링해서 업데이트해야 할 곳과 추가해야 할 위치를 파악 하는 것보다 지금 분리하는 것이 더 쉽다.

 

이제 계정을 만들고 데이터베이스에서 볼 수 있다.

 

![](https://matthiashager.com/user/pages/complete-vuejs-application-tutorial/localstorage-vuejs/budgeterbium-vuejs-localstorage.gif)





물론 로드를 한게 아니기 때문에 페이지를 새로고침할 때 로드한 계정이 표시되지 않는다. 이 작업을 시작하기 전에 데이터베이스에서 개체를 업데이트하고, 삭제하는 핸들러를 만들어 보자. 또한 필자는 `actions.js` 파일에서 `localstorage` 코드를 보는 것을 좋아하지 않는다. 이 파일은 거기에 속하지 않기 때문이다. 우리는 `api.js` 파일을 만들고 이 파일로 기능을 옮길 것이다.



src/app/accounts/vuex/actions.js

```
import { guid } from '../../../utils';
import { removeAccount, saveAccount } from '../api';

export const addAccount = ({ commit }, data) => {
  let id = guid();
  let account = Object.assign({ id: id }, data);
  commit('ADD_ACCOUNT', {account: account});
  saveAccount(account).then((value) => {
    // we've saved the account, what now
  });
};

export const updateAccount = ({ commit }, data) => {
  commit('UPDATE_ACCOUNT', {account: data});
  saveAccount(data);
};

export const deleteAccount = ({ commit }, data) => {
  commit('DELETE_ACCOUNT', { account: data });
  removeAccount(data);
};
```



src/app/accounts/api.js

```
import localforage from 'localforage';

const ACCOUNT_NAMESPACE = 'ACCOUNT-';

export const saveAccount = (account) => {
  return localforage.setItem(
    ACCOUNT_NAMESPACE + account.id,
    account
  ).then((value) => {
    return value;
  }).catch((err) => {
    console.log('oops! the account was too far gone, there was nothing we could do to save him ', err);
  });
};

export const removeAccount = (account) => {
  return localforage.removeItem(
    ACCOUNT_NAMESPACE + account.id
  ).then(() => {
    return true;
  }).catch((err) => {
    console.log(err);
    return false;
  });
};
```

 

이 설정의 가장 좋은 점은 나중에 API를 변경할 수 있다는 점이다. `IndexedDB` 대신 서버 백엔드로 변경하려고 할 수도 있는데, 이러면 변경해야하는 코드는 `api.js` 뿐이다. `removeAccount` 및  `saveAccount` 기능이 같은 방식으로 작동하는한 애플리케이션의 나머지 부분은 데이터가 유지되는 방식에 대해 신경쓰지 않는다.

 

마지막 단계는 애플리케이션이 로드될 때 저장된 계정을 로드하는 것이다. 더 정확하게는 필요할 때 로드하는 것이다. 지금은 두 가지 시나리오에서 데이터를 액세스해야 한다. 사용자가 계정 페이지를 볼 때는 전체 계정 목록이 필요하고 개체를 편집 할 때는 단일 계정이 필요하다.

 

`Vuex` 게터에 연결하여 요구에 따라 데이터를 로드할 수 있다면 참 좋을 것이다. 불행히도 게터는 전체 저장소에 액세스 할 수 없다. 상태값은 받지만, 액션을 취할 수는 없는 것이다.

 

따라서 데이터가 로드되지 않은 경우 `Vue.js` 컴포넌트 라이프 사이클에 연결하여 로드한다. 계정 로드를 위한 `mutator`및 액션 그리고 데이터베이스에서 데이터를 호출하는 API 기능을 추가하자.

 

이 코드를 모두 쓰기 전에 `IndexedDB`에서 객체를 로드하는데 도움이 되는 작은 도구를 하나 더 추가 하자. `localForage-startsWith` 를 사용하면 우리가 제공한 스트링으로 시작하는 모든 키를 쉽게 로드 할 수 있다. 우리의 경우 `ACCOUNT_NAMESPACE`이다.

 

`npminstall --save localforage-startswith`

```
 // /src/main.js
import Vue from 'vue';
import localforage from 'localforage';
require('localforage-startswith');

...
```



