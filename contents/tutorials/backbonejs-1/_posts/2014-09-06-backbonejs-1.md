---
layout : tutorials
title : Backbone.js Tutorial Part 1
category : tutorials
permalink : /tutorials/backbonejs-1
title_background_color : AED5E6
tags : backbone
author : oigil
---

## 시작에 앞서

Getting started 를 보신 분이라면 아시겠지만, Backbone.js를 충분히 활용하기 위해서는 RESTful 디자인 기반의 Backend API가 구현되어 있어야 하며 해당 API를 통한 Database CRUD 처리 과정이 필요합니다. 앞으로 기회가 있으면 사전 필요지식에 대한 자세한 포스팅을 작성하도록 하겠지만, 일단 본 튜토리얼은 관련 필요지식들이 모두 갖추어진 상태라는 전제하에 진행하도록 하겠습니다.

## 목표 

본 튜토리얼에서 만들 예제는 바로 '스티커 메모 앱', 흔히들 말하는 포스트잇을 웹앱으로 구현해 볼 참입니다. 
이를 위해 개별 메모(Model)들을 생성하고 편집, 삭제하는 것부터 Collection 단위의 Sorting, Filtering을 하며 이러한 Model과 Collection의 변화에 대해 View가 능동적으로 동작하는 부분을 구조화 할 것입니다.

## 기능명세
- 메모가 없는 화면의 원하는 위치에 더블클릭하거나 '메모 추가'를 클릭함으로써 메모를 추가.
- 생성된 메모를 클릭하면 해당 메모를 편집
- 개별 메모의 '삭제'버튼을 클릭하여 삭제
- 메모별로 색상을 변경할 수 있어야 함
- 메모별 리사이즈 기능 제공
- 메모를 드래그하여 위치 변경할 수 있음
- 앱의 '보기모드'를 변경하여 기존의 스티커형태 뷰에서 리스트 뷰로 전환할 수 있어야 함.
- 리스트 뷰에서는 메모 내용뿐 아니라 메모의 생성일시,편집일시 등 상세정보를 제공.
- 리스트 뷰에서는 메모의 Sorting을 다시 할 수 있음

## Requirements
Getting started에서 소개한 Underscore, jQuery, Backbone.js 이외에 필요한 것이 하나 더 있습니다.
바로 개별 메모의 드래그,드롭을 구현할 jQuery-UI입니다. 직접 작성하는 것도 나쁘지 않지만, 보다 Backbone.js에 포커스를 맞출 수 있도록 본 튜토리얼에서는 User Interaction은 가급적 간단히 적용할 수 있는 jQuery-UI를 사용할 예정입니다. (이 부분은 경우에 따라 적용하지 않아도 상관없으며, 필요 시 다른 UI라이브러리를 사용하셔도 됩니다.)

이렇게 4가지의 모듈을 페이지에 로드시키면 다음과 같을 것입니다.

```
<script type=”text/javascript” src=”/path/to/jquery.min.js”></script>
<script type=”text/javascript” src=”/path/to/jquery-ui.min.js”></script>
<script type=”text/javascript” src=”/path/to/underscore-min.js”></script>
<script type=”text/javascript” src=”/path/to/backbone-min.js”></script>
```

그럼 이제 튜토리얼을 시작해보겠습니다.

# 스티커메모 웹앱 만들기

## Model
이 웹앱에서 개별 메모 데이터는 Backbone.Model에 대응될 수 있습니다.
Backbone.Model은 어떠한 집합체의 개별 원소라고 보면 되며 Backbone.js의 데이터를 이루는 가장 작은 단위입니다. 그리고 Model을 선언하는 방식은 다음과 같습니다.

```
var MemoModel = Backbone.Model.extend({
	idAttribute: 'id',
	defaults: {
		//기본값들을 지정한다
	}
});
```

Model에서는 보통 `idAttribute`와 `defaults`를 지정하는 선에서 마무리합니다. 하지만 별도의 Collection 없이 단독으로 활동하는 Model 인 경우에는 Model이 직접 스스로 fetch되어야 하므로 `url` 값을 지정할 수 있습니다.

### idAttribute
`idAttribute`는 Collection 속의 모델 데이터가 갖는 Primary key에 해당됩니다. 사람으로 치면 주민번호에 해당하는 값이라고 볼 수 있습니다. 해당 값을 기준으로 Model이 서버와 통신할 수 있는 URL이 만들어지기 때문에 idAttribute는 하나의 Collection 내에서 다른 Model과 중복이 되어서는 안됩니다. 이 튜토리얼에서는 DB의 메모 테이블에서 auto\_increment 속성을 가지는 PK값인 'mem\_idx' 컬럼을 idAttribute로 사용할 것입니다. 

#### idAttribute가 URL을 만드는 방식
앞서 저는 _'idAttribute 값을 기준으로 Model이 서버와 통신할 수 있는 URL이 만들어진다'_고 했습니다.
Backbone.js에서 일반적인 경우 Model의 URL은 부모 역할을 하는 Collection의 URL을 기반으로 만들어지는데 그 기본형태는 바로 `{collection.url}/{model.id}` 입니다. 

설령 URL이 '/api/memoList'인 Collection이 있고, 자식 요소로 각각의 id값이 101, 102인 Model 2개 있다면 이들 Model의 URL은 다음과 같이 생성됩니다.

- 101 : '/api/memoList/101'
- 102 : '/api/memoList/102'

그리고 이렇게 자동으로 부여된 URL에 따라 각각의 편집, 삭제를 비동기로 처리하게 되는 것입니다.

### defaults
다음으로 `defaults`를 살펴보겠습니다. `defaults`는 Model을 구성하는 각 속성과 속성별 기본값을 key-value 형태의 object로 지정하게 됩니다. 이렇게 지정된 기본 값들은 차후에 new 생성자를 통해 개별 Model instance를 생성할 때, 별다른 값이 없는 경우, 자동으로 값을 채우는데 사용됩니다. DB에서의 컬럼별 DEFAULT 지정과 정확히 같은 기능을 수행하는 것입니다. 하지만 형 변환이 자유로운 Javascript 특성 상 이미 지정된 기본값의 형태와 다르다고 해서 예외를 발생시키지는 않으며 어떠한 형태로도 Override될 수 있습니다. 그리고 기본값으로 지정되지 않은 항목일지라도 필요에 따라 얼마든지 추가해낼 수 있습니다.
(물론 기본값으로 지정된 타입에 대해 새로운 값을 지정할 때 가급적이면 그 타입을 같게 매치시켜 주는 것이 보다 안전하고 단순한 코드를 만드는 방법이겠죠!)

앞서 정리한 기능명세를 기반으로 defaults를 작성해보면 다음과 같을 것입니다.

```
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
```

### new 생성자로 새로운 instance 만들기

이렇게 해서 MemoModel이라는 Backbone Model을 하나 만들었습니다. 그런데 사실 이 MemoModel은 어떠한 정보도 가지고 있지 않은 틀에 불과합니다. 이 MemoModel에 new 생성자를 이용해서 새 instance를 만들어야만 비로소 의미가 있는 Model이 만들어 질 것입니다. 새로 하나 만들어볼까요?

```
var memoOne = new MemoModel();
```

네, 이렇게 해서 처음으로 Memo model을 만들어봤습니다. 그리고 이 모델을 `console.log()`를 이용해 찍어보면 attributes, changed, cid, _previousAttributes 등 Backbone.js 특유의 구조를 가지는 모델 객체가 보일 것입니다. 그리고 이 중의 `attributes`를 열어 보면,

```
...
attributes: {
	background: "#ffffff",
	content: "",
	modidate: "0000-00-00 00:00:00",
	redidate: "0000-00-00 00:00:00",
	width: 200,
	height: 200,
	x: 0,
	y: 0
},
...
```

이렇게 defaults 로 입력해놓은 값이 그대로 나타나게 됩니다. 모델을 생성할 때 아무런 데이터도 입력하지 않았기 때문입니다.

그러면 이번엔 default 값이 아닌 임의의 데이터로 새로운 모델을 만들어보겠습니다. 똑같이 new로 생성하되 다만 인자값으로 여러 속성값을 지정하기만 하면 됩니다.

```
var memoTwo = new MemoModel({
	content: "나의 메모입니다.",
	background: "yellow",
	width: 400,
	height: 300
});
```
'나의 메모입니다'라는 내용을 가진 가로 400px, 세로 300px짜리 노란색 메모입니다.
그리고 이 모델의 attributes를 찍어보면 다음과 같이 나타날 것입니다.

```
...
attributes: {
	background: "yellow",
	content: "나의 메모입니다.",
	modidate: "0000-00-00 00:00:00",
	redidate: "0000-00-00 00:00:00",
	width: 400,
	height: 300,
	x: 0,
	y: 0
},
...
```

결과값에서 알 수 있듯이 새로 입력한 데이터는 그대로 받아들이되, 없는 값은 defaults에 지정된 값으로 채워넣어졌습니다.
바로 이런 방식으로 하나의 표준형 모델을 만들고, 그 모델을 이용해 다양한 속성을 지닌 instance를 생성해 내는 것입니다. 그리고 이번 장에는 이렇게 직접 손코딩으로 모델 instance를 만들어보았지만, 앞으로 Collection을 다루는 튜토리얼에서는 DB에서 가져온 값을 바탕으로 Collection의 Model데이터를 제각각 새로운 instance로 생성하도록 하는 로직을 알아보게 될 것입니다.

그러면 이렇게 만든 Model들로 무엇을 할 수 있는지 몇가지 method들을 살펴보겠습니다.

### Methods
Backbone.js 의 [공식 페이지](http://backbonejs.org)에 방문해보면 방대한 양의 Reference 문서를 볼 수 있습니다. 하지만 그 중에서도 자주 쓰이는 몇가지를 정리해보았습니다.

#### model.get(attribute)
앞으로 정말 자주 접하게 될 `get()` method입니다. 단어 그대로 어떤 모델의 특정 속성값을 가져오는데 사용됩니다.
앞서 만들었던 memoTwo instance에 사용하면 다음과 같을 것입니다.

```
memoTwo.get("background");		//'yellow'를 반환
memoTwo.get("content");			//'나의 메모입니다.'를 반환
```


#### model.set(attribute, value, options);
`set()` method는 기존에 정의되었던 특정 속성값을 새로 지정하는 역할을 합니다.(하지만 변경된 값에 대해 자신의 url로 통신하지는 않습니다)

다음과 같이 하나씩 지정할 수도 있고,

```
memoTwo.set("background", "red");
memoTwo.get("background");			//'red'를 반환
```

혹은 이렇게 여러 속성을 한꺼번에 지정할 수도 있습니다.

```
memoTwo.set({
	content: "나의 멋진 메모",
	width: 200,
	height: 200
});
```

#### model.save(attribute, value);
`save()` method는 `set()`과 유사한 속성값 변경 역할을 합니다. 하지만 set이 별도의 통신을 하지 않는 것과는 달리, save method는 즉시 자신에게 할당된 URL을 통해 XHR 통신으로 변경값 전송을 수행합니다. id값이 있을 경우에는 DB에도 이미 존재하는 데이터라 판단하므로 `PUT` method로 UPDATE요청을 날리게 되며, id값이 없을 경우 새로운 데이터라 판단하여 `POST` method로 CREATE 요청을 날리게 됩니다. 때문에 save()를 사용하려면 URL이 할당되어 있어야 하므로, Collection 기반의 Model에만 사용할 수 있게 됩니다. (앞서 손코딩으로 생성한 instance들은 별도의 url이 없으므로, 사용하게 되면 _'Uncaught Error: A "url" property or function must be specified'_ 즉, URL 속성이 지정되지 않았다는 오류를 확인할 수 있습니다)

URL이 존재한다는 가정 하에, 사용방식은 set과 완전히 동일합니다. 하지만 XHR통신이 발생하기 때문에 필요에 따라 몇가지 옵션 인자를 추가해 사용할 수 있습니다.

```
memoTwo.save({
	x: 150,
	y: 200
}, {
	patch: true,
	success: function(model, response, options){
		console.log("저장이 성공적으로 이루어졌습니다.");
	},
	error: function(model, response, options){
		console.log("오류가 발생!");
	}
});
```

'success'와 'error' 는 아마 Ajax 구현 코드에서 많이 접하셨을 것이지만, `patch` 옵션은 생소하실 것입니다.

Getting started에서 소개드린 바와 같이, 올바르게 구현된 RESTful API는 일련의 CRUD 처리과정을 별도의 parameter로 받아 분기하지 않으며, Unique하고 Addressable한 주소값에 HTTP Method만 달리하여 처리해야 합니다. 데이터를 가져오고 수정하고 삭제하는 모든 것을 하나의 URL로 처리해야 하는 것이죠. 그리고 이러한 수정(UPDATE) 역할에 대응하는 HTTP Method가 바로 `PUT`이며, Backbone.js 역시 id값이 존재하는 model의 `save()` method에 대해 PUT으로 통신을 하게 됩니다. 

헌데 PUT은 한가지 특징이 있습니다. 바로 '존재하는 모든 데이터'를 다시 보낸다는 것입니다. 이 경우에는 앞의 코드에서처럼 'x:150, y:200' 두 개의 값만을 저장하더라도 background, content, width, height 등 다른 모든 값을 다시 보낸다는 이야기지요. 때문에 이러한 다소 불필요할 수 있는 항목을 제외하고 변경된 값만을 골라 전송하려면 `patch: true` 옵션을 주면 됩니다. 그리고 이 경우에는 `PUT`이 아닌 `PATCH`로 요청이 가게 됩니다.

#### model.destroy()
`destroy()` method는 말 그대로 model의 삭제를 요청하는데 사용됩니다. 우리가 앞으로 만들 스티커 웹앱에서는 '삭제' 버튼을 클릭하여 메모를 삭제할 때 수행될 것입니다. 그리고 이 역시 `save()` 와 마찬가지로 XHR 통신을 하게 되는데 destroy에 대응하는 HTTP method는 `DELETE` 입니다. 그리고 success, error 같은 추가 옵션을 허용합니다. 사용방법은 간단합니다.

```
newMemo.destroy();
```

#### 그 외에 자주 사용되는 property와 method
이 외에 자주 사용하는 것들을 몇가지 간추려 보면 다음과 같습니다.

* **model.has(attribute)** : model이 특정 속성값을 지니고 있는지를 확인하여 true 혹은 false를 반환합니다.

* **model.unset(attribute)** : 특정 속성에 대해 값만 비우는것이 아니라 아예 속성 자체를 지워버립니다.
* **model.id** : model의 idAttribute 값을 반환합니다.
* **model.changedAttributes()** : 마지막 동기화(sync) 이후로 변경된 값이 있으면 반환합니다. 없으면 false를 반환합니다.
* **model.toJSON()** : model의 속성들을 JSON형태의 string으로 반환합니다. 이 method는 Underscore.js의 template 기능 활용에 자주 사용될 것입니다.
* **model.isNew()** : model이 새로 만들어진 객체인지를 확인합니다. 그 판단 기준은 서버측으로부터 부여된 id값이 존재하느냐입니다.
* **model.clone()** : model을 복제하여 새로운 instance를 생성하여 반환합니다.



## 정리하며
이번 장에서는 메모 데이터의 표준형 Model을 만드는 과정을 통해 Backbone.Model을 살펴보았습니다.
다음 장에서는 이 Model들을 거느리는 부모역할을 하는 Backbone.Collection을 알아보도록 하겠습니다.