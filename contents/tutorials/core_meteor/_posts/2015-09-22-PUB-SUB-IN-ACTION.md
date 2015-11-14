---
layout : tutorials
title : Pub/Sub 어디까지 써봤니
category : tutorials
subcategory : data-binding
summary : Mongodb를 사용하지 않고서도 구독과 발행을 자유롭게 사용하는 패턴들을 보자.
permalink : /tutorials/core_meteor/4_pub_sub_in_action
title_background_color : 1C1C1F
title_color : E4E4E4
tags : javascript meteor publish subscribe
author : acidsound
---
# [Core Meteor] Pub/Sub 어디까지 써봤니

Meteor Document를 보면 publish([http://docs.meteor.com/#/full/meteor_publish](http://docs.meteor.com/#/full/meteor_publish))
링크의 아래에 [this.added](http://docs.meteor.com/#/full/publish_added)와 같은 함수들이 있다.

Meteor.subscribe한 컬렉션에서 observe를 해보면 added/changed/removed 를 받을 수 있는데
사실은 이는 publish에서 **"만들"**수 있는 것이다.

최초 publish 에 들어왔을 때 ```this.ready()```를 한번 해주고 들어올 때 마다 publish에서 add를 해주는 식이다.

외부 API를 쓴다거나 TCP/UDP 연결해서 얻은 결과물을 Collection 형태로 받을 때 매우 유용하다.

그래서 MQTT pub/sub 연동 예제를 구현해보았다.

[http://meteorpad.com/pad/uGoYkgrkWxBbkfJhh/mqttMeteor](http://meteorpad.com/pad/uGoYkgrkWxBbkfJhh/mqttMeteor)

이 예제에선 ```test.mosquitto.org``` 를 바라보고 MQTT 메시지를 수신하고 송신할 수 있다.

구현이 얼마 없는 것에 비해 매우 잘 작동하지 않는가?

MongoDB가 아닌 외부의 비동기 호출을 통해 받은 결과를 넘겨주는 것으로 실제 publish쪽 구현은 아주 간단한데

```javascript
Meteor.publish("chats", function() {
  var instance = this;

  // async function
  client.on('message', function(topic, message) {
    instance.added("chats", Random.id(), {
      message:message.toString(),
      createdAt: +new Date()
    });
  });
  this.ready();
});
```

subscribe쪽에 collection이 준비되었음을 알리기 위해 ```ready()```
[(http://docs.meteor.com/#/full/publish_ready)](http://docs.meteor.com/#/full/publish_ready)를 호출하고
새로 데이터가 들어오면 added[(http://docs.meteor.com/#/full/publish_added)](http://docs.meteor.com/#/full/publish_added)를 사용하는 것이 전부다.

added의 인자는 collection명, 중복구분용 id, 실제저장하고자 하는 객체 이렇게 세가지만 잘 넣어주면 된다.

만일 외부 API를 받아오고자 한다면 http package(meteor add http로 추가)를 추가한 후 ```client.on``` 부분을 ```HTTP.get``` 같은 걸로 대신하면 된다.

본 예와는 상관없지만 변경과 삭제의 경우도 마찬가지로 changed, removed를 사용한다.

실시간 데이터 변경을 감지하려면 해당 Collection을 observeChanges 감시하고 있다가 접근하면 된다.

특정 Collection의 count를 구현해 놓은 예를 한번 살펴보면서 알아보자.

먼저, 서버 쪽 예제를 보면

```javascript
// server: publish the current size of a collection
Meteor.publish("counts-by-room", function (roomId) {
  var self = this;
  check(roomId, String);
  var count = 0;
  var initializing = true;

  // observeChanges only returns after the initial `added` callbacks
  // have run. Until then, we don't want to send a lot of
  // `self.changed()` messages - hence tracking the
  // `initializing` state.
  var handle = Messages.find({roomId: roomId}).observeChanges({
    added: function (id) {
      count++;
      if (!initializing)
        self.changed("counts", roomId, {count: count});
    },
    removed: function (id) {
      count--;
      self.changed("counts", roomId, {count: count});
    }
    // don't care about changed
  });

  // Instead, we'll send one `self.added()` message right after
  // observeChanges has returned, and mark the subscription as
  // ready.
  initializing = false;
  self.added("counts", roomId, {count: count});
  self.ready();

  // Stop observing the cursor when client unsubs.
  // Stopping a subscription automatically takes
  // care of sending the client any removed messages.
  self.onStop(function () {
    handle.stop();
  });
});
```

클라이언트에서와 같이 서버에서도 ```observeChanges```를 사용할 수 있는데 변경 감지를 하고 실시간으로 pub/sub을 구현하기 위해
주의할 점 중 하나는 ```observeChanges```에서 최초 subscribe가 일어나는 시점에 added를 감지하여 이중으로 added가 되는 것을 막아야한다.

위의 예에선 initializing 지역 변수를 사용하여 제어하였다.

최초 subscribe 시엔 added만 발생하므로

```javascript
    added: function (id) {
      count++;
      if (!initializing)
        self.changed("counts", roomId, {count: count});
    },
```

이와 같이 해당 부분에서만 체크한다.

마지막으로 subscribe 시 반환값으로 받은 핸들로 ```stop()``` 을 사용하거나 Template의 ```onCreated``` 안에서
```this.subscribe```로 가입한 경우 해당 템플릿이 사라질 경우 ```onDestoryed``` 과정에서 구독이 종료된다.

이때 반드시 publish 안에서 observeChanges의 핸들을 ```this.onStop```으로 감시하여 중지해주자.

이렇게 만들어 놓은 Custom Publish는 클라이언트에서 사용할 땐 일반 Collection 처럼 다루면 된다.

```javascript
// client: declare collection to hold count object
Counts = new Mongo.Collection("counts");

// client: subscribe to the count for the current room
Tracker.autorun(function () {
  Meteor.subscribe("counts-by-room", Session.get("roomId"));
});

// client: use the new collection
console.log("Current room has " +
            Counts.findOne(Session.get("roomId")).count +
            " messages.");
```

Publish/Subscribe는 꼭 MongoDB에만 국한되지 않는다.

소켓 통신이나 파일, 큐등 다양한 실시간/배치 작업에 사용할 수 있으니 여러가지로 활용해보자.