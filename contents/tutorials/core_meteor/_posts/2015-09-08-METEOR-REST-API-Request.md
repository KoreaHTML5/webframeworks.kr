---
layout : tutorials
title :  Server-Side API 사용하기
category : tutorials
subcategory : data-binding
summary : Meteor 방식으로 외부 서비스의 API를 사용하고 클라이언트와 데이터 동기화 하는 것을 배워보자
permalink : /tutorials/core_meteor/2_server_side_API
title_background_color : 1C1C1F
title_color : E4E4E4
tags : javascript meteor REST API
author : acidsound
---
# [Core Meteor] Server-Side API 사용하기

웹 어플리케이션을 만들다보면 필요한 기능을 직접 구현할 수도 있지만 외부에서 제공하는 API를 사용하여 적은 시간과 비용으로 서비스의 질을 높일 수 있다.

필요한 데이터를 외부 서비스에 요청하는 방법과 그 데이터들을 Meteor에서 활용하는 방법을 배워보자.

## API 호출

Meteor는 개발에 필요한 유용한 패키지들을 별도의 설치없이 기본적으로 제공한다.

그 중 하나인 [HTTP](http://docs.meteor.com/#/full/http) 패키지를 사용하여 REST API 요청을 구현해보자.

HTTP 패키지에서 제공하는 함수들은 다음과 같다.

* [HTTP.call](http://docs.meteor.com/#/full/http_call)
* [HTTP.get](http://docs.meteor.com/#/full/http_get)
* [HTTP.post](http://docs.meteor.com/#/full/http_post)
* [HTTP.put](http://docs.meteor.com/#/full/http_put)
* [HTTP.del](http://docs.meteor.com/#/full/http_del)

HTTP.call 은 GET/POST/PUT/DELETE/HEAD/TRACE 등 [Request methods](https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol#Request_methods)를 명시적으로 지정할 때 사용하며

일반적으로 많이 사용하는 GET/POST/PUT/DELETE 는 각각 HTTP.get, HTTP.post, HTTP.put, HTTP.del 함수를 사용한다.

예제로 서울 열린데이터 광장의 "1~4호선 지하철역 주소 및 전화번호"를 가져와보자.

```
http://openapi.seoul.go.kr:8088/sample/json/StationAdresTelno/1/5/
```

프로젝트를 생성한 후, HTTP 패키지를 ```meteor add http```로 추가하고 ```meteor shell```을 열고 아래와 같이 HTTP.get요청을 시도해본다.

```
Welcome to the server-side interactive shell!

Tab completion is enabled for global variables.

Type .reload to restart the server and the shell.
Type .exit to disconnect from the server and leave the shell.
Type .help for additional help.

> HTTP.get('http://openapi.seoul.go.kr:8088/sample/json/StationAdresTelno/1/5/')
{ statusCode: 200,
  content: '{"StationAdresTelno":{"list_total_count":121,"RESULT":{"CODE":"INFO-000","MESSAGE":"정상 처리되었습니다"},"row":[{"LINE":"1호선","STATN_NM":"청량리","ADRES":"서울 동대문구 왕산로 328-1","RDNMADR":"서울특별시 동대문구 왕산로 지하 205 (전농동) (청량리역)","TELNO":"6110-1241"},{"LINE":"1호선","STATN_NM":"제기동","ADRES":"서울 동대문구 제기동 지하51번지","RDNMADR":"서울특별시 동대문구 왕산로 지하 93 (제기동) (제기동역)","TELNO":"6110-1251"},{"LINE":"1호선","STATN_NM":"신설동","ADRES":"서울 동대문구 신설동 97-75","RDNMADR":"서울특별시 동대문구 왕산로 지하 1 (신설동) (1호선 신설동역)","TELNO":"6110-1261"},{"LINE":"1호선","STATN_NM":"동묘앞","ADRES":"서울 종로구 숭인동 117번지","RDNMADR":"서울특별시 종로구 종로 359 (숭인동) (1호선 동묘앞역)","TELNO":"6110-1271"},{"LINE":"1호선","STATN_NM":"동대문","ADRES":"서울 종로구 창신1동 552","RDNMADR":"서울특별시 종로구 종로 지하 302 (창신1동) (1호선 동대문역)","TELNO":"6110-1281"}]}}',
  headers:
   { 'access-control-allow-origin': '*',
     date: 'Fri, 13 Nov 2015 18:22:13 GMT',
     server: 'Restlet-Framework/2.0.3',
     'content-type': 'application/json; charset=UTF-8',
     'accept-ranges': 'bytes',
     connection: 'Keep-Alive',
     'set-cookie': [ 'WMONID=m8u_I8CU5m1;Expires=Sat, 12-Nov-2016 18:22:13 GMT;Path=/' ],
     'content-length': '1118' },
  data:
   { StationAdresTelno:
      { list_total_count: 121,
        RESULT: [Object],
        row: [Object] } } }
```

content에 String형태로 JSON 결과값을 반환하는 것을 확인할 수 있다.

준비는 다 되었다.

이제 ```JSON.parse(content).StationAdresTelno.row``` 값을 받아서 전달해보자.

## Method를 사용하는 방법

서버쪽에 아래와 같이 구현한다.

```javascript
Meteor.methods({
  "getTelNoOfSubway": function() {
    return JSON.parse(
      HTTP.get(
        'http://openapi.seoul.go.kr:8088/sample/json/StationAdresTelno/1/5/'
      ).content).StationAdresTelno.row;
  }
});
```
간펴하고 직관적인 방법이다.

실제 호출은 브라우저 콘솔창에서

```javascript
Meteor.call('getTelNoOfSubway', function(err,res) { console.log(res); });
```
이렇게 확인해보면 된다.

## Publish/Subscribe를 사용하는 방법

먼저 공통(client/server)구간에 Subscribe 받을 Collection을 만든다.

```javascript
SubwayTelNo = new Mongo.Collection('subwayTelNo');
```

서버쪽에 publish를 만들고
```javascript
Meteor.publish("publishSubwayTelNo", function() {
  var instance = this;
  JSON.parse(
    HTTP.get(
      'http://openapi.seoul.go.kr:8088/sample/json/StationAdresTelno/1/5/'
    ).content).StationAdresTelno.row.forEach(function(obj) {
    instance.added('subwayTelNo', Random.id(), obj);
  });
  instance.ready();
});
```
콘솔에서 테스트해보자.
```javascript
handler=Meteor.subscribe('publishSubwayTelNo');
SubwayTelNo.find().fetch();
```

조금 복잡하지만 이 방법을 더 추천하는데 그 이유는 Collection에 넣으면 miniMongo를 사용할 수 있으므로 find()명령을 이용한 정렬과 필터가 가능하여 매우 유용하다.
