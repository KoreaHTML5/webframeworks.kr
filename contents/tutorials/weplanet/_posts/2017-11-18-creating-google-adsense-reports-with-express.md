---
layout : tutorials
category : tutorials
title : Express로 Google AdSense 보고서 작성하기 
subcategory : setlayout
summary : Express로 Google AdSense 보고서 작성하는 방법에 대해 알아봅니다. 
permalink : /tutorials/weplanet/creating-google-adsense-reports-with-express
author : danielcho
tags : node express
title\_background\_color : F1F71A
---

> 본 포스팅은 [Christoph Michel][1] 의 [Creating Google AdSense Reports with Express][2] 를 저자의 허락하에 번역한 글입니다. 오탈자, 오역 등이 있다면 연락부탁드립니다.

필자는 필자의 앱들의 AdMob 수익에 대한 일일 보고서를 [PushOver Notification Service][3]를 사용하여 휴대폰으로 보내고 싶었지만, Node.js와 Express.js를 사용하여 Google AdSense (+AdMob) 수익 정보를 가져오는 어떠한 예제/사례도 찾을 수 없었다. 대부분의 다른 언어는 [코드 예제][4]가 있었지만 Google-API-NodeJS-Client에 대해서는 없었기 때문에, 본 포스팅에서는 이를 다루려고 한다.


## 설정하기

우리는 [google-api-nodejs-client][5]을 사용하려고 하며, 이를 OAuth로 인증하려고 한다. 당신이 이미 Google 개발자 콘솔에서 웹 응용 프로그램을 설치했고, AdSense 관리 API를 추가하였으며, 증명서(credentials)을 만들었다고 가정하겠다. (테스트 목적으로 당신은  *localhost* 증명서를 만들 수 있다.) 증명서를 *.json* 파일 형태로 다운로드한다. (*clientsecret.apps.googleusercontent.com*). [Getting Started][6] 가이드를 읽어보는 것도 도움이 된다. 우선, 새 프로젝트를 만들고 *npm install --save express googleapis* 를 사용하여 *dependencies*를 설치한다.


## 인증하기

Express.js 응용 프로그램에서 인증하기 위해서 Google OAuth를 사용한다. 그러므로, 우리는 엑세스(*adsense.readonly*)의 범위를 정의하고 Google 승인 페이지, 즉 접근 허가 페이지로 다시 보내는 경로(*/auth/google*)를 제공한다. 사용자가 확인을 하면, Google은 인증 토큰을 증명서(*redirect_uris*) 파일에서 정의된 *callback* 경로로 보낸다. 걱정하지 마라. *refresh_token*을 받기 위해서 한번만 수동으로 인증하면 된다. 그것을 저장하고 엑세스 토큰이 만료되면 항상 새롭게 요청할 수 있다. 


```javascript
import google from 'googleapis'
const config = require('./client_secret_*.apps.googleusercontent.com.json').web

const scope = 'https://www.googleapis.com/auth/adsense.readonly'

const oauth2Client = new google.auth.OAuth2(
  config.client_id,
  config.client_secret,
  config.redirect_uris[0],  // may NOT be an array. Otherwise, the consent site works, but silently fails in getToken.
)

const consentURL = oauth2Client.generateAuthUrl({
  access_type: 'offline', // 'online' (default) or 'offline' (gets refresh_token)
  scope,  // If you only need one scope you can pass it as string
  prompt: 'consent',    // always prompt for consent
})

app.get('/auth/google', (req, res) => {
  res.redirect(consentURL)
})

// oauth2callback as defined in config.redirect_uris[0] in the Google Dev Console
app.get('/oauth2callback', (req, res) => {
  getTokens(req.query.code,
(tokens) => {
  // save tokens somewhere in a DB or a file
  res.send(Received code: ${req.query.code}<br>Tokens: ${JSON.stringify(tokens)}<br>Save them.)
},
(err, response) => res.send(Received an error while trying to get tokens with code ${req.query.code}: ${err}\n${JSON.stringify(response)}),
  )
})

function getTokens(code, sucCallback, errCallback) {
  oauth2Client.getToken(code, (err, tokens, response) => {
if (!err) {
  // set the tokens here for future API requests
  oauth2Client.setCredentials(tokens)
  sucCallback(tokens)
} else {
  errCallback(err, response)
}
  })
}
```

## AdSense 보고서 데이터 가져오기

클라이언트가 인증되고 토큰이 설정되면, 당신은 *googleapis*의 *adsense* API 를 사용하여 당신의 수익 데이터를 가져올 수 있다. 필요한 경우 만료된 엑세스 토큰은 *oauth2Client.getAccessToken(callback)*에서 처리되어 업데이트할 수 있다. 당신은 시작일과 종료일을 지정하여 쿼리를 맞춤 설정할 수 있고, 또는 *dimension*을 설정하여 총 수익을 개별 광고로 나눌 수 있다. AdSense API를 어떻게 사용하는지 확인하고, 이런저런 기능을 확인해보기 위해서는 [해당 문서][7]를 참고하는게 좋다.

```javascript
// make sure oauth2Client's credentials are set
// with oauth2Client.setCredentials(tokens) as in getTokens
// or somewhere else with the saved tokens

app.get('/adsense', (req, res) => {
  getLatestReport(
(err, reportString) => {
  if (err) {
// Send error per push notification, E-Mail etc.
  } else {
// Send report per push notification, E-Mail etc.
// send(reportString)
  }
})
})

function getLatestReport(callback) {
  const adsense = google.adsense('v1.4')
  // Get a non-expired access token, after refreshing if necessary https://github.com/google/google-auth-library-nodejs/blob/master/lib/auth/oauth2client.js
  oauth2Client.getAccessToken((err, accessToken) => {
if (err) {
  callback(getAccessToken Error: ${err})
  return
}
// create report for yesterday. Today's revenue info is still inaccurate
const date = moment().add(-1, 'days').format('YYYY-MM-DD')
const params = {
  accountId: 'pub-58**************',
  startDate: date,
  endDate: date,
  auth: oauth2Client,
  metric: 'EARNINGS',   // https://developers.google.com/adsense/management/metrics-dimensions
  dimension: 'AD_UNIT_NAME',
}
adsense.accounts.reports.generate(params, (errReport, resp) => {
  if (errReport) {
callback(errReport)
  } else {
callback(null, reportToString(resp))
  }
})
  })
}

function reportToString(report) {
  const date = moment(report.endDate)
  let response = AdMob Income for ${date.format('dddd MMM Do')}:
  const numRows = report.totalMatchedRows
  const rows = report.rows
  const currency = report.headers.find(x => x.name === 'EARNINGS').currency
  for (let i = 0; i < numRows; i += 1) {
// This depends on your naming convention of your Ad units
const name = rows[i][0].split('_')[0]
const earnings = rows[i][1]
response += \n${name}: ${earnings}${currency}
  }
  // console.log(report)
  response += \nTotal: ${report.totals[1]}${currency}
  return response
}
```

필자는 *cronjob*을 하루에 돌린다. 즉, 이를 사용하여 PushOver가 노티피케이션으로 보고서를 전달해주는 스크립트에 하루에 한번 접근한다. 그 출력은 다음과 같다:

![][image-1]


[1]:	http://cmichel.io/
[2]:	http://cmichel.io/creating-google-adsense-reports-with-express/
[3]:	https://pushover.net/
[4]:	https://developers.google.com/adsense/management/libraries
[5]:	https://github.com/google/google-api-nodejs-client
[6]:	https://developers.google.com/adsense/management/getting_started
[7]:	https://developers.google.com/adsense/management/v1.4/reference/accounts/reports/generate

[image-1]:	http://cmichel.io/creating-google-adsense-reports-with-express/google-pushover-adsense-reports.png