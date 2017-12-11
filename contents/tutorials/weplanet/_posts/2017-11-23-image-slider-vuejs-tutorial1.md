---
layout : tutorials
category : tutorials
title : Vue.js로 이미지 슬라이더 만들기 1
subcategory : setlayout
summary : Vue.js로 이미지 슬라이더 만드는 방법을 알아봅니다.
permalink : /tutorials/weplanet/image-slider-vuejs-tutorial1
author : danielcho
tags : vue
title\_background\_color : F1F71A
---

> 본 포스팅은 [Matthias Hager][1] 의 [Building an Image Slider with Vue.js][2]를 저자의 허락하에 번역한 글입니다. 오탈자, 오역 등이 있다면 연락부탁드립니다.



이미지 슬라이더는 `vue.js`에서 자주 사용된다. 이는 데이터 관리, DOM 업데이트 및 사용자 인터랙션이 필요한 단일, 별개의 컴포넌트이다. 최근에 `vue.js`로 만들고 있는 마케팅 페이지개발 프로젝트에 아주 간단한 이미지 슬라이더가 필요했다. 필자는 jQuery를 더 이상 사용하지 않으며, 프로젝트 전반에 이미 Vue를 사용하고 있었기 때문에 이미지 슬라이더를 빌드 할 수 있는 아주 좋은 기회였다.

이전에 Vue를 사용 해본 적이 없다면 공식 가이드가 꽤 잘나와있다. 이 튜토리얼을 읽기 전에 기본 사항을 이해하는 것이 좋을 것이다. 최소한 [installation instructions][3]은 따라해보자.

먼저 Vue 객체를 만든다. 이미지가 몇 개 필요 할 테니 객체에 이미지 어레이를 만들자. 또한 `active` 이미지를 추적할 수 있는 방법이 필요하므로 `variables`도 만들 것이다.

```javascript
new Vue({
	el: 'image-slider',
	data: {
		images: ['http://i.imgur.com/vYdoAKu.jpg', 'http://i.imgur.com/PUD9HQL.jpg', 'http://i.imgur.com/Lfv18Sb.jpg', 'http://i.imgur.com/tmVJtna.jpg', 'http://i.imgur.com/ZfFAkWZ.jpg'],
		currentNumber: 0
}
});
```

이 `element`의 이름은 `image-slider`로, HTML에서 `<image-slider> </ image-slider>` 태그를 사용하여 표시하려는 위치에 슬라이더를 삽입할 수 있음을 의미한다. 이를 통해서 현재 이미지를 보여주자. 이미지의 `src` 속성 앞에 콜론이 있다. 그것은 Vue 속기 표기법이다. 그것은 Vue에게 문자 그대로 속성 값을 읽지 말고 내용을 평가해야 한다고 알려준다. `images` 어레이와 `currentNumber` variable을 데이터 객체를 통해 구성 요소에 전달하여 여기에서 사용할 수 있도록 한다.

```javascript
<body>

<image-slider>
	<img :src="images[currentNumber]" />
</image-slider>

</body>
```

첫 번째 이미지를 표시하는 데 필요한건 이게 전부이다. 물론 아직 아무것도 하진 않았다. 사용자가 이미지를 회전하도록 하게 할 수는 있지만 먼저 타이머에 넣자. 결국 타이머도 멈추기를 원할 테니 그걸 지금 추가하자.

메소드 객체를 통해 컴포넌트에 메소드를 넣어준다. 이것들은 `this.methodName()`을 사용하여 객체에서 사용할 수 있으며 바운드 속성에서 `methodName`을 불러와 템플릿에서 사용할 수 있다. 컴포넌트가 로딩된 후 슬라이더가 시작되기를 원하기 때문에 Vue 라이프 사이클의 `ready` 메소드를 불러와 회전을 트리거한다.

```javascript
new Vue({
	el: 'image-slider',
	data: {
	images: ['http://i.imgur.com/vYdoAKu.jpg', 'http://i.imgur.com/PUD9HQL.jpg', 'http://i.imgur.com/Lfv18Sb.jpg', 'http://i.imgur.com/tmVJtna.jpg', 'http://i.imgur.com/ZfFAkWZ.jpg'],
	currentNumber: 0,
	timer: null
	},

ready: function () {
	this.startRotation();
},

methods: {
	startRotation: function() {
		this.timer = setInterval(this.next, 3000);
	},

	stopRotation: function() {
		clearTimeout(this.timer);
		this.timer = null;
	},

	next: function() {
		this.currentNumber += 1
	}
}

});
```

`setInterval`을 사용하여 3 초 타이머를 실행했다. 각 인터벌마다 `next()` 메소드가 불려오는데, 단순히 `currentNumber`를 증가시키는 것이다. HTML을 변경하지 않고 이미지를 순환하는 페이지를 볼 수 있을 것이다.

슬라이더가 이미지의 끝에 닿으면 끝이 난다. 다시 시작으로 돌아가게 하는 방법이 필요하다. 이를 수행하는 가장 직접적인 방법은 `next` 메소드를 체크해서 현재 숫자가 이미지 어레이의 길이보다 큰지 체크하고 그럴 경우에는 0으로 다시 설정하는 것이다. 프로그래밍을 좀 해봤다면 `modulo operator`가 사이클링에 유용하다는 것을 알고 있을 것이다. 여기에서 이를 사용할 것이다. 그리고 중요한 Vue 기능 하나를 보여줄 것이다. `bound` 속성은 실제로 자바스크립트 표현식이다.

```javascript
<body>

<image-slider>
	<img :src="images[currentNumber % images.length]" />
</image-slider>

</body>
```

다음 회에서 계속됩니다. 

[1]:	https://matthiashager.com/
[2]:	https://matthiashager.com/blog/image-slider-vuejs-tutorial
[3]:	https://vuejs.org/v2/guide/installation.html