---
layout : tutorials
title : 리덕스 미들웨어, 그리고 비동기 작업 (외부데이터 연동)
category : tutorials
subcategory : setlayout
summary : 리덕스 미들웨어 사용법과, 이를 사용하여 비동기 액션을 관리하는 방법을 다룹니다.
permalink : /tutorials/react/react-redux-middleware
tags : javascript react redux middleware
author : velopert
---

이번 강의에서 다룰 주제는 리덕스 미들웨어를 사용하여 외부 데이터를 연동하는 방법을 다뤄보겠습니다. 외부 데이터를 연동하기 위해서 리덕스, 그리고 리덕스 미들웨어들이 꼭 필요한것은 아닙니다. 리액트 컴포넌트와 내부 state 만을 사용하여 모든 것 들을 할 수 있어요. 하지만, 좋은 도구들과 함께하면 좋은 개발자경험 (Developer Experience)이 따라옵니다. 어플리케이션을 만듬에 있어서는, UX 도 매우 중요하지만, 이를 개발하는 개발자들의 정신건강을 위하여, 개발자경험 또한 놓칠 수 없습니다. 네트워크 요청의 상태 관리와 전달받은 데이터 상태 관리를 효율적이고 쉽게 할 수 있도록, 몇몇 방법을 배워보도록 하겠습니다.

# 1장. 미들웨어(Middleware) 이해하기

리덕스를 사용 하면서 비동기 작업 (예: 네트워크 요청) 을 다룰 때는 미들웨어가 있어야 더욱 손쉽게 상태를 관리 할 수 있습니다. 우선, 미들웨어가 어떤 역할을 하는지, 그리고 어떻게 작동하는지 이해를 하면서 직접 미들웨어를 만들어보고, 다른 미들웨어들을 설치해서 사용하는 방법을 배워보겠습니다.  

## 1-1\. 미들웨어란?

![](http://redux-middleware.surge.sh/images/redux-middleware.png) 

미들웨어는, 액션이 디스패치(dispatch) 되어서 리듀서에서 이를 처리하기전에 사전에 지정된 작업들을 설정합니다. 미들웨어를 액션과 리듀서 사이의 중간자라고 이해하시면 되겠습니다. 리듀서가 액션을 처리하기전에, 미들웨어가 할 수있는 작업들은 여러가지가 있는데요. 단순히 전달받은 액션을 콘솔에 기록을 할 수도 있고, 전달받은 액션에 기반하여 액션을 아예 취소시켜버리거나, 다른 종류의 액션들을 추가적으로 디스패치 할 수도 있습니다. 우리는 이 미들웨어를 한번 직접 작성을 해볼건데요. 그 작업을 시작하기전에 먼저 git 을 통하여 리덕스 스타터 킷 프로젝트를 클론하고, NPM 모듈들을 설치하세요. (이 프로젝트는 단순히 `create-react-app` 으로 만든 프로젝트에 리덕스를 설정한 프로젝트입니다. 프로젝트를 여러분이 직접 설정해도 됩니다.)

    $ git clone 
    $ https://github.com/vlpt-playground/redux-starter-kit.git
    $ cd redux-starter-kit
    $ yarn

저번 강의에서 배웠던 Ducks 구조가 적용되어있는 간단한 숫자 카운터 코드입니다. 이번에는 `store` 생성 로직을 따로 `store.js` 에서 구현하였습니다. 진행하기 전에, modules/ 내부 파일들과 App.js 코드를 한번 훑어보세요.  

## 1-2\. 미들웨어 만들기

실제 프로젝트를 작업 할 때에는, 미들웨어를 직접 만들어서 사용하는 경우는 그렇게 많지 않습니다. 대부분의 경우엔, 다른 프로그래머들이 이미 만들어놓은 미들웨어들을 사용하면 되기 때문이죠. 하지만, 미들웨어가 어떻게 작동하는지 이해를 하려면 직접 만들어봐야합니다. 한번 간단한 미들웨어를 직접 작성해보고 나면, 미들웨어의 작동방식을 제대로 이해 할 수 있고, 또 만약에 여러분들이 원하는 미들웨어가 없을 땐 상황에 따라 직접 만들어서 사용하거나 기존 미들웨어들을 커스터마이징 할 수도 있겠죠.

## 로거 미들웨어 만들기

우선, **src/lib/** 디렉토리에, **loggerMiddleware.js** 파일을 생성하세요. 미들웨어를 만들 땐, 이렇게 시작합니다.

#### `src/lib/loggerMiddleware.js`

    const loggerMiddleware = store => next => action => {
        /* 미들웨어 내용 */
    }

여기서 `store` 와 `action` 은 익숙하겠지만, `next` 는 익숙하지 않습니다. `next` 는 여기서 `store.dispatch`와 비슷한 역할을 하는데요, 차이점은, `next(action)` 을 했을 때에는 바로 리듀서로 넘기거나, 혹은 미들웨어가 더 있다면 다음 미들웨어 처리가 되도록 진행됩니다. 하지만, `store.dispatch` 의 경우에는 처음부터 다시 액션이 디스패치 되는 것 이기 때문에 현재 미들웨어를 다시한번 처리하게 됩니다. 

![](http://redux-middleware.surge.sh/images/next-vs-dispatch.png) 

그럼 한번, 현재 상태를 한번 기록하고, 방금 전달 받은 액션을 기록하고, 그 다음 리듀서에 의해 액션이 처리된 다음의 스토어 값을 기록해보도록 하겠습니다.

#### `src/lib/loggerMiddleware.js`

    const loggerMiddleware = store => next => action => {
        // 현재 스토어 상태값 기록
        console.log('현재 상태', store.getState());
        // 액션 기록
        console.log('액션', action);

        // 액션을 다음 미들웨어, 혹은 리듀서로 넘김
        const result = next(action);

        // 액션 처리 후의 스토어 상태 기록
        console.log('다음 상태', store.getState());
        console.log('\n'); // 기록 구분을 위한 비어있는 줄 프린트

        return result; // 여기서 반환하는 값은 store.dispatch(ACTION_TYPE) 했을때의 결과로 설정됩니다
    }

    export default loggerMiddleware; // 불러와서 사용 할 수 있도록 내보내줍니다.

## 미들웨어 적용하기

미들웨어는 store 를 생성 할 때에 설정을 하는데요. redux 모듈 안에 들어있는 `applyMiddleware` 를 사용하여 설정 할 수 있습니다.

#### `src/store.js`

    import { createStore, applyMiddleware } from 'redux';
    import modules from './modules';
    import loggerMiddleware from './lib/loggerMiddleware';

    // 미들웨어가 여러개인경우에는 파라미터로 여러개를 전달해주면 됩니다. 예: applyMiddleware(a,b,c)
    // 미들웨어의 순서는 여기서 전달한 파라미터의 순서대로 지정됩니다.
    const store = createStore(modules, applyMiddleware(loggerMiddleware))

    export default store;

![](http://redux-middleware.surge.sh/images/loggerMiddleware-preview.gif) 

어때요? 잘 작동하나요? 미들웨어에서 할 수 있는건 여러가지가 있습니다. 액션의 정보에 따라서 아예 무시를 하게 할 수도 있구요, 액션의 정보를 가로채서 수정 한 다음에 리듀서로 전달시켜 줄 수있습니다. 미들웨어는 특히, 비동기 작업을 할 때 유용합니다. 미들웨어를 직접 만들어보니 어떤 식으로 작동하는지 어느정도는 갈피를 잡을 수 있겠죠? 다음 섹션들에서는 오픈소스로 공유된 미들웨어를 설치해서 사용하는 방법을 알아보겠습니다.  

## 1-3\. redux-logger

이전 섹션에서는 우리가 직접 로깅 미들웨어를 만들어봤는데요. 오픈소스 커뮤니티에는 더 잘 만들어진 로거 미들웨어가 있답니다. 이번엔 한번 그 모듈을 설치한다음에 적용하는 방법을 알아보겠습니다.

> Redux DevTool 을 사용한다면 redux-logger 는 사실 쓸모가 없습니다. Redux Devtool 이 이미 그 기능을 갖추고있고 훨씬 강력하기 때문이죠. 하지만 Redux Devtool 을 사용하지못하는 환경이라면 redux-logger 는 매우 유용한 미들웨어입니다.

### 설치하기

    $ yarn add redux-logger

그리고, store.js 를 열어서 다음과 같이 수정해주세요.

> 우리가 이전에 만들었던 로거 미들웨어는 더 이상 사용할 필요가 없어졌으니 삭제하셔도 됩니다.

### 적용하기

#### `src/store.js`

    import { createStore, applyMiddleware } from 'redux';
    import modules from './modules';

    import { createLogger } from 'redux-logger';

    /* 로그 미들웨어를 생성 할 때 설정을 커스터마이징 할 수 있습니다.
       https://github.com/evgenyrodionov/redux-logger#options
    */
    const logger = createLogger(); 

    const store = createStore(modules, applyMiddleware(logger))

    export default store;

![](http://redux-middleware.surge.sh/images/redux-logger-preview.gif)

 아까 우리가 만든 미들웨어보다 훨씬 더 예쁘게 기록이 됩니다.  

# 2장. 비동기 작업을 처리하기 위한 미들웨어 사용해보기

미들웨어가 어떤 방식으로 작동하는지 이해를 했으니, 오픈소스 커뮤니티에 공개된 미들웨어들을 설치하고 이를 통해 비동기 액션들을 다루는 방법들을 배워보겠습니다. 이 강의에서 다루는 미들웨어는 redux-thunk, redux-promise-middleware, redux-pender 입니다. 이 세 라이브러리는 각각 다른 방식으로 비동기 액션을 처리하는데요, 한번 하나하나 직접 사용해보면서 익혀봅시다.  

## 2-1\. redux-thunk

리덕스를 사용하는 어플리케이션에서 비동기 작업을 처리 할 때 가장 기본적인 방법으로는 `redux-thunk` 라는 미들웨어를 사용하는것입니다. 이 미들웨어는 리덕스를 개발한 Dan Abramov 가 만든 것이며, redux 공식 매뉴얼에서도 이 미들웨어를 사용하여 비동기 작업을 다룹니다. 이를 사용하여 비동기 작업을 관리하는건 매우 직관적이고 간단합니다.

### thunk 란?

**thunk**란, 특정 작업을 나중에 하도록 미루기 위해서 함수형태로 감싼것을 칭합니다. 예를 들어서 여러분들이 1 + 1 을 지금 당장 하고싶다면 이렇게 하겠죠?

    const x = 1 + 2;

이 코드가 실행되면 1 + 2 의 연산이 바로 진행됩니다. 하지만 다음과 같이 하면 어떨까요?

    const foo = () => 1 + 2;

이렇게 하면, 1 + 2 의 연산이 코드가 실행 될 때 바로 이뤄지지 않고 나중에 `foo()` 가 호출 되어야만 이뤄집니다.

### redux-thunk 는 뭘 하는 미들웨어일까?

가장 간단히 설명하자면, 이 미들웨어는 객체 대신 함수를 생성하는 액션 생성함수를 작성 할 수 있게 해줍니다. 리덕스에서는 기본적으로는 액션 객체를 디스패치합니다. 일반 액션 생성자는, 다음과 같이 파라미터를 가지고 액션 객체를 생성하는 작업만합니다:

    const actionCreator = (payload) => ({action: 'ACTION', payload});

만약에 특정 액션이 몇초뒤에 실행되게 하거나, 현재 상태에 따라 아예 액션이 무시되게 하려면, 일반 액션 생성자로는 할 수가 없습니다. 하지만, redux-thunk 는 이를 가능케합니다. 우선 1초뒤 액션이 디스패치되게 하는 예제코드를 살펴보겠습니다:

    const INCREMENT_COUNTER = 'INCREMENT_COUNTER';

    function increment() {
      return {
        type: INCREMENT_COUNTER
      };
    }

    function incrementAsync() {
      return dispatch => { // dispatch 를 파라미터로 가지는 함수를 리턴합니다.
        setTimeout(() => {
          // 1 초뒤 dispatch 합니다
          dispatch(increment());
        }, 1000);
      };
    }

이렇게 한다면 나중에 `store.dispatch(incrementAsync());` 를 하면 `INCREMENT_COUNTER` 액션이 1초뒤에 디스패치됩니다. 이번엔 조건에 따라 액션을 디스패치하거나 무시하는 코드를 살펴봅시다:

    function incrementIfOdd() {
      return (dispatch, getState) => {
        const { counter } = getState();

        if (counter % 2 === 0) {
          return;
        }

        dispatch(increment());
      };
    }

만약에, 리턴하는 함수에서 `dispatch, getState` 를 파라미터로 받게 한다면 스토어의 상태에도 접근 할 수있습니다. 따라서, 현재의 스토어 상태의 값에 따라 액션이 dispatch 될 지 무시될지 정해줄 수 있는것이죠. 간단하게 정리를 하자면 redux-thunk 는 일반 액션 생성자에 **날개**를 달아줍니다. 보통의 액션생성자는 그냥 하나의 액션객체를 생성 할 뿐이지만 `redux-thunk` 를 통해 만든 액션생성자는 그 내부에서 여러가지 작업을 할 수 있습니다. 이 곳에서 네트워크 요청을 해도 무방하죠. 또한, 이 안에서 액션을 여러번 디스패치 할 수도 있습니다.

### 여기서 dispatch, getState 는 어디서 오는건가요?

간단합니다. redux-thunk 미들웨어에서, 전달받은 액션이 함수 형태 일 때, 그 함수에 `dispatch` 와 `getState` 를 넣어서 실행해줍니다. 실제로, redux-thunk 의 코드는 정말로 간단합니다. 한번 코드를 보는게 작동방식을 이해는데에 도움이 될거예요.

    function createThunkMiddleware(extraArgument) {
      return ({ dispatch, getState }) => next => action => {
        if (typeof action === 'function') {
          return action(dispatch, getState, extraArgument);
        }

        return next(action);
      };
    }

    const thunk = createThunkMiddleware();
    thunk.withExtraArgument = createThunkMiddleware;

    export default thunk;

### 설치와 적용

자, 그러면 redux-thunk 를 사용해봅시다. 우선 설치를 해주세요

    $ yarn add redux-thunk

그 다음엔, 스토어를 생성 할 때 미들웨어를 적용하세요

#### `src/store.js`

    import { createStore, applyMiddleware } from 'redux';
    import modules from './modules';

    import { createLogger } from 'redux-logger';
    import ReduxThunk from 'redux-thunk';

    /* 로그 미들웨어를 생성 할 때 설정을 커스터마이징 할 수 있습니다.
       https://github.com/evgenyrodionov/redux-logger#options
    */
    const logger = createLogger(); 

    const store = createStore(modules, applyMiddleware(logger, ReduxThunk))

    export default store;

### 카운터를 비동기적으로 만들어보기

자, 그러면 기존에 작동하던 카운터를 비동기적으로 작동하도록 코드를 추가해보겠습니다. 카운터 모듈을 다음과 같이 수정하세요

#### `src/modules/counter.js`

    import { handleActions, createAction } from 'redux-actions';

    const INCREMENT = 'INCREMENT';
    const DECREMENT = 'DECREMENT';

    export const increment = createAction(INCREMENT);
    export const decrement = createAction(DECREMENT);

    export const incrementAsync = () => dispatch => {
        // 1초 뒤 액션 디스패치
        setTimeout(
            () => { dispatch(increment()) },
            1000
        );
    }

    export const decrementAsync = () => dispatch => {
        // 1초 뒤 액션 디스패치
        setTimeout(
            () => { dispatch(decrement()) },
            1000
        );
    }

    export default handleActions({
        [INCREMENT]: (state, action) => state + 1,
        [DECREMENT]: (state, action) => state - 1
    }, 0);

그 다음에는, App 컴포넌트에서 `increment` -> `incrementAsync`, `decrement` -> `decrementAsync` 로 치환하세요.

    import React, { Component } from 'react';
    import { bindActionCreators } from 'redux';
    import { connect } from 'react-redux';
    import * as counterActions from './modules/counter';

    class App extends Component {
        render() {
            const { CounterActions, number } = this.props;

            return (
                <div>
                    <h1>{number}</h1>
                    <button onClick={CounterActions.incrementAsync}>+</button>
                    <button onClick={CounterActions.decrementAsync}>-</button>
                </div>
            );
        }
    }

    export default connect(
        (state) => ({
            number: state.counter
        }),
        (dispatch) => ({
            CounterActions: bindActionCreators(counterActions, dispatch)
        })
    )(App);

자, 이제 카운터가 어떻게 작동하는지 확인해볼까요?

 ![](http://redux-middleware.surge.sh/images/async-counter.gif) 

다음 섹션에서는 redux-thunk 를 사용하여 웹 요청을 처리하는 방법을 배워보겠습니다.  

## 2-2\. 웹 요청 처리하기

### 비동기작업 처리해보기

redux-thunk 를 사용하여 비동기 작업을 한번 처리해보겠습니다. 우리는 [**axios**](https://github.com/mzabriskie/axios) 라는 라이브러리를 이용햐여 웹 요청을 하겠습니다. axios 는 Promise 기반 HTTP Client 입니다.

#### Promise 가 뭔가요?

`Promise`는 ES6 에서 비동기 처리를 다루기위해 사용되는 객체입니다. 예를들어서, 숫자를 1초뒤에 프린트하는 코드를 작성해보겠습니다. 이 코드를 크롬 개발자 도구에서 실행해보세요. (크롬 개발자 콘솔에서 새 줄을 입력 할땐 SHIFT 키를 누르고 엔터를 누르면 됩니다)

    function printLater(number) {
        setTimeout(
            function() { 
                console.log(number); 
            },
            1000
        );
    }

    printLater(1);

이렇게 `doItLater` 함수 안에 1 을 프린트하는 함수를 전달해서 호출을 하면, 1초뒤에 프린트가 됩니다. 이번엔 1 초에 걸쳐서 숫자를 더해가면서 1, 2, 3, 4를 프린트하는 코드를 작성해보겠습니다.

    function printLater(number, fn) {
        setTimeout(
            function() { console.log(number); fn(); },
            1000
        );
    }

    printLater(1, function() {
        printLater(2, function() {
            printLater(3, function() {
                printLater(4);
            })
        })
    })

비동기적으로 해야 할 작업이 많아진다면, 코드의 구조는 자연스레 깊어질 것이고 그러면 코드를 읽기 힘들어지겠죠? 이를 콜백 지옥이라고도 부릅니다. 기존의 자바스크립트의 이러한 문제에서 구제해주는것이 바로 Promise 입니다. 한번 위 코드를 Promise 로 해결해보겠습니다. 추가적으로, 코드를 더 읽기 쉽게 작성하기위해서 화살표 함수도 사용해볼게요.

    function printLater(number) {
        return new Promise( // 새 Promise 를 만들어서 리턴함
            resolve => {
                setTimeout( // 1초뒤 실행하도록 설정
                    () => {
                        console.log(number);
                        resolve(); // promise 가 끝났음을 알림
                    },
                    1000
                )
            }
        )
    }

    printLater(1)
    .then(() => printLater(2))
    .then(() => printLater(3))
    .then(() => printLater(4))
    .then(() => printLater(5))
    .then(() => printLater(6))

몇번 하던간에 코드의 깊이는 일정합니다. 따라서 콜백지옥에 빠질일이 없겠죠? Promise 에서는 값을 리턴 하거나, 에러를 발생 시킬 수도 있습니다. 코드를 다음과 같이 입력해보세요.

    function printLater(number) {
        return new Promise( // 새 Promise 를 만들어서 리턴함
            (resolve, reject) => { // resolve 와 reject 를 파라미터로 받습니다
                setTimeout( // 1초뒤 실행하도록 설정
                    () => {
                        if(number > 5) { return reject('number is greater than 5'); } // reject 는 에러를 발생시킵니다
                        resolve(number+1); // 현재 숫자에 1을 더한 값을 반환합니다
                        console.log(number);
                    },
                    1000
                )
            }
        )
    }

    printLater(1)
    .then(num => printLater(num))
    .then(num => printLater(num))
    .then(num => printLater(num))
    .then(num => printLater(num))
    .then(num => printLater(num))
    .then(num => printLater(num))
    .then(num => printLater(num))
    .catch(e => console.log(e));

결과:

    1
    2
    3
    4
    5
    number is greater than 5

Promise 를 이제 이해했다면, 본격적으로 axios 를 사용하여 웹 요청을 해보도록 하겠습니다.

### axios 설치

    $ yarn add axios

yarn 을 통하여 axios 를 설치하세요.

### axios 사용해보기

먼저 리덕스와 axios 를 함께 사용해보기전에, axios 만 따로 리액트 컴포넌트 사용해보도록 하겠습니다. App 컴포넌트에서 axios 를 불러오고 `componentDidMount` 메소드를 다음과 같이 입력해보세요.

#### `src/App.js`

    import axios from 'axios';

        componentDidMount() {
            axios.get('https://jsonplaceholder.typicode.com/posts/1')
                 .then(response => console.log(response.data));
        }

자, 이제 페이지에 들어가서 개발자 도구의 콘솔을 확인해보세요. 뭔가가 프린트 되었나요? 

![](http://redux-middleware.surge.sh/images/axios-componentDidMount.png)

### Thunk 를 통하여 웹 요청 해보기

자 이제 지난 섹션에서 배운 redux-thunk 를 사용하여 웹 요청을 해보겠습니다. modules 디렉토리에 post 모듈을 생성하세요.

#### `src/modules/post.js`

    import { handleActions } from 'redux-actions';

    import axios from 'axios';

    function getPostAPI(postId) {
        return axios.get(`https://jsonplaceholder.typicode.com/posts/${postId}`)
    }

    const GET_POST_PENDING = 'GET_POST_PENDING';
    const GET_POST_SUCCESS = 'GET_POST_SUCCESS';
    const GET_POST_FAILURE = 'GET_POST_FAILURE';

    export const getPost = (postId) => dispatch => {
        // 먼저, 요청이 시작했다는것을 알립니다
        dispatch({type: GET_POST_PENDING});

        // 요청을 시작합니다
        // 여기서 만든 promise 를 return 해줘야, 나중에 컴포넌트에서 호출 할 때 getPost().then(...) 을 할 수 있습니다
        return getPostAPI(postId).then(
            (response) => {
                // 요청이 성공했을경우, 서버 응답내용을 payload 로 설정하여 GET_POST_SUCCESS 액션을 디스패치합니다.
                dispatch({
                    type: GET_POST_SUCCESS,
                    payload: response
                })
            }
        ).catch(error => {
            // 에러가 발생했을 경우, 에로 내용을 payload 로 설정하여 GET_POST_FAILURE 액션을 디스패치합니다.
            dispatch({
                type: GET_POST_FAILURE,
                payload: error
            });
        })

    }

    const initialState = {
        pending: false,
        error: false,
        data: {
            title: '',
            body: ''
        }
    }

    export default handleActions({
        [GET_POST_PENDING]: (state, action) => {
            return {
                ...state,
                pending: true,
                error: false
            };
        },
        [GET_POST_SUCCESS]: (state, action) => {
            const { title, body } = action.payload.data;

            return {
                ...state,
                pending: false,
                data: {
                    title, body
                }
            };
        },
        [GET_POST_FAILURE]: (state, action) => {
            return {
                ...state,
                pending: false,
                error: true
            }
        }
    }, initialState);

새 모듈을 만들었으니, 리듀서에도 추가해주어야겠죠?

#### `src/modules/index.js`

    import { combineReducers } from 'redux';
    import counter from './counter';
    import post from './post';

    export default combineReducers({
        counter,
        post
    });

이제 곧 컴포넌트로 넘어갈건데요, 그 전에 카운터의 기본 값을 1 로 설정해주세요. 우리가, 이 숫자를 postId 로 사용하여 포스트를 불러올것이기 때문이에요. (postId 가 0인 포스트는 존재하지 않습니다.)

#### `src/modules/counter.js`

    (...)
    export default handleActions({
        [INCREMENT]: (state, action) => state + 1,
        [DECREMENT]: (state, action) => state - 1
    }, 1);

### 컴포넌트에서 액션을 통해 웹 요청 시도하기

App 컴포넌트에서 기존의 axios 를 사용하여 웹요청을 하는 코드를 제거하고, incrementAsync 와 decrementAsync 도 `Async` 를 지워 이전 상태로 돌려주세요.

    import React, { Component } from 'react';
    import { bindActionCreators } from 'redux';
    import { connect } from 'react-redux';
    import * as counterActions from './modules/counter';
    import * as postActions from './modules/post';

    class App extends Component {

        componentDidMount() {
            // 컴포넌트가 처음 마운트 될 때 현재 number 를 postId 로 사용하여 포스트 내용을 불러옵니다.
            const { number, PostActions } = this.props;
            PostActions.getPost(number);
        }

        componentWillReceiveProps(nextProps) {
            const { PostActions } = this.props;

            // 현재 number 와 새로 받을 number 가 다를 경우에 요청을 시도합니다.
            if(this.props.number !== nextProps.number) {
                PostActions.getPost(nextProps.number)
            }
        }

        render() {
            const { CounterActions, number, post, error, loading } = this.props;

            return (
                <div>
                    <p>{number}</p>
                    <button onClick={CounterActions.increment}>+</button>
                    <button onClick={CounterActions.decrement}>-</button>
                    { loading && <h2>로딩중...</h2>}
                    { error 
                        ? <h1>에러발생!</h1> 
                        : (
                            <div>
                                <h1>{post.title}</h1>
                                <p>{post.title}</p>
                            </div>
                        )}
                </div>
            );
        }
    }

    export default connect(
        (state) => ({
            number: state.counter,
            post: state.post.data,
            loading: state.post.pending,
            error: state.post.error
        }),
        (dispatch) => ({
            CounterActions: bindActionCreators(counterActions, dispatch),
            PostActions: bindActionCreators(postActions, dispatch)
        })
    )(App);

자, 이제 요청이 제대로 되는지 확인해보세요. 

![](http://redux-middleware.surge.sh/images/request-using-thunk.gif)

#### 요청 완료 후 / 에러 발생했을때 추가 작업 하기

만약에 여러분이 요청을 완료 후 컴포넌트에서 해야 할 작업이 있거나, 에러가 발생했을때 어떠한 작업을 해야된다면, `async` 와 `await` 을 사용하세요. 이 키워드들은 우리가 액션생성자 함수에서 반환한 Promise 를 기다려준답니다. async await 을 사용하기위해 새 함수를 다음과 같이 만들고 호출하세요.

#### `src/App.js`

    import React, { Component } from 'react';
    import { bindActionCreators } from 'redux';
    import { connect } from 'react-redux';

    import * as counterActions from './modules/counter';
    import * as postActions from './modules/post';

    class App extends Component {

        componentDidMount() {
            const { number } = this.props;
            this.getPost(number);

        }

        componentWillReceiveProps(nextProps) {
            if(this.props.number !== nextProps.number) {
                this.getPost(nextProps.number);
            }
        }

        getPost = async (postId) => {
            const { PostActions } = this.props;

            try {
                await PostActions.getPost(postId);
                console.log('요청이 완료 된 다음에 실행됨')
            } catch(e) {
                console.log('에러가 발생!');
            }
        }

        render() {
            const { CounterActions, number, post, error, loading } = this.props;

            return (
                <div>
                    <p>{number}</p>
                    <button onClick={CounterActions.increment}>+</button>
                    <button onClick={CounterActions.decrement}>-</button>
                    { loading && <h2>로딩중...</h2>}
                    { error 
                        ? <h1>에러발생!</h1> 
                        : (
                            <div>
                                <h1>{post.title}</h1>
                                <p>{post.title}</p>
                            </div>
                        )}
                </div>
            );
        }
    }

    export default connect(
        (state) => ({
            number: state.counter,
            post: state.post.data,
            loading: state.post.pending,
            error: state.post.error
        }),
        (dispatch) => ({
            CounterActions: bindActionCreators(counterActions, dispatch),
            PostActions: bindActionCreators(postActions, dispatch)
        })
    )(App);

async 함수를 만들때는 다음과 같이 합니다:

    async function foo() {
        const result = await Promise.resolve('hello') ; // Promise.resolve 는 파라미터로 전달된 값을 바로 반환하는 Promise 를 만듭니다.
        console.log(result); // hello
    }
    // 혹은
    const foo = async () => {
        const result = await Promise.resolve('hello') ; // Promise.resolve 는 파라미터로 전달된 값을 바로 반환하는 Promise 를 만듭니다.
        console.log(result); // hello
    }

현재 async await 이 작동하는 이유는 create-react-app 으로 만든 프로젝트에는 babel 의 Async to generator transform 플러그인이 적용되어있기 때문입니다. 만약에 이 플러그인이 설치되어있지 않다면 작동하지 않습니다. 그런 경우에는 이렇게 하면 됩니다:

    getPost = (postId) => {
        const { PostActions } = this.props;

        PostActions.getPost(postId).then(
            () => {
                console.log('요청이 완료 된 다음이 실행 됨');
            }
        ).catch((e) => {
            console.log('에러가 발생!');
        })
    }

여러분들은 Redux 의 정석대로, 비동기 웹 요청을 하는 방법을 배워보았습니다. 어떤가요? 조금은 복잡해 보이지 않나요? 모든 흐름을 다 이해한다 하더라도, 각 요청마다 액션타입을 3개씩 선언하고, 요청전, 요청완료, 요청실패의 상황에 각각 다른 액션을 디스패치해야된다는건 조금은 귀찮은 작업입니다. 하지만 걱정하지마세요. 이 작업을 간소화 해 줄 미들웨어가 존재합니다! 바로 `redux-promise-middleware` 인데요, 이 미들웨어는 Promise 를 액션의 payload 로 설정해주면, 자동으로 3가지의 액션을 디스패치해줍니다. 다음 섹션에선 이 미들웨어의 사용법을 배워보도록 하겠습니다.  

## 2-3\. redux-promise-middleware

이 미들웨어는 프로미스 기반의 비동기 작업을 조금 더 편하게 해주는 미들웨어입니다. 우선, 설치와 적용을 먼저 해보도록 하겠습니다.

### 설치와 적용

    $ yarn add redux-promise-middleware

이 미들웨어는, 프로미스가 payload 로 전달되면, 요청이 시작, 성공, 실패 할 때 액션의 뒷부분에 `_PENDING`, `_FULFILLED`, `_REJECTED` 를 반환합니다. 이 뒷부분에 붙는 접미사는 커스터마이징 할 수도 있는데요, 우리의 기존 코드에서는 FULFILLED, REJECTED 대신, SUCCESS, FAILURE 를 사용하니, 이를 임의 값으로 설정하도록 하겠습니다. 다음은, 미들웨어를 적용하는 코드입니다.

#### `src/store.js`

    import { createStore, applyMiddleware } from 'redux';
    import modules from './modules';

    import { createLogger } from 'redux-logger';
    import ReduxThunk from 'redux-thunk';
    import promiseMiddleware from 'redux-promise-middleware';

    /* 로그 미들웨어를 생성 할 때 설정을 커스터마이징 할 수 있습니다.
       https://github.com/evgenyrodionov/redux-logger#options
    */
    const logger = createLogger(); 
    const customizedPromiseMiddleware = promiseMiddleware({
        promiseTypeSuffixes: ['LOADING', 'SUCCESS', 'FAILURE']
    });

    const store = createStore(modules, applyMiddleware(logger, ReduxThunk, customizedPromiseMiddleware));

    export default store;

#### 액션 생성자 수정하기

자, 이제 기존의 액션생성자를 수정해보겠습니다. 액션타입 `GET_POST` 를 만들어주고, 액션 생성자를 다음과 같이 payload 에서 `getPostAPI` 를 호출해주세요.

#### `src/modules/post.js`

    import { handleActions } from 'redux-actions';

    import axios from 'axios';

    function getPostAPI(postId) {
        return axios.get(`https://jsonplaceholder.typicode.com/posts/${postId}`)
    }

    const GET_POST = 'GET_POST';
    const GET_POST_PENDING = 'GET_POST_PENDING';
    const GET_POST_SUCCESS = 'GET_POST_SUCCESS';
    const GET_POST_FAILURE = 'GET_POST_FAILURE';

    export const getPost = (postId) => ({
        type: GET_POST,
        payload: getPostAPI(postId)
    })

    (...)

어떤가요? 코드가 많이 깔끔해졌죠? 리듀서는 아까 코드를 그대로 사용해도 됩니다. 한번 페이지를 열어 아까처럼 제대로 작동하는지 테스트를 해보세요. 확실히, thunk 를 통하여 직접 하는것보다는 편해졌습니다. 요청의 갯수가 많아져도 앞으로 큰 걱정은 없습니다. 이 방법도 충분히 편하긴 하지만, 아직 조금의 귀찮음이 남아있습니다. 웹 요청을 하게 될 때, 우리가 가장 신경쓰는 부분은 해당 요청의 결과가 어떻고, 그에 대해서 어떻게 상태를 업데이트 할 지 인데, 이에 대하여 부가적으로 해당 요청이 현재 진행중인지, 그리고 에러가 발생했는지 매번 관리를 해줘야합니다. 이 과정에서, 여전히 _PENDING, _SUCCESS, _FAILURE 액션타입들을 만들어주어야하지요. 그리고 물론, 리듀서에서도 해당 액션타입에 따라 요청상태를 바꾸어주어야합니다. 이 작업은 요청을 할 떄마다 반복적으로 이뤄지는 것이기 때문에, 여러분이 여러분의 방식대로 이 과정을 자동화를 할 수도 있을겁니다. 다음 섹션에서는, 비동기작업을 최대한 간편하게 관리하기위해 제가 만들어서 NPM 에 배포한 `redux-pender` 를 사용하는 방법을 알아보겠습니다.  

## 2-4-redux-pender

리덕스 펜더는 프로미스 기반 액션들을 관리하기 위한 미들웨어와 도구가 포함되어있는 라이브러리입니다. 작동 방식은 redux-promise-middleware 와 매우 유사합니다. payload 에 프로미스가 있으면 이 프로미스가 시작하기전, 완료, 실패 했을때 뒤에 PENDING, SUCCESS, FAILURE 접미사를 붙여줍니다. 추가적으로, 요청들을 관리하기위한 리듀서와, 요청관련 액션들을 처리하기위한 액션 핸들러 함수들을 생성해주는 도구가 들어있습니다. 자, 그럼한번 사용해볼까요? 우선 설치부터 해줍시다.

    $ yarn add redux-pender

이제 적용을 해볼건데요, 기존의 redux-promise-middeware 는 제거해주세요. 작동 방식이 비슷하기 떄문에 서로 충돌 할 수 있습니다. (만약에 동시에 사용해야되는 경우에는 설정을 하여 충돌을 피할 수 는 있습니다. 자세한 사항은 매뉴얼을 참고해주세요. [https://github.com/velopert/redux-pender](https://github.com/velopert/redux-pender))

#### `src/store.js`

    import { createStore, applyMiddleware } from 'redux';
    import modules from './modules';

    import { createLogger } from 'redux-logger';
    import ReduxThunk from 'redux-thunk';
    import penderMiddleware from 'redux-pender';

    /* 로그 미들웨어를 생성 할 때 설정을 커스터마이징 할 수 있습니다.
       https://github.com/evgenyrodionov/redux-logger#options
    */
    const logger = createLogger(); 

    const store = createStore(modules, applyMiddleware(logger, ReduxThunk, penderMiddleware()));

    export default store;

미들웨어를 적용하고 난 다음에는 리듀서를 추가해주세요.

#### `src/modules/index.js`

    import { combineReducers } from 'redux';
    import counter from './counter';
    import post from './post';
    import { penderReducer } from 'redux-pender';

    export default combineReducers({
        counter,
        post,
        pender: penderReducer
    });

이 리듀서는 요청들을 관리하는 리듀서입니다. 이 리듀서의 상태는 다음과 같은 구조를 이루고있는데요.

    {
        pending: {},
        success: {},
        failure: {}
    }

새 프로미스 액션이 디스패치되면 상태가 다음과 같이 변하고:

    {
        pending: {
            'ACTION_NAME': true
        },
        success: {
            'ACTION_NAME': false
        },
        failure: {
            'ACTION_NAME': false
        }
    }

성공적으로 요청이 완료되면 다음과 같이 변합니다:

    {
        pending: {
            'ACTION_NAME': false
        },
        success: {
            'ACTION_NAME': true
        },
        failure: {
            'ACTION_NAME': false
        }
    }

요청이 실패한다면, 예상 가능 하시겠죠? :

    {
        pending: {
            'ACTION_NAME': false
        },
        success: {
            'ACTION_NAME': false
        },
        failure: {
            'ACTION_NAME': true
        }
    }

이 작업을 이 리듀서가 액션 이름에 따라서 해주기때문에 우리가 따로 관리해줄 필요가 없어집니다. 자, 이제 페이지에 들어가서 테스트를 해보세요. 기존의 redux-promise-middleware 를 대체 하였지만, 페이지에 들어가보면 기존 코드는 여전히 제대로 작동 할 것입니다. 작동방식이 서로 비슷하고 뒤에 추가하는 접미사도 (아까 redux-promise-middleware 를 사용할때 커스터마이징을 했기 때문에) 동일하기 때문입니다. 하지만 뭐가 다르냐구요? 액션생성자의 생성 과정과 리듀서에서 액션 처리 과정이 간소화 될 수 있습니다. 다음 코드를 확인하세요:

#### `src/modules/post.js`

    import { createAction, handleActions } from 'redux-actions';
    import { pender } from 'redux-pender';

    import axios from 'axios';

    function getPostAPI(postId) {
        return axios.get(`https://jsonplaceholder.typicode.com/posts/${postId}`)
    }

    const GET_POST = 'GET_POST';
    /* redux-pender 의 액션 구조는 Flux standard action(https://github.com/acdlite/flux-standard-action) 
       을 따르기 때문에, createAction 으로 액션을 생성 할 수 있습니다. 두번째로 들어가는 파라미터는 프로미스를 반환하는
       함수여야 합니다.
    */
    export const getPost = createAction(GET_POST, getPostAPI);

    const initialState = {
        // 요청이 진행중인지, 에러가 났는지의 여부는 더 이상 직접 관리 할 필요가 없어집니다. penderReducer 가 담당하기 때문이죠
        data: {
            title: '',
            body: ''
        }
    }

    export default handleActions({
        ...pender({
            type: GET_POST, // type 이 주어지면, 이 type 에 접미사를 붙인 액션핸들러들이 담긴 객체를 생성합니다.
            /*
                요청중 / 실패 했을 때 추가적으로 해야 할 작업이 있다면 이렇게 onPending 과 onFailure 를 추가해주면됩니다.
                onPending: (state, action) => state,
                onFailure: (state, action) => state
            */
            onSuccess: (state, action) => { // 성공했을때 해야 할 작업이 따로 없으면 이 함수 또한 생략해도 됩니다.
                const { title, body } = action.payload.data;
                return {
                    data: {
                        title, 
                        body
                    }
                }
            }
            // 함수가 생략됐을때 기본 값으론 (state, action) => state 가 설정됩니다 (state 를 그대로 반환한다는 것이죠)
        })
    }, initialState);

어떤가요? 신경써야 할 상태가 줄어들었고, 코드의 길이도 줄어들었죠? 더군다나 리듀서의 가독성도 좋아졌습니다. 이제 post 리듀서에서 error 와 pending 값을 관여하지 않게되었으니, 이를 컴포넌트에서도 반영시켜볼까요? App 컴포넌트의 마지막, connect 하는 부분의 코드만 조금 수정해주면 됩니다.

#### `src/App.js`

    (...)

    export default connect(
        (state) => ({
            number: state.counter,
            post: state.post.data,
            loading: state.pender.pending['GET_POST'],
            error: state.pender.failure['GET_POST']
        }),
        (dispatch) => ({
            CounterActions: bindActionCreators(counterActions, dispatch),
            PostActions: bindActionCreators(postActions, dispatch)
        })
    )(App);

어떤가요? 웹 요청의 상태관리가 조금은 편해지지 않았나요? 이번 챕터에서 비동기 액션을 처리하는 방식만 3가지를 배웠는데요. 어떤 방식으로 처리를 할 지, 이에 관해서는 정해진 답이 없습니다. 이번 챕터에서 다룬것들외에도, redux-observable, redux-saga 등 다른 솔루션들이 있습니다. 어떤 방식을 사용할지는 여러분들의 선택입니다.

> redux-saga 의 경우, [Rokt33r 님께서 번역하신 글](https://github.com/reactkr/learn-react-in-korean/blob/master/translated/deal-with-async-process-by-redux-saga.md)이 존재합니다. 기회가 된다면 한번 읽어보는걸 추천드립니다.