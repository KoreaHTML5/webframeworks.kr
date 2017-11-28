---
layout : tutorials
category : tutorials
title : React Native에서의 가벼운 Progress Circle 구현하기
subcategory : setlayout
summary : React Native에서의 가벼운 Progress Circle 구현하는 방법을 알아봅니다.
permalink : /tutorials/weplanet/react-native-progress-circle
author : danielcho
tags : react native
title\_background\_color : F1F71A
---

> 본 포스팅은 [Christoph Michel][1] 의 [Lightweight Progress Circles in React Native][2]를 저자의 허락하에 번역한 글입니다. 오탈자, 오역 등이 있다면 연락부탁드립니다.

![][image-1]

필자는 Progress Circle을 보여주기 위해 React Native 컴포넌트를 만들기로 결정했다. 이것은 [react-native-progress-circle][3]이며, React Native 앱에서 쉽게 사용할 수 있다. 필자는 가급적 작고 가볍게 구현하고 싶었기 때문에 기존의 컴포넌트를 쓰지 않았다. *react-native-svg* 나 *ART*에 의존하지 않고, 순수하게 CSS에서 실행된다.


## 어떻게 작동하는가?
두 개의 원과 두 개의  반원을 사용하고 위에 보이는 Progress Sircle처럼 보이도록 원들을 배치시킨다. ([react-native-percentage-circle][4]를 참고함) 이것은 4단계로 작동한다: 


### 1. 그림자 컬러로 바깥 백그라운드 원을 렌더링한다.
![][image-2]
이것은 그냥 디자인된 그림이다:

\<View
  style={[styles.outerCircle, {
width: radius \* 2,
height: radius \* 2,
borderRadius: radius,
backgroundColor: shadowColor,
  }]}
/\>

### 2. 반원을 렌더링하고 백분율에 따라 위치시킨다.
이제 직사각형 크기에 *View*를 스타일링하고, 4개의 모서리 중 2개만 경계선 반지름 속성을 지정한다. 이렇게 하면 반원이 만들어진다. 
![][image-3]

\<View
  style={[styles.outerCircle, {
width: radius,
height: radius \* 2,
backgroundColor: color,
borderRadius: radius,
borderTopRightRadius: 0,
borderBottomRightRadius: 0,
transform:  { rotate: /\* rotate it according to percentage \*/ } ,
  }]}
/\>

### 3. 다른 반원을 렌더링하고 백분율에 따라 위치시킨다.
만약 백분율이 50% 이상이면, 또 다른 반원이 필요하고 그것을 회전시켜야 한다. 그것은 처음 반원을 어느 정도 덮어씌울 것이다.  
![][image-4]

### 4. 원래 배경 색깔로 더 작은 내부 원을 렌더링한다.
이제 중심에 더 작은 흰색 원을 넣는다: 
![][image-5]

const radiusMinusBorder = this.props.radius - this.props.borderWidth
// ...
\<View
  style={[styles.innerCircle, {
width: radiusMinusBorder \* 2,
height: radiusMinusBorder \* 2,
borderRadius: radiusMinusBorder,
backgroundColor: this.props.bgColor,
  }]}
> 
  {
  this.props.children
  }
</View>

## 회전 문제
2개의 반원으로 0부터 100까지의 백분율을 감당할 수 있지만, 이것에 관해서 조금 더 생각해볼 여지가 있다. 

### 1. 50% 이상:
이 경우는 쉽다. 첫 반원은 항상 180도의 회전 값을 가지고 원의 오른쪽에 걸쳐있을 것이다. 두 번째 반원은 백분율로 전환하면 쉽게 계산된다. 

function percentToDegrees(percent) {
  return percent \* 3.6
}

### 2. 50% 이하:
여기서도 같은 회전 변환을 하지만, 문제는 원의 오른쪽의 부분만이 아니라 전체 반원을 표시한다는 것이다. 
![][image-6]

해결책은 두 번째 반원을 왼쪽에 오버레이로 사용하는 것이다. 바깥 원의 색으로 그 부분(0도)을 렌더링 한다. 
![][image-7]


## 애니메이션화된 라이브러리의 추가 사용법
내장된 CSS 기능만 사용하는 것의 장점은 부드러운 애니메이션과 하드웨어 가속을 제공하는 [Animated Library][5]를 사용할 수 있다는 것이다. 그리고 [Countdown Sircle][6]을 동일한 방식으로 만들 수 있다.
![][image-8]


[1]:	http://cmichel.io/
[2]:	http://cmichel.io/react-native-progress-circle/
[3]:	https://www.npmjs.com/package/react-native-progress-circle
[4]:	https://www.npmjs.com/package/react-native-percentage-circle
[5]:	https://facebook.github.io/react-native/docs/animated.html
[6]:	https://www.npmjs.com/package/react-native-countdown-circle

[image-1]:	http://cmichel.io/react-native-progress-circle/featured.png
[image-2]:	http://cmichel.io/react-native-progress-circle/bg.png
[image-3]:	http://cmichel.io/react-native-progress-circle/first-half-circle.png
[image-4]:	http://cmichel.io/react-native-progress-circle/second-half-circle.png
[image-5]:	http://cmichel.io/react-native-progress-circle/inner-circle.png
[image-6]:	http://cmichel.io/react-native-progress-circle/less-than-50-no-hc2.png
[image-7]:	http://cmichel.io/react-native-progress-circle/less-than-50.png
[image-8]:	http://cmichel.io/react-native-progress-circle/react-native-countdown-circle.gif