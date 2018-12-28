---
layout : tutorials
category : tutorials
title : PHP 라라벨 5 On Mac - 5.프레임웍 구조 살펴보기
subcategory : setlayout
summary : PHP 라라벨 5에 대해 알아봅니다.
permalink : /tutorials/weplanet/Laravel05
author : danielcho
tags : laravel
title_background_color : F1F71A
---





> 기본 설치가 되었으면 생성된 프로젝트 구조 및 동작 시퀀스 그리고 각 파일 및 디렉터리의 역할을 살펴보자

1\. 프로젝트 구조

```
.
├── .env                              # 글로벌 설정 중 민감한 값, dev/production 등 앱 실행환경에 따라 변경되어야 하는 값을 써 놓는 곳
├── app
│   ├── Console
│   │   ├── Commands                  # 콘솔 코맨드 하우징
│   │   └── Kernel.php                # 콘솔 코맨드, 크론 스케쥴 등록
│   ├── Events                        # 이벤트 클래스 하우징
│   ├── Exceptions                    # Exception 하우징
│   │   └── Handler.php               # 글로벌 Exception 처리 코드
│   ├── Listeners                     # 이벤트 핸들러
│   ├── Jobs
│   ├── Policies
│   ├── Http                          # Http 요청 처리 클래스들의 하우징
│   │   ├── Controllers               # Http Controller
│   │   ├── Kernel.php                # Http 및 Route 미들웨어 등록
│   │   ├── Middleware                # Http 미들웨어 하우징
│   │   ├── Requests                  # Http 폼 요청 미들웨어 하우징
│   │   └── routes.php                # Http 요청 Url을 Controller에 맵핑시키는 규칙을 써 놓은 테이블
│   └── Providers                     # 서비스 공급자 하우징 (config/app.php에서 바인딩 됨)
│       ├── AppServiceProvider.php
│       ├── AuthServiceProvider.php
│       ├── EventServiceProvider.php  # 이벤트 리스너, 구독 바인딩
│       └── RouteServiceProvider.php  # 라우팅 바인딩 (글로벌 라우팅 파라미터 패턴 등이 등록되어 있음)
├── composer.json                     # 이 프로젝트의 Composer 레지스트리, Autoload 규칙 등이 담겨 있다. (c.f. Node의 package.json)
├── config                            # database, queue, mail 등 글로벌 설정 하우징
├── database
│   ├── migrations                    # 데이터베이스 스키마
│   └── seeds                         # 생성된 테이블에 Dummy 데이터를 삽입하는 클래스들 (개발 목적)
├── gulpfile.js                       # Elixir (프론트엔드 빌드 자동화) 스크립트
├── public                            # 웹 서버에 의해 지정된 Document Root
├── resources
│   ├── assets                        # JavaScript, CSS 하우징
│   ├── lang                          # 다국어 지원을 위한 언어 레지스트리 하우징
│   └── views                         # 뷰 파일 하우징
├── storage                           # Laravel5 파일 저장소
└── vendor                            # composer.json의 저장소
```


![Alt text](../imgs/hello-laravel-img-02.png)

> 위 그림과 같이 설치된 상태이다 그림 2.에서 왼쪽에 빨간색으로 표시된 Laravel (laravel/laravel) 과 Framework (laravel/framework) 가 설치된 상태이다. 별도로 분리해 놓은 이유는 Framework 요소가 Laravel 이 아닌, 가령 Lumen 처럼 다른 프로젝트에서도 사용할 수 있도록 하기 위해서이다.
라라벨이 제공하는 문법과 API 들을 이용해서 User Code (appkr/l5essential) 라고 표시된, 커스텀 서비스를 만들게 된다. 이 과정에서 라라벨에서 제공하는 기본 기능외에 외부의 패키지들, User-pulled 3rd Party Packages 라 표시된 부분들도 가져와서 사용할 수도 있다.

2\. 라라벨 기본 시퀀스

![Alt text](../imgs/hello-laravel-img-03.png)
