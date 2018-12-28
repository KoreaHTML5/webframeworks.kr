---
layout : tutorials
category : tutorials
title : PHP 라라벨 5 On Mac - 12.마이그레이션 (컬럼 추가 및 데이타 스토리 엔진 설정)
subcategory : setlayout
summary : PHP 라라벨 5에 대해 알아봅니다.
permalink : /tutorials/weplanet/Laravel12
author : danielcho
tags : laravel
title_background_color : F1F71A
---





> 생성된 마이그레이션에 커넥션 및 스토리 엔진을 설정하고 컬럼을 생성 하겠습니다.

**준비사항**

* artisan CLI 를 통해 생성된 마이그레이션 파일(/myProject/database/migrations/*)

**MySQl Query**

```sql
mysql > CREATE TABLE boards(
    -> id INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
    -> contexts VARCHAR(255) NULL,
    -> user_id INT(11) NOT NULL
) ENGINE=InnoDB;
```

앞장에서 마이그레이션 생성을 통해 컬럼 id만 생성되었고 여기에 추가로 다음과 같이 컬럼 및 엔진을 추가하도록 하겠습니다.

```php
<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateBoardsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('boards', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->string('name', 255)->nullable();
            $table->integer('user_id')->index();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('boards');
    }
}
```

`Tip` timestamps() 메소드를 사용하면 테이블에 created_at, updated_at 컬럼을 자동으로 만들어 주게 됩니다. 이 컬럼은 데이타의 삽입/갱신시 사용되는 컬럼으로 다른 컬럼명으로 사용하려면 timestamp() 메소드에 컬럼명을 적어주면 되며 다음은 delete_at 이라는 컬럼을 생성하는 예제입니다

```php
$table->timestamp('delete_at');
```

### 기본 커넥션이 아닌 다른 데이타베이스 커넥션 설정

```php
Schema::connection('foo')->create('boards', function ($table) {
    $table->increments('id');
});
```

### 테이블에 스토리 엔진 속성 설정

```php
Schema::create('boars', function ($table) {
    $table->engine = 'InnoDB';

    $table->increments('id');
});
```

### 컬럼 생성

이미 존재하는 테이블을 변경하기 위해서, `Schema` 파사드의 `table` 메소드를 사용할 것입니다. `create` 메소드와 같이 `table` 메소드도 두개의 인자를 전달 받습니다, 하나는 테이블의 이름이고 ,다른 하나는 테이블에 컬럼을 추가하는데 사용할 수 있는 `Blueprint` 인스턴스를 받아들이는 `Closure`입니다

다음은 사용가능한 컬럼의 타입입니다.

명령 | 설명
--------- | ---------
$table->bigIncrements('id'); | UNSIGNED BIG INTEGER"에 해당하는 Incrementing ID (프라이머리 키).
$table->bigInteger('votes'); | 데이터베이스의 BIGINT.
$table->binary('data');	| 데이터베이스의 BLOB.
$table->boolean('confirmed');	| 데이터베이스의 BOOLEAN.
$table->char('name', 4); | CHAR에 해당하며 길이(length)를 가짐.
$table->date('created_at');	| 데이터베이스의 DATE.
$table->dateTime('created_at');	| 데이터베이스의 DATETIME.
$table->decimal('amount', 5, 2); |	유효값과 소수 자릿수를 지정한 DECIMAL
$table->double('column', 15, 8); |	15자리, 소수점 8자릿수를 지정한 DOUBLE .
$table->enum('choices', ['foo', 'bar']);	| 데이터베이스의 ENUM.
$table->float('amount'); |	데이터베이스의 FLOAT.
$table->increments('id');|	"UNSIGNED INTEGER"에 해당하는 Incrementing ID (프라이머리 키).
$table->integer('votes');|	데이터베이스의 INTEGER.
$table->json('options');|	데이터베이스의 JSON.
$table->jsonb('options');|	데이터베이스의 JSONB.
$table->longText('description');|	데이터베이스의 LONGTEXT.
$table->mediumInteger('numbers');|	데이터베이스의 MEDIUMINT.
$table->mediumText('description');|	데이터베이스의 MEDIUMTEXT.
$table->morphs('taggable');|	taggable_id INTEGER와 taggable_type STRING 추가.
$table->nullableTimestamps();|	timestamps()와 동일하지만 NULL 허용.
$table->rememberToken();|	remember_token을 VARCHAR(100) NULL로 추가.
$table->smallInteger('votes');|	데이터베이스의 SMALLINT.
$table->softDeletes();|	soft delete할 때 deleted_at 컬럼을 추가함.
$table->string('email');|	VARCHAR에 해당하는 컬럼.
$table->string('name', 100);|	VARCHAR에 해당하며 길이(length)를 가짐.
$table->text('description');|	데이터베이스의 TEXT.
$table->time('sunrise');|	데이터베이스의 TIME.
$table->tinyInteger('numbers');|	데이터베이스의 TINYINT.
$table->timestamp('added_on');|	데이터베이스의 TIMESTAMP.
$table->timestamps();|	created_at과 updated_at 컬럼을 추가함.
$table->uuid('id');|	데이터베이스의 UUID에 해당.
