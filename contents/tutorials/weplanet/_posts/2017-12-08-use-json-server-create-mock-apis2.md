---
layout : tutorials
category : tutorials
title : Mock API를 만들기 위해 json-server 이용하기 (2/2)
subcategory : setlayout
summary : Mock API를 만들기 위해 json-server 이용하기에 대해 알아봅니다.
permalink : /tutorials/weplanet/How to Use json-server to Create Mock APIs2
author : danielcho
tags : python
title\_background\_color : F1F71A
---



> 본 포스팅은 [Ayush Gupta](https://ayushgp.github.io/)의 [How to Use json-server to Create Mock APIs](https://ayushgp.github.io/use-json-server-create-mock-apis/)를 저자의 허락하에 번역한 글입니다. 오탈자, 오역 등이 있다면 연락부탁드립니다.

  

### 기능들 

#### 1. 검색

리소스 내에서 관련 결과를 검색할 수 있습니다. 예를 들면, 책 API에서 단어 “Discovery”을 검색하고 싶다면, URL에 선택적 임의 파라미터 `q`를 추가해야 합니다:

```
$ curl -X GET "http://localhost:3000/books?q=Discovery"
```

이것은 해당 필드에 “Discovery”라는 단어가 포함된 모든 책을 가져올 것입니다



#### 2. 필터

`?` 를 사용해서 요청에 필터를 다시 적용시킬 수 있습니다. `q` 필터는 위에 설명된 것처럼 검색을 위해 보류됩니다. 만약 “Peter
Thiel”이 쓴 책의 디테일을 가져오고 싶다면, 리소스 URL에 `?`를 추가하고, 그 뒤에 필터링할 속성 이름과 값을 넣어 GET 요청을 전송합니다. 

```
$ curl -X GET "http://localhost:3000/books?author=Peter+Thiel"
```

여기서 지정한 작성자 이름은 URL인코딩되어 있는 것을 참고하십시오.



필터 사이에 `&`를 추가하여 여러 필터를 합칠 수도 있습니다. 예를 들어, 위 예시의 책 이름으로 필터링 하고 싶으면, 다음을 사용할 수 있습니다.

```
$ curl -X GET "http://localhost:3000/books?author=Peter+Thiel&title=Zero+to+One"
```



#### 3. 페이지네이션

json-server는 기본적으로 페이지당 10개의 항목으로 페이지 매기기를 제공합니다. 이러한 페이지네이션 기능은 페이지가 있거나 스크롤할 때 데이터 로드를 하는 애플리케이션인 경우 편리하게 사용됩니다.



예를 들어, 예를 들어, 책의 API 의 3페이지에 액세스하고 싶으면, GET 요청을 전송하십시오

```
$ curl -X GET "http://localhost:3000/books?_page=3"
```

이것은 서버에 저장된 ID 121-130의 책으로 응답할 것입니다. 



#### 4. 정렬

이것 또한 API에서 정렬된 데이터를 요청합니다. `_sort`과 `_orderproperties`속성을 사용하여 분류할 속성과 분류하고자 하는 순서를 지정합니다. 만약 텍스트 필드를 분류하는 경우에는, 해당 항목을 알파벳순으로 분류해야 합니다. 

예를 들어, 도서 목록을 등급의 내림차순으로 정렬하려면, GET 요청을 전송해야 합니다:



```
$ curl -X GET "http://localhost:3000/books?_sort=rating&order=DESC"
```



#### 5. 오퍼레이터

Operators는 결과를 필터하고 필요한 데이터만 뽑아내는 데 필수적입니다. json-Server는 논리적인 오퍼레이터를 제공합니다. `_gt`와 `_lt`를 각각 오퍼레이터보다 크게, 또는 작게 사용할 수 있습니다. 또한 답변에서 값을 제외시키기 위해 `_ne`를 사용할 수 있습니다.

예를 들어, 만약 등급이 4이거나 4보다 큰 모든 책을 찾고자 한다면, get 요청을 전송해야 합니다.

```
$ curl -X GET "http://localhost:3000/books?rating_gt=4"
```



`&`를 이용해서 다수의 오퍼레이터를 합칠 수 있다는 것을 참고하십시오. 예를 들어, 1990년과 2016년을 포함해 그 사이에 출판된 책을 찾고 싶다면, 다음 요청을 보내야 합니다.

```
$ curl -X GET "http://localhost:3000/books?rating_gte=1990&rating_lte=2016"
```



같거나 더 크다는 의미의 `gte`와 같거나 더 작다는 의미의 `lte`를 참고하십시오. 이러한 기능에 대해 더 자세히 알고 싶다면 다음 [documentation](https://github.com/typicode/json-server)를 확인하십시오. 



## API를 위한 모의 데이터 만들기 

프론트 엔드의 시제품을 만들기 위해, 모든 케이스를 테스트 하기 위한 충분한 데이터가 필요합니다. 모든 데이터를 혼자 입력하는 것은 매우 지루합니다. Casual 같은 모듈을 사용하여 Mock API를 위한 Mock 데이터를 만들어 볼 수 있습니다. 

```
$ npm install casual
```



이제 `mockdata.js`라는 파일을 만들고 다음을 추가하십시오:

```
var casual = require('casual');

// Create an object for config file
var db = {books:[]};

for(var i=101; i<=105; i++){
    var book = {};
	book.id = i;

	// Create a random 1-6 word title
	book.title = casual.words(casual.integer(1,6));
	book.author = casual.first_name + ' ' + casual.last_name;
	
	// Randomly rate the book between 0 and 5
	book.rating = Math.floor(Math.random()*100+1)/20;

	// Assign a publishing year between 1700 and 2016
    book.year_published = casual.integer(1700,2016)
    db.books.push(book);
}
console.log(JSON.stringify(db));

```



이 스크립트를 사용하여 `Database.json` 파일을 만들려면, 터미널에서 다음 명령을 실행하십시오. 

```
$ node mockdata.js > Database.json
```

이제 많은 책에 대한 데이터베이스가 있습니다. 이제 애플리케이션을 개발하는데 이 서버를 사용할 수 있습니다. 



## 한계점

json-server를 사용하는데 분명한 한계점들이 있습니다. 이러한 한계점은 다음과 같습니다. 

- 텍스트 데이터와 관련된프로토타입을 만들 때만 사용할 수 있습니다.
- 인증을 기반으로 API 영역에 한계를 설정할 수 없습니다.
- 이 Mock API는 실서버 환경에서는 사용할 수 없으며, 사용되어져서는 안됩니다. 



## 마무리하며

이제 빠르게 모의 API를 만들고 프론트앤드 프로토타입을 만드는데 사용할 수 있을 것입니다. 이 모든 것은 백엔드 생성에 시간을 (거의) 투자하지 않고 수행됩니다. 