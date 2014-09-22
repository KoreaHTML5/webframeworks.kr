---
layout : quickstart
title : Quick Start
category : quickstart
summary : 퀵스타트(Quick Start) 는 여러가지 프레임워크를 쉽고 빠르게 시작할 수 있도록 도와주는 프로젝트입니다.
permalink : /quickstart
title_background_color : fc7f23
tags : quickstart
author : ragingwind
---

# 퀵스타트(Quick Start)

퀵스타트(Quick Start) 는 웹어플리케이션 개발에 사용되는 여러가지 프레임워크(Framework)를 쉽고 그리고 빠르게 시작할 수 있도록 도와주는 프로젝트입니다. 웹개발에서 자주 사용되거나 이해가 하기 쉬운 형태의 예제 어플리케이션을 선정하여 여러가지 웹프레임워크(Web Framework)를 각각 사용해여 동일한 예제 어플리케이션을 구현한 것입니다. 자주 사용되거나 반드시 필요한 파일들과 개발에 필요한 툴을 미리 셋업하여 초보 개발자도 손쉽게 사용하도록 만들어졌습니다. 퀵스타트 프로젝트 다운받은 다음 간단한 명령어를 사용해서 실제로 동작하는 웹프레임워크 코드와 툴을 사용하면서 쉽게 웹프레임워크에 익숙해질 수 있도록 도와주는 키트입니다. 웹어플리케이션 개발에 자주 사용되는 도구와 워크플로우(Workflow) 가 이미 내장되어 있어서 바로 웹어플리케이션을 구동할수 있고 실행 결과를 바로 확인할 수 있어서 개발자는 제공되어진 퀵스타트 프로젝트를 분석하여 각 웹프레임워크의 구현방식과 동작을 공부할 수 있으며 퀵스타트 프로젝트를 기초로 자신만의 웹어플리케이션을 개발 할 수도 있습니다. 그래서 개발자들이 자신의 아이디어를 자신이 사용하고 싶어하는 프레임워크를 이용해서 막힘없이 바로 구현해 볼 수 있도록 도와줍니다.

{% bimg imgs/helloworldsample.png 820 %}Quickstart components structure{% endbimg %}

[TODO] 그림 최종 결과물에 따라 변경 예정

퀵스타트는 프레임워크를 사용하여 구현한 예제 코드와 웹어플리케이션에서 자주 사용되는 리소스, 환경파일 그리고 도구들로 이루어져 있습니다. 먼저 각 프레임워크와 라이브러리는 프로젝트별로 한개 또는 여러개가 복합적으로 사용될 수 있습니다. 각 프레임워크를 사용해서 만들어진 예제는 각 프레임워크의 기본적인 사용법을 보여줍니다. 예제는 해당 프레임워크에 익숙하지 않는 개발자가 쉽게 다가갈 수 있는 기회를 제공하고 프레임워크들을 심화 학습 할 수 있는 계기를 만들어 주는 좋은 시금석이 됩니다. 예제와 같이 제공되는 리소스, 환경파일과 웹어플리케이션 개발에 필요한 도구들은 현재 웹어플리케이션에서 개발에서 자주 사용되거나 많은 도움을 주는 도구들로 선정했습니다. 매 프로젝트마다 자주 사용되는 설정과 리소스들을 미리 준비해서 매번 번거롭고 단조로운 반복적인 작업을 하지 않도록 도와주고 간단한 명령으로 도구를 실행시키고 원하는 결과물을 빠르게 얻을 수 있도록 준비되어 있습니다.

## 퀵스타트 구성요소 (Quick Start Components)

{% bimg imgs/qs_components.png 820 %}Quickstart components structure{% endbimg %}

[TODO] 그림 최종 결과물에 따라 변경 예정

- Boilerplates / Components: 프로젝트 생성시에 매번 해야하는 작업을 줄여주어 빨리 아이디어를 구현할 수 있도록 미리 준비해주는 파일과 설정들입니다.
	- Configuration: 매번 생성하거나 복사해야 하는 환경설정 파일을 미리 제공합니다. 예) package.json
	- Library / Frameworks: 스타터키트에 사용되는 라이브러리와 프레임워크 관련 파일을 미리 포함하거나 패키지 매니저를 통해서 설치 할 수 있는 파일입니다.
	- Boilerplate scripts: 앱을 만들다 보면 매번 작성해야 하는 유사한 프로그램 파일들을 정리하여 재사용가능하도록 만든 다음 일반적으로 사용할 수 있도록 제공합니다.
	- Requirement Images: 웹앱에서는 favicon 이나 심볼등 간단한 이미지들이 필요합니다. 그것들을 미리 준비해줍니다.
	- index.html: 웹앱에서 반드시 있어야 하는 파일입니다. 코드에는 자주 사용되는 코드들을 정리해서 매번 작성하지 않도록 도와줍니다.
	- Boilerplate files: 위의 리스트외에 관습적으로 자주 사용되는 파일들을 선정해서 포함시킵니다. 예) .editconfigs, .gitignore
	- Task manager preset: 웹앱 개발과 빌드 단계에서 사용되는 Task tool 들을 위한 설정파일입니다. 설정파일에는 웹앱 개발에 필요한 테스크를 간단한 코맨드로 실행 시킬수 있는 코드들이 정의되어 있습니다. 만약 Grunt 를 사용한다면 `grunt serve` 라는 명령으로 내부 웹서버를 실행 시켜서 현재까지 개발된 웹앱을 프리뷰 할 수 있습니다. 자주 사용되는 테스크 코드를 개발단계에서 편하게 사용 할 수 있도록 미리 제공합니다.
- Development: 개발 단계에서 자주 사용되고 필요한 기능을 제공합니다.
	- Serve: Task manger 를 통해서 내장 웹서버를 제공합니다. 
	- Lint: Javascript 파일에 문법적인 잘못이나 오류를 사전에 잡아주는 기능을 제공합니다.
	- Live-reload: 웹앱 프로그램 파일의 변경사항을 감지해서 내장 웹서버를 자동으로 리로드하는 기능을 개발 단계에서 사용할 수 있습니다.
- Build / Release: 배포시에 디버그 버전에서 실제 배포판 버전을 만들 때 자주 사용되는 기능을 제공합니다.
	- Concat: JS 파일을 병합하여 한개의 파일로 만들어 주는 기능을 제공합니다.
	- Minify: JS, CSS, HTML 파일에서 불필요한 문자열이나 공백을 제거하고 압축하여 요량을 줄이는 기능을 제공합니다.
	- Style compile: CSS 관련 솔루션을 사용하는 경우 컴파일 명령을 제공합니다.
	- Image optimize: 이미지를 압축하여 용량을 줄입니다.
	- Copy dist version: 특정 대상 폴더로 빌드한 파일을 복사해서 간편하게 배포하는 기능을 제공합니다.

[TODO] 그림 최종 결과물에 항목/설명 변경 예정

## 준비물 (Prerequisite)

### [Node.js](http://goo.gl/3nBP)

퀵스타트 프로젝트는 Node.js 를 기반으로 하는 다양한 도구를 사용합니다. 먼저 [Node.js](http://goo.gl/3nBP) 설치하고 다음 명령을 통해서 버전을 확인합니다.

```
# node 는 v0.10.1 이상, npm 은 v1.4.x 를 권장합니다.
node --version && npm --version
```

Node.js 를 시스템에 설치하셨다면 이제 퀵스타터에서 사용되는 아래 도구들을 설치합니다.

### [gulp.js](http://goo.gl/2OPX57)

gulp.js 는 이미 설치한 npm 을 통해서 설치하셔야 합니다. gulp.js 는 퀵스타터 프로젝트 사용시에 사용되는 도구로 여러가지 작업을 간단하게 사용할 수 있도록 도와주는 강력한 도구입니다. 더 자세한 설명은 [Get started Grunt and Gulp]({{site.baseurl}}/getstarted/grunt-and-gulp/) 참고하세요.

### [Bower](http://goo.gl/RVwco)

Bower 는 웹앱 프로젝트에서 의존하고 있는 자바스크립트, 이미지 그리고 CSS 라이브러리를 효과적으로 관리 할 수 있는 패키지 매니저입니다. 퀵스타트에서는 Bower 를 사용하여 사용되는 프레임워크, 라이브러리를 설치하고 관련된 패키지의 버전과 의존성을 관리합니다. 

각 퀵스타트 프로젝트에서 사용되는 프레임워크와 라이브러리 그리고 리소스들의 목록이 저장되어 있는 bower.json 는 이미 만들어져서 포함되어 있습니다. 퀵스타트 프로젝트를 압축을 푼 프로젝트 루트 경로에서 ```bower install``` 명령으로 필요한 파일을 간단하게 설치할 수 있습니다. 

Bower 에 대해서 더 자세히 알고 싶으시면 [Get started Bower]({{site.baseurl}}/getstarted/bower) 를 참고하세요.

## 퀵스타트 프로젝트 다운로드하기 (Download a Quickstart Project)

퀵스타트는 현재 아래 목록과
 같은 프레임워크, 라이브러리별 프로젝트를 지원하고 있습니다. 최신 버전은 해당 github 저장소의 master 브랜치(branch) 이며 각 프로젝트별로 tag/release 된 버전을 다운받은후에 작업 경로에 압축을 푸시고 사용하시면 됩니다.

- [AngularJs Quick Start Project](https://github.com/KoreaHTML5/dev.koreahtml5.kr/releases)
- [BackboneJs Quick Start Project](https://github.com/KoreaHTML5/dev.koreahtml5.kr/releases)
- [ExtJs Quick Start Project](https://github.com/KoreaHTML5/dev.koreahtml5.kr/releases)
- [Bootstrap Quick Start Project](https://github.com/KoreaHTML5/dev.koreahtml5.kr/releases)
- [Foundation Quick Start Project](https://github.com/KoreaHTML5/dev.koreahtml5.kr/releases)
- [jQuery Quick Start Project](https://github.com/KoreaHTML5/dev.koreahtml5.kr/releases)

압축을 푼 다음 아래 명령을 사용해서 필요한 파일을 다운로드, 설치 합니다.

```
npm install && bower install
```

[MAYBE] 각 프레임워크 별로 로고로 이루어진 버튼으로 크게 표시
[TODO] 프로젝트명과 프레임워크 요소는 최종 결과물에 따라 변경 가능


## 퀵스타트 프로젝트 사용하기 (Using the Quickstart Project)

### 퀵스타트 프로젝트 디렉토리 구조

압축을 풀고 필요한 파일, 라이브러리 그리고 도구들이 설치되었다면 퀵스타트 프로젝트는 아래와 같이 기본적인 디렉토리/파일 구조를 가지고 있습니다.


```
├── gulpfile.js
├── app
│   ├── favicon.ico
│   ├── images
│   ├── index.html
│   ├── robots.txt
│   ├── scripts
│   └── styles
├── bower.json
├── bower_components
│   ├── bootstrap
│   └── jquery
├── node_modules
│   ├── apache-server-configs
│   ├── grunt
│   ├── grunt-autoprefixer
│   ├── grunt-concurrent
│   ├── grunt-contrib-clean
│   ├── grunt-contrib-concat
│   ├── grunt-contrib-connect
│   ├── grunt-contrib-copy
│   ├── grunt-contrib-cssmin
│   ├── grunt-contrib-htmlmin
│   ├── grunt-contrib-imagemin
│   ├── grunt-contrib-jshint
│   ├── grunt-contrib-uglify
│   ├── grunt-contrib-watch
│   ├── grunt-mocha
│   ├── grunt-newer
│   ├── grunt-rev
│   ├── grunt-svgmin
│   ├── grunt-usemin
│   ├── grunt-wiredep
│   ├── jshint-stylish
│   ├── load-grunt-tasks
│   └── time-grunt
├── package.json

```

[TODO] 최종 결과물에 따라 파일종류와 설명 추가

### 퀵스타트 프로젝트 명령들

퀵스타트에서 제공하는 명령에 대해서 설명합니다. 퀵스타터에서 제공되는 명령은 모두 터미널 기반으로 gulp.js 를 사용하여 동작하도록 구성되어 있습니다. 각 명령들은 gulpfile.js 에 이미 구현되어 있으며 언제든지 개발자 스스로 자신만의 명령을 추가하거나 변경할 수 있습니다. 대부분의 명령은 Google의 [Web Starter Kit ](http://goo.gl/FQOs8f) 에 기반하고 있습니다. 아래는 내장되어 있는 명령들에 대한 상세한 셜명입니다.

[TODO] 최종 결과물에 따라 명령의 종류와 설명이 달라 질 수 있음

#### 내장 서버 구동하기, `gulp serve`

Browersync 도구를 사용하는 명령입니다. 내장 서버를 구동하고 특정 경로와 파일의 변경 사항을 감사해서 변경사항이 감시되면 열려진 브라우저 창을 자동으로 리로딩(Live-reload) 하는 프리뷰(Preview) 기능을 제공합니다.

```
gulp serve
````

사용되는 옵션은 다음과 같습니다.

- open: true(default), false 변경시 브라우저 자동으로 띄우지 않음

[TODO] 옵션과 설명 업데이트

#### gulp clean

빌드된 퀵스터터 프로젝트 파일을 제거합니다.

#### gulp jshint

Javascript 파일의 문법 오류나 코딩스타일(Coding style, convention) 을 미리 검사해서 추후에 생기는 오류를 방지 할 수 있습니다. `gulp jshint` 를 하면 .jshint 파일에 선언된 조건에 따라 `.js` 파일을 검사하고 만약 이상이 감지되면 아래 같은 에러를 보여주게 됩니다.

```
[TODO] jshint error
```

#### gulp style

[TODO] 사용할 스타일에 따라 내용 업데이트

#### 프로젝트 빌드하기, `gulp dist`

퀵스타터에서는 개발버전으로 만들어진 웹어플리케이션을 배포가능할 형태로 빌드시켜주는 명령을 가지고 있습니다. dist 명령을 빌드 과정을 시행하는 명령으로 아래와 같은 작업을 하게 됩니다. 작업된 파일은 별도의 경로 dist 에 보아지게 됩니다. 빌드 명령을 통해서 최적화 작업을 거친 웹어플리케이션은 개발버전 보다 향상된 퍼포먼스를 제공합니다.

- Image optimizing
- HTML minify, uglify
- Javascript minify, ugligy
- Autoprefix, Uncss
- [TODO] 세부 테스크에 대한 설명추가, 최종 결과물에 따라 종류와 설명 업데이트

## 퀵스타터의 관리와 배포

퀵스타터 프로젝트 파일들은 github 에 공개되어 여러 개발자들로 부터 커밋을 받을 수 있는 형태로 제공됩니다. 개선할 점이나 보충할 내용은 여러 개발자들의 공헌 통해서 지속적인 버전업을 목표로 하고 있습니다. 또한 각 웹프레임워크별로 기본 형태의 버전에서 포크(fork) 하여 초급개발자 부터 중급개발자 버전으로 확장되어 개발 할 수 있도록 여러 버전을 제공하려고 하고 있습니다.

일정 수준으로 버전업이 된 파일은 github 에 tag 되어 tarball (압축파일) 형태로 고정된 url 을 통하여 릴리즈 됩니다. 저희는 개발자 여러분의 많은 참여를 바라고 있습니다.
