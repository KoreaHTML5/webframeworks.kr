---
layout : tutorials
category : tutorials
title : 파이썬과 스크래피를 통해 이미지 크롤러 만들기 (2/2)
subcategory : setlayout
summary : 파이썬과 스크래피를 통해 이미지 크롤러 만들기에 대해 알아봅니다.
permalink : /tutorials/weplanet/Building-an-image-crawler-using-Python-and-Scrapy2
author : danielcho
tags : python
title\_background\_color : F1F71A
---



> 본 포스팅은 [Ayush Gupta](https://ayushgp.github.io/)의 [Building an image crawler using Python and Scrapy](https://ayushgp.github.io/Building-an-image-crawler-using-Python-and-Scrapy/)를 저자의 허락하에 번역한 글입니다. 오탈자, 오역 등이 있다면 연락부탁드립니다.

  



## 웹사이트 구조 살펴보기 

이제 우리가 원했던 페이지만을 가져오고 있습니다. 우리는 이미지 URL과 연관된 태그를 알아내고 싶습니다. 그러기 위해, 우리는 이미지를 위한 HTML 페이지가 어떻게 생겼는지 살펴보아야 합니다. Pexels의 [image page](https://www.pexels.com/photo/cosmos-dark-galaxy-hd-wallpaper-173383/) 페이지로 이동하십시오. 이제 우측 클릭을 한 후 Inspect Element 클릭하십시오. 



![](https://cloud.githubusercontent.com/assets/7992943/25837283/b5230794-34aa-11e7-84c1-4c14a2b50634.jpg)



`img` 태그가 `image-section__image` 클래스를 가지고 있는 것을 볼 수 있습니다. 이 정보를 태그를 추출하는 데 사용할 것입니다. 이 이미지의 URL은 `src` 속성에 있으며, 우리가 필요한 태그는 `alt` 속성에 있습니다. 이제 이들을 추출해 콘솔에 출력하기 위해 `PexelsScraper` 클래스를 수정해 봅시다. 



이것을 위해 우리는 src와 alt 속성을 추출해 두 개의 regex 패턴을 만들 것입니다. 그 후, 우리는 `image-section__image` 클래스로 `img` 태그를 추출하기 위해 `Selector` 클래스의 `css`  방법을 사용할 것입니다. 

다음 변수를 PexelsScraper에 추가하십시오. 

```
src_extractor = re.compile('src="([^"]*)"')
tags_extractor = re.compile('alt="([^"]*)"')
```



이제 필요한 URL 및 태그를 출력하기 위해 `parse` 방법을 수정합니다. 

```
def parse(self, response):
    body = Selector(text=response.body)
    images = body.css('img.image-section__image').extract()
    
    # body.css().extract() returns a list which might be empty
    for image in images:
        img_url = PexelsScraper.src_extractor.findall(image)[0]
        tags = [tag.replace(',', '').lower() for tag in PexelsScraper.tags_extractor.findall(image)[0].split(' ')]
        print img_url, tags

    link_extractor = LinkExtractor(allow=PexelsScraper.url_matcher)
    next_links = [link.url for link in link_extractor.extract_links(response) if not self.is_extracted(link.url)]
    
    # Crawl the filtered links
    for link in next_links:
        yield scrapy.Request(link, self.parse)

```

body.css(‘img.image-section__image’).extract() __콜은 리스트 안의 모든 `image-section__image`  클래스 `img` 태그를 보내줄 것입니다. 

이제 spider (스파이더)를 구동하고 테스트해 보십시오! 기기를 열고 다음을 입력하십시오.

```
$ scrapy crawl pexels

```



다음과 같은 결과물을 얻을 것입니다.

```
https://images.pexels.com/photos/132894/pexels-photo-132894.jpeg?w=940&amp;h=650&amp;auto=compress&amp;cs=tinysrgb [u'red', u'and', u'grey', u'fish', u'on', u'ice']
https://images.pexels.com/photos/343812/pexels-photo-343812.jpeg?w=940&amp;h=650&amp;auto=compress&amp;cs=tinysrgb [u'cuisine', u'delicious', u'diet']
https://images.pexels.com/photos/274595/pexels-photo-274595.jpeg?w=940&amp;h=650&amp;auto=compress&amp;cs=tinysrgb [u'adult', u'beautiful', u'beauty']
https://images.pexels.com/photos/230824/pexels-photo-230824.jpeg?w=940&amp;h=650&amp;auto=compress&amp;cs=tinysrgb [u'orange', u'squash', u'beside', u'stainless', u'steel', u'bowl']

```





## Wrapping up

우리는 약 50줄의 코드로 웹사이트의 이미지를 스크랩하는 웹 크롤러를 만들었습니다. 이것은 웹 크롤러를 사용해 만들어낼 수 있는 것들 중 아주 작은 일부입니다. 예를 들어 제품 가격 비교 웹사이트 같이, 웹 스크래핑 기반으로 운영되는 비즈니스들이 있습니다. 이제 어떻게 크롤러를 구축하는지에 대한 기본 지식을 얻었으므로, 직접 한번 나만의 크롤러를 만들어 보십시오!



