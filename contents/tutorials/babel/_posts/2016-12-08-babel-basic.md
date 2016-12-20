---
layout : tutorials
title :  Babel로 ECMAScript 2015 사용하기
category : tutorials
subcategory : tips
summary : 바벨을 이용해 최신 자바스크립트 스펙 ECMAScript 2015를 사용해 봅시다
permalink : /tutorials/babel/babel-basic
tags : javascript babel ECMAScript2015 es6
author : 6pack
---

바벨([Babel](http://babeljs.io))을 처음 들은것이 작년이다.
ES6 초안이 나온 상황에서 미리 사용해 보고 싶은 이들위해 ES5용 코드로 변환해 주는 기능이다.
나는 머지않아 ES6 스펙이 확정될 것이고 더불어 브라우져와 노드에서는 신속히 지원해 줄 것이라 생각했다.
그래서 굳이 바벨이라는 툴을 학습할 필요성을 느끼지 못하고 지나쳤다.

요즘 격주로 Kisa에서 주관하는 코드랩에 참석하고 있다.
어제는 리엑트(React) 코드랩이었는데 보니깐 기본적으로 ES6 문법을 사용했다.
그리고 브라우져 지원을 위해 바벨로 코드를 변환하는 작업을 했다.
게다가 바벨에서 JSX 코드도 변환해 주고 있었다.

ES6 발표 이후 각 브라우져에서 이를 지원하기 위한 작업은 진행 중이지만 아직 부족한 부분이 많다.
구 버전 브라우져를 생각한다면 쉽사리 ES6를 사용하기 힘들다.
노드마져도 진행이 더디다는 느낌이다.
ES6의 장점을 최대한 활용해 보려면 이제는 바벨을 사용해 볼 때인것 같다.


## 설치

앞으로 계속 사용할 것이니깐 전역으로 설치했다.

```
$ npm install babel-cli -g
```

바벨을 설치하면 기본적으로 세 개의 프로그램이 설치된다.

* `babel`
* `babel-node`
* `babel-external-helpers`

`babel은` ES6로 작성한 코드를 변경해 주는 역할을 한다.
`babel-node`는 ES6로 작성한 노드 코드를 실행하는 기능이다.
node와 동일한 기능을 하는데 ES6 문법을 완전히 지원한다는 점에서 차이가 있다.


## babel-node

babel-node는 REPL로도 동작한다.

```
$ babel-node
> [1, 2, 3].map(n => n * n)
[1, 4, 9]
```

간단한 ES6 코드를 테스트하기에 적합하다.
사실 ES6로 작성한 노드 코드를 구동할 때도 babel-node를 사용한다.
하지만 이미 node 명령어가 있는 상태에서 굳이 babel-node를 사용하기엔 좀 꺼림칙하다.
babel로 코드를 변환한 후 서버 코드를 돌리는것이 나을 것 같다.


## babel

babel 명령어로 코드를 변환할 때는 `-d`, `-w` 옵션을 사용할 수 있다.

```
$ babel src -d dist -w
```

src 폴더에 ES6 코드를 작성하고 변환된 코드는 dist 폴더에 저장한다.
또한 src 폴더 내의 파일의 변경된 내용을 감지해서 자동으로 변환작업을 수행하도록 하는 명령어다.

간단하게 아래 코드를 변경해 봤다.

```javascript
const square = n => n * n;
```

그런데 변경된 결과도 ES6 코드였다.
바벨 명령어를 통해 ES6 코드를 ES5 코드로 변환하는 것이 내 의도인데 이것은 그것과 다른 결과다.
자료를 찾아봤다.
현제 바벨은 6버전이다.
과거 버전에서 지원했던 바벨의 기능을을 여러개로 쪼개서 별로의 플러그인으로 제공한다.
마치 익스프레스 3의 기능을 미들웨어로 분리해낸 익스프레스 4와 비슷한 것 같다.

ES5 코드로 변환하기 위해서는 es2015 프리셋을 사용해야한다.

```
$ npm install babel-preset-es2015 --save
```

프리셋을 설치한 뒤 `.babelrc` 파일을 작성한다.

```
{
  "presets": [
    "es2015"
  ]
}
```

다시 바벨 명령어를 수행하면 ES5 코드가 생성된다.

```javascript
var square = function square(n) {
  return n * n;
}
```
