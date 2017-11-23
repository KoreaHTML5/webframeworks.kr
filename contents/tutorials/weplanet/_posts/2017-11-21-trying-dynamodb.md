---
layout : tutorials
category : tutorials
title : DynamoDB 처음 시도하기
subcategory : setlayout
summary : DynamoDB를 사용하는 방법에 대해 알아봅니다. 
permalink : /tutorials/weplanet/trying-dynamodb
author : danielcho
tags : aws dynamoDB 
title\_background\_color : F1F71A
---

> 본 포스팅은 [Christoph Michel][1] 의 [Trying DynamoDB for the first time][2]를 저자의 허락하에 번역한 글입니다. 오탈자, 오역 등이 있다면 연락부탁드립니다.

개인적으로 진행하는 새 프로젝트에 [serverless framework][3]를 시도해보았다. 즉, AWS Lambda를 백엔드 로직에 적용하였고, 함께 사용할 데이터베이스를 결정해야 했다. AWS Lambda와 통합시키기에 매우 간단하기 때문에 당연히 DynamoDB는 매우 자연스러운 선택이다. 필자는 AWS Lambda에 깊은 인상을 받았던 반면, DynamoDB를 사용했을 때는 다소 실망스러웠다. DanymoDB는 몇 가지 심각한 제약들이 있으며, MongoDB로는 쉽게 할 수 있는 일들을 DynamoDB를 사용하려면 추가적인 개발이 필요한 경우들이 있었다.


## 작동 방법

다른 데이터베이스들과 마찬가지로, 테이블을 생성하고 인덱스를 사용해서 속성을 정의할 수 있다. 그렇지만, *common database name* 아래에 테이블을 구조화할 수 없다. 그래서 다양한 응용프로그램들에서 사용하는 모든 테이블들이 같은 대시보드하에 위치하게 된다. 그렇다면 새로운 프로젝트를 생성할 때마다 AWS 계정을 새로 만드는게 맞는가? 대신 필자는 *naming convention*으로 \<appName\>. \<tableName\> 를 사용하였다. 


## 가격 책정 모델

DynamoDB는 DB 테이블(또는 더 정확하게 인덱스)이 얼만큼의 작업량을 처리할 수 있는지 결정하기 위해 RCU라고 불리는 측정법을 사용한다. 이것이 결국 지불해야할 금액을 결정한다. RCU는 *Read Capacity Units*를 의미하고, 1 RCU는 당신의 데이터베이스 쿼리가 1초에 8KB의 데이터를 읽을 수 있음을 의미한다. (WCU는 *Write Capacity Units*로서 RCU와 유사한 개념으로 *Read*가 아닌 *Write*에 적용된다.)

하지만 이게 어떤 의미일까? 어떤 시간 단위를 기준으로 누적되어 계산된다는 의미일까?예를 들어 만약 한 달에 한 번 큰 쿼리 하나를 호출한다면, 8KB를 초과하는 데이터를 읽을 수 없다는 의미인가? 아니면, 쿼리가 타임아웃되기 전에 분당 60 x 8KB = 480KB을 읽을 수 있다는 의미인가? 

이 부분은 좀 관련 없지만, [Best Practices for Querying and Scanning Data][4]에 설명되어 있다. 다음 글을 확인해보자.

![]()

> "당신이 파티션 처리량을 완전히 사용하고 있지 않을 때, DynamoDB는 후에 있을 처리량급증을 대비해 사용하지 않고 있는 용량까지 확보하고 있다. 현재 최대 5분(300초)까지 사용하지 않는 *Read* 및 *Write* 용량을 확보한다. *Read* 또는 *Write* 용량이 가끔씩 급증할 때, 이 추가 용량이 사용된다. 그것도 아주 빠르게 소진된다. 당신이 테이블에 정의한 초당 처리 용량보다 훨씬 빠르게 말이다. 물론 그렇다고 사용량이 급증하는 시점을 기준으로 서비스를 설계할 필요는 없다. DynamoDB는 별도의 사전 통지 없이도 *Background Maintenance*와 같은 작업을 수행할 수 있다. 

즉, 평균적으로 5분의 시간 단위를 갖는다는 것을 확인할 수 있지만, 굳이 이 시간 단위에 의존할 필요는 없다. 당연히 이 부분은 추후에 변경될 수 있다.


## DynamoDB를 사용하기 전에 알았으면 했던 부분들

다음은 필자가 퀴즈 앱 서비스의 백엔드를 구축하는동안 겪었던 몇 가지 문제점들이다: 


### *Query Condition*은 *Index*에서만 동작한다.
테이블을 검색하는 방법에는 대략 2가지 방법이 있다: 쿼리 또는 스캔 방식이 있다.
1. 특정 속성값을 가진 모든 항목을 검색하고 싶을 때, 그 속성은 인덱스여야만 한다.(*KeyConditionExpression*을 사용한다.) 또는, 쿼리 대신에 스캔을 사용할 수 있지만 이는 그다지 추천할만한 방식이 아니다. 스캔 방식을 사용하면 전체 데이터베이스를 스캔하게되고 RCU를 많이 소모하기 때문이다.
2. 여러 가지 항목을 조회할 수 없다. 당신이 random-uuid-1 에서 random-uuid-10의 id를 가진 10가지의 항목을 조회하고 싶다고 가정하자. 이것을 쿼리로는 할 수 없는데, *KeyConditionExpressions*가 IN 연산자를 가지고 있지 않으며 OR 연산자는 허용하지 않기 때문이다:

	*Invalid operator used in KeyConditionExpression: OR.*

	대신, 당신은 [BatchGet][5]을 사용하여 이를 해결할 수 있다. 이것의 문제점은 *BatchGet* 역시 쿼리 방식보다 많은 RCU를 소모한다는 것이다: 각 항목들의 크기가 0.5KB 밖에 되지 않는다고 가정하자. 만약 우리가 이 모든 것을 조회하려면 1RCU가 필요하다. 10 x 0.5KB = 5KB \< 8KB ≈ 1 RCU 이니까 말이다. 그러나 *BatchGet* 으로 하면, 각 항목이 각각 계산되어서 회당 최소한 8KB ≈ 1 RCU 을 소비한다. 즉, 이 항목들을 얻으려면 당신은 10 RCU가 필요하게 된다. 

### 인덱스에 *boolean* 방식을 사용할 수 없다.
(이 글을 작성하고 있는 현재) *boolean* 방식은 인덱스 속성에 허용되지 않는다. 그렇다면 당신의 항목 중에 *active*된 *Boolean* 필드가 있다면 어떻게 해야할까? 그리고 *active*된 항목만을 얻기위한 쿼리를 작성하려면 어떻게 해야 할까?

*active*된 문자열을 만들고, 항목이 *active*되면, 그 항목의 *active*된 필드에 아무값이나 (빈 문자열을 제외하고) 지정한다. 항목이 *inactive*되면, *active* 속성을 삭제한다. 그리고 나서 *active* 속성에 *sort key* / *secondary index*를 생성한다. 이게 왜 권장할만한 방법이며, 왜 이렇게 동작하는지는 [Take Advantage of Sparse Indexes][6]를 확인해보면 된다. 사실 이 부분은 DynamoDB를 사용하기 위한 많은 노력 중 하나에 불과하다.


### *Random Item*을 가져올 수 없다.
퀴즈 앱 서비스의 백엔드를 개발하려면, 하나 또는 여러개의 *random items*를 샘플링할 수 있는 기능이 필요하다. MongoDB에서는 그냥 [*$sample*][7]을 사용하면 된다. DynamoDB에서, 필자는 다양한 접근법을 생각해봤는데 그 방법들은 결국에는 결점이 있거나 DynamoDB의 좋은 사용법이라고 생각되지 않았다.

우리가 모두 인덱스 *id*를 가진 거대한 테이블을 가지고 있다고 가정하자. 우리는 전체 데이터베이스를 스캔 하지 않고 무작위로 10개의 항목을 샘플링하고 싶다. 

#### 1. 순차 번호를 id로
우리는 *counter*를 *id*로 사용할 수 있다. 샘플링하기 위해서, 우리는 최대값의 id를 얻고, 범위 내 *0,…, 최대값의 Id* 범위 내에서 10개의 정수를 샘플링하고, 해당 id를 가진 항목들을 조회한다. 물론 여기에는 많은 문제가 있다.
- 전체 DB를 스캔하지 않고, 어떻게 DynamoDB에서 최대 id를 얻을 수 있을까? 
- 만약 항목들을 삭제하면 결국 구멍이 생긴다. 이 구멍들은 해결하기 쉽지 않다. 
- 테이블 *partitioning*에 악영향을 줄 수 있으며, 결국 [성능 문제][8]로 이어질 수 있다.  


#### 2. 랜덤 id를 사용하고 DB에 접속한 API에 캐시로 저장한다.
우리는 랜덤 *id*를 사용할 수 있다. 항목을 샘플링하려는 요청이 있을 때마다, 우리는 전체 데이터베이스를 한 번 스캔하고 *id*를 캐시로 저장한다. 그리고 나서 10개의 *id*를 샘플링하고, 이 항목들을 검색한다. 다음에 항목들을 샘플링해야 할 때, 우리는 캐시로 저장된 버전의 *id*를 사용한다. 이를 통해 전체 테이블 스캔을 피할 수 있다.

필자는 이 방식이 실행하기 좋고 간단한 아이디어라고 생각했으나, AWS Lambda 기능 내에서 캐시 저장 기능이 구현되어야한다는 것이다. [AWS Lambda에도 캐싱 솔루션][9]이 있는 것 같으나, 클라우드를 사용하는 주요 목적이 이게 아니기 때문에 필자는 이 이상 시도해보지 않았다.

#### 3. 랜덤 id를 사용하고 모든 id를 DB에 저장한다.
이 접근법이 결국 사용하게 된 방법이다. 우리는 다시 랜덤 *id*를 사용한다. 필자의 사례(퀴즈 앱)의 경우에서는, 항목들(질문)은 수동으로만 업데이트된다. 따라서 필자의 경우에는 테이블 내에서 *unique*한 항목을 저장하는 것은 적절하다. Lambda 기능은 이 항목들을 조회하고, 모든 id의 리스트를 얻고, 무작위로 10개를 샘플링하고, *BatchGetItem* 호출해서 실제 항목 데이터를 얻었다.

그러나 이것도 여전히 몇 가지 결점이 있다:
- 인덱스 항목은 매우 크며 많은 양의 RCU를 소모한다. 항목은 DynamoDB에서 400KB를 초과할 수 없으므로, 인덱스 항목이 여러 개로 나누느라 이 접근법이 더 복잡해졌다.
- 한 항목(인덱스)를 여러 번 접근하기 때문에 그것이 [성능 문제][10]로 이어질 수 있다.

	> "예를 들어, 만약 테이블에 엄청나게 많이 접속되는 소수의 파티션 키값이 있다면, 매우 많이 사용되는 파티션 키 값이 하나라도 있는 경우, 트래픽이 소수의 파티션에 집중될 수 있다. 하나의 파티션에만 집중되는 것도 가능할 수 있다.”

사실 필자는 DynamoDB에서 아이템을 샘플링하는 방법으로 더 좋은 아이디어가 있는지 알고 싶다. 

[1]:	http://cmichel.io/
[2]:	http://cmichel.io/trying-dynamodb/
[3]:	https://github.com/serverless/serverless
[4]:	http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GuidelinesForTables.html#GuidelinesForTables.Bursting
[5]:	http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchGetItem.html
[6]:	http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GuidelinesForLSI.html#GuidelinesForLSI.SparseIndexes
[7]:	https://docs.mongodb.com/manual/reference/operator/aggregation/sample/
[8]:	http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GuidelinesForTables.html#GuidelinesForTables.UniformWorkload
[9]:	https://medium.com/@tjholowaychuk/aws-lambda-lifecycle-and-in-memory-caching-c9cd0844e072
[10]:	http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GuidelinesForTables.html#GuidelinesForTables.UniformWorkload

