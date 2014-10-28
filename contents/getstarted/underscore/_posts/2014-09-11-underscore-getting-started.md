---
layout : getstarted
title : underscore.js
category : getstarted
subcategory : library
summary : underscore는 다양한 util 함수들을 제공함으로 javascript를 보다 강력하게 사용할 수 있습니다.  
permalink : /getstarted/underscore
title_background_color : AED5E6
title_color : FFFFFF
tags : underscore backbone javascript library
author : nurinamu
---

# [underscore.js](http://underscorejs.org/)

underscore는 유용한 유틸 함수들을 모아 놓은 라이브러리 입니다. 사용법도 간단하게 _ (underscrore) 뒤에 .만 붙여서 사용하면 됩니다. underscore.js는 backbone.js에서 사용되고 있습니다.

## 설정방법 

아래의 경로에서 Download하여 script tag를 통해 직접사용할 수 있습니다.

```
//Development Version
http://underscorejs.org/underscore.js

//Production Version
http://underscorejs.org/underscore-min.js
```

그외의 방법으로 설치하여 사용할 수 도 있습니다.

- Node.js
```
npm install underscore
```

- Require.js
```
require(["underscore"])
```

- Bower
```
bower install underscore
```

- Component
```
component install jashkenas/underscore
```

## 구성
underscore에서는 함수에서 처리하는 인자에 따라 아래와 같이 구분이 됩니다.  

### [Collections](http://underscorejs.org/#collections)
콜렉션(Collections)을 입력 받아 처리하는 유틸 함수들입니다.

- each : 콜렉션의 내용을 순차적으로 처리합니다.
- map : 콜렉션의 내용을 입력된 함수로 순차적으로 처리하여 새로운 콜렉션을 생성합니다.
- reduce : 콜렉션을 순차적으로 처리하면서 이전 처리 내용을 매번 넘겨 받습니다. 이전 처리 내용을 첫번째 인자로 넘겨 받습니다.
- reduceRight : 콜렉션을 순차적으로 처리하면서 이전 처리 내용을 매번 넘겨 받습니다. 이전 처리 내용을 두번째 인자로 넘겨 받습니다.
- find : 찾기 조건에 해당하는 콜렉션의 첫번째 값을 반환합니다.  
- filter : 찾기 조건에 해당하는 콜렉션의 모든 값을 반환합니다.
- where : 프로퍼티 인자를 포함하는 콜랙션내 모든 오프젝트를 반환합니다.
- findWhere : 프로퍼티 인자를 포함하는 콜랙션내 첫번째 오프젝트를 반환합니다.
- reject : 찾기 조건에 해당하지 않는 콜렉션의 모든 값을 반환합니다. filter의 정반대 결과를 반환합니다. 
- every : 콜랙션내 값들이 조건에 모두 통과되는 경우에만 true를 반환합니다.
- some : 콜랙션내 값 중 하나라도 조건에 통과되는 경우에 true를 반환합니다.
- contains : 콜랙션내 값중 동일한 값이 존재하는 경우에 true를 반환합니다. 
- invoke : 콜랙션을 인자로 넘겨받은 함수명을 가진 함수에 넘겨 호출합니다. 
- pluck : propertyName과 동일한 콜렉션에 포함된 오브젝트의 key에 해당하는 value를 반환합니다. 
- max : 가장 큰 갑을 가진 객체를 반환합니다.
- min : 가장 작은 갑을 가진 객체를 반환합니다. 
- sortBy : 입력받은 조건으로 정렬하여 봔환합니다. 
- groupBy : 입력받은 조건으로 조건 결과값을 키로 하여 콜랙션을 반환합니다.
- indexBy : 입력받은 조건을 index 키로 하여 콜렉션을 반환합니다. 
- countBy : 입력받은 조건의 결과의 count 콜랙션을 반환합니다. 
- shuffle : 콜렉션 내 값의 순서를 섞어서 반환합니다. 
- sample : 콜랙션 내에서 원하는 갯수 만큼 랜덤하게 반환 합니다. 
- toArray : 입력 인자를 배열로 반환합니다.
- size : 콜랙션의 크기를 반환합니다.
- partition : 하나의 콜랙션을 조건에 따라 분리하여 반환합니다.

### [Arrays](http://underscorejs.org/#arrays)
배열을 기본인자로 받아들이며 해당 배열을 변환하거나 분석합니다.

- first : 배열의 첫번째 값을 반환합니다. 
- initial : 마지막 값을 제외한 나머지를 반환합니다. n을 입력받으면 뒤에서 n개의 값을 제외한 나머지를 반환합니다.
- last : 마지막 값을 반환합니다.
- rest : 첫번째 값을 제외한 나머지를 반환합니다. n을 입력받으면 앞에서 n개의 값을 제외한 나머지를 반환합니다.
- compact : false 값들을 제외한 값들을 반환합니다. 
- flatten : 배열내의 차원을 제거하여 반환합니다.
- without : 제외할 값들을 인자로 넘겨주어 배열에서 해당 값을 제외한 값들을 반환합니다.
- union : 배열들을 합집합화 하여 반환합니다.
- intersection : 배열들을 교집합화 하여 반환합니다.
- difference : 배열들을 차집합화 하여 반환합니다.
- uniq : 중복값을 제외하여 반환합니다.
- zip : 인자로 넘겨받은 배열들을 인덱스가 동일한 값들 끼리 묶어서 반환합니다.
- object : 인자로 넘겨받은 배열들을 합쳐서 key/value를 가지는 객체로 만들어 반환합니다.
- indexOf : 배열내 해당 값의 첫번째 인덱스를 반환합니다.   
- lastIndexOf : 배열내 해당 값의 마지막 인덱스를 반환합니다.
- sortedIndex : 해당 값을 배열에 삽입하여 정렬되었을 떄의 인덱스 값을 반환합니다.
- range : 인자 범위에 해당하는 값의 배열을 생성하여 반환합니다.

### [Functions](http://underscorejs.org/#functions)

함수를 확장하거나 호출 시점을 조절합니다. 

- bind : 함수에 object 값과 인자를 binding 합니다.
- bindAll : 입력받은 함수 이름들을 해당 객체에 모두 binding 합니다.
- partial : 기존의 함수에 인자값을 고정하여 새로운 함수를 반환한다. 
- memoize : 함수를 caching 함으로써 함수처리 속도를 높일 수 있도록합니다. 
- delay : setTimeout 처럼 특정 시간이후에 함수 호출을 합니다.
- defer : 함수가 종료되기 전에 호출되도록 함수 큐에 등록한다. 
- throttle : 특정 delay 안에 반복적으로 호출이 되면 첫 호출만 유요하게 호출하는 함수로 반환한다.
- debounce : 특정 delay 이후에 호출이 되는 함수로 반환한다.  
- once : 무조건 한번만 호출이되는 함수로 반환한다.
- after : 특정 회수의 호출이 이루어져야 유효 호출이되는 함수로 반환한다.
- before : 몇회 이상 호출 되지 못하게 하는 함수로 반환한다.
- wrap : 함수를 wrapping한 함수를 반환한다.
- negate : 인자의 부정형을 예측하는 함수를 반환한다. 
- compose : 입력받은 함수를 조합한 함수를 반환한다.

### [Objects](http://underscorejs.org/#objects)

객체를 확장하거나 객체를 분석합니다.

- keys : 인자 객체의 모든 key들을 반환한다. 
- values : 인자 객체의 모든 value들을 반환한다.
- pairs : 인자 객체를 [key,value] 쌍의 리스트로 반환한다.
- invert : 인자 객체의 key와 value를 역전시켜 반환한다.
- functions : 인자 객체가 가진 모든 함수 명을 반환한다.
- extend : 객체들을 통합하여 반환한다.
- pick : 특정 key/value 만을 반환한다.
- omit : 특정 key/value를 제외한 나머지를 반환한다. 
- defaults : 객체에 default 값을 설정한다. 
- clone : 객체를 복사하여 반환한다. 
- tap : 객체를 인자로 받은 함수에 넘겨주고 객체를 다시 반환한다.
- has : 객체가 해당 key를 가지고 있는지 여부를 반환한다.
- matches : 해당 key/value를 포함하는지 판단하는 함수를 반환한다.
- property : 인자로 받은 key의 값을 반환하는 함수를 반환한다.
- isEqual : 객체를 비교하여 동일한지 판단한다. 
- isEmpty : 빈객체인지 확인한다. 
- isElement : DOM 객체인지 확인한다.
- isArray : 배열인지 확인한다.
- isObject : 객체인지 확인한다.
- isArguments : 입력인자인지 확인한다.
- isFunction : 함수인지 확인한다.
- isString : 문자열인지 확인한다.
- isNumber : 숫자인지 확인한다.
- isFinite : 유한 숫자인지 확인한다.
- isBoolean : 불리언 값인지 확인한다.
- isDate : 날짜인지 확인한다.
- isRegExp : 정규식인지 확인한다.
- isNaN : NaN인지 확인한다.
- isNull : null인지 확인한다.
- isUndefined : undefined인지 확인한다.

### [Utility](http://underscorejs.org/#utility)

유틸 함수들입니다.

- noConflict : underscore 객체를 반환합니다.
- identity : 입력받은 인자를 반환합니다.
- constant : 입력받은 인자를 반환하는 함수를 반환합니다.
- noop : undefined를 반환합니다. 
- times : 입력된 n 번 만큼 함수를 반복합니다. 반복시에 index값을 인자로 받으며 결과값의 배열을 반환합니다.
- random : 범위내의 random값을 생성합니다.
- mixin : 객체에 함수를 추가하여 확장합니다.
- iteratee : 콜랙션에서 각 요소에 대한 값을 처리하는 콜백함수를 반환합니다. 
- uniqueId : unique ID를 생성합니다. prefix를 받으면 prefix에 ID를 붙여서 반환합니다.
- escape : HTML에 삽입가능한 문자열로 변환하여 반환합니다.
- unescape : escape 함수의 반대로 escape 변환된 문자를 재변환하여 반환합니다.
- result : 인자로 받은 이름을 가진 객체 값이 함수이면 해당 함수를 실행하여 값을 반환한다.
- now : 현재 시간을 정수형 timestamp로 반환한다.
- template : 탬플릿 포맷이 적용된 함수를 반환한다. <%= %>는 변수나 함수호출, <% %> javascript 코드 호출, <%- %>는 HTML-escape된 문자를 처리한다.  

### [Chaining](http://underscorejs.org/#chaining)

연속적으로 결과를 처리하도록 구조화하는 함수형 프로그래밍 방법을 지원합니다.

- chain : value가 호출되기 전까지 계속해서 wrapped 객체를 반환 받도록한다.

- value : wrapped객체의 값을 반환한다. 

## 참고자료

underscore.js에 대한 [소스코드 분석](http://documentcloud.github.io/underscore/docs/underscore.html)을 참고하면 더 자세하게 동작을 이해할 수 있다.