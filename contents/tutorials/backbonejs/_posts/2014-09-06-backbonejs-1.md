---
layout : getstarted
title : Backbone.js Part 1 - 살펴보기
category : tutorials
permalink : /tutorials/backbonejs-1
title_background_color : AED5E6
tags : backbone
author : oigil
---

# Backbone.js의 구성

이번 포스팅에서는 본격적인 진행에 앞서 Backbone.js의 각 요소에 대해 간략한 소개를 하도록 하겠습니다.
Backbone.js는 Event, Model, Collection, Router, History, Sync, View 등의 하위모듈로 구성되어 있으며 이들 모두가 웹애플리케이션 개발에 큰 도움을 줍니다.
하지만 이 중에서도 웹애플리케이션 개발의 뼈대 역할을 하는 3가지가 바로 Model, Collection, View 입니다. (Event는 이 세가지를 접하면서 자연스럽게 활용하게 될 것입니다.)

## Backbone.Collection

Backbone.Collection은 일종의 목록 데이터라고 보면 되겠습니다. 서버로부터는 Array형태의 JSON 객체 집합을 받아서 구성하게 되며, 
이 데이터들에 대해 루프를 돌며 각 데이터를 자신에게 지정된 Model 형태에 맞는 인스턴스로 만들어냅니다.

![alt Collection](/static/img/backbone_1.png "Title")
 
Model 입장에서는 일종의 부모 역할을 하는 셈입니다. 그리고 이 역할에 맞게 Collection은 자신과 자신의 Model을 관리하는 여러 Method가 있고 또 Model의 상태 변화를
감지하는 Built-in 이벤트도 있습니다.

## Backbone.Model

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

## Backbone.View

View는 Backbone.js 애플리케이션의 시작이자 끝이라고 볼 수 있습니다.
애플리케이션을 시작할 때 new 생성자를 통해 Backbone.View 객체 인스턴스를 만들어내며, 데이터 변화에 대한 표현도 Backbone.View 객체를 통해 드러냅니다.
그리고 View는 어떻게 구성하느냐에 따라 정말 다양하게 표현할 수 있는데, N개의 아이템을 지니고 있는 List단위의 View를 만들고 그 안의 각 아이템에 대해 Child 단위의 새로운 View를 만들 수 있으며,
원하면 하나의 Element에 대해 여러개의 View로 만들어 관리할 수도 있습니다.

이렇게 DOM Element를 Backbone.View 인스턴스로 감싸는 이점은 분명합니다. 
그 중에서도 가장 큰 것은 Backbone.Model과 연동을 통해 Model의 변화에 대해 View의 변화를 자동적으로 적용시킬 있다는 점입니다.
하지만 Model을 연동시키지 않더라도 Backbone.View가 주는 편리한 Event, Method 관리 방식을 적용시킬 수 있는 것도 큰 장점입니다. 

앞으로의 포스팅에서 자주 언급이 되겠지만 Model을 결합한 View를 다루다보면, 마치 살아있는 객체를 다루는 느낌을 받게 될 것입니다.

## Backbone.Event

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

## 정리하며..
이 외에도 Router, History, Sync 등 몇가지 모듈이 더 있습니다. 하지만 단언하자면 이들은 절대 Backbone.js의 핵심요소가 아닙니다.
때문에 처음 접하시는 분이라면 아직 이 모듈들에 대해 마음 편히 가지셔도 되며 일단 Model, Collection, View를 숙지하신 후 에 확인해보시길 권해드립니다.

다음 post 부터는 Backbone.js와 jQuery-ui의 드래그 기능을 이용하여 '스티커 메모' 웹앱을 만드는 튜토리얼을 중심으로 진행하도록 하겠습니다.