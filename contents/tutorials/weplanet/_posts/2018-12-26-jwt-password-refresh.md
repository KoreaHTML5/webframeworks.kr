---
layout : tutorials
category : tutorials
title : JWT + 패스워드 변경 + Refresh Token
subcategory : setlayout
summary : jwt 사용 시에 패스워드를 초기화 시켰을 때 Refresh Token 처리방법에 대해서 알아봅시다.
permalink : /tutorials/weplanet/web-sdk
author : marcushong
tags : jwt
title\_background\_color : F1F71A
---

### JWT(JSON Web Token)
* 회원 인증을 위해서 JWT를 사용하게 되면 유저의 세션을 유지할 필요가 없기 때문에 세션 관리가 필요없다.
서버 자원을 많이 절약할 수 있기 때문에 많이 사용한다.

### 필요
* 어떤 특정한 상황에서, 예를 들어 유저의 비밀번호가 노출된 상황에 패스워드를 초기화 했을 경우에 
발급한 Token을 무효화(revoke) 시킬 필요가 있을 때가 있다. 
하지만 이미 발급한 Token은 영구저장소에 저장해 보관해 비교하지 않는 이상 확인할 수 있는 방법이 없다.
 
* Token을 영구저장소에 저장 후 매번 비교하는 것은 이미 세션과 다름없어서 JWT의 장점이 사라지게 된다.

### 대안
* 토큰 생성 시에 access token과 refresh token을 만든다. access token의 유효시간을 짧게 한 후 일정 시간이 지나면, 
refresh token으로 토큰을 다시 갱신시키게 한다. 

* id, password를 저장할 때 다음과 같이 password hash값과 salt 값을 영구저장소에 저장한다. 
```javascript
const crypto = require('crypto')

function createPasswordHash(password) {
  const salt = crypto.randomBytes(64).toString('base64').replace(/[^A-Za-z0-9]/g, '')
  crypto.pbkdf2(password, salt, 103312, 64, 'sha512', (err, key) => {
    if (err) reject(err)
    resolve({password: key.toString('base64'), salt})
  })
}

```
* salt 값은 유저가 매번 패스워드를 변경할 때마다 바뀌게 된다. 이 salt 값으로 refresh token을 암호화 해서 생성한다.
```javascript
const jwt = require('jsonwebtoken')

async function createRefreshToken(userId, salt) {
  try {
    const payload = {sub: userId}
    return await jwt.sign(payload, salt,
      {
        algorithm: 'HS256',
        expiresIn: 60 * 60 * 24 * 7
      })
  } catch (err) {
    throw err
  }
}
```

* refresh token 시 저장한 salt를 가져와서 검증 후 access token을 생성한다.
```javascript
const jwt = require('jsonwebtoken')
const fs = require('fs')
const privateKey = fs.readFileSync(`${__dirname}/private.pem`)
const publicKey = fs.readFileSync(`${__dirname}/public.pem`)

async function refreshToken(accessToken, refreshToken, salt) {
  try {
    const payload = await jwt.verify(accessToken, publicKey, {algorithms: 'RS256', ignoreExpiration: true})
    if (payload.type === 'email') {
      await jwt.verify(refreshToken, salt, {algorithms: 'HS256'})
      delete payload.iat
      delete payload.exp
      delete payload.nbf
      delete payload.jti
      return await createAccessToken(payload)
    } else {
      throw 'accessToken type should be email type'
    }
  } catch (e) {
    throw {status: 401, message: e}
  }
}

async function createAccessToken(userId) {
  try {
    const payload = {sub: userId}
    return await jwt.sign(payload, privateKey,
      {
        algorithm: 'RS256',
        expiresIn: 60 * 60
      })
  } catch (err) {
    throw err
  }
}
```
### 결론
* 이제 access token을 재발급 받을 경우에만 영구저장소에 저장된 salt값을 사용해 decode한 후 재발급하면 jwt의 장점을 살리면서 
발급한 access token을 즉시적으로는 아니지만 빠른 시간안에 무효화 할 수 있다. 

* 이 같은 방법은 모바일 앱에서 하나의 기기만 사용하는 경우에도 활용할 수 있다. 
이 경우에는 salt를 사용할 것이 아니라 로그인 시마다 refresh token hash를 별도 생성해 저장해 두고 그 hash값으로 encode, decode하면 된다.
