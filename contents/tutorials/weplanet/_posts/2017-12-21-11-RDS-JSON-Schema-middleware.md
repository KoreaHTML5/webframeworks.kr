---
layout : tutorials
category : tutorials
title : AWS Severless IoT 11 – RDS+JSON Schema middleware
subcategory : setlayout
summary : AWS Severless IoT에 대해 알아봅니다.
permalink : /tutorials/weplanet/11-RDS-JSON-Schema-middleware
author : marcushong
tags : aws
title\_background\_color : F1F71A
---



### ORM (Sequelize...etc)

Lambda proxy + express.js를 사용하게 되면 Sequelize와 같은 ORM을 사용할 수는 있으나 Lambda 함수의 응답속도가 극단적으로 떨어지게 된다.
ORM은 express.js가 최초 실행될 때 데이터베이스와 동기화를 한다. 
이 동기화 과정에는 소스에서 선언한 테이블 생성, 삭제, 수정과 같은 부하가 큰 작업들이 있기 때문에 Lambda함수에서 ORM을 사용하는 것은 매우 비효율적이다.
따라서 ORM을 쓰고 싶다면, 별도의 SQL Proxy 서버가 가장 확실한 대안이다. 
또한 Lambda는 한번만 실행되므로, pool을 사용하는 것 또한 비효율적이다.
여기서는 ORM의 근본적인 대안은 아니지만 입출력값을 [JSON Schema](http://json-schema.org)를 통해 검증하는 방법을 사용한다.

### JSON Schema

JSON Schema는 좀 더 쉽게 데이터를 교환하고 저장하기 위하여 만들어진 데이터 교환 표준이다.
데이터 타입, 범위, 필수 값 검증등이 가능하며 하이퍼스키마를 사용하게 되면 base64 검증등 다양한 검증이 가능하다.

### ajv

[ajv](https://github.com/epoberezkin/ajv)를 사용해서 proxy request를 검증하는 middleware와 sql 이 실행된 후 출력된 값이 제대로 나왔는지 검증을 하는 기능을 구현해보자.

### request middleware

```js
const Ajv = require('ajv')

function convert(data, schema, options) {
  if (!schema) return data
  const ajv = new Ajv(options)

  const validate = ajv.compile(schema)
  if (!validate(data)) {
    throw ajv.errorsText()
  }
}

module.exports = (schema) => {
  return function (req, res, next) {
    try {
      const options = Object.assign({}, req.params, req.query, req.body, req.file)
      req.options = convert(options, schema, {useDefaults: true, coerceTypes: 'array'})
      next()
    }
    catch (message) {
      next({code: 400, message: message})
    }
  }
}
```

- coerceTypes은 받아야 하는 query 데이터가 배열인데도 하나의 데이터를 전달받았을 때, json schema에 배열로 선언되어 있다면 배열로 변환해 주는 옵션이다.
- useDefaults은 request에서 선언되어있지 않더라도 json schema에 default값이 있다면 default값을 생성하는 옵션이다.

### Database 출력 검증

```js
module.exports.executeRaw = async (options) => {
  console.log(options.sql)
  const result = await connection.query(options.sql)
  if (options.schema) {
    result.forEach(item => {
      convert(item, options.schema, {removeAdditional: true})
    })
  }
  return result
}
```

- removeAdditional은 json schema에 선언된 이외의 값들이 있다면 객체에서 삭제하는 옵션이다.