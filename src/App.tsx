import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import GoogleAuth from "./Components/GoogleAuth";
import AncesTree from "./Pages/AncesTree";

declare const window: {
  _env_: Record<string, string>,
};

function App() {
  const navigate = useNavigate();
  const handleLogin = async (res: any, err: any) => {
    if (res?.credential) {
      await localStorage.setItem('token', res.credential);
      navigate('/ancestree', { replace: true });
    }
  }
  const GOOGLE_CLIENT_ID = window._env_.GOOGLE_CLIENT_ID;

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
            <GoogleAuth clientId={GOOGLE_CLIENT_ID || ''} callback={handleLogin} skipLogin={!!localStorage.getItem('token')} />
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
