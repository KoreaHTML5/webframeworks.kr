---
layout : tutorials
title : Reactive. 처리하지 마세요. 선언에게 양보하세요.
category : tutorials
subcategory : data-binding
summary : Meteor의 Reactive 특성에 대해 알아보고 Reactive Data Source들을 이용하는 방법을 배워보자.
permalink : /tutorials/core_meteor/5_just_reactive_dont_declare
title_background_color : 1C1C1F
title_color : E4E4E4
tags : javascript meteor reactive session
author : acidsound
---
# [Core Meteor] Reactive. 처리하지 마세요. 선언에게 양보하세요.

이번엔 Meteor의 주요 특징 중 하나인 [Reactivity](http://docs.meteor.com/#/full/reactivity) 를 사용하여
웹 어플리케이션에 실시간으로 반응하는 구현을 다뤄보고자 한다.

facebook 같은 SNS를 보면 게시글과 댓글의 시간이 실시간으로 갱신되는데

Meteor를 사용하면 불필요한 DOM을 갱신하지 않고 필요한 부분만 적은 코드로 구현할 수 있다.

시간을 다루기 위해 [moment](https://atmospherejs.com/momentjs/moment) package를 사용한다.

```
meteor add momentjs:moment
```

로 패키지를 추가하고 브라우저 콘솔이나 ```meteor shell```에서
현재 시간 기준으로 얼마나 시간이 흘렀는지 (ex. 5 minute ago) 보여주려면

```javascript
moment(기준시간).fromNow()
```

를 사용하면 된다.

helper를 만들어보면 html 템플릿에선 **\{\{timeAgo createdAt}}** 를 사용하고 ```createdAt```을 기준 시간으로부터 얼마나 경과했는지로 바꾸는 ```timeAgo``` 라는 헬퍼는

```javascript
....
Template.main.helpers({
  ...
  "timeAgo": function(time) {
    return moment(time).fromNow();
  }
});
```

이와 같이 구현할 수 있습니다.

여기에서 우리는 Template의 ```helper```가 **Reactive Computation** 대상이며
```Session```이 **Reactive Data Source**라는 점을 사용합니다. [(http://docs.meteor.com/#/full/reactivity)](http://docs.meteor.com/#/full/reactivity)

**Reactive Computation** 대상인 ```helper``` 안에서 ```Session```의 값이 갱신되면 ```helper```를 다시 호출하지 않아도 다시 갱신이 되는 것입니다.

이번에는 1초마다 특정 Session의 값을 갱신하도록 해봅시다.

```onCreated```에서 interval을 생성하고 ```onDestroy```에서 제거하도록 하여 불필요한 ```setInterval```이 계속 실행되지 않도록 합니다.

```javascript
Template.main.onCreated(function() {
  Session.set("localtime",1);
  this.interval = Meteor.setInterval(function() {
    Session.set("localtime", Random.id());
  }, 1000);
});

....

Template.main.onDestroyed(function() {
  Meteor.clearInterval(this.interval);
});
```

단지 localtime 이라는 ```Session```에 1초마다 다른 값이 들어오도록 set하는 것으로 모든 준비가 끝났습니다.

```Session```은 현재 가지고 있는 것과 같은 값이 들어올 경우 불필요한 갱신을 하지 않으므로 항상 다른 값이 들어오도록
```Random.id()``` [(https://github.com/meteor/meteor/tree/devel/packages/random)](https://github.com/meteor/meteor/tree/devel/packages/random) 를 사용해 중복 값을 피합니다.

이를 사용하기 위해 기본 package 인 ```random```을 추가합니다

```
meteor add random
```


이는 **uuid** 값을 생성하여 매번 다른 값을 받습니다. 예전 버전의 ```Meteor.uuid()``` 와 동일합니다.

이제 helper를 수정할 차례입니다.

```javascript
Template.main.helpers({
  ...
  "timeAgo": function(time) {
    return Session.get("localtime") && moment(time).fromNow();
  }
});
```

이렇게 ```Session.get``` 을 추가해줍니다. 그 결과값은 항상 참이므로 &&(and)연산을 통해 항상 이후의 값을 반환합니다.

실제로 Chrome 브라우저에서 변경되는 순간을 보면

![실시간으로 변경된 DOM만 갱신한다.](imgs/Reactive_moment.png)

이와 같이 두 번째 ```li``` 부분이 점멸하면서 해당 DOM이 갱신되는 것처럼 최소한의 변경만 이루어지는 것을 확인할 수 있습니다.

[http://meteorpad.com/pad/tSGYZD6KbzNCgh7Ak/timeAgo](http://meteorpad.com/pad/tSGYZD6KbzNCgh7Ak/timeAgo)

실제로 구현한 소스는 이곳에서 확인할 수 있습니다.

만일 Reactivity 특성을 사용하지 않는다면 매 시간마다 변경이 있는 DOM을 찾아서 갱신하도록 하는 Event 처리를 해야하지만
Meteor 에선 이와 같이 적은 노력으로 효과적으로 구현할 수 있습니다.