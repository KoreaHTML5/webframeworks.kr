---
layout : tutorials
title : ExpressJS에서 유닛테스트하기
category : tutorials
subcategory : test
summary : ExpressJS의 각 컴포넌트들을 테스트하는 방법을 알아본다.
permalink : /tutorials/expressjs/expressjs_test_code
title_background_color : DD1B16
title_color : FFFFFF
tags : javascript framework expressjs tutorials test
author : 6pack
---

# 익스프레스 테스트 코드 작성하기

개발을 진행하면서, 중요하지만 소홀해질 수 있는 부분이 바 테스트입니다. 이번 튜토리얼에서는 익스프레스 프레임워크에서 유닛 테스트 코드를 작성하는 방법에 대해서 알아보도록하겠습니다.

## 테스트 환경 셋팅하기
테스트를 진행하기 위해서는 일부 모듈의 설치와 셋팅을 진행해야합니다.

### 설치하기
유닛테스트를 진행하기 위해서는 테스트프레임워크 [Mocha.js](https://mochajs.org/) 와 검증라이브러리인 [Should.js](https://github.com/shouldjs/should.js)를 설치하도록 합니다. 
우선 테스트러너란 단어가 새로울 수 있을텐데, 테스트 러너란 작성되어있는 테스트 스크립트를 실행하는 존재로 보면 될 것 같다.
설치는 npm을 통해서 아주 쉽게 진행이 가능합니다. 

```
$ npm install --save-dev mocha should
```

### 테스트 실행 스크립트
노드 패키지 파일(package.json)에 아래와 같이 테스트만을 진행하기 위한 스크립트를 추가합니다.

{% highlight javascript %}
"scripts": {
  "start": "node ./bin/www",
  "test": "node_modules/mocha/bin/mocha $(find ./routes -name '*.spec.js') --recursive -w"
},
{% endhighlight %}

test 뒤에 _mocha_ 를 실행하는 부분이 있는데, routes 폴더 하위에 *.spec.js 을 인자로 받고 있는데,
이는 우리가 이제 routes 폴더 하위에 *.spec.js 파일명으로 유닛테스트 스펙을 작성할 것이기 때문입니다.
뒤에 인자로 w는 watch files for changes로 파일의 변화를 감지하겠다는 의미여며, recursive는 하위 디렉토리도 포함하겠다는 것이다.

위가 같이 노드 패키지파일을 수정하였다면 아래와 같이 실행함으로써 테스트가 가능해집니다.명령어를 실행하면 Mocha가 실행되면서 자동으로 테스트 유닛을 찾아 테스트를 수행합니다.
테스트가 종료되면 자바스크립트 파일의 변경사항을 감시하고 있다가 다시 테스트를 수행하도록 합니다.

```
$ npm test
```

## 테스트 유닛 작성과 MOCK
### 테스트 유닛 작성

익스프레스 명령어(express CLI) 로 생성된 라우팅 코드는 유닛테스트 하기에 적당하지 않기 때문에 우리는 routes/users.js 파일에서 라우팅 로직만 제거하여 이것을 app.js로 옮기겠습니다.

{% highlight javascript %}
/**
 * routes/users.js
*/
exports.index = function(req, res, next) {
  res.json([{
    name: 'Chris',
  }, {
    name: 'Sam'
  }]);
};
{% endhighlight %}

{% highlight javascript %}
// app.js
app.use('/users', users.index);
{% endhighlight %}

이렇게 분리한 routes/users.js 파일을 단위 테스트할 차례입니다. 동일한 폴더에 users.spec.js 파일을 만들고 이 안에 라우팅 로직을 위한 테스트 유닛을 작성 합니다.

{% highlight javascript %}
/**
* users.spec.js
*/
var should = require('should');
var users = require('./users');

describe('Users', function () {
  it('should return the statusCode 200', function () {
  });

  it('should return user array', function () {
  });
});

{% endhighlight %}

응답의 상태코드 200과 바디를 확인하는 코드입니다. 하지만 users.js 모듈의 index() 함수를
실행하려면 익스프레스의 Request객체와 Response 객체를 파라매터로 넘겨줘야 합니다.

### node-mocks-http.js

[node-mocks-http]() 모듈은 익스프레스 라우팅에 대한 목 객체를 제공해 줍니다. 우리는 이 모듈을 사용해서 index() 함수에 필요한
Request 객체와 Response 객체를 얻을 수 있습니다.

{% highlight javascript %}
var httpMocks = require('node-mocks-http');
req = httpMocks.createRequest();
res = httpMocks.createResponse();
{% endhighlight %}

테스트 유닛에 이 목 객체를 사용할 수 있습니다.

{% highlight javascript %}
it('should return the statusCode 200', function () {
  users.index(req, res);
  res.statusCode.should.be.equal(200);
});

it('should return user array', function () {
  users.index(req, res);
  JSON.parse(res._getData()).should.be.an.instanceOf(Array).and.have.a.lengthOf(2);
});
{% endhighlight %}




### Mock작업 (sinon.js)


서버에서 구현하는 API는 단순히 메모리상의 데이터를 다루는 것만 있는 것은 아닙니다.
사용자 계정 정보 등 영구적으로 저장할 데이터는 데이터베이스에 저장하게 되는데,
서버에 이 정보를 데이터베이스에서 조회한 뒤 API로 응답하는 경우가 빈번합니다.

노드에서 사용하는 ORM 라이브러리중 sequelize 모듈을 사용하여 MySql을 사용하는
API를 작성하면 아래와 같은 코드를 작성할 수 있습니다.

{% highlight javascript %}
// users.js
exports.show = function(req, res, next) {
  if (!req.params.name) return res.send(400);

  models.User.findOne({
    where: {name: req.params.name}
  }).then(function (user) {
    if (!user) return res.send(404);
    res.json(user);
  }, function (err) {
    res.send(500, err);
  });
};



// models.js
var Sequelize = require('sequelize');
var sequelize = new Sequelize();

exports.User = sequelize.define('User', {
  name: Sequelize.STRING
});
{% endhighlight %}




그럼 유닛 테스트를 위해 데이터베이스에 직접 자료를 넣어야 할까요?
그렇게 할 수도 있겠지만 시간이 많이 걸립니다. 왜냐하면 테스트를 위해 데이테베이스 컨넥션을 생성한 뒤
데이터를 입력하고 조회하는 시간이 상당하기 때문입니다. 게다가 이러한 API가 많아질수록 전체 테스트 시간은
늘어나게 됩니다.

그래서 목(Mock)을 사용해야 합니다. 데이터베이스 역할을 흉내낼 수 있는 가상의 것을 만들수 있습니다.

sinon.js 설치

```
$ npm install --save-dev sinon.js
```






Mock

데이터베이스를 사용하는 show() 함수를 테스트 하기 위해 목 데이터베이스를 만들어야 합니다.
정확이 얘기하면 데이터베이스의 특정 행동을 흉내내는 기능을 만듭니다.

show() 함수를 호출하면 Sequelize 라이브러리의 User.findOne() 함수가 호출됩니다.
sinon 모듈을 이용해 이 함수를 흉내낼 수 있습니다.

{% highlight javascript %}
var sinon = require('sinon');

sinon.stub(models.User, 'findOne').returns({
  then: function (fn) {
    fn({name: 'Chris'});
  }
});
{% endhighlight %}






테스트를 진행할 때 modles.User 객체의 findOne() 함수가 호출될 때 then 함수가 포함된
오브객체를 반환하도록 하였습니다. 이것은 findOne() 함수가 프라미스(promise)를 반환하기 때문입니다.

Mock을 사용한 테스트 코드

위에서 만든 Mock을 사용하여 show() 함수의 테스트 코드를 작성할 수 있습니다.
before()에서 Mock을 구현하고 각 테스트 유닛에서는 그 결과를 검증합니다.

{% highlight javascript %}
describe('.show()', function () {
  before(function () {
    sinon.stub(models.User, 'findOne').returns({
      then: function (fn) {
        fn({name: 'Chris'});
      }
    });
  });

  it('should return the statusCode 200', function () {
    req.params.name = 'Chris';
    users.show(req, res);
    res.statusCode.should.be.equal(200);
  });

  it('should return the statusCode 400 if no name', function () {
    delete req.params.name;
    users.show(req, res);
    res.statusCode.should.be.equal(400);
  });

  it('should return a user', function () {
    req.params.name = 'Chris';
    users.show(req, res);
    JSON.parse(res._getData()).should.be.instanceOf(Object).and.have.a.property('name');
  });
});
{% endhighlight %}