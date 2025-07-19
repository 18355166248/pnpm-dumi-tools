let notLogin = false;

export function validateLogin(oldRender: any) {
  fetch('/common-recharge/xicoin/balance?domain=1', {
    method: 'POST',
  }).then((res) => {
    if (res.status === 401) {
      goLogin();
      return;
    }
    oldRender();
  });
}

function goLogin() {
  if (notLogin) return;
  notLogin = true;

  const { hostname } = window.location;
  let origin = 'https://passport.ximalaya.com';
  if (hostname.includes('localhost') || hostname.includes('test')) {
    origin = 'https://passport.test.ximalaya.com';
  }
  const url = `${origin}/page/web/login?fromUri=${window.location.href}`;

  window.location.replace(url);
}
