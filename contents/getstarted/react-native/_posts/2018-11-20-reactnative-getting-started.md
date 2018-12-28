---
layout : getstarted
title : react native
category : getstarted
subcategory : js
summary : react native는 효과적인 모바일 앱 개발을 지원하는 프레임워크입니다. 
permalink : /getstarted/react-native
title_background_color : AED5E6
title_color : FFFFFF
tags : react-native javascript framework
author : danielcho
---

# [react native](https://facebook.github.io/react-native/)



## 개요 

리엑트 네이티브는 Javascript 만을 사용하여 모바일 앱을 개발할 수 있는 프레임워크입니다. React와 동일한 디자인을 통해 빠르고 편리하게 모바일 앱을 개발할 수 있습니다. 



```
import React, { Component } from 'react';
import { Text, View } from 'react-native';

class WhyReactNativeIsSoGreat extends Component {
  render() {
    return (
      <View>
        <Text>
          If you like React on the web, you'll like React Native.
        </Text>
        <Text>
          You just use native components like 'View' and 'Text',
          instead of web components like 'div' and 'span'.
        </Text>
      </View>
    );
  }
}
```



리엑트 네이티브의 가장 큰 장점은 웹앱 또는 하이브리드앱이 아니라 네이티브앱을 만들어낼 수 있다는 점입니다. 리엑트 네이티브는 iOS, Android 네이티브 UI 블럭을 그대로 사용하기 때문에 기존의 웹 기반 하이브리드 앱과는 차별화된 결과물을 만들어낼 수 있습니다. 



```
import React, { Component } from 'react';
import { Image, ScrollView, Text } from 'react-native';

class AwkwardScrollingImageWithText extends Component {
  render() {
    return (
      <ScrollView>
        <Image
          source={{uri: 'https://i.chzbgr.com/full/7345954048/h7E2C65F9/'}}
          style={{width: 320, height:180}}
        />
        <Text>
          On iOS, a React Native ScrollView uses a native UIScrollView.
          On Android, it uses a native ScrollView.

          On iOS, a React Native Image uses a native UIImageView.
          On Android, it uses a native ImageView.

          React Native wraps the fundamental native components, giving you
          the performance of a native app, plus the clean design of React.
        </Text>
      </ScrollView>
    );
  }
}
```



또한 Objective-C, Java, Swift와 매우 자연스럽게 통합됩니다. 리액트 네이티브로 작성된 앱에 네이티브 코드를 삽입함으로서 필요한만큼 네이티브 기능을 구현할 수 있습니다. 현재 Facebook 앱이 그러하듯, 매우 유연한 개발이 가능합니다. 



```
import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { TheGreatestComponentInTheWorld } from './your-native-code';

class SomethingFast extends Component {
  render() {
    return (
      <View>
        <TheGreatestComponentInTheWorld />
        <Text>
          TheGreatestComponentInTheWorld could use native Objective-C,
          Java, or Swift - the product development process is the same.
        </Text>
      </View>
    );
  }
}
```





## 참고 자료

[공식 가이드](https://facebook.github.io/react-native/docs/getting-started)



## 튜토리얼

[코드랩 강의자료](https://github.com/KoreaHTML5/CodeLab-React-Native)