---
layout : tutorials
category : tutorials
title : PHP 라라벨 5 On Mac - 11.마이그레이션 (create Table)
subcategory : setlayout
summary : PHP 라라벨 5에 대해 알아봅니다.
permalink : /tutorials/weplanet/Laravel11
author : danielcho
tags : laravel
title_background_color : F1F71A
---





> 기존 MySql 인 경우 테이블 생성을 직접 작성하여 진행하였지만 artisan CLI를 통해 테이블을 생성하도록 하겠습니다.

**준비사항**

* laravel Installer 를 이용한 프레임웍 세팅 완료
* node 설치 후 세팅된 프레임웍 위치에서 npm intall 완료

다음 쿼리를 migration을 이용하여 생성하도록 하겠습니다.

**MySQl Query**

```sql
mysql > CREATE TABLE boards(
    -> id INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
    -> contexts VARCHAR(255) NULL,
    -> user_id INT(11) NOT NULL
) ENGINE=InnoDB;
```

`PATH` /project/myProject

```
# 테이블 명은 첫 글자를 대문자를 원칙으로 작성하면 됩니다.
$ php artisan make:model [테이블 명] --migration
```

![Alt text](../imgs/migration-laravel-img-01.png)

그림과 같이 기본 생성된 users 와 password 파일과 지금 작성한 boards 파일이 생성된 것을 볼 수 있다.
주의 할 점은 마이그레이션 파일들은 파일명에 timestamp가 추가 되있다. timestamp의 역할은 생성 순서를 정의하기 위함이기 때문에 외래키로 관계를 설정되어 있을경우 순서가 틀렸을 경우 해당 timestamp의 값을 순서에 맞게 수정해야합니다.

생성한 파일을 열어보면 다음과 같이 생성된 것을 볼 수 있습니다.

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
            $table->increments('id');
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

### 마이그레이션의 구조
> 마이그레이션 클래스는 up(), down() 두개의 메소드를 가지고 있습니다. up() 은 데이타베이스에 테이블, 컬럼, 인덱스를 추가하는데 사용되는 반면 down() 메소드는 단순히 up() 메소드를 취소합니다.

### 마이그렝션 되돌리기
생성한 마이그래이션을 롤백을 원할 경우 다음과 같이 CLI 명령을 실행하면 됩니다.

```
# 여러 마이그레이션 파일에 대해서 될릴 수 있다
$ php artisan migrate: rollbaack


# 모든 마이그레이션 파일에 대해서 되돌릴 경우
$ php artisan migrate: reset

# 하나의 명령으로 되돌리기와 실행을 할 경우
$ php artisan migrate: refresh --seed
```
