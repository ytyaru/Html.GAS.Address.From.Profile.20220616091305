# GASのPOSTをリアルタイム通知したい

　Web Pushのようなことができないか。探したらFirebaseの通知APIをリクエストすれば可能らしい。

* https://teratail.com/questions/242637

## GASのリクエスト上限をできるかぎり回避する案

1. POSTされる
2. 通知する
3. 全件GETする
4. 3を毎日一回JSONファイルとしてGitHubなどにアップする（またはPOSTされるたびにアップする）
5. データ取得に関してはすべて4にアクセスする
6. 5のおかげでGETする負荷をGitHubに分散できる

