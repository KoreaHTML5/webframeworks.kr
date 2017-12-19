---
layout : tutorials
category : tutorials
title : Mock API를 만들기 위해 json-server 이용하기 (1/2)
subcategory : setlayout
summary : Mock API를 만들기 위해 json-server 이용하기에 대해 알아봅니다.
permalink : /tutorials/weplanet/How to Use json-server to Create Mock APIs1
author : danielcho
tags : node.js
title\_background\_color : F1F71A
---



> 본 포스팅은 [Ayush Gupta](https://ayushgp.github.io/)의 [How to Use json-server to Create Mock APIs](https://ayushgp.github.io/use-json-server-create-mock-apis/)를 저자의 허락하에 번역한 글입니다. 오탈자, 오역 등이 있다면 연락부탁드립니다.

  

당신은 모바일/ 웹 앱에 대한 멋진 아이디어가 있고, 프런트엔드 작업을 즉시 시작하고 싶습니다. 하지만, API 없이는 앱을 계속 진행할 수 없기 때문에 API를 먼저 만들어야 합니다. 

[json-server](https://github.com/typicode/json-server) 는 이러한 문제를 해결해 줄 오픈 소스 Mock API 도구입니다. 본 도구는 최소한의 설치로 구현할 수 있고, 몇 분 안에 데이터베이스가 있는 API를 생성하게 해줍니다. JSON-server와 Mock CRUD API를 만드는 것은 코딩이 전혀 필요 없습니다. 필요한 몇 가지 설정 파일을 작성하면 됩니다. 

[RESTful principles](http://www.restapitutorial.com/) 과 [how to consume APIs](https://www.codementor.io/restful/tutorial/rest-api-design-best-practices-strategy)에 대한 기본적인 지식이 있다고 가정하고 진행합니다.



## 설치 

다음과 같은 도구가 필요합니다.

- [Node.js](https://nodejs.org/en/): json-server는 Node.js 서버 위에 구축됩니다 ([how to use JSON files in Node.js](https://www.codementor.io/nodejs/tutorial/how-to-use-json-files-in-node-js)를 참고하세요.)
- [npm](https://www.npmjs.com/): Node.js 패키지 메니저 
- [cURL](https://curl.haxx.se/): 서버 경로를 테스트하는 유틸리티
- 선택사항 : 서버의 경로를 테스트하기 위해 [Postman](https://www.getpostman.com/) 를 사용할 수도 있습니다.





### 윈도우 환경 

윈도우에서 cURL 설정하는 것은 조금 헷갈리지만, 이 [Stack Overflow answer](http://stackoverflow.com/a/16216825) 이 도움이 될 것입니다.

json-server를 설치하기 위해, 터미널을 열고 다음의 커맨드를 입력하십시오.

```
$ npm install -g json-server
```



 `-g` 는 json-server를 시스템 전역에 설치합니다. 이렇게 하면 원하는 디렉토리에서 서버를 실행할 수 있습니다. 





## 리소스

### 리소스란?

이름 붙여질 수 있는 모든 정보는 리소스가 될 수 있습니다. 예를 들어, 책 리뷰 웹사이트 작업을 하고 있을 경우, 책, 유저, 리뷰 등이 리소스가 됩니다. 

API endpoints는 이러한 자원의 이름을 따릅니다. 우리는 이러한 endpoints를 우리 서버의 데이터 검색 및 업데이트에 사용합니다.



### 리소스 만들기

json-서버는 JSON 파일에서 구동됩니다. 이것은 우리의 Mock Server의 환경 설정과 데이터베이스 파일 역할을 합니다. `Database.json`이라고 불리는 파일을 만들고 다음의 콘텐트를 추가하십시오.

```
{
	"books": [
		{
			"id": 101, 
			"title": "Zero to One", 
			"author":"Peter Thiel", 
			"year_published": 2014,
			"rating": 4.03
		},
		{
			"id": 102, 
			"title": "The Origin of Species", 
			"author": "Charles Darwin", 
			"year_published": 1889,
			"rating": 4.20
		}
	]
}

```



이 파일을 저장하고 다음을 사용하여 서버를 구동시키십시오.

```
$ json-server --watch Database.json
```



이제 작동되는 책 API가 있습니다. “책” 리소스에 관한 모든 CRUD 조작을 수행할 수 있습니다. 

이 서버를 테스트하기 위해, 새로운 터미널을 열고 다음을 입력하십시오.

```
$ curl -X GET "http://localhost:3000/books"
```



이 데이터베이스에 있는 모든 책의 세부 목록을 가져올 것입니다. 우리는 다음 URL의 끝에 id를 지정하여 책을 개별적으로 검색할 수도 있습니다. 예를 들어 <http://localhost:3000/books/101> 같이 말이죠.



우리는 GET HTTP 동사를 사용하여 책 세부 정보를 검색했습니다. 우리의 데이터베이스에 책을 넣으려면, POST 요청을 사용해서 데이터를 전송해야 합니다. 예를 들면, 

```
$ curl -X POST -H "Content-Type: application/json" -d '{
	"id": 103,
	"title": "The Discovery of India",
	"author": "Jawaharlal Nehru",
	"year_published": 1946
	"rating": 3.8
}' "http://localhost:3000/books"

```



URL에 id를 지정하지 않지만, 데이터에 추가해야 합니다. 성공적으로 추가되었는지 확인하기 위해, 서버에 GET 요청을 전송하십시오.

```
$ curl -X GET "http://localhost:3000/books/103"

```



이 서버의 데이터를 엑세스하고 수정하기 위해 PUT, DELETE 등과 같은 다른 HTTP 동사를 사용할 수 있습니다. PUT, POST, 그리고 PATCH 요청은 `Content-Type: application/json` 헤더 세트를 가지고 있어야 함을 참고하십시오. 