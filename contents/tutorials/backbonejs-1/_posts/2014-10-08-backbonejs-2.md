---
layout : tutorials
title : Model과 View의 2 Way Binding 구현하기
category : tutorials
subcategory : backbonejs
permalink : /tutorials/backbonejs-2
title_background_color : AED5E6
summary : Backbone.js에서의 Model-View 간 2 way binding
tags : backbone
author : oigil
---

## Model과 View의 2 Way Binding 구현하기

앞서 작성한 Backbone.Events에 대한 소개 글에서는 Model의 Event 바인딩이 어떻게 구현되는지 살펴보았습니다. 
그리고 이를 다시한번 요약하자면,
 
```
Model.on(eventName, eventHandler);

//또는

Model.on({
	eventName_1: eventHandler_1,
	eventName_2: eventHandler_2
});
```

이와 같은 방식으로 Model에 대한 단방향 이벤트 바인딩이 이루어게 됩니다.   
그러면 이번에는 곧바로 예제를 통해 Model과 View간의 양방향 바인딩을 알아보겠습니다. 

### 구현 목표
- 다수의 영화리스트 중 하나를 선택하면 영화정보를 수정하는 Form을 띄울 것.
- Form 입력을 통해 모델의 데이터를 변조할 것.
- 모델 데이터가 변하면 영화리스트 내용을 업데이트할 것.

### Model과 Collection 만들기
먼저 할 일은 영화 리스트 정보를 가지는 모델과 콜렉션을 만드는 것입니다. 이를 위해 먼저번에 작성한 코드를 재활용하여 기본 페이지를 만들어보겠습니다.

```
<!DOCTYPE html>
<html>
<head>
	<script src="//code.jquery.com/jquery-2.1.1.min.js"></script>
	<script src="//jashkenas.github.io/underscore/underscore-min.js"></script>
	<script src="//jashkenas.github.io/backbone/backbone-min.js"></script>
	<meta charset="utf-8">
	<title>Backbone Tutorial</title>
</head>
<body>
	<script>
	var MovieModel = Backbone.Model.extend({
		defaults: {
			title: "",
			director: "",
			actor: ""
		}
	});
	
	var MovieCollection = Backbone.Collection.extend({
		model: MovieModel
	});
	</script>
</body>
</html>
```

### 영화 리스트를 표현하는 View 만들기
위 코드에서 선언한 MovieModel과 MovieCollection은 아직 아무런 데이터가 없습니다.
이제 이 모델과 콜렉션을 실제로 사용할 Backbone.View 객체를 만들고 콜렉션 인스턴스를 생성하여 참조하는 코드를 작성해보겠습니다.

```
var ListView = Backbone.View.extend({
	initialize: function(options){
		_.extend(this, options);
		this.collection = new MovieCollection();
	}
})
```

만일, 콜렉션이 처음부터 몇개의 데이터를 가진 채로 생성하려면 다음과 같이 배열 데이터를 넣어주면 됩니다.


```
var ListView = Backbone.View.extend({
	initialize: function(options){
		_.extend(this, options);
		this.collection = new MovieCollection([
			{
				title: "Terminator 2",
				director: "James Cameron",
				actor: "Arnold Schwarzenegger"
			},
			{
	            title: "Heat",
	            director: "Michael Mann",
	            actor: "Robert de Niro"
	        },
	        {
                title: "True Lies",
                director: "James Cameron",
                actor: "Arnold Schwarzenegger"
            }
		]);
	}
})
```

