---
layout : getstarted
title : Yeoman, Kickstart your project
category : getstarted
summary : 웹프론트엔드는 각각의 프로젝트별로 다양한 기술을 사용하는 환경을 가지고 있습니다. 그중에서 대표적인 각 기술별로 베스트 프렉틱스(Best Practices) 와 툴이 포함된 프로젝트를 빠르게 생성해주는 도구입니다.
permalink : /getstarted/yeoman
title_background_color : FFCC2F
tags : bower build twitter
author : ragingwind
---

# [Yeoman](http://goo.gl/Ofw4R)

현재 웹프론트엔드 개발은 기존의 특정 벤더나 플랫폼에 종속되어 정해진 학습을 통해서 개발하는 것과 달리 다양한 기술과 각기 다른 사용법과 구조를 가지고 있습니다. Yeoman 은 각 기술을 이용해서 개발할 수 있는 프로젝트를 빠르게 만들 수 있습니다. 각 기술들을 가장 잘 사용할 수 있는 베스트 프렉티스(Best Practices)와 도구를 제공해서 개발자의 생산성을 향상 시킬 수 있습니다. 그러기 위해서 Yeoman 에서는 제레레이터(생성기, Generator) 를 통해서 `Yeoman 워크플로우 (Workflow)` 만들어 사용합니다. 워크플로우는 유용한 도구들와 프레임워크들을 사용해서 Yeoman 방식(Opinionated)으로 구축한 클라이언트 스택 (Client-side satck) 입니다. 이 워크플로우는 개발자들이 장애물 없이 모든 것을 자동으로 구축되어지고 개발자들이 바로 멋진 웹 어플리케이션을 빠르게 만들 수 있도록 도와줍니다.

Yeoman 은 확장 가능한 구조로 설계되어 있으며 다양한 경험과 여러 오픈소스 커뮤니티에서 의견들을 통해서 더 낳은 워크플로우를 지속적으로 개발하고 있습니다.

## Tools

Yeoman 워크플로우는 웹어플리케이션 개발성 향상과 최적화된 웹어플리케이션 빌드 하기위해서 아래와 같은 세가지 도구사용하고 있습니다.

- yo: 스캐폴딩툴(Scaffolding, 개발에 필요한 기반환경)입니다. 새로운 어플리케이션 개발에 필요한 파일을 생성합니다. Grunt 나 Gulp 같은 빌드 시스템에서 사용되는 환경 설정파일하고 필요한 플로그인을 설치합니다. 그리고 선정된 Bower 패키지(프레임워크, 라이브러리)를 사용할 수 있도록 준비하고 디렉토리등 프로젝트에 관련된 기타 사항을 모두 구축합니다.
- Build System: 빌드시스템을 이용해서 웹어플리케이션을 빌드하고 프리뷰 그리고 테스트를 가능하도록 도와주는 툴입니다. Grunt/Gulp 를 사용합니다.
- Package Manager: 패키지 매니저는 워크플로에서 사용되는 프레임워크와 라이브러리 패키지들의 의존성 관리해줍니다. 개발자는 더이상 수동으로 스크립트 파일들을 관리할 필요가 없습니다. npm/Bower 가 사용됩니다.

위 세개의 도구들은 각자 개발되고 관리되지만 Yeoman 에서는 이 도구들을 잘 사용해서 좋은 워크플로우를 개발 할 수 있도록 개발되고 있습니다.

## yo

yo 는 Yeoman 에서 관리는 툴입니다. 제네레이터와 프로젝트 템플릿을 이용해서 프로젝트 기반 환경을 구축합니다. 템플릿에는 개발에 사용되는 도구들에 대한 설정과 기본적으로 필요해서 매번 생성해야 하는 (Boilerplate) 파일이나 리소스를 정해진 디렉토리 구조에 맞게 복사하거나 생성합니다. yo 는 설치된 제네레이터를 통해서 웹어플리케이션을 스캐폴딩합니다. 따라서 원하는 웹어플리케이션을 Yeoman 을 통해서 사용하시려면 별도의 제네레이터를 설치하셔야 합니다. 이 문서에서는 대표적인 오피셜 제네레이터이면서 가장 기본적인 웹어플리케이션을 만들수 있는 `generator-webapp` 과 Angularjs 를 사용할 수 있는 `generator-angular` 의 사용법에 대해서 알아 보겠습니다.

Yeoman 커뮤니티에서는 이외에도 여러가지 웹 프레임워크를 지원하는 제네레이터를 제공합니다. 현재 약 1000 이상의 제네레이터가 존재하고 사용자는 npm 을 통해서 언제든지 설치가 가능합니다. 제네레이터는 크게 오피셜(Official) 제네레이터와 커뮤니티 제네레이터로 나뉩니다. 오피셜 제네레이터는 Yeoman 팀에서 관리하는 제네레이터입니다. 사용가능한 제네레이터는 아래 페이지를 참고하세요.

- [Generators | Yeoman](http://goo.gl/t6trKI)


### Install yo

먼저 yo 는 Nodejs 기반의 도구입니다. 반드시 최신 버전의 Nodejs 를 설치하세요. 설치는 npm 을 통해서 아래와 같이 설치 합니다.

```
npm install -g yo
```

만약 npm 1.2.10 이상을 사용하면 grunt, bower 는 자동으로 설치가 될 것입니다. 아니라면 아래 명령으로 툴을 설치합니다.

```
npm install -g grunt-cli bower
```

### Basic scaffolding, 기본 웹앱 프로젝트 스캐폴딩하기

yo 의 설치가 끝났으면 가장 기본이 되는 웹앱 프로젝트를 위한 제네레이터를 설치하겠습니다. 이름은 `generator-webapp` 입니다. 역시 npm 을 통해서 아래처럼 설치하겠습니다.

```
npm install -g generator-webapp
```

이것은 Yeoman 에서 제공하는 가장 기본적인 형태의 웹앱 프로젝트입니다. 이 프로젝트는 커뮤니티에서 제안하는 `HTML5 Boilerplate`, `jQuery`, `Modernizr`, 그리고 `Bootstrap` 을 포함하고 있으며 사용하는 개발자는 설치 옵션을 통해서 사용/미사용을 선택할 수 있습니다. 제네레이터를 설치한후 아래 처럼 디렉토리를 생성합니다.

```
mkdir my-yo-project
cd my-yo-project
```

그 다음 yo 를 이용해서 프로젝트를 생성하겠습니다.

```
yo webapp
```

설치 과정에서 개발 과정에서 사용될 Grunt task 를 다운로드 합니다. `generator-webapp` 은 가장 심플하면서 필요한 요소들 가진 웹앱 프로젝트를 생성합니다. 그외에도 Yeoman 에서는 여러 프레임워크를 지원하는 제네레이터가 있습니다. 각 제네레이터는 프로젝트에 사용되는 View, Models, Controller 와 같은 것도 스캐폴딩할 수 있습니다. 다음에서 설명할 `generator-angular` 를 통해서 더 자세하게 알아보겠습니다.

### Scaffoding an AngularJS app, AngularJS 웹앱 스캐폴딩하기

다음은 AngularJS 를 지원하는 제네레이터를 사용해보겠습니다. 새로운 제네레이터를 사용하기 위해서는 반드시 먼저 npm 을 통해서 설치하셔야 합니다.

```
npm install -g generator-angular
```

그 다음 역시 프로젝트를 위해서 새로운 디렉토리를 만들고 아래 명령을 실행 시킵니다.

```
yo angular
```

제공되는 여러 제네레이터는 웹앱 프로젝트를 위해서 설치 옵션(flag) 를 제공합니다. `generator-angular` 를 예를 들면 아래와 같이 사용 가능합니다.

```
yo angular --minsafe
```

위의 명령을 사용하면 가장 많이 사용되는 디렉토리 구조에 AngularJS 의 지시자(directives) 와 컨트롤러(conrollers) 코드를 가진 파일로 웹 프로젝트를 생성 시켜줍니다. 생성된 AngularJS 웹앱 프로젝트에 지시자나 컨트롤러가 아래 명령으로 추가 가능합니다. 프로젝트 진행중에 언제든지 사용가능합니다.

```
yo angular:controller myController
yo angular:directive myDirective
yo angular:filter myFilter
yo angular:service myService
```

각 웹프레임워크의 특징별로 위와 같은 기능이 제공될 수 있으며 이를 서브-제네레이터(sub-generator) 라고 부릅니다.

## Bower

Bower 는 웹앱 프로젝트에서 의존하고 있는 자바스크립트, 이미지 그리고 CSS 라이브러리를 효과적으로 관리 할 수 있는 패키지 매니저입니다. 웹에서 사용하는 패키지를 Bower 를 통해서 관리 해보겠습니다.

```
# 검색
bower search <dep>

# 설치
bower install <dep>..<depN>

# 설치된 패키지 리스트 .
bower list

# 패키지 업데이트
bower update <dep>
```

yo 로 생성된 프로젝트와 Bower 를 사용해보겠습니다. 먼저 기본 웹앱 프로젝트를 생성하고 jQuery 플러그인을 추가해보겠습니다.

```
# 새로운 웹앱 프로젝트를 생성합니다.
yo webapp

# `jquery-pjax` 를 검색 해봅니다.
bower search jquery-pjax

# 찾은 플러그인을 bower.json 이라는 설정파일에 저장하도록 설치해보겠습니다.
bower install jquery-pjax --save

# 다음 (만약 RequireJS 사용하지 않는 경우) 아래 grunt 명령을 사용하면 설치된 패키지들이 자동으로 `index.html` 에 추가됩니다.
grunt bowerInstall
```

  - 모든 제네레이터가 bower install 기능을 지원하지 않을 수 있습니다. 만약 관련된 내용을 더 알고 싶다면 다음 grunt 태스크(task) 를 찾아보세요. `grunt-bower-requirejs`,  `grunt-bower-install`

Bower 에 대해서 더 자세히 알고 싶으시면 [Get started Bower](/getstarted/bower) 를 참고하세요.

## Grunt

Grunt 는 테스크(task) 기반의 자바스크립트 프로젝트를 위한 코맨드 라인 툴입니다. Grunt 테스크를 주로 프로젝트 빌드 시스템으로 사용됩니다. yo 에서 생성한 웹앱 프로젝트에서는 Yeoman 팀에서 개발된 여러 Grunt 테스크를 통해서 프로젝트를 빌드하고 있습니다.

대표적인 Grunt 명령을 살펴 보겠습니다.

```
# 내장 웹 서버 제공과 변경사항을 추적하여 프리뷰 제공.
grunt serve

# 유닛테스트
grunt test

# 프로덕트 버전 빌드
grunt

아래 명령은 웹앱 개발의 워크플로우에서 기본웹앱을 생성하고 프리뷰를 통해서 빠른 개발을 제공하고 테스팅 그리고 빌드 할 수 있는 기본적으로 주로 사용되는 명령입니다.
yo webapp
grunt serve
grunt test
grunt
```

Grunt 에 대해서 저 자세히 알고 싶으시면 [Get started Grunt and Gulp](/getstarted/grunt-and-gulp/) 를 참고하세요

## References

- [Getting started with Yeoman | Yeoman](http://goo.gl/mjqKVR)
