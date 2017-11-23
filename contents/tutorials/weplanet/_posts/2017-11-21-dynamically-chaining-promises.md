---
layout : tutorials
category : tutorials
title : Dynamic Promise 체인 만들기
subcategory : setlayout
summary : Dynamic Promise 체인 만드는 방법에 대해 알아봅니다.
permalink : /tutorials/weplanet/dynamically-chaining-promises
author : danielcho
tags : promise
title\_background\_color : F1F71A
---

> 본 포스팅은 [Christoph Michel][1] 의 [Creating Dynamic Promise chains][2]를 저자의 허락하에 번역한 글입니다. 오탈자, 오역 등이 있다면 연락부탁드립니다.

Promise는 순차적으로 해결되는 기능들을 엮어서 (*.then(value =\> ...)*를 통해) 비동기 응답을 처리할 수 있는 좋은 방법을 제공한다.  그러나, 가끔씩 당신은 얼마나 자주 무언가를 가져와야(fetch) 하는지 모를 때가 있다. 예를 들어, 모든 페이지를 가져오고 싶을 수 있는데, 당신은 요청을 시작하기 전에 페이지 수를 모를 수 있다.
  
Promise의 가장 큰 장점은 체인의 어느 시점에서 *then()* 핸들러의 *new Promise*를 리턴하면, 기존 체인의 나머지 부분이 실행되기 전에 그 체인이 먼저 실행된다는 것이다. 이렇게 하면, 당신은 어떤 시점에라도 새로운 핸들러를 삽입할 수 있고, 이전에 가져온 데이터에 따라 동적 Promise 체인을 효과적으로 만들 수 있다. 

![][image-1]

## 간단한 코드 예제

```javascript
const innerPromise = (val) => Promise.resolve(console.log(val + 1))
.then(() => console.log(val + 2))
.then(() => {
console.log(5)
return 5
})

const chain = Promise.resolve(console.log(0))
.then(() => console.log(1))
.then(() => console.log(2) || 2)
.then(innerPromise)
.then((five) => console.log(five + 1))

// outputs 0,1,2,3,4,5,6
```


## Promise로 모든 페이지 가져오기

동적으로 모든 페이지를 가져오고 매번 페이지 로딩이 끝날 때마다 업데이트 동작을 보내기 위해 *redux-thunk*에서도 동일한 개념을 사용할 수 있다. 다음과 같다:

```javascript
export const fetchAllPages = () => (dispatch) => {
  dispatch(fetchAllPagesStartActionCreator())
  return fetchPage()
  .then(({ data, next }) => {
// dispatch initial chunk of data
dispatch(firstPageActionCreator(data))

// more pages to get for pagination?
if (Number.isInteger(next) && next > 1) {
  // start the chain
  return fetchNextPromiseCreator(dispatch, next)
}
return true // otherwise resolve, no more pages to fetch
  })
  .catch((err) => {
dispatch(fetchError(err))
  })
}

// this function helps with looping through dynamic number of pages
// by returning a promise that fetches the data and possibly calls itself again
function fetchNextPromiseCreator(dispatch, nextPage) {
  return fetchPage(nextPage)
.then(({ data, next }) => {
  dispatch(pageUpdateActionCreator(data))
  return next
})
.catch((err) => {
  dispatch(fetchError(err))
})
.then((newNextPage) => {
  // call this function again recursively which makes it create a dynamic promise chain
  if (Number.isInteger(newNextPage) && newNextPage > nextPage) return fetchNextPromiseCreator(dispatch, newNextPage)
  return true // otherwise resolve, no more pages to fetch
})
}

function fetchPage(page = 1) {
  return fetch(https://api.github.com/users/MrToph/repos?page=${page}&sort=updated)
  .then((response) => {
const links = parse(response.headers.get('Link'))
const next = links && links.next && parseInt(links.next.page, 10)

if (response.ok) return response.json().then(json => ({ json, next }))
// otherwise parse body and _throw_ its error message
return parseThenHandleError(response.json())
  })
}
```


[1]:	http://cmichel.io/
[2]:	http://cmichel.io/dynamically-chaining-promises/

[image-1]:	http://cmichel.io/dynamically-chaining-promises/dynamic-promise-chain.svg