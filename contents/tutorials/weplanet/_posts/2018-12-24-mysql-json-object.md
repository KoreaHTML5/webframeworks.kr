---
layout : tutorials
category : tutorials
title : mysql에서 json object 사용하기
subcategory : setlayout
summary : mysql에서 json object를 사용하는 방법을 알아봅시다
permalink : /tutorials/weplanet/mysql-json-object
author : marcushong
tags : sql json
title\_background\_color : F1F71A
---

### 들어가며
mysql 5.7.22이상 부터 JSON_OBJECTAGG, JSON_ARRAYAGG 사용하면 GROUP BY 시에 결과를 json으로 받을 수 있다.
데이터 저장시에 json 타입을 사용하는 것은 퍼포먼스 이슈가 있어서 좀 꺼려지는 것이 현실이지만,
GROUP BY시에 사용하는 것은 어차피 문자열 조합이므로 퍼포먼스 차이가 크지 않다.
일반적으로 사용하는 GROUP_CONCAT과 JSON_OBJECTAGG, JSON_ARRAYAGG 3가지를 비교해본다.

### mysqljs (https://github.com/mysqljs/mysql)
mysqljs를 사용하면 type cast가 가능하다. JSON타입일 경우 json으로 변환시키면 편리하다.

```js
const mysql = require('mysql')

const pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'example.org',
    user            : 'bob',
    password        : 'secret',
    database        : 'my_db'
  },
  typeCast: function (field, next) {
    if (field.type === 'JSON') {
      return JSON.parse(field.string())
    }
    return next()
  }
})
```

### GROUP_CONCAT
먼저 GROUP_CONCAT은 추출하려는 각 항목을 as로 변수로 만들어서 application단에서 처리해야 한다.

```sql
SELECT i1.*, GROUP_CONCAT(i2.id) as ids, GROUP_CONCAT(i2.name) as names FROM `Inspections` i1
         JOIN `InspectionOptions` i2 ON i2.inspectionId = i1.id
WHERE i1.`id` = 14
GROUP BY i1.id;
```

### JSON_OBJECTAGG
JSON_OBJECTAGG 원하는 항목을 key: value 타입의 JSON Array 추출한다.

```sql
SELECT i1.*,
       JSON_OBJECTAGG(i2.id, i2.name) as options FROM `Inspections` i1
         JOIN `InspectionOptions` i2 ON i2.inspectionId = i1.id
WHERE i1.`id` = 14
GROUP BY i1.id;
```

### JSON_ARRAYAGG
JSON_ARRAYAGG은 원하는 항목을 JSON ARRAY로 추출한다.

```sql
SELECT i1.*,
       JSON_ARRAYAGG(i2.name) as names FROM `Inspections` i1
         JOIN `InspectionOptions` i2 ON i2.inspectionId = i1.id
WHERE i1.`id` = 14
GROUP BY i1.id;
```

JSON_OBJECT와 결합해서 원하는 타입의 JSON Array로 변환할 수도 있다.

```sql
SELECT i1.*,
       JSON_ARRAYAGG(JSON_OBJECT('id', i2.id, 'name', i2.name)) as options FROM `Inspections` i1
         JOIN `InspectionOptions` i2 ON i2.inspectionId = i1.id
WHERE i1.`id` = 14
GROUP BY i1.id;
```

### 정리
5.6이하에서 GROUP_CONCAT으로 GROUP BY를 하여 데이터를 핸들링 했다면 이제는 JSON_OBJECTAGG, JSON_ARRAYAGG를 사용해서 좀 더 손쉽게 데이터를 처리할 수 있다.