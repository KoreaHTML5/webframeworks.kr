---
layout : tutorials
category : tutorials
title : Vue.js와 Vue-Resource로 HTTP Request 만들기
subcategory : setlayout
summary : Vue.js와 Vue-Resource로 HTTP Request 만드는 방법을 알아봅니다.
permalink : /tutorials/weplanet/mocking-http-requests-with-vuejs
author : danielcho
tags : vue
title\_background\_color : F1F71A
---

> 본 포스팅은 [Matthias Hager][1] 의 [Mocking HTTP Requests with Vue.js and Vue-Resource][2]를 저자의 허락하에 번역한 글입니다. 오탈자, 오역 등이 있다면 연락부탁드립니다.

운영하고 있는 Vue.js 애플리케이션에 대한 단위 테스트를 진행하는 동안 실제로 서버에 쿼리요청을 하지 않고도, `vue-resource`가 실행한 다양한 HTTP 요청에 대한 테스트 데이터를 반환하는 간단한 방법이 필요했다. 널린 게 `mocks`와 `stubs`, 그리고 `spies` 등 수많은 상황에 대응할 수 있는 라이브러리들이지만, 나의 요구 사항은 간단했다. 간단한 요구에는 종종 간단한 해결책이 필요하다.

`Vue-resource`은 리퀘스트 프로세스의 모든 단계를 변경할 수 있는 [request interceptors][3]를 제공한다. 리퀘스트 사이클을 중단하고, 더미 데이터를 반환하는 것은 간단한 작업이다.

```javascript
import Vue from 'vue';
import VueResource from 'vue-resource';

Vue.use(VueResource);

Vue.http.interceptors.unshift((request, next) => {
  next(
request.respondWith(
  {id: 17, body: 'Well, my time of not taking you seriously is coming to a middle.'},
  {status: 200}
)
  );
```

이렇게 하면 간단한 인터셉터가 목록에 추가된다. `request.respondWith()`를 호출하여 요청 처리를 중단한다. 이렇게 하면 네트워크 호출이 수행되지 않고 추가적인 인터셉터가 실행되지 않는다.

그러나 이것으로는 충분하지 않다! 단 하나의 HTTP 요청을 하는 건 드문 일이다. 종종 다른 API 엔드 포인트에 대해 여러 요청이 이루어진다. 지금 코드는 단 하나의 응답만 반환한다. 필자는 반환할 `Mock` 데이터와 함께 API 경로 트리를 기본적으로 매핑하려고 했다.

```javascript
let routes = [
  {
method: 'GET',
url: 'quotes/',
response: [
  {id: 14, body: "You know what the chain of command is? It's the chain I go get and beat you with until you understand who's in ruttin charge here."},
  {id: 22, body: 'Also? I can kill you with my brain.'}
]
  },
  {
method: 'POST',
url: 'quotes/',
response: {id: 23, body: 'Terse? I can be terse. Once, in flight school, I was laconic.'}
  },
  {
method: 'GET',
url: 'quotes/18/',
response: {id: 18, body: 'Curse your sudden but inevitable betrayal!'}
  }
];
```

이제 우리는 어떤 경로가 HTTP 요청과 일치하는지 확인해야하고 적절한 응답을 반환하는 간단한 방법이 필요하다. 이제 인터셉터를 수정해보자.

```javascript
import Vue from 'vue';
import VueResource from 'vue-resource';

Vue.use(VueResource);

Vue.http.interceptors.unshift((request, next) => {
  let route = routes.find((item) => {
return (request.method === item.method && request.url === item.url);
  });
  if (!route) {
// we're just going to return a 404 here, since we don't want our test suite making a real HTTP request
next(request.respondWith({status: 404, statusText: 'Oh no! Not found!'}));
  } else {
next(
  request.respondWith(
route.response,
{status: 200}
  )
);
  }
});
```

간단하다!

CodePen에 이 인터셉터를 보여주는 [little cornball application][4]이 있다. 아직 존재하지 않는 API의 프론트 엔드를 구축하는 경우 개발 중에도 이 동일한 코드를 사용할 수 있다. 테스트 데이터를 애플리케이션에 하드 코딩하는 대신 처음부터 요청/응답 처리를 구현할 수 있다.

물론 모든 시나리오를 처리하지는 않는다. 보다 복잡한 POST 데이터를 처리하거나 리퀘스트 시 전달하는 추가적인 정보에 따라 동일한 API 엔드 포인트에 대해 다른 응답들을 반환해야 할 수도 있다. 간단한 목적으로 쓸 경우에는 아예 다른 라이브러리를 가져와서 복잡함을 더하는 것보다 이해하기 쉬운 적은 양의 코드를 쓰는 게 낫다.



[1]:	https://matthiashager.com/
[2]:	https://matthiashager.com/blog/mocking-http-requests-with-vuejs
[3]:	https://github.com/pagekit/vue-resource/blob/master/docs/http.md#interceptors
[4]:	https://codepen.io/anon/pen/wovjPE