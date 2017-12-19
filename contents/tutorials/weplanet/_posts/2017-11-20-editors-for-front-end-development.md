---
layout : tutorials
category : tutorials
title : Moving away from Vim for front-end development
subcategory : setlayout
summary : Moving away from Vim for front-end development에 대해 알아봅니다.
permalink : /tutorials/weplanet/editors-for-front-end-development
author : danielcho
tags : javascript 
title\_background\_color : F1F71A
---



> 본 포스팅은 [JS Playground](https://javascriptplayground.com/)의 [Moving away from Vim for front-end development](https://javascriptplayground.com/blog/2017/09/editors-for-front-end-development/)를 저자의 허락하에 번역한 글입니다. 오탈자, 오역 등이 있다면 연락부탁드립니다.

  

저는 6년동안 꾸준히 Vim 사용자였습니다. 제 광범위한 [dotfiles](https://github.com/javascript-playground/styled-components-screencast) 저장소와 (지금은 매우 뒤떨어진) [TIL Vim](https://github.com/styled-components/styled-components) 블로그는 제가 원하는 방식으로 설정하기 위해 많은 시간 동안 Vim 을 배우고, 사용하고, 조정하는 데 할애했다는 것을 잘 보여줍니다. 



그러나, 제가 점점 프론트엔드 개발쪽으로 옮겨감에 따라, 다른 개발자들에게 유혹을 받기 시작합니다. 단순한 이유는 VS CODE 및 Atom과 같은 다른 Editor들처럼 프론트엔드 커뮤니티는 Vim만큼 활발하지 않았기 때문입니다. Vim을 사용하는 프론트엔드 개발자는 더 적었고, 주변의 플러그인 또는 생태계가 다른 Editor들이 가진 만큼 풍부하지 않은 경우가 있었습니다. 이를 위해, 나는 다른 Editor들을 시험해보기 시작했습니다. 



나는 몇 달 전 VSCode를 시도해 보았고, 내가 원했던 것처럼 생각되지는 않았습니다. (물론 한번 더 시도해 볼 의향이 있지만) 그래서 지금, 저는 몇 주간 [Atom](https://atom.io/) 을 시도해 보기로 결정했습니다. 만약 당신이 Atom 사용자라면, 추천되는 세팅, 플러그인 등을 들어보고 싶습니다. 지금까지 제가 선택한 것들은 다음과 같습니다. 

- Vim 키바인딩이 없어도 텍스트를 편집할 것이기 때문에, [vim-mode-plus](https://github.com/t9md/atom-vim-mode-plus)는 제가 처음으로 설치한 플러그인입니다. 지금까지 보면 견고한 것 같습니다. 제가 할 수 없는 것은 아직 찾지 못했습니다.
- 저는 [sync-settings](https://atom.io/packages/sync-settings) 또한 설정하여 작업용 컴퓨터와 개인용 컴퓨터를 동기화시켰습니다. 제 dotfile repo를 통해 직접 할 수 있으면 좋겠으나 (할 수 있을지도 모릅니다) 지금은 이것이 가장 매끄럽게 설치하는 법입니다. 
- [language-babel](https://atom.io/packages/language-babel) 은 머리를 쓸 필요가 없는 것처럼 보입니다 – Flow와 다량의 JSX 기능을 포함하여 다양한 언어에 대한 구문 강조 표시가 추가되며 개선되었습니다. 
- [git plus](https://atom.io/packages/git-plus)를 사용하면 Atom 내 – [split-diff](https://atom.io/packages/split-diff) 로 파일 변화를 쉽게 확인하기 위하여 - `git` 작업을 쉽게 수행할 수 있게 만들어주었습니다.



그리고 설치한 많은 것들이 있습니다. Prettier, Flow and ESLint와 코드를 linting해주는 기능들을 포함하여 말입니다.

저는 또 [handy tip on Coderwall](https://coderwall.com/p/h_zpfa/hide-scrollbars-in-atom) 에서 스크롤바를 완전히 숨기고, `Gutters`에서 모든 `linting` 출력을 지우기 위해 이 CSS를 사용했습니다. (저는 더 좁은 `Gutters`와  `linting` 도구를 선호합니다. 이는 주로 의심되는 코드에 줄을 긋는데 사용됩니다.)

```
.gutter[gutter-name='linter-ui-default'] {
  display: none;
}
```



저의 주된 어려움은 터미널을 자주 사용하지 않는데 익숙해지는 것이었습니다. 보통은 터미널 안에서 Vim을 구동하여 백그라운드에서 명령을 실행합니다. 그러나, 대부분의 순간 `yarn run dev` 를 실행하고 그대로 두었으니, 시간이 지남에 따라 적응해야 한다고 생각합니다. Atom을 더 연구하고 특징을 배우면 몇 주 안에 블로그에 다시 게시하겠습니다. 하지만 그 동안 추천할 사항이 있으면 알려주세요! 