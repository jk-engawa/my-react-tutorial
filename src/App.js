// App.js
import React, { useState, useEffect } from 'react';
import { config } from './config';
import { generateRandomString, generateCodeChallenge } from './utility';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const handleMessage = async (event) => {
      if (event.origin !== window.location.origin) return;

      const { code } = event.data;
      if (code) {
        const codeVerifier = sessionStorage.getItem('code_verifier');
        sessionStorage.removeItem('code_verifier'); // セキュリティのため削除

        // トークンエンドポイントにリクエスト
        const tokenResponse = await fetch(config.tokenEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: config.redirectUri,
            client_id: config.clientId,
            code_verifier: codeVerifier,
          }),
        });

        const tokenData = await tokenResponse.json();

        // ユーザー情報を取得
        const userInfoResponse = await fetch(config.userInfoEndpoint, {
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
          },
        });

        const userInfo = await userInfoResponse.json();
        setUser(userInfo);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleLogin = async () => {
    const codeVerifier = generateRandomString(64);
    sessionStorage.setItem('code_verifier', codeVerifier);
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    const state = generateRandomString(16);

    const url = `${config.authorizationEndpoint}?` + new URLSearchParams({
      response_type: 'code',
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      scope: config.scope,
      state: state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
    });

    const width = 500;
    const height = 600;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;

    window.open(
      url,
      'Login',
      `width=${width},height=${height},left=${left},top=${top}`
    );
  };

  return (
    <div>
      {user ? (
        <div style={{ position: 'absolute', top: 10, right: 10 }}>
          <img
            src={user.picture}
            alt="User Icon"
            style={{ width: 30, borderRadius: '50%' }}
          />
          <span>{user.nickname}</span>
        </div>
      ) : (
        <div style={{ display: 'flex', height: '100vh' }}>
          <button
            onClick={handleLogin}
            style={{
              margin: 'auto',
              padding: '10px 20px',
              fontSize: '16px',
            }}
          >
            ログイン
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
