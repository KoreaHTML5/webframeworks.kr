---
layout : tutorials
category : tutorials
title : React 컴포넌트에서 로직 추출하기 (2/2)
subcategory : setlayout
summary : React 컴포넌트에서 로직 추출하기에 대해 알아봅니다.
permalink : /tutorials/weplanet/react-extracting-logic2
author : danielcho
tags : javascript 
title\_background\_color : F1F71A
---



> 본 포스팅은 [JS Playground](https://javascriptplayground.com/)의 [Extracting Logic from React Components](https://javascriptplayground.com/blog/2017/07/react-extracting-logic/)를 저자의 허락하에 번역한 글입니다. 오탈자, 오역 등이 있다면 연락부탁드립니다.

  



## 통화 데이터 추출하기 

한 개가 끝났고, 하나 더 남았습니다! 이제 `getCurrencyData` 를 위와 같은 방법으로 꺼내봅시다. 먼저, 저는 `currency-data.js` 을 만들고, 기능을 옮겨올 것입니다.



```
export const getCurrencyData = currency => {
  return {
    GBP: { base: 100, symbol: '£' },
    USD: { base: 100, symbol: '$' },
  }[this.props.currency];
};
```



하지만 잠깐만요! 버그가 있습니다. 그 기능이 `currency` 를 취하지만 실제로는 `this.props.currency` 를 위해 완전히 무시됩니다. 이것은 완전한 우연이지만 비즈니스 로직과 UI 로직이 분리된 값을 보여줍니다. React Component에서는 `this.props` 과  `this.state` 를 참조하기 매우 쉽지만, 기능들이 어떤 값을 사용하는지 추적하기는 어려워집니다. 모듈로 가져 오는 것은 `argument`를 통과시켜야 하므로, API를 명확히하는 데 도움을 주고 기능에 진짜 필요한 데이터가 뭔지 생각하는 데에도 도움을 줍니다. 



맞는 값으로 `getCurrencyData` 를 `call`했는지 확인하여 버그를 고치고, 기능이` this.props.currency` 가 아닌 `currency` argument를 참조하게끔 만들면, 우리는 `Money` 의  `getCurrencyData` delegate을 새로운 기능에 넣을 수 있습니다.



```
...
import { getCurrencyData } from './currency-data'

class Money extends Component {
  ...
  getCurrencyData(currency) {
    return getCurrencyData(currency)
  }

  render() {
    const currency = this.getCurrencyData(this.props.currency)
    ...
  }
}
```



그리고 다시 한번 `yarn test` 는 아무것도 망가지지 않았음을 확인해 줍니다. 이제 `Money` 에서 `getCurrencyData` 를 완전히 지우는 다음 단계를 진행하고, `render` 에서 외부 기능을 `call`할 수 있습니다.



```
render() {
  const currency = getCurrencyData(this.props.currency)
  ...
}
```



이제 `getCurrencyData` 를 위한 somet tests를 써 봅시다:



```
import { getCurrencyData } from './currency-data';

test('for GBP it returns the right data', () => {
  expect(getCurrencyData('GBP')).toEqual({
    base: 100,
    symbol: '£',
  });
});
```



이 튜토리얼을 위해서 – 또한 단순화 된 데이터 때문에 – 이 기능에 대한 테스트를 위해 남겨 두겠지만, 복잡한 상황에서는 요구되어지는 테스트를 전부 작성해야 합니다.  



## Money 컴포넌트 줄이기 

모든 것이 정상적으로 진행된 지금 시점에  `Money` 에 대해 살펴보겠습니다.



```
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { formatAmount } from './format-currency';
import { getCurrencyData } from './currency-data';

class Money extends Component {
  static propTypes = {
    currency: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
  };

  render() {
    const currency = getCurrencyData(this.props.currency);
    if (currency) {
      const { symbol, base } = currency;
      const formatted = formatAmount(this.props.amount, base);

      return (
        <span>
          {symbol}
          {formatted}
        </span>
      );
    } else {
      return <span>{this.props.amount}</span>;
    }
  }
}

export default Money;

```



`Money` 는 이제 한 가지 방법, `render` 만이 구현되었습니다. 이것은 `Money` 를 functional, stateless component (FSC)로 옮길 좋은 기회입니다. FSC가 뭔지, 왜 하는지, 어떻게 하는지 익숙하지 않다면, 이것에 대한 [지난 블로그 포스트](https://javascriptplayground.com/blog/2017/03/functional-stateless-components-react/) 를 읽어 보실 수 있습니다. 저는 이제 `Money` 를 다음과 같이 다시 쓸 수 있습니다:



```
import React from 'react';
import PropTypes from 'prop-types';
import { formatAmount } from './format-currency';
import { getCurrencyData } from './currency-data';

const Money = ({ currency, amount }) => {
  const currencyData = getCurrencyData(currency);
  if (currencyData) {
    const { symbol, base } = currencyData;
    const formatted = formatAmount(amount, base);

    return (
      <span>
        {symbol}
        {formatted}
      </span>
    );
  } else {
    return <span>{amount}</span>;
  }
};

Money.propTypes = {
  currency: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
};

export default Money;

```

저는 FSC를 무척 좋아합니다; 이것은 간단한 구성 요소와 UI로부터의 독립된 로직을 장려합니다. 오늘 이 리팩토링을 통해 `Money` 구성 요소가 이러한 방식으로도 써질 수 있다는 것을 알게되었습니다.



## 결론

콤포넌트를 살펴보고 우리가 추출할 수 있는 독립된 기능을 찾아냄으로써, 우리는 컴포넌트를 단순화하고 어플리케이션의 테스트 범위와 명확성을 크게 높일 수 있습니다. React Component에 임의적 방식을 추가할 때는 두 번 생각해 보기를 권장합니다. `this.props.X` 를 참조하기는 너무 쉽습니다. 

기능들을 그것들 만의 모듈로 가져올 때, 어떤 것들이 필요한지와 기능이 어떻게 작동될 것인지 생각해보게 됩니다. 이것이 코드를 더 쉽게 만들며, 사용된 것들이 어디에 사용되는지 확인하는 것이 쉬워집니다. 이는 비즈니스 로직이 복잡해짐에 따라 UI 구성 요소를 사용하지 않고 테스트 할 수 있음을 의미합니다. 

스스로 코딩해보고 싶다면  [GitHub](https://github.com/javascript-playground/react-refactoring-with-tests)이 도움을 줄 것입니다. 질문이 있다면 해주십시오.