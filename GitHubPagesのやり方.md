# 業務効率化診断Proを GitHub Pages で公開する手順

## 準備：以下がインストールされているか確認

- **Node.js** … 入っていれば `npm` が使えます
- **Git** … [Git for Windows](https://git-scm.com/download/win) から入れられます

---

## 手順1：パッケージを入れる

1. キーボードで **Windows キー + R** を押す
2. 「**powershell**」と入力して Enter
3. 次のコマンドを **1行ずつ** コピーして貼り付け、Enter で実行

```powershell
cd C:\Users\PC_User\Desktop\gyomu-shindan-pro\efficiency-diagnostic
npm install
```

「added xxx packages」のような表示が出ればOKです。

---

## 手順2：Git で GitHub にコードを送る

**同じ PowerShell のまま**、次を **1行ずつ** 実行します。

```powershell
cd C:\Users\PC_User\Desktop\gyomu-shindan-pro
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/lunamoon-00/gyomu-shindan-pro.git
git push -u origin main
```

- **git push** のとき、GitHub の **ユーザー名** と **パスワード** を聞かれた場合  
  - パスワードには **Personal Access Token** を使います（通常のログイン用パスワードでは不可）  
  - Token の作り方: GitHub → 右上のアイコン → **Settings** → **Developer settings** → **Personal access tokens** → **Generate new token** で発行し、そのトークンをパスワード欄に入力

---

## 手順3：GitHub の設定で Pages を有効にする

1. ブラウザで **https://github.com/lunamoon-00/gyomu-shindan-pro** を開く
2. 上のタブから **Settings** をクリック
3. 左の一覧で **Pages** をクリック
4. **Source** で「**Deploy from a branch**」を選ぶ
5. **Branch** で「**gh-pages**」を選び、右は「**/ (root)**」のまま
6. **Save** をクリック  
   （この時点ではまだ gh-pages が無いので、手順4のあとでもう一度ここで **gh-pages** を選び直してください）

---

## 手順4：サイトをデプロイする

PowerShell で、次の2行を実行します。

```powershell
cd C:\Users\PC_User\Desktop\gyomu-shindan-pro\efficiency-diagnostic
npm run deploy
```

「Published» や「Done»」のような表示が出れば成功です。

---

## 手順5：公開URLを確認する

数分待ってから、次のURLをブラウザで開きます。

**https://lunamoon-00.github.io/gyomu-shindan-pro/**

ここで「業務効率化診断 Pro」が表示されれば公開完了です。

---

## うまくいかないとき

- **「git は認識されません」**  
  → Git をインストールして、PowerShell をいったん閉じてから開き直す  
- **「npm は認識されません」**  
  → Node.js をインストールして、PowerShell を開き直す  
- **push でパスワードを聞かれる**  
  → GitHub の **Personal Access Token** をパスワード欄に入力する  
- **「gh-pages ブランチがありません」**  
  → 手順4の `npm run deploy` を先に実行すると、`gh-pages` ブランチが作られます。その後、GitHub の Settings → Pages で **Branch: gh-pages** を選び直して Save
