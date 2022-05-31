import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

declare const google: any;

export default ({ clientId, callback, skipLogin }: { clientId: string, callback: (res: any, err: any) => Promise<void> | void, skipLogin: boolean }) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(skipLogin);
  const handleLogin = async (res: any, err: any) => {
    await callback(res, err);
    if (res) {
      await setIsLoggedIn(true);
    }
  };

  useEffect(() => {
    if (skipLogin) {
      setIsLoggedIn(true);
      navigate('/ancestree', { replace: true });
    } else {
      const scriptLoaded = () => {
        google.accounts.id.initialize({
          client_id: clientId,
          auto_select: true,
          callback: handleLogin,
        });
        google.accounts.id.renderButton(
          document.getElementById("loginBtn"),
          { theme: "outline", size: "large" }
        );
        google.accounts.id.prompt();
      };
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.onload = () => scriptLoaded();
  
      document.body.appendChild(script);
    }
  }, [skipLogin])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '15%' }}>
      {isLoggedIn ? 'Logged In' : 'Awaiting Login'}
      <div>
        {!isLoggedIn && <button id="loginBtn"></button>}
      </div>
    </div>
  )
}