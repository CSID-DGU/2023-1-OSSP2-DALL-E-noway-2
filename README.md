<div align="center">

<img width="373" alt="스크린샷 2023-06-11 오전 12 36 30" src="https://github.com/CSID-DGU/2023-1-OSSP2-DALL-E-noway-2/assets/83565255/644819b7-12a1-4769-99d9-be475300d492">

[![GitHub Stars](https://img.shields.io/github/stars/CSID-DGU/2023-1-OSSP2-DALL-E-noway-2?style=for-the-badge)](https://github.com/CSID-DGU/2023-1-OSSP2-DALL-E-noway-2/stargazers) [![GitHub Stars](https://img.shields.io/github/issues/CSID-DGU/2023-1-OSSP2-DALL-E-noway-2?style=for-the-badge)](https://github.com/CSID-DGU/2023-1-OSSP2-DALL-E-noway-2/issues) [![Current Version](https://img.shields.io/badge/version-4.0.0-black?style=for-the-badge)](https://github.com/IgorAntun/node-chat) [![GitHub License](https://img.shields.io/github/license/CSID-DGU/2023-1-OSSP2-DALL-E-noway-2?style=for-the-badge)](https://github.com/IgorAntun/node-chat/issues)

</div>

## 목차

- [💬 프로젝트 소개](#-프로젝트-소개)
- [🔖 기능 안내](#-기능-안내)
- [🔎 로컬 구동 방법](#-로컬-구동-방법)
- [🛠 기술 스택](#-기술-스택)
- [🧑‍💻 프로젝트 멤버](#-프로젝트-멤버)

<br/>

## 💬 프로젝트 소개

### 웹사이트

- https://dream-vision.shop

### 프로젝트 설명

Dream Vision은 꿈을 통해 영감을 얻고 싶은 분들을 위해 만들어진 서비스입니다.
<br/>

저희 서비스를 이용하면 꿈 일기를 작성하고, 그와 관련된 아름다운 이미지를 얻을 수 있습니다.
저희는 최신 인공지능 모델인 OpenAI의 Dalle2를 활용하여 이미지를 생성합니다.
Dalle2는 입력받은 텍스트를 바탕으로 이미지를 생성하는 모델입니다.
이를 통해 꿈을 더 오래 기억할 수 있으며, 시각적인 정보로 꿈을 풍부하게 상상할 수 있습니다.
당신의 상상력과 창의력을 더욱 끌어 올려 보세요.

<br/>

뿐만 아니라, Dream Vision은 GPT 모델을 활용하여 꿈에 대한 해몽도 제공합니다.
GPT 모델은 인공지능 기술의 최신 도구 중 하나로, 입력받은 텍스트를 바탕으로 다음에 올 단어를 예측합니다.
당신이 꾼 꿈에 대한 의미와 해석을 알고 싶다면, 우리의 AI가 도움을 줄 것입니다.
꿈의 의미를 탐구하고, 자신의 내면을 더욱 깊이 이해하는 데 도움을 줄 것입니다.
Dream Vision을 통해 당신의 꿈을 풀어나가고, 인사이트를 얻어보세요.

<br/>

또한, Dream Vision에서는 여러분이 작성한 꿈 일기를 다른 사람들과 공유할 수도 있습니다.
여러 사람들과 교류하고 공유하면서 새로운 아이디어와 인사이트를 얻을 수 있습니다.
이들과 상호작용하며 다양한 관점과 경험을 나누어보세요.

<br/>
Dream Vision은 꿈을 향한 여정을 더욱 풍요롭게 만들어줄 것입니다.
꿈을 통해 창의적인 아이디어를 얻고, 깊은 내면의 의미를 탐구하며, 다른 사람들과 공유하며 성장할 수 있는 기회를 제공합니다.
지금 Dream Vision을 경험해보세요!

<br/>
<br/>

## 🔖 기능 안내

작성 예정

<br/>
<br/>

## 🔎 로컬 구동 방법

**1. 레포지토리 클론**

```bash
git clone https://github.com/CSID-DGU/2023-1-OSSP2-DALL-E-noway-2.git dalle-noway && cd dalle-noway
```

**2. 의존 라이브러리 설치**

```bash
yarn install --cwd backend
```

```bash
yarn install --cwd frontend
```

**3. 환경 변수 설정**

```bash
touch backend/.env
```

```bash
touch frontend/.env
```

```bash
touch mariadb/.env
```

backend env 파일 예시

```bash
PORT=3000
BE_HOST=http://localhost:81
FE_HOST=http://localhost:81
DEBUG_LOG=true
NODE_ENV=development

# env for naver
NAVER_CLIENT_ID=
NAVER_CLIENT_SECRET=
NAVER_CALLBACK_URL=/api/auth/naver/login/callback

# env for kakao
KAKAO_CLIENT_ID=
KAKAO_CLIENT_SECRET=
KAKAO_ADMIN_KEY=
KAKAO_CALLBACK_URL=/api/auth/kakao/login/callback

# env for google
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=/api/auth/google/login/callback

# env for JWT
JWT_SECRET=
JWT_EXPIRESIN=28d

# env for DB
DATABASE_HOST=localhost
DATABASE_USER=dalle
DATABASE_PASSWORD=1234
DATABASE_PORT=3308
DATABASE_DATABASE=dalle

# env for openai
OPENAI_HOST=https://api.openai.com
OPENAI_ORGANIZATION_ID=org-[YOUR_ORG_ID]
OPENAI_API_KEY=sk-[YOUR_API_KEY]

# env for defaultImage
DEFAULT_IMAGE_URL=http://localhost:81/uploads/image.png

```

frontend env 파일 예시

```bash
VITE_BE_HOST=http://localhost:81
```

mariadb env 파일 예시

```bash
MARIADB_DATABASE=dalle
MARIADB_USER=dalle
MARIADB_PASSWORD=1234
MARIADB_ROOT_PASSWORD=1234

```

**4. 도커 컨테이너 가동**

```bash
docker compose up --build -d
```

**5. 앱 실행**

```bash
yarn --cwd backend start:dev
```

```bash
yarn dev --cwd frontend
```

**6. 사이트 접속**
https://localhost:81

<br/>
<br/>

## 🛠 기술 스택

<div>

### Common

<img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=TypeScript&logoColor=white"/> <img src="https://img.shields.io/badge/ESLint-4B32C3?style=flat-square&logo=ESLint&logoColor=white"/> <img src="https://img.shields.io/badge/Prettier-F7B93E?style=flat-square&logo=Prettier&logoColor=white"/>


### Frontend

<img src="https://img.shields.io/badge/VueJS-4FC08D?style=flat-square&logo=Vue.js&logoColor=white"/> <img src="https://img.shields.io/badge/Pinia-4FC08D?style=flat-square&logo=Vue.js&logoColor=white"/> <img src="https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=Vite&logoColor=white"/> <img src="https://img.shields.io/badge/ChartJS-FF6384?style=flat-square&logo=Chart.js&logoColor=white"/> <img src="https://img.shields.io/badge/Axios-5FC0E0?style=flat-square&logo=axios&logoColor=white"/>


### Backend

<img src="https://img.shields.io/badge/NestJS-E0234E?style=flat-square&logo=NestJS&logoColor=white"/> <img src="https://img.shields.io/badge/TypeORM-F37626?style=flat-square&logo=TypeORM&logoColor=white"/> <img src="https://img.shields.io/badge/PassportJS-34E27A?style=flat-square&logo=Passport&logoColor=white"/> <img src="https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=MySQL&logoColor=white"/> <img src="https://img.shields.io/badge/SwaggerJS-85EA2D?style=flat-square&logo=Swagger&logoColor=white"/>


### Infra

<img src="https://img.shields.io/badge/Nginx-269539?style=flat-square&logo=Nginx&logoColor=white"/> <img src="https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=Docker&logoColor=white"/> <img src="https://img.shields.io/badge/AWS EC2-232F3E?style=flat-square&logo=AmazonAWS&logoColor=white"/> <img src="https://img.shields.io/badge/PM2-2B037A?style=flat-square&logo=PM2&logoColor=white"/> <img src="https://img.shields.io/badge/Github Actions-2088FF?style=flat-square&logo=GithubActions&logoColor=white"/>

<br/>

## 🧑‍💻 프로젝트 멤버

<br/>

<table align="center">
  <!-- 이름, 학번, 역할 3개의 열로 이루어진 테이블 -->
  <tr align="center">
    <td align="center">
      <a href="https://github.com/sichoi42">
        <img src="https://avatars.githubusercontent.com/u/83565255?v=4" width="100px;" alt="sichoi42"/><br />
        <sub><b>최시원</b></sub>
      </a>
      <br />
      <sub>PM, 프론트엔드/백엔드 개발</sub>
      <br />
      <sub>2020110571</sub>
    </td>
    <td align="center">
      <a href="https://github.com/okiidokim">
        <img src="https://avatars.githubusercontent.com/u/127471879?v=4" width="100px;" alt="sssungjin"/><br />
        <sub><b>김도현</b></sub>
      </a>
      <br />
      <sub>프론트엔드 개발</sub>
      <br />
      <sub>2021111981</sub>
    </td>
  </tr>
</table>
<table align="center">
  <tr align="center">
    <td align="center">
      <a href="https://github.com/sssungjin">
        <img src="https://avatars.githubusercontent.com/u/97083298?v=4" width="100px;" alt="sssungjin"/><br />
        <sub><b>조성진</b></sub>
      </a>
      <br />
      <sub>백엔드 개발</sub>
      <br />
      <sub>2019112020</sub>
    </td>
    <td align="center">
      <a href="https://github.com/nicolao00">
        <img src="https://avatars.githubusercontent.com/u/74057742?v=4" width="100px;" alt="sssungjin"/><br />
        <sub><b>박재형</b></sub>
      </a>
      <br />
      <sub>백엔드 개발</sub>
      <br />
      <sub>2019111989</sub>
    </td>
    <td align="center">
      <a href="https://github.com/rlaalsghks8">
        <img src="https://avatars.githubusercontent.com/u/127469367?v=4" width="100px;" alt="sssungjin"/><br />
        <sub><b>김민환</b></sub>
      </a>
      <br />
      <sub>백엔드 개발</sub>
      <br />
      <sub>2021111977</sub>
    </td>
  </tr>
</table>
