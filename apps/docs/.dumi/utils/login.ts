export function validateLogin(oldRender: any) {
  fetch('/common-recharge/xicoin/balance?domain=1', {
    method: 'POST',
  }).then((res) => {
    oldRender();
  });
}

// function goLogin() {}
