---
layout : tutorials
category : tutorials
title : PHP 라라벨 5 On Mac - 1.들어가며
subcategory : setlayout
summary : PHP 라라벨 5에 대해 알아봅니다.
permalink : /tutorials/weplanet/Laravel01
author : danielcho
tags : laravel
title_background_color : F1F71A
---





## 다루게 된 배경

위플래닛에서는 기본적으로 NodeJS를 이용해 백엔드를 개발합니다. 가장 큰 이유는 ‘모든 개발자가 다룰 수 있는‘ 공통의 기술을 정하기 위함이었고, 이는 1) 개발 생산성이 좋고, 2) 배우기 쉬우며, 3) 협업이 가능해야 한다고 생각했습니다. 물론 NodeJS만을 사용했던 것은 아닙니다. 두 번째 백엔드 언어로 PHP를 꾸준히 사용해왔고, 최근까지 일부 프로젝트는 CodeIgniter로 개발되었습니다. 하지만 여전히 ‘남이 짠’ PHP 코드를 수정하는건 쉽지 않다는 것이 내부 결론이었습니다.

하지만 최근에 PHP 라라벨을 이용한 프로젝트를 진행하게되었고, @steven이 이를 담당하면서 라라벨을 새로 접하게 되었습니다. 이 연재는 라라벨을 새롭게 접하면서 알게된 내용을 맥OS 사용자의  관점으로 정리합니다. 내부 팀 공유를 기본 목적으로 하고 작성하였으나, 누군가에게 도움이 될 것이라는 기대감에 공유합니다.





## 다루게 될 내용

맥 사용자를 대상으로 글을 작성하였고, PHP 언어에 대한 내용은 생략하고 라라벨 프레임워크에 대해서만 최대한 간략하게 기술하고자 노력했습니다. 

- 라라벨 특징
- Mac에서의 PHP 설치
- Homestead 설치 (On Mac)
- Homestead 설치 (On Window)
- Composer 설치
- Valet 설치
- 개발 생산성을 위한 세팅
- 라라벨 프레임워크 구조
- 라라벨 프레임워크 Routing 세팅
- 라라벨 프레임워크 템플릿 - 블레이드 템플릿
- DB Connection 세팅
- DB ORM - 엘리쿼트 ORM
- 라라벨 프레임워크 모델
- 라라벨 프레임워크 Component
- Envoy 배포
- 실무 - 기본세팅
- 실무 - 사용자 로그인
- 실무 - 소셜 로그인
- 실무 - 다국어 지원
- 실무 - API 기획 및 서비스 구축
- 실무 - JWT를 이용한 인증
- 실무 - 리소스 id 난독화
- 실무 - AWS EC2 세팅
- 실무 - Envoy를 이용한 배포

라라벨은 PHP 언어로  짜여진 MVC 아키텍처를 지원하는 웹 프레임워크입니다. 루비의 레일즈, 파이썬의 장고와 대칭되는 존재라고 보면 됩니다. [SitePoint](https://www.sitepoint.com/best-php-framework-2015-sitepoint-survey-results/) 의 2015년 설문조사에 따르면, 라라벨은 (국외에서) 가장 인기 있는 PHP 프레임워크로 알려져 있습니다. 국내에서 개발된 CMS 중 사용자/사이트 수 측면에서 수위권에 있는 XE에서도 차기 버전인 XE3는 라라벨로 전환한다고 발표한 바 있습니다. Javascript 기반의 백엔드 프레임워크가 대중화되고, Ruby 등 신선한 대안들의 인기가 줄어들었지만, 라라벨은 어느정도 자리를 잡아가는 분위기입니다. 

참고로, 라라벨 개발에 있어 윈도우는 프롬프트 사용으로 인해 생산성이 떨어질 수 있기 때문에 가급적 리눅스 또는 Mac 사용을 권장드립니다.





## 특징

- 단순하고 (어느정도는 쉽고) 우아한 문법
- 복잡한 것들은 프레임워크 내에서 처리
- 강력한 확장 기능들
- PSR(PHP Standards Recommendations) 적용
- 모던 개발 방법론 적용
- RAD (Rapid Application Development)





## 라라벨의 특징, 철학

- 개발 생선성 : 라라벨은 다른 PHP 프레임웍에  비해 '무겁다', '느리다'라는 의견이 일반적이다. 이는 라라벨이 개발 생산성에 초점을 맞추고 있기 때문이다. 따라서 소규모 프로젝트에 라라벨을 적용하는 것이 바람직한지는 논란의 여지가 있다. 





## 내장 기능

- 웹 서비스를 위해 필요한 Cache, Queue, Mail 등
- Service Container 를 이용한 의존성 자동 주입
- Cron 자동
- Elixir를 이용한 CSS/Sass/Less, JS/Coffee 등 프론트 엔드 워크 플로우 자동화





## 확장 기능

- Homestead/Valet 로 개발 환경 표준화
- Socialite를 이용한 간편한 소셜 인증
- Cashier를 이용한 간편한 결제 기능 구현
- Envoy로 SSH 원격 작업 자동화





## 확장 서비스

- Forge를 이용하여 서버 프로비저닝/서버 관리/코드 배포 자동화
- Envoyer를 이용하여 무중단 코드 배포





## 커뮤니티

- [라라벨 뉴스](https://laravel-news.com/) - 프레임워크 코어 멤버 중의 한명인 Eric Barnes 가 운영하는 뉴스 블로그. 라라벨 개발자라면 꼭 가입해서 구독할만한 정보 제공
- [라라 캐스트](https://laracasts.com/) - 역시 코어 멤버 중의 한명인 Jeffrey Way가 운영하는 동영상 강의 서비스. 매주 2~3개의 강의가 올라오며, 기존에 작성된 거의 400편에 가까운 동영상 강의 참고 가능
- [LARAVEL.IO](https://laravel.io/forum) - 라라 캐스트 전에 가장 활발한 활동을 하던 포럼
- [Codecourse](https://www.youtube.com/user/phpacademy) - phpacademy 란 채널이 최근이 이름이 바뀌었으며, 무료 동영상 강의 제공





## 메뉴얼

- [한국어 메뉴얼](https://laravel.kr/docs)

그리고 앞으로 진행될 설치 및 기능 구현을 위해 7.x 이상의 버전 사용을 권장합니다. 





