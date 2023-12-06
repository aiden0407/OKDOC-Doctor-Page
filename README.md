# OKDOC

OKDOC은 재외국민을 위한 대학병원 전문의 원격진료 서비스입니다.

## OKDOC 프로덕트 문서

[포트폴리오 노션 페이지](https://aiden0407.notion.site/OK-DOC-98512b4dc1af4fa180e26b2edada7e6a?pvs=4)

## OKDOC-Doctor-Page

OKDOC 참여 의사들을 위한 웹 페이지로 환자 관리, 스케줄 관리, 원격 진료, 소견서 작성 등의 목적을 지니고 있습니다.

## OKDOC-Doctor-Page 실행

#### `npm install`

dependencies 다운로드 / 환경변수 파일은 따로 아카이빙

#### `npm run start`

프로덕션 서버 환경변수 구동

#### `npm run start:stg`

스테이징 서버 환경변수 구동 (elastic beanstalk 스테이징 서버 및 프로덕션 관리자 토큰 사용)

#### `npm run start:dev`

로컬 서버 환경변수 구동 (MS dev tunnel 서버 및 local 서버 관리자 토큰 사용)

#### `npm run build`

프로덕션 환경 빌드

#### `npm run build:stg`

스테이징 환경 빌드 (elastic beanstalk 스테이징 서버 및 프로덕션 관리자 토큰 사용)
