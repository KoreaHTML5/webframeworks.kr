---
layout : tutorials
title : NodeJS를 이용한 API 서버만들기 1
category : tutorials
summary : NodeJS를 이용한 REST API 서버 개발을 시작할 수 있다. ExpressJS, Sequelize로 기본 골격을 잡는 것부터 Mocha, Supertest로 유닛테스트하는 방법까지 설명한다. 이 글은 지난 코드랩 진행했던 내용과 유사하다.
permalink : /tutorials/nodejs/api-server-by-nodejs-01
title_background_color : 026E00
title_color : FFFFFF
tags : javascript framework ExpressJS JS tutorial NodeJS Sequelize Mocha Supertest UnitTest
author : 6pack
---

## NodeJS에 대해

자바스크립트는 주로 웹 브라우져에서 실행되는 언어입니다. 웹 브라우져에는 자바스크립트 엔진이라는 것이 있는데 이 엔진이 자바스크립트 코드를 실행시키는 역할을 하는 것이죠. 이러한 자바스크립트 엔진에는 크롬에서 사용하는 V8, 사파리에서 사용하는 웹킷(Webkit), 파이어폭스에서 사용하는 스파이커몽키(SpikerMonky), 오페라에서 사용하는 카라칸 등이 있습니다. 이러한 엔진 중에 구글에서 만든 V8 엔진이 오늘 우리가 배울 노드에서 사용하는 자바스크립트 엔진입니다.

Ryan Dahl 이라는 사람은 이 V8 엔진에 이벤트 I/O 프레임웍과 CommonJS 명세를 이용한 모듈을 결합하여 Node.js를 만들었습니다.

![](imgs/node-composition.png)

노드는 주로 웹서버와 같은 네트웍 프로그램을 위해 고안된 환경이지만 최근에는 웹 개발 환경의 빌드 툴로도 많이 사용되고 있습니다. 리엑트에서 사용하는 웹팩(Webpack), 스트림 형식의 빌드툴 굴프(Gulp), 그리고 설정 방식의 빌트 툴인 그런트(Grunt)가 모두 노드 환경에서 개발된 도구입니다.

노드 환경으로 인해 그 동안 웹 브라우져에서만 사용하는 자바스크립트를 어디서나 사용할 수 있게 되었습니다.

가장 크게는 웹서버 같은 백엔드 사이드를 자바스크립트로 구현할 수 있습니다. 우리가 학습할 부분이구요.

데스크탑 어플리케이션도 자바스크립트로 구현할 수 있게되었습니다. 슬랙 등과 같은 어플리케이션은 일렉트론(Electron)이라는 프레임웍으로 개발되었는데 역시 노드 기반입니다.

모바일 어플리케이션도 자바스크립트로 개발할수 있는데 그 중 아이오닉(Ionic)이라는 하이브리드 앱이 그렇습니다.

이 모든것이 노드 기반으로 개발되고 실행되는 어플리케이션 입니다. 자바스크립트가 브라우져 밖으로 나오면서 무섭게 영역을 장악해가고 있는 것입니다.


## 설치

노드 설치는 간단합니다. [nodejs.org](https://nodejs.org/ko/)에서 최신버전인 v6.x.x을 다운로드 하세요.

![](imgs/node-download.png)

여러분이 사용하는 운영체제에 따라 노드 설치파일이 다운로드 됩니다. 저는 OSX을 기준으로 진행하겠습니다.

다운로드한 설치파일을 실행하고 몇번 클릭하게되면 노드 설치가 완료됩니다.

노드가 설치 되었는지 확인해 볼까요? 유닉스 `which` 명령어로 노드 명령어의 위치를 확인해 봅시다.

```
which node
/usr/local/bin/node
```

운영체제에서 명령어를 모아두는 폴더인 /usr/local/bin 하위 폴더에 노드 명령어가 생성되었습니다. 그럼 처음으로 노드 명령어를 사용해 볼까요? 아래는 설치한 노드 버전을 출력하는 방법입니다.

```
node --version
v6.5.0
```

우리가 설치한 노드 버전이 v6.5.0이네요. 최신버전입니다.


## NPM

노드를 설치하면 npm 이라는 프로그램도 함께 설치됩니다. 이것은 노드로 만든 패키지를 관리하는 툴이고 "Node Package Manager"의 약자입니다. 우리는 npm의 몇 가지 기능을 이용해서 프로젝트를 진행할 겁니다. 우선 우리가 만들 프로젝트 폴더를 만들고 거기에 npm으로 프로젝트를 초기화 합니다.

```
mkdir codlab-nodejs
cd codlab-nodejs
npm init
```

몇 가지를 물어 볼건데요 그냥 엔터 입력하면서 기본값을 사용하다고 답변하면 됩니다. 모두 완료되면 package.json 이란 파일이 하나 생성됩니다. 이것은 프로젝트 정보를 기록한 파일인데요 npm으로 프로젝트를 관리하기 위해 사용됩니다. Npm으로 사용할 패키지를 추가할때 그 정보를 여기에 기록하거나 스크립트를 정의하여 실행할 수도 있습니다. 자세한 사용방법은 나중에 설명하고 지금은 헬로 월드를 찍어보는 것에 집중합시다.


## Hello world

이제 우리는 [nodejs.org](https://nodejs.org/dist/latest-v6.x/docs/api/synopsis.html) 사이트로 이동합니다. 웹서버를 만들수 있는 간단한 코드를 제공하는데 이것을 복사하여 우리 프로젝트 폴더의 `app.js`라 파일로 만듭니다.

```javascript
const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
```

코드에 대한 설명은 차후로 미룰께요. "Hello world" 문자열을 확인하는 것이 목적이니까요. 노드에서 자바스크립트로 만든 서버 어플리케이션을 실행하려면 `node` 명령어를 이용하면 됩니다. 아래처럼요.

```
node app.js
```

Npm을 이용해서 프로젝트를 관리할거라면 `package.json` 파일에 스크립트를 등록해 두는 것이 좋습니다. `start` 라는 스크립트를 만들어 보겠습니다.

```json
{
  "scripts": {
    "start": "node js"
  }
}
```

이제 `npm` 명령어로 서버 프로그램을 실행봅시다.

```
npm start
Server running at http://127.0.0.1:3000/
```

서버 프로그램이 실행되었고 우리는 http://127.0.0.1:3000 주소로 확인할 수 있습니다.


## 브라우져로 확인

크롬 브라우져을 열어 http://127.0.0.1:3000  주소로 접속해 보세요.

![](imgs/result.png)

"Hello world" 문자열이 브라우져에 출력되었습니다!


## Curl로 리퀘스트 보내기

브라우져는 내부적으로 `GET http://127.0.0.1:3000` 요청을 보내서 그 결과를 화면에 뿌려주는 역할을 합니다. HTTP 요청은 이 외에도 헤더에 다양한 정보를 담아서 보낼수 있는데 브라우져는 모든 정보를 설정하기에는 기능이 제한적입니다.

구체적인 요청을 위해 앞으로는 `curl` 이란 프로그램을 사용할 겁니다. 아래 명령어로 다시 서버에 요청을 보내 보세요.

```
curl -X GET '127.0.0.1:3000'
Hello World
```

동일하게 "Hello world" 문자열이 출력되었습니다. 이번에는 -v 옵션을 추가해서 실행해 보세요.

```
curl -X GET 'localhost:3000' -v
* Rebuilt URL to: 127.0.0.1:3000/
*   Trying 127.0.0.1...
* Connected to 127.0.0.1 (127.0.0.1) port 3000 (#0)
> GET / HTTP/1.1
> Host: 127.0.0.1:3000
> User-Agent: curl/7.43.0
> Accept: */*
>
< HTTP/1.1 200 OK
< Content-Type: text/plain
< Date: Mon, 12 Sep 2016 03:02:44 GMT
< Connection: keep-alive
< Content-Length: 12
<
Hello World
* Connection #0 to host 127.0.0.1 left intact
```

프론트엔드에서 자바스크립트를 사용해보신 분들이라면 몇가지 특이한 신텍스가 보일겁니다. `const` 와 `() => ` 코드인데요. 이것은 자바스크립트의 새로운 표준인 ECMAScript 2015 (ES6) 문법입니다.


## const

지금까지의 자바스크립트(ES5)에서는 변수를 선언하기 위해 `var` 키워드를 사용했습니다. 이것은 함수 스코프 적용을 받는 변수입니다. 아... 함수 스코프가 뭔지 모르겠다면 아래 코드부터 보세요.

```javascript
function foo() {
  if (false) {
    var a = 1;
  }
  console.log(a);
}

foo(); // undefined
```

`foo()`를 실행하면 어떤 값이 나올까요? 함수 안에  `if (false)` 구문은 실행되지 않아야 마땅합니다. 조건문이 `false` 이니깐요. 그래서 `a` 라는 변수 자체가 없어야 하고 `console.log(a)`를 실행할때 `a` 라는 변수가 선언되지 않았으므로 ReferenceError가 발생해야 합니다. 하지만 실제는 `undefined` 값이 출력됩니다. 자바스크립트 엔진은 위 코드를 이렇게 변경하기 때문입니다.

```javascript
function foo() {
  var a;
  if (false) {
    a = 1;
  }
  console.log(a);
}
```

자바스크립트 엔진은 코드 안에 `var a = 1;` 이라는 코드를 만나면 먼저 코드 상단에 `a` 라는 변수를 미리 선언합니다. 이것을 호이스팅(hoisting)이라고 합니다.

자바스크립트 엔진은 `a` 변수를 어디에 선언해야하는지 기준이 있어야 합니다. `foo()` 함수의 첫 번째 줄일수도 있고 `foo()` 함수 바깥일 수 도 있습니다. 자바스크립트 엔진은 전자의 방식 즉 **해당 변수가 선언된 함수의 맨 첫번째 줄에 변수를 선언합니다.** 이것을 두고 "자바스크립트는 함수 스코프를 사용한다"라고 얘기합니다. 그동안 자바스크립트에서 스코프라고 하면 모두 함수 스코프를 얘기했습니다.

하지만 ES6 부터는 이를 구분해서 얘기해야합니다. `let`은 함수 스코프를 사용하지 않기 때문이죠. **블록스코프** 를 사용합니다. 여기서 블록은 중괄호(`{ }`)를 의미합니다. 아래 코드를 살펴보세요.

```javascript
function foo() {
  if (false) {
    let a = 1;
  }
  console.log(a);
}

foo(); // ReferenceError: a is not defined
```

`if` 블록 안에 `a` 변수가 `let`으로 선언되었고 `if` 블록을 빠져나오면 `console.log(a)` 코드를 만나게 됩니다. 여기서 `a`는 `foo()` 함수 스코프 내에서는 찾을 수 없습니다. 왜냐하면 `let`으로 선언된 `a` 변수는 `if` 블록에 감싸져서 `foo()` 함수 스코프에서는 보이지 않기 때문이다. 이것을 블록 스코프라고 합니다.

`const`도 마찬가지죠. `let`처럼 블록 스코프를 사용하는 상수 키워드 입니다. 상수란 선언과 동시에 값이 할당 되어야 하고 이후에는 값을 변경하지 못하는 특징이 있습니다. 아래 코드를 보면 알수 있겠죠?

```javascript
const a = 1;
a = 2; // TypeError: Assignment to constant variable.
const b; // SyntaxError: Missing initializer in const declaration

```


## Arrow function

ES6에는 익명 함수를 선언할 때 `() => {}` 와 같은 표현법을 사용할 수 있는데 이것은 애로우 함수(Arrow function)라고 합니다. `function` 키워드를 간단히 줄여놓은 문법인데요 콜백이 많은 비동기 코드에서 사용하면 가독성이 뛰어납니다.


## require()

노드는 V8, 이벤트I/O프레임웍 그리고 CommonJS로 이뤄진 환경이라고 했는데요. 마지막의 CommonJS를 구현해 놓은 것 중 하나가 `require()` 함수입니다. `require()` 함수는 자바스크립트로 만든 모듈을 가져올 수 있습니다. 모듈에 대해 알아보기 위해 아래 코드를 읽어 보세요.

```javascript
// sum.js
function sum(a, b) {
  return a + b;
}

// sum() 함수를 외부로 노출함 -> 모듈로 만듬
module.exports = sum;
```

노드에서는 파일단위로 하나의 모듈을 만들 수 있습니다. `sum.js` 파일을 만들고 그안에 `sum()` 함수를 정의했습니다. 그리고 코드의 마지막 줄에 `module.exports` 신텍스를 이용해서 외부로 노출시켰습니다. 이러면 `sum.js` 파일은 일종의 모듈이 되는 것입니다.

그럼 이 모듈을 어떻게 가져다 사용할 수 있을까요? 아래 코드에서 그 방법을 알려줍니다.

```javascript
const sum = require('./sum.js');
console.log(sum(1, 2)); // 3
```

`require()` 함수를 이용해 우리가 만들었던 모듈인 `sum.js` 파일을 가져옵니다. 그리고 `sum`이라는 상수에 할당합니다. `let`이나 `var`로 하지않고 `const`를 이용한 것은 우리가 사용할 외부 모듈을 변경하지 않고 사용만 할 것이기 때문입니다. ES6애서 제공하는 이런류의 문법을 사용하면 코드의 버그를 잡는데 도움이 됩니다. `sum` 상수에는 `sum.js` 모듈에서 노출한 `sum()` 함수가 할당될 것입니다. 그래서 `sum(1, 2)`라는 형태로 활용할 수 있습니다.


## Hello World 코드 설명

헬로 월드 코드의 첫번째 코드를 다시 봅시다.

```javascript
const http = require('http');;
```

Http 라는 모듈을 가져와서 `http`라는 상수에 할당하였습니다. Http 모듈은 `createServer()` 함수를 노출하기 때문에 아래 코드로 서버 객체를 만들 수 있습니다.

```javascript
const server = http.createServer((req, res) => { /*... */ });
```

`createServer()` 함수로 생성된 `server` 객체는 다시 `listen()` 이라는 함수를 제공하는데이 이를 통해 서버가 클라이언트로부터 요청을 받기 위한 대기상태로 만들수 있는 것입니다.
