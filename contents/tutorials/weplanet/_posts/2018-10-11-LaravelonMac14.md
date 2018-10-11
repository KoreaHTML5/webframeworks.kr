---
layout : tutorials
category : tutorials
title : PHP 라라벨 5 On Mac - 14.마이그레이션 (컬럼 수정)
subcategory : setlayout
summary : PHP 라라벨 5에 대해 알아봅니다.
permalink : /tutorials/weplanet/Laravel14
author : danielcho
tags : laravel
title_background_color : F1F71A
---





> 이미 생성된 마이그레이션 테이블 속성에 대한 수정을 알아보도록 하겠습니다. 애플리케이션을 변경할 경우 스키마도 같이 변경해야 하는 경우가 많으며 라라벨 migration 은 스키마의 버전 관리가 가능하므로 잦고 사소한 변경 작업시 특히 유용합니다


### 컬럼 수정하기

`주의` 컬럼을 수정하기 전에, 꼭 composer.json 파일에 doctrine/dbal 의존성을 추가하십시오. Doctrine DBAL 라이브러리는 컬럼의 현재 상태를 확인하고 필요한 SQL 쿼리를 생성하여 컬럼에 지정된 변경사항을 수행하기 위해 사용됩니다.

**컬럼의 속성 변경하기**

`change` 메소드는 이미 존재하는 컬럼을 새로운 타입으로 수정하거나 컬럼의 속성을 변경할 수 있게 해줍니다. 예를 들어, 문자열 컬럼의 사이즈를 늘이고 싶을 수 있습니다. change 메소드가 어떻게 작동하는지 contexts 컬럼 사이즈를 255에서 200으로 늘여서 확인해 보겠습니다:

```php
Schema::table('boards', function ($table) {
    $table->string('contexts', 200)->change();
});
```

컬럼을 nullable로 수정할 수도 있습니다:

```php
Schema::table('boards', function ($table) {
    $table->string('boards', 200)->nullable()->change();
});
```

**컬럼의 이름 변경하기**

컬럼의 이름을 변경하기 위해서, 스키마 빌더에 `renameColumn` 메소드를 사용할 수 있습니다. 컬럼의 이름을 바꾸기 전에 반드시 composer.json 파일에 doctrine/dbal 의존성을 추가하십시오:

```php
Schema::table('boards', function ($table) {
    $table->renameColumn('contexts', 'context');
});
```

`주의` 테이블의 `enum` 컬럼의 이름을 바꾸는 것은 현재 지원되지 않습니다.

**컬럼 삭제하기**

컬럼을 삭제하기 위해서는, 스키마 빌더에서 `dropColumn` 메소드를 사용하면 됩니다.

```php
Schema::table('boards', function ($table) {
    $table->dropColumn('context');
});
```

`dropColumn` 메소드에 컬럼 이름들의 배열을 전달하면 테이블에서 여러 개의 컬럼을 없앨 수 있습니다.

```php
Schema::table('users', function ($table) {
    $table->dropColumn(['context', 'user_id']);
});
```

`주의` SQLite 데이터베이스의 컬럼을 없애려면, 먼저 composer.json 파일에 doctrine/dbal 의존성을 추가하고 터미널에서 composer update 명령어를 실행하여 라이브러리를 설치해야 합니다.

`주의` SQLite 데이터베이스를 사용하는 중에는, 하나의 마이그레이션 안에서 여러 개의 컬럼을 없애거나 수정할 수 없습니다.

**인덱스 생성하기**

스키마 빌더는 여러 타입의 인덱스를 지원합니다. 우선 컬럼의 값이 유니크 해야 함을 지정하는 예를 살펴보겠습니다. 인덱스를 생성하려면 간단하게 컬럼의 정의에서 `unique` 메소드를 체이닝 하면 됩니다.

```php
$table->string('user_id')->unique();
```

위와 같이 하는 대신에, 컬럼을 정의한 뒤에 인덱스를 생성할 수도 있습니다.
예를 들어:

```php
$table->unique('user_id');
```

인덱스 메소드에 컬럼의 배열을 전달하여 여러개의 인덱스를 생성할 수도 있습니다.

```php
$table->index(['user_id', 'created_at']);
```

**사용가능한 인덱스 타입**

커맨드 | 설명
--------- | ---------
$table->primary('id'); |	프라이머리 키 추가.
$table->primary(['first', 'last']); |	복합 키 추가.
$table->unique('email'); |	유니크 인덱스 추가.
$table->index('state');	|기본적인 인덱스 추가.

**인덱스 삭제하기**

인덱스를 삭제하기 위해서는 인덱스의 이름을 지정해야 합니다. 라라벨은 자동으로 인덱스에 합리적인 이름을 부여하도록 설정되어 있습니다. 간단하게는 테이블 이름, 인덱스된 컬럼의 이름, 그리고 인덱스 타입을 합친것입니다.

**명령어 설명**

명령어 | 설명
--------- | ---------
$table->dropPrimary('users_id_primary'); |	"users" 테이블에서 프라이머리 키 지우기.
$table->dropUnique('users_email_unique'); |	"users" 테이블에서 유니크 인덱스 지우기.
$table->dropIndex('geo_state_index'); | "geo" 테이블에서 기본적인 인덱스 지우기.

제거할 인덱스들에 대한 컬럼들의 배열을 메소드의 인자로 전달하게 되면, 컨벤션에 따라 인덱스 이름은 테이블 이름, 컬럼 그리고 키 타입이 됩니다.

```php
Schema::table('geo', function ($table) {
    $table->dropIndex(['state']); // Drops index 'geo_state_index'
});
```

**외래키 제한**

라라벨은 데이터베이스에서 또한 참조 무결성을 강제하는 외래 키 제한을 생성하는 것을 제공합니다. 예를 들어 users 테이블의 id 컬럼을 참조하는 posts 테이블에 user_id 컬럼을 정의해보겠습니다.

```php
Schema::table('posts', function ($table) {
    $table->integer('user_id')->unsigned();

    $table->foreign('user_id')->references('id')->on('users');
});
```

제한(constraint)의 "on delete"와 "on update" 속성에 원하는 동작을 지정할 수도 있습니다:

```php
$table->foreign('user_id')
      ->references('id')->on('users')
      ->onDelete('cascade');
```

외래 키를 지우기 위해서는 `dropForeign` 메소드를 사용할 수 있습니다. 외래 키 제한은 인덱스와 같은 명명 규칙을 사용합니다. 따라서 테이블 이름과 제한(constraint)의 컬럼들을 합치고 뒤에 "_foreign"을 붙여 사용하겠습니다.

```php
public function down()
{
    Schema::table('posts', function (Blueprint $table) {
        $table->dropForeign('posts_user_id_foreign');
    });
}
```

또는 배열값을 전달하게 되면 자동으로 컨벤션에 따라 생성된 이름이 사용됩니다.

```php
public function down()
{
    Schema::table('posts', function (Blueprint $table) {
        $table->dropForeign(['user_id']);
    });
}
```
