---
layout : getstarted
title : Express.js
category : getstarted
subcategory : library
summary : Express.js는 노드로 구현한 웹서버 라이브러리 입니다. Express.js의 구조와 사용법에 대해 알아봅니다.  
permalink : /getstarted/expressjs
title_background_color : eeeeee
title_color : 444444
tags : express express.js node.js backend javascript library
author : 6pack
---

# Express.js 시작하기 
 
## Express.js란?

익스프레스([Express.js](http://expressjs.com))는 노드(NodeJS) 상에서 동작하는 웹 개발 
프레임웍입니다. 이외에도 [Hapi.js](http://hapijs.com), [Koa.js](http://koajs.com) 등 
다양한 웹프레임웍이 있지만 현재까지 가장 많이 사용하고 인기는 프레임웍은 익스프레스 엔진입니다. 

익스프레스는 가볍고 유연하게 웹 프레임웍을 구성할 수 있는 장점이 있습니다. 이것은 
미들웨어(Middleware) 구조 때문에 가능한 것입니다. 자바스크립트 코드로 작성된 다양한 기능의 미들웨어는 
개발자가 필요한 것만 선택하여 익스프레스와 결합해 사용할 수 있습니다. 본 글에서는 익스프레스 설치와 
기본구조에 대해 알아보고 웹서버 개발에 필요한 기초 사용법에 대해 알아보겠습니다.

## 설치

익스프레스는 노드 모듈중 하나입니다. 따라서 노드 설치를 선행해야합니다. 
[노드 홈페이지](https://nodejs.org)에서 직접 설치 파일을 다운로드하여 설치할 수 있습니다. 설치후 
아래 명령어로 노드 설치 유무를 확인하세요

```
$ node --version
$ npm --version
```

`node`는 노드 실행을 위한 명령어고 `npm`은 노드 모듈설치를 위한 명령어 입니다. 익스프레스 모듈을
 설치하기 위해서는 `npm`을 이용해 설치해야합니다.

```
$ npm install express -g
```

`npm` 명령어 사용시 `-g` 옵션을 추가하면 글로벌(global)로 모듈을 설치한다는 의미인데, 리눅스/유닉스
계열의 경우 루트(root) 권한으로 설치한다는 의미와 같습니다. 이렇게 글로벌 모듈로 설치하면 커맨드라인 
창에서 `express` 명령어로 익스프레스 모듈을 설치할 수 있습니다.

```
$ express my-app 
```

위 명령어 실행결과 my-app 폴더가 생성되고 익스프레스 모듈과 함께 서버 구동에 필요한 각종 파일들이
폴더 하위에 자동으로 생성됩니다.


## 구조

`express` 명령어로 자동 생성된 my-app 폴더 구조를 살펴봅시다.

```
/myapp
  ⌊ /bin
      ⌊ www
  ⌊ /public
      ⌊ /images
      ⌊ /javascripts
      ⌊ / stylesheets
  ⌊ /routes
      ⌊ index.js
  ⌊ /views
      ⌊ index.jade
  ⌊ app.js
  ⌊ package.json
```

**package.json**: 노드에서 package.json 파일에 프로그램 이름, 버전 등 노드 프로그램의 정보를
기술합니다. 또한 필요에 따라 다양한 모듈을 함께 사용하는데 이러한 모듈들의 목록을 package.json에 
나열합니다. NPM은 이 정보를 참고하여 필요한 모듈을 모두 설치할 수 있는 것입니다. 

**bin/www**: 서버 구동을 위한 코드가 기록되어 있습니다. 익스프레스 서버설정 코드가 기록된 app.js
파일을 가져와 노드의 HTTP 객체와 연동하는 작업이 이뤄집니다.

**app.js**: bin/www 에서 사용되는 이 파일은 익스프레스 설정 파일이 담겨있는 핵심 코드입니다.
주요 설정 코드를 살펴봅니다.

- [morgan](https://github.com/expressjs/morgan): 클라이언트의 HTTP 요청 정보를 로깅하기
위한 모듈
- [body-parser](https://github.com/expressjs/body-parser): 클라이언트의 HTTP 요청 중 
POST 요청의 바디 데이터에 접근하기 위한 모듈
- [cookie-parser](https://github.com/expressjs/cookie-parser): 접속한 클라이언트의
쿠키 정보에 접근하기 위한 모듈
- express.static(): 정적 파일 호스팅을 위한 경로 설정
- app.use('/', routes): 라우팅 설정. 세부 라우팅은 /routes 폴더에 구현됨

**routes/index.js**: 라우팅 코드를 살펴 봅시다.

```javascript
// routes/index.js
var express = require('express');
var router = express.Router();
 
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
 
module.exports = router;
```

`express.Router()` 객체를 이용해 라우팅 설정을 합니다. 라우트 객체 `router`는  `get()`
함수를 이용해 `/` URI로 호출되었을 경우 어떤 로직을 수행하도록 합니다. 두번째 파라매터인 콜백함수는
세개의 파라메터를 갖는데 1) 클라이언트 요청정보를 담은 객체인 req, 2) 응답을 위한 res 객체, 3) 
다음 로직 수행을 위한 함수명 next를 사용합니다. 위 코드는 클라인언트로부터 `GET /` 호출이 있을 경우,
뭔가를 렌더링하라는 의미 정도로 이해하면 됩니다. 자세한 라우팅은 별도 섹션에서 자세히 설명할 것입니다. 

## 구동

익스프레스를 설치하고 전체 폴더 구조를 살펴보았으니 프로그램을 구동해 보겠습니다. 위에서도 설명했듯이 
노드는 NPM을 통해 필요한 모듈을 설치하고 프로그램을 구동합니다.


모듈 의존성 제거:
```
$ npm install
```

프로그램 구동
```
$ npm start
```

익스프레스는 별도 설정이 없다면 기본적으로 3000번 포트를 사용합니다. 웹 브라우져를 열고
`http://localhost:3000`으로 접속합니다. 아래 화면을 확인하면 익스프레스를 제대로 설치한 것입니다.

![초기화면](imgs/init.png)


## 라우팅

## 템플릿 