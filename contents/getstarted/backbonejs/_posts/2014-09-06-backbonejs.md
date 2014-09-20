---
layout : getstarted
title : Backbone.js 시작하기
category : getstarted
summary : Model-Collection-View 기반으로 구현하는 Javascript 웹 애플리케이션 프레임웍
permalink : /getstarted/backbonejs
title_background_color : AED5E6
tags : backbone
author : oigil
---

# [Backbone.js](http://backbonejs.org)

지금은 Javascript로 jit 폼체크, 버튼 이벤트 핸들링만 하던 시대와는 다릅니다. 흔히 SPA(single page application)라고 불리는 Javascript 기반 단일페이지 웹애플리케이션은 업무용 문서저작툴이나 그래픽 편집기, 온라인 티켓팅, Web IDE 등 비즈니스 영역에서의 복잡하고 대규모화한 웹애플리케이션 개발의 한 축이 되어가고 있습니다.

이러한 영역에서 최근 Angular.js와 함께 널리 각광받는 프레임웍 중 하나가 바로 Backbone.js입니다. (국내에선 Angular.js의 유명세에 가려 상대적으로 안 알려져 있기도 합니다.)
Coffee script와 Underscore.js를 개발한 [Jeremy Ashkenas](https://github.com/jashkenas)가 개발한 Backbone.js는 Model-Collection-View 3가지 요소를 구성하여 웹애플리케이션을 구현하며, Model과 View는 Built-in 이벤트 또는 Custom 이벤트 기반으로 핸들링되어 상태변화에 따라 능동적으로 작동하도록 구현할 수 있습니다.
그리고 Backbone.js는 View에 대해 어떠한 컴포넌트나 스타일도 강요하지 않습니다. 코드 몇줄이면 미리 정해진 스타일에 맞춰 화면을 멋지게 그려내는 몇몇 프레임웍과는 달리 Backbone.js는 순수하게 작업자의 HTML,CSS를 바탕으로 작동합니다.

## Download Backbone.js

Backbone.js는 Client-side 프레임웍입니다. 따라서 Backbone.js를 사용하기 위해 별도의 Backend 환경을 구현할 필요는 없으며 라이브러리 파일을 다운로드받아 문서 상단(head)에 로드시키면 됩니다.

```
<script type=”text/javascript” src=”/path/to/backbone-min.js”></script>
```

소스는 다음 링크에서 다운로드 받을 수 있습니다.

- [Download Backbone.js (압축버전)](http://backbonejs.org/backbone.js)
- [Download Backbone.js (압축되지 않은 소스버전)](http://backbonejs.org/backbone-min.js)

## Dependencies
Backbone.js를 사용하려면 Underscore.js와 jQuery를 문서 상단에 로드해야 합니다.

### [Underscore.js](http://underscorejs.org/underscore-min.js)
Underscore.js는 Backbone의 개발자인 Jeremy Ashkenas가 개발한 유틸리티&함수 라이브러리입니다. Backbone.js에서는 Collection과 Model의 핸들링, 그리고 Underscore의 가장 강력한 기능 중 하나인 template 렌더링이 주로 사용됩니다.

jQuery와의 유사성에 대한 질문이 종종 오곤 하는데, 사실 jQuery와 일부 겹치는 메소드는 있지만 목적과 성격이 전혀 다른 라이브러리입니다.
jQuery는 DOM manipulation과 Ajax등에 특화되어 있는 라이브러리인 반면, Underscore는 Collection이나 Array, Object와 같은 데이터 또는 데이터 집합체에 대한 Sort, Filter, Map 등의 연산에 특화되어 있는 라이브러리입니다.
따라서 이 둘은 서로가 할 수 없는 일에 대해 각자 Main role을 가지고 있다고 보면 될 것 같습니다.

- [Download Underscore.js](http://underscorejs.org/underscore-min.js)

### [jQuery](http://jquery.com)
Backbone.js는 View의 DOM 조작과 Model의 XHR통신을 위해 jQuery (또는 Zepto) 라이브러리를 필요로 합니다.

비록 Underscore만큼 특수성이 있는 역할을 하는 것은 아니며, 따지고 보면 XHR은 직접 관련 함수를 작성할 수도 있었을테지만 아무래도 글로벌 레벨에서 범용적으로 사용되는 jQuery에 해당 기능을 위임하고자 하는 의도였을거라 생각이 됩니다.

- [Download jQuery](http://code.jquery.com/)

### 결과적으로
Backbone.js와 Dependencies를 HEAD 태그에 다음과 같이 로드시키면 모든 준비가 끝나게 됩니다.

```
<script type=”text/javascript” src=”/path/to/jquery.min.js”></script>
<script type=”text/javascript” src=”/path/to/underscore-min.js”></script>
<script type=”text/javascript” src=”/path/to/backbone-min.js”></script>
```

## Backbone.js의 구성

이제 모든 요소를 로드해왔으니 Backbone.js의 각 요소에 대해 간략한 소개를 하도록 하겠습니다.
Backbone.js는 Event, Model, Collection, Router, History, Sync, View 등의 하위모듈로 구성되어 있으며 이들 모두가 웹애플리케이션 개발에 큰 도움을 줍니다.
하지만 이 중에서도 웹애플리케이션 개발의 뼈대 역할을 하는 3가지가 바로 Model, Collection, View 입니다. (Event는 이 세가지를 접하면서 자연스럽게 활용하게 될 것입니다.)

### Backbone.Collection

Backbone.Collection은 일종의 목록 데이터라고 보면 되겠습니다. 서버로부터는 Array형태의 JSON 객체 집합을 받아서 구성하게 되며, 
이 데이터들에 대해 루프를 돌며 각 데이터를 자신에게 지정된 Model 형태에 맞는 인스턴스로 만들어냅니다.

![alt Collection](img/backbone_1.png "Title")
 
Model 입장에서는 일종의 부모 역할을 하는 셈입니다. 그리고 이 역할에 맞게 Collection은 자신과 자신의 Model을 관리하는 여러 Method가 있고 또 Model의 상태 변화를
감지하는 Built-in 이벤트도 있습니다.

### Backbone.Model

세가지 요소 중에서도 Backbone.js를 스마트하다고 느끼게 해주는 요소가 바로 Backbone.Model입니다. 
일반적으로 Model은 Collection에 포함되는 개별 단위의 Data 객체가 되며, 어떻게 활용하느냐에 따라 Collection 없이 단독으로 불러와서 사용할 수도 있습니다. 
설령 어떠한 개인의 정보를 Model화 한다면 다음처럼 정리할 수 있겠습니다.

```
{
    name: "Cavin Jo",
    age: 32,
    job: "S/W engineer",
    color: "yellow",
    height: 175
}
```

이렇게 구성한 Model은 자신과 연결된 View에 대해 일종의 영혼과도 같은 역할을 하게 되므로, 사실상 유저 인터페이스와 Data sync 모두를 아우르는 핵심 요소라고 봐도 과언이 아닙니다.

### Backbone.View

View는 Backbone.js 애플리케이션의 시작이자 끝이라고 볼 수 있습니다.
애플리케이션을 시작할 때 new 생성자를 통해 Backbone.View 객체 인스턴스를 만들어내며, 데이터 변화에 대한 표현도 Backbone.View 객체를 통해 드러냅니다.
그리고 View는 어떻게 구성하느냐에 따라 정말 다양하게 표현할 수 있는데, N개의 아이템을 지니고 있는 List단위의 View를 만들고 그 안의 각 아이템에 대해 Child 단위의 새로운 View를 만들 수 있으며,
원하면 하나의 Element에 대해 여러개의 View로 만들어 관리할 수도 있습니다.

이렇게 DOM Element를 Backbone.View 인스턴스로 감싸는 이점은 분명합니다. 
그 중에서도 가장 큰 것은 Backbone.Model과 연동을 통해 Model의 변화에 대해 View의 변화를 자동적으로 적용시킬 있다는 점입니다.
하지만 Model을 연동시키지 않더라도 Backbone.View가 주는 편리한 Event, Method 관리 방식을 적용시킬 수 있는 것도 큰 장점입니다. 

앞으로의 포스팅에서 자주 언급이 되겠지만 Model을 결합한 View를 다루다보면, 마치 살아있는 객체를 다루는 느낌을 받게 될 것입니다.

### Backbone.Event

Backbone.js에서는 Model과 Collection에 다양한 Built-in 이벤트를 제공하고 있습니다. 
많이 쓰이는 것들을 정리해 보면 다음과 같습니다.

* *add* : Model이 새로 생성되었을 때 발생합니다. Model 자신과 부모 Collection에 전달됩니다.
* *remove* : Model이 부모 Collection에서 제외되었을 때 발생합니다.
* *reset* : Collection의 전체데이터가 리셋되었을 때 발생합니다.
* *change* : Model의 속성 일부가 바뀌었을 때 발생합니다.
* *change:attribute* : 특정 속성이 바뀌었을 때 발생하는 이벤트입니다. 설령 `model.on("change:title", callback)` 이라고 바인드 시켜놓았을 경우에는, 해당 Model의 `title` 속성이 바뀌었을 때만 callback이 실행될 것입니다. 
* *destroy* : Model이 `destroy` 되어 DELETE 되었을 때 발생합니다.
* *all* : Model 또는 Collection에 발생하는 모든 종류의 이벤트에 대응합니다.

Backbone.Event는 사용하기가 매우 간단합니다. 위의 `change:attribute`에서 보았던 것처럼, Model이나 Collection에 `on` 메소드를 이용해서 손쉽게 바인딩할 수 있으며 원하는 경우 `off`로 unbind할 수도 있습니다.
그리고 Built-in 이벤트가 아닌 자신만의 이벤트를 만들어 사용하기도 쉽습니다. 특별한 사전작업 없이 다음과 같이 직접 만든 이벤트명을 바인드를 시켜두고 

```
model.on("customEvent", callback)
```

필요할 때마다 해당 Model에 다음처럼 이벤트를 호출하면 끝입니다.

```
model.trigger("customEvent")
```


## RESTful api구현을 위한 Backend 환경

앞서 말씀드린 것처럼 Backbone.js 자체는 별도의 Backend 환경을 필요로 하지 않으며 static한 HTML문서에서도 잘 돌아갑니다.

하지만 Backbone.js의 가장 강력한 무기 중 하나인 Event 기반의 Model 비동기통신을 사용하기 위해서는 JSON 인터페이스의 API가 구현되어 있어야 합니다.
그리고 Backbone은 [RESTful](http://en.wikipedia.org/wiki/Representational_state_transfer) 디자인 규칙에 따라 문서를 가져오고 생성하고 수정하고 삭제하는 일련의 동작(CRUD)을 HTTP method로 통신하기 때문에, 서버측 API는 POST,GET,PUT(PATCH),DELETE 등의 HTTP Method를 기반으로 데이터를 처리하도록 설계되어 있어야 합니다.

### GET

문서를 요청하여 가져오는 역할을 합니다. 브라우저의 주소창에 URL을 입력하여 요청하는 행위가 이 `GET` Method로 전송된다고 보면 되며, 
JSON 기반 RESTful API에서는 보통 `/api/:collectionName`과 같은 URI로 N개의 Model이 포함된 Collection을 호출하며 `/api/:collectionName/:modelId` 형태의 URI로는 개별 Model의 상세정보를 가져오는 형태를 띕니다. 
Backbone은 이러한 방식으로 GET Method를 통해 Model 또는 Collection의 데이터를 받아와서 인스턴스에 저장합니다.

만일 기존에 사용중인 JSON API가 순수한 형태의 단일 Model object을 뿌려주거나 이런 Model로 이루어진 Array 집합체만 뿌려준다면 그대로 사용하면 됩니다.
하지만 상황에 따라 다소 변화된 형태를 가지고 있을 경우에는 그대로 불러온 뒤 Backbone.js의 `parse` 기능을 이용해 Backbone에 필요한 부분만 가져와서 사용할 수도 있습니다.


#### 예 : Collection을 위해 별다른 작업이 필요없는 JSON 형태
```
[
    {
        movie_id: 1001,
        movie_title: "Terminator 2",
        movie_category: "Action, SF",
        movie_director: "James Cameron"
    },
    {
        movie_id: 1002,
        movie_title: "True lies",
        movie_category: "Action, SPY, Family",
        movie_director: "James Cameron"
    }
]
```
Backbone.js가 collection을 가져와서 처리할 때 가장 편리하고 별 탈이 없는 상황입니다.
이러한 형태로 API가 구현되어 있다면 그대로 사용하면 되고, API를 새로 만들어야 한다면 저런 형태로 응답해주도록 구현하면 됩니다.

---

#### 예 : 다소 변화된 형태
```
{
    user_id: "Cavin",
    movie_list: [
        {
            movie_id: 1001,
            movie_title: "Terminator 2",
            movie_category: "Action, SF",
            movie_director: "James Cameron"
        },
        {
            movie_id: 1002,
            movie_title: "True lies",
            movie_category: "Action, SPY, Family",
            movie_director: "James Cameron"
        }
    ],
    search_time: 0.0015
}
```
기존의 API가 이와 같은 결과값을 넘겨준다고 했을 때, 여기서 영화목록 collection으로 사용할 부분은 movie_list 부분입니다.
Backbone.js는 이런 상황에 대비해 `parse` 메소드를 제공하고 있으며 다음과 같은 방법으로 원하는 Collection을 구성할 수 있습니다.

```
var Movie = Backbone.Collection.extend({
	url: "/cavin/movie",
	parse: function(response) {
		return response.movie_list;
	}
});
```

### POST

웹 개발에서 GET과 함께 가장 많이 쓰이는 Method가 바로 `POST` 입니다. 
제가 예전에 개발을 처음 접했던 시기에는 이 둘을 각각 언제 사용할지에 대해 "보안 여부" 또는 "보내는 값의 양"이라는 (당시에는 매우 진지했던) 조언을 받기도 했었고,
CRUD 중 어떤 행위를 하느냐에 대해서는 별도의 파라메터로 값을 보내 처리하기도 했습니다.

어떻게 보면 완전히 잘못된 의견은 아닐 수 있고, 환경에 따라 유연히 대응할 수도 있는게 개발이지만 엄연히 POST는 GET과 목적 자체가 다른 Method입니다.
POST는 단어의 의미 그대로 Create(DB에서의 INSERT)를 담당하는 Method 입니다. 그리고 Collection을 가져오는 URI와 동일한 경로로 값을 전송하여야 하는데,
앞서 예로 들었던 `/api/:collectionName` 이라는 URI로 Collection을 가져온다고 한다면, 동일한 `/api/:collectionName` 에 새로운 Model값을 POST 전송하여 새 값을 생성해야 합니다.

그리고 추가로 말씀드리면 Backbone.js에서는 새로 만들어 POST 전송한 Model에 대해, 해당 API가 새로운 ID 값을 반환했는가에 따라 실제 DB에 저장되었는지를 판단하는 로직을 가집니다.

설령 다음과 같이 새로운 영화정보를 Backbone의 Collection에 `add`로 저장하게 되면 해당 Model은 ID값도 없이 저장되며, 아무런 통신도 이루어지지 않습니다.  


```
{
	movie_title: "Heat",
	movie_category: "Action, Crime",
	movie_director: "Michael Mann"
}
```

하지만 만일 이 Model을 만든 후 `save`로 저장하거나, 아니면 애당초 add가 아닌 `create`로 Model을 만들었을 경우에는 해당 Collection의 URI에 POST전송이 발생하게 됩니다.
그리고 해당 API가 요청을 처리한 뒤, 다음과 같이 ID값을 Client에 응답하게 되면
 
```
{
	movie_id: 1003
}
```

Backbone은 이를 '잘 전송되었다. 이 모델의 고유값은 다음과 같다' 는 의미로 해석하여 비로소 다음과 같이 Model에 ID를 부여하게 됩니다. 

```
{
	movie_id: 1003,
	movie_title: "Heat",
	movie_category: "Action, Crime",
	movie_director: "Michael Mann"
}
```

하지만 만일 ID값이 넘어오지 않을 경우에는 새 Model 생성이 성공되지 못한 것으로 판단하여,
이후의 예상 가능한 동작을 얻어낼 수 없으므로 POST를 처리하는 API에서는 반드시 새로운 Model의 ID값을 반환해주도록 설계하여야 합니다. 


### PUT
GET/POST 와는 달리 다소 생소해 할 수 있는 Method입니다. GET이 READ/SELECT, POST가 CREATE/INSERT의 역할을 했다면 `PUT`은 기존에 존재하는 데이터에 대한 UPATE의 역할을 합니다.
Backbone.js에서는 어떠한 Model의 특정 값에 대해 변화를 주고 이를 `save`할 경우, 해당 Model의 URI에 대해 PUT 통신이 발생하게 됩니다.

설령 `/api/collectionName/1004`이라는 경로를 가지는 다음과 같은 Model이 있다고 합시다. 

```
{
	movie_id: 1004,
	movie_title: "Insider",
	movie_category: "Comedy",
	movie_director: "Michael Mann"
}
```

그리고 이 중 movie_category의 값을 "Comedy"에서 "Drama"로 `save`하게 되면,

```
model.save({
	"movie_category": "Drama"
})
```

다음과 같이 새로 세팅된 모델의 데이터 값 전체가 `/api/collectionName/1004` 경로에 `PUT` Method로 날아가게 됩니다.


```
{
	movie_id: 1004,
	movie_title: "Insider",
	movie_category: "Drama",
	movie_director: "Michael Mann"
}
```

이 요청을 처리하는 API에서는 해당 ID값을 지닌 데이터에 대해 데이터를 UPDATE하면 됩니다. 
그리고 처리가 완료되었을 경우에는 `POST`에서처럼 굳이 ID값을 반환할 필요는 없으며 200 status만 반환하면 Backbone.js는 이를 인지합니다. 

### PATCH

앞서서 보신 바와 같이 PUT은 현존하는 데이터 전체를 통째로 다시 넣는 성격을 가지는데, 이로인해 변경되지 않은 다른 멀쩡한 값들도 굳이 보내야 하는 상황이 발생합니다.
`PATCH`는 이런 상황이 필요치 않을 때 PUT을 보완해주는 UPDATE 역할의 Method입니다. 전체를 다시 보낼 필요 없이 일부 변경된 데이터들만을 전송하는 것이죠.
(그리고 점차 Wireless 환경이 주가 되어가는 현재 상황에서는, 전체데이터를 다시 보내야 하는 PUT보다 일부만 보내는 PATCH가 오히려 더 적합한 UPDATE Method가 아니냐는 의견도 많습니다.)

Backbone.js에서는 `save` 에 대해 `{patch: true}` 옵션을 줌으로써 PATCH 전송을 적용시킬 수 있습니다. 
앞서 들었던 예처럼 movie_category만 바꿀 때에 다음처럼 옵션을 주고 save하게 되면, 

```
model.save({
	"movie_category": "Drama"
}, {
	patch: true
})
```

PATCH Method로 바뀐 데이터만 전송되게 됩니다.

```
{
	movie_category: "Drama"
}
```

### DELETE

DELETE는 말그대로 데이터를 삭제하는 Method입니다. 
때문에 별다른 데이터값을 같이 보낼 필요가 없으며 Model의 ID가 기입된 URI로 DELETE Method를 호출하기만 하면 됩니다.

Backbone.js에서는 개별 모델에 `destroy`를 실행시킴으로써 호출할 수 있으며 서버측 API는 해당 요청과 관련된 Model에 대해 삭제 처리하고 200 status를 반환해주면 됩니다. 
그러면 Backbone.js에서는 해당 Model을 삭제하게 되며 이에 대한 사전에 지정된 콜백 처리를 하게 됩니다.    


## 정리하며
Backbone.js 를 시작하기 위한 여러가지 내용을 살펴보았습니다. 헌데 Backbone.js보다는 RESTful API 설계 방식에 대한 내용이 더 많았던 것 같습니다.
Backbone.js의 스마트하고 능동적인 Model/View 컨트롤에 대한 내용 대부분 이와 관계된 것이어서 꼭 필요했던 사항이었습니다.
그리고 RESTful 개발 관련 내용으로는 위와 같은 HTTP method 활용 말고도 Addressable URI, Stateless, Layerd system 등 더욱 깊고 다양한 내용들이 많이 있기 때문에
Backbone.js에 관심이 있고, 최근 클라우드 중심의 환경에서 더욱 각광받고 지지받는 REST API 설계에 관심이 많으시다면 보다 자세히 살펴보시길 권해드립니다. 

그리고 앞으로 진행될 Backbone.js Tutorial 에서는 앞서 설명드린 비동기통신이 동작하는 환경에서 설명을 진행할 예정입니다.
따라서 아직 관련 내용이 낯설거나 뭔가 실행할만한 예제가 필요하신 분은 [예제 소스](https://github.com/oigil/backbone_tutorial) 를 내려받아서 세팅하시면 되겠습니다.
해당 예제 소스는 Node 기반 Express 서버로 구성되어 있으며 Backbone.js가 포함된 static한 HTML페이지와 GET/POST/PATCH/DELETE 실행을 처리하는 간단한 API/route 그리고 이에 대응하기 위한 DB로 SQLite가 설정되어 있습니다.
Node환경에서 바로 `npm install`만 실행하면 실행준비가 완료되며 이에 대한 자세한 내용은 앞으로 진행할 Tutorial에서 다시 설명드리겠습니다.

## References

- [Backbone.js](http://backbonejs.org)
- [Underscore.js](http://underscorejs.org)
- [jQuery](http://jquery.com)
- [REST](http://en.wikipedia.org/wiki/Representational_state_transfer)