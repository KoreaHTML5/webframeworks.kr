---
layout : tutorials
title : Model과 View의 2 Way Binding 구현하기
category : tutorials
subcategory : data-binding
permalink : /tutorials/backbonejs/2way_binding
title_background_color : AED5E6
summary : Backbone.js에서의 Model-View 간 2 way binding
tags : backbone
author : oigil
---

## Model과 View의 2 Way Binding 구현하기

지난번 튜토리얼에서는 Model에 `on()` 메소드를 이용하여 모델에 이벤트를 바인딩 하는 법을 살펴보았으며 이 방법을 이용하면 모델의 변화에 따라 어떠한 자동화된 동작을 이끌어낼 수 있다는 것도 알아보았습니다.

그러면 이번에는 Model &rarr; View 뿐 아니라 View &rarr; Model로도 이어지는 2 way binding 을 살펴보도록 하겠습니다.

### 목표
- 간단한 Model을 만듭니다.
- 이 Model을 표현해주는 View를 만듭니다.
- View를 클릭할 때마다 Model의 특성 속성값을 변화시키도록 합니다.
- Model의 해당 속성값이 변화할 때마다 View의 관련내용을 갱신합니다.

### HTML 준비
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
	<div id="movieInfo"></div>
</body>
</html>
```

###  Model 과 View 준비
먼저, 간단한 영화정보를 가지는 모델을 하나 만들어보겠습니다. 

```
var MovieModel = Backbone.Model.extend({
	defaults: {
		title: "",
		director: "",
		hits: 0
	}
});
```

이 번엔 View 객체를 하나 만들고 MovieModel 을 이용해 모델 인스턴스를 만들어 참조연결 해보도록 하겠습니다.

```
var MovieView = Backbone.View.extend({
	initialize: function(options){
		_.extend(this, options);
		this.model = new MovieModel({
			title: "Terminator 2",
            director: "James Cameron"
		});
	}
});
```

### Underscore Template 준비
Model을 DOM 엘리먼트로 표현하기 위해 Underscore template 을 이용하겠습니다.

```
<script type="text/template" id="MovieViewTemplate">
	<h3><%= title %></h3>
	<p>
		director : <%= director %><br>
		hits: <%= hits %>
	</p>
</script>
```

그 다음엔 MovieView의 코드에 Model을 해당 템플릿으로 렌더링해주는 코드를 작성하고, 마지막으로 MovieView를 이용해 movieView라는 인스턴스를 생성해보겠습니다. 

```
var MovieView = Backbone.View.extend({
	initialize: function(options){
		_.extend(this, options);
		this.template = _.template($("#MovieViewTemplate").html());
		this.model = new MovieModel({
			title: "Terminator 2",
            director: "James Cameron"
		});
		this.render();
	},
	render: function(){
		this.$el.html(this.template(this.model.toJSON()));
	}
});

var movieView = new MovieView({
	$el: $("#movieInfo")
});
```

### 중간 결과
여기까지의 내용을 정리하고, 아주 간단한 스타일을 하나 넣어 정리해보면 다음과 같습니다.

```
<!DOCTYPE html>
<html>
<head>
	<script src="//code.jquery.com/jquery-2.1.1.min.js"></script>
	<script src="//jashkenas.github.io/underscore/underscore-min.js"></script>
	<script src="//jashkenas.github.io/backbone/backbone-min.js"></script>
	<meta charset="utf-8">
	<title>Backbone Tutorial</title>
	<style>
		#movieInfo {background-color:yellow}
	</style>
</head>
<body>
	<div id="movieInfo"></div>
	<script type="text/template" id="MovieViewTemplate">
    	<h3><%= title %></h3>
    	<p>
    		director : <%= director %><br>
    		hits: <%= hits %>
    	</p>
    </script>
    
	<script>
	var MovieModel = Backbone.Model.extend({
    	defaults: {
    		title: "",
    		director: "",
    		hits: 0
    	}
    });
    var MovieView = Backbone.View.extend({
    	initialize: function(options){
    		_.extend(this, options);
    		this.template = _.template($("#MovieViewTemplate").html());
    		this.model = new MovieModel({
    			title: "Terminator 2",
                director: "James Cameron"
    		});
    		this.render();
    	},
    	render: function(){
    		this.$el.html(this.template(this.model.toJSON()));
    	}
    });
    
    var movieView = new MovieView({
    	$el: $("#movieInfo")
    });
	</script>
</body>
</html>
```
#### 실행화면
![실행화면](imgs/backbone-1.png)

### 이벤트 바인딩 : Model &rarr; View
Model과 View를 만들었으니 이제 서로를 연결해주는 작업을 진행하겠습니다.  
우리가 먼저 해야할 일은 Model에 `on()`메소드를 이용하여, hits 속성이 변화할 때마다 movieView의 `render()`가 실행되도록 연결하는 일입니다.

```
var MovieView = Backbone.View.extend({
    initialize: function(options){
        _.extend(this, options);
        this.template = _.template($("#MovieViewTemplate").html());
        this.model = new MovieModel({
            title: "Terminator 2",
            director: "James Cameron"
        });
        this.model.on({
           "change:hits": this.render 
        });
        this.render();
    },
    render: function(){
        this.$el.html(this.template(this.model.toJSON()));
    }
});
```

`"change:hits": this.render`가 보이시나요? 이 튜토리얼에서는 hits 속성 변화에 대해 "render"함수를 실행함으로써 View를 다시 그려주는 방식을 선택했습니다. 하지만 작업자의 취향이나 특정한 이유에 따라 hits 부분만을 변화시키는 등 다른 작업으로 대체할 수 있습니다.

### 이벤트 바인딩 : View &rarr; Model
Model의 변화에 대해 View가 반응하도록 했으니, 이번에는 View의 이벤트에 대해 Model이 변화하도록 해보겠습니다.
이를 위해서는 Backbone.View의 `events` 를 활용해야 합니다. 사용하는 방식은 다음과 같습니다.
  
```
var View = Backbone.View.extend({
    events: {
        "click": "clickHandler",
        "mouseover .title": "titleMouseoverHandler"
    },
    //...
});
```

아주 간단하죠? 위와 같이 `이벤트:핸들러` 형태의 Map을 걸어두기만 하면 해당 View 인스턴스의 $el과 그 내부 엘리먼트에 대해, map에 지정한 대로 이벤트가 바인드되게 됩니다.
   
그리고 여기서 반드시 주의깊게 보셔야 할 부분은 바로 `events의 스코프는 해당 View의 $el로 한정된다`는 점입니다. 즉, 예제에서 구현한 MovieView의 $el은 #movieInfo라는 엘리먼트이므로, MovieView에 지정된 events는 해당 엘리먼트와 그 내부만을 바라본다는 것입니다. #movieInfo의 외부에 있는 DOM 엘리먼트나 body 등에 대한 이벤트는 작동하지 않습니다.
(만일 "body"태그에 이벤트 적용이 필요하다면 애당초 Backbone.View의 $el을 "body"로 지정하는 방법이 있습니다.)

우리가 이제 구현할 부분은 다음과 같습니다.

- $el을 클릭할 때마다 "increaseHitsCounts"라는 함수가 실행되게 할 것
- "increaseHitsCounts" 함수는 Model 값 중 "hits"을 1씩 증가시킬 것

이를 구현해보면 다음과 같습니다.

```
var MovieView = Backbone.View.extend({
	events: {
		//$el의 click에 대해 increaseHitCounts 함수 연결
		"click": "increaseHitCounts"
	},
    initialize: function(options){
        _.extend(this, options);
        this.template = _.template($("#MovieViewTemplate").html());
        this.model = new MovieModel({
            title: "Terminator 2",
            director: "James Cameron"
        });
        this.model.on({
           "change:hits": this.render 
        });
        this.render();
    },
    render: function(){
        this.$el.html(this.template(this.model.toJSON()));
    },
    increaseHitCounts: function(){
        //MovieView에 참조 연결된 model의 hits 값을 가져와서 1씩 증감하여 set 
        this.model.set({
            "hits": this.model.get("hits") + 1
        });
    }
});
```

위의 코드를 실행하면 increaseHitCounts 함수에 의해 model의 "hits"값은 증가할 것입니다. 하지만 무슨 이유에서인지 아직 모델에 `on()`으로 연결된 "this.render"는 아직 실행되지 않을 것입니다.

바로 window.event의 Click 이벤트에 의해 핸들링이 실행되면서 javascript의 특징인 `this`가 바라보는 타겟이 `movieView 인스턴스에서 window로 바뀌었기 때문`입니다. 때문에 "render" 함수가 이벤트에 의해 실행되더라도 언제나 movieView를 this로 바라보도록 하기위해서는 `initialize` 부분의 상단에 다음과 같은 구문을 추가해줍니다.

```
_.bindAll(this, "render");
```

`_.bindAll()`은 Underscore.js에서 제공하는 함수로서, 2번째 이후로 전달받은 함수들의 실행 시 언제나 첫번째 인자로 지정된 객체를 this로 바라보도록 해주는 역할을 합니다. 때문에 Click이나 Mouseover 등 window.event 객체로 인해 호출하는 함수가 원래의 View 객체를 바라보도록 할 때 매우 유용합니다.

### 최종 결과물
이제 모든 작업이 완료되었습니다.

```
<!DOCTYPE html>
<html>
<head>
	<script src="//code.jquery.com/jquery-2.1.1.min.js"></script>
	<script src="//jashkenas.github.io/underscore/underscore-min.js"></script>
	<script src="//jashkenas.github.io/backbone/backbone-min.js"></script>
	<meta charset="utf-8">
	<title>Backbone Tutorial</title>
	<style>
		#movieInfo {background-color:yellow}
	</style>
</head>
<body>
	<div id="movieInfo"></div>
	<script type="text/template" id="MovieViewTemplate">
    	<h3><%= title %></h3>
    	<p>
    		director : <%= director %><br>
    		hits: <%= hits %>
    	</p>
    </script>
    
	<script>
	var MovieModel = Backbone.Model.extend({
    	defaults: {
    		title: "",
    		director: "",
    		hits: 0
    	}
    });
var MovieView = Backbone.View.extend({
	events: {
		"click": "increaseHitCounts"
	},
    initialize: function(options){
        _.extend(this, options);
        _.bindAll(this, "render");
        this.template = _.template($("#MovieViewTemplate").html());
        this.model = new MovieModel({
            title: "Terminator 2",
            director: "James Cameron"
        });
        this.model.on({
           "change:hits": this.render 
        });
        this.render();
    },
    render: function(){
        this.$el.html(this.template(this.model.toJSON()));
    },
    increaseHitCounts: function(){
        this.model.set({
            "hits": this.model.get("hits") + 1
        });
    }
});
    
    var movieView = new MovieView({
    	$el: $("#movieInfo")
    });
	</script>
</body>
</html>
```
그리고 노랗게 표시된 #movieInfo 영역을 클릭해보면 다음 화면과 같이 hits 수가 계속 올라가는 것을 볼 수 있습니다.

#### 실행화면
![실행화면](imgs/backbone-2.png)