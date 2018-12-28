---
layout : tutorials
category : tutorials
title : JSON schema + router middleware
subcategory : setlayout
summary : JSON schema를 router middleware에서 사용하는 방법을 알아봅시다
permalink : /tutorials/weplanet/json-schema-router-middleware
author : marcushong
tags : json_schema middleware
title\_background\_color : F1F71A
---

### JSON Schema
- JSON Schema is a powerful tool for validating the structure of JSON data. (https://json-schema.org/understanding-json-schema/index.html)
- JSON 데이터 검증을 위한 도구이다.
- Swagger, OpenAPI에서 사용
- 많은 오픈 소스에서 입력값 검증용으로 사용중

### router middleware
일반적으로 REST API에서 입력값 검증은 코드상에서 하게 된다.
하지만, router middleware에서 JSON schema를 사용한다면 파라미터 검증 작업이 간편해 질 수 있다.
express.js에서 JSON Schema를 사용해 로그인 시의 입력값을 검증해보자.

### PostAuth.json
id로 email, password는 6~20 글자 사이의 영문,숫자 및 특정 특수문자를 포함하는 예이다.
email과 같이 많이 쓰이는 항목은 이미 format으로 JSON schema에 정의가 되어있어 편리하다.
이외에도 date-time, hostname, uri 등이 있다. (https://json-schema.org/understanding-json-schema/reference/string.html)

```json
{
  "type": "object",
  "properties": {
    "email": {
      "type": "string",
      "format": "email"
    },
    "password": {
      "type": "string",
      "pattern": "^[0-9a-zA-Z!@#$%^&*()?+-_~=\/]{6,20}$"
    }
  },
  "required": [
    "email",
    "password"
  ],
  "additionalProperties": false
}
```

### express.js + ajv.js
JSON schema 검증 라이브러리인 ajv를 사용해서 express.js 미들웨어를 만들어보자.

```js
const app = express()
const router = express.Router()
const Ajv = require('ajv')
const PostAuth = require('./PostAuth.json')

router.post('/auth', function (req, res, next) {
  if (!ajv.validate(PostAuth, req.body)) {
    res.status(400).json({message: ajv.errorsText()})
  } else {
    next()
  }
}, function (req, res, next) {
  res.render('login success!');
})
```

### Test
password를 형식에 맞지 않게 입력해서 테스트 해보면 400 에러와 함께 오류가 생긴 이유에 대해서 응답값이 내려오는 것을 확인할 수 있다.

```sh
curl -X POST "http://localhost:3000/auth" -d "{\"email\":\"user@example.com\",\"password\":\"str\"}"

{"status":400,"message":"data.password should match pattern \"^[0-9a-zA-Z!@#$%^&*()?+-_~=\/]{6,20}$\"}"
```

### 정리
JSON Schema로 손쉽게 입력값 검증을 하는 방법을 알아보았다.
REST API에서 많은 버그가 입력값 검증에서 발생하는데 JSON Schema를 활용하면 좀 더 직관적이고, 간편하게 검증을 할 수 있다.