---
layout : tutorials
title : ExpressJS에서 ORM으로 디비정보 가져오기
category : tutorials
subcategory : data-input
summary : 서버에 이미지파일을 업로드하고, 이미지 리사이징, 메타정보 제거, 블러링등의 가공을 하는 방법에 대해 알아봅니다.
permalink : /tutorials/expressjs/expressjs_orm_2
title_background_color : DD1B16
title_color : FFFFFF
tags : javascript framework expressjs tutorials file
author : 6pack
---

데이터베에스의 연동이 많은 백-엔드를 보다 편리하게 개발하기 위해서 많이 사용하되는 기술은 ORM입니다. ExpressJS 프레임워크에서 개발을 할 때도, 사용할 수 있는 ORM들이 있기에, 이번
튜토리얼을 통해서 Javascript 언어의 ORM 중 가장 많이 사용되고있는 Sequeilize(시퀼라이즈 홈페이지)에 대해 알아보도록 하겠습니다.
Express.js에서 Sequelize를 사용하는 방법은 시퀼라이즈 공식 사이트에서도 설명하고 있으니 참고바랍니다.
(http://docs.sequelizejs.com/en/1.7.0/articles/express/)
우선 ORM이 무엇인지 알아보자. ORM은 Object Relational Mapping의 약어로써, 객체지향언어와 데이터를 다루는 데이터베이스관리시스템(DBMS) 와의 상이한 구조를 매핑하여, 
객체지향언어의 개발을 쉽게 만들어주는 기술을 말합니다. 
필자가 Sequelize를 사용함으로써 느낀 편리한 점들은 아래와 같았습니다. 
(1) 무엇보다 쿼리를 주저리 주저리 입력하지 않아도 알아서 보내준다는 점이 편리하다. 
(2) 특히, 자바스크립트 코드로 테이블을 디자인하면 자동으로 쿼리가 실행되어 테이블을 만든다. 물론 외래키(foreign key)도 자동으로 만들어 준다.
(3) 테이블 컬럼별로 검증자(validator)를 설정하여 CRUD 작업시 맞지 않는 컬럼 값을 입력하면 에러메세지를 보내주는데, 프로토콜 개발시에 이 에러 메세지가 꽤 유용하다.

이제 설치부터 알아보도록 하겠습니다.

설치는 npm을 통해서 아주 쉽게 가능합니다.
$ npm install sequelize --save

설치 후 사용을 위해서는 아주 간단히 sequelize를 require해주면 됩니다.
var Sequelize = require(‘sequelize’);

이후에는 데이터베이스와의 연동을 시켜줘야 합니다. 설정할 수 있는 값들은 아래 예제를 통해서 확인 가능합니다.

// All options at once:
var sequelize = new Sequelize('database', 'username', 'password', {
  // custom host; default: localhost
  host: 'my.server.tld',
  // custom port; default: 3306
  port: 12345,
  // disable logging; default: console.log
  logging: false,
  // max concurrent database requests; default: 50
  maxConcurrentQueries: 100,
  // the sql dialect of the database
  // - default is 'mysql'
  // - currently supported: 'mysql', 'sqlite', 'postgres'
  dialect: 'mysql',
  // the storage engine for sqlite
  // - default ':memory:'
  storage: 'path/to/database.sqlite',
  // specify options, which are used when sequelize.define is called
  // the following example is basically the same as:
  // sequelize.define(name, attributes, { timestamps: false })
  // so defining the timestamps for each model will be not necessary
  define: { timestamps: false },
  // similiar for sync: you can define this to always force sync for models
  sync: { force: true }
  // use pooling in order to reduce db connection overload and to increase speed
  // currently only for mysql
  pool: { maxConnections: 5, maxIdleTime: 30}
})

ORM을 사용하게 위해서는 실제 데이터베이스의 테이블들과 매핑하기위해서 models폴더에 데이터베이스 로직 관련파일을 저장해야합니다.
문법은 아래와 같습니다.
var ModelName = sequelize.define('ModelName #2', {
  field1: Sequelize.STRING,
  filed2: Sequelize.TEXT
});
ModelName #2 는 create table 되어질때, 복수형(+s) 으로 생성되는것을 유의하세요.

sequlize에서 지원하는 데이터 타입은 아래와 같습니다.
Sequelize.STRING ===> VARCHAR(255)
Sequelize.TEXT ===> TEXT
Sequelize.INTEGER ===> INTEGER
Sequelize.DATE ===> DATETIME
Sequelize.BOOLEAN ===> TINYINT(1)
Sequelize.FLOAT ===> FLOAT

models 폴더에 데이터베이스 로직 관련 파일을 저장함.
models 폴더
model/index.js: 폴더내 모델들을 로딩
model/user.js: sequelize.define(), 모델 정의, Task 모델과 1:n 관계 설정
model/task.js: 상동 
routes 폴더로 라우팅.
라우팅시 models.User.findAll() 함수로 데이터베이스 조회 


모델은 자바스크립트 객체로서 데이터베이스 테이블과 연동되는 개념으로


var Project = sequelize.define('Project', {
  title: Sequelize.STRING,
  description: Sequelize.TEXT
});

컬럼 옵션을 지정할 수 있다. 
데이터 타입은 여기서 확인
Data retrieval / Finders
Project.find(123): id로 검색
Project.find({ where: {title: ‘aProject’} }): where 조건절로 검색
Project.findOrCreate(): 조회후 없으면 생성 



인스턴스로 생성을 가능합니다.




var project = Project.build(); // 모델을 이용해 자바스크립트 인스턴스 생성
project.save(); // 저장 

Project.create()는 뭐가 다른가? 여길보자

CRUD 모두 가능함
벌크로도 작업 가능함

increment / decrement는 뭐지?

1.6 Associations
http://docs.sequelizejs.com/en/1.7.0/docs/associations/


1.7 Migrations
커맨드라인툴 설치:
npm install sequelize-cli

마이그레이션 생성:
sequelize migration:create 

마이그레이션 실행: up
gm

마이그레이션 취소: down
sequlize db:migrate:undo

2. NodeQ&A
2.1 Sequelize #1 개념과 CRUD 
http://nodeqa.com/nodejs_ref/30

2.2 Sequelize #2 Association 
http://nodeqa.com/nodejs_ref/31

2.3 sequelize #3 Migration
http://nodeqa.com/nodejs_ref/32
이건 필요시 보자.






SQL 쿼리문 작성이 손에 익어서 일까? Sequalize 문법이 종종 햇갈린다. 이 글에서는 Sequelize에서 자주 사용하는 쿼리 사용법을 정리해 본다.

like

models.Foo.findAll({
  where: {name: {like: '%keyword%'}}
});

models.Foo.findAll({
  where: ['name like ?', '%keyword%']
});




라이크 조건절은 위와 같이 두 가지 방법으로 사용한다. 둘다 동일하게 동작한다.

lt, gt, lte, gte, between

models.Foo.findAll({
  where: {createdAt: {lt: new Date()}}
});

models.Foo.findAll({
  where: {createdAt: {gt: Date.parse('2014-01-01')}}
});

models.Foo.findAll({
  where: {createdAt: {between: [new Date(), Date.parse('2012-01-01')]}}
});


값의 대소를 비교하는 경우 lt, gt, lte, gte를 사용한다. Date.parse() 같은 날짜 함수를 사용할 수도 있다. 만약 구간을 검색할 경우 between 을 사용한다.

join

models.Foo.find({
  include: [models.boo]
});

models.Foo.find({
  include: [{
    model: models.boo
    where: {}
  }]
});


조인할 대상을 include에 배열로 넘겨준다. 배열이기 때문에 여러 테이블을 조인하는 것이 가능하다. 조인 조건은 테이블 스키마 작성시 설정한 Association 관계에 따라 알아서 선택된다. 외래키 이외에 조인 조건을 추가해야 한다면 {model: , wehre: } 객체에 조인 조건을 설정하여 배열에 추가한다.

orderby, limit

models.Foo.findAll({
  offset: 0,
  limit: 100,
  order: 'createdAt desc'
});


페이징 기능을 구현할 때 많이 사용하는 쿼리다.

groupby, count()

models.User.findAll({
  attributes: ['GroupId', [models.sequelize.fn('count', '*'), 'count']],
  group: 'GroupId'
});


특정 키로 그룹핑하고 결과를 카운팅하여 count로 이름 붙인다.

# attributes, alias, left()

models.Foo.findAll({
  attributes: [
    'id',
    ['name', 'userName'],
    [models.sequelize.fn('left', models.sequelize.col('createdAt'), 10), 'date']
  ],
  where: {}
});


특정 필드만 얻고자 할 경우 attributes에 배열로 필드명을 넘겨준다. 배열안에 [‘필드명’, ‘alise 명’] 배열로 alise를 설정할 수도 있다. 필드명에 함수를 적용할 때는models.sequelize.fn()을 사용한다. 배열의 세번째 코드는 createdAt 필드 값의 좌측 10자리 문자열을 반환하여 date로 이름 붙인 예제이다.

Raw Query

var query = 'select * form Foo where name = :name';
var values = {
  name: 'chris'
};

models.sequelize.query(query, {replacements: values})
  .spread(function (results, metadata) {
      // 쿼리 실행 성공

    }, function (err) {
      // 쿼리 실행 에러

    });


직접 쿼리를 돌려야 할때는 models.sequelize.query() 함수를 사용한다. 쿼리문에:name으로 설정한뒤 replacements에 해당 name 키가 있는 객체를 넘겨주면 쿼리의 :name을 replacements에 있는 값으로 치환하여 쿼리를 실행한다.

findOrCreate()

models.User.findOrCreate({
    where: {id: req.user.id}
  }).spread(function (user, created) {
    if (created) {
      // create 실행됨
    }

    // user 객체
  });


테이블의 특정 로우를 찾는 것이고 만약 없을 경우 INSERT 구문을 실행하여 로우를 생성한다. 몽고디비의 upsert() 와 비슷하다.ORM을 써보기 시작했다. Sequeilize.
                                                                            
                                                                            편리한 점이 한 두가지가 아니다.  (1) 무엇보다 쿼리를 주저리 주저리 입력하지 않아도 알아서 보내준다는 점이 편리하다. (2) 특히, 자바스크립트 코드로 테이블을 디자인하면 자동으로 쿼리가 실행되어 테이블을 만든다. 물론 외래키(foreign key)도 자동으로 만들어 준다. (3) 테이블 컬럼별로 검증자(validator)를 설정하여 CRUD 작업시 맞지 않는 컬럼 값을 입력하면 에러메세지를 보내주는데, 프로토콜 개발시에 이 에러 메세지가 꽤 유용하다.
                                                                            
                                                                            SQL 쿼리문 작성이 손에 익어서 일까? Sequalize 문법이 종종 햇갈린다. 이 글에서는 Sequelize에서 자주 사용하는 쿼리 사용법을 정리해 본다.
                                                                            
                                                                            like
                                                                            
                                                                            models.Foo.findAll({
                                                                              where: {name: {like: '%keyword%'}}
                                                                            });
                                                                            
                                                                            models.Foo.findAll({
                                                                              where: ['name like ?', '%keyword%']
                                                                            });
                                                                            
                                                                            
                                                                            
                                                                            
                                                                            라이크 조건절은 위와 같이 두 가지 방법으로 사용한다. 둘다 동일하게 동작한다.
                                                                            
                                                                            lt, gt, lte, gte, between
                                                                            
                                                                            models.Foo.findAll({
                                                                              where: {createdAt: {lt: new Date()}}
                                                                            });
                                                                            
                                                                            models.Foo.findAll({
                                                                              where: {createdAt: {gt: Date.parse('2014-01-01')}}
                                                                            });
                                                                            
                                                                            models.Foo.findAll({
                                                                              where: {createdAt: {between: [new Date(), Date.parse('2012-01-01')]}}
                                                                            });
                                                                            
                                                                            
                                                                            값의 대소를 비교하는 경우 lt, gt, lte, gte를 사용한다. Date.parse() 같은 날짜 함수를 사용할 수도 있다. 만약 구간을 검색할 경우 between 을 사용한다.
                                                                            
                                                                            join
                                                                            
                                                                            models.Foo.find({
                                                                              include: [models.boo]
                                                                            });
                                                                            
                                                                            models.Foo.find({
                                                                              include: [{
                                                                                model: models.boo
                                                                                where: {}
                                                                              }]
                                                                            });
                                                                            
                                                                            
                                                                            조인할 대상을 include에 배열로 넘겨준다. 배열이기 때문에 여러 테이블을 조인하는 것이 가능하다. 조인 조건은 테이블 스키마 작성시 설정한 Association 관계에 따라 알아서 선택된다. 외래키 이외에 조인 조건을 추가해야 한다면 {model: , wehre: } 객체에 조인 조건을 설정하여 배열에 추가한다.
                                                                            
                                                                            orderby, limit
                                                                            
                                                                            models.Foo.findAll({
                                                                              offset: 0,
                                                                              limit: 100,
                                                                              order: 'createdAt desc'
                                                                            });
                                                                            
                                                                            
                                                                            페이징 기능을 구현할 때 많이 사용하는 쿼리다.
                                                                            
                                                                            groupby, count()
                                                                            
                                                                            models.User.findAll({
                                                                              attributes: ['GroupId', [models.sequelize.fn('count', '*'), 'count']],
                                                                              group: 'GroupId'
                                                                            });
                                                                            
                                                                            
                                                                            특정 키로 그룹핑하고 결과를 카운팅하여 count로 이름 붙인다.
                                                                            
                                                                            # attributes, alias, left()
                                                                            
                                                                            models.Foo.findAll({
                                                                              attributes: [
                                                                                'id',
                                                                                ['name', 'userName'],
                                                                                [models.sequelize.fn('left', models.sequelize.col('createdAt'), 10), 'date']
                                                                              ],
                                                                              where: {}
                                                                            });
                                                                            
                                                                            
                                                                            특정 필드만 얻고자 할 경우 attributes에 배열로 필드명을 넘겨준다. 배열안에 [‘필드명’, ‘alise 명’] 배열로 alise를 설정할 수도 있다. 필드명에 함수를 적용할 때는models.sequelize.fn()을 사용한다. 배열의 세번째 코드는 createdAt 필드 값의 좌측 10자리 문자열을 반환하여 date로 이름 붙인 예제이다.
                                                                            
                                                                            Raw Query
                                                                            
                                                                            var query = 'select * form Foo where name = :name';
                                                                            var values = {
                                                                              name: 'chris'
                                                                            };
                                                                            
                                                                            models.sequelize.query(query, {replacements: values})
                                                                              .spread(function (results, metadata) {
                                                                                  // 쿼리 실행 성공
                                                                            
                                                                                }, function (err) {
                                                                                  // 쿼리 실행 에러
                                                                            
                                                                                });
                                                                            
                                                                            
                                                                            직접 쿼리를 돌려야 할때는 models.sequelize.query() 함수를 사용한다. 쿼리문에:name으로 설정한뒤 replacements에 해당 name 키가 있는 객체를 넘겨주면 쿼리의 :name을 replacements에 있는 값으로 치환하여 쿼리를 실행한다.
                                                                            
                                                                            findOrCreate()
                                                                            
                                                                            models.User.findOrCreate({
                                                                                where: {id: req.user.id}
                                                                              }).spread(function (user, created) {
                                                                                if (created) {
                                                                                  // create 실행됨
                                                                                }
                                                                            
                                                                                // user 객체
                                                                              });
                                                                            
                                                                            
                                                                            테이블의 특정 로우를 찾는 것이고 만약 없을 경우 INSERT 구문을 실행하여 로우를 생성한다. 몽고디비의 upsert() 와 비슷하다.