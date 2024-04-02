// 공통
import express from "express";
import cors from "cors";
import mysql from "mysql2";

import bodyParser from "body-parser";

import multer from "multer"; // 이미지 저장 관련
import path, { resolve } from "path"; // 이미지 저장 관련

import bcrypt from "bcrypt";
import session from "express-session"; //0213 김민호 세션 추가
import MemoryStore from "memorystore"; // MemoryStore import 추가
const MemoryStoreInstance = MemoryStore(session);

import { fileURLToPath } from "url";
import { rejects } from "assert";

const app = express();
const port = 8000;
const __dirname = fileURLToPath(new URL(".", import.meta.url)); // 이미지 저장 관련

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// CORS 설정
app.use(cors({ origin: "http://localhost:3000" }));

const connection = mysql.createConnection({
  host: "1.243.246.15",
  user: "root",
  password: "1234",
  database: "ezteam2",
  port: 5005,

  // host: "192.168.45.188",
  // user: "root",
  // password: "1234",
  // database: "ezteam2",
  // port: 5005,
});

// MySQL 연결
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL: " + err.stack);
    return;
  }
  console.log("Connected to MySQL as id " + connection.threadId);
});

app.get("/", (req, res) => res.send(`Hell'o World!`));

// ------------------- 김지수 -------------------
// 정적 파일 제공을 위한 미들웨어 추가
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// 캠페인 글 목록 가져오기
app.get("/campaign", (req, res) => {
  const q = `SELECT a.*, u.*, a.address, a.address_detail
  FROM campaign_posts a
  INNER JOIN user u ON a.userid = u.userid;
  `;
  // const q = `SELECT a.*, u.*
  // FROM campaign_posts a
  // INNER JOIN user u ON a.userid = u.userid;`;
  connection.query(q, (err, data) => {
    if (err) {
      console.error(err);
      return res.json(err);
    }
    return res.json(data);
  });
});

app.post("/campaign", (req, res) => {
  // MySQL의 NOW() 함수를 사용하여 현재 시간을 삽입
  const q = "INSERT INTO campaign_posts (title, body, date, userid, start_date, end_date, reception_start_date, reception_end_date, address, address_detail, latitude, longitude) VALUES (?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?)";

  // 캠페인 시작날짜
  const startDateOffset = new Date(req.body.start_date);
  const formattedStartDate = new Date(startDateOffset.getTime() - startDateOffset.getTimezoneOffset() * 60000).toISOString().split('T')[0]; // ISO 형식의 날짜를 MySQL이 인식할 수 있는 형식으로 변환

  // 캠페인 종료날짜
  const endDateOffset = new Date(req.body.end_date);
  const formattedEndDate = new Date(endDateOffset.getTime() - endDateOffset.getTimezoneOffset() * 60000).toISOString().split('T')[0]; // ISO 형식의 날짜를 MySQL이 인식할 수 있는 형식으로 변환

  // 캠페인 접수 시작날짜
  const receptionStartDateOffset = new Date(req.body.reception_start_date);
  const formattedReceptionStartDate = new Date(receptionStartDateOffset.getTime() - receptionStartDateOffset.getTimezoneOffset() * 60000).toISOString().split('T')[0];

  // 캠페인 접수 종료날짜
  const receptionEndDateOffset = new Date(req.body.reception_end_date);
  const formattedReceptionEndDate = new Date(receptionEndDateOffset.getTime() - receptionEndDateOffset.getTimezoneOffset() * 60000).toISOString().split('T')[0];

  const values = [req.body.title, req.body.body, req.body.userid, formattedStartDate, formattedEndDate, formattedReceptionStartDate, formattedReceptionEndDate, req.body.address, req.body.address_detail, req.body.latitude, req.body.longitude];

  connection.query(q, values, (err, data) => {
    if (err) return res.json(err);
    return res.json("Message has been sent successfully");
  });
});



// 글 삭제
app.delete("/campaign/detail/:id", (req, res) => {
  const campaignId = req.params.id;
  const qDeleteComments = "DELETE FROM campaign_comments WHERE post_id = ?"; // 특정 post_id에 해당하는 모든 댓글을 삭제
  const qDeletePost = "DELETE FROM campaign_posts WHERE id = ?"; // 게시물의 ID 값을 사용하여 특정 게시물을 삭제

  // 댓글 먼저 삭제
  connection.query(qDeleteComments, campaignId, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json(err);
    }

    // 댓글 삭제가 성공하면 게시물 삭제
    connection.query(qDeletePost, campaignId, (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json(err);
      }
      return res.json("Message and comments have been deleted successfully");
    });
  });
});

// 글 수정
app.get("/campaign/detail/:id", (req, res) => {
  const campaignId = req.params.id;
  const q = "SELECT * FROM campaign_posts WHERE id = ?";
  connection.query(q, campaignId, (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json({ message: "글을 찾을 수 없습니다." });
    return res.json(data[0]);
  });
});

app.put("/campaign/edit/:id", (req, res) => {
  const campaignId = req.params.id;
  const q = "UPDATE campaign_posts SET `title` = ?, `body` = ?, `start_date` = ?, `end_date` = ?, `reception_start_date` = ?, `reception_end_date` = ?, `address` = ?, `address_detail` = ?, `latitude` = ?, `longitude` = ? WHERE id = ?";
  // start_date와 end_date가 문자열로 넘어오는 것을 Date 객체로 변환하여 사용
  const values = [
    req.body.title,
    req.body.body,
    new Date(req.body.start_date),
    new Date(req.body.end_date),
    new Date(req.body.reception_start_date),
    new Date(req.body.reception_end_date),
    req.body.address,
    req.body.address_detail,
    req.body.latitude,
    req.body.longitude,
    campaignId,
  ];
  connection.query(q, values, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json("Message has been updated successfully");
  });
});

// 유저 정보 가져옴
app.get("/users", (req, res) => {
  const q = "SELECT userid, username, email, phonenumber FROM user";
  connection.query(q, (err, data) => {
    if (err) {
      console.error("Error executing MySQL query:", err);
      return res.json(err);
    }
    // console.log(res);
    return res.json(data);
  });
});

// 조회수
app.put("/campaign/increase-views/:id", (req, res) => {
  const campaignId = req.params.id;
  const qUpdateViews = "UPDATE campaign_posts SET `views` = `views` + 1 WHERE id = ?";

  // 조회수 증가
  connection.query(qUpdateViews, campaignId, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json(err);
    }
    // 조회수가 업데이트된 후 응답
    return res.json({ message: "Views updated successfully" });
  });
});

// 신청하기 버튼 클릭 시 사용자가 입력한 정보가 들어가도록 요청
app.post("/campaign/form/:id", (req, res) => {
  const postId = req.params.id;
  const { userid, company, memo } = req.body; 
  
  // 사용자가 입력한 userid, company, memo, postId 값을 쿼리에 삽입
  const values = [userid, company, memo, postId];
  const q = 'INSERT INTO campaign_form (userid, company, memo, post_id) VALUES (?, ?, ?, ?)';
  
  connection.query(q, values, (err, data) => {
    if (err) {
      console.error("Error inserting data:", err);
      return res.status(500).json({ error: "Failed to submit the form." });
    }
    return res.json({ message: "Message has been sent successfully" });
  });
});

app.get("/campaign/form/:id", (req, res) => {
  const postId = req.params.id;
  const q = `
    SELECT cc.*, u.username, email, phonenumber
    FROM campaign_form cc
    INNER JOIN user u ON cc.userid = u.userid`;
  // const q = `
  //   SELECT cc.*, u.username, email, phonenumber
  //   FROM campaign_form cc
  //   INNER JOIN user u ON cc.userid = u.userid
  //   WHERE cc.post_id = ?`;
  
  connection.query(q, [postId], (err, data) => { 
    if(err) return res.status(500).json(err);
    return res.status(200).json(data); 
  });
});







// -------------- 댓글 --------------
// 댓글 등록
app.post("/campaign/detail/:id/comments", (req, res) => {
  const postId = req.params.id;
  const { userid, comment_text } = req.body;

  const values = [postId, userid, comment_text];
  const q = "INSERT INTO campaign_comments (post_id, userid, comment_text, date) VALUES (?, ?, ?, NOW())";

  connection.query(q, values, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json(err);
    }
    // 새로 추가된 댓글의 commentId를 응답 데이터에 추가하여 전송
    const commentId = data.insertId;
    return res.status(201).json({
      message: "Comment has been sent successfully",
      commentId: commentId, // 새로 추가된 댓글의 commentId를 클라이언트로 전송
      date: new Date(),
    });
  });
});

// 댓글을 가져오는 API 엔드포인트
app.get("/campaign/detail/:id/comments", (req, res) => {
  const postId = req.params.id;
  const q = `
    SELECT cc.*, u.username
    FROM campaign_comments cc
    INNER JOIN user u ON cc.userid = u.userid
    WHERE cc.post_id = ?`;

  connection.query(q, [postId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data); // 댓글 데이터를 반환합니다.
  });
});

//http://localhost:8000/campaign/detail/${curList.id}/comments
// 댓글 삭제
app.delete("/campaign/detail/:id/comments/:commentId", (req, res) => {
  const postId = req.params.id;
  const commentId = req.params.commentId;
  const q = "DELETE FROM campaign_comments WHERE post_id = ? AND id = ?";

  connection.query(q, [postId, commentId], (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json(err);
    }
    return res.status(200).json({ message: "댓글이 성공적으로 삭제되었습니다." });
  });
});

// 댓글 수정
app.get("/campaign/detail/:id/comments/:commentId", (req, res) => {
  const postId = req.params.id;
  const commentId = req.params.commentId;
  const q = "SELECT * FROM campaign_comments WHERE post_id = ? AND id = ?";

  connection.query(q, [postId, commentId], (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json(err);
    }
    const selectedComment = data[0]; // 첫 번째로 선택된 댓글을 가져옴
    return res.status(200).json({ message: "test", selectedComment });
  });
});
// -------------- 댓글 --------------

// -------------- 이미지 저장 관련 --------------
// multer 설정
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, path.join(__dirname, "public/uploads"));
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
});

// 하나의 이미지 파일만 가져온다.
app.post("/img", upload.single("img"), (req, res) => {
  const IMG_URL = `http://localhost:8000/uploads/${req.file.filename}`;
  res.json({ url: IMG_URL });
});
// -------------- 이미지 저장 관련 --------------





































































// 상호형
app.get("/api/carbonFootprint", async (req, res) => {
  // MySQL에서 데이터를 가져와 JSON 형식으로 응답

  // 첫 번째 쿼리: carbon_footprint에서 데이터 가져오기
  const carbonFootprint = new Promise((resolve, reject) => {
    connection.query("SELECT * FROM carbon_footprint;", (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
  const carbonFootprintData = await carbonFootprint;

  // 두 번째 쿼리: calculation_advice에서 데이터 가져오기
  const calculationAdvice = new Promise((resolve, reject) => {
    connection.query("SELECT a.name, b.advice_text, b.savings_value FROM calculation_category as a join calculation_advice as b ON a.id = b.category_id;", (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
  const calculationAdviceData = await calculationAdvice;

  // 두 쿼리의 결과를 합쳐서 응답
  res.json({
    carbonFootprintData,
    calculationAdviceData,
  });
});

// 해당 월의 데이터 존재 여부를 확인하는 라우트
app.get("/api/carbonFootprint/check/:userId/:date", async (req, res) => {
  const { userId, date } = req.params;
  const yearMonth = date.slice(0, 7); // 'YYYY-MM' 형식으로 변환

  // 해당 월의 첫 날과 마지막 날을 계산
  const startDate = `${yearMonth}-01`;
  const endDate = new Date(yearMonth);
  endDate.setMonth(endDate.getMonth() + 1);
  endDate.setDate(0);
  const lastDay = endDate.getDate();
  const endDateStr = `${yearMonth}-${lastDay}`;

  // console.log(`Checking data for user ${userId} between ${startDate} and ${endDateStr}`);

  try {
    const query = `
        SELECT * FROM user_calculation 
        WHERE user_id = ? 
        AND calculation_month BETWEEN ? AND ?;
      `;

    // console.log(`Executing query: ${query}`);
    // console.log(`With parameters: userId=${userId}, startDate=${startDate}, endDateStr=${endDateStr}`);

    connection.query(query, [userId, startDate, endDateStr], (err, results) => {
      if (err) {
        console.error("Query error:", err);
        return res.status(500).send("Error querying the database");
      }

      if (results.length > 0) {
        // console.log(`Found data for user ${userId} in the specified month.`);
        res.json({ hasData: true, data: results[0] });
      } else {
        // console.log(`No data found for user ${userId} in the specified month.`);
        res.json({ hasData: false });
      }
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).send("Server error");
  }
});

// 메인 페이지 차트 data
app.get("/api/carbonFootprint/main", async (req, res) => {
  try {
    const query = `SELECT * FROM user_calculation;`
    connection.query(query,(err, results) =>{
      if (err) reject(err);
      else return res.json(results);
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).send("Server error");
  }

});

// 마이 페이지 차트 data
app.get("/api/carbonFootprint/mypage/:userId", async (req, res) => {
  const { userId } = req.params;
  // try {
  //   const query = `
  //   SELECT * FROM ezteam2.user_calculation
  //   WHERE user_id = ?;`
  //   connection.query(query,[userId],(err, results) =>{
  //     if (err) reject(err);
  //     else return res.json(results);
  //   });
  // } catch (error) {
  //   console.error("Server error:", error);
  //   res.status(500).send("Server error");
  // }
  // 첫 번째 쿼리: carbon_footprint에서 user 월별 데이터 가져오기
  const mypageInitial = new Promise((resolve, reject) =>{
    const query = `
    SELECT * FROM ezteam2.user_calculation
    WHERE user_id = ?;`
    connection.query(query,[userId],(err, results) =>{
      if (err) reject(err);
      else resolve(results);
    })
  });    
  const mypageInitialData = await mypageInitial;

  // 두 번째 쿼리: calculation_advice에서 데이터 가져오기
  const calculationAdvice = new Promise((resolve, reject) => {
    connection.query("SELECT a.name, b.advice_text, b.savings_value FROM calculation_category as a join calculation_advice as b ON a.id = b.category_id;", (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
  const calculationAdviceData = await calculationAdvice;

  // 두 쿼리의 결과를 합쳐서 응답
  res.json({
    mypageInitialData,
    calculationAdviceData,
  });
});

// POST 라우트 추가
app.post("/api/carbonFootprint", async (req, res) => {
  const { userId, calculationMonth, electricity, gas, water, transportation, waste, total, checkedItems, categorySavings } = req.body;

  // JSON 형식의 데이터를 문자열로 변환
  const checkedItemsString = JSON.stringify(checkedItems);
  const categorySavingsString = JSON.stringify(categorySavings);

  // const insertQuery = "INSERT INTO user_calculation (user_id, calculation_month, electricity, gas, water, transportation, waste, total) VALUES (?, ?, ?, ?, ?, ?, ?, ?);";
  const insertQuery =
    "INSERT INTO user_calculation (user_id, calculation_month, electricity, gas, water, transportation, waste, total, checked_items, category_savings) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";

  connection.query(insertQuery, [userId, calculationMonth, electricity, gas, water, transportation, waste, total, checkedItemsString, categorySavingsString], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: "Error saving data to the database", error: err.message });
    }
    res.status(201).send({ message: "Data saved successfully", data: req.body });
  });
});



































































































































// 김민호
//-------------------------------로그인-----------------------------------------------

//-------------------------------익스플로스 세션 0213------------------------------------
const sessionStore = new MemoryStoreInstance({
  checkPeriod: 100000, // 옵션: 세션의 만료 기간을 확인하는 주기 (10초)
});

app.use(
  session({
    secret: "secretKey", // 랜덤하고 안전한 문자열로 바꾸세요.
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
      maxAge: 100000,
      httpOnly: true,
    },
  })
);
//-------------------------------로그인------------------------------------

app.post("/login", async (req, res) => {
  // console.log(req.session);
  const { email, password, usertype } = req.body; //usertype 추가 2/14 김민호

  try {
    // 이메일을 사용하여 데이터베이스에서 사용자를 찾습니다.
    connection.query("SELECT * FROM user WHERE email = ?", [email], async (err, result) => {
      if (err) {
        console.error("서버에서 에러 발생:", err);
        res.status(500).send({ success: false, message: "서버 에러 발생" });
      } else {
        if (result.length > 0) {
          const isPasswordMatch = await bcrypt.compare(password, result[0].password);
          if (isPasswordMatch && usertype == result[0].usertype) {
            // 0213 김민호 세션스토리 초기화 확인
            if (!req.session) {
              req.session = {};
            }
            //세션데이터 저장(새로운 데이터 추가시 이부분 수정)
            req.session.usertype = result[0].usertype; //0213 김민호 익스플로우 세션기능 추가
            req.session.userid = result[0].userid; //0213 김민호 익스플로우 세션기능 추가
            // console.log(req.session);
            res.send({ success: true, message: "로그인 성공", data: result });
          } else {
            res.send({
              success: false,
              message: "정보가 일치하지 않습니다.",
              //가입은 되어 있으나 정보가 맞지 않을 때
            });
          }
        } else {
          res.send({ success: false, message: "유저 정보가 없습니다." });
          //가입된 정보가 없을 시 출력
        }
      }
    });
  } catch (error) {
    console.error("비밀번호 비교 중 오류:", error);
    res.status(500).send({ success: false, message: "서버 에러 발생" });
  }
});
//-------------------------------회원가입----------------------------------------------
//---------------------------------- 회원번호---------------------------------------------
const usedUserNumbers = new Set(); // 중복 방지를 위한 Set

async function generateUserid(usertype) {
  // 사용자 유형에 기반한 사용자 ID를 생성하는 로직을 추가합니다.
  // 단순성을 위해 사용자 유형에 따라 접두어를 추가하고 6자리의 랜덤 숫자를 붙입니다.
  const prefix = {
    personal: 1,
    business: 2,
    organization: 3,
  }[usertype];

  // 0219 추가_상호형
  let randomDigits;
  let userid;

  do {
    randomDigits = Math.floor(10000 + Math.random() * 90000);
    userid = `${prefix}${randomDigits}`;
  } while (usedUserNumbers.has(userid)); // 중복된 userid가 있다면 다시 생성

  usedUserNumbers.add(userid); // Set에 추가

  return userid;
}

//-------------------------------단체고유번호 중복 체크 2/14 김민호---------------------------------
app.post("/checkuniquenumber", (req, res) => {
  const { uniquenumber } = req.body;

  // 데이터베이스에서 이메일이 이미 존재하는지 확인합니다.
  const sql = "SELECT * FROM user WHERE uniquenumber = ?";
  connection.query(sql, [uniquenumber], (err, result) => {
    if (err) {
      console.error("MySQL에서 고유번호 중복 확인 중 오류:", err);
      return res.status(500).json({
        success: false,
        message: "고유번호 중복 확인 중 오류가 발생했습니다.",
        error: err.message,
      });
    }

    if (result.length > 0) {
      // 이미 등록된 사업자인 경우
      return res.status(200).json({
        success: false,
        message: "이미 등록된 고유번호입니다.",
      });
    } else {
      // 중복되지 않은 사업자인 경우
      return res.status(200).json({
        success: true,
        message: "사용 가능한 고유번호 입니다.",
      });
    }
  });
});

//-------------------------------사업자 중복 체크 2/14 김민호---------------------------------
app.post("/checkbusinessnumber", (req, res) => {
  const { businessnumber } = req.body;

  // 데이터베이스에서 이메일이 이미 존재하는지 확인합니다.
  const sql = "SELECT * FROM user WHERE businessnumber = ?";
  connection.query(sql, [businessnumber], (err, result) => {
    if (err) {
      console.error("MySQL에서 사업자번호 중복 확인 중 오류:", err);
      return res.status(500).json({
        success: false,
        message: "사업자 중복 확인 중 오류가 발생했습니다.",
        error: err.message,
      });
    }

    if (result.length > 0) {
      // 이미 등록된 사업자인 경우
      return res.status(200).json({
        success: false,
        message: "이미 등록된 사업자입니다.",
      });
    } else {
      // 중복되지 않은 사업자인 경우
      return res.status(200).json({
        success: true,
        message: "사용 가능한 사업자 입니다.",
      });
    }
  });
});

//-------------------------------이메일 중복 체크 2/14 김민호---------------------------------
app.post("/checkEmailDuplication", (req, res) => {
  const { email } = req.body;

  // 데이터베이스에서 이메일이 이미 존재하는지 확인합니다.
  const sql = "SELECT * FROM user WHERE email = ?";
  connection.query(sql, [email], (err, result) => {
    if (err) {
      console.error("MySQL에서 이메일 중복 확인 중 오류:", err);
      return res.status(500).json({
        success: false,
        message: "이메일 중복 확인 중 오류가 발생했습니다.",
        error: err.message,
      });
    }

    if (result.length > 0) {
      // 이미 등록된 이메일인 경우
      return res.status(200).json({
        success: false,
        message: "이미 등록된 이메일입니다.",
      });
    } else {
      // 중복되지 않은 이메일인 경우
      return res.status(200).json({
        success: true,
        message: "사용 가능한 이메일입니다.",
      });
    }
  });
});
//---------------------------회원가입 기능구현----------------------------------------------
app.post("/register", async (req, res) => {
  // 클라이언트에서 받은 요청의 body에서 필요한 정보를 추출합니다.
  const { username, password, email, address, detailedaddress, phonenumber, usertype: clientUsertype, businessnumber, uniquenumber } = req.body;

  try {
    // 비밀번호를 해시화합니다.
    const hashedPassword = await bcrypt.hash(password, 10);

    // 회원번호를 생성합니다. (6자리)
    const userid = await generateUserid(clientUsertype);

    // 클라이언트에서 받은 usertype을 서버에서 사용하는 usertype으로 변환합니다.
    const usertypeNumber = {
      personal: 1, // 개인
      business: 2, // 기업
      organization: 3, // 단체
    };

    const serverUsertype = usertypeNumber[clientUsertype];

    // MySQL 쿼리를 작성하여 회원 정보를 데이터베이스에 삽입합니다.
    const sql = "INSERT INTO user (userid, username, email, password, address, detailedaddress, phonenumber, usertype, businessnumber, uniquenumber) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    connection.query(sql, [userid, username, email, hashedPassword, address, detailedaddress, phonenumber, serverUsertype, businessnumber, uniquenumber], (err, result) => {
      if (err) {
        // 쿼리 실행 중 에러가 발생한 경우 에러를 처리합니다.
        console.error("MySQL에 데이터 삽입 중 오류:", err);
        return res.status(500).json({
          success: false,
          message: "회원가입 중 오류가 발생했습니다.",
          error: err.message,
        });
      }
      // 회원가입이 성공한 경우 응답을 클라이언트에게 보냅니다.
      // console.log("사용자가 성공적으로 등록됨");
      return res.status(200).json({
        success: true,
        message: "사용자가 성공적으로 등록됨",
        usertype: serverUsertype,
      });
    });
  } catch (error) {
    // 회원가입 중 다른 내부적인 오류가 발생한 경우 에러를 처리합니다.
    console.error("회원가입 중 오류:", error);
    return res.status(500).json({
      success: false,
      message: "내부 서버 오류",
      details: error.message,
    });
  }
});
//---------------------------회원가입 수정구현----------------------------------------------

app.get("/edit-profile/:userId/:usertype", (req, res) => {
  // 클라이언트에서 파라미터로 전달 받은값 반영
  const { userId, usertype } = req.params; // userId, usertype 값 획득
  // const usertype = req.session.usertype;
  // const userid = req.session.userData[0].userid;
  // console.log(req.session);
  // console.log(req.session.userData.userid);

  if (!usertype || !userId) {
    return res.status(401).json({ success: false, message: "로그인되어 있지 않습니다." });
  }

  const sql = "SELECT * FROM user WHERE userid = ?";
  connection.query(sql, [userId], (err, result) => {
    if (err) {
      console.error("사용자 정보 조회 중 오류:", err);
      return res.status(500).json({ success: false, message: "사용자 정보 조회 중 오류가 발생했습니다." });
    }

    const userData = result[0];

    if (!userData) {
      return res.status(404).json({ success: false, message: "사용자 정보를 찾을 수 없습니다." });
    }

    res.json({ usertype: usertype, userId: userId, userData: userData });
  });
});
//---------------------------회원 탈퇴--------------------------------------------------
app.delete("/delete-account/:userId/:userType", (req, res) => {
  const userId = req.params.userId;
  const userType = req.params.userType;

  const tableName = userType === "admin" ? "admin_table" : "user";

  // 주문 테이블에서 해당 유저 아이디를 NULL로 업데이트합니다.
  const updateOrdersQuery = `UPDATE orders SET userid = NULL WHERE userid = ?`;

  connection.query(updateOrdersQuery, [userId], (updateError, updateResults) => {
    if (updateError) {
      console.error("주문 테이블 업데이트 오류:", updateError);
      res.status(500).json({ success: false, message: "주문 테이블 업데이트 오류" });
    } else {
      // console.log("주문 테이블이 성공적으로 업데이트되었습니다");

      // 사용자 테이블에서 사용자를 삭제합니다.
      const deleteQuery = `DELETE FROM ${tableName} WHERE userid = ?`;

      connection.query(deleteQuery, [userId], (error, results) => {
        if (error) {
          console.error("사용자 삭제 오류:", error);
          res.status(500).json({ success: false, message: "사용자 삭제 오류" });
        } else {
          // console.log("사용자가 성공적으로 삭제되었습니다");

          if (tableName === "user") {
            const deleteCommentsQuery = `DELETE FROM campaign_comments WHERE userid = ?`;
            connection.query(deleteCommentsQuery, [userId], (commentsError, commentsResults) => {
              if (commentsError) {
                console.error("관련 댓글 삭제 오류:", commentsError);
              } else {
                // console.log("관련 댓글이 성공적으로 삭제되었습니다");
              }
            });
          }

          res.status(200).json({ success: true, message: "사용자가 성공적으로 삭제되었습니다" });
        }
      });
    }
  });
});
//---------------------------아이디 비밀번호 찾기--------------------------------------------------
//핸드폰번호와 이름 입력시 아이디 알려주기(Email)
//Email 과 이름 입력시 비밀번호 재설정

app.post("/find", (req, res) => {
  const { username, phonenumber } = req.body;

  // MySQL에서 사용자 검색 쿼리 작성
  const sql = "SELECT * FROM user WHERE username = ? AND phonenumber = ?";

  // 쿼리 실행
  connection.query(sql, [username, phonenumber], (err, result) => {
    if (err) {
      console.error("사용자 검색 오류:", err);
      res.status(500).json({ error: "사용자 검색 중 오류가 발생했습니다." });
    } else {
      if (result.length > 0) {
        // 사용자를 찾았을 경우
        const user = result[0];
        res.json({ email: user.email });
      } else {
        // 사용자를 찾지 못했을 경우
        res.status(404).json({ error: "일치하는 사용자가 없습니다." });
      }
    }
  });
});

app.listen(port, () => console.log(`port${port}`));
