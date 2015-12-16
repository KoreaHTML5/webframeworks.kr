---
layout : tutorials
title : ExpressJS에서 Sequelize 사용하기4
category : tutorials
subcategory : data-input
summary : ExpressJS에서 ORM인 Sequelize 사용하기4
permalink : /tutorials/expressjs/expressjs_orm_four
title_background_color : DD1B16
title_color : FFFFFF
tags : javascript framework expressjs tutorials orm database
author : zzamjun
---

# ExpressJS에서 Sequelize 사용하기4

## Hooks

Hooks는 Insert, Update, Delete등의 작업을 수행하기 전이나 수행한 후에 호출되는 기능을 뜻한다. 즉 이것은 Trigger이다 데이터베이스의 Trigger를 Sequelize에서는 Hooks라고 명칭한다. 데이터에 대한 변형이 이루어질때마다 작업해야하는 사항이 있을때 hooks는 좋은 솔루션이 될 것이다. Sequelize model의 메소드중 create, update, delete와 validate작업 전후로 hooks(trigger)를 걸 수 있다. hooks에 대한 메소드 종류는 다음과 같다.

1)	create: beforeCreate, afterCreate, beforeBulkCreate, afterBulkCreate

2)	update: beforeUpdate, afterUpdate, beforeBulkUpdate, afterBulkUpdate

3)	destroy: beforeDestroy, afterDestroy, beforeBulkDestroy, afterBulkDestroy

4)	validate: beforeValidate, afterValidate

메소드 이름이 직관적이어서 이름만 봐도 어떤 작업을 하는 hooks인지 알 수 있다.
hooks를 추가하는 방법은 3가지가 있다.
첫 번째 방법은 model define시에 hooks에 대한 설정을 같이 하는 것이다. 예시는 다음과 같다.

{% highlight javascript %}
 module.exports = function(sequelize, DataTypes) {
 return sequelize.define('Publisher', {
      pub_id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
      name: {type: DataTypes.STRING(32), allowNull: false},
      established_date: {type: DataTypes.DATE, defaultValue: DataTypes.NOW}
 }, {
      classMethods: {},
      tableName: 'publisher',
      freezeTableName: true,
      underscored: true,
      timestamps: false,
      hooks: {
          beforeCreate: function() {
              //TODO; create작업 전에 해야할 사항들.
          }
      }
   });
};
{% endhighlight %}

Chapter1 model define부분에서 정의했던 Publisher model이다. define메소드에서 3번째 파라미터는 config에 관한 사항이 들어간다고 했는데 이 파라미터에 hooks를 걸어주면 된다.

두 번째 방법은 hook 메소드를 이용하는 것이다. 예시는 다음과 같다.

{% highlight javascript %}
db.Publisher.hook('beforeCreate', function() {
    //TODO; create작업 전에 해야할 사항들.
});
{% endhighlight %}


세 번째 방법은 직접 메소드를 호출하는 것이다. 예시는 다음과 같다.


{% highlight javascript %}
db.Publisher.beforeCreate(function() {
    //TODO; create작업 전에 해야할 사항들.
});


{% endhighlight %}

설정하는 방식만 다를뿐 모두 같은 동작을 하므로 상황에 맞는 hooks설정법을 사용하면 되겠다. 이번 튜토리얼에서는 첫 번째 방식(model define시 hooks설정)으로 hooks설정을 하도록한다.

그런데 각 model마다 hooks를 거는게 아니고 모든 model에 공통적으로 필요한 hook이 있다면? Global용도의 hook을 만들 수 있을까? 정답은 가능하다! Chapter1에서 connection을 맺을 때 Sequelize객체 생성한 부분을 기억 할 것이다. 객체 생성시에 hooks를 걸어준다면 define한 모든 model에서 사용할 수 있는 global hooks를 생성할 수 있다. 예시는 다음과 같다.

{% highlight javascript %}
var sequelize = new Sequelize('postgres://sequelize:1234@localhost/sequelize', {
    define: {
        hooks: {
            beforeCreate: function() {
                //TODO: global hooks before create
            }
        }
    }
});
{% endhighlight %}

이렇게 생성한 hooks는 모든 model에서 발동된다. 만약에 Publisher model같이 local에 hooks가 걸려있다면 local hook이 발동되고 global hook은 발동되지 않는다. local hook이 없는 model의 경우엔 global hook이 발동된다.
예제에는 create, update, destroy에 대해서 before, after hook을 걸었는데 따라 로그를 찍어보면 해당 Query실행 전후로 보이는 것을 확인 할 수 있다.

{% bimg ../expressjs_orm/imgs/ex4_1.png %} 예 {% endbimg %}

Hooks는 trigger와 같은 개념으로 어떠한 작업실행 전후로 반드시 해야하는일이 있다면 hooks의 사용을 고려해보자. Sequelize hooks에 대해 더 알아보고 싶다면 이곳을 참고하기 바란다.


[Sequelize hooks](http://sequelize.readthedocs.org/en/latest/docs/hooks/)

[Sequelize hooks API](http://sequelize.readthedocs.org/en/latest/api/hooks/)



## Transaction

Sequelize에서 transaction을 사용하는 방식은 두가지가 있다.
첫 번째는 Managed transaction방식이다. Managed transaction의 큰 특징은 자동으로 commit과 rollback을 관리한다는 점이다. Sequelize의 transaction생성 메소드의 callback으로 동작하며 그 안의 작업들이 모두 성공적으로 끝나면 commit 한다. 만약 하나의 작업이라도 실패한다면 rollback한다. 사용자가 직접 commit, rollback메소드를 콜하지 않아도 promise의 작업결과에 따라 자동적으로 해준다.
예시는 다음과 같다. (Sequelize공식문서 transaction part에서 발췌)

{% bimg ../expressjs_orm/imgs/ex4_2.png %} 예 {% endbimg %}

위 스크린샷의 설명대로 transaction메소드 callback안의 모든 작업이 성공적으로 끝나서 then으로 오면 commit되고 에러가 발생하여 catch문으로 넘어오면 rollback한다. 사용자가 commit, rollback에 대한 코드를 작성하지 않아도 자동으로 해준다.

두 번째는 Unmanaged transaction방식이다. Managed방식과는 다르게 사용자가 commit, rollback처리를 수동으로 해줘야 한다. Sequelize transaction생성 메소드가 promise를 반환하는데 이 promise의 결과로 transaction 객체를 얻고 이 객체를 각 query실행시마다 전달해야 transaction의 한 단위로 묶을 수 있다. 예시는 다음과 같다. (역시 Sequelize공식문서에서 발췌)

{% bimg ../expressjs_orm/imgs/ex4_3.png %} 예 {% endbimg %}

transaction메소드의 결과로 promise가 리턴되어 then으로 연결되고 transaction으로 묶을 작업들을 그 후에 실행한다. 모든 작업들이 완료되고 난 후에 commit메소드를 호출하는 것을 볼 수 있다. 만약에 작업에 에러가 발생하여 catch로 빠지면 rollback도 수동으로 호출해야 한다.
만약 commit이나 rollback을 콜하지 않는다면 timeout때까지 작업은 묶여 있을 것이다.
이제부터 예제에서는 Unmanaged 방식을 사용하도록 한다.
transaction메소드에는 몇가지 옵션을 추가할 수 있는데 역시 Sequelize공식문서에서 발췌한 옵션사항으로는 3가지가 있다.

{% bimg ../expressjs_orm/imgs/ex4_4.png %} 예 {% endbimg %}

autocommit은 말그대로 commit을 auto로 할것이냐는 옵션이다.
isolationLevel도 지정할 수 있다. isolationLevel이란 여러개의 트랜잭션이 동시에 실행 될 때 충돌이 발생하면 이를 어떻게 처리할 것인가에 대한 정책이다. Sequelize는 default로 REPEATABLE READ를 사용한다. isolationLevel에 대한 자세한 사항은 이곳을 참조하자.

[postgresql transation isolation](http://www.postgresql.org/docs/current/static/transaction-iso.html)

deferrable옵션은 postgreSQL에서만 지원되는 옵션으로 foreign key제약조건을 언제 체크할것인지에 대한 옵션이다. default는 NOT DEFERRABLE이다. foreign key 체크를 지연없이 바로바로 체크한다는 뜻이다. deferrable에 대한 자세한 사항은 이곳을 참조하자.

[postgresql set constraints](http://www.postgresql.org/docs/current/static/sql-set-constraints.html)


{% bimg ../expressjs_orm/imgs/ex4_5.png %} 예 {% endbimg %}

rent탭에서는 특정유저에게 책을 빌려줄 수 있도록 할 수 있다.


{% bimg ../expressjs_orm/imgs/ex4_6.png %} 예 {% endbimg %}

linux basic이라는 책을 sequelize라는 유저에게 빌려주는 액션이다 Rent버튼을 누르면 rent에 대한 API가 실행 될 것이다. API에서 해야할 로직을 간단히 순서대로 적어보면 다음과 같다.

1.	transaction을 실행한다.

2.	rent_history를 만든다.

3.	빌려간 책에 대한 재고를 1씩 감소한다.

4.	commit한다.

5.	결과를 반환한다.

위의 로직을 구현한 API소스를 살펴보자

{% bimg ../expressjs_orm/imgs/ex4_7.png %} 예 {% endbimg %}



sequelize 인스턴스로부터 transaction 설정을 한후에 rent_history테이블에는 insert작업을 books테이블에는 update작업을 하였다. 두 작업 모두 transaction에 대한 옵션이 들어간 것을 볼 수 있다. 작업이 모두 완료된 이후에는 commit을 하고 에러가 발생하면 rollback을 하도록 수동으로 호출했다.
로그를 살펴보면

{% bimg ../expressjs_orm/imgs/ex4_8.png %} 예 {% endbimg %}

Transaction이 시작되고 Insert, Update작업후에 정상적으로 Commit이 일어난 것을 확인 할 수 있다.

Transaction파트 외에도 소스를 보면 promise를 return하여 chaining하는 것을 볼 수 있다. Promise chaining의 장점은 비동기작업을 원하는 순서대로 동기화할 수 있다는 것이고 indent관리가 되기 때문에 callback hell이 발생하지 않고 가독성도 높아진다. 가독성이 높아지기 때문에 순서대로 작업되는 일이 어떤것인지 파악하기도 편하다. Chapter1에서 언급했던것처럼 Sequelize의 가장큰 특징은 Promise사용이다. 이러한 패턴들을 익혀놓고 같이 사용한다면 더 깔끔한 프로그램 작성을 할 수 있을 것이다.

이로서 Sequelize ORM에 대한 튜토리얼이 끝났습니다. 6개월간 Sequelize를 사용하며 느낀것은 생각보다 많은 것을 지원하려고 애쓴 느낌이 나는 웰메이드급 ORM이라는 생각입니다. 물론 규모가 크거나 복잡한 곳에 사용하기에는 무리가 있지만 간단한 프로젝트나 백오피스 프로그램에는 꽤나 쓸모가 많습니다. 아직 제 자신도 모르는게 많지만 아는 것을 최대한 담으려고 노력했습니다. Chapter내용에 잘못된 부분이 있거나 궁금하신 사항이 있다면 언제든지 kbj@flitto.com으로 연락주시기 바랍니다. Tutorial내의 글은 경어체로 쓰는것보다는 혼잣말을 하는 뉘앙스로 작성하는게 효율적이라고 생각되어 경어체는 쓰지 않았습니다. 그 점에 대한 양해 부탁드립니다.
