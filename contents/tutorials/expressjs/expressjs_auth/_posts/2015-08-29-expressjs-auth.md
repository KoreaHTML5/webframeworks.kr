---
layout : tutorials
title : ExpressJS 에서 로그인/로그아웃 구현하기
category : tutorials
subcategory : tips
summary : ExpressJS에서 보다 효율적으로 로그인과 로그아웃, 즉 인증을 구현하는 방법에 대해서 알아보겠습니다.
permalink : /tutorials/expressjs/auth_log_in_out
tags : javascript framework session expressjs tutorials
author : 6pack
---

# ExpressJS 에서 로그인/로그아웃 구현하기
익스프레스의 Session 미들웨어와 cookieParser 미들웨어를 이용해 로그인, 로그아웃 기능을 구현해 보도록하겠습니다. 
또한 세션 저장소로 레디스 서버를 사용하는 방법에 대해 알아보겠습니다.


## 세션 저장
우선 아래와 같이 세션 설정에 대한 코드를 작성합니다.

{% highlight javascript %}
app.use(express.cookieParser());
app.use(express.session({
  key: ‘sid’, // 세션키
  secret: ‘secret’, // 비밀키
  cookie: {
    maxAge: 1000 * 60 * 60 // 쿠키 유효기간 1시간
  }
}));
{% endhighlight %}

위와 같이 설정하고 나면 Request 객체에서 session 프로퍼티를 가지고 세션을 핸들링할 수 있게 됩니다.

{% highlight javascript %}
function (req, res) {
  req.session.user_id = 1234, // 아이디
  req.session.name = ‘chris’ // 이름
}
{% endhighlight %}


## 세션 삭제
로그인시에 세션을 저장을 했다면, 로그 아웃시에는 세션 삭제가 이루어져야합니다.
세션 정보를 완전히 삭제하려면 세션과 쿠키를 함께 삭제해야 하는데, 쿠키를 삭제하지 않을 경우 쿠기에 저장된 세션 정보로 인해 
맞지 않은 세션정보가 호출되는 문제가 때문입니다. 세션을 삭제하기 위해서는, 세션 객체에서 제공하는 destory() 메소드로 세션을 삭제하며, 
쿠키는 Response 개체의 clearCookie() 메소드에 세션 생성시 사용한 키값을 파라매터로 전달하여 삭제할 수 있습니다.

{% highlight javascript %}
exports.logout = function (req, res) {
  req.session.destory();  // 세션 삭제
  res.clearCookie(‘sid’); // 세션 쿠키 삭제
};
{% endhighlight %}

## 레디스 (Redis)와 연동

로그인 프로토콜과 로그아웃프로토콜에 세션 저장과 세션삭제 코드를 추가함으로써, 손 쉽게 세션의 사용이 가능합니다.
하지만 메모리 세션을 사용하면 익스프레스에서 아래와 같은 경고 메세지를 뿌립니다. 

```
Warning: connection.session() MemoryStore is not designed for a production environment, 
as it will leak memory, and obviously only work within a single process.
```

이 내용은 Production 모드에서는 사용하지 말라. 실제 서버에서는 메모리 용량 제한으로 세션 정보를 유실할 수 있다는 내용입니다.
이뿐만 아니라 오토스케일링으로 인한 서버 인스턴스 증가로 세션 정보 공유에 대한 문제가 발생 할 수 있기때문에, 실제 프로덕션에서는 세션을 별도의 저장소로 
레디스, 몽고디비 등을 사용하는데, 이번 튜토리얼에서는 [레디스](http://redis.io)를 사용해 보도록하겠습니다. 우선 노드에서 레디스 서버 연결을 위해 [connect-redis](https://github.com/tj/connect-redis)를 설치합니다. 

``` 
$ npm install connect-redis 
``` 

익스프레스 버전에 따라 세션과 레디스 서버를 연결하지 못하는 경우가 있기 때문에, 
익스프레스에서 제공하는 기본 세션 미들웨어를 사용하기보다는, [express-seesion](https://github.com/expressjs/session)을 사용하는게 편합니다.

 
```
$ npm install express-session 
```

express-session 와 레디 와 익스프레스를 세팅하는 코드는 아래와 같다.

{% highlight javascript %}
var session = require('express-session’),
  RedisStore = require('connect-redis')(session);

app.use(express.cookieParser());
app.use(session({
  store: new RedisStore(/*redis config: host, port 등*/), // 세션 저장소를 레디스 서버로 설정
  /* 이하 express.session 코드와 동일 */
}));
{% endhighlight %}

세션 설정하는 부분에서만 레디스 정보를 추가하고 나머지 부분은 express.session과 동일합니다.

## passport 사용하여 구현하기

위에서는 간단한 코딩으로 세션을 구현해보았는데, 노드플랫폼의 익스프레스 엔진으로 API서버의 인증부분을 구축할때는 [패스포트(passport)](http://passportjs.org/) 
모듈을 많이 사용합니다. 인증을 학위해서, 클라이언트에서 이메일, 비밀번호를 리퀘스트 바디에 담아 서버로 인증요청을 하면 서버는 이를 확인해 인증된 클라이언트 정보를 세션에 저장을 하게 되는데 
패스포트가 그 역할을 하는 것입니다. 즉 패스포트는 노드플랫폼을 위한 인증 미들웨어로써, 매우 유연하며, 모듈형태를 가지고 있어서 어떤 익스프레스기반의 웹어플리케이션에도 적용이 될수 있습니다. 
또한 여러 구현방법의 인증에 대해 지원한다는 장점을 가지고 있습니다. 구현 방법에 대해서는 [패스포트 홈페이지](http://passport.org)에서 검색이 가능합니다.
위에서 구현한 방법은 한번 인증된 클라이언트는 서버에서 받은 세션 아이디를 쿠키 등에 저장해 놓고 있다가, 인증이 필요한 API를 호출할때 세션 아이디 정보를 함께 담아 요청하는 것이죠. 
그럼 서버에서는 이전에 인증한 클라이언트로 보고 API 응답을 보내 주는 구조였지만, 이번에는 패스포트를 사용하여 OAuth 2.0방식으로 구현해보도록 하겠습니다.

OAuth 2.0은 인증정보를 담은 엑서스 토큰(Access Token)을 사용함으로써, 세션에 인증정보를 저장할 필요가 없습니다. 
서버에서는 엑서스토큰을 디코딩하여 확인할 수 있습니다. 이렇기 때문에 OAuth2.0은 개발시 테스트도 편리합니다. 
개발중 서버가 재구동되면 그 때마다 다시 로그인 프로토콜을 호출해야 하는 번거로움이 있었지만, OAuth 2.0을 사용하면 인증 후 획득한 엑세스 토큰을 헤더에 넣어서 호출하면 되기 때문이죠.

우선 인증을 위한 passport 코드를 살펴 보겠습니다. passport.js는 패스포트 설정을 위한 코드입니다. 
email과 password를 받아 인증을 처리하고 그 결과로 인증한 사용자의 아이디를 넘겨주는 역할입니다.

{% highlight javascript %}
/**
 * passport.js
*/

'use strict';

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

exports.setup = function () {
  passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
      },
      function(email, password, done) {
      // 인증 정보 체크 로직
        if (email === 'test@test.com' && password === 'test') {
        // 로그인 성공시 유저 아이디를 넘겨준다.
          var user = {id: 'user_1'};
          return done(null, user);
        } else {
          return done(null, false, { message: 'Fail to login.' });
        }
      }
  ));
};
{% endhighlight %}


로그인은 POST /login 라우팅에서 수행합니다. 패스포트 세팅 작업 선행 후, 라우팅 로직을 구현합니다.

{% highlight javascript %}
/**
* user.js
*/

'use strict';

var express = require('express');
var passport = require('passport');
var auth = require('./auth');

// 패스포트 세팅
require('./passport').setup();

var router = express.Router();

// 로그인 라우팅 POST /login
router.post('/', function(req, res, next) {

  //  패스포트 모듈로 인증 시도
  passport.authenticate('local', function (err, user, info) {
    var error = err || info;
    if (error) return res.json(401, error);
    if (!user) return res.json(404, {message: 'Something went wrong, please try again.'});

    // 인증된 유저 정보로 응답
    res.json(req.user);
  })(req, res, next);
});

module.exports = router;
{% endhighlight %}


## JWT

JWT (Json Web Token)는 인증정보를 암호화하여 url 형식으로 전달해 주는 토큰입니다. 
OAuth 2.0에서는 JWT Bearer Token Flow를 사용할수 있기 때문에 JWT를 이용해 토큰을 관리할 것입니다. 
JWT의 설치는 아래와 같이 실행함으로써, 할 수 있습니다.

```
npm install jsonwebtoken --save
```

이제 JWT 모듈을 추가하고 auth.js 파일을 만들어 Oauth 2.0 인증에 관한 로직을 작성합니다.

{% highlight javascript %}
/**
* auth.js
*/

'use strict';

var jwt = require('jsonwebtoken');
var compose = require('composable-middleware');
var SECRET = 'token_secret';
var EXPIRES = 60; // 1 hour

// JWT 토큰 생성 함수
function signToken(id) {
  return jwt.sign({id: id}, SECRET, { expiresInMinutes: EXPIRES });
}

// 토큰을 해석하여 유저 정보를 얻는 함수
function isAuthenticated() {
  return compose()
      // Validate jwt
      .use(function(req, res, next) {
        var decoded = jwt.verify(req.headers.authorization, SECRET);
        console.log(decoded) // '{id: 'user_id'}'
        req.user = decode;
      })
      // Attach user to request
      .use(function(req, res, next) {
        req.user = {
          id: req.user.id,
          name: 'name of ' + req.user.id
        };
        next();
      });
}


exports.signToken = signToken;
exports.isAuthenticated = isAuthenticated;
{% endhighlight %}


로그인 로직에서는 auth.js 모듈 중 토큰을 생성하는 signToken() 함수를 사용합니다.

{% highlight javascript %}
/**
* login.js
*/

router.post('/', function(req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    var error = err || info;
    if (error) return res.json(401, error);
    if (!user) return res.json(404, {message: 'Something went wrong, please try again.'});

    // access token 생성
    var token = auth.signToken(user.id);
    res.json({access_token: token});
  })(req, res, next);
});
{% endhighlight %}

인증을 필요로하는 프로토콜 인 GET /users는 auth모듈의 isAuthenicated() 함수로 인증된 클라이언트임을 보장합니다.

{% highlight javascript %}
/**
* user.js
*/

/* GET users listing. */
router.get('/', auth.isAuthenticated(), function(req, res) {
  res.send(req.user);
});
{% endhighlight %}


노드 모듈인 express-jwt는 두 가지 역할을 수행합니다. 
(1) 인증된 클라이언트의 엑세스 토큰을 디코딩하고 
(2) 인증된 유저정보를 req.user에 저장합니다. 
내부적으로는 jsonwebtoken 모듈을 사용하여 .decode() 함수를 호출하고 있습니다. 아래는 express-jwt 모듈을 적용한 코드이니, 실습을 해보시면 좋을 것 같습니다.

{% highlight javascript %}
/**
 * auth.js
 */

'use strict';

var jwt = require('jsonwebtoken');
var compose = require('composable-middleware');
var SECRET = 'token_secret';
var EXPIRES = 60; // 1 hour

// jwt에서 사용한 시크릿 문자열과 동일한 문자열로 객체 생성
var validateJwt = require('express-jwt')({secret: SECRET});

function isAuthenticated() {
  return compose()
      // Validate jwt
      .use(function(req, res, next) {
        // 만약 access_token 파라메터에 토큰을 설정한 경우 리퀘슽 헤더에 토큰을 설정한다.
        if(req.query && req.query.hasOwnProperty('access_token')) {
          req.headers.authorization = 'Bearer ' + req.query.access_token;
        }

        // 토큰 인증 로직
        validateJwt(req, res, next);
      })
      // Attach user to request
      .use(function(req, res, next) {
        req.user = {
          id: req.user.id,
          name: 'name of ' + req.user.id
        };
        next();
      });

}
{% endhighlight %}

