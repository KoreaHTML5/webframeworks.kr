---
layout : tutorials
category : tutorials
title : PHP 라라벨 5 On Mac - 18.엘로퀀트 ORM II
subcategory : setlayout
summary : PHP 라라벨 5에 대해 알아봅니다.
permalink : /tutorials/weplanet/Laravel18
author : danielcho
tags : laravel
title_background_color : F1F71A
---





> 앞서 라라벨의 ORM에 대해 입문적인 부분을 살펴보았고, 이번 단에서는 관계에 대해서 설명하겠습니다.
앞서 작성한 모델을 대상으로 설명하기에는 양이 너무 많아 가정과 방법으로 설명하도록 하겠습니다.

데이타 베이스를 설계한 뒤 각 객체와 객체는 고유식별 필드를 사용하여 관계를 가지고 있습니다.
일 대 일 관계(1:1), 일 대 다 관계(1:M), 다 대 다 관계(N:M) 관계 등를 가질 수 있는데, 이 관계를 엘로퀀트 ORM에서는 어떻게 정의하는지 살펴 보도록 하겠습니다.

##  일대일 관계 정의하기
일대일 관계는 매우 기본적인 관계입니다.
예를 들어 User 모델은 하나의 Phone 을 가집니다. 이러한 관계를 Eloquent 에서 정의할 수 있습니다.

```
$ php artisan make:migration create_phone_table --create=phones
```

`경로` database/migrations/TIMESTAMP_create_phone_table.php

```php
class CreatePhonesTable extends Migration
{
    public function up()
    {
        Schema::create('phones', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('user_id')->unsigned()->index();
            $table->string('phone');
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')
                  ->onUpdate('cascade')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::drop('phones');
    }
}
```

#### 관계 설정

```
$ php artisan make:model Phone
```

`경로`  app/User.php

```php
class User extends Model {

    public function phone()
    {
        return $this->hasOne('App\Phone');
    }

}
```

hasOne 메소드의 첫번째 인자는 관계된 모델의 이름입니다. 관계가 정의되고 나면 Eloquent의 동적 속성을 통해서 조회할 수 있습니다

```php
$phone = User::find(1)->phone;
```

위의 구문의 다음과 같은 SQL로 동작합니다.

```sql
select * from users where id = 1

select * from phones where user_id = 1
```

Eloquent는 모델의 이름을 기반으로 관계된 외래 키를 추정한다는 것에 주의하십시오. 이 경우, Phone 모델은 user_id 외래 키를 사용 한다고 가정합니다. 만약 이러한 규칙을 재정의 하고자 한다면, hasOne 메소드의 두번째 인자로 외래 키로 사용하고자 하는 컬럼명을 전달하면 됩니다. 더불어, 세번째 인자로 어떠한 로컬 컬럼이 연결에 사용될지 명시 할 수도 있습니다:

```php
return $this->hasOne('App\Phone', 'foreign_key');

return $this->hasOne('App\Phone', 'foreign_key', 'local_key');
```

#### 역관계 정의하기
Phone 모델에서 관계 설정의 반대, 즉 역관계를 정의하기 위해서는 `belongsTo` 메소드를 사용하면 됩니다.
`경로` app/Phone.php

```php
class Phone extends Model {

    public function user()
    {
        return $this->belongsTo('App\User');
    }

}
```

위의 예제에서 Eloquent는 phones 테이블에서 user_id 컬럼을 찾을 것입니다.
만약 여러분이 따로 외래키를 정의하였다면 `belongsTo` 메소드에 두번째 인자로 이 키를 전달하면 됩니다.

```php
class Phone extends Model {

    public function user()
    {
        return $this->belongsTo('App\User', 'local_key');
    }

}
```

추가적으로, 새번째 인자로 부모 테이블과 연결된 컬럼명을 전달 할 수도 있습니다:

```php
 class Phone extends Model {

     public function user()
     {
         return $this->belongsTo('App\User', 'local_key', 'parent_key');
     }

 }
```

### 일대다 관계 정의하기
예를 들어 한 명의 사용자는 여러개의 게시글을 쓸 수 있고, 각 게시물은 글쓴이가 한 명이 존재한다 라는 관계를 우리는 일대다의 관계라는 용어를 사용합니다.

```
$ php artisan make:migration create_boards_table --create=boards
```

`경로` database/migrations/TIMESTAMP_create_boards_table.php

```php
class CreateBoardsTable extends Migration
{
    public function up()
    {
        Schema::create('boards', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('user_id')->unsigned()->index();
            $table->string('title');
            $table->text('content');
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')
                  ->onUpdate('cascade')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::drop('boards');
    }
}
```

#### 관계 설정

```
$ php artisan make:model Board
```

`경로` app/Board.php

```php
class Board extends Model
{
    protected $fillable = ['title', 'content'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
```

`경로` app/User.php

```php
class User extends Authenticatable
{
    public function boards()
    {
        return $this->hasMany(Board::class);
    }
}
```

#### 팅커 링

```
$ php artisan tinker
```

* 유저 id = 1 이 게시글을 남길때의 쿼리

```
Psy Shell v0.8.18 (PHP 7.2.4 — cli) by Justin Hileman
>>> App\User::find(1)->boards()->create(['title' => 'First board','content' => 'content']);
=> App\Board {#767
     title: "First board",
     content: "content",
     user_id: 1,
     updated_at: "2018-04-29 07:55:15",
     created_at: "2018-04-29 07:55:15",
     id: 1,
   }
>>>
```

* 생성한 게시 글에 대한 조회

```
>>> App\User::find(1)->boards()->get();
// 출력 결과 생략
>>> App\Board::find(1)->user()->first();
```
