# WordBridge-FrontRepo

<div align="center">
  <img width="300" alt="image" src="https://github.com/user-attachments/assets/8f226fda-9cdc-4a55-af56-644165a4dca0">
</div>

# WordBridge
> **2인 팀 프로젝트** <br/> **개발기간: 2024.09 ~ 2024.10 배포 세팅 중**

## 웹개발팀 소개

|      문소연       |          조용주         |                                                                                                             
| :------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------: |
|   [@MOONProd](https://github.com/MOONProd)   |    [@fishman1123](https://github.com/fishman1123)  |
| 프론트엔드 개발 | 백엔드 개발 |

## 프로젝트 소개

WordBridge는 온라인 양방향 통신 끝말잇기 게임입니다. 'Host'는 게임을 실행하고자 하는 지역을 선택하여 대기방을 형성할 수 있고, 'Visitor'는 형성되어진 대기방 중 선택 입장하여 게임을 실행할 수 있습니다.
콘텐츠를 기획하게 된 계기 중 하나로 WebSocket 기술을 익히고자 하였으며, 그 외에도 공공 API(Google 소셜 로그인, Google map API)를 활용하는 등 프로젝트를 통해 여러 기술 습득 및 경험을 할 수 있었습니다.

---

## Stacks 🧐

### Environment
![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-007ACC?style=for-the-badge&logo=Visual%20Studio%20Code&logoColor=white)
![IntelliJ IDEA](https://img.shields.io/badge/Intellij%20IDEA-000000?style=for-the-badge&logo=IntelliJ%20IDEA&logoColor=white)
![SourceTree](https://img.shields.io/badge/Sourcetree-0052CC?style=for-the-badge&logo=SourceTree&logoColor=white)
![Github](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=GitHub&logoColor=white)             

### Config
![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white) 
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=Vite&logoColor=white)        

### Development
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=Javascript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=Socket.io&logoColor=white)
![Spring](https://img.shields.io/badge/Spring-6DB33F?style=for-the-badge&logo=Spring&logoColor=white)
![Material UI](https://img.shields.io/badge/Material%20UI-007FFF?style=for-the-badge&logo=MUI&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=for-the-badge&logo=Tailwind%20CSS&logoColor=white)

### Communication
![Slack](https://img.shields.io/badge/Slack-4A154B?style=for-the-badge&logo=Slack&logoColor=white)
![Google Docs](https://img.shields.io/badge/Google%20Docs-4285F4?style=for-the-badge&logo=Google%20Docs&logoColor=white)

---

## 화면 구성 📺

| 메인 페이지  |  Visitor 페이지   |
| :-------------------------------------------: | :------------: |
|  <img width="500" src="https://github.com/user-attachments/assets/3e26f054-b9ae-4e04-a852-c1542689b270"/> |  <img width="500" src="https://github.com/user-attachments/assets/d81bc023-f512-43e9-b305-e2baa477d8d8"/>|  
| 게임 시작 페이지  |  Host 대기방 생성 안내   |  
| <img width="500" src="https://github.com/user-attachments/assets/ba5ac723-589f-4ad1-a52d-6a5331c4ae38"/>   |  <img width="500" src="https://github.com/user-attachments/assets/ca32c1ec-3993-42ab-b093-64c79f51b57e"/>     |

---
## 주요 기능 📦

### ✨ 전체 채팅방, 게임 채팅방 분리
- MainPage 사용자와 대기방 사용자간의 전체 채팅 가능
- 게임 채팅방(개인 채팅방)으로 구성하여 분리

### ✨ 직접 게임을 하고자 하는 위치 선택
- Host는 게임을 하고자 하는 위치를 map을 이동시켜 선택
- Visitor 또한 본인이 원하는 위치에서 대기방 탐색

### ✨ 누적 점수로 이웃 순위 확인 
- 사용자들의 누적 점수로 이웃들의 점수로 순위 확인 가능
