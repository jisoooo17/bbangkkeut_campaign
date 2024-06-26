import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getCommentsUrl } from "../../store/store";
import axios from 'axios';
import "react-quill/dist/quill.core.css"

const Comments = ({ curList }) => {
  const dispatch = useDispatch();
  const { id } = useParams(); 
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loadedComments, setLoadedComments] = useState([]);
  const [userInfo, setUserInfo] = useState(null); // 로그인한 사용자 정보를 저장
  const storedUserData = sessionStorage.getItem("userData");
  const userData = JSON.parse(storedUserData);

  // 페이지가 로드될 때 사용자 정보를 가져오는 useEffect
  useEffect(() => {
    fetchUserInfo(); // 페이지가 로드될 때 사용자 정보를 가져오도록 호출
  }, []);

  // 저장된 댓글을 불러옴
  useEffect(() => {
    dispatch(getCommentsUrl(id))
      .then((res) => {
        if (res.payload) {
          let addComments = [...res.payload];
          setComments(addComments.reverse());
          setLoadedComments(addComments); // 댓글 수정 시 불러올 데이터 저장
        }
      })
      .catch((error) => console.log(error));
  }, [dispatch, id]);

  // 사용자 정보를 가져오는 함수
  const fetchUserInfo = async () => {
    try {
      // 사용자 정보를 가져오는 API 호출
      const response = await axios.get('http://localhost:8000/users');
      setUserInfo(response.data); // 가져온 사용자 정보를 상태에 저장
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  const handleChange = (e) => {
    setNewComment(e.target.value);
  };

  // 댓글 등록
  const postComment = async (e) => {
    e.preventDefault();
    const confirmCreate = window.confirm("댓글을 등록하시겠습니까?");
    const storedUserData = sessionStorage.getItem("userData");
    const userData = JSON.parse(storedUserData);

    if (confirmCreate) {
      try {
        // 사용자 정보가 있는 경우에만 댓글을 등록
        if (userInfo && userInfo.length > 0) {
          const response = await axios.post(`http://localhost:8000/campaign/detail/${curList.id}/comments`, {
            userid: userData.userid,
            comment_text: newComment,
            date: new Date(),
          });
          const commentId = response.data.commentId; // 서버로부터 받은 commentId
          const newCommentData = {
            id: commentId,
            userid: userData.userid,
            comment_text: newComment,
            date: new Date(),
            username: userData.username, // 서버 응답에 사용자 이름이 포함되어 있다면 해당 정보를 사용
          };

          dispatch(getCommentsUrl(curList.id));
          setNewComment("");
          setComments(prev => [newCommentData, ...prev]);
        } else {
          console.log("사용자 정보 없음");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  // 댓글 삭제 버튼
  const deleteComment = async (commentId) => {
    const confirmDelete = window.confirm("댓글을 삭제하시겠습니까?");

    if (confirmDelete) {
      try {
        // 서버에 댓글 삭제 요청을 보냄
        await axios.delete(`http://localhost:8000/campaign/detail/${curList.id}/comments/${commentId}`);

        // comment.id가 commentId와 같지 않은 댓글만 새로운 배열에 포함시키고, 삭제할 댓글은 제외시킴
        setComments((prev) => prev.filter(comment => comment.id !== commentId))
      } catch (error) {
        console.log(error);
      }
    }
  };
  
  return (
    <div className="comment-area">
      <p className="comment-tit">함께 할 사람들의 이야기</p>
      <div className="comment-w">
        <div className="write-wrap">
          <div className="write-div">
            <div className="for-padding">
              <textarea className="comment-text" type="text" name="comment_text" value={newComment} placeholder="내용을 입력하세요." onChange={handleChange} />
            </div>
            <div className="btn-w">
              <button className="btn-submit" type="submit" onClick={postComment}>등록</button>
            </div>
          </div>
        </div>
        <div className="view-wrap">
          {
            comments && comments.length > 0 ? (
              comments.map((comment, i) =>
                <div className="comment" key={i}>
                  <div className="view-div">
                    <div className="regi-w">
                        <p className='username'>{comment.username}</p>
                        <p className="date">{new Date(comment.date).toLocaleDateString()}</p>
                    </div>
                    <p className="txt">{comment.comment_text}</p>
                    {userData.userid === comment.userid && (
                      <div className="btn-w">
                        {/* 댓글의 ID를 deleteComment 함수로 전달 */}
                        <button className="btn-delete" onClick={() => deleteComment(comment.id)}>삭제</button>
                      </div>
                    )}
                  </div>

                  {/* 댓글 수정 폼 */}
                  <div className="write-div">
                    <div className="btn-w">
                      <button className="btn-submit" type="submit" onClick={postComment}>등록</ button>
                    </div>
                  </div>
                </div>
              )
            ) : null
          }
        </div>
      </div>
    </div>
  );
};

export default Comments;