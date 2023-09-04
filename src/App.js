//React
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'context';

//Components
import Layout from 'components/Layout';

//Pages
import Login from 'pages/Login';
import FindPassword from 'pages/Login/FindPassword';
import Calendar from 'pages/Calendar';
import Schedule from 'pages/Schedule';
import Detail from 'pages/Detail';
import Telemedicine from 'pages/Telemedicine';
import Info from 'pages/Setting/Info';
import Password from 'pages/Setting/Password';

function App() {
  return (
    <Provider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/find-password" element={<FindPassword />} />

          <Route path="/*" element={
            <Layout>
              <Routes>
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/schedule" element={<Schedule />} />
                <Route path="/calendar/detail" element={<Detail />} />
                <Route path="/schedule/detail" element={<Detail />} />
                <Route path="/telemedicine" element={<Telemedicine />} />
                <Route path="/setting/info" element={<Info />} />
                <Route path="/setting/pw" element={<Password />} />
              </Routes>
            </Layout>
          } />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;