---
layout : tutorials
category : tutorials
title : PHP 라라벨 5 On Mac - 2.Composer
subcategory : setlayout
summary : PHP 라라벨 5에 대해 알아봅니다.
permalink : /tutorials/weplanet/Laravel02
author : danielcho
tags : laravel
title_background_color : F1F71A
---





## 들어가며

Composer는 PHP로 개발할 때 패키지간의 의존성을 관리하는 의존성 관리자이다. [NodeJS](https://nodejs.org)의 NPM, Ruby의 Bundle과 같은 역할을 수행합니다. 즉, PHP로 개발하는데 있어서 다양한 패키지들을 설치하고, 의존성을 관리하며 Autoload를 사용하는데 꼭 필요한 도구입니다.

### [공식사이트 바로가기](https://getcomposer.org/)



### 사용환경

* php 5.3.2+ 이상



### 패키지 검색
Composer를 통해서 설치할 수 있는 패키지는 [Packagist](https://packagist.org/)에서 검색하여 추가할 수 있다. 

### [API 바로가기](https://getcomposer.org/apidoc/master/index.html)



### 한국어 매뉴얼

* [Naver D2](https://developers.naver.com/main/)
* [Xpressengine](https://www.xpressengine.com/)



### 라이센스

* MIT



### 설치 On Mac
```
$ brew tap josegonzalez/homebrew-php
$ brew install josegonzalez/php/composer
$ composer install
$ composer --version
```

첫번째 설치 중 권한 이슈가 발생하는 경우, Sudo 권한으로 이를 변경해준다. 

`sudo chown -R $(whoami) /usr/local/Cellar`

이와 유사하게 설치 중 이슈가 발생한다면 에러 메시지, 또는 에러 메시지와 함께 보여지는 '이런걸 해보세요'라는 메시지를 잘 읽고 따라하면 대부분의 이슈가 해결된다.



### 설치 On Windows

[관련 페이지](http://getcomposer.org/download)에서 Composer-Setup.exe 를 클릭하여 다운로드한 후 실행한다. 설치 마법사의 가이드를 따라서 설치하고, 완료할 수 있다. Composer 버전에 따라 설치 화면이 달라질 수 있기 때문에 별도의 상세 안내는 생략한다.



### 개발된 프로젝트에 Composer Install
```
# github clone 또는 프로젝트 파일을 복사한 곳으로 이동
$ composer install
```
이미 프로젝트를 진행하고 있고, Model이 정의되어 있으며, Database Configuration Script 가 정의되어 있다면 위와 같은 명령어를 입력하면 모든 세팅이 완료된다.