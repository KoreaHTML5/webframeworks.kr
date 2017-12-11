---
layout : tutorials
category : tutorials
title : VueJS 가이드 2 - 데이터 구조
subcategory : setlayout
summary : VueJS를 통한 애플리케이션 개발에 대해 알아봅니다.
permalink : /tutorials/weplanet/2data-architecture
author : danielcho
tags : vue javascript
title\_background\_color : F1F71A
---



> 본 포스팅은 [Matthias Hager](https://matthiashager.com) 의 [Vue.js Application Tutorial - Step 2: Data Architecture](https://matthiashager.com/complete-vuejs-application-tutorial/data-architecture)를 저자의 허락하에 번역한 글입니다. 오탈자, 오역 등이 있다면 연락부탁드립니다.



데이터 구조를 만드는 것에 대한 가장 큰 결정은 서로 다른 객체들이 서로 어떻게 관련되어 있는지를 정의하는 것이다. Vue.js는 반응적인(reactive) 데이터에 초점을 맞추지만, 대부분 프로그래머에 따라 많은 부분이 달라질 수 있다. 

우리의 목적을 위해서는 데이터를 로컬 스토리지에 보관할 것이다. 한 대의 컴퓨터에서만 앱을 사용할건데 인터넷에 데이터를 보내지 않으면 많은 보안 문제를 피할 수 있다. 또한 애플리케이션을 보다 쉽게 개발할 수 있다. 가지고 있는 데이터 사본이 유일한 사본이므로 동기화를 유지하는 데 너무 많은 걱정을 하지 않아도 되는 것이다. 그래도 로컬 스토리지로 작업할 때 적용되는 많은 원리는 인터넷 백엔드에서 작업하는 것과 동일하다.

 관계형 데이터베이스를 사용하는 백엔드가 없으므로 일부 관계형 기능을 빌리거나 연결 관계를 명확하게 유지하는 건 우리에게 달려 있다. 우리의 데이터는 비교적 단순하고 간단하다. 우리는 단일 사용자 애플리케이션을 구축 하는 중이다. 그리고 엄청나게 커지지는 않을 것이다. 그래서 간단한 object / JSON 구조에 의존할 수 있다.



```javascript
transactions = [
    {
        desc: 'bought new ear plugs',
        date: '2017-02-08',
        category: 'Spending Money'
    },
    ...
];
budget = [
    {
        category: 'Spending Money',
        month: '2017-02',
        amount: '200'
    },
    ...
];
```

 

사용자가 카테고리 목록을 보려는 경우 모든 트랜잭션을 반복하고 유니크한 카테고리 이름들을 만들어야 한다. 카테고리 이름을 변경하면 해당 카테고리 및 각 예산 객체와 각 트랜잭션을 변경해야 한다. 추가 데이터를 저장하기 위해 별도의 범주 카테고리 목록을 만들 수 있지만 그렇게 하면 두 번째 문제는 해결되지 않는다. 

카테고리, 예산, 계정 및 트랜잭션 간의 관계가 애플리케이션의 핵심이기 때문에 단순화된 관계형 접근 방식을 취할 것이다. 다른 객체에서 ID로 객체를 표시 할 것이다.

```javascript
transactions = {
    'ijd4ijdoi3': {
        desc: 'bought new ear plugs',
        date: '2017-02-08',
        category: '4ijoidjie'
    },
    ...
};
categories = {
    '4ijoidjie': {
        name: 'Spending Money',
        type: 'Checking'
    }
    ...
};
budget = {
    'ijd3ij4id': {
        category: '4ijoidjie',
        month: '2017-02',
        amount: '200'
    },
    ...
};


```



저장하는 각 기록에 대해 유니크한 ID를 생성하고, 그 ID를 외래 키로 사용할 것이다. 카테고리를 트랜잭션 및 예산 객체에 직접 저장하는 대신 해당 ID를 사용하여 카테고리를 표시할 것이다. 이제 필요할 때 쓸 수 있는 정의된 카테고리 목록을 가진 것이다. 카테고리 이름을 변경하는 것은 단일 카테고리 객체를 변경하는 것만큼 간단하다. 그러나 카테고리별로 트랜잭션 목록을 표시 할 때 카테고리를 찾아서 각 ID에 첨부된 이름을 알아 내야한다.

이것은 단순한 오브젝트 저장을 위한 관계형 데이터베이스의 매우 단순한 분석이다. 나중에는 완전한 규모의 관계형 데이터베이스를 이 애플리케이션에 사용하는 것이 바람직할 것이라고 생각하지만, 이 튜토리얼의 범위를 한참 벗어나는 문제와 각종 라이브러리들이 등장할 수 있다.

