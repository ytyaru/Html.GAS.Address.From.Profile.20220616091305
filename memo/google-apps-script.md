# GAS(Google Apps Script)のCORSエラーを解決する方法

* https://knmts.com/become-engineer-31/

　`Content-Type`を`application/json`にするとCORSエラーになる。

`Content-Type`|結果
--------------|----
`application/json`|❌
`x-www-form-urlencoded`|⭕
`text/plain`|⭕

## フロントエンドからGASへリクエストする

```javascript
const postReservation = async (name, email) => {
  const endPoint = 'https://script.google.com/macros/s/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx/exec';
  const res = await fetch(endPoint, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `name=${name}&email=${email}`,
  });
  if (res.ok) console.log('okです！'); // okですね。
};
```

## GASでパラメータを受け取る

```javascript
const doPost = (e) => {
  const name = e.parameters['name'][0];
  const email = e.parameters['email'][0];
  // 以降処理は続く...
};
```

