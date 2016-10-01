---
layout : tutorials
title : NodeJS를 이용한 API 서버만들기 5
category : tutorials
summary : NodeJS를 이용한 REST API 서버 개발을 시작할 수 있다. ExpressJS, Sequelize로 기본 골격을 잡는 것부터 Mocha, Supertest로 유닛테스트하는 방법까지 설명한다. 이 글은 지난 코드랩 진행했던 내용과 유사하다.
permalink : /tutorials/nodejs/api-server-by-nodejs-05
title_background_color : 026E00
title_color : FFFFFF
tags : javascript framework ExpressJS JS tutorial NodeJS Sequelize Mocha Supertest UnitTest
author : 6pack
---

## 데이터베이스 연동

자 드디어 데이터베이스를 붙일 차례가 왔습니다. 벡엔드 구조에 대해 설명한 부분을 기억할수 있겠어요? 바로 이 모습.

```
┌───────┐               ┌───────┐                ┌────────┐
│Client │ -- (HTTP) --> │Server │ -- (Query) --> │Database│
└───────┘	              └───────┘                └────────┘
```

지금까지 했던 작업을 Client, Server, Database 중에 Sever 부분을 만들었습니다. Client에서 요청하는 것은 CURL을 사용하거나 모카 테스트로 진행했구요.

남은 것은 가장 오른쪽에 있는 Database 부분입니다. 벡엔드에서 데이터베이스를 직접 만드는 것은 아닙니다. 다양한 데이터베이스 프로그램이 있는데 그중 MySQL을 사용할 것입니다. MySQL을 우리 컴퓨터에 개발용으로 설치하고 Server에서는 단지 데이터베이스에 연결하는 것입니다.


## MySQL

그럼 우선 MySQL을 내 컴퓨터에 설치해야합니다. OSX에서 MySQL을 설치하는 방벙은 간단합니다. Homebrew를 이용하는 것입니다. Homebrew는 OSX용 패키지 관리 툴입니다. 리눅스의 APM, YUM 같은 툴이죠.

```
brew install mysql
```

Homebrew가 없다면 아래 명령어로 Homebrew 부터 설치하세요. ([참고](http://brew.sh/)))

```
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

MySql을 설치한 뒤 서버를 구동해야합니다. MySQL 서버를 데몬이라고도 하는데 리눅스에서 말하는 "데몬", 혹은 "서비스"와 같은 것입니다. 서버에서 백그라운드에서 실행중인 프로세스를 데몬이라고 합니다. 로컬에서도 개발용으로 MySQL 데몬을 실행해야 합니다. 방법은 간단합니다. 설치한 mysql 명령어를 이용합니다.

```
mysql.server start
```

반대로 서버를 종료할때는 stop 명령어를 사용합니다.

```
mysql.server stop
```

MySQL 서버를 로컬 컴퓨터에 구동했다면 이제 구동중인 MySQL 서버에 접속해 봐야합니다. 역시 mysql 명령어로 접속합니다.

```
mysql -u root -h localhost -p
```

mysql 명령어의 -u 옵션은 서버 접속 계정을 넣을때 사용하는데 기본 값인 root를 사용했습니다. -h 옵션은 서버 접속 주소를 설정하는 옵션인데 우리는 로컬 컴퓨터에 구동중인 mysql 서버에 접속하므로 localhost를 사용했습니다. 마지막 -p 옵션을 비밀번호를 입력하기 위한 기능입니다. 위 명령어를 실행하면 비밀번호를 입력하도록 하는데 root를 입력하고 접속합니다. 그럼 다음과 같이 mysql 프롬프트로 진입합니다.

```
mysql>
```

간단한 명령어를 보겠습니다. msyql 서버에 있는 데이터베이스 목록을 조회하려면 다음 명령어를 실행해 보세요.

```
mysql> SHOW DATABASES;
```

우리는 node_api_codelab 이란 데이터베이스를 만들건데요 먼저 이 이름으로 데이터베이스를 하나 생성하겠습니다. mysql 프로프트에서 명령어를 입력할때 마지막에 반드시 세미콜론(;)를 추가해야합니다. 그래야만 mysql은 하나의 명령문인 것을 인지하고 실행할 수 있습니다.

```
mysql> CREATE DATABASE node_api_codelab;
```

하나 만들었으면 이제 다시 `SHOW DATABASES;` 로 방금 만든 데이터베이스를 확인합니다. 그리고 이 데이베이스를 선택합니다. 생성한 데이터베이스를 선택할 때는 `USE` 명령어를 사용합니다.

```
mysql> USE node_api_codelab;
```

MySQL 데이터베이스 안에는 테이블이 있습니다. 이 테이블 안에 실제 데이터가 저장되는 것이죠. 우리는 API를 만들때 User에 대한 API들을 만들었습니다. User를 생성하는 API를 만들 때를 떠올려 보세요. 우리는 id와 name이라는 것을 만들었었죠. 이제 user 테이블을 만들어 보겠습니다.

아니요. 여기서부터는 mysql 명령어를 사용하지 않아도 됩니다. 노드 코드 작성하는것도 버거운데 mysql 코드를 작성한다는 것은 쉬운 일이 아니죠.


## Sequelize

노드 코드에서 MySql에 접속해서 이런 저런 쿼리문을 실행할 때는 노드 코드로 만든 mysql 패키지가 필요합니다. 그것이 node-mysql입니다. 이것을 우리 프로젝트에 추가해서 쿼리문을 직접 실행시킬수 있죠. 방금 했던것 처럼 `CREATE TABLE Users;` 같은 명령문을 말이죠. 하지만 여전히 쿼리문을 작성한다는 것은 지금은 버거운 일이에요. 그렇죠?

그래서 나온것이 **ORM(Object Relational Mapping)** 이라는 것입니다. ORM을 사용하게 되면 쿼리문을 모르더라도 자신이 사용하는 프로그래밍 언어로 데이터베이스에 명령을 내릴수 있습니다. 노드에는 Sequelize 라는 ORM 라이브러리가 있습니다.

npm으로 Sequelize 를 먼저 설치해 보죠.

```
npm i Sequelize --save
```


## Model

모델이라는 용어를 들어 보셨나요? 서버에서 하나의 자원을 정의할 때 그것을 모델이라고 합니다. 우리는 지금까지 User 라는 자원을 사용했습니다. 이것이 User 모델입니다. 모델은 데이터베이스의 테이블과 1:1 매칭된다고 보시면 됩니다. 그러면 데이터베이스에 User 테이블이 있어야 합니다. User 테이블을 만들기 위해, 다시 말하면 User 모델을 만들기위해 Sequelize의 도움을 받아야합니다.

모델을 만드는 역할을 하는 `models.js` 파일을 만들어 봅니다.

```javascript
const Sequelize = require('sequelize');
const sequelize = new Sequelize('node_api_codelab', 'root', 'root')
```

sequelize 모듈을 가져와 `Sequelize` 상수에 할당했습니다. 그다음엔 Sequelize 객체를 하나 만들어 `sequelize` 상수에 할당했습니다. Sequelize 객체를 만들 때는 세 개의 파라매터가 필요한데 데이터베이스 이름, 접속 계정명, 비밀번호 순입니다. 순서대로 문자열로 파라매터를 넘겨주면 sequelize 객체를 얻을수 있습니다. 이 객체가 제공하는 메소드 중 `define()` 함수를 이용해 모델을 만들수 있습니다. 그럼 User 모델을 만들어 봅시다.

```javascript
const User = sequelize.define('user', {
  name: Sequelize.STRING
});
```

`define()` 함수의 첫번째 파라메터가 데이터베이이스에 만들어질 테이블 이름입니다.

그 다음에는 테이블의 세부사항을 객체 형식으로 정의 합니다. 이전에 유저 객체에는 id와 name이 있었는데요 그 둘을 여기서 정의하면 됩니다. `name: Sequelize.STRING` 은 name 컬럼을 정의하는 코드입니다.` Sequelize.STRING` 상수를 이용해 name 값이 문자열임을 정의했습니다. 그럼 id는 어디에 있을까요? 고맙게도 Sequelize는 기본적으로 id를 만들어 줍니다.

게다가 createdAt, updatedAt 이라는 컬럼도 자동으로 만들어 줍니다. 이 컬럼들의 역할은.... 알것같죠? 테이블안에 데이터를 로우(row)라고 하는데 로우가 생성될때 마다 createAt에 타임 정보가 기록됩니다. 그리고 로우가 변경될 때마다 updatedAt 컬럼값이 변경되구요. Sequelize를 사용하면 많이 사용되는 컬럼들에 대해서도 자동으로 만들어주는 편리함이 있습니다.

마지막으로 `models.js` 도 어디선가 불러져서 사용해야합니다. 그러면 당연히 모듈로 만들어야 하겠죠. `moduele.exports` 키워드를 이용해 모듈로 만들어 보겠습니다.

```javascript
moduele.exports = {
  sequelize: sequelize,
  User: User
}
```

두 개 객체를 외부로 노출했습니다. 방금 정의한 User 모델과 디비가 연결된 sequelize 객체입니다.


## DB Sync

sequelize 객체가 제공하는 메소드 중에는 모델을 정의하는 `define()` 외에도 `sync()` 라는 메소드가 있습니다. 이 함수를 실행하면 sequelize 객체에 연결된 데이터베스에 우리가 정의한 모델들을 테이블로 생성하는 기능입니다. 이러한 작업은 서버가 구동될때 딱 한번만 호출되면 됩니다. 그래서 서버의 시작점인 `app.js`에 만들겠습니다.

```javascript
app.listen(3000, () => {
  console.log('Example app listening on port 3000!');

  require('./models').sequelize.sync({force: true})
      .then(() => {
        console.log('Databases sync');
      });
});
```

`app.listen()`으로 서버가 구동된 다음에 콜백함수가 동작하면 'Example app listening on port 3000!' 라는 메세지를 콘솔에 출력하게 됩니다.

그리고 나서 방금 만들었던 models 모듈의  sequelize객체를 가져와서 `sync()` 함수를 실행합니다. 데이터베이스에 테이블을 만들기 위해서죠.

그런데 `sync()` 함수에 `{force: true}` 옵션을 넘겨주었습니다. force라는 속성에는 불리언 데이터를 설정할 수 있는데 true일 경우 `sync()` 함수가 실행되면 무조건 테이블을 새로 만드는 옵션입니다. 반대로 force 값이 false 일 경우에는 데이터베이스에 테이블이 있을 경우 다시 만들지 않는 기능입니다. 지금은 개발용이기 때문에 `{force: true}`를 설정했지만 실제 운영중인 서버라면은 반드시 `{force: false}` 옵션으로 실행해야하겠죠.

npm start로 서버를 구동하면 데이터베이스에 테이블이 생성됩니다. 이제 mysql 프롬프트에서 확인해 보겠습니다.

```
mysql> SHOW TABLES;
+----------------------------+
| Tables_in_node_api_codelab |
+----------------------------+
| users                      |
+----------------------------+
1 row in set (0.00 sec)
```

방금 만들었던 users 테이블이 생겼습니다. 그런데 이상합니다. `define()` 함수로 테이블명을 user로 했는데 여기는 복수형인 users가 되었습니다. 이것도 sequelzie 에서 자동으로 변환해서 만들어준 것입니다. 왜냐하면 테이블 안에는 여러 user 정보가 있기때문에 그런 것 같습니다.

테이블 정보도 확인해 보지요.

```
mysql> describe users;
+-----------+--------------+------+-----+---------+----------------+
| Field     | Type         | Null | Key | Default | Extra          |
+-----------+--------------+------+-----+---------+----------------+
| id        | int(11)      | NO   | PRI | NULL    | auto_increment |
| name      | varchar(255) | YES  |     | NULL    |                |
| createdAt | datetime     | NO   |     | NULL    |                |
| updatedAt | datetime     | NO   |     | NULL    |                |
+-----------+--------------+------+-----+---------+----------------+
4 rows in set (0.01 sec)
```

id 값은 sequelize가 자동으로 생성한 컬럼입니다. 프라이머리 키로 설정되어 로우가 생성될때마다 자동으로 id값이 증가됩니다.

name은 우리가 정의한 컬럼입니다. sequelize.STRING 값으로 정의했는데 varchar(255)로 설정된것을 확인하세요.

그리고 createdAt과 updateAt도 sequelize가 자동으로 만들어준 컬럼입니다. datetime 형식으로 되어 있네요.

```
git checkout sequelizeModel
```


## 컨트롤러에 데이터베이스 연동

Sequelize로 로컬에 구동중인 데이터베이스와 API 서버를 연결했습니다. 그리고 우리가 모델링한 테이블까지 데이터베이스 안에 만들었구요.

이제는 이 테이블에 데이터를 넣거나 조회하거나 삭제 그리고 업데이트하는 작업을 할 차례입니다. 이것은 CRUD 기능이라고 합니다. Create, Read, Update, Delete 기능을 얘기하는 것이지요. API의 기능이 이 데이터베이스의 데이터를 CRUD하는 것이라 보면 됩니다. 지금까지는 데이터를 users 배열에 넣어놓고 개발했는데 이제는 이것을 던져버리고 진짜 데이터베이스에 데이터를 사용합니다.


## Create

먼저 user 컨트롤러에서 models를 가져옵니다.

```javascript
const models = require('../../models');
```

테이블이 아직은 비어있기 때문에 먼저 테이블에 데이터를 넣는 `create()` 함수부터 건드려 보겠습니다.

```javascript
exports.create = (req, res) => {
  const name = req.body.name || '';
  if (!name.length) {
    return res.status(400).json({error: 'Incorrenct name'});
  }

  models.User.create({
    name: name
  }).then((user) => res.status(201).json(user))
};
```

name 파라매터를 검증하는 부분까지는 이전 코드와 같습니다. name 값이 확보되었다면 models 모듈을 이용해 테이블에 데이터를 추가하는 것이 남았습니다. `models.User` 객체는 CRUD에 해당하는 메소드 들을 제공하는데요 그중 `create()` 메소드는 테이블에 데이터를 추가하는 기능을 합니다. 파라매터로 넣은 데이터를 객체 형식으로 넘겨줍니다. name 컬럼에 name 상수값을 넣어줬습니다. 그리고 then함수가 동작하면 콜백함수의 user 파라매터로 테이블에 생성된 로우가 나옵니다. 이것을 요청한 클라이언트에 그대로 전달해 주면됩니다.


## Read

데이터를 조회하는 API 컨트롤러는 `index()`, `show()` 메소드가 있습니다.

`index()`는 모든 사용자 목록을 조회하는 것이기 때문에 테이블 전체데이터를 불러와야합니다.  `models.User` 객체의 `findAll()` 메소드를 사용하면 테이블의 전체 데이터를 불러올 수 있습니다.

```javascript
exports.index = (req, res) => {
  models.User.findAll()
      .then(users => res.json(users));
};
```

`show()`는 특정 사용자를 id로 조회하는 역할을 합니다. `models.User` 모델은 `findOne()` 함수로 조건을 줘서 데이터를 조회합니다. where라는 부분에 id 컬럼의 조건값을 설정하여 넘겨줍니다. 함수가 실행되면 콜백함수의 파라매터로 조회한 user 객체가 응답됩니다. 만약 user 값이 비어있다면 테이블에서 id에 해당하는 데이터를 찾지 못한 것입니다. 이 경우 404 상태코드로 응답합니다. 성공한경우에는 `json()` 함수로 응답해 줍니다.

```javascript
exports.show = (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!id) {
    return res.status(400).json({error: 'Incorrect id'});
  }

  models.User.findOne({
    where: {
      id: id
    }
  }).then(user => {
    if (!user) {
      return res.status(404).json({error: 'No User'});
    }

    return res.json(user);
  });
};
```


## Delete

삭제할때는 `destroy()` 메소드를 사용합니다. id 기준으로 삭제하는 것이므로 where를 이용해 파라매터를 넘겨 줍니다.

```javascript
exports.destroy = (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!id) {
    return res.status(400).json({error: 'Incorrect id'});
  }

  models.User.destroy({
    where: {
      id: id
    }
  }).then(() => res.status(204).send());
};
```

---
아래부터는 스킵

## Update

마지막 남은 것인 update 기능인데요 이것은 좀 특별하게 하려고 뒤로 미루었습니다. 테스트 코드를 먼저 작성하고 컨트롤러 함수를 만들것입니다. 잘 보세요. 이렇게 코딩하는 방법을 tdd 개발방법론이라고 한답니다. 테스트 코드를 api/user/user.spec.js에 추가해 볼께요

```javascript
describe('PUT /users/:id', () => {
  it.only('should return 200 status code', (done) => {
    request(app)
        .put('/users/1')
        .send({
          name: 'foo'
        })
        .end((err, res) => {
          if (err) throw err;
          done();
        });
  });
});
```

업데이트 api를 호출하면 200 상태 코드가 응답되는지 체크하는 코드입니다. 테스트를 돌려보면 당연히 실패가 나오겠죠?

```
npm test
.. 실패화면 ...
```

404 에러 메세지가 나오네요. 라우팅 설정을 하지 않았기 때문이죠. 그럼 이 테스트를 통과할수 있도록 코드를 추가해 보겠습니다. 먼저 api/user/index.js 파일에 해당 api에 대한 라우팅 설정을 추가합니다.

```javascript
router.put('/:id', controller.update);
```

PUT /users/:id 로 요청이 들어올 경우 update 컨트롤러 함수가 동작하도록 설정했습니다. api/user/user.controller.js 파일로 이동하고 update 함수를 정의합니다.

```javascript
exports.update = (req, res) => {
  res.send();
}
```

update() 함수에서는 요청이 들어오면 send() 함수를 이용해 200 상태코드만 응답하도록 변경하였습니다. 그리고나서 다시 테스트를 돌려보면 테스트에 통과합니다.

```
npm test
... 성공 ...
```

put api 에 200 성공코드가 응답괴었습니다.

```
git checkout sequelizeInCtrl
```


## 환경의 분리

서버가 실행되는 모드를 몇 개 정의해야할 것 같습니다. 무슨 말이냐고요? 이건 테스트 때문입니다. 아직 테스트에 디비를 붙이지는 않았지만 곧 테스트에 디비를 붙일 것입니다. 하지만 테스트할때 디비를 붙이게 되면 데이터베이스에 테스트에서 사용한 데이터들이 쌓이게 됩니다. 따라서 테스트용 데이터베이스가 따로 있어야하는데 이것을 위해 서버 환경을 분리 하겠습니다.

 우리는 세가지 모드를 사용할 것입니다.

* development
* test
* production

"development"는 개발 모드입니다. 우리가 지금까지 사용했던 환경이죠. "test"는 테스트 환경을 의합니다. 마지막 "production"은 운영 모드입니다. 실제로 코드가 서버로 배포되어 동작는 환경을 의미하죠.

이러한 환경 정보는 `NODE_ENV`라는 환경 변수에 설정하여 사용할 수 있습니다. 노드 코드에서는 `process.env.NODE_ENV` 라는 변수를 통해 접근할 수 있습니다.

테스트 환경과 개발환경을 분리하기 위해서 `config/environment.js` 파일을 만들겠습니다.

```javascript
const environments = {
  development: {
    mysql: {
      username: 'root',
      password: 'root',
      database: 'node_api_codelab_dev'
    }
  },

  test: {
    mysql: {
      username: 'root',
      password: 'root',
      database: 'node_api_codelab_test'
    }
  },

  production: {

  }
}

const nodeEnv = process.env.NODE_ENV || 'development';

module.exports = environments[nodeEnv];
```

`environments` 라는 변수를 두어 각 환경 이름에 해당하는 키를 만들었습니다. 그리고 `nodeEnv`라는 상수에 노드 환경변수 값을 할당했습니다. 노드를 실행하기 전에 "NODE_ENV=test" 라고 실행하면 이값에 "test"라는 문자열이 들어갑니다. 만약 아무것도 설정하지 않으면 "development" 문자열이 들어가게될 것입니다. 마지막으로 `environments` 객체에서 노드 환경변수에 해당하는 부분의 객체를 반환하는 모듈로 만들었습니다.

```
git checkout env
```


## 테스트에 데이터베이스 연동하기

Environment 모듈을 사용하여 기존코드를 변경해야합니다. Envrionemnt에는 데이터베이스 접속정보가 있는데이 부분은 models.js 파일을 수정하면됩니다. 아래 코드처럼 말이죠.

```javascript
const config = require('./config/environments');
const sequelize = new sequelize(
  config.mysql.database,
  config.mysql.username,
  config.mysql.password
)
```

environments 모듈은 NODE_ENV 환경변수 값에 따라 각각 다른 데이터베이스로 연결합니다.

그럼 api/user/user.spec.js 테스트 코드로 돌아가 봅시다. 모카에는 `before()`/`after()` 함수가 있습니다. 이것은 테스트가 실행되기 전/후에 각각 한 번씩 실행되는 함수입니다. `before()` 함수를 이용해 테스트 데이터베이스를 초기화하는 등의 테스트 환경을 만들어 줄수 있습니다. 아래 코드를 한 번 보세요.

```javascript
describe('GET /users', () => {
  before('sync database', () => {
    // sync data base ...
  });
  it('should return 200 status code', () => {
    //
  });
});
```

`it()` 함수가 실행되기 직전 `before()` 함수가 먼저 실행됩니다. `before()` 함수에서는 데이터베이스를 초기화할 수 있는 `sync({force: true})` 함수를 실행하면 되겠지요.


## sync-database 모듈

한편 app.js에서 `sync()` 함수를 사용하고 있는데 이것을 테스트에서도 따로 떼어 내기 위해서는 데이터를 싱크할수 있는 별도의 모듈로 떼어네는 것이 편리합니다.

bin/sync-databse.js 파일로 만들어 보겠습니다.

```javascript
const models = require('../models');

module.exports = () => {
  return models.sequelize.sync({force: true});
};
```

이 모듈은 데이터베이스를 싱크하는 매우 간단한 코드입니다.


## www.js

이참에 서버 구동하는 모듈도 별도로 만들어보지요. bin/www.js 파일을 만들어 보세요.

```javascript
const app = require('../app');
const port = 3000;
const syncDatabase = require('./sync-database');

app.listen(port, () => {
  console.log('Example app listening on port 3000');

  syncDatabase.().then(() => {
    console.log('Database sync');
  })
})
```

서버 구동로직을 옮겨왔으니 app.js 파일에서도 이부분을 제거해야겠죠. app.js의 남은 부분은 아래와 같습니다.

```javascript
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/users', require('./api/user'));

moduele.exports = app;
```

이제는 app.js가 아니라 bin/www.js 파일로 서버를 구동할수 있습니다. package.json의 start 스크립트도 변경해야겠죠.

```json
"start": "node bin/www"
```


## 테스트 데이터 구성

이제 테스트 코드의  `before()` 함수에서 데이터베이스 싱크 모듈을 불러와 실행해 봅시다.

```javascript
const syncDatabase = require('../../bin/sync-database');
describe('GET /users', () => {
  before('sync database', (done) => {
    syncDatabase().then(() => {
      done();
    });
  })

  it('should return 200 status code', () => {
    // ...
  });
})
```

그럼 실제 데이터베이스에 샘플데이터를 넣고 "GET /users" 를 테스트 해볼까요? 먼저 `before()` 함수에서 데이터베이스에 데이터 3개를 넣은는 코드를 작성합니다.

```javascript
const models = require('../../models');
describe('GET /users', () => {
  before('sync database', (done) => {
    syncDatabase().then(() => done());
  });

  const users = [
    {name: 'alice'},
    {name: 'bek'},
    {name: 'chris'}
  ];
  before('insert 3 users into database', (done) => {
    models.User.bulkCreate(users).then(() => done());
  });

  it('should return array', () => {
    // 기존 코드와 동일
  });
})
```

`before()` 함수는 여러개 실행할수 있는데요 전부 다 `it()` 함수가 호출되기 전에 실행이 완료됩니다.

두번째 `before()` 함수에서는 데이터베이스에 users 테이블에 있는 유저를 추가하는 역할을 합니다. sequelize 모델에는 `create()` 말고도 `bulkCrate()` 함수가 있습니다. `create()` 함수가 하나의 로우만 생성한다면 `bulkCreate()` 함수는 여러개 데이터를 배열로 받아 여러개 로우를 생성하는 함수입니다. 이렇게 샘플데이터를 테이블에 넣은 후 `it()`으로 API 테스트를 진행 할수 있습니다.


## 테스트 데이터 삭제

마지막으로 `after()` 함수를 이용해 데이터베이스를 초기화 합니다. 유저 데이터를 넣었기 때문에 다시 삭제하는 것이죠. 여기서는 간단히 데이터베이스 싱크를 돌리겠습니다.

```javascript
after('clear up database', (done) => {
  syncDatabase().then(() => done());
});
```


## 테스트 코드 실행

마지막으로 테스트를 실행해야 하는데요, 이번에는 NODE_ENV 환경변수를 설정해 주어야 합니다. 우리는 테스트 데이터베이스와 개발 데이터베이스를 분리했으니깐 테스트시에는 테스트 데이터베이스로 접속해야합니다. 테스트 실행시 "NODE_ENV=test"만 추가해주면 됩니다. package.json 파일을 수정하세요.

```json
"test": "NODE_ENV=test ./node_modules/.bin/mocha api/**/*.spec.js"
```

그리고 명령문에서 `npm test`로 테스트를 진행합니다.

```
npm test
... resutl ..
```

나머지 테스트 코드에서도 데이터베이스를 연결해보세요.

```
git checkout unitTestWithDb
```


## 폴더정리

다시 한번 리펙토링을 해야할 것 같습니다. 리펙토링은 다다익선 많이할수록 좋아요.

bin이라는 폴더를 만들게 되면서 서버 어플리케이션 코드와 섞이게 되었습니다.

bin 폴터에는 두개의 파일이 있는데 데이터베이스를 싱크하는 sync-database.js 파일과 서버를 실제 구동하는 www.js파일이 있습니다. 엄밀히 말하는 어플리케이션 로직은 아닌셈이죠.

한편 api 폴더에는 라우팅 로직들과 models.js에 정의된 모델링 코드들은 어플리케이션으로 분리할수 있습니다.


아래와 같이 파일을 옮겨보세요

```
/app: 서버 기능
  /api: api 로직을 담당
  /config: 서버가 구동하기 위한 환경 변수 정의 (상수)
  /models: 데이터베이스 모델링
/bin: 서버 구동을 위한 코드
  /www.js: 서버 구동
  /sync-database: 디비 싱크
```

각 파일에서 사용하는 모듈의 상대 경로도 변경하는 것도 있지 말고요.

```
git checkout refoldering
```
