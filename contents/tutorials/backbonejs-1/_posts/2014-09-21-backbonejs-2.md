---
layout : tutorials
title : Backbone.js Tutorial Part 2
category : tutorials
permalink : /tutorials/backbonejs-2
title_background_color : AED5E6
tags : backbone
author : oigil
---

# 스티커메모 웹앱 만들기 part.2

Tutorial part.1 에서는 Backbone.Model에 대해 알아보면서 우리가 만들 웹앱의 '메모'에 대응하는 Model를 설계해보았습니다.
이 부분까지 HTML로 정리해보면 다음과 같을 것 입니다.

```
<!DOCTYPE html>
<html>
<head>
	<script type=”text/javascript” src=”/path/to/jquery.min.js”></script>
	<script type=”text/javascript” src=”/path/to/jquery-ui.min.js”></script>
	<script type=”text/javascript” src=”/path/to/underscore-min.js”></script>
	<script type=”text/javascript” src=”/path/to/backbone-min.js”></script>
</head>
<body>
	<script>
		var MemoModel = Backbone.Model.extend({
			idAttribute: 'mem_idx',
			defaults: {
				content: '',						//메모의 내용에 해당
				x: 0,								//메모의 x 포지션
				y: 0,								//메모의 y 포지션
				width: 200,							//메모 너비값
				height: 200,						//메모 높이값
				background: '#ffffff',				//메모의 색상
				redidate: '0000-00-00 00:00:00',	//메모 생성일시
				modidate: '0000-00-00 00:00:00'		//메모 최근 수정일시
			}
		});
	</script>
</body
</html>
```

## Collection
필요에 따라 하나의 Model을 단독으로 fetch해와서 사용하는 상황도 있지만, 실제 서비스를 개발하다보면 List 형태로 데이터를 뿌려줄 때가 더 많은 것 같습니다. 그리고 Backbone.js에서는 이러한 List 형태의 데이터 집합체를 Backbone.Collection 에서 다루고 있는데요, Model이 단독으로 URL 지정이 되어 있지 않은 경우 보통 Collection의 URL에 따르게 된다는 것, 그리고 Model에서 발생하는 여러 Event들은 Collection에도 전달이 된다는 점에서 Collection을 Model의 부모역할을 한다고 볼 수도 있을 것입니다.

이러한 Collection을 선언하는 방법은 다음과 같습니다.

```
var MemoCollection = Backbone.Collection.extend({
	model: Model,
	url: '/path/to/API',
	initialize: function(){
		//new로 만들어질 때 수행할 작업을 넣음
	}
});
```

아주 간단하죠? 어떠한 데이터 집합체를 가져오는 API가 Array형태의 JSON 응답을 하도록 설계되었다면, 사실 Collection을 선언할 때에는 `url`과 `model` 을 제외하면 나머지는 손댈 부분이 거의 없습니다. 경우에 따라 `parse`나 `initialize` 등 직접 손봐야 하는 경우도 있지만, 그렇지 않은 경우에는 보통 이미 선언한 Collection을 new 생성자를 이용해서 새로운 instance로 만든 후에나 여러가지 method들을 사용하게 됩니다.

### collection.model
`GET` method로 서버에서 리스트 데이터를 받아왔다고 했을 때, 처음에는 그저 Array로 구성된 raw데이터에 불과할 것입니다. Collection은 이 데이터들을 각각 Backbone.Model로 변환시키게 되는데, 이때 어떠한 모델에 맞추어 변환시킬지를 지정하는 것이 바로 `collection.model`입니다.
그리고 나중에 collection.add 또는 collection.reset 등의 method를 이용해 데이터를 변조시킬 때에도 이 model을 참조하여 작업이 진행이 됩니다.

우리는 앞서 MemoModel이라는 Backbone.Model을 설계했으므로 다음과 같이 model을 지정하도록 하겠습니다.

```
var MemoCollection = Backbone.Collection.extend({
	model: MemoModel
});
```

### collection.url
`collection.url`은 이 collection이 XHR로 통신할 주소를 의미합니다. 그리고 이 주소를 이용해서 데이터들을 불러오거나, 새로운 데이터를 추가할 수 있습니다. 하지만 일단은 collection에 대해 좀 더 알아보기 위해 별도의 url은 지정하지 않겠습니다.

### new collection 생성하기

이렇게 MemoCollection을 선언했으니 Model에서 했던 것처럼 우리가 실제로 사용할 instance를 만들어야겠지요.

```
var memoCollection = new MemoCollection();
```

이 경우 memoCollection은 비어있는 채로 만들어집니다. 

만일 new로 생성할 때 몇개의 데이터를 Array로 넣어주면, 입력받은 데이터를 Model들로 가지는 상태로 만들어질 것입니다.

```
var memoCollection = new MemoCollection([
	{
		background: "yellow",
		content: "첫번째 메모",
		width: 400,
		height: 300,
	},
	{
		background: "red",
		content: "두번째 메모",
		width: 400,
		height: 300,
	},
	{
		background: "blue",
		content: "세번째 메모",
		width: 400,
		height: 300,
	}
]);
```

일단은 이렇게 해서 model로서 MemoModel을 참조하는 memoCollection이라는 instance가 하나 만들어졌습니다.
그리고 아직 url은 없지만 url만 입력해주면 이번 튜토리얼에서 collection을 선언해주는 코드는 모두 마무리가 된 셈입니다.

그러면 collection에 대해 좀 더 알아보기 위해, 몇가지 기능들을 좀 더 다뤄보겠습니다.

## Methods
### collection.reset()

`reset()` method는 collection을 초기화 시켜주는 역할을 합니다. 아무런 인자를 넣지 않으면 텅빈 상태로 돌아가겠지요. 
하지만 인자로서 Array를 넣어주게 되면 입력된 데이터를 기반으로 collection이 초기화됩니다. 마치 new로 처음 만들었던 때처럼요.

```
memoCollection.reset([
	{
		background: "yellow",
		content: "첫번째 메모",
		width: 400,
		height: 300,
	}
]);
```

그리고 reset을 이용할 경우에는 collection에 `reset` 이벤트가 발생하게 됩니다.
그리고 이 reset 이벤트는 상당히 유용하게 사용되는데요, 이 이벤트를 이용해서 'reset이 발생하게되면 전체 리스트를 다시 그려줄 것'과 같은 핸들러를 바인드 할 수가 있게 됩니다.

### collection.add()
`add()` method는 collection에 새로운 데이터를 추가할 때 사용합니다.

```
memoCollection.add({
	background: "purple",
	content: "새로운 메모"
});
```
보통은 저렇게 add를 하게 되면 collection의 마지막에 데이터가 추가됩니다. 하지만 여기에 option으로 `at`에 index를 넣어주게 되면 추가할 위치를 지정해줄 수 있습니다.

```
memoCollection.add({
	background: "purple",
	content: "새로운 메모"
}, {
	at: 2
});
```

### collection.create()
앞서 보신 `add()` method는 collection에 새로운 데이터를 추가하긴 하지만 별도의 XHR통신은 하지 않습니다. 아직 DB에 만들어지지 않은 데이터를 Local환경에서 일단 들고 있는 것이나 마찬가지입니다. 하지만  `create()` method를 이용하면 collection에 추가함과 동시에 collection.url로 `POST` 요청을 날리게 됩니다. 사용방법은 add()와 동일합니다. 하지만 비동기 통신이 발생하다보니 success, error 등과 같은 몇개의 옵션을 추가로 사용할 수 있습니다.

```
memoCollection.create({
	background: "purple",
	content: "새로운 메모"
}, {
	success: function(){ },
	error: function(){ }
});
```

Backbone.Model에서 `set()`과 `save()`의 차이점을 생각하시면 될 것 같습니다.

그리고 `create()`는 기본적으로 Back-end API의 응답을 기다리지 않고 즉각적으로 데이터를 collection에 추가합니다. 만일 데이터 추가에 대해 어떠한 화면동작이 실행되도록 이벤트를 걸어두었다면, `create()`를 실행하자마자 앞단에서는 지정된 화면동작이 바로 뜨는 것이고, 뒷단에서 비동기통신으로 데이터가 날아가고 있는 것이지요. 그리고 Backend-API 작업이 완료되어 '데이터가 잘 추가되었음'을 의미하는 Model.id를 응답해주면 Backbone.js는 전달받은 id값을 해당 Model에 자동으로 할당해주고 success 콜백을 실행하며 그렇지 않다면 error 콜백을 실행하는 것이지요.(경우에 따라 Model.id값을 반드시 먼저 전달받아야만 하는 경우가 있을 수 있습니다. 그럴 때에는 간단히 `wait: true` 옵션을 추가해주면 됩니다.)

이를 잘 사용하면 실로 엄청난 체감속도 상승효과를 얻을 수 있습니다. 사견이지만, 제가 Backbone.js 를 사랑하게 된 계기도 바로 이 부분이었습니다. Collection 자체가 일종의 LocalStorage 역할을 하며 User와 DB를 중계해주는 역할을 한다는 Concept은 정말 놀라움 그 자체라고 생각합니다. _(처음에 전 코끝이 찡해져서 박수를 쳤었습니다.)_ 

하지만 이러한 Backbone.js의 비동기 처리 방식에 대해 백단과 프론트단의 데이터 무결성에 대한 의문을 가질 수도 있겠습니다. 전 오히려 그 부분에 대해 다음과 같이 반문하고 싶습니다.

"프론트단 코드와 Backend API, 그리고 DB가 제대로 프로그래밍되었다면 데이터는 언제 어디서든 같아야 하는게 정상이 아닐까요?"

### Array functions
그리고 어느정도 느끼셨겠지만 collection은 Array와 유사한 역할을 많이 합니다. 그렇다보니 비슷한 method와 property를 몇개 가지고 있습니다.

* **push(model)** : 마지막순서에 model을 추가합니다.

* **pop()** : 마지막 순서의 model을 제거한 뒤 제거한 model을 반환합니다.
* **unshift(model)** : 제일 앞 순서에 model을 추가합니다.
* **shift()** : 제일 앞 순서의 model을 제거한 뒤 제거한 model을 반환합니다.
* **slice(begin, end)** : 지정된 범위만큼을 잘라서 반환합니다.
* **length** : collection.length는 model들의 갯수를 반환합니다.







