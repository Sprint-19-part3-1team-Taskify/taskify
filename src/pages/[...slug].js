/**
 * 존재하지 않는 경로를 서버 단계에서 렌더링 전에 즉시 리다이렉트 처리.
 */
export async function getServerSideProps() {
  return {
    redirect: {
      destination: '/', // 여기로 이동
      permanent: false, //브라우저가 이 리다이렉트를 캐싱(저장)하지 않음
    },
  };
}

export default function Nothing() {
  return null;
}
