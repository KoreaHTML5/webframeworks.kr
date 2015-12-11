---
layout : tutorials
title : ExpressJS에서 Sequelize 사용하기1
category : tutorials
subcategory : data-input
summary : ExpressJS에서 ORM인 Sequelize 사용하기1
permalink : /tutorials/expressjs/expressjs_orm_one
title_background_color : DD1B16
title_color : FFFFFF
tags : javascript framework expressjs tutorials orm database
author : zzamjun
---

# ExpressJS에서 Sequelize 사용하기1

## ORM이란?

ORM(Object Relational Mapping)은 application과 Database사이를 맵핑시켜주는 도구이다. 한층더 추상화된 layer에서 Database에 대한 작업을 할 수 있게 해준다.
ORM을 사용함으로써 얻는 장단점(pros and cons)은 다음과 같다.

1) Pros of ORM

* 특정 DBMS에 종속되지 않는다.
* SQL문이 코드에 들어가지 않아 깔끔한 코드를 유지할 수 있다.
* ORM이 nesting데이터를 바인딩해준다.

2) Conf of ORM

* RAW query에 비해 performance가 느리다.
* Query tuning이 힘들다.
* 서비스가 복잡해 질수록 ORM으로 할 수 있는 작업의 범위에 한계가 있다.

ORM에 대한 정보는 이곳링크를 통해 더 알아볼 수 있다.  [What is ORM?](http://stackoverflow.com/questions/1279613/what-is-an-orm-and-where-can-i-learn-more-about-it) / [Pros and Cons](https://www.quora.com/What-are-the-pros-and-cons-of-using-raw-SQL-versus-ORM-for-database-development)

## Sequelize? Promise!

ORM의 종류는 여러가지가 있지만 Nodejs에서 가장 많이 사용되고 있는 ORM은 Sequelize다.
Sequelize는 PostgreSQL, MySQL, MariaDB, SQLite, MSSQL을 지원하고 트랜잭션이나 relation, read replication등도 지원한다. 복잡한 쿼리에 사용될 부분들에 대해서는 오픈된 이슈들이 꽤 있고 지금도 활발하게 pull request나 commit이 이뤄지고 있다. 그리고 가장 큰 특징은 Promise를 기본으로 동작한다는 것이다. Promise는 [Promise/A+](https://github.com/promises-aplus/promises-spec) 로 불리는 spec에 따라 정의된 비동기작업 제어방식이다. ES6에는 native로 Promise가 포함되었다.

Promise의 장점은 다음과 같다.

* 복잡한 비동기 코드를 깔끔하고 쉽게 만들 수 있는 방법을 제공한다.
* Chaining 을 통해 값을 전달하거나 연속된 일련의 작업을 처리할 수 있다.
* Error handling에 대한 처리를 깔끔하게 할 수 있다.

Promise를 구현한 라이브러리에는 대표적으로 [Q](https://github.com/kriskowal/q), [RSVP](https://github.com/tildeio/rsvp.js/), [bluebird](https://github.com/petkaantonov/bluebird)가 있다. Sequelize는 이중에서도 bluebird 라이브러리를 살짝 수정한 버전을 사용하고 있다. Promise를 비동기작업을 제어하는 방식으로 사용하는 만큼 Promise에 대해 알고 있는 부분이 많다면 Sequelize의 이용도 한결 수월해진다.
Promise에 대해 더 알아보고 싶다면 다음을 참조하자.
[Javascript Promise](http://www.html5rocks.com/en/tutorials/es6/promises/), [https://www.promisejs.org](https://www.promisejs.org), [ES6 Promise](http://www.datchley.name/es6-promises/) , [Awesome-promise](https://github.com/wbinnssmith/awesome-promises)

## DB설정

1) DBMS
DB환경은 오픈소스 RDBMS인 PostgreSQL을 사용한다. 다운 및 설치는 [이곳](http://www.postgresql.org/download/)을 참조
root계정으로 로컬 postgres에 접속해서 유저, DATABASE공간을 생성한다. (유저네임 sequelize, 비밀번호 1234, DATABASE네임 sequelize로 한다.)

```
CREATE USER sequelize WITH PASSWORD '1234';
CREATE DATABASE sequelize OWNER sequelize
```

2) 테이블 생성 (create table SQL문은 예제소스 app/sql 디렉토리에 있습니다.)

* publisher 테이블 - 출판사에 관한 정보
* books테이블 - 책에 대한 정보
* user테이블 - 유저에 대한 정보
* rent_history테이블 - 대여내역에 관한 정보


## 예제 소스
도서관리를 할 수 있는 간단한 어플리케이션을 통해  Sequelize의 사용법을 알아보자.
웹 프레임워크로는 Express, 화면 작업은 Angularjs를 사용한다.

```
$ git clone https://github.com/BumjuneKim/sequelize_tutorial.git
$ cd sequelize_tutorial/public
$ bower install
$ cd ../app
$ npm install 후 node나 nodemon을 이용하여 app.js실행
```

## Setting up a connection

Sequelize의 설치는 npm install sequelize로 간단히 할 수 있다. 또한 Sequelize에서 postgres에 대한 작업을 하기 위해서는 추가로 pg, pg-hstore를 설치해야하므로 두개 모듈도 npm으로 설치하도록 하자.
설치 이후에는 서버가 구동될때 DB와 Connection을 맺도록 설정해야 한다. Connection에 대한 정보는 Sequelize객체를 생성할 때 parameter로 들어간다.

> new Sequelize(database, [username=null], [password=null], [options={}])


{% highlight javascript %}
var sequelize = new Sequelize('postgres://sequelize:1234@localhost/sequelize');
var sequelize = new Sequelize('sequelize', 'sequelize', '1234', {
    host: 'localhost',
    dialect: 'postgres'
});
{% endhighlight %}

connection연결은 위와 같이 두가지 방법 모두 가능하다.


## Model Define

 Sequelize에서 Model은 Database공간의 Table의 Schema를 표현하는 수단이다. Table Schema에 대응되는 Model을 정의한 이후에 실제로 메모리 공간에 올려 캐쉬하려면 import를 해야하는데 import는
바로 다음에 알아보도록하자. Model에 대한 정의는 Sequelize의 define 메소드를 이용한다. 예시는 다음과 같다.

{% highlight javascript %}
sequelize.define('Publisher', {
    pub_id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING(32), allowNull: false},
    established_date: {type: DataTypes.DATE, defaultValue: DataTypes.NOW}
}, {
    classMethods: {},
    tableName: 'publisher',
    freezeTableName: true,
    underscored: true,
    timestamps: false
});
{% endhighlight %}

define 메소드의 첫번째 파라미터는 model의 name이다.
두번째 파라미터가 실제로 Table Schema와 맵핑되는 정보이다. 즉 table의 각 column들에 대한 schema를 표현한다. 대표적인 설정 값들 몇개를 알아보자.

* type : Data type
* primaryKey :  기본키 인지 아닌지 설정 (default: false)
* autoIncrement : SERIAL(auto increment)인지 아닌지 (default: false)
* allowNull : NOT NULL 조건인지 아닌지 (default: true)
* unique : Unique조건인지 아닌지에 대한 옵션. column하나로만 이루어진 unique라면 true/false로 지정한다. 복수개의  column이라면 동일한 문자열을 각 column의 unique속성에 넣어준다.
* comment : column에 대한 comment
* validate : 각 column에 대한 validation check옵션을 넣어준다.

세번째 파라미터는 config 옵션이 들어간다. 대표적인 옵션은 이와같다.

* timestamps : Sequelize는 테이블을 생성한 후 자동적으로 createdAt, updatedAt column을 생성한다. Database에 해당 테이블이 언제 생성되었고 가장 최근에 수정된 시간이 언제인지 추적할 수 있도록 해준다. 기능을 끄려면 false로 설정한다.
* paranoid : paranoid가 true이면 deletedAt column이 table에 추가된다. 해당 row를 삭제시 실제로 데이터가 삭제되지 않고 deletedAt에 삭제된 날짜가 추가되며 deletedAt에 날짜가 표기된 row는 find작업시 제외된다. 즉 데이터는 삭제되지 않지만 삭제된 효과를 준다. timestamps 옵션이 true여야만 사용할 수 있다.
* underscored : true이면 column이름을 camalCase가 아닌 underscore방식으로 사용한다.
* freezeTableName : Sequelize는 define method의 첫번째 파라미터 값으로 tablename을 자동변환하는데 true이면 이작업을 하지 않도록 한다.
* tableName : 실제 Table name
* comment : table 에 대한 comment


## Import
Sequelize의 import 메소드는 파일에 있는 model 정의들과 완벽히 같은 object를 생성하여 저장한다. 내부적으로 캐쉬되어 여러번 호출하더라도 문제가 발생하지 않는다. 서버가 구동될때 정의된 모델을 app단에서도 캐쉬하면 import 메소드를 여러번 호출할 필요가 없다. 예제의 디렉토리 구조는 다음과 같다. models/index.js 에서는 sequelize설정, publisher.js에서는 publisher table에 대한 정의가 들어가있다.

```
- sequelize_tutorial(~/example/sequelize_tutorial)
  - app
    - bin
    - models
      - index.js
      - publisher.js
```

index.js에서는 다음과 같이 import를 할 수 있다.

{% highlight javascript %}
var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');
var sequelize = new Sequelize('postgres://sequelize:1234@localhost/sequelize');
var db = {};

db['Publisher'] = sequelize.import(path.join(__dirname, 'publisher.js'));
db.sequelize = sequelize;
db.Sequelize = Sequelize;
module.exports = db;
{% endhighlight %}

이렇게 작업을 하면 models/index.js로부터 캐쉬된 객체들을 가져올 수 있다. 서버가 구동될때 단 한번 import를 하면 다음은 require로 가져다 쓰기만 하면 된다. 만약에 models에 각 table에 대한 정의가 이뤄진 파일을 모아놓는다면 다음과 같이 import문을 사용하면 더 효율적이다.

{% highlight javascript %}
fs.readdirSync(__dirname)
    .filter(function(file) {
        return (file.indexOf('.') !== 0) && (file !== 'index.js');
    })
    .forEach(function(file) {
        var model = sequelize['import'](path.join(__dirname, file));
        db[model.name] = model;
    });
module.exports = db;
{% endhighlight %}

## Data Type

Sequelize에서 지원하는 DataType은 다음과 같다. (sequelize 공식 사이트에서 발췌)

{% highlight javascript %}
Sequelize.STRING                      // VARCHAR(255)
Sequelize.STRING(1234)                // VARCHAR(1234)
Sequelize.STRING.BINARY               // VARCHAR BINARY
Sequelize.TEXT                        // TEXT

Sequelize.INTEGER                     // INTEGER
Sequelize.BIGINT                      // BIGINT
Sequelize.BIGINT(11)                  // BIGINT(11)

Sequelize.FLOAT                       // FLOAT
Sequelize.FLOAT(11)                   // FLOAT(11)
Sequelize.FLOAT(11, 12)               // FLOAT(11,12)

Sequelize.REAL                        // REAL        PostgreSQL only.
Sequelize.REAL(11)                    // REAL(11)    PostgreSQL only.
Sequelize.REAL(11, 12)                // REAL(11,12) PostgreSQL only.

Sequelize.DOUBLE                      // DOUBLE
Sequelize.DOUBLE(11)                  // DOUBLE(11)
Sequelize.DOUBLE(11, 12)              // DOUBLE(11,12)

Sequelize.DECIMAL                     // DECIMAL
Sequelize.DECIMAL(10, 2)              // DECIMAL(10,2)

Sequelize.DATE                        // DATETIME for mysql / sqlite, TIMESTAMP WITH TIME ZONE for postgres
Sequelize.BOOLEAN                     // TINYINT(1)

Sequelize.ENUM('value 1', 'value 2')  // An ENUM with allowed values 'value 1' and 'value 2'
Sequelize.ARRAY(Sequelize.TEXT)       // Defines an array. PostgreSQL only.

Sequelize.JSON                        // JSON column. PostgreSQL only.
Sequelize.JSONB                       // JSONB column. PostgreSQL only.

Sequelize.BLOB                        // BLOB (bytea for PostgreSQL)
Sequelize.BLOB('tiny')                // TINYBLOB (bytea for PostgreSQL. Other options are medium and long)

Sequelize.UUID                        // UUID datatype for PostgreSQL and SQLite, CHAR(36) BINARY for MySQL (use defaultValue: Sequelize.UUIDV1 or Sequelize.UUIDV4 to make sequelize generate the ids automatically)

Sequelize.RANGE(Sequelize.INTEGER)    // Defines int4range range. PostgreSQL only.
Sequelize.RANGE(Sequelize.BIGINT)     // Defined int8range range. PostgreSQL only.
Sequelize.RANGE(Sequelize.DATE)       // Defines tstzrange range. PostgreSQL only.
Sequelize.RANGE(Sequelize.DATEONLY)   // Defines daterange range. PostgreSQL only.
Sequelize.RANGE(Sequelize.DECIMAL)    // Defines numrange range. PostgreSQL only.

Sequelize.ARRAY(Sequelize.RANGE(Sequelize.DATE)) // Defines array of tstzrange ranges. PostgreSQL only.
{% endhighlight %}

INTEGER, BIGINT, FLOAT, DOUBLE type에는  unsigned와 zerofill에 대한 옵션도 지정할 수 있다

{% highlight javascript %}
Sequelize.INTEGER.UNSIGNED              // INTEGER UNSIGNED
Sequelize.INTEGER(11).UNSIGNED          // INTEGER(11) UNSIGNED
Sequelize.INTEGER(11).ZEROFILL          // INTEGER(11) ZEROFILL
Sequelize.INTEGER(11).ZEROFILL.UNSIGNED // INTEGER(11) UNSIGNED ZEROFILL
Sequelize.INTEGER(11).UNSIGNED.ZEROFILL // INTEGER(11) UNSIGNED ZEROFILL
{% endhighlight %}

zerofill은 남는 자릿수를 0으로 채우는 방식이다. 예를 들면 INTEGER(4).ZEROFILL type인 column에 값이 ‘4’가 들어갈경우 0004로 표기되는 방식이다.
model정의와 Datatype에 대한 정보는 이곳에서 볼 수 있다.
[sequelize model definition](http://sequelize.readthedocs.org/en/latest/docs/models-definition/), [sequelize data types](http://sequelize.readthedocs.org/en/latest/api/datatypes/)

지금까지 Sequelize를 사용하기에 앞서 ORM, Promise에 대한 원론적인 이야기와 함께 Sequelize 설정과 간단한 옵션에 대한 부분을 알아보았다. 다음 챕터에는 실제로 Sequelize가 application에서 어떻게 쿼리를 수행하고 리턴하는지에 대한 부분을 간단한 예제와 함께 살펴보자.