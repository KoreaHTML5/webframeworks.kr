---
layout : tutorials
category : tutorials
title : letsencript와 docker로 ssl 설치
subcategory : setlayout
summary : letsencript와 docker로 ssl을 손쉽게 설치해 봅시다.
permalink : /tutorials/weplanet/docker-compose-ssl
author : marcushong
tags : docker ssl
title\_background\_color : F1F71A
---

### SSL
* 최신 브라우저에서는 ssl 인증서가 설치되지 않은 http 페이지는 경고창이 나오는 등, 최근 들어서 SSL은 필수가 되어가고 있다.
* let's encrypt 와 같은 무료 ssl 서비스가 있기 때문에 진입 장벽이 낮아지고 있다.
* 무료 ssl, 또는 유료 ssl이라고 해도 유효기간이 있어 기간이 만료되면 갱신을 해주어야 한다.
* haproxy, nginx등과 같은 서비스에 직접 연동을 해야한다.

### docker + ssl
* jwilder/nginx-proxy, jrcs/letsencrypt-nginx-proxy-companion 조합을 사용하면 
어플리케이션에 nginx를 손쉽게 연동할 수 있다.

### docker-compose.yml
* VIRTUAL_HOST: jwilder/nginx-proxy 이미지는 docker-gen이라는 컨테이너를 사용해서 새로운 컨테이너가 추가 되었을 때,
VIRTUAL_HOST가 있을 경우에 자동으로 nginx에 해당 컨테이너와 도메인을 연결시킨다.

* VIRTUAL_PORT: 어플리케이션에서 expose한 포트를 연결시킨다. 

* LETSENCRYPT_HOST: jrcs/letsencrypt-nginx-proxy-companion는 LETSENCRYPT_HOST가 추가 되었을 경우 let's encrypt로 인증서 요청을
보낸 후 인증서를 저장한다. 또한 nginx에 인증서를 연동한다. 매 시간마다 인증서 갱신 주기를 확인하므로 유효기간 체크를 할 필요가 없다.

* LETSENCRYPT_EMAIL: 인증서에 이슈가 있을 경우 알림 메세지를 받을 이메일 주소를 입력한다.

```yaml
version: '3.6'
services:
  api:
    image: image_url:latest
    restart: always
    environment:
      - VIRTUAL_HOST=www.example.com
      - VIRTUAL_PORT=3000
      - LETSENCRYPT_HOST=www.example.com
      - LETSENCRYPT_EMAIL=user@email.com
      - NODE_ENV=production
    networks:
      - nginx-proxy

  nginx-proxy:
    image: jwilder/nginx-proxy
    ports:
      - 80:80
      - 443:443
    restart: always
    volumes:
      - /nginx/certs:/etc/nginx/certs
      - /nginx/vhost.d:/etc/nginx/vhost.d
      - /nginx/html:/usr/share/nginx/html
      - /var/run/docker.sock:/tmp/docker.sock:ro
    labels:
      - com.github.jrcs.letsencrypt_nginx_proxy_companion.nginx_proxy
    networks:
      - nginx-proxy

  letsencrypt-nginx-proxy:
    image: jrcs/letsencrypt-nginx-proxy-companion
    restart: always
    volumes:
      - /nginx/certs:/etc/nginx/certs
      - /nginx/vhost.d:/etc/nginx/vhost.d
      - /nginx/html:/usr/share/nginx/html
      - /var/run/docker.sock:/var/run/docker.sock:ro
    networks:
      - nginx-proxy

networks:
  nginx-proxy:
    name: nginx-proxy
``` 

### 결론
복잡한 nginx설정이 필요없이 간단하게 docker-compose up 만 하면 인증서 설정이 완료된다.
ssl 설정이 복잡해 도입이 꺼져진다면 docker로 해보는 것은 어떨까?
