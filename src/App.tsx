import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import GoogleAuth from "./Components/GoogleAuth";
import AncesTree from "./Pages/AncesTree";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';

function App() {
  const navigate = useNavigate();
  const handleLogin = async (res: any, err: any) => {
    console.log('login callback res: ', res);
    console.log('login callback err: ', err);
    if (res?.credential) {
      await localStorage.setItem('token', res.credential);
      navigate('/ancestree', { replace: true });
    }
  }

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={
            <Navigate to="/ancestree/family" />
          }
        />
        <Route
          path="/ancestree"
          element={
            <Navigate to="/ancestree/family" />
          }
        />
        <Route
          path="/login"
          element={
            <GoogleAuth clientId={GOOGLE_CLIENT_ID} callback={handleLogin} skipLogin={!!localStorage.getItem('token')} />
          }
        />
        <Route
          path="/ancestree/:family"
          element={
            localStorage.getItem('token') ? <AncesTree /> : <Navigate to="/login" />
          } 
        />
      </Routes>
    </div>
  );
}

export default App;
