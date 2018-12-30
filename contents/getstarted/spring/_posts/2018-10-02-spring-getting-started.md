---
layout : getstarted
title : java spring
category : getstarted
subcategory : js
summary : java spring 프레임워크에 대해 알아봅니다. 
permalink : /getstarted/spring
title_background_color : AED5E6
title_color : FFFFFF
tags : java spring
author : stevenhong
---

# [spring](http://spring.io/projects/spring-framework)



## 개요 
> 스프링 프레임워크는 그 수 많은 프레임워크 중의 하나로 다양하고 강력한 기능들을 제공하고 있습니다. 많은 공공부문 정보화 작업 시 사용되는 전자정부 표준프레임워크가 이 스프링 프레임워크를 기반으로 하여 만들어져 있습니다. 

###스프링 프레임워크의 특징
* 스프링은 POJO(Plain Old Java Object) 방식의 경량 프레임워크입니다. 
* 스프링은 제어 반전(Ioc : Inversion of controll)을 지원합니다. 사용자가 프레임워크의 코드를 호출하는 것이 아니라 프레임워크가 필요에 따라 사용자의 코드를 호출합니다.
* 스프링은 관점 지향 프로그래밍(AOP : Aspect-Oriented Programming)을 지원합니다. 트랜잭션이나 보안, 필터, 인터셉터 등과 같이 공통적으로 이용하는 부분들을 따로 분리하여 사용 가능합니다. 
* 스프링은 확장성이 매우 높습니다. 다양한 라이브러리들이 이미 스프링에서 지원되고 있고 별도로 분리하기도 용이합니다. 

## 설치
>제일 먼저 JDK 다운로드 설치 후 Java Spring Framework 개발환경으로 Eclipse에서 플러그인으로 STS를 설지 또는 아래 STS 사이트에서 다운받아 설치합니다. 

[JDK 공식 사이트](https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)

[STS 공식 사이트](http://spring.io/tools)  

## Spring Boot 시작하기
> [스프링부트](https://spring.io/projects/spring-boot) 프로젝트는 스프링 프레임워크를 더 빠르고 쉽게 사용할 수 있게 도와주는 툴입니다

####1.프로젝트 생성
 
> `new > Spring Starter Project` 로 프로젝트를 생성합니다. 프로젝트 이름을 입력하고 메이븐 (Maven) 을 이용해서 진행하기 때문에 필요한 라이브러리는 모두 루트 디렉토리에 pom.xml에서 설정하면 됩니다.

#####다음에 라이브러리 다운받습니다.

* Web : 웹 개발 관련 라이브러리 모음
* DevTools : 개발 툴로 서버 자동 재시작 등을 지원

####2. 인덱스 (Index) 페이지 만들기

> `src/main/resources/static` 경로에 `index.html` 을 추가합니다. `index.html` 은 
기본 URL 로 접속 시 접속되는 화면입니다. static 폴더는 사이트의 정적인 파일들을 관리할 때 사용합니다. 


* `src/main/resources/static/index.html`

```
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>index</title>
</head>
<body>
  <h1>INDEX</h1>
</body>
</html>
```

####3. 컨트롤러 (Controller) 만들기
>`com.demo.web` 패키지를 만들어서 HelloController.java 를 생성합니다.
        
* `HelloController.java`

```
@Controller
public class HelloController {

  @RequestMapping("/hello")
  public @ResponseBody String hello() {
    return "Hello, Spring Boot!";
  }
}
```

**컨트롤러는 Dispatcher Servlet 에서 받은 요청에 따라 로직을 처리하는 역할을 합니다. 여기서는 /hello라는 경로로 오는 요청에 "Hello, Spring Boot!"라는 응답을 보냅니다. @ResponseBody 어노테이션을 이용해 String 자체를 응답의 body로 사용해서 보냅니다.**
       
        
####4.실행하기
>따로 서버 구성할 필요 없이 HelloSpringApplication.java 파일을 오른쪽 클릭해서 Run as.. > Spring Boot App 으로 실행합니다.
        
* `HelloSpringApplication.java`

```
@SpringBootApplication

public class HelloSpringApplication {

  public static void main(String[] args) {
    SpringApplication.run(HelloSpringApplication.class, args);
  }
}
```

**기본 포트는 8080 입니다. 포트 충돌 에러 시 application.properties 에서 8080 대신 다른 포트로 수정합시다.**

       
    
* http://localhost:8080/로 접속해보면 index.html 화면이 출력되며, http://localhost:8080/hello로 접속하면 ‘Hello, Spring Boot!’ 를 확인할 수 있습니다.


