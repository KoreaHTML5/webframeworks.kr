---
layout : tutorials
category : tutorials
title : 파이썬과 스크래피를 통해 이미지 크롤러 만들기 (1/2)
subcategory : setlayout
summary : 파이썬과 스크래피를 통해 이미지 크롤러 만들기에 대해 알아봅니다.
permalink : /tutorials/weplanet/Building-an-image-crawler-using-Python-and-Scrapy1
author : danielcho
tags : python
title\_background\_color : F1F71A
---



> 본 포스팅은 [Ayush Gupta](https://ayushgp.github.io/)의 [Building an image crawler using Python and Scrapy](https://ayushgp.github.io/Building-an-image-crawler-using-Python-and-Scrapy/)를 저자의 허락하에 번역한 글입니다. 오탈자, 오역 등이 있다면 연락부탁드립니다.

  

API를 제공하지 않는 웹사이트에서 데이터를 뽑아낼 필요가 있었던적 있습니까? HTML에서 바로 데이터를 바로 뽑아낼 수 있습니다! 이 튜토리얼은 API를 사용하지 않고도 제 3자 웹사이트에서 원하는 데이터를 가져오는 방법을 알려줍니다. 

Scrapy는 Python으로 작성된 오픈 소스 웹 스크래핑 및 크롤링 시스템입니다. 이제 Scrapy를 이용해서 웹사이트를 크롤 및 스크랩하는 방법에 대해 알아보려고 합니다.





## 전제 사항 

Python을 이용해서 코드를 쓰는 것에 익숙해야 합니다. Regular Expressions (Regex)를 사용하는 법 또한 알고 있어야 합니다. Regex를 배울 수 있는 훌륭한 튜토리얼은 [Regexone](https://regexone.com/)에서 찾을 수 있습니다. 





## 설치

다음과 같은 도구가 필요합니다.

- [Python 2.7](https://www.python.org/download/releases/2.7/)
- [Scrapy](https://doc.scrapy.org/en/latest/intro/install.html)




### 윈도우 사용자 

Python과 Scrapy를 모두 설치했다면,` PATH` environment 변수 안에 Python과 Scrapy가 있는지 확인하십시오. 여기에 Python과 Scrapy 에 대한 [자세한 설치 안내서](https://scraper24x7.wordpress.com/2016/03/19/how-to-install-scrapy-in-windows/)가 있습니다. 





## 프로젝트 생성하기

위 도구들을 설치했다면, 크롤러를 제작할 준비가 되어 있는 것입니다. 터미널을 열고 다음을 입력하십시오



```
$ scrapy startproject imagecrawler
```



이렇게 하면 다음과 같은 구조의 디렉토리가 생성됩니다. 

```
imagecrawler/
    scrapy.cfg            # deploy configuration file
    imagecrawler/             # project's Python module, you'll import your code from here
        __init__.py
        items.py          # project items definition file
        pipelines.py      # project pipelines file
        settings.py       # project settings file
        spiders/          # a directory where you'll later put your spiders
            __init__.py

```





## 첫번째 Spider 생성하기

Spiders(스파이더)는 사용자가 정의한 클래스이며, Scrapy가 웹사이트 (또는 웹사이트 그룹)에서 정보를 스크랩하는데 사용됩니다. 이들은 scrappy.Spider로 subclass되고, 초기 요청을 정의하며, 선택적으로는 페이지의 링크를 어떻게 따르는지, 그리고 정보를 추출하기 위해 응답된 데이터를 parse하는지 알아야 합니다. 

다음과 같은 내용으로 스파이더 (Spiders) 파일에 pexels_scraper.py라는 파일을 새로 만드십시오. 

```
import scrapy

class PexelsScraper(scrapy.Spider):
    name = "pexels"
    
    def start_requests(self):
        url = "https://www.pexels.com/"
        yield scrapy.Request(url, self.parse)

    def parse(self, response):
        print response.url, response.body
```



이제 위의 코드에서 문자들이 무엇을 의미하는지 알아보겠습니다.

- `name`: Spider를 정의합니다. Crawling (크롤링)을 시작하기 위해서 이 이름을 쓸 것입니다.
- `start_requests()`: 실행될 요청의 반복 구간을 가져옵니다.
- `parse()`: 응답값을 parse하고, 스크랩한 데이터를 추출하고, 새로운 URL을 찾고, 새로운 Request를 생성합니다.



우리가 위에 쓴 코드를 실행하기 위해, 기기를 열고 IMAGECRAWLER 디렉토리로 이동하여 다음 명령을 입력하십시오.

```
$ scrapy crawl pexels
```



이렇게 하면 크롤러가 시작되고, URL과 응답 본문이 보여집니다. 그 다음 크롤러가 멈춥니다. 이는 우리가 아직 페이지간 링크를 어떻게 이동해야하는지 구체화하지 않았기 때문입니다. 이 방법에 대해서는 다음 섹션에서 살펴 보겠습니다. 





## 재귀적으로 웹사이트 크롤링하기 

이제 프로젝트를 설치했으니, 우리가 스크랩할 웹사이트를 한번 봅시다. 우리는 고품질의 무료 사진을 제공하는 [Pexels](https://www.pexels.com/)라는 웹사이트를 스크랩할 것입니다. 사이트는 API가 있지만, 시간당 200 요청이라는 제한을 가지고 있습니다. 우리는 이미지, 이미지를 찾은 페이지의 URL, 그리고 이미지와 연관된 태그를 크롤링해볼 것입니다. 



Pexels.com으로 접속해서 이미지를 열어 봅시다. 먼저 이미지당 Pexels에서 사용하는 URL 구조를 살펴 보겠습니다. 이것이 그 구조입니다. 

```
https://www.pexels.com/photo/cosmos-dark-galaxy-hd-wallpaper-173383/
```



사진을 가지고 있는 모든 링크는 다음을 공통으로 가지고 있습니다.

-  `https://www.pexels.com/photos/` 로 시작합니다.
- 링크 뒤에 `173383` 라는 ID를 가지고 있습니다.



우리가 방문하는 모든 페이지의 링크를 추출해보겠습니다. 그 다음 지정된 접두어와 일치하지 않는 모든 링크를 필터하겠습니다. 그리고 우리가 같은 페이지를 계속해서 크롤링하지 않기 위해서 우리가 방문한 페이지의 ID를 이용합니다. 



위의 업무를 수행하기 위해 필요한 첫 번째 세 가지 모듈인 `re`, `LinkExtractor` 그리고 `Selector`를 불러옵니다. 그리고 우리는 공통 URL과 일치하는 regex url matcher가 필요합니다. URL에서 이미지 ID를 추출해낼 기능 또한 필요합니다. PexelScaper 클래스를 다음과 같이 수정하십시오.

```
import scrapy
import re
from scrapy.linkextractor import LinkExtractor
from scrapy.selector import Selector

class PexelsScraper(scrapy.Spider):
    name = "pexels"
    
    # Define the regex we'll need to filter the returned links
    url_matcher = re.compile('^https:\/\/www\.pexels\.com\/photo\/')
    
    # Create a set that'll keep track of ids we've crawled
    crawled_ids = set()
    
    def start_requests(self):
        url = "https://www.pexels.com/"
        yield scrapy.Request(url, self.parse)

    def parse(self, response):
        body = Selector(text=response.body)
        link_extractor = LinkExtractor(allow=PexelsScraper.url_matcher)
        next_links = [link.url for link in link_extractor.extract_links(response) if not self.is_extracted(link.url)]
        
        # Crawl the filtered links
        for link in next_links:
            yield scrapy.Request(link, self.parse)
            
    def is_extracted(self, url):
        # Image urls are of type: https://www.pexels.com/photo/asphalt-blur-clouds-dawn-392010/
        id = int(url.split('/')[-2].split('-')[-1])
        if id not in PexelsScraper.crawled_ids:
            PexelsScraper.crawled_ids.add(id)
            return False
        return True

```



