---
layout : tutorials
category : tutorials
title : React 컴포넌트에서 로직 추출하기 (1/2)
subcategory : setlayout
summary : React 컴포넌트에서 로직 추출하기에 대해 알아봅니다.
permalink : /tutorials/weplanet/react-extracting-logic1
author : danielcho
tags : javascript 
title\_background\_color : F1F71A
---



> 본 포스팅은 [JS Playground](https://javascriptplayground.com/)의 [Extracting Logic from React Components](https://javascriptplayground.com/blog/2017/07/react-extracting-logic/)를 저자의 허락하에 번역한 글입니다. 오탈자, 오역 등이 있다면 연락부탁드립니다.

  

이전 [screencast](https://javascriptplayground.com/blog/2017/06/refactoring-react-tests/)에서 우리는 React Component에 대해 다루었고, 보다 운영하고, 사용하고, 테스트하기 쉽게 두개의 컴포넌트로 나누어보았습니다. 앞선 스크린케스트를 먼저 보는게 좋을 수 있지만, 이 블로그 포스트를 읽기 전에 반드시 볼 필요는 없습니다. 모든 코드는 [GitHub](https://github.com/javascript-playground/react-refactoring-with-tests) 에서 찾아볼 수 있습니다. 





## 시작점

먼저  `Money` 컴포넌트를 확인해봅시다. 여기에는 일부 값과 포맷이 포함되어 있습니다. 

```
class Money extends Component {
  static propTypes = {
    currency: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
  };

  getCurrencyData(currency) {
    return {
      GBP: { base: 100, symbol: '£' },
      USD: { base: 100, symbol: '$' },
    }[this.props.currency];
  }

  formatAmount(amount, base) {
    return parseFloat(amount / base).toFixed(2);
  }

  render() {
    const currency = this.getCurrencyData();
    if (currency) {
      const { symbol, base } = currency;
      const formatted = this.formatAmount(this.props.amount, base);

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

```



위의 코드에는 독립된 클래스로 추출할 때 고려해야할 두 가지 기능이 들어있습니다.

- `getCurrencyData` 는 출력 데이터에 쓰여진 `currency`에 대한 정보를 가져옵니다. 실제로 이것은 훨씬 크고 더 많은 언어를 지원할 것입니다. 따라서 이는 별도의 모듈로 사용하기 좋은 대상입니다.
- `formatAmount` 는 `amount`와 `base` 를 가져와 `formatted value`로 만듭니다. 물론, 여기에 포함된 로직은 이해하기 어렵지 않지만, 어플리케이션이 더 많은 언어를 지원하도록 확장되면 매우 복잡해질 것입니다.

제가 이것들을 추출하고 싶어하는 이유는 완벽히 격리된 상태에서 테스트하기 위해서 입니다. 지금 `formatted`된 `amount`를 테스트하기 위해서는 React Component 를 만들어야 하지만, 그냥 이 기능만을 `call`하고 결과를 확인할 수 있어야 합니다. 





## 금액 포맷 추출하기

지금 우리의 `Money` 구성 요소에 있는 `formatAmount` 기능을 담을 `src/format-currency.js` 를 만들어 봅시다.

```
export const formatAmount = (amount, base) => {
  return parseFloat(amount / base).toFixed(2);
};
```



지금 그 기능을 완전히 새로운 파일로 옮기고, 시작 부분으로 ` export`를 추가했습니다. 이것을 테스트하기 위해, `Money` 의 `formatAmount` 의 body를 대체하여 `format-currency.js` 모듈에 새로운 기능을 `call`하도록 했습니다. 



```
import { formatAmount } from './format-currency'

class Money extends Component {
  ...
  formatAmount(amount, base) {
    return formatAmount(amount, base)
  }
  ...
}
```



 `Money` 에 아직 정의된 `formatAmount` 를 아직 그대로 둔 것을 확인해보세요. 이렇게 코드를 분리할 때 작은 단계로 실시해야 합니다. 이렇게 하면 실수로 코드를 망가트릴 가능성이 줄어들고 만약 잘못된 부분이 있으면 쉽게 추적할 수 있습니다. 



이러한 구성 요소들이 잘 테스트 되었으니, 이제 모든 사항이 제대로 되는지 확인하기 위해 `yarn test` 테스트를 실행합니다.



```
// inside Money component
render() {
  const currency = this.getCurrencyData()

  if (currency) {
    const { symbol, base } = currency
    // this used to say this.formatAmount
    const formatted = formatAmount(this.props.amount, base)

    return (
      <span>{symbol}{formatted}</span>
    )
  } else {
    return <span>{this.props.amount}</span>
  }
}
```



`yarn test` 는 제대로 동작한다고 확인해줍니다. 이제 우리의 오리지널 테스트가 끝났으니, 격리하여 `formatAmount`를 확인할 새로운 테스트를 추가할 수 있습니다. 항상 이런 식으로 하는 것이 중요합니다. 새로운 테스트를 추가하기 전에 기존 테스트를 확인하세요.



```
import { formatAmount } from './format-currency';

test('it formats the amount to 2 dp', () => {
  expect(formatAmount(2000, 100)).toEqual('20.00');
});

test('respects the base', () => {
  expect(formatAmount(2000, 10)).toEqual('200.00');
});

test('it deals with decimal places correctly', () => {
  expect(formatAmount(2050, 100)).toEqual('20.50');
});

```



이제 우리의 React Component에 아예 붙어있지 않은 `formatting amount`을 위한 철저한 테스트를 준비하고 있습니다. 물론, `formatAmount` 기능이 지금은 매우 쉽지만, 기능이 커지더라도 React Component를 실행하지 않고 매우 쉽게 테스트할 수 있습니다. 



