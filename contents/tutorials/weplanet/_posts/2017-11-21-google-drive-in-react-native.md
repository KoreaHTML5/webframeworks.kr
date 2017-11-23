---
layout : tutorials
category : tutorials
title : React Native에서 Google Drive 사용하기
subcategory : setlayout
summary : React Native에서 Google Drive를 사용하는 방법에 대해 알아봅니다. 
permalink : /tutorials/weplanet/google-drive-in-react-native
author : danielcho
tags : react
title\_background\_color : F1F71A
---

> 본 포스팅은 [Christoph Michel][1] 의 [Google Drive in React Native][2]를 저자의 허락하에 번역한 글입니다. 오탈자, 오역 등이 있다면 연락부탁드립니다.

이번 포스팅에서는 React Native에서 Google Drive를 사용하여 어떻게 앱 데이터를 저장하거나 불러오는지 다룬다. 필자는 이것을 앱내 사용자 관련(user-specific) 데이터를 일관되게 저장할 수 있는 공간으로 사용한다. 특히 외부 SD카드의 대안으로 말이다. 

## 구글 로그인
첫 번째 단계는 구글 로그인을 설정하고 당신의 응용프로그램이 구글 드라이브 서비스를 사용하도록 승인하는 것이다. 이것을 위한 React Native 모듈이 이미 있다. [react-native-google-signin][3]를 참고하면 된다.

아래를 참고해보자. 해당 모듈은 로그인(Sign-In) 버튼에서 시작하여, 로그인 양식, *Grant Access* 모달을 제공한다. 

![][image-1]

안타까운 소식은 이것이 [더 이상 유지되고 있지 않으며,][4] 최신 React Native 버전에서는 작동하지 않는다는 것이다. 필자가 현재 사용하고 있는 구글 로그인 모듈은 [JoonhoCho가 Fork한 버젼][5]이다. 

*Sign-in* 서비스를 사용하기 전에, Firebase 콘솔에 *Google Project*를 설치해야 하고 (아직 설치하지 않았다면) [구성 파일을 가져와야][6] 한다. 

참고로 이 기능 에뮬레이터에서는 사용할 수 없다. *Google Play Services / Firebase*의 버젼 10을 지원하는 에뮬레이터가 (이 글을 쓰고 있는) 현재는 없기 때문이다. 따라서 가지고 있는 기기에서 테스트해서 확인하는 것이 좋다. 만약 문제가 있다면 [*Google Play services out of date. Requires 10084000 error.*][7] 오류가 나타날 것이다. 

## 로그인 & 엑세스 토큰
모든 설정이 완료되었다면, 구글 드라이브에 로그인할 수 있고, [*Google Drive App Data*][8]를 요청할 수 있을 것이다. 이를 통해 우리가 개발하는 앱을 위한 전용 폴더에 접근할 수 있다. (참고로 이 폴더는 숨겨져 있다.) 안드로이드에서 [react-native-google-sign-in][9]을 사용하는 방법은 다음과 같다.

```javascript
export const configureGoogleSignIn = async () => GoogleSignIn.configure({
  // https://developers.google.com/identity/protocols/googlescopes
  scopes: ['https://www.googleapis.com/auth/drive.appdata'],
  shouldFetchBasicProfile: true,
  // serverClientID: '484169055555-q2hui34hui23h4u23h4ui23h4ui2h34u.apps.googleusercontent.com',  // I didn't need to set these for appdata here
  // offlineAccess: false,
  // forceCodeForRefreshToken: false,
})

onSignInPress = async () => {
await configureGoogleSignIn()
  .then(() => GoogleSignIn.signInPromise()
  // dispatch a redux-thunk with the accessToken once signed in
  .then(userProfile => this.props.dispatchGoogleDrive(userProfile.accessToken))
  .catch(err => console.log('configureGoogleSignIn', err))
  }
```

이 요청은 일부 사용자 정보 *userProfile*과 구글 드라이브 API에 사용할 *access token*로 리턴된다.

## 구글 드라이브 API v3 with Fetch
API에 접근하는 것을 쉽게 만들어주는 [node.js googleapi client][10] 와 [Google API JavaScript Client Library][11]가 있다. 그러나 필자는 *accessToken*을 React Native에서 사용하는 것은 시도해보지 않았다. 대신, Fetch 방식의 HTTP 통신을 통하여 Google Drive API v3과 바로 통신한다. 

몇 가지 설정이 필요한데, *Authorization-Header*를 `Bearer ${apiToken}`으로, *Content-Type*은 `multipart/related; boundary=${boundaryString}`로 설정한다. 이는 메타 데이터와 함께 파일을 업로드하기 위함이며, [업로드 예시][12]를 참고하면 된다. 

이 [Gist][13]는 *Google Drive API v3*와 *fetch*를 사용하여 완전히 작동하는 *download*와 *create+update* 예시를 잘 보여준다. 

```javascript
import GoogleSignIn from 'react-native-google-sign-in'

const url = 'https://www.googleapis.com/drive/v3'
const uploadUrl = 'https://www.googleapis.com/upload/drive/v3'

const boundaryString = 'foo_bar_baz' // can be anything unique, needed for multipart upload https://developers.google.com/drive/v3/web/multipart-upload

let apiToken = null

export const configureGoogleSignIn = async () => GoogleSignIn.configure({
// https://developers.google.com/identity/protocols/googlescopes
  scopes: ['https://www.googleapis.com/auth/drive.appdata'],
  shouldFetchBasicProfile: true,
})

export function setApiToken(token) {
  apiToken = token
}

function parseAndHandleErrors(response) {
  if (response.ok) {
return response.json()
  }
  return response.json()
.then((error) => {
  throw new Error(JSON.stringify(error))
})
}

function configureGetOptions() {
  const headers = new Headers()
  headers.append('Authorization', Bearer ${apiToken})
  return {
method: 'GET',
headers,
  }
}

function configurePostOptions(bodyLength, isUpdate = false) {
  const headers = new Headers()
  headers.append('Authorization', Bearer ${apiToken})
  headers.append('Content-Type', multipart/related; boundary=${boundaryString})
  headers.append('Content-Length', bodyLength)
  return {
method: isUpdate ? 'PATCH' : 'POST',
headers,
  }
}

function createMultipartBody(body, isUpdate = false) {
  // https://developers.google.com/drive/v3/web/multipart-upload defines the structure
  const metaData = {
name: 'data.json',
description: 'Backup data for my app',
mimeType: 'application/json',
  }
  // if it already exists, specifying parents again throws an error
  if (!isUpdate) metaData.parents = ['appDataFolder']

  // request body
  const multipartBody = \r\n--${boundaryString}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n
${JSON.stringify(metaData)}\r\n
--${boundaryString}\r\nContent-Type: application/json\r\n\r\n
${JSON.stringify(body)}\r\n
--${boundaryString}--

  return multipartBody
}

// uploads a file with its contents and its meta data (name, description, type, location)
export function uploadFile(content, existingFileId) {
  const body = createMultipartBody(content, !!existingFileId)
  const options = configurePostOptions(body.length, !!existingFileId)
  return fetch(${uploadUrl}/files${existingFileId ? /${existingFileId} : ''}?uploadType=multipart, {
...options,
body,
  })
.then(parseAndHandleErrors)
}

// Looks for files with the specified file name in your app Data folder only (appDataFolder is a magic keyword)
function queryParams() {
  return encodeURIComponent("name = 'data.json' and 'appDataFolder' in parents")
}

// returns the files meta data only. the id can then be used to download the file
export function getFile() {
  const qParams = queryParams()
  const options = configureGetOptions()
  return fetch(${url}/files?q=${qParams}&spaces=appDataFolder, options)
.then(parseAndHandleErrors)
.then((body) => {
  if (body && body.files && body.files.length > 0) return body.files[0]
  return null
})
}

// download the file contents given the id
export function downloadFile(existingFileId) {
  const options = configureGetOptions()
  if (!existingFileId) throw new Error('Didn\'t provide a valid file id.')
  return fetch(${url}/files/${existingFileId}?alt=media, options)
.then(parseAndHandleErrors)
} `

그런 다음, 파일을 다운로드 하기 위해서 다음의 *redux-thunk* 를 사용할 수 있다.

```javascript
export const dispatchGoogleDrive = apiToken => (dispatch) => {
  dispatch({ type: ActionNames.dataRestoreStart })
  setApiToken(apiToken)
  return getWorkoutFile()
    .then((file) => {
      if (file) {
        return downloadFile(file.id)
      }
      throw new Error('No existing backup file found.')
    })
    .then((data) => {
      dispatch({
        type: ActionNames.dataRestoreFinished,
        payload: data,
      })
    })
    .catch(err => dispatch({ type: ActionNames.dataRestoreError, payload: err }))
}
```

물론, 이것은 Google Drive API에서만 작동하는 것이 아니다. 유사한 방식으로 어떠한 구글 API도 이용할 수 있다. 


[1]:	http://cmichel.io/
[2]:	http://cmichel.io/google-drive-in-react-native/
[3]:	https://github.com/devfd/react-native-google-signin
[4]:	https://github.com/devfd/react-native-google-signin/issues/186
[5]:	https://github.com/joonhocho/react-native-google-sign-in
[6]:	https://developers.google.com/identity/sign-in/android/start-integrating
[7]:	https://stackoverflow.com/questions/41100106/google-play-services-out-of-date-requires-10084000-but-found-9879470-cant-upd
[8]:	https://developers.google.com/drive/android/appfolder
[9]:	https://github.com/joonhocho/react-native-google-sign-in
[10]:	https://github.com/google/google-api-nodejs-client
[11]:	https://developers.google.com/api-client-library/javascript/start/start-js
[12]:	https://developers.google.com/drive/v3/web/multipart-upload
[13]:	https://gist.github.com/MrToph/2954448ddb1f8cdd1c162ef5e162e869

[image-1]:	https://github.com/apptailor/react-native-google-signin/raw/master/img/demo-app.gif