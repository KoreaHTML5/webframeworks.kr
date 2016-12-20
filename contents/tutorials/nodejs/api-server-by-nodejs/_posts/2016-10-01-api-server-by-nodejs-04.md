---
layout : tutorials
title : NodeJS를 이용한 API 서버만들기 4
category : tutorials
subcategory : data-query
summary : NodeJS를 이용한 REST API 서버 개발을 시작할 수 있다. ExpressJS, Sequelize로 기본 골격을 잡는 것부터 Mocha, Supertest로 유닛테스트하는 방법까지 설명한다. 이 글은 지난 코드랩 진행했던 내용과 유사하다.
permalink : /tutorials/nodejs/api-server-by-nodejs-04
title_background_color : 026E00
title_color : FFFFFF
tags : javascript framework ExpressJS JS tutorial NodeJS Sequelize Mocha Supertest UnitTest
author : 6pack
---

## 테스트

저는 개인적으로 서버 개발시에 테스트를 비교적 중요하게 생각합니다. 기능 개발에 코드를 작성하는 것 만큼이나 테스트를 위한 코드도 작성해야한다고 생각하고 그러한 테스트코드를 작성하는 것이 결코 시간 낭비라고 생각하지 않습니다.

만약 프로젝트가 한번 개발하고 끝나버리는 것이라면 테스트 코드를 작성하는 것에 대한 의문을 제기할수 있을지도 모릅니다. 하지만 대부분의 프로젝트는 개발 후 운영, 추가 개발이라는 형태로 계속 진행됩니다. 개발자는 버그가 있다면 기존의 코드를 변경해야 하고 새로운 기능이 있다면 기존 코드와 함께 동작하는 코드를 작성해야 합니다. 이러한 과정에서 테스트 코드는 개발자로 하여금 코드에 대한 확인을 갖게 해줍니다.

이번 시간에는 테스트 코드 작성법에 대해서 알아보도록 하겠습니다.

## Mocha

노드에서 가장 유명한 테스트 툴은 모카입니다. 모카는 정확히 얘기하면 테스트 코드를 구동시켜주는 테스트 러너(Test runner)라고 할 수 있습니다. 모카 역시 노드로 작성된 패키지 중 하나이므로 npm을 통해 우리 프로젝트에 추가할 수 있습니다.

```
npm i mocha --save-dev
```

Npm 사용법이 조금 달라진걸 눈치 채셨나요? `--save-dev` 옵션을 추가했습니다. 이것은 개발 환경을 위한 패키지 의존성을 설정하기 위한 것인데 명령문을 실행하고 나면 package.json 파일의 `devDependecies` 속성에 모카 설치 정보가 추가 됩니다.

자 이제 package.json 파일에서 dependecies와 devDependencies 속성이 무엇인지에 대해 털어놔야 할때가 온것 같네요.


### 패키지 파일의 의존성에 대해

Npm은 프로젝트에 사용하는 노드 패키지 모듈들을 모두 package.json 파일에 기록합니다. 대부분은 dependencies 속성에 패키지 명과 버전정보가 기록됩니다. 서버에 코드를 배포한뒤 서버에서 `npm install --production` 으로 노드 패키지를 설치하게 되는데 이때 노드는 package.json 파일의 dependencies 속성을 참고해서 여기에 있는 것들을 설치합니다.

그럼 devDependencies는 언제 사용할까요? 이것은 순전히 개발자를 위한 정보입니다. 코드를 서버에 배포하지 않고 다른 개발자가 이 코드를 코드 저장소에서 다운로드했다고 칩시다. 개발자는 `npm install` 로 필요한 노드 패키지를 설치합니다. 이때 노드는 똑같이 dependencies 속성에 있는 패키지들을 설치합니다. 그리고 --production 옵션이 없기 때문에 devDependencies 속성에 있는 패키지들도 추가로 설치하는 것입니다.

다시 모카로 돌아옵시다.

테스트 코드는 **테스트 수트(suite)** 와 **테스트(test)** 로 구분할 수 있는데요 수트는 테스트들을 모아놓은 하나의 환경이라고 보시면되고 테스트가 실제 테스트를 수행하는 코드입니다. 모카에서는 각 각 `describe()`과 `it()` 함수로 기능을 제공합니다.

* `describe()`: 테스트 수트
* `it()`: 테스트

두 함수를 이용하여 테스트코드를 작성해 보겠습니다. User API에 대한 테스트 코드는 `api/user/user.spec.js` 파일에 작성하겠습니다. 보통 파일명에 "spec"이란 문자열이 들어가면 테스트 코드입니다. 테스트 코드 자체가 테스트 대상의 명세서(Specification)이 되기 때문에 그렇게 부르는 것이지요. 아래 테스트 코드를 가벼운 마음으로 읽어 보세요.

```javascript
describe('GET /users', () => {
  it('should return 200 status code', () => {
    console.log('test 1');
  });
});
```

모카로 작성한 테스트 코드는 기본적으로 이러한 구조를 갖습니다. `describe()` 함수의 첫번째 파라매터로 테스트 수트의 설명을 서술형 문자열로 넣습니다. 그리고 두번째 파라매터로 함수를 입력합니다. 비동기 로직의 콜백 형식으로 넣는 것이죠. 그 안에는 `it()` 함수를 이용해 실제 테스트 코드를 작성합니다.

이제 테스트를 실행해 보죠. 설치한 모카 패키지는 `node_modules` 폴더 있습니다. Npm은 패키지 중에 실행파일이 있는 경우 모두 `node_modules/.bin` 폴더에 링크된 파일이 위치합니다. 여기에 저장된 `mocha` 명령어를 이용해서 테스트를 실행해 보죠.

```
node_modules/.bin/mocha api/user/user.spec.js
GET /users
test 1
```

`npm start`를 사용했던것 처럼 `npm test`에 대한 스크립트를 package.json에 추가해서 테스트 명령어를 간편하게 합니다.

```json
{
  "scripts": {
    "test": "node_modules/.bin/mocha api/user/user.spec.js"
  }
}
```

## Should

테스트 러너인 모카를 이용해서 테스트를 실행했습니다. 이번에 추가할 것은 검증 로직입니다. `describe()`, `it()`을 이용해서 테스트를 작성했지만 진짜 테스트 코드는 아직 없죠. 노드 기본 모듈중 assert 모듈을 이용해 보죠.

```javascript
const assert = require('assert');
describe('GET /users', () => {
  it('should return 200 status code', () => {
    assert.equal(true, false)
  });
});
```

assert 모듈의 `equal()` 함수는 두 개의 파라매터를 받는데 두 값이 같은 경우 지나가고 그렇지 않을 경우 에러를 던집니다. npm test를 이용해 테스트를 실행해 봅시다.

```
npm test
1) GET /users should return 200 status code:

      AssertionError: true == false
      + expected - actual

      -true
      +false
```

`assert.equal()` 실행결과 에러를 던지면서 모카에서는 위와 같은 결과를 리포팅 합니다. 만약 테스트가 통과한다면 성공 메세지를 보여주겠죠.

```
npm test
  GET /users
    ✓ should return 200 status code
```

`describe()`, `it()` 함수에서 첫번째 파라매터로 넣은 문자열이 구조에 맞게 출력되었습니다. 이 문자열을 제대로 작성한다면 코드에 대한 명세서 기능을 할 수도 있을 것 같지 않나요?

Assert는 노드 기본 모듈이긴 하지만 테스트에서는 이것 말고 다른 모듈을 사용하라고 얘기합니다. 노드 공식 페이지에서 그렇게 얘기하고 있어요. 가장 많이 사용하는 모듈중 하나가 "Should" 입니다. 이것은 서술식의 검증을 코드로 작성할 수 있게 해줍니다. 마치 글을 쓰는 것 처럼요. 물론 영어이지만 말이죠.

```
npm i should --save-dev
```

```javascript
const should = require('should');
describe('GET /users', () => {
  it('should return 200 status code', () => {
    (true).should.be.equal(true)
  });
});
```


## Supertest

마지막으로 API 테스트를 가능하게 해주는 노드 패키지가 있는데 바로 **Supertest** 입니다. Supertest는 우리가 만든 익스프레스 서버를 구동한 뒤 HTTP 요청을 보내고 응답받는 구조인데 이 응답을 should로 검증하면 되는 것입니다.

Supertest를 설치합니다.

```
npm i supertest --save-dev
```

Supertest를 사용하려면 서버 역할을 하는 익스프레스 객체를 가져와야 합니다. Supertest의 실행 함수 파라매터로 사용하기 위해서죠. app.js파일에서 우리가 만든 `app` 변수를 외부 노출하여 모듈로 만들어 줘야하는데 `module.exporets` 키워드로 `app`을 노출해 주면 됩니다.

```javascript
//...

module.exports = app;
```

이제 테스트 파일인 api/user/user.spec.js 파일에서 이 모듈을 가져와 슈퍼테스트와 결합해 사용해 보겠습니다.

```javascript
const should = require('should');
const request = require('supertest');
const app = require('../../app');

describe('GET /users', () => {
  it('should return 200 status code', (done) => {
    request(app)
        .get('/users')
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          done();
        })
  });
});
```

`request` 상수에 슈퍼테스트 모듈을 할당 했습니다. 그리고 app 모듈을 `request()` 함수의 파라메터로 넣었는데 이것은 우리가 만든 익스프레스 서버인 app을 슈퍼테스트로 테스트하겠다는 의도입니다.

슈퍼테스트는 함수 체이닝을 이용해 `get()` 함수로 API 요청을 보냅니다. `expect()` 함수로 응답 코드를 설정한 뒤 실제 요청을 보내고 응답되면 `end()` 함수에 파라매터로 넣은 콜백 함수가 동작하게 되는 구조입니다. 이 콜백함수는 `err`와 `res` 두 개 파라매터를 받는데 요청에 실패하면 `err` 객체가 활성화되고 그렇지 않으면 `res.body`를 통해 응답 바디에 접근할 수 있습니다. 여기서는 API가 상태코드 200을 리턴하는가만 체크하는 코드입니다.

그리고 마지막에 `done()` 함수를 호출했습니다. 이것은 `it()` 함수의 두번째 파라매터인 콜백함수의 파라매터인데 슈퍼테스트가 HTTP 요청을 하는 비동기 로직이기 때문에 모카측에서 `it()` 함수가 종료되는 시점을 알기위해 사용되는 함수입니다.

이번에는 바디를 점검하는 코드를 작성해 보지요.

```javascript
const should = require('should');
const request = require('supertest');
const app = require('../../app');

describe('GET /users', () => {
  it('should return 200 status code', (done) => {
    // ...
  });

  it('should return array', (done) => {
    request(app)
        .get('/users')
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          res.body.should.be.an.instanceof(Array).and.have.length(3);
          res.body.map(user => {
            user.should.have.properties('id', 'name');
            user.id.should.be.a.Number();
            user.name.should.be.a.String();
         });
         done();
       });
  });
});
```

`should.be.an.instanceof()` 함수를 이용해 응답 바디의 타입이 배열인지 체크했습니다. 그리고 함수 체이닝을 이용해 배열의 길이가 3인것을 확인했습니다.

그 다음 코드는 `res.body`가 배열임을 확인했으므로 배열 메소드인 `map()`을 이용해 배열의 각 요소를 점검합니다. 배열의 요소 `user`는 `id`와 `name` 프로퍼티를 가지고 있고 각 각 숫자형, 문장형임을 확인했습니다.

모든 검증을 마치면 모카에게 `it()` 함수가 종료됨을 의미하는 `done()` 함수를 호출하고 테스트를 종료합니다.

이것은 테스트코드의 시작에 불과합니다. 지금가지 작성한 모든 API에 대한 테스트 코드를 작성해 봅시다.

```
git checkout unitTest
git checkout unitTest2
git checkout unitTest3
git checkout unitTest4
```
