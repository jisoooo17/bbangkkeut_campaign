import { configureStore, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';
import { dataUrl } from '../dataUrl';

// Thunk를 생성하는 함수
export const getPost = createAsyncThunk(
  "data/postData", // action 이름
  async()=>{
    const result = await axios.get(dataUrl.home);
    return result.data;
  }
)


export const getCommentsUrl = createAsyncThunk(
  "data/commentData",
  async (postId) => {
    try {
      const url = `${dataUrl.home}/detail/${postId}/comments`;
      const result = await axios.get(url);
      return result.data;
    } catch (error) {
      console.error("Error fetching comments:", error);
      throw error; // 
    }
  }
);


const getSlice = createSlice({
  name: "getPost",
  initialState: {
    results: {list: []}, // results : post의 데이터를 받는 프로퍼티
  },
  reducers: {}, // 비동기 작업을 위한 포스팅이기 때문에 아무런 Reducer를 등록하지 않았다
  // extraReducer에 비동기 함수의 pending, fulfilled, rejected를 처리할 내용을 넣어준다
  extraReducers: (builder)=>{
    builder
      .addCase(getPost.pending, (state)=>{
        state.status = "Loading...";
      })
      .addCase(getPost.fulfilled, (state, action)=>{
        state.list = action.payload;
        state.status = "Complete";
      })
      .addCase(getPost.rejected, (state, action) => {
        state.status = "Fail";
      })
      // 새로 추가한 Thunk 함수의 상태 처리를 추가합니다.
      .addCase(getCommentsUrl.pending, (state) => {
        state.status = "Loading...";
      })
      .addCase(getCommentsUrl.fulfilled, (state, action) => {
        state.comments = action.payload;
        state.status = "Complete";
      })
      .addCase(getCommentsUrl.rejected, (state) => {
        state.status = "Fail";
      });
  }
})
  
const store = configureStore({
  reducer: {
    post: getSlice.reducer,
  },
});

export default store;
