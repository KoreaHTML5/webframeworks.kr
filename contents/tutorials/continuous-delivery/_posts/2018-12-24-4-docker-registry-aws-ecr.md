---
layout : tutorials
category : tutorials
title : 배포 자동화 - docker registry + aws ecr
subcategory : setlayout
summary : docker registry와 aws ecr의 특징과 사용방법에 대해서 알아봅시다
permalink : /tutorials/continuous-delivery/docker-ecr
author : marcushong
tags : docker_registry ecr aws
title\_background\_color : F1F71A
---

### docker registry
docker registry란 docker image를 관리하는 Docker Hub같은 Repository이다.
이미지를 버전별로 관리하려면 필수인데, 별도의 서버를 설치하기 보다는 
AWS ECR에서 S3비용만 내고 사용하는 것이 관리하기가 간편하다.

### AWS ECR
AWS ECR에서 Repository를 생성한 후 URI를 가져온다.
테스트 버전, 프로덕션등 여러개를 만들어도 된다.

### deploy.sh
* AWS_PROFILE: aws configure로 생성한 aws profile 이름
* IMAGE_NAME: AWS ECR Repository 이름
* REGISTRY_URL: AWS ECR Repository URI
* HOST: 설치할 HOST
* APP_PATH: docker-compose 파일을 복사할 path
* KEY_PATH: ssh 인증서 경로

```sh
#!/bin/bash
AWS_PROFILE={aws_profile}
IMAGE_NAME={image_name}
REGISTRY_URL={aws ecr host}/${IMAGE_NAME}:latest
HOST={host}
APP_PATH={app path}/${IMAGE_NAME}
KEY_PATH={key path}

function errorCheck() {
  if [[ $? -ne 0 ]]; then
    exit 1
  fi
}

set -e

npm run build
errorCheck

docker build -t ${IMAGE_NAME} .
errorCheck

docker tag ${IMAGE_NAME}:latest ${REGISTRY_URL}
errorCheck

ECR_LOGIN=$(aws ecr get-login --no-include-email --region ap-northeast-2 --profile ${AWS_PROFILE})
eval ${ECR_LOGIN}
errorCheck

docker push ${REGISTRY_URL}
errorCheck

ssh ${HOST} "${ECR_LOGIN}" && docker pull "${REGISTRY_URL}""
errorCheck

ssh ${HOST} -i ${KEY_PATH} "mkdir -p ${APP_PATH}"
errorCheck

scp -i ${KEY_PATH} -d ./docker-compose.yml ${HOST}:${APP_PATH}
errorCheck

ssh ${HOST} -i ${KEY_PATH} "docker-compose -f "${APP_PATH}"/docker-compose.yml -p ${IMAGE_NAME} up -d --remove-orphans"
errorCheck

ssh ${HOST} -i ${KEY_PATH} "docker image prune -f"
docker image prune -f

echo "Deploy Success!"

```

### docker-compose.yml
docker registry를 사용하므로 빌드 옵션이 필요가 없다.

```dockerfile
version: '3.6'
services:
  server:
    image: {ecr uri}:latest
    restart: always
    environment:
      - NODE_ENV=production
```

### 정리
* git을 사용하지 않고 docker만 사용하므로 git에서 자유로울 수 있다.
* 필요하다면 tag에 버전을 붙여서 이미지 버전관리를 할 수 있다.

