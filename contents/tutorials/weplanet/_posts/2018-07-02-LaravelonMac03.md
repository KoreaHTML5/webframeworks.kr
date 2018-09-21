---
layout : tutorials
category : tutorials
title : PHP 라라벨 5 On Mac - 3.Valet
subcategory : setlayout
summary : PHP 라라벨 5에 대해 알아봅니다.
permalink : /tutorials/weplanet/Laravel03
author : danielcho
tags : laravel
title_background_color : F1F71A
---





## 들어가며

발렛은 Mac 만을 지원하며, Vagrant / Apache / Nginx / "/etc/hosts" 파일도 필요하지 않습니다. 심지어 로컬 터널을 사용하여 사이트를 공유할 필요도 없습니다. Mac외의 운영 체제에서는 홈스테드를 선택하면 됩니다.



### 프레임워크 지원

* Laravel
* Lumen
* Symfony
* Zend
* CakePHP 3
* WordPress
* Bedrock
* Craft
* Statamic
* Jigsaw
* Static HTML



### 설치하기
```
$ composer global require laravel/valet~/.composer/vendor/bin/valet install

# 추가로 설치

$ brew install xdebug-osx
$ brew install drush
$ brew install infection
$ brew install dnsmasq

$ valet start
```

발렛이 설치되고나면, 터미널에서 ping [프로젝트 명].dev 와 같은 명령어를 사용하여 도메인으로 연결되었는지 확인하면, 127.0.0.1 로부터의 응답을 확인할 수 있습니다.



### Valet Park & Valet Link

발렛이 설치되면 라라벨 사이트를 구동하는데에 두가지 명령어를 제공합니다.



1) Park

* Mac 에 mkdir ~/Sites와 같은 명령어를 실행하여 새로운 디렉토리를 생성합니다.
* cd ~/Sites 와 valet park을 실행합니다. 이 명령어는 현재 작업 디렉토리를 사이트로 접속했을 때 발렛이 찾게 되는 디렉토리로 등록합니다.
* 이 디렉토리에서 새로운 라라벨 사이트를 생성합니다: laravel new blog.
  브라우저에서 http://blog.dev 사이트를 열어서 확인합니다

2) Link: 사이트를 동작시킬 때 사용 (하나의 디렉토리 안에 한 개의 사이트를 제공할 때)
* 프로젝트 중 하나의 디렉토리에 대해서 터미널에서 valet link app-name 을 실행합니다.
* 발렛은 현재 작업 디렉토리를 ~/.valet/Sites가 지정하도록 심볼릭 링크를 생성할 것입니다.
  link 명령어를 실행한 다음에, 브라우저에서 http://app-name.dev 로 접속할 수 있습니다.
* 링크로 연결된 모든 목록은 valet links 로 확인 하면 됩니다.



### TLS를 사용한 안전한 사이트

기본적으로 발렛은 일반적인 HTTP를 통해서 제공합니다, 하지만 HTTP/2를 사용하여 TLS 암호화되어 제공하려면 secure 명령어를 사용합니다. 예를 들어 laravel.dev 도메인을 발렛을 통해 제공하고자 한다면 다음과 같이 실행하면 됩니다.



`$ valet secure laravel`

일반적인 접속을 원할 경우,

`$ valet unsecure laravel`



### Valet Share (사이트 공유)

발렛은 로컬 사이트 및 외부와도 공유하는 기능을 기본적으로 제공하기 합니다. 이를 실행하기 위해서는 터미널 상에서 해당 사이트가 있는 디렉토리로 이동한 후,



`$ valet share`

명령어를 입력하면, 공개된 URL이 클립보드에 복사되고 브라우저에서 직접 붙여넣을 수 있습니다. 

(종료는 control + C )



### Valet Logs

전체 사이트에 대한 모든 로그를 터미널에서 스트림을 통해 제공합니다. 



### 기타 Valet 명령어

전체 사이트에 대한 모든 로그를 터미널에서 스트림을 통해 제공합니다. 

| 명령어          | 설명                                                         |
| --------------- | ------------------------------------------------------------ |
| valet forget    | parked 디렉토리 목록에서 디렉토리를 제거하기 위해서는 "parked" 된 디렉토리에서 이 명령어를 실행 |
| valet paths     | "parked" 된 모든 경로를 확인합니다.                          |
| valet restart   | 발렛 데몬을 재시작 합니다.                                   |
| valet start     | 발렛 데몬을 시작합니다.                                      |
| valet stop      | 발렛 데몬을 중지합니다.                                      |
| valet uninstall | 발렛 데몬을 완전히 삭제합니다.                               |