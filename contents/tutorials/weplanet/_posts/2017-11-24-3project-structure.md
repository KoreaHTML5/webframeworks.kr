---
layout : tutorials
category : tutorials
title : VueJS 가이드 3 - 설정 및 프로젝트 구조
subcategory : setlayout
summary : VueJS를 통한 애플리케이션 개발에 대해 알아봅니다.
permalink : /tutorials/weplanet/3project-structure
author : danielcho
tags : vue javascript
title\_background\_color : F1F71A
---



> 본 포스팅은 [Matthias Hager](https://matthiashager.com) 의 [Vue.js Application Tutorial - Step 3: Setup & Project Structure](https://matthiashager.com/complete-vuejs-application-tutorial/project-structure)를 저자의 허락하에 번역한 글입니다. 오탈자, 오역 등이 있다면 연락부탁드립니다.



이 튜토리얼을 위해, 나는 당신이 적어도 모던 프론트엔드 웹 개발과 Vue.js에 조금은 익숙하다고 가정 할 것이다. 그렇지 않은 경우 Vue.js 소개 튜터리얼을 보는 것을 추천한다. 훌륭한 튜토리얼이고 Vue가 무엇인지에 대한 좋은 개요를 제공한다. 물론 좀 어렵겠지만,   `NPM`, `Webpack` 및 `ES6`이 완전히 익숙하지 않은 경우에도 튜토리얼을 다 볼 수 있을 것이다.

vue-cli를 설치하고 기본 Webpack 프로젝트 템플릿을 설정하여 시작한다. 템플릿은 몇 가지 설정 프롬프트를 보여줄 것이다. 독립 실행형 빌드를 사용하고, vue-router를 설치한다. `ESLint`를 사용하고 테스트 컴포넌트를 설치할 수 있다. 이 튜토리얼의 범위를 벗어나므로 이 부분에 대해서는 자세하게 설명하지 않겠지만, 모든 애플리케이션 개발 시 테스트 코드를 만드는 것이 좋다.

(필자는 프로젝트의 이름을 Budgeterbium이라고 이름을 지었는데, 이는 대부분의 프로젝트를 요소, 공간 또는 충분히 괴상한 것들로 이름 짓기 때문이다. 이름은 자기 원하는 대로 지으면 된다.)



```
$ npm install --global vue-cli
$ vue init webpack budgeterbium
$ cd budgeterbium
$ npm install
```



![](https://matthiashager.com/user/pages/complete-vuejs-application-tutorial/project-structure/budgeterbium-vue-cli.PNG)



GIT : [331fe8b](https://github.com/matthiaswh/budgeterbium/commit/331fe8bf88dba3cbb314eee364f88079aeaee039)



이 애플리케이션은 데이터를 관리하고 컴포넌트에 정보를 공유해야 한다. 이를 위해 우리는 훌륭한 `vuex`를 사용할 것이다. 로컬 스토리지를 사용할 것이므로 일관되고 깨끗한 API를 제공하기 위해 `localforage` 에 의존할 것이다. `Bulma`를 사용하여 약간의 스타일을 추가하고 SCSS에 의존할 것이다. 이 명령이 필요한 디펜던시를 설치하고 이것을 `package.json`에 저장할 것이다.

 

```
$ npm install --save vuex bulma localforage
$ npm install --save-dev sass-loader node-sass
```



이제 `npm run dev`을 실행하여 테스트 서버를 시작하고 브라우저를 `localhost:8080`에 열 수 있다. 또한 작동중인 서버를 얻으려면 `npm install --save-dev babel-runtime`을 실행해야 할 수도 있다. 

(`npm run dev`로 정확히 어떤 일이 일어나는지 확실하지 않으면 필자의 [overview of Vue.js testing](https://matthiashager.com/blog/testing-vuejs-overview)의 개요에서 처음 몇 문단을 확인하자.) 

다음은 이 템플릿의 기본 프로젝트 구조를 보여준다.

 

```
build/
config/
src/
    assets/
        logo.png
    components/
        Hello.vue
    App.vue
    main.js
static/
test/
.babelrc
.editorconfig
.eslingignore
.eslintrc.js
.gitignore
README.md
index.html
package.json
```



이 애플리케이션의 진입점은 `main.js`이다. Vue를 로드한 다음 `App.vue`를 로드하고 애플리케이션을 초기화한다. 지금 `App.vue`가 하는 것은 레이아웃을 정의하고 `Hello.vue` 컴포넌트를 포함하는 게 다이다. 그 결과로 Vue 로고와 몇 개의 링크를 보여준다.

`.vue` 파일은 HTML 템플릿, 일반적으로 단일 Vue 컴포넌트를 정의하는 JavaScript, 그리고 특정 컴포넌트에 적용되는 스타일의 조합이다. 파일은 애플리케이션 템플릿과 함께 설치된 `vue-loader`로 사전 처리된다. 대부분의 프로그래밍 편집기와 IDE에는 이 파일을 처리하기 위해 설치할 수 있는 Vue.js highlighting 플러그인이 있다. 

첫 번째 단계는 아키텍처를 모듈식 시스템으로 바꾸는 것이다. 튜토리얼 목적으로 이것은 과하다고 생각할 수도 있지만, 진지하고 확장가능한 애플리케이션을 구축하는 것이 무엇인지 생각해보면 답은 명확하다. 템플릿이 제공하는 플랫 파일 형식은 몇 개의 컴포넌트가 있으면 다루기 힘들어진다. 우리는 이보다 모듈 방식으로 접근할 것이다. 우리의 `src` 폴더는 다음과 같이 보일 것이다:

 

```
app/
    accounts/
        components/
            AccountsListView.vue
        vuex/
            accounts.js
            index.js
            mutations.js
        index.js
        routes.js
    App.vue
    index.js
    routes.js
    vuex.js
assets/
router/index.js
store/index.js
main.js
```



이 레이아웃은 대형 애플리케이션을 구성하는 [Vue.js 포럼의 이 대답](https://forum.vuejs.org/t/structuring-very-large-applications/840/3) 에서 영감을 얻었다.

Budgeterbium은 `vue-router`와 `vuex`를 사용할 것이기 때문에 이를 준비한다. `main.js`에서 그것들을 가져와서 Vue가 사용하도록 한다. 라우터 객체를 정의하고 우리가 구축중인 다양한 모듈을 관리하는 데 도움이 되는 export / import 체인을 설정할 수 있다. 앱에 루트 컴포넌트를 넣는다. 이 시점부터 사용자가 어떤 루트로 갈 때마다 템플릿의 해당 위치로 로드된다.

```javascript
 // The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import { App } from './app';
import router from './router';
import store from './store';

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
});
```



우리의 애플리케이션에서 일부 ES6 규칙을 사용하고 있음에 주목하자. 모든 신택스에 익숙하지 않은 경우에는 [이 구문](http://es6-features.org/)을 읽어보는 것도 좋을 것이다.

우리의 임포트 체인은 상당히 복잡해 보인다. 모든 것이 index.js 파일을 통해 위쪽으로 공급된다는 것으로 생각하자.

실제 코드를 작성하기도 전에 `boiler plate`를 많이 썼다! 현재까지 읽기만 하고 디스크에 아무것도 쓰지 않았다면 지금 시작하기 좋은 때이다. 이전 단계에서 한 모든 것을 이해하는 것이 중요하긴 하지만 repo에서 이 시점부터 복제하여 바로 시작할 수도 있다.

 

GIT : [9dec94f](https://github.com/matthiaswh/budgeterbium/commit/9dec94f428cf234f6492fcc2ecd9781b4f6c213f)



이제 기존 계정 / 디렉토리를 복제하고 트랜잭션 및 예산을 위한 place holder를 설정할 것이다. 이것은 새로운 모듈을 추가하는 가장 간단한 방법을 보여줄 것이다. 모듈을 복제하고 이름을 변경한 후에 `app/routes.js` 및 `app/vuex.js`를 새 모듈로 업데이트하고 각 모듈의 목록보기 루트를 변경하는 것을 잊지 말자.

 

모든 것이 준비되었다면, `http://localhost:8080/budget` 및 `http://localhost:8080/transactions`를 들어가볼 수 있다. Vue.js Chrome 확장 프로그램을 사용하는 경우 스토어에서도 Chrome 확장 프로그램이 있는 것을 확인해볼 수 있다.



![](https://matthiashager.com/user/pages/complete-vuejs-application-tutorial/project-structure/vuejs-empty-budgets.PNG)

 ![](https://matthiashager.com/user/pages/complete-vuejs-application-tutorial/project-structure/vuejs-empty-store.PNG)



GIT : [bb85b37](https://github.com/matthiaswh/budgeterbium/commit/bb85b373de334c3014070ad5e17cf893199ae636)





