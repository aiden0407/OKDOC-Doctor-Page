//React
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'context';

//Components
import Layout from 'components/Layout';

//Pages
import Login from 'pages/Login';
import Calendar from 'pages/Calendar';

function App() {
  return (
    <Provider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />

          <Route path="/*" element={
            <Layout>
              <Routes>
                <Route path="/calendar" element={<Calendar />} />
              </Routes>
            </Layout>
          } />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;