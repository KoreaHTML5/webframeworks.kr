---
layout : tutorials
category : tutorials
title : 자바스크립트 어플리케이션 마이그레이션하기 (1/2)
subcategory : setlayout
summary : 자바스크립트 어플리케이션 마이그레이션하기에 대해 알아봅니다.
permalink : /tutorials/weplanet/migrating-complex-javascript-angular-react1
author : danielcho
tags : javascript 
title\_background\_color : F1F71A
---



> 본 포스팅은 [JS Playground](https://javascriptplayground.com/)의 [Migrating complex JavaScript applications](https://javascriptplayground.com/blog/2017/08/migrating-complex-javascript-angular-react/)를 저자의 허락하에 번역한 글입니다. 오탈자, 오역 등이 있다면 연락부탁드립니다.

  



이 블로그는 제가 2017년 5월 폴란드 Front Trends에서 얘기한 내용에 대한 것입니다. 만약 발표 자료가 궁금하시다면  [find the slides on SpeakerDeck](https://speakerdeck.com/jackfranklin/front-trends-migrating-complex-software)에서 확인하실 수 있습니다. 



## 배경

제가 작업했던 어플리케이션은 음악 팬들에게 티켓을 파는 중요한 발권 플랫폼 비즈니스였습니다. 이 블로그 포스트를 읽기 위해 더 이상은 알 필요가 없습니다. 참고할 만한 가장 중요한 것은 갑작스러운 버그 리포트나 추가되어야 할 새로운 기능들을 해결하는 법을 아는 위치에 있어야 했다는 것입니다. 이것은 대규모적인 재개발 대신에, React 에서 새로운 요소들을 개발하고, Angular로 만들어진 구성 요소를 한번에 하나씩 React로 순차적으로 이전하기로 결정했습니다. 일년 전 이 프로젝트를 시작했을 때부터, 우리는 다방면에서 많은 것을 배웠고 그것이 이 블로그에서 이야기할 것들입니다. 



이 문서는 네 개의 T로 나뉩니다: Tech, Tests, Team, 그리고 Talking.





## Tech

우리가 내린 첫 번째 결정은 기존 Angular1 코드베이스에서 벗어나 버젼을 올리는 것이었습니다. 사실 Angular를 매우 좋아하지 않기 때문에 이 결정을 따르지 않았습니다. 물론 Angular를 통해 즐겁게 일해본 경험이 있고, Angular 2+는 많은 개선이 이루어졌다는 것을 압니다. 아무튼, 우리가 마이그레이션을 고려한 이유는 다음과 같습니다:

- 전문성 부족: Angular 어플을 만든 두 개발자 모두 회사를 나갔습니다.
- 자신감 부족; 우리가 어플을 개발해본 적이 없기 때문에, 코드를 바꿀 때 그 코드가 버그를 만들거나 다른 기능을 파괴하지 않는다는 자신감을 갖기 어려웠습니다. 
- Angular 1은 Angular의 최신 버전이 아니고 Angular 팀에서 관리할 예정이었지만, 우리가 찾고 있던 지속성이 없습니다.



React를 먼저 고른 이유는 우리 모두 잘 알고 있었기도 하지만, 우리가 추구하는 모델에 잘 맞았습니다. 그래서 우리는 어플리케이션을 (자신감을 가지고) 작은 구성 요소부터 큰 구성 요소로 점진적으로 구축할 수 있었습니다. 



### Angular 비중 줄이기

우리는 React로 완전히 새로 다시 만들거나, 점진적으로 마이그레이션 하면서 Angular와 React를 나란히 구동할 방법을 찾을 수 있었습니다. 위에 언급 했듯이, 완전히 새로 작업하는것은 고려 대상이 아니었기 때문입니다. 

점진적 마이그레이션의 또 다른 이점이 있습니다. 즉각적으로 가치를 추가할 수 있습니다. 완전히 새로 만드는 방식에서는 마이그레이션이 완료된 후에나 가치를 추가할 수 있습니다. 즉, 새로운 기능 추가가 어렵다는 것입니다. 만약 조각조각 마이그레이션 한다면 마이그레이션 코드를 배포할 때마다 가치(기능)을 추가합니다. 이 접근법은 Martin Fowler가 개발한 Strangler 접근법이라고 알려져 있지만, 대화 후 알게 된 것은 Lead Dev의  [Sabrina Leandro](https://www.youtube.com/watch?v=1QPEflWn1WU&list=PLBzScQzZ83I81fnpqX2AkYD5c5cKgrqc2&index=10)의 대화에서였습니다. 



![img](https://javascriptplayground.com/img/posts/migrating/value.png)



이 안쪽에서 바깥쪽으로 마이그레이션하는 접근법은 Angular 내에서 React를 렌더링하게 해주는 Angular 플러그인 [ngReact](https://github.com/ngReact/ngReact)로 가능해졌습니다. 우리의 접근법은 매우 작은 구성 요소로 시작해서, 구성 요소 트리를 따라 올라가면서 각 부분을 교체하며 진행하는 것이었습니다. 



![img](https://javascriptplayground.com/img/posts/migrating/tree.png)



이 접근법을 취함으로써, 우리는 공격적으로 서비스를 업데이트할 수 있었습니다. React로 쓰여진 우리의 코드 베이스의 첫 번째 파트는 마이그레이션을 시작한 둘째 날 업데이트되었습니다.



