# LabCalc v1.0.0

임상검사실 계산과 현미경 작업을 위한 정적 PWA 도구입니다.

## 주요 기능

- RPI, BE(B), AG, Calculated Osmolality, Ca(7.4), 2021 CKD-EPI eGFR
- Neubauer WBC/RBC 계산
- Diff Counter와 Morphology Note 통합
- nRBC 별도 집계
- 목표 카운트 도달 알림 및 추가 입력 잠금
- 사용자 지정 키 맵핑
- 메인 카운터와 Field Counter
- 오늘 기록, 다크 모드, 설치 및 오프라인 지원

## 실행

로컬 테스트에는 VS Code Live Server 등 HTTP 서버를 사용하세요. 서비스 워커는 `file://` 환경에서 동작하지 않습니다.

## GitHub Pages 배포

저장소 루트에 이 폴더의 파일을 올린 뒤 **Settings → Pages → Deploy from a branch**에서 배포할 브랜치와 `/root`를 선택합니다.

## 데이터와 개인정보

기록은 현재 기기의 브라우저 `localStorage`에 저장됩니다. 환자명, 등록번호 등 환자 식별정보는 입력하지 마세요. 기관에서 실제 사용하기 전 계산식과 항목을 SOP에 따라 검증해야 합니다.

## Release

- Version: 1.0.0
- Build: 2026-07-20
- Developer: 노의태
