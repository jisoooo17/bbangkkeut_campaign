export const dataUrl = {
  home: "http://localhost:8000/campaign",
};

// 댓글을 가져오는 URL을 생성하는 함수
export function getCommentsUrl(postId) {
  return `${dataUrl.home}/detail/${postId}/comments`;
}
