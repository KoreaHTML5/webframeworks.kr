---
layout : tutorials
title : NodeJS를 이용한 API 서버만들기 3
category : tutorials
subcategory : data-query
summary : NodeJS를 이용한 REST API 서버 개발을 시작할 수 있다. ExpressJS, Sequelize로 기본 골격을 잡는 것부터 Mocha, Supertest로 유닛테스트하는 방법까지 설명한다. 이 글은 지난 코드랩 진행했던 내용과 유사하다.
permalink : /tutorials/nodejs/api-server-by-nodejs-03
title_background_color : 026E00
title_color : FFFFFF
tags : javascript framework ExpressJS JS tutorial NodeJS Sequelize Mocha Supertest UnitTest
author : 6pack
---

## 사용자 목록 조회 API

REST API에 대해 감을 잠았다면 이것을 생각하면서 본격적으로 API를 만들어 보겠습니다. 사용자에 관련된 API를 만들 것인데요 서버에 있는 사용자 목록을 조회하는 API를 만들어 볼 것입니다.


### 임시 사용자 데이터

우선 우리는 아직 데이터베이스는 다루지 않습니다. 대신에 데이터베이스 역할을 할수 있는 `users` 변수를 만들어서 사용하겠습니다. `app.js` 파일에 아래 코드를 추가해 보세요.

```javascript
let users = [
  {
    id: 1,
    name: 'alice'
  },
  {
    id: 2,
    name: 'bek'
  },
  {
    id: 3,
    name: 'chris'
  }
]
```

`let`은 이전시간에 보았던 키워드죠? ES6에서 사용할 수 있는 블록 스코프의 변수 입니다. `let` 키워드를 이용해 `users` 변수를 선언했구요, 선언함과 동시에 배열 값을 변수에 할당하였습니다. 이 배열은 요소롤 자바스크립트 객체를 갖고 있는데요, `id`와 `name`을 속성으로 갖는 객체입니다. 이것을 user 객체라고 하겠습니다. user 객체의 `id`는 객체의 식별자이고 `name`은 사용자의 이름을 저장합니다.


### 라우팅 설정

클라이언트는 `users` 변수에 저장된 사용자 데이터를 조회하도록 API를 요청할 할수 있는데요. 이 API를 "GET /users" 라고 이름 짓겠습니다. 익스프레스의 라이팅 함수 중 `get()` 함수를 이용하여 메쏘드가 GET임을 설정한뒤 첫번재 파라매터로 경로명인 "/users" 문자열을 넘겨주면 이 API에 대한 라우팅을 만들 수 있습니다.

```javascript
app.get('/users', (req, res) => {
  // 여기에 라우팅 로직을 작성하면 됩니다.
});
```

여기까지 작성하면 클라이언트가 "GET /usres" 로 요청할 경우 위에서 설정한 라우팅 함수가 동작할 것입니다. 이제 남은것은 라우팅 함수에서 `users` 변수의 값을 클라이언트에 보내 주기만 하면 됩니다. 라우팅 함수의 두 파라매터 중 두번 째 파라매터인 `res`가 응답 객체인데요, 응답객체의 함수중 `json()` 함수를 사용하면 제이슨 형식의 데이터를 클라이언트에게 보내줄 수 있답니다.


### JSON

JSON은 일종의 데이터 표현 방법입니다. 프로그래밍 언어로 오해하시는 분들이 있는데 그렇지 않습니다.

인터넷에서 데이터를 주고받는 방법은 여러 가지가 있는데 과거에 많이 사용하는 방법 중 하나가 XML입니다. 웹 프론트엔드 개발자라면 AJAX라는 용어에 익숙하실 거에요. Asynchronous Javascript And XML의 약자인데요 자바스크립트로 비동기 통신할때 XML를 사용한다라고 이해하시면 됩니다.

한편 JSON 이라는 또 다른 표현 방법이 나왔는데 이것은 XML보다 짧은 표현으로 더 많은 정보를 표현할 수 있는 표현법이에요. 그래서 요즘에는 XML 보다는 JSON을 많이 사용하고 있습니다.

JSON의 또 다른 특징은 자바스크립트 객체와 비슷한 점이 많다는 겁니다. 자바스크립트 언어에는 객체를 JSON으로 변환하고 그 반대로도 할 수 있는 방법이 있습니다. 익스프레스 엔진의 `res.json()` 함수도 자바스크립트 객체를 JSON으로 변환해 주는 기능이 내장되어 있는 것입니다.


### 라우팅 로직 작성

이점을 유념하면서 라우팅로직을 작성해 보겠습니다. `users` 변수에 들어있는 값은 자바스크립트 객체의 배열입니다. `res.json()` 함수는 파라매터로 이 값을 받아 JSON 형식으로 변환합니다. 그리고 요청한 클라이언트로 JSON 데이터를 응답해 주는 기능을 합니다.

```javascript
app.get('/users', (req, res) => {
  return res.json(users);
});
```

애로운 함수를 사용하는 이 코드는 좀 더 단순하게 만들수 있습니다.

```javascript
app.get('/users', (req, res) => res.json(users));
```

애로우 함수는 함수 본체에 return 구문만 있을 경우 이렇게 한 줄로 작성할 수 있습니다.


### API 테스트

처음으로 API를 만들어 봤습니다. 제대로 동작하는지 확인하는 방법은 뭐가 있을까요? CURL 명령어를 이용해 테스트 해 보겠습니다.

```
curl -X GET '127.0.0.1:3000/users' -v
[{"id":1,"name":"chris"},{"id":2,"name":"tim"},{"id":3,"name":"daniel"}]%
```

요청한 결과 `users` 변수에 저장된 자바스크립트 객체가 JSON 형식으로 변환되어 클라이언트로 전달 되었습니다.

```
git checkout getUsers
```


## 특정 사용자 조회 API

이번에는 특정 사용자를 조회하는 API를 만들어 볼 차례입니다. 사용자가 현제 3명인데요 어떻게 식별할 수 있을까요? 유저 객체를 다시 살펴봅시다. 유저 객체는 `id`와 `name`으로 구성되어 있습니다.

```javascript
{
  id: 1,
  name: "alice"
}
```

`name` 필드는 중복될수 있지만 `id`는 중복되지 않는 식별자 입니다. 우리가 그렇게 정의했기 때문입니다. 실제 데이터베이스 테이블에 저장될때도 `id`는 유일한 속성인 unique를 설정할 것입니다. 아직 데이터베이스를 다루지 않기 때문에 우리는 이 `id`에 대해 유일하다고 가정하고 진행할 것입니다.

그럼 클라이언트는 특정 사용자를 조회하는 요청을 서버에게 전달할 때 `id`도 함께 전달합니다. `id`가 1인 사용자 객체를 조회할 경우 서버는 `users`에 저장된 배열을 뒤져 `id`가 1인 객체를 클라이언트로 응답해 주면 되는 것이죠. 그럼 이번 API에 대한 라우팅 로직을 구현해 보겠습니다.


### 파라매터 설정하는 방법

클라이언트에서는 `id`가 1인 사용자를 조회할 경우 아래 주소로 서버에 요청할 수 있습니다.

```
GET /users/1
```

만약 id가 2인 사용자를 조회한다면 이렇게 표현할 수 있겠죠.

```
GET /users/2
```

주소의 뒷 부분만 id에 해당하는 값으로 변경합니다. 이것을 서버 라우팅 로직에서 설정해 주어야 합니다. 우선 서버 코드를 한 번 작성해 볼까요?

```javascript
app.get('/users/1', (req, res) => /* ... */);
```

서버에서 라우팅로직을 이렇게 설정하면 "GET /users/1"에 대한 요청을 처리할 수 있을 것입니다. 만약 `id`가 2인 요청을 처리하려면 또 API를 만들어야 할까요? 이런 방식으로 말이죠.

```javascript
app.get('/users/2', (req, res) => /* ... */);
```

그렇게 할 수는 있습니다. 하지만 이것은 효율적인 방법이 아닙니다. `id`값이 예측할 수 없을 만큼 변경가능하기 때문입니다. 그래서 익스프레스에서는 이러한 동적인 값을 라우팅에 설정할 수 있는 방법을 제공합니다. 다음과 같이 코드를 변경해 보세요.

```javascript
app.get('/users/:id', (req, res) => {
  console.log(req.params.id); // 사용자가 입력한 :id 값이 출력됨. (주의: 단 문자열 형식임 )
});
```

"/users/:id" 라는 문자열 형식으로 경로를 설정하면 요청 객체를 이용해 `req.params.id`로 클라이언트의 요청정보에 접근할 수 있습니다. 만약 사용자가 "GET /users/1" 로 요청한다면 `req.params.id`에는 "1"이라는 값이 들어가게 됩니다. 단, 주의할 것은 이 값이 숫자가 아닌 문자라는 것입니다. 클라이언트가 요청할때 서버로 오는 데이터는 전부 문자열 형식입니다. 기억하세요.


### 아이디로 유저 객체 검색

우선 클라이언트로부터 요청정보를 받는 것에는 성공했습니다. 이제는 `id`를 기반으로 서버에 있는 `users`배열을 뒤져 `id`가 일치하는 데이터를 찾아 요청한 클라이언트로 응답해주는 일만 남았습니다.

아이디로 `users` 배열을 검색하기 전에 `id` 값에 대한 처리가 남아 있습니다. 이 값이 숫자인지를 확인하는 겁니다. 숫자가 아닌 데이터는 유효하지 않기 때문이죠. 예를 들어 클라이언트가 "GET /users/alice" 라고 요청할 경우는 우리가 설정한 URL 규칙에 맞지 않습니다. 이러한 경우는 어떻게 처리할까요? 아래 코드를 봅시다.

```javascript
app.get('/users/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
});
```

`parserInt()` 함수로 `id` 문자열 값을 정수형으로 변경했습니다. 왜냐구요? `users` 배열에 있는 user 객체를 검색할 건데 검색 기준이 되는 값이 `id` 입니다. `users`에 있는 값은 숫자형 데이터인데 클라이언트가 요청한 데이터는 문자열이기 때문입니다. 정확한 검색을 위해 `id`를 문자열로 변경하는 것입니다.

`parserInt()`는 문자열을 숫자로 변경하는 과정에서 에러가 발생하면 `NaN`을 되돌려 주게 되어있습니다. 이것은 명백히 요청한 클라이언트 쪽의 실수라고 할 수 있는데요 서버는 이러한 요청에 대해서도 클라이언트에게 적절한 응답을 해줘야합니다. 우리가 REST API에서 공부한게 있죠. 바로 상태 코드(Status code)입니다. 클라이언트의 잘못된 요청에 대해 400번 상태코드를 응답하기로 한것을 기억하시나요? 이것을 코드로 구현하면 아래와 같습니다.

```javascript
app.get('/users/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!id) {
    return res.status(400).json({error: 'Incorrect id'});
  }
});
```

`parseInt()` 결과가 `NaN`일 경우 `id`는 `NaN` 값이 들어가게 됩니다. `if` 조건문에서 `NaN`은 `false`와 동일합니다. 즉 `if (!Nan)`은 `if (!false)`와 동일한 조건문이 되는 결과인 셈이죠. `id`에 `NaN`이 할당되면 if 블록 안으로 진입하게 됩니다.

응답 객체인 `res`는 `json()` 함수 말고도 `status()` 함수를 제공합니다. 함수 이름으로도 알수 있듯이 상태코드를 설정하여 응답하는 기능입니다. 파라매터로 응답할 상태코드를 설정하면 됩니다.

그리고 나서 다시 `json()` 함수를 호출하는 부분이 보이시나요? 약간 어색할 수도 있는데요 이것을 함수 체이닝이라고 합니다. 제이쿼리를 사용해본 분이시라면 이러한 함수 체이닝 기법에 익숙하실 겁니다. 그렇지 않는 분들을 위해 함수 체이닝에 대해 간단히 설명해 보겠습니다.


### 함수체이닝

아래 코드를 한번 읽어 보세요. `User` 클래스를 만들고 클래스에 `greeting()`와 `introduce()` 메소드를 정의한 것입니다.

```javascript
function User(_name) {
  this.name = _name;
}

User.prototype.greeting = function() {
  console.log('Hello! ');
  return this;
};

User.prototype.introduce = function() {
  console.log(`I am ${this.name}`);
  return this;
};
```

각 메소드는 동일한게 this를 반환하도록 했습니다. 바로 아래 코드에서 함수 체이닝을 사용하기 위해서이지요.

```javascript
var chris = new User('chris');
chris.greeting().introduce();
```

클래스로 객체를 만들어 `chris` 변수에 저장했습니다. 그리고 `chris` 객체의 `greeting()` 함수를 호출했구요. `greeting()` 함수는 콘솔에 인사 문자열을 출력하고 나서 `this`를 리턴합니다. `this`는 `chris` 객체를 의미하죠. 그래서 곧바로 `introduce()` 메소드를 호출하는 것입니다. 이것을 함수 체이닝이라고 하는데 함수를 체인처럼 연결해서 사용하는 모습을 연상하시면 이해될 것입니다.


### 클라이언트로 응답

다시 우리 코드로 돌아옵니다. 클라이언트가 요청한 `id` 정보를 검증하였습니다. 이제 남은 것은 `users` 배열에서 `id`와 일치하는 user 객체를 찾는 일입니다. 자바스크립트 배열 메소드 중 `filter()` 함수를 사용해 보겠습니다.

코드 작성에 앞에 `filter()` 함수의 사용법에 대해 간단히 짚고 넘어가도록 하죠.


### filter()

필터함수는 배열의 각 요소를 점검하면서 어떠한 기준에 통과한 값들을 필터링해서 별도의 배열로 담는 역할을 합니다. `users` 배열에서 `filter()` 함수를 사용해 볼까요?

```javascript
let user = users.filter(user => {
  return user.id === id;
});
```

`users.filter()` 함수는 파라매터로 `users` 배열에 있는 요소를 순서대로 반환합니다. `users.filter(user => )` 코드에서 처음 `user`의 값은 `users` 배열의 첫번째 요소인 `{id: 1, name: 'alice'}` 객체가 됩니다. 이 객체의 `id` 값과 요청한 `id`값을 비교해서 같으면 참을 다르면 거짓을 반환하는 것이 다음 코드입니다.

참을 반환하면 현재 `user` 객체를 새로운 배열에 추가합니다. 만약 그렇지 않을 경우에는 무시하구요. 그러면 위 코드 결과 `user`에는 어떤 값이 들어갈까요? 바로 다음과 같은 배열이 담기게 됩니다.

```javascript
console.log(user); // [{id: 1, name: 'alice'}]
```

`users` 배열에서 `id` 가 1인 객체는 이것 뿐이니까요. 우리는 객체에 접근하기 위해 배열의 첫 번째 값만 가져 옵니다. 코드를 다음과 같이 변경하면 되지요.

```javascript
let user = users.filter(user => user.id === id)[0]
console.log(user); // {id: 1, name: 'alice'}
```

### 404 에러

만약에 `filter()` 함수로 검색에 실패할 경우는 어떻게 될까요? `filter()` 함수는 빈 배열(`[ ]`) 을 반환하게 될 것입니다. 그리고 빈 배열의 0번 인덱스에 접근하게되면 `undefined` 값이 리턴됩니다. 결국 `user` 변수에는 `undefined` 값이 저장되는 것이죠. 이러한 경우 REST API 규칙에 의해 404 상태코드를 클라이언트에게 알려 줘야 합니다. 왜냐하면 `id`에 해당하는 유저 데이터가 없기 때문입니다. 다음 코드를 추가하세요.

```javascript
app.get('/users/:id', (req, res) => {
  let user = users.filter(user => user.id === id)[0]
  if (!user) {
    return res.status(404).json({error: 'Unknown user'});
  }
});
```

### 성공 응답

여기까지 왔다면 찾은 `user` 객체를 클라이언트에게 제이슨 형식으로 응답하는 것만 남았습니다. 아래는 "GET /users/:id api"에 대한 전체 코드입니다. 한번 쭉 읽어보세요.

```javascript
app.get('/users/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!id) {
    return res.status(400).json({error: 'Incorrect id'});
  }

  let user = users.filter(user => user.id === id)[0]
  if (!user) {
    return res.status(404).json({error: 'Unknown user'});
  }

  return res.json(user);
});
```

### API 테스트

지난 번과 마찬가지로 CURL을 이용해 API 테스트를 진행해 봅시다. 이번에는 -v 옵션을 추가해서 좀더 많은 정보를 살펴 보지요.

```
curl -X GET '127.0.0.1:3000/users/1' -v
*   Trying 127.0.0.1...
* Connected to 127.0.0.1 (127.0.0.1) port 3000 (#0)
> GET /users/1 HTTP/1.1
> Host: 127.0.0.1:3000
> User-Agent: curl/7.43.0
> Accept: */*
>
< HTTP/1.1 200 OK
< X-Powered-By: Express
< Content-Type: application/json; charset=utf-8
< Content-Length: 23
< ETag: W/"17-I7acqn1l5gkxSQFaJfegnw"
< Date: Wed, 14 Sep 2016 06:52:25 GMT
< Connection: keep-alive
<
* Connection #0 to host 127.0.0.1 left intact
{"id":1,"name":"chris"}%
```

전체 배열이 응답되는 대신에 하나의 객체만 응답되었죠? 그리고 그 객체의 `id`가 `1`인 것을 보니 요청한 데이터가 제대로 응답되는 것 같습니다.

서버에 없는 아이디를 요청하여 404 에러가 나는지도 확인해 보겠습니다.

```
curl -X GET 'localhost:3000/users/4' -v
*   Trying ::1...
* Connected to localhost (::1) port 3000 (#0)
> GET /users/4 HTTP/1.1
> Host: localhost:3000
> User-Agent: curl/7.43.0
> Accept: */*
>
< HTTP/1.1 404 Not Found
< X-Powered-By: Express
< Content-Type: application/json; charset=utf-8
< Content-Length: 24
< ETag: W/"18-4jVflJv5bJNWyjxLQo1wGQ"
< Date: Sun, 18 Sep 2016 01:24:40 GMT
< Connection: keep-alive
<
* Connection #0 to host localhost left intact
{"error":"Unknown user"}%
```

4번 아이디는 서버에 없기 때문에 404 Not Found 상태 코드가 응답 되었습니다. 그리고 우리가 설정한 에러 문자열 "Unknown user"가 바디에 응답 되었습니다.

그럼 id를 숫자가 아닌 "alice" 문자열을 설정해서 보내 보겠습니다.


```
curl -X GET 'localhost:3000/users/alice' -v
*   Trying ::1...
* Connected to localhost (::1) port 3000 (#0)
> GET /users/alice HTTP/1.1
> Host: localhost:3000
> User-Agent: curl/7.43.0
> Accept: */*
>
< HTTP/1.1 400 Bad Request
< X-Powered-By: Express
< Content-Type: application/json; charset=utf-8
< Content-Length: 24
< ETag: W/"18-wZEjFUvjngr0SgDR3EuSXg"
< Date: Sun, 18 Sep 2016 01:26:19 GMT
< Connection: keep-alive
<
* Connection #0 to host localhost left intact
{"error":"Incorrect id"}%
```

400 Bad Request 상태 코드와 "Incorrect id" 에러 문자열이 응답되었습니다. 모두 제대로 동작하는군요.

```
git checkout getUserById
```


## 특정 사용자 삭제 API

지난번에는 사용자 `id`로 사용자 객체를 조회하는 API를 만들었다면 이번엔 삭제하는 API를 만들어볼 차례입니다. API 주소는 아래와 같습니다.

```
DELETE /users/:id
```


### 라우팅 설정

메쏘만 GET에서 DELETE로 바뀌었고 뒤에 경로는 조회 API와 동일합니다.

라우팅 먼저 설정합시다. 그동안 익스프레스 객체 `app`의 `get()` 함수만 사용했는데 이것은 조회 API의 메소드가 GET 이었기 때문입니다. 삭제 API의 메소드인 DELETE을 설정하려면 `delete()` 함수를 사용해야겠지요. `delete()` 함수의 파라메터도 `get()` 함수와 같습니다. 첫번째 파라매터로 설정할 경로를 문자열로 넘겨줍니다.

```javascript
app.delete('/users/:id', (req, res) => /* ... */);
```

파라메터로 받은 `id`값에 대한 처리도 해야하는데 이미 "GET /users/:id" API를 만들면서 사용했습니다. 동일한 코드를 사용하면 됩니다.

```javascript
app.delete('/users/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!id) {
    return res.status(400).json({error: 'Incorrect id'});
  }
});
```


### 삭제 로직 구현

잠깐 삭제 API의 로직을 생각해 봅시다. 먼저 유저 데이터를 담고 있는 `users` 배열에서 `id`에 해당하는 객체의 위치를 찾아야 되겠죠. 그리고 찾은 위치의 요소를 배열에서 제거하면 될 것입니다. 자바스크립트 배열 메소드 중에는 이러한 기능을 할수 있는 함수가 있는데 다음 두 가지 함수를 사용할 겁니다.

* `findIndex()`
* `splice()`


### 배열에서 삭제할 유저 찾기

`findIndex()`는 배열을 순회하면서 어떤 기준에 맞는 요소의 인덱스를 찾는데 사용합니다. `users`에서 요청한 `id`에 해당하는 객체가 있는 인덱스를 먼저 찾아야겠지요.

```javascript
const userIdx = users.findIndex(user => {
  return user.id === id;
});
```

앞에서 먼저 보았던 배열 메소드 `filter()`와 매우 유사하게 동작합니다. `findIndex()`는 배열의 각 요소를 순차적으로 돌면서 계산합니다. `users.findIndex(user, => )` 구문의 경우 처음 `user`는 `users` 배열의 첫 요소가 반환되어 나옵니다. 이 `user`에 대해 `id`값을 비교한 뒤 참을 반환하면 `users` 배열에서의 `user`가 있는 배열 인덱스가 반환됩니다. 결국 이 인덱스 정수값은 `userIdx` 상수에 저장되는 것이지요. 만약 `id` 비교 결과 거짓이 리턴되면 배열의 다음 요소가 `user` 변수에 할당되어 넘어옵니다.

만약 `findIndex()` 함수의 `id` 비교문이 전부 `false`를 반환하면 어떤 인덱스 값을 반환하게 될까요? 이 함수는 그거한 경우는 함수 동작의 실패로 판단하고 -1값을 반환합니다. 우리는 `userIdx`의 값이 -1일 경우 없는 유저라고 판단할수 있겠죠. 그럼 생각나는 것이 있죠? 바로 클라이언트에서 없는 유저라는 뜻의 404 상태코드를 응답해 주는 것입니다. 다음 코드를 보면 이해하시겠죠?

```javascript
if (userIdx === -1) {
  return res.status(404).json({error: 'Unknown user'});
}
```


### 배열에서 유저 객체 제거

드디어 배열로부터 삭제할 유저 객체의 인덱스를 찾았습니다. 배열에서 인덱스를 이용해 요소를 삭제하는 것은 매우 간단한 일인데요 바로 배열 매소드 중 `splice()` 함수를 사용하는 것입니다. 첫번째 파라매터로 삭제할 인덱스 숫자를 넘겨주고 두번째 파라매터에는 1을 넣어 줍니다. 1이라는 값은 첫번째 파라매터를 포함하여 그 다음 요소 몇개를 삭제하느냐는 의미입니다. 우리는 1개만 삭제하기 때문에 1을 넘겨주는 겁니다.

```javascript
users.splice(userIdx, 1);
```


### 응답

서버쪽에서 데이터를 다루는 작업은 모두 마쳤습니다. 이제 남은것은 요청한 클라이언트에게 뭔가 응답해 줘야합니다. 사용자를 조회할때는 조회한 사용자 객체를 응답했는데 삭제의 경우는 삭제된 데이터를 보내줄 수도 없는 일입니다. 보통 두 가지 방법이 있습니다.

첫번째는 삭제된 후 전체 `users` 배열을 다시 응답하는 방법입니다. 클라이언트 입장에서는 응답으로 온 `users` 배열을 확인하면 요청한 데이터가 삭제되었는지 확인할 수 있기 때문입니다.

두번째 방법은 아무 데이터도 보내지 않는 것입니다. 여기서 우리는 REST API 의 상태코드를 사용할 수 있는데요 바로 "No Content"를 뜻하는 204 상태코드를 응답하는 것입니다.

여기서는 후자의 방법을 사용하겠습니다. 응답을 포함한 전체 코드는 아래를 참고하세요.

```javascript
app.delete('/users/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!id) {
    return res.status(400).json({error: 'Incorrect id'});
  }

  const userIdx = users.findIndex(user => user.id === id);
  if (userIdx === -1) {
    return res.status(404).json({error: 'Unknown user'});
  }

  users.splice(userIdx, 1);
  res.status(204).send();
});
```


### API 테스트

curl를 이용해서 삭제 api를 테스트 해보겠습니다.

```
curl -X DELETE '127.0.0.1:3000/users/1' -v
*   Trying 127.0.0.1...
* Connected to 127.0.0.1 (127.0.0.1) port 3000 (#0)
> DELETE /users/1 HTTP/1.1
> Host: 127.0.0.1:3000
> User-Agent: curl/7.43.0
> Accept: */*
>
< HTTP/1.1 204 No Content
< X-Powered-By: Express
< Date: Wed, 14 Sep 2016 06:48:51 GMT
< Connection: keep-alive
<
* Connection #0 to host 127.0.0.1 left intact
```

204 상태 코드가 응답되었습니다. GET API와는 다르게 바디가 비어있는 채로 왔습니다. 실제 삭제 되었는지 조회 API를 호출해 보죠.

```
curl -X GET '127.0.0.1:3000/users/1' -v
*   Trying 127.0.0.1...
* Connected to 127.0.0.1 (127.0.0.1) port 3000 (#0)
> GET /users/1 HTTP/1.1
> Host: 127.0.0.1:3000
> User-Agent: curl/7.43.0
> Accept: */*
>
< HTTP/1.1 404 Not Found
< X-Powered-By: Express
< Content-Type: application/json; charset=utf-8
< Content-Length: 24
< ETag: W/"18-4jVflJv5bJNWyjxLQo1wGQ"
< Date: Wed, 14 Sep 2016 06:50:08 GMT
< Connection: keep-alive
<
* Connection #0 to host 127.0.0.1 left intact
{"error":"Unknown user"}%
```

`id`가 1인 유저를 조회했을 때 404 상태코드가 응답되었습니다. 그리고 바디에는 애러 문자열이 들어있네요. 전체 데이터를 조회해 볼까요?

```
curl -X GET '127.0.0.1:3000/users' -v
[{"id":2,"name":"tim"},{"id":3,"name":"daniel"}]%
```

`id`가 1인 데이터는 안보이네요. 삭제 API가 제대로 동작하는것을 확인했습니다.

```
git checkout deleteUserById
```


## 사용자 생성 API

유저 삭제 API를 만들었으니 반대로 유저 추가 API를 만들어볼 차례입니다. API 주소는 아래와 같습니다.

```
POST /users
```


### 라우팅 설정

익스프레스 객체의 함수중 `get()`과 `delete()`을 사용했는데요 이번에는 `post()` 함수를 사용해야겠죠. 이제는 메소드에 따라 어떤 함수를 사용해야할지 감이 오지 않습니까? 저는 그렇습니다. `post()` 함수로 POST 메소드임을 설정합니다. 그리고 첫번째 파라매터로 경로를 문자열로 넘겨 줍니다.


```javascript
app.post('/users', (req, res) => /* ... */);
```


### 요청 바디 (body)

HTTP 요청에 사용되는 데이터는 두 가지 방법이 있습니다.

* 쿼리문자열 (Query string)
* 바디 (Body)

쿼리문자열은 url에 포함되어 있는 키/밸류 쌍의 값을 의미합니다. 당장 구글 검색 페이지를 열어서 "chris"라고 검색해보세요. 브라우져 주소창에 아래와 비슷한 주소가 있을 겁니다.


```
https://www.google.co.kr/#newwindow=1&q=chris
```

좀 상세하게 들여다 보죠. `https` 부분을 프로토콜이라고 합니다. 그 뒤에 `www.google.co.kr` 부분을 도메인이라고 합니다. 그 뒤에 따라오는 `/#newwindow=1` 부분을 경로라고 합니다. 마지막 으로 `&q=chris`  부분을 "쿼리 문자열""이라고 합니다. 브라우져가 서버로 뭐가 요청할때 `q=chris`라는 형식으로 요청하는 것입니다.

한편 바디라는 형식으로 요청 데이터를 보낼 수 있는데요 웹 브라우져로는 확인하기 어렵습니다. 바디 데이터는 POST 메소드일 경우에만 유효하기 때문이죠. 웹 페이지의 폼을 서버로 보낼때 이 요청 바디를 종종 사용하곤 합니다.


### body-parser

익스프레스에 요청 바디의 데이터에 접근하기 위해서 [body-parser](https://github.com/expressjs/body-parser)라는 패키지를 추가해야 합니다. body-parser를 프로젝트에 추가합니다.

```
npm i body-parser --save
```

바디 파서는 미들웨어입니다. 따라서 `app.js`에 있는 익스프레스 객체에 이 미들웨어를 추가해서 사용할 수 있죠. 미들웨어를 추가할 때 사용하는 익스프레스 객체의 함수가 뭐라고 했는지 기억 나시나요? 바로 `use()` 함수입니다. 바디 파서를 `use()` 함수로 추가해 봅시다.

```javascript
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
```

이 설정 코드에 대한 설명을 별도로 하지 않겠습니다. 궁금하신 분들은 [여기](#)를 읽어 보세요.


### 파라매터 검증

비로소 우리 코드에서 요청 바디에 접근할수 있게 되었습니다. 어떻게 접근하냐구요? `id` 파라매터에 접근하는 방법과 유사합니다. 바로 `req.body` 를 통해서 바디 값에 접근할 수 있죠. 클라이언트가 요청시 바디에 `name="chris"`라는 형식으로 요청한다고 생각해 보세요. 그럼 서버에서는 `req.body.name="chris"` 형식으로 데이터가 전송됩니다.

```javascript
app.post('/users', (req, res) => {
  const name = req.body.name || '';
});
```

`name` 상수에 `req.body.name`을 할당하는 코드를 작성했습니다. 하지만 만약에 이 값이 `undefined`가 될수 있는데요, 클라이언트가 요청시 `name` 값을 입력하지 않은 경우입니다. 그러한 경우에는 빈 문자열을 `name` 상수에 넣도록 했습니다.

클라이언트가 `name` 값을 입력하지 않은 경우에 서버는 어떻게 응답해야 할까요? 바로 "400 Bad Request" 응답 코드를 보내 줄 수 있어야 합니다. 아래 코드를 보세요.

```javascript
if (!name.length) {
  return res.status(400).json({error: 'Incorrenct name'});
}
```

`req.body.name`의 값이 없을 경우 상수 `name`에는 길이가 0인 문자열(`""`)이 들어가게 됩니다. 이것은 `if (!name.length)` 조건문을 통과하여 if 블록에 집입하게 되는 것이죠. 결국 요청한 클라이언트에게는 400 응답코드와 에러 메세지를 던져 줍니다.


### 새로운 아이디 만들기

요청한 파라매터 `name`이 제대로 입력 되었다면 다음 할일은 새로운 유저 객체를 만드는 것입니다. 유저객체는 `id`와 `name`으로 구성되어 있는데요 방금 `name`은 요청 바디를 통해 얻었습니다. 남은 것이 `id` 인데요 이것을 얻으려면 기존에 있는 `id`와 중복되지 않은 값을 사용해야 합니다. 저는 기존에 있는 `id`중 가장 큰 값보다 1 더큰 값을 `id`로 만들 생각이에요. 이번에도 자바스크립트 배열에서 제공하는 메소드를 사용할 것입니다. 바로 `reduce()` 함수입니다.

`reduce()` 함수는 배열의 각 요소를 순회하면서 어떤 누적데이터를 만들어 내는 기능을 합니다. 직접 사용하는 것을 살펴 보면서 이해해 보도록 하죠.

```javascript
const id = users.reduce((maxId, user) => {
   return user.id > maxId ? user.id : maxId
 }, 0);
```

`reduce()` 함수는 첫번째 함수를 파라매터로 넘겨주는데 이 함수는 두 개의 파라매터를 갖습니다. 첫번째 파라매터로 `maxId`라고 이름한 것은 우리가 `reduce()` 함수가 종료될 때 얻게될 값을 저장하고 있습니다. 두번째 파라매터는 배열 `users`의 각 요소를 순서대로 반환해 주는 유저 객체입니다. 그리고 `reduce()` 함수의 두번째 파라매터로 `0`을 넘겨줬는데 이는 `maxId`의 초기 값이죠.

예를 들어 `users.reduce(maxId, user) => {  }, 0);` 구문이 처음 실행될때 `maxId` 값은 `0`이 되고 `user`는 `users` 배열의 첫번째 요소가 됩니다.

코드의 두번째 줄을 살펴 보죠. 어떤 값을 반환하고 있는데요 이 값은 다음 반복문에서 `maxId` 값이 되는 것입니다. 리턴되는 코드를 봅시다. 삼항 연산자를 사용했는데요 아래 코드와 같다고 보시면 됩니다.

```javascript
if (user.id > maxId) {
  return user.id;
} else {
  return maxId
}
```

풀어 놓고 보니 훨씬 이해하기 쉽죠? 삼항연산자 코드도 익숙해 지면 굉장히 편리하답니다.

결국 `id` 상수에는 `users` 배열에 있는 `id` 값 중 가장 큰 값이 들어 들어갈 것입니다. 우리는 새로운 `id`를 만들 것이기 때문에 이 값보다 1 큰값으로 `id` 상수를 만들겠습니다. `reduce()` 함수 바로뒤에 `+ 1` 코드 보이시죠?

```javascript
const id = users.reduce((maxId, user) => {
   return user.id > maxId ? user.id : maxId
 }, 0) + 1;
```


### 배열에 유저 추가하기

새로운 아이디와 이름 값을 획득했으니 이를 이용해 새로운 유저를 만들어 보겠습니다. 객체 표현법으로 새로운 유저를 `newUser` 상수에 할당합니다.

```javascript
const newUser = {
  id: id,
  name: name
};
```

그리고 기존 `users` 배열에 새로운 유저를 추가합니다. 이로서 서버에 새로운 유저 데이터가 추가 되었습니다.

```javascript
users.push(newUser);
```


### 응답

마지막으로 서버는 요청한 클라이언트에게 응답을 보내야합니다. 어떤 데이터를 보내야할까요? 새로 만든 유저 데이터를 보내는 것이 합당해 보입니다. 그리고 또 한가지! 상태코드를 보내는데 "201 Created" 코드를 보내는 것이 REST API 형식을 따르는 것입니다. 이 둘을 코드로 표현하면 아래와 같죠.

```javascript
return res.status(201).json(newUser);
```

함수 체이닝을 이용해 한 줄로 간단히 작성했습니다.


### API 테스트

CURL을 이용해 API 테스트를 해보겠습니다.

```
curl -X POST '127.0.0.1:3000/users' -d "name=daniel" -v
*   Trying 127.0.0.1...
* Connected to 127.0.0.1 (127.0.0.1) port 3000 (#0)
> POST /users HTTP/1.1
> Host: 127.0.0.1:3000
> User-Agent: curl/7.43.0
> Accept: */*
> Content-Length: 11
> Content-Type: application/x-www-form-urlencoded
>
* upload completely sent off: 11 out of 11 bytes
< HTTP/1.1 201 Created
< X-Powered-By: Express
< Content-Type: application/json; charset=utf-8
< Content-Length: 24
< ETag: W/"18-SLbLW/4ZmHsU9Ou8ybsNBQ"
< Date: Wed, 14 Sep 2016 08:17:14 GMT
< Connection: keep-alive
<
* Connection #0 to host 127.0.0.1 left intact
{"id":4,"name":"daniel"}%
```

`-d` 옵션을 이용해 요청 바디를 보냈습니다. "daniel" 이란 이름의 유저를 생성하라고 요청한 것입니다. 201 상태코드가 응답되었고 새로운 id가 4인 유저객체가 응답되었습니다. 그럼 "GET /users/4"로 확인해 보겠습니다.

```
curl -X GET '127.0.0.1:3000/users/4'  -v
*   Trying 127.0.0.1...
* Connected to 127.0.0.1 (127.0.0.1) port 3000 (#0)
> GET /users/4 HTTP/1.1
> Host: 127.0.0.1:3000
> User-Agent: curl/7.43.0
> Accept: */*
>
< HTTP/1.1 200 OK
< X-Powered-By: Express
< Content-Type: application/json; charset=utf-8
< Content-Length: 24
< ETag: W/"18-SLbLW/4ZmHsU9Ou8ybsNBQ"
< Date: Wed, 14 Sep 2016 08:18:41 GMT
< Connection: keep-alive
<
* Connection #0 to host 127.0.0.1 left intact
{"id":4,"name":"daniel"}%
```

GET 요청으로 새로만든 id가 4인 유저를 조회할 수 있습니다. 제대로 동작합니다.


```
git checkout postUser
```


## Router

여기까지 잘 따라오셨습니다. 그런데 `app.js` 파일을 보면 거의 100줄이 되었습니다. 처음에 비해 코드가 많이 길어 졌는데요 이번에는 이 코드를 리펙토링 하는 것에 대해 알아보겠습니다.

"리펙토링"이란 코드의 기능은 그대로 유지하면서 가독성을 높이는 작업을 말하는 것입니다. 개발 전반에 걸쳐 리펙토링하는 것을 권장합니다.

"익스프레스는 크게 네 부분으로 나눌 수 있다"라고 한 것을 기억하세요?

* Application
* Request
* Response
* Router

처음 세 가지는 모두 설명했고 코드로 구현해 보았습니다. 마지막 라우터도 조금 다뤄 보긴했지만 여기서 좀더 자세히 살펴보도록 하겠습니다.


### 익스프레스의 Router

익스프레스 객체는 기본적으로 `get()`, `post()` 따위의 라우팅 설정 함수가 있습니다. 하지만 우리가 작성했던 방식으로 코드를 작성하게 되면 코드는 한 파일 안에서 길어지게 되고 결국 가독성이 떨어지게 될 겁니다. 익스프레스는 Router 클래스를 제공하는데요 이를 이용하면 라우팅 코드를 모듈화할 수 있습니다. 네 맞습니다. 노드의 모듈을 얘기하는 것이죠. 결국 라우팅 로직을 모듈화면 이를 `require()` 함수로 불러다 사용할 수 있는 장점이 있습니다.

간단히 라우팅 모듈을 제작하는 방법은 아래와 같습니다.

```javascript
const express = require('express');
const router = express.Router();

router.get('/users', (req, res) => {
  // ...
})

// delete, post ...

module.exports = router;
```

익스프레스 모듈의 `Router` 클래스로 객체를 만들어 `router` 상수에 할당합니다. 그리고 `router` 객체에서 제공하는 `get()`, `delete()`, `post()` 따위의 함수로 라우팅 로직을 구현합니다. 이것은 우리가 익스프레스 객체 `app`을 이용한 것과 매우 똑같습니다. 마지막으로 `moduel.epxorts`를 이용해 노드 모듈로 만들었습니다.


### User 라우팅 모듈 만들기

`api/users/index.js`에 라우팅 모듈을 만들어 보겠습니다. `app.js`에 있는 라우팅 코드 부분을 이쪽으로 옮깁니다. 그리고 `app` 상수를 모두 `router` 상수로 변경합니다. 바뀐 것은 이것 뿐입니다.

```javascript
const express = require('express');
const router = express.Router();
let users = [
  // ...
];

router.get('/users', (req, res) => {
  // ...
});

router.get('/users/:id', (req, res) => {
  // ...
});

router.delete('/users/:id', (req, res) => {
  // ...
});

router.post('/users', (req, res) => {
  // ...
});

module.exports = router;
```


### User 라우팅 모돌 사용하기

`app.js`에는 `user` 라우팅 코드가 없어졌습니다. 모두 `api/users/index.js` 파일로 모듈화 되어 이동되었기 때문이죠. 이제는 이 모듈을 `app.js`에서 불러와 사용해야 합니다. 자 여기서 중요한 것이 있습니다. 익스프레스 `Router` 클래스로 만든 User 모듈은 익스프레스의 미들웨어가 된 것입니다. 그렇기 때문에 익스프레스 객체 `app`은 `use()` 함수로 이 미들웨어를 사용할 수 있게 되었습니다. 아래 app.js 파일을 다시 보세요.

```javascript
app.use('/users', require('./api/user'));
```

간단하죠? 다른 미들웨어를 추가하는 것과 비슷합니다. 단 한가지 다른점은 파라매터가 두 개라는 것입니다. `use()`에서 파라매터를 두 개 사용하는 경우는 라우팅 모듈을 설정할때 그렇습니다. 위 코드의 의미는 "모든 리퀘스트중 경로가 '/users'로 시작되는 요청에 대해서는 두번째 파라매터로 오는 미들웨어가 담당하도록 한다" 입니다.

그러면 다시 `api/user` 모듈로 이동해 봅시다. `/users`로 들어오 요청에 대해 이제는 경로 앞부분의 "/users"는 제외한 하위 경로로 설정해 주어야 합니다. `api/user/index.js` 파일을 변경하면 다음과 같습니다.

```javascript
const express = require('express');
const router = express.Router();
let users = [
  // ...
];

router.get('/', (req, res) => {
  // ...
});

router.get('/:id', (req, res) => {
  // ...
});

router.delete('/:id', (req, res) => {
  // ...
});

router.post('/', (req, res) => {
  // ...
});
```

```
git checkout router1
```


### 라우팅 컨트롤러 만들기

`app.js`에서 `api/user/index.js` 로 코드를 이동하면서 코드의 가독성을 높였습니다. `app.js`에는 익스프레스 설정에 관련된 코드만 있고 `api` 폴더에는 각 리소스 별로 (여기에서는 user 뿐이지만) 라우팅 로직이 들어있기 때문입니다.

하지만 여기서 만족할 순 없습니다. 한번 더 리펙토링을 하겠습니다. `api/user/user.controller.js` 파일을 만드세요.

```javascript
exports.index = (req, res) => {
  // ...
};

exports.show = (req, res) => {
  // ...
};

exports.destroy = (req, res) => {
  // ...
};

exports.create = (req, res) => {
  // ...
};

```

`index()`, `show()`, `create()`, `destroy()` 라는 네 개 함수를 만들어 모듈로 만들었습니다. 이제 외부에서는 모듈을 `require()` 함수로 불러서 사용할 수 있습니다. 이 네 개의 함수는 네 개의 API와 연관된 것입니다.

* index(): GET /users
* show(): GET /users/:id
* delete(): DELETE /users/:id
* create(): POST /users

각 함수와 연결된 API의 로직. 그러니깐 `get()`, `delete()` 따위의 라우팅 함수 두번재 파라매터를 각각의 함수로 이동합니다. 그리고 이 컨트롤러 모듈을 `api/users/index.js` 파일에서 불러와 사용합니다.

```javascript
const controller = require('./user.controller');

router.get('/users', controller.index);

router.get('/users/:id', controller.show);

router.delete('/users/:id', controller.destroy);

router.post('/users', controller.create);
```

훨씬 간단해 졌죠?

지금까지 작성한 파일을 정리해 보면 다음과 같습니다.

* app.js: 익스프레스로 서버 설정 및 구동
* api/user/index.js: User API에 대한 라우팅 설정
* api/user/user.controller.js: User API에 대한 실제 로직

```
git checkout router2
```
