---
layout : tutorials
category : tutorials
title : Vue.js로 이미지 슬라이더 만들기 2
subcategory : setlayout
summary : Vue.js로 이미지 슬라이더 만드는 방법을 알아봅니다.
permalink : /tutorials/weplanet/image-slider-vuejs-tutorial2
author : danielcho
tags : vue
title\_background\_color : F1F71A
---

> 본 포스팅은 [Matthias Hager][1] 의 [Building an Image Slider with Vue.js][2]를 저자의 허락하에 번역한 글입니다. 오탈자, 오역 등이 있다면 연락부탁드립니다.

이제 몇 줄의 자바 스크립트와 매우 간단한 HTML만으로 완벽하게 작동하는 이미지 슬라이더를 만들었다. 물론 `vue.js` 라이브러리도 같이 썼지만. 이는 매우 간단하지만 더 많은 기능을 구축하기 위한 훌륭한 기반이 될 것이다. 당장 필자는 추가적인 슬라이딩 효과도 필요하다고 생각한다. 마우스를 대면 일시 중지해야 한다. 일부 사용자는 이미지를 클릭하여 보길 원할 수도 있다. 먼저 사용자 인터렉션에 착수한 다음 효과를 추가하자.

이미 회전을 시작 및 중지하고 다음 슬라이드로 진행하는 방법들이 있다. 이전 슬라이드로 회전하는 데 필요한 것은 `next` 메소드를 복제하는 것인데, 현재 슬라이드의 번호만 줄여주면 된다.

```javascript
 ...
		next: function() {
			this.currentNumber += 1
		},
		prev: function() {
			this.currentNumber -= 1
		}
```

위 코드에 이슈가 발견되는지 확인해본다. 이미지를 순환시키기 위해 모듈로 오퍼레이터를 사용하기 때문에, 음수에 문제가 발생할 것이다. 현재 숫자의 절대 값을 사용하는 식으로 이를 수정할 것이다. 또한 슬라이드를 클릭하기 위한 컨트롤을 추가하고 마우스를 올려놓으면 일시 중지하는 기능도 추가할 것이다.

```javascript
<body>

<image-slider>
	<p>
		<a @click="prev">Previous</a> || <a @click="next">Next</a>
	</p>
	<img
		:src="images[Math.abs(currentNumber) % images.length]"
		v-on:mouseover="stopRotation"
		v-on:mouseout="startRotation"
	/>
</image-slider>

</body>
```

링크에서는 `@click`을 사용하고 이미지에는 `v-on:mouseout`을 사용하는 것에 주의하자. 이 둘은 똑같은 것이다. `@` 표기법은 `v-on`의 약식이며, `;`이 `v-bind`의 약어인 것과 비슷한 것이다.

이미지 `src`가 조금씩 다루기 어려워지기 시작한다. 가능하면 로직을 템플릿 밖에 두고 싶다면 이를 컴포넌트 메소드로 쉽게 이동시킬 수 있다.

다음 / 이전을 클릭 할 때 슬라이더 타이밍에도 문제가 있다. 타이머를 재설정하지 않기 때문에 때로는 컨트롤 중 하나를 클릭 했을 때 바로 점프를 한다. 이것에 대한 가장 간단한 해결 방법은 다음 / 이전이 호출 될 때마다 회전을 중지키시고 시작하는 것이다. 그 시점에서는 `setInterval` 을 사용하지 않는데 `next`와 `prev` 메소드에서 간격을 멈출 필요가 없기 때문에 `setTimeout`을 사용하는 것이 더 간단 할 것이다. 이 결정은 독자들에게 맡기겠다.

마지막으로 로테이터에 작은 슬라이드 효과를 추가하려고 한다. Vue는 이미 복잡한 작업의 대부분을 수행하는 [transition system][3]을 제공한다. 단지 거기에 연결하고 약간의 CSS만 추가하면 된다. Transition system 및 CSS 트랜시션이 어떻게 동작하는지에 대해서는 이미 문서화되어 있으므로, 여기서는 자세히 설명하지 않겠다.

이 변화에는 약간의 속임수, 아니 영리한 코딩이 필요하다. 다른 해결 방법은 보다 명확할 수 있지만 간결하지 않다.

먼저 CSS를 설정한다.

```javascript
.fade-transition {
    transition: all 0.8s ease;
    overflow: hidden;
    visibility: visible;
    opacity: 1;
    position: absolute;
}
.fade-enter, .fade-leave {
    opacity: 0;
    visibility: hidden;
}
```

컴포넌트 내에서 트랜시션을 `fade`라고 부를 것인데 Vue는 트랜지션의 상태에 따라 적용 / 제거 할 3 개의 클래스를 정하게 한다.

이게 새로 필요한 HTML이다.

```javascript
<body>
<image-slider>
	<p>
		  <a @click="prev">Previous</a> || <a @click="next">Next</a>
	</p>
	<div
		 v-for="number in [currentNumber]"
		 transition="fade"
	> 
	  <img
		  :src="images[Math.abs(currentNumber) % images.length]"
		  v-on:mouseover="stopRotation"
		  v-on:mouseout="startRotation"
	/>
	</div>
</image-slider>
</body>
```

여기에는 두 가지 큰 변화가 있다. 트랜지션을 위해 중요한 것은 `transition="fade"` 이다. 이것이 정의한 CSS 클래스를 사용하도록 Vue에 알려주는 것이다.

Vue는 요소가 삽입 / 제거되거나 표시 / 숨김할 때만 트랜지션을 실행한다. 여기에는 목록에서 `v-for`를 사용할 때 각 요소를 순환하는 것이 포함된다. 앞의 코드에서 우리는 DOM에 새로운 그림을 삽입하는 것이 아니라 동일한 `img` 요소에 대한 `src` 속성을 변경했다. 이제 Vue가 어레이를 순환하도록 지시하는 것이다. `currentNumber`value로 설정된 항상 하나의 값을 포함한 것이다. `currentNumber`가 변경되면 Vue는 해당 변경 사항을 감지하고 `v-for` loop을 다시 그린다. 근본적으로 Vue를 속여 기존 `img` 요소를 제거하고 새로운 `img` 요소로 대체하게 하는 것이다. 페이드 전환이 적용되었고 `div`가 절대적으로 배치되었으므로 한 이미지가 페이드아웃되면서 다음 이미지가 페이드인 하는 것이다.

[여기에][4] 최종 슬라이더가 있다. 또는[JSFiddle][5]에서 갖고 놀 수도 있다.


[1]:	https://matthiashager.com/
[2]:	https://matthiashager.com/blog/image-slider-vuejs-tutorial
[3]:	https://vuejs.org/v2/guide/transitions.html
[4]:	https://matthiashager.com/blog/image-slider-vuejs-tutorial/vue-slider.html
[5]:	https://jsfiddle.net/0f7w6f4j/4/