---
layout : tutorials
category : tutorials
title : PHP 라라벨 5 On Mac - 16.Laravel Tinker Shell (쿼리 빌더)
subcategory : setlayout
summary : PHP 라라벨 5에 대해 알아봅니다.
permalink : /tutorials/weplanet/Laravel16
author : danielcho
tags : laravel
title_background_color : F1F71A
---





> 앞서 살펴본 것과 같이 날쿼리로 Tinker를 사용하는 방법과 SQL를 PHP 코드를 사용하여 빌드하는 벙법이 있습니다. 라라벨에서 제공하는 대화식 쉘 또한 라라벨이 추구하는 목표처럼 개발 생산성에 부합하는 기능이라고 확인 할 수 있습니다.
이제 쿼리 빌더를 간단히 조회 하는 방법에 대해 살펴보도록 하겠습니다.

### select

* 전체 테이블 조회

```
  >>> DB::table('boards')->get();
  => Illuminate\Support\Collection {#750
      all: [
         {#769
           +"id": 1,
          +"name": "steven1004",
           +"user_id": 1,
          +"created_at": null,
          +"updated_at": null,
        },
      ],
    }
```

* 테이블 속성 값에 '1'이 포함된 내용 조회

```
>>> DB::table('boards')->find(1);
=> {#773
     +"id": 1,
     +"name": "steven1004",
     +"user_id": 1,
     +"created_at": null,
     +"updated_at": null,
   }
```

* 테이블 컬럼명 지정하여 조건 값 조회

```
>>> DB::table('boards')->where('name','steven1004')->get();
=> Illuminate\Support\Collection {#770
     all: [
       {#768
         +"id": 1,
         +"name": "steven1004",
         +"user_id": 1,
         +"created_at": null,
         +"updated_at": null,
       },
     ],
   }
```

* 특정 컬럼명 조회

```
>>> DB::table('boards')->select('name')->where('name','steven1004')->get();
=> Illuminate\Support\Collection {#777
     all: [
       {#775
         +"name": "steven1004",
       },
     ],
   }
>>>
```

* Like 조회

```
>>> DB::table('boards')->select('name')->where('name','like','%steven%')->get();
=> Illuminate\Support\Collection {#777
     all: [
       {#775
         +"name": "steven1004",
       },
     ],
   }
>>>
```

* count()

```
>>> DB::table('boards')->count();
```

* distinct()

```
>>> DB::table('boards')->distinct('id')->get();
```

* select(DB::raw('count(*) as cnt'))

```
>>> DB::table('boards')->select(DB::raw('count(*) as cnt'))->get();
```

이 외에도 [공식문서](http://psysh.org/) 에서 자세한 내용을 확인 할 수 있습니다. 주로 사용하는 function 을 정리하자면 다음과 같습니다.

* join()
* union()
* whereNull()
* having()
* groupBy()
* insert(array $value)
* update(array $values)
* delete(int $id)
* lists(string $column)
* orWhere(string $column, string $operator, mixed $value)
* limit(int $value) // == take(int $value)
* orderBy(string $column, string $direction)
* latest() // == orderBy('created_at', 'desc')