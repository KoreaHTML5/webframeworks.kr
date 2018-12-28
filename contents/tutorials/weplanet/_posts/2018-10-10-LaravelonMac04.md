---
layout : tutorials
category : tutorials
title : PHP 라라벨 5 On Mac - 4.프레임웍 기본 설치 및 기본 설정
subcategory : setlayout
summary : PHP 라라벨 5에 대해 알아봅니다.
permalink : /tutorials/weplanet/Laravel04
author : danielcho
tags : laravel
title_background_color : F1F71A
---





> 개발 생산성을 높이기 위해 환경변수 세팅합니다.

```
#composer 전역 사용 추가
$ export PATH="$PATH:$HOME/.composer/vendor/bin"

#valet 전역 사용 추가
$ export PATH=""$PATH:$HOME/.composer/vendor/bin/valet"

# 앞으로 자주 쓰게될 php artisan 대신 artisan 만 치면 된다.
# 열린 파일 맨 끝에 써 넣는다.
$ alias artisan="php artisan"
```

1\. Composer를 이용하여 라라벨 인스톨러를 설치

```
$ composer global require "laravel/installer=~1.1"
```

2\. 효율적인 프로젝트 관리를 위해 project 디렉토리 설정

```
$ mkdir ./project
$ cd project
# 사용자 권한 추가
$ chown -R [username] project
```

3\. Laravel Installer 로  라라벨 5 설치

```
$ laravel new myProject
$ cd myProject
$ php artisan --version # Laravel Framework version 5.x
$ chmod -R 777 storage bootstrap/cache
```


4\. 서버를 부트업하고 라라벨 확인

```
$ php artisan serve # 종료하려면 control+c
# Laravel development server started on http://localhost:8000/
```

또는,

- valert 을 설치 하였다면

```
$ cd  myProject
$ valet start
# http://myProject.dev 로 접속
```

![Alt text](../imgs/hello-laravel-img-01.png)
