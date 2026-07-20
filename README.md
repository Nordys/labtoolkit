# LabToolkit v1.0.2

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

- Version: 1.0.2
- Build: 2026-07-21
- Developer: 노의태

### v1.0.2

- Field Counter 목표 도달 시 Field와 Main 증가 자동 잠금
- 현재 필드와 목표 필드 진행 상태 및 완료 배너
- 감소, 실행 취소, 초기화, 목표 변경에 따른 즉시 잠금 해제
- 목표 완료 시 기존 사운드 설정을 따르는 완료음과 지원 기기 진동
- 목표값이 비어 있거나 0 이하이면 자동 완료 기능 비활성화

### v1.0.1

- Differential Counter 세포 카드 전체 탭으로 빠른 +1 입력
- 감소 동작을 분리한 편집 모드
- 키보드 카운팅과 실행 취소 유지
- 목표 WBC 완료 후에도 nRBC 계속 입력
- 선택 가능한 입력음, 감소음, 목표 완료음
- 사운드는 기본적으로 꺼져 있으며 설정은 현재 브라우저에 저장

