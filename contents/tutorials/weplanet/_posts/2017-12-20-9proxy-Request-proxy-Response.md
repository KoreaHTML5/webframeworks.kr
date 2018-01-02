---
layout : tutorials
category : tutorials
title : AWS Severless IoT 9 – Proxy Request, Proxy Response
subcategory : setlayout
summary : AWS Severless IoT에 대해 알아봅니다.
permalink : /tutorials/weplanet/9proxy-Request-proxy-Response
author : marcushong
tags : aws
title\_background\_color : F1F71A
---



### proxy Request

API Gateway Swagger에서 만든 lambda proxy는 express에서 쓰는 body-parser를 쓰게 되면 express와 동일하게 사용할 수 있다. 

```js
  const app = express()
  app.use(cors())
  app.use(bodyParser.json({limit: '1mb'}))
  app.use(bodyParser.urlencoded({extended: true}))
```

#### authorization

private API에는 cognito authorization을 선언했다. Request 생성 시 header에 authorization 키에 idToken만 넣으면 API Gateway에서 인증이 된 후 Lambda가 실행이 되므로 편리하다.
또한 idToken을 그대로 사용할 수 있으므로, 필요한 정보가 있다면 idToken에 추가해도 무방하다.

```sh
curl -X GET "{url}" -H "Authorization: {idToken}"
```

### proxy Reponse

- Response는 특별한 설정을 하지 않는 한 json 타입이어야 한다.
- Error Response는 customize할 수 있지만 aws 기본을 그대로 따르는 것을 추천한다. 변환을 API Gateway에서 해주더라도 Local에서 사용하는 express에는 그 설정이 적용되지 않기 때문에 별도 작업이 필요하기 때문이다.

### Error Response Middleware

매번 규격에 맞춰 Error Reponse를 만드는 것은 피곤한 일이다. 따라서 다음과 같이 middleware를 만들어서 error message가 있다면 일괄적으로 처리하자.

```js
// controller
const user = require('../../../models/user')

module.exports.getUser = async (req, res, next) => {
  try {
    const result = await user.getUserInfo(req.options)
    res.json(result)
  }
  catch (err) {
    next(err)
  }
}
```

```js
// error-handler.js
const serializeError = require('serialize-error')

function errorHandler(err, req, res, next) {
  let code = 500
  if (err.code && !isNaN(err.code)) code = err.code
  if (err instanceof Error) {
    try {
      res.status(err.statusCode || code).json({errorMessage: serializeError(err)})
    }
    catch (error) {
      res.status(500).json({errorMessage: error})
    }

  }
  else if (err.errorMessage) {
    res.status(code).json({errorMessage: serializeError(err.errorMessage)})
  }
  else {
    res.status(code).json(err)
  }
}

module.exports = (app) => {
  app.use((req, res) => {
    res.status(404).json()
  })
  app.use(errorHandler)
}
```

