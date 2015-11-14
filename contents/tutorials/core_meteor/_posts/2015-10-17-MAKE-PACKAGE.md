---
layout : tutorials
title : 바퀴를 만들자. Package를 제작법
category : tutorials
subcategory : data-binding
summary : node.js의 풍부한 npm과 라이브러리들을 package를 통해 격리하고 사용하는 방법을 배워본다.
permalink : /tutorials/core_meteor/7_make_package
title_background_color : 1C1C1F
title_color : E4E4E4
tags : javascript meteor static assets public
author : acidsound
---
# [Core Meteor] 바퀴를 만들자. Package를 제작법

어플리케이션을 만들다 보면 반복적으로 사용하면서 재사용하는 코드들이 있는데

node.js 의 경우는 [npm](http://npmjs.com)이 Meteor는 [atmosphere](https://atmospherejs.com)에서 관리하고 있다.

그런데 개인적으로만 사용하거나 소스 공개를 할 수 없는 (ex. 외주 SI) 경우 해당 프로젝트에서만 유효한 package를 만들어야 한다.

package를 만드는 법은 생각보다 어렵지 않은데,
가령 anonymous라는 사용자(이는 meteor 계정을 말한다)가 sample1이라는 패키지를 만들고자 한다면
해당 패키지를 적용하고자 하는 프로젝트 안에서

```
meteor create --package anonoymous:sample1
```

명령을 통해 생성할 수 있다.

## npm 서버 패키지 만들기

npm 패키지의 경우 [meteorhacks:npm](https://github.com/meteorhacks/npm)과 같은 패키지를 사용하는 경우를 많이 보았는데
직접 패키지를 만들면 더 관리하기 쉽고 안전하게 운용할 수 있다.

예로 요즘 realtime database로 새롭게 떠오르고 있는 [rethinkdb](http://rethinkdb.com/)의 npm을 만들어본다면

```meteor create --package <your namespace>:rethinkdb``` 식으로 하자

생성하고 난 뒤 ```cd package/rethinkdb``` 하여 내용을 보면 packages.js, rethinkdb.js, rethinkdb-test.js, README.md 이렇게 네 개의 파일이 있는데 우리는 package.js, rethinkdb.js 만 수정해본다.

rethinkdb.js는 간단하다.  공식 문서(http://rethinkdb.com/docs/install-drivers/javascript/)처럼 r이란 전역명을 사용하기 위해

```javascript
r = Npm.require('rethinkdb');
```

이렇게 한 줄 정의하자.

package.js[(http://docs.meteor.com/#/full/packagejs)](http://docs.meteor.com/#/full/packagejs) 는 몇군데 손을 봐야하는데

```javascript
Package.describe({
  name: 'spectrum:rethinkdb',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

/* 추가 시작: 해당 npm명과 사용할 버전명을 key/value형태로 넣는다. */
Npm.depends({
  'rethinkdb': '2.1.0'
});
/* 추가 끝 */

Package.onUse(function(api) {
//  api.versionsFrom('1.1.0.3');
  api.use('ecmascript');
  api.addFiles('rethinkdb.js', 'server'); /* server 에서 사용할 것을 명시한다 */
  api.export('r', 'server'); /* rethink.js 에서 받아온 전역변수를 서버에 노출한다 */
});
```

```Npm.depends``` 부분과 ```api.addFiles```에 ```, 'server'``` 부분을 추가하고
rethink.js에서 사용한 **r**을 ```api.export```를 이용하여 서버쪽에 노출한다.

```meteor shell``` 로 제대로 들어갔는지 확인해보자.

```
$ meteor shell

Welcome to the server-side interactive shell!

Tab completion is enabled for global variables.

Type .reload to restart the server and the shell.
Type .exit to disconnect from the server and leave the shell.
Type .help for additional help.

> r
{ [Function]
  expr: [Function],
  js: [Function],
  http: [Function],
  json: [Function],
  error: [Function],
  random: [Function],
  binary: [Function],
  row: { [Function] args: [], optargs: {} },
  table: [Function],
  db: [Function],
  dbCreate: [Function],
  dbDrop: [Function],
  dbList: [Function],
  tableCreate: [Function],
.....
```

이렇게 나오면 server쪽에서 **r**로 시작하는 RethinkDB Query를 쓸 수 있다.

## 클라이언트 패키지 만들기

클라이언트의 경우는 서버보다 훨씬 단순하다.

필요한 파일을 추가하고 그것들을 모두 ```package.js```의 ```api.addFiles```에 추가하는 것이 전부다.

javascript 갤러리 라이브러리인 [Photoswipe](http://photoswipe.com/)를 패키지로 만들어 보자.

서버와 마찬가지로 패키지를 생성하자

```
meteor create --package <your namespace>:photoswipe
cd packages/photoswipe
```

역시 packages.js, photoswipe.js, photoswipe-test.js, README.md 이렇게 네 개의 파일이 생겼을 것이다.

photopswipe.js는 지우고 [https://github.com/dimsemenov/PhotoSwipe](https://github.com/dimsemenov/PhotoSwipe)으로부터 lib폴더로 clone하자.

```
git clone https://github.com/dimsemenov/PhotoSwipe.git lib
```

로 받아온 뒤 lib 경로 아래에 필요한 파일들을 packages.js에 추가한다.

```javascript
Package.describe({
  name: 'yournamespace:photoswipe',
  summary: 'JavaScript gallery, no dependencies.',
  version: '1.0.0',
  git: 'https://github.com/acidsound/meteor-photoswipe.git'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');
  api.addFiles([
    'lib/dist/photoswipe.css',
    'lib/dist/default-skin/default-skin.css',
    'lib/dist/default-skin/default-skin.png',
    'lib/dist/default-skin/default-skin.svg',
    'lib/dist/default-skin/preloader.gif',
    'lib/dist/photoswipe.js',
    'lib/dist/photoswipe-ui-default.js'
  ], 'client');
});
```

default skin이랑 js, css, ui-default 를 포함하고 *.min.js 류들은 어짜피 Meteor에서 uglify 하므로 포함할 필요가 없다.

테스트하기전에 ```meteor add yournamespace:photoswipe``` 하여 패키지 추가하는 것을 잊지말자.

## Atmosphere에 Deploy하기

테스트해보고 잘 작동하는지 확인하고 나면 ```publish```로 atmoshpere에 등록한다.

```
meteor publish --create
```

그리고 이후에 수정한 내용을 업데이트 할 때엔 packages.js 파일 중

```javascript
Package.describe({
...
  version: '1.0.0',
...
});

```

```version: '1.0.1'``` 과 같이 버전 정보를 올려주고

```
meteor publish
```

를 통해 업데이트 해주자.