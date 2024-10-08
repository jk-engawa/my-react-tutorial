// RedirectPage.js
import React, { useEffect } from 'react';

function RedirectPage() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    // 親ウィンドウにコードを送信
    window.opener.postMessage({ code }, window.location.origin);
    window.close();
  }, []);

  return <div>リダイレクト中...</div>;
}

export default RedirectPage;
