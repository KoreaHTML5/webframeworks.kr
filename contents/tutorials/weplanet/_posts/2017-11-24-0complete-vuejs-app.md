---
layout : tutorials
category : tutorials
title : VueJS 애플리케이션 튜토리얼 - 간단한 가계부 앱 만들기
subcategory : setlayout
summary : VueJS를 통한 애플리케이션 개발에 대해 알아봅니다.
permalink : /tutorials/weplanet/0complete-vuejs-app
author : danielcho
tags : vue javascript 
title\_background\_color : F1F71A
---



> 본 포스팅은 [Matthias Hager](https://matthiashager.com) 의 [Vue.js Application Tutorial - Creating a Simple Budgeting App with Vue](https://matthiashager.com/complete-vuejs-application-tutorial)를 저자의 허락하에 번역한 글입니다. 오탈자, 오역 등이 있다면 연락부탁드립니다.



사실 'Vue.js' 튜토리얼은 매우 많다. 하지만 아쉽게도 매우 지엽적이다. 예를 들어 일부 튜토리얼은 처음 시작하는 사람을 위해 매우 기초적인 내용만을 담고 있거나, 독립된 특정 기능들을 어떻게 구현하는지 설명하는 문서가 대부분이다. 따라서 필자는 'Vue.js'로 전체 기능을 동작시킬 수 있는 개발 가이드를 만들어 보려고 한다. 만약 당신이 초보 개발자이거나 새로운 프레임워크와 기술을 배우고자한다면 다른 사람이 어떻게 개발하는지 보는게 중요하다. 코드를 어떻게 구조화하고, 서비스의 다양한 조각들을 어떻게 묶어내고, 개발 프로세스를 어떻게 관리하는지 말이다. 이 튜토리얼이 그런 역할을 할 수 있기를 희망한다. 



## 누구를 위한 문서인가?

이 튜토리얼은 당신이 웹 프론트 개발에 어느정도 익숙하고, 'Vue.js'에 대한 기초적인 지식이 있다고 가정한다. 만약 당신이 [Vue guide](https://vuejs.org/v2/guide/)에 따라 이 튜토리얼을 활용한다면, 새로운 어플리케이션을 만들고 구동하기 위해 vue-cli를 사용하게 될 것이다. 

왜냐하면 이는 'Vue.js'를 전혀 모르는 초심자를 대상으로 하지 않기 때문이다.따라서 코드를 한 줄 한 줄 설명하는 것 보다는 개발 컨셉과 코드 구조에 보다 집중할 생각이다. 



##튜토리얼은 어떻게 사용하면 될까?

이 튜토리얼을 작성하면서 내가 커밋한 모든 코드는 [public Budgeterium repo](https://github.com/matthiaswh/budgeterbium/commits/master) 깃헙 repository에 올려놓았다. 커밋할 때마다 적절한 메모를 남겨놓았기 때문에, 매번 어떤 코드들이 변경되었는지 매우 쉽게 확인할 수 있을 것이다. 당연히 repository를 클론하여 사용하는 것도 좋은 방법이다. 나 역시 튜토리얼을 읽고 따라오기 적절하도록 최대한 자주 커밋해놓았다. (실제 개발 프로젝트를 진행할 때보다는 훨씬 자주 했다.)

그리고 튜토리얼에서  `...`만 적어놓은 코드 라인이 있다면, 이는 기존 코드에서 연속된다는 의미로 이해하면 좋을 것 같다.