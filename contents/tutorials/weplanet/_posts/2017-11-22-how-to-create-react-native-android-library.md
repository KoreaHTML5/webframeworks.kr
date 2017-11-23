---
layout : tutorials
category : tutorials
title : React Native 안드로이드 라이브러리 만드는 법
subcategory : setlayout
summary : React Native 안드로이드 라이브러리 만드는 방법에 대해 알아봅니다. 
permalink : /tutorials/weplanet/react-native-android-library
author : danielcho
tags : react native
title\_background\_color : F1F71A
---

> 본 포스팅은 [Christoph Michel][1] 의 [How to create a React Native Android Library][2]를 저자의 허락하에 번역한 글입니다. 오탈자, 오역 등이 있다면 연락부탁드립니다.

때때로 표준 **React Native** 컴포넌트로 해결할 수 없는 기능을 구현하기 위해 커스텀 *native* 모듈을 만들어야 한다. 필자는 최근 이런 상황을 겪었다. 참고로 안드로이드 개발 경험이 없다면 이 과정을 시작하는것은 어려울 수도 있다. 이 튜토리얼은 안드로이드 개발 경험이 있는 개발자를 대상으로 하며, **React Native Android Library**를 어떻게 만드는지를 보여주려고 한다.

우선, 당신의 React Native 앱에서 Java와 Android SDK를 사용하는 데는 2가지 방법이 있다. 기존 앱의 `android/app/src/main/` 폴더에 **Java classes** 를 추가하고 `MainActivity/MainApplication`에서 사용한다.
  
두 번째 방법은 NPM `react-native packages` 가 동작하는 것과 같은 방식으로 Android Library 를 만드는 것이다. 장점은 명확하다. 즉, 재활용이 가능하다는 점이다. 우리는 이 글에서 이 접근법에 집중하려고 한다.


## React Native 안드로이드 라이브러리 생성하기

[React Native documentation][3]가 JavaScript와 Android SDK사이의 인터렉션에 대해 설명하고 있지만, 어떤 파일이 라이브러리에 필요한지, *gradle*을 사용하는 빌드 프로세스가 어떻게 작동하는지는 설명하지 않는다. 그리고 **Reactive Native codebase**를 에러없이 *gradle*과 Android Studio에 연결하기 위해서는 몇 가지 추가할 사항들이 있다.

가장 쉬운 방법은 기존의 작은 프로젝트를 사용하는 것이다. 필자는 이 과정을 시작하기 위해서 [Android Library Boilerplate][4]을 만들었다. 이것은 두가지 클래스를 필요로 하며 (패키지와 모듈) 그리고 [React Native Tutorial][5]에서 **Toast** 기능을 실행한다. 어떻게 설치하는 지에 대한 설명은 다음과 같다:


### 시작하기

1. 프로젝트를 Clone한다.
2. 다음을 수행하여 프로젝트 이름을 변경한다: 
	- `package.json`에서 작성자와 이름을 수정한다. 
	- Java Package 이름(com.domain.package)을 다음과 같이 변경한다: 
		1. `android/src/main/AndroidManifest.xml` 에서 수정한다. 
		2. Package 이름과 일치하도록 `android/src/main/java`에서 시작하는 폴더들의 이름을 변경한다.
		3.  `android/src/main//java/package/path` 경로에 있는, *Module.java*와 *Package.java* 파일 맨 위에 위치한 패키지 `io.cmichel.boilerplate`를 서로 매칭시킨다.
	- `index.android.js` 에 있는 모듈의 이름을 수정한다. 

```javascript
@Override
public String getName() {
return "Boilerplate";
}
```

## 주요 프로젝트에 라이브러리로 설치하기

당신은 이제 이것을 당신의 주요 React Native 앱에 설치하고 제대로 작동하는지 Toast 기능을 테스트한다. 이를 위해서 당신은 다른 React Native Library와 같은 방법으로 설치해야 한다. 이것을 하는 방법은 여러 가지가 있는데 다음은 필자가 하는 방법이다:

1. GitHub에 Push한다. 
2. npm을 통해 설치한다.

		npm install --save git+https://github.com/MrToph/react-native-android-library-boilerplate.git

3. 라이브러리를 연결한다:
	- 다음을 *android/settings.gradle*에 추가한다. 

		include ':react-native-android-library-boilerplate'
		project(':react-native-android-library-boilerplate').projectDir = new 

- 다음을 *android/app/build.gradle*에 추가한다.

		...
		dependencies {
		...
		compile project(':react-native-android-library-boilerplate')
		}

- 다음을 *android/app/src/main/java/ * */MainApplication.java*에 추가한다.

	```javascript
	package com.motivation;

	import io.cmichel.boilerplate.Package;  // add this for react-native-android-library-boilerplate

	public class MainApplication extends Application implements ReactApplication {

	@Override
	protected List<ReactPackage> getPackages() {
	return Arrays.<ReactPackage>asList(
	new MainReactPackage(),
	new Package()     // add this for react-native-android-library-boilerplate
	);
	}
	}
	```


# 테스트

연결이 작동하는 지를 시험하기 위해서는 라이브러리를 불러와서 라이브러리의 Toast 기능을 사용해보면 알 수 있다: 당신의 라이브러리의 package.json 에 정의된 이름으로 불러오거나 /요구하면 된다. 

```javascript
import Boilerplate from 'react-native-android-library-boilerplate'
Boilerplate.show('Boilerplate runs fine', Boilerplate.LONG)
```


# 개발
개발을 목적으로 작업할 때는 node\_modules 폴더에 설치된 사본애 직접 개발한다. 계속 GitHub에서 *push*, *pull*하는 것을 피하기 위해서이다. 약간 머리 아픈 것 같아 보이지만, 실제로 굉장히 효과적이다. 퍼블리싱하고 싶다면, *.java* 소스 파일을 GitHub로 복사하면 된다. 그리고 Android Studio로 **react native library**를 불러와서 사용하면, Android Studio의 *AutoComplete*와 *AutoImport* 기능을 활용할 수 있다:
1. Android Studio 를 실행하여 *File -\> New -\> Import Project*를 선택하고, 라이브러리의 Android(!) 폴더를 선택한다.
2. 만약 *Do you want to use the gradle wrapper* 문구가 보인다면 ‘네’ 한다 
3. 만약 *Plugin with id 'android-library' not found* 오류가 난다면, 당신은 SDK Manager를 통해서 *android support repository* 를 설치해야 한다. 

당신의 *gradle* 설정에 따라 gradle 버전 오류가 발생할 수 있다. *a gradle version: Please fix the project's Gradle settings*. 이 경우 *Fix Gradle Error*를 선택하고 *re-import project*하면 정상적으로 동작한다. 

만약 당신이 Java에서 무언가를 잘못해서 당신의 앱에 문제가 발생하였고, 그게 어디에서 잘못 되었는지를 모른다면, `adb logcat \> debug.log` 을 실행하여 *error stacktrace*를 확인할 수 있다. 

[1]:	http://cmichel.io/
[2]:	http://cmichel.io/how-to-create-react-native-android-library/
[3]:	http://facebook.github.io/react-native/docs/native-modules-android.html
[4]:	https://github.com/MrToph/react-native-android-library-boilerplate
[5]:	http://facebook.github.io/react-native/docs/native-modules-android.html