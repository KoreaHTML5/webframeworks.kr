---
layout : tutorials
category : tutorials
title : portainer를 사용해 docker 를 GUI로 관리해봅시다.
subcategory : setlayout
summary : docker를 portainer를 사용해 원격 docker관리를 해봅시다.
permalink : /tutorials/weplanet/docker-portainer
author : marcushong
tags : docker portainer
title\_background\_color : F1F71A
---

### docker + GUI
docker를 매번 터미널로 접속해 docker 명령어로 관리할 수도 있지만 GUI로 한 눈에 관리를 한다면 더 손쉽게 관리할 수 있다.
portainer는 무료 GUI 툴로서 간단히 docker image를 실행하는 것만으로 컨테이너 관리를 할 수 있다. 

### terminal
간단히 터미널로 실행가능하다. 9000번 포트로 접속가능하다.
```bash
$ docker run -d --name portrainer -v '/var/run/docker.sock:/var/run/docker.sock' -p 9000:9000 portainer/portainer:arm
```

### docker-compose
docker-compose로 전체 프로젝트를 한번에 올린다면 좀 더 직관적으로 설치할 수 있다.
nginx-proxy를 사용해 도메인까지 연결시켜 보자.
VIRTUAL_HOST에 설정한 docker.example.com로 접속하면 접속 가능하다.
 
```yaml
version: '3.6'
services:
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
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./nginx.tmpl:/app/nginx.tmpl
    labels:
      - com.github.jrcs.letsencrypt_nginx_proxy_companion.nginx_proxy
    networks:
      - nginx-proxy

  portainer:
    image: portainer/portainer
    ports:
      - 9000:9000
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - portainer-data:/data
    restart: always
    environment:
      - VIRTUAL_HOST=docker.example.com
    networks:
      - nginx-proxy

volumes:
  portainer-data:

networks:
  nginx-proxy:
    name: nginx-proxy

```

### 결론
* portainer에 접속해 계정 설정 후 GUI로 컨테이너에 로그, shell 접근, 재시작, 삭제등 거의 모든 기능을 사용할 수 있다.
