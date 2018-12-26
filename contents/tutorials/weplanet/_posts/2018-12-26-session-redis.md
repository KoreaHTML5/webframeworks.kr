---
layout : tutorials
category : tutorials
title : session을 사용하고 docker-compose로 redis를 손쉽게 설치해봅시다.  
subcategory : setlayout
summary : express.js에서 session을 사용하고 docker-compose로 redis를 손쉽게 설치해봅시다.
permalink : /tutorials/weplanet/session-redis
author : marcushong
tags : session redis
title\_background\_color : F1F71A
---

### Session
최근에 jwt를 이용한 token을 이용해 사용자 인증을 하는 경우가 많지만,
관리자 페이지와 같이 좀 더 보안을 강화해야 할 경우에는 Session을 사용해야 할 경우도 있다.

### Persistent Storage 
세션 정보를 저장해야 할 경우 여러가지 옵션이 있지만, In-memory DB인 redis를 사용하는 것이 좋다.
mysql과 같은 데이터베이스를 사용할 수도 있지만, 세션을 위한 별도의 데이터베이스를 사용하지 않는 이상 추가적으로 불필요한 테이블이 생성된다. 

### 구현
express.js로 세션을 구현해 보자.
express 초기화 시에 아래와 같이 미들웨어만 추가하면 된다.
```javascript
const express = require('express')
const session = require('express-session')
const RedisStore = require('connect-redis')(session)

const app = express()

const sess = {
  name: 'g_session_id',
  secret: '~Hx2nvdsadasdsd%$+',
  resave: false,
  rolling: true,
  saveUninitialized: false,
  cookie: {secure: true},
  store: new RedisStore({host: 'redis', port: 6379})
}

app.set('trust proxy', 1)
app.use(session(sess))

```

### 배포
redis서버를 추가하는 것은 별도의 인프라비용이 필요한데, 간단히 docker-compose로 redis를 추가할 수 있다.

```yaml
version: '3.6'
services:
  api:
    image: image_url:latest
    restart: always
    networks:
      - nginx-proxy

  redis:
    image: redis:4
    restart: always
    networks:
      - nginx-proxy

networks:
  nginx-proxy:
    name: nginx-proxy

```
