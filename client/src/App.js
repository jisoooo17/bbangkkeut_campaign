import "./App.css";
import { Routes, Route } from "react-router-dom";
// import { useState, useEffect } from "react";
import Main from "./views/Main";
import Campaign from "./views/Campaign";
import CampaignWrite from "./views/CampaignWrite";
import CampaignDetail from "./views/CampaignDetail";
import CampaignEdit from "./views/CampaignEdit";
import CampaignForm from "./views/CampaignForm";
import CampaignApplication from "./views/CampaignApplication";

// 김민호(임시)-----------------
import LoginPage from "./component/Logins/Login";
import Modify from "./component/Logins/Modify";
import Register from "./component/Logins/Register";
import RegisterPersonal from "./component/Logins/RegisterPersonal";
import RegisterCorporate from "./component/Logins/RegisterCorporate";
import RegisterGroup from "./component/Logins/RegisterGroup";
import Find from "./component/Logins/Find";


import CarbonFootprint from "./views/CarbonFootprint";

import MyPage from "./views/Mypage";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Main />}></Route>
        {/* 김지수 */}
        <Route path="/campaign" element={<Campaign />}></Route>
        <Route path="/campaign/write" element={<CampaignWrite />}></Route>
        <Route path="/campaign/edit/:id" element={<CampaignEdit />}></Route>
        <Route path="/campaign/detail/:id" element={<CampaignDetail />}></Route>
        <Route path="/campaign/form/:id" element={<CampaignForm />}></Route>
        <Route path="/campaign/form/:id/application" element={<CampaignApplication />}></Route>
        {/* 상호형 */}
        <Route exact path="/carbonFootprint" element={<CarbonFootprint />} />
        <Route exact path="/mypage" element={<MyPage />} />
        {/* 김민호 */}
        <Route path="/Login/" element={<LoginPage />}></Route>
        <Route path="/Modify" element={<Modify />}></Route>
        <Route path="/Register" element={<Register />}></Route>
        <Route path="/Register/personal" element={<RegisterPersonal />}></Route>
        <Route path="/Register/corporate" element={<RegisterCorporate />}></Route>
        <Route path="/Register/group" element={<RegisterGroup />}></Route>
        <Route path="/Find" element={<Find/>}></Route>
      </Routes>
    </div>
  );
}

export default App;
