/**
 * 두 좌표 사이의 거리를 미터(m) 단위로 계산합니다.
 * 지도는 평명이지만, 지구는 둥글다. 그래서 단순히 피타고라스 정리를 쓰면 실제 거리와 오차가 발생한다.
 * 하버사인 공식은 구(Sphere) 위에서 두 지점 사이의 최단 거리(대원 거리)를 구하는 공식이다.
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const earthRadiusMeters = 6371e3; // (1) 지구의 반지름 : 약 6,371km, e3를 붙여 미터(m) 단위(6,371,0006,371,000)로 변환한 것
  const lat1Rad = (lat1 * Math.PI) / 180; // (2) 라디안 변환 : 위경도(Degree)를 수학 계산을 위해 라디안(Radian) 단위로 변환
  const lat2Rad = (lat2 * Math.PI) / 180;
  // 델타는 '차이'를 의미, 내 위치와 랜드마크 위치가 얼마나 떨어져 있는지 그 간격을 구합니다.
  const deltaLatRad = ((lat2 - lat1) * Math.PI) / 180; // 두 지점의 위도 차이
  const deltaLonRad = ((lon2 - lon1) * Math.PI) / 180; // 두 지점의 경도 차이
  // 두 지점 사이의 직선 거리가 아니라, 구의 표면을 따라가는 곡선의 비율을 계산
  const a =
    Math.sin(deltaLatRad / 2) * Math.sin(deltaLatRad / 2) +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(deltaLonRad / 2) * Math.sin(deltaLonRad / 2);
  // atan2를 통해 위에서 구한 비율을 다시 각도로 변환
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(earthRadiusMeters * c); // 정수 미터 단위로 반환
}
