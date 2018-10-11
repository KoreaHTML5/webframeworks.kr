---
layout : tutorials
category : tutorials
title : PHP 라라벨 5 On Mac - 6.프레임웍 Global 설정
subcategory : setlayout
summary : PHP 라라벨 5에 대해 알아봅니다.
permalink : /tutorials/weplanet/Laravel06
author : danielcho
tags : laravel
title_background_color : F1F71A
---






> Code Editor 는 phpStom을 권장한다. 기본적으로 1달은 무료로 사용할 수 있다. 또한 DB Client 는 [Sequel Pro](http://www.sequelpro.com/download) 또는 [WorkBench](https://mariadb.com/kb/en/library/database-workbench/) 그리고 DATA GRID 등 편한 툴을 이용하기 바랍니다.

### .env
> .env에 써진 값들을 config/**.php 에서 env(string $key)로 읽을 수 있다. 기존 php CodeIgniter 로 프로젝트를 진행할 당시에는 config/database.php 에 직접 하드코드로 작성하였다. `.env`로 작성했을 때의 장점은 다음과 같다.

* local, staging, production 등 어플리케이션 실행 환경에 따라 설정 값이 바뀌어야 할 때 유연하게 대응할 수 있다.
* 패스워드 등 민감한 정보를 버전 컨트롤에서 제외하기 위해서다. (.gitignore 파일을 확인해 보자.)

```
APP_ENV=local           # 실행환경
APP_DEBUG=true          # 디버그 스위치
APP_KEY=                # 32bit Application Key
```

> `.env`파일이 없다면 생성하자. 기본적으로 `.env.example` 파일을 이용하도록 합니다.

```
$ cp .env.example .env
$ cp config.example config
```

### Application key
> `.env` 에 설정된 APP_KEY 값은 라라벨 프레임웍 전반에 걸쳐 Cipher 알고리즘에서 Seed 값으로 사용된다. 설정되어 있지 않다면 꼭 설정해야 합니다.

```
$ php artisan key:generate
```
또는,

[Random Keygen]( https://randomkeygen.com) 에서 직접 작성하여 붙여 넣어도 됩니다.

### DB 연결
> 라라벨에서는 `.env` 파일 수정만으로 DB 설정이 가능합니다.

```
DB_HOST=localhost
DB_DATABASE=myProject
DB_USERNAME=homestead
DB_PASSWORD=secret
```

`참고` Homestead에 설치된 MySql에 접속하려면, port를 33060으로 설정해야 합니다.
