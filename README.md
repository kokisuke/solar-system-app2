# 3D太陽系モデル（距離比率をリアルにしたver.）

## 概要

このアプリケーションは、HTML、CSS、およびThree.js（JavaScriptライブラリ）を使用して構築されたインタラクティブな3D太陽系モデルです。ネオンカラーで表現された太陽と惑星が、パーティクルで生成された星空を背景に公転します。マウス操作で視点を自由に動かし、太陽系を様々な角度から観察することができます。

## インストール方法

このアプリケーションを実行するには、Node.jsとnpm（Node Package Manager）が必要です。まだインストールされていない場合は、[Node.js公式サイト](https://nodejs.org/)からインストールしてください。

1.  **プロジェクトのクローンまたはダウンロード**: まず、このプロジェクトのファイルをローカルに保存します。

2.  **依存関係のインストール**: プロジェクトのルートディレクトリで、以下のコマンドを実行して必要なライブラリ（Three.js）をインストールします。
    ```bash
    npm install
    ```

3.  **開発サーバーの起動**: 以下のコマンドを実行して、開発サーバーを起動します。
    ```bash
    npm run dev
    ```
    サーバーが起動すると、通常 `http://localhost:5173` のようなURLが表示されます。

4.  **ブラウザで開く**: 表示されたURLをウェブブラウザで開くと、アプリケーションが実行されます。

## GitHub Pagesへのデプロイ方法

このアプリケーションをGitHub Pagesで公開するには、以下の手動手順が必要です。

1.  **`index.html`の修正**: `index.html`ファイルを開き、`<script type="module" src="main.js"></script>` の行を以下のように修正してください。
    ```html
    <script type="module" src="/solar-system-app/main.js"></script>
    ```
    （`/solar-system-app/` の部分は、あなたのGitHubリポジトリ名に合わせてください。）

2.  **デプロイ用ファイルの準備**: プロジェクトのルートディレクトリで、以下のコマンドを実行し、公開に必要なファイルを`dist`ディレクトリにコピーします。
    ```bash
    rm -rf dist
    mkdir dist
    cp index.html style.css main.js dist/
    ```

3.  **GitHubリポジトリへのアップロード**: 
    *   ウェブブラウザであなたのGitHubリポジトリ（例: `https://github.com/kokisuke/solar-system-app`）にアクセスします。
    *   `gh-pages`ブランチに切り替えるか、存在しない場合は作成します。
    *   「Add file」または「Upload files」をクリックし、ローカルの`dist`ディレクトリの中身（`index.html`, `style.css`, `main.js`）をすべてアップロードします。`node_modules`ディレクトリはアップロードしないでください。

4.  **GitHub Pagesの設定**: 
    *   GitHubリポジトリの「Settings」タブをクリックします。
    *   左側のメニューから「Pages」を選択します。
    *   「Source」のドロップダウンメニューで「`gh-pages` branch」を選択し、「Save」をクリックします。

これらの手順が完了すると、数分以内にGitHub PagesのURL（例: `https://kokisuke.github.io/solar-system-app/`）でアプリケーションが公開されます。

## 操作方法

*   **惑星の公転速度と距離**: 各惑星は実際の公転周期と太陽からの距離の比率に基づいて公転します。視覚的な鑑賞のために、全体の速度とスケールは調整されています。
*   **星空**: 太陽系の中心から一定の範囲内には星が生成されないため、惑星の周りはクリアな空間になっています。
*   **視点の回転**: マウスの**左ボタン**を押したままドラッグすると、太陽系全体を360度回転させることができます。ドラッグを離すと、慣性でしばらく回転が続き、その後自動回転に戻ります。
*   **視点の移動（パン）**: マウスの**右ボタン**を押したままドラッグすると、画面を上下左右に平行移動させることができます。
*   **ズームイン・ズームアウト**: マウスの**スクロールホイール**を上下に動かすと、視点の中心に対してズームイン・ズームアウトできます。
*   **惑星へのフォーカス**: 任意の**惑星をクリック**すると、カメラの視点がその惑星に切り替わり、その惑星を中心に自動回転するようになります。手動で回転やズームも可能です。
*   **全体表示に戻る**: 惑星以外の**背景（星空）をクリック**すると、視点が太陽に戻り、太陽系全体の自動回転が再開されます。
