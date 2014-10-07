---
layout : tutorials
title : Backbone.Events의 개념
category : tutorials
subcategory : backbonejs
permalink : /tutorials/backbonejs-1
title_background_color : AED5E6
tags : backbone
author : oigil
---

## Backbone.Events 알아보기

Backbone.js에는 모델과 콜렉션의 여러가지 이벤트를 다루는 Backbone.Events 라는 모듈이 존재합니다. 이 모듈에서는 기본적으로 15개의 Built-in 이벤트를 제공하고 있으며 그 외에도 custom 이벤트를 만들어 사용할 수도 있습니다.

### 흔히 사용되는 Built-in Events

XHR통신이나 validation에 대한 이벤트들도 제공하고 있지만, 일단 모델과 콜렉션에 대해 많이 사용되는 이벤트들은 다음과 같습니다. (우측의 괄호 안 내용은 흔히 발생하는 경우입니다)

- "add" : 모델이 콜렉션에 추가되었을 때 (collection.add(model)을 실행했을 때)

- "remove" : 모델이 콜렉션에서 제거되었을 때 (collection.remove(model)을 실행했을 때)
- "reset" : 콜렉션이 초기화되었을 때 (collection.reset()을 실행했을 때)
- "sort" : 콜렉션이 어떠한 comparator에 의해 정렬되었을 때 (collection.sort()를 실행했을 때)
- "change" : 모델의 어떠한 값이 변화되었을 때 (model.set(attr: value)를 실행했을 때)
- "change:[attr]" : 모델의 특정한 값이 변화되었을 때
- "destroy" : 모델이 삭제되었을 (model.destroy()를 실행했을 때)

### Model에 이벤트 Bind하기

Backbone.js의 이벤트 바인딩은 매우 쉽게 설계되어 있는데요, jQuery의 `.on()`, `.off()` 메소드를 사용해보셨던 분이라면 매우 익숙하실 것입니다.

설령 다음과 같은 모델이 있다고 합시다.

```
var Movie = Backbone.Model.extend({
	defaults: {
		title: "",
		director: "",
		actor: ""
	}
});

var movie = new Movie({
	title: "Terminator 2",
	director: "James Cameron",
	actor: "Arnold Schwarzenegger"
});
```

이 movie라는 모델 인스턴스에 대해 `change` 이벤트와 핸들러를 바인드하고자 한다면 다음과 같이 작성해주면 됩니다.

```
movie.on("change", movieChangeHandler);
```

헌데 이렇게 작성할 경우에는 title 또는 director 등 어떠한 값이 변화하더라도 movieChangeHandler가 실행될 것이므로 정교한 컨트롤이 어려워질 수 있습니다. 만일 특정 값에 대해서만 이벤트를 바인드하고자 한다면 다음과 같이 `change:[attr]`로 속성이름을 지정해주거나,

```
movie.on("change:title", titleChangeHandler);
movie.on("change:actor", actorChangeHandler);

//두개 이상의 이벤트를 하나의 핸들러에 바인드시키는 경우
movie.on("change:actor change:director", staffChangeHandler);

```

또는 간편하게 이벤트 맵핑을 적용할 수도 있습니다.
 
```
movie.on({
	"change:title": titleChangeHandler,
	"change:actor": actorChangeHandler
})
```

### Custom 이벤트
보통의 경우에는 대부분 built-in 이벤트들로 해결이 가능하겠지만, 모델이나 콜렉션의 변화와 관계없이 자신만의 이벤트를 만들어야 하는 경우가 있을 수 있습니다.
이럴 때에도 마찬가지로 `on()` 메소드를 이용해 이벤트를 등록해두기만 하면 됩니다.

```
movie.on("selected", movieSelectHandler);
```

그리고 이러한 커스텀 이벤트들은 사용자가 직접 이벤트를 호출하여 사용해야 하며, `trigger(event)` 메소드를 이용하면 됩니다.

```
movie.trigger("selected");
```

### Model에 이벤트 Unbind하기
이벤트 Unbinding은 `off()` 메소드를 이용하며 jQuery와 유사하게 사용하면 됩니다.

```
//특정 이벤트에 대한 특정 이벤트핸들러를 제거할 때
movie.off("change:title", titleChangeHandler);

//특정 이벤트에 대한 모든 이벤트핸들러를 제거할 때
movie.off("change:title");

//모든 이벤트에 대한 특정 이벤트핸들러를 제거할 때
movie.off(null, eventHandler);

//모델에 대한 모든 종류의 이벤트핸들러를 제거할 때
movie.off();
```

### on, off 이외의 다른 메소드들

#### - trigger
앞서 정리한 바와 같이 `trigger()` 메소드는 built-in 이벤트나 직접 만든 이벤트등을 직접 호출하고 싶을 때 사용합니다.

```
movie.trigger("change");
```

#### - once
on과 같이 이벤트 바인딩에 사용되지만, 해당 이벤트에 대해 한번만 사용되고 바로 제거되는 역할을 합니다. jQuery의 `one()` 메소드와 유사합니다.
 
#### - listenTo
앞서 정리한 `on()`, `off()`, `trigger()` 등은 모두 모델이나 콜렉션에 직접 사용하는 메소드입니다.
만일 모델, 콜렉션이 아닌 Backbone.View 인스턴스에 기반한 이벤트 바인드가 필요한 경우에는 `listenTo()` 메소드를 이용하면 됩니다.
  
```
//movie 모델에 'title' 속성이 바뀌게 되면, view 인스턴스의 'render' 함수를 실행하라
view.listenTo(movie, "change:title", view.render);
```

#### - stopListening
`listenTo()`의 반대 역할을 하며, `model.off()`에 대응하는 메소드입니다.
  
## 예제
Backbone.Events에 대한 대략적인 부분을 살펴봤으니 이제 MovieCollection 라는 콜렉션에 새로운 모델이 추가될 때마다 리스트를 추가시키는 예제 코드를 작성해보도록 하겠습니다.

먼저, 코드를 작성할 기본 HTML은 다음과 같습니다.

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
	<ul id="movieList"></ul>
</body>
</html>
```

일단 모델과 콜렉션을 작성합니다.

```
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

```

이번엔 이 콜렉션을 관리하는 리스트 역할 View를 만들어보겠습니다.

```
var MovieList = Backbone.View.extend({
	initialize: function(options){
		_.extend(this, options);
		this.collection = new MovieCollection();
	}
});
```
 
Backbone.View의 `initialize`는 new에 의해 새로이 생성될 때 실행되며, 이 때 여기에 작성된 `this.collection = new MovieCollection();` 에 의해 새로운 콜렉션 인스턴스가 생성될 것입니다. 하지만 이 콜렉션은 아직 아무런 데이터가 없습니다.

그러면 이제 콜렉션에 모델이 새로 추가될 때마다 "appendMovie"라는 함수가 실행되도록 지정해보겠습니다. 

```
var MovieList = Backbone.View.extend({
	initialize: function(options){
		_.extend(this, options);
		_.bindAll(this, "appendMovie");
		this.collection = new MovieCollection();
		this.collection.on({
			"add": this.appendMovie
		})
	},
	appendMovie: function(model){

    }
});
```

위에 정리한 것처럼, 콜렉션에 `on()`을 이용해서 `add` 이벤트에 대해 "appendMovie"가 실행되도록 연결이 되었습니다. 

여기서 한가지 주의깊게 보셔야 할 부분은 바로 appendMovie 함수에 기입된 model이라는 인자입니다.
Backbone.Events은 built-in 이벤트들과 연결된 콜백함수에 해당 이벤트와 관련된 모델이나 콜렉션을 인자로 전달하도록 설계되어 있습니다. 그리고 add 이벤트의 경우에는 새로이 추가된 모델을 콜백함수에 전달하게 됩니다. (때문에 새로 추가된 모델이 어떤 것인지를 다시한번 필터링하거나 찾아낼 필요가 없는 것이죠.)

이제 appendMovie 함수를 좀 더 발전시켜보겠습니다.

```
var MovieList = Backbone.View.extend({
	initialize: function(options){
		_.extend(this, options);
		_.bindAll(this, "appendMovie");
		this.collection = new MovieCollection();
		this.collection.on({
			"add": this.appendMovie
		});
	},
	appendMovie: function(model){
		/*
			전달받은 add된 모델의 title값을 이용해 LI 엘리먼트를 생성한 뒤, 
			MovieList의 $el에 추가시킨다.
		*/
		var newMovie = $(document.createElement("li"));
		newMovie.html( "새로이 추가된 영화 : " + model.get("title") );
		this.$el.append(newMovie);
    }
});
```

그러면 이제 저 View object를 이용해서 #movieList라는 엘리먼트를 스코프로 이용하는 새로운 인스턴스를 만든 후 Model을 추가해보겠습니다.

```
var movieList = new MovieList({
	$el: $("#movieList")
});

moveList.collection.add({
	title: "Terminator 2",
    director: "James Cameron",
    actor: "Arnold Schwarzenegger"
});
```

그러면 화면에는 "새로이 추가된 영화 : Terminator 2" 라는 LI엘리먼트가 나타날 것입니다.

### 예제의 최종 결과물
모든 코드를 HTML문서로 정리해보면 다음과 같습니다.

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
	<ul id="movieList"></ul>
	
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
	
	var MovieList = Backbone.View.extend({
		initialize: function(options){
			_.extend(this, options);
			_.bindAll(this, "appendMovie");
			this.collection = new MovieCollection();
			this.collection.on({
				"add": this.appendMovie
			});
		},
		appendMovie: function(model){
			/*
			전달받은 add된 모델의 title값을 이용해 LI 엘리먼트를 생성한 뒤, 
			MovieList의 $el에 추가시킨다.
			*/
			var newMovie = $(document.createElement("li"));
			newMovie.html( "새로이 추가된 영화 : " + model.get("title") );
			this.$el.append(newMovie);
		}
	});
	
	
	var movieList = new MovieList({
		$el: $("#movieList")
	});
	
	movieList.collection.add({
		title: "Terminator 2",
		director: "James Cameron",
		actor: "Arnold Schwarzenegger"
	});
	</script>
</body>
</html>
```

### 예제가 너무 시시한가요?
예제는 이벤트 동작원리를 설명하기 위해 간단히 on에 의한 함수 실행만을 담아보았는데 어떠신가요? 
비록 Backbone.js가 다른 프레임워크에 비해 손이 많이 가는건 널리 알려진 사실이지만, 제아무리 그렇다 해도 "저거 하나 구현하려고 저렇게 많은 코드를 작성해?!"라고 어이없어 하실 수도 있겠습니다.
하지만 여기서 더 심화해본다면 과연 어떤 작업까지 가능할까요?

예제에서는 새로 추가된 모델들에 대해 일일히 LI엘리먼트를 만들어 append시킨게 전부입니다. 
하지만 여기서 더 나아가 콜렉션의 데이터들에 대해 단순한 DOM엘리먼트가 아닌 개별 Backbone.View 인스턴스를 생성시키고, Underscore.js의 템플릿 렌더링을 적용시킨다면 이야기가 달라집니다. 
자식 요소들은 더이상 단순히 DOM요소가 아닌 Backbone.View에 의한 인스턴스로 동작하게 되며, 인스턴스마다 자신의 Model을 품게 될 것입니다.
그리고 이러한 자식 요소들과 그 Model에 `on` 또는 `listenTo`를 이용해서 다양한 핸들러를 바인드하게 되면 
그야말로 Collection이나 Model의 다양한 변화에 대해 `알아서 움직이는` 화면 View 구현이 가능하게 됩니다. 

이것이 바로 Backbone.js의 특징입니다. 
눈에 보이는 View나 마크업은 단지 겉 표면에 불과하며, 모든 것을 Model과 Collection이라는 데이터에 기반해 움직이도록 설계할 수 있는 것입니다.


