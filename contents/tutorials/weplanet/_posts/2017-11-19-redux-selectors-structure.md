---
layout : tutorials
category : tutorials
title : Redux Selectors 구조화하기
subcategory : setlayout
summary : Redux Selectors 구조화하는 방법에 대해 알아봅니다. 
permalink : /tutorials/weplanet/redux-selectors-structure
author : danielcho
tags : react redux 
title\_background\_color : F1F71A
---

> 본 포스팅은 [Christoph Michel][1] 의 [Structuring Redux Selectors][2]를 저자의 허락하에 번역한 글입니다. 오탈자, 오역 등이 있다면 연락부탁드립니다.

최근에 redux 부분을 구조화하는 방법에 대하여, 특히 selector를 처리하는 방법에 관하여 [몇몇 포스팅들][3]이 있었다. 이는 필자의 방법과 꽤나 비슷하지만, 필자는 selector를 globalizing하는 데 있어, 최대한 자동화하려 노력한다. 꽤 괜찮은 방법이라고 생각하고 있으며, 아직까지 큰 문제는 발견되지 않았다. 


## 우리는 Redux Selectors로부터 무엇을 원하는가?

우선, 다루어야하는 몇몇 흔한 문제 / 패턴에 대해 간략히 정리하면 다음과 같다.
1. 컴포넌트는 selector를 통해서만 상태(state)에 접근하고 모든 selector는 root 상태를 인수로 가져야 한다. 이는 또한 *combineReducers*로 구성된 하위 리듀서에도 유효하다. 이렇게 하면 컴포넌트들은 *internal state representation*과 완전히 분리된다.
2. 첫 번째 사항은 root 상태를 인수로 사용하는 *global selector*를 작성하는 것이지만, 쉬운 개발을 위해서 *child of the root* 상태를 인수로 사용하는 *local selector*를 작성할 것이다. 이렇게 하면, 우리는 상태를 *unpack*할 필요가 없으며, root 상태의 다른 부분들로의 접근을 막음으로써 *sub-reducers*가 올바르게 분리되었는지를 확신할 수 있다. 
3. *local selector*를 *global selector*로 매핑할 수 있는 메커니즘이 필요하다. 이를 통해서는 우리는 한 번만 selector를 실행하도록 할 수 있다. 이렇게 하면 코드가 중복되지 않고, 효율적이다.


## Redux 파일 구조

다음을 확인해보자.

![][image-1]

상태에는 세가지의 하위 상태가 있다: *navigation*, *notifications*, *settings*. 이 하위 상태들은 (일반적으로) 서로 독립적이어야 하며, 우리는 3개의 *reducers*를 만들어서 *combineReducers* 로 리듀서들을 결합할 수 있다. 필자는 각 리듀서 당 파일 하나로, *store* 를 3개의 하위 폴더로 나눔으로써 필자의 *redux* 파일을 다음과 같이 정리한다. 

![][image-2]

각 하위 폴더는 *reducer*, *local selectors*, 그리고 *actions*들이 포함되어 있다. *Store* 폴터는 모든 *local selectors*를 모으고, 글로벌라이즈하는 *selectors.js* 파일을 포함한다. *Store*의 *index.js*는 *middleWares*, *combineReducers*를 포함하고 있으며, *createStore*를 통해 *Store*를 생성한다. 


## Reducer와 Selector가 같은 파일에?

일부 사람들은 *selectors*를 *reducer* 파일에 넣는 것을 좋아하지만, 필자는 따로 두는 것을 선호한다. 이는 *circular import dependencies*를 피하기 위해서  따로 두었지만, 만약 *circular import dependencies* 상황에 처한다면 그것은 잘못된 설계일 수 있다. 

예를 들어, 당신이 *notification reducer*에 있는 알림을 사용하기 위해서 설정에 접근해야 한다고 가정해보자. 만약 당신이 *reducer* 내에서 일부 (*global*) *settings selectors*를 불러오게 된다면, *cyclic dependency* 상태를 경험할 것이고, 이는 해결하기 어렵다. (참고 : Webpack은 *settings selectors*가 *notification selectors*를 정의하는 블록이 아닌 다른 JS 실행 블록에서 사용되었다는 것을 인식하지 못한다. 편법을 사용하고 싶다면, 당신의 *reducer* 함수 내에 있는 *require(./selectors).someSelector* 을 사용할 수 있다.)

![][image-3]

*actions.js*에서 [thunks][4]를 정의함으로써 이런 이슈를 피할 수 있다. 참고로 *actions.js*는 *global selector*를 통해서 설정의 중요한 부분을 가져오고, 그 다음 동작들과 함께 *payload*의 일부를 전달하게 된다. 필자가 생각하기에 *Selector*와 *Reducer*를 한 파일에 넣느냐 마느냐의 선택은 개인적 선호에 관한 것 같다.


## Globalizing Selectors

마지막으로 남은 것은 코드를 복사하지 않고 *local selector* 파일만을 가지고 *global selectors*를 만드는 방법이다. 동일한 이름을 가진 새로운 함수 세트를 내보내는 것으로 *global selectors*를 만들 수 있는데, 그 유일한 목적은 *state selection*을 한 다음, *local selector*를 작동시키는 것이다. 

```javascript
// store/navigation/selectors.js
export function getActiveScene(state) {
  return state.activeScene
}
```

```javascript
// store/selectors.js

/**
Accumulates all the different selectors
 */
import * as navigationSelectors from './navigation/selectors'
import * as notificationSelectors from './notifications/selectors'
import * as settingsSelectors from './settings/selectors'

const selectors = {}
Object.keys(navigationSelectors).forEach(
funcName => selectors[funcName] = state => navigationSelectors[funcName](state.navigation),
)

Object.keys(notificationSelectors).forEach(
funcName => selectors[funcName] = state => notificationSelectors[funcName](state.notifications),
)

Object.keys(settingsSelectors).forEach(
funcName => selectors[funcName] = state => settingsSelectors[funcName](state.settings),
)

// We want to be able to import like this: "import { name1, name2 } from 'selectors'"
// Below code behaves like "export {...selectors}" because of this relationship:
// var module = {}
// var exports = module.exports = {}
module.exports = selectors
// someComponent.js
import { getActiveScene } from '../store/selectors'
const mapStateToProps = state => ({
activeScene: getActiveScene(state),
})

```

[1]:	http://cmichel.io/
[2]:	http://cmichel.io/redux-selectors-structure/
[3]:	http://www.datchley.name/scoped-selectors-for-redux-modules/
[4]:	https://github.com/gaearon/redux-thunk

[image-1]:	http://cmichel.io/redux-selectors-structure/stateTree.svg
[image-2]:	http://cmichel.io/redux-selectors-structure/reduxFileStructure.svg
[image-3]:	http://cmichel.io/redux-selectors-structure/reduxCircularDependency.svg