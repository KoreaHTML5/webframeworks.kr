---
layout : tutorials
category : tutorials
title : PHP 라라벨 5 On Mac - 15.Laravel Tinker Shell
subcategory : setlayout
summary : PHP 라라벨 5에 대해 알아봅니다.
permalink : /tutorials/weplanet/Laravel15
author : danielcho
tags : laravel
title_background_color : F1F71A
---





> 라라벨에서 tinker('어설프게 손보고 고치다')라는 코맨드를 제공합니다. 많이 사용하고 있는 MySQl-WorkBench, DataGrid 툴도 있지만 라라벨의 모든 환경에서 동작하고 쉽게 테스트 할 수 있는 정도의 쿼리를 빌드한다면 한번 이용해 보는 것도 좋은 방법일 듯 합니다. 물론 이제 사용해 보면 약간 불편한 것도 사실입니다.

### Laravel Tinker Shell 이란?

 * PsySH 콘솔을 사용하는 강력한 REPL(Read-Eval-Print-Loop)
 * REPL 이란  단일 사용자 입력을 받아 평가하고 결과를 사용자에게 반환하는 대화 형 셸 유형
 * 셸의 명령 줄에서 Laravel 응용 프로그램과 상호 작용
 * [공식 문서](http://psysh.org/)


### 시작하기

```
$ php artisan tinker
Psy Shell v0.8.18 (PHP 7.2.4 — cli) by Justin Hileman
>>>
```

### insert
앞서 마이그레이션 하여 생성한 테이블에 tinker를 사용하여 insert 과 DB Query를 살펴보도록 하겠습니다.

```
mysql> insert into boards(name, user_id) values('steven', 1);
```

```
$ php artisan tinker
Psy Shell v0.8.18 (PHP 7.2.4 — cli) by Justin Hileman
>>>DB::insert('insert into boards(name, user_id) values(?, ?)', ['steven','1']);
=> true
```

**사용법**

`DB::insert('insert into 테이블명(컬럼1, 컬럼2 ...) values(? , ? ...)', [값1, 값2 ...]);`

### selectOne
위에서 추가한 내용을 확인시 다음과 같이 쉘 명령을 내리면 Object 형식으로 응답이 오는 것을 확인할 수 있습니다.

```
>>> $board = DB::selectOne('select * from boards where user_id = ?',[1]);
=> {#759
     +"id": 1,
     +"name": "steven",
     +"user_id": 1,
     +"created_at": null,
     +"updated_at": null,
   }
>>>
```

**사용법**

`DB::selectOne('select 컬럼명 from 테이블명 where [조건]', [값]);`


### update
해당 데이타에 대해 업데이트 방법은 다음과 같습니다.

```
>>> DB::update('update boards set name="steven1004" where user_id = ?', [3]);
=> 0 # 해당 내용에 대해 업데이트 실패 시 결과 값
>>> DB::update('update boards set name="steven1004" where user_id = ?', [1]);
=> 1 # 해당 내용에 대해 업데이트 성공 시 결과 값
>>>
```
