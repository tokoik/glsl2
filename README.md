# glsl2 - 第２回 Gouraud シェーディングと Phong シェーディング サンプルプログラム

## 1. 概要

このプログラムは、OpenGL における「テクスチャマッピング (Texture Mapping)」の基礎を学ぶための、学生向けのサンプルプログラムです。本プログラムは、以下のブログ記事の解説に沿って学習を進めるための雛形として提供されています。

- [第２回 シェーダプログラムの読み込み](https://tokoik.github.io/blog/glsl%20%E5%85%A5%E9%96%80/2005/10/07/glsl.html)

このプログラムは、ブログ記事の手順に従って、[第１版ソースファイル](https://github.com/tokoik/glsl1)に対して Gouraud および Phong の手法による陰影付けを追加したものです。

## 2. ビルド方法

このプログラムは [CMake](https://cmake.org/) を用いてビルド環境を整備します。各OSとも、ソースコードが置かれているディレクトリにターミナル（またはコマンドプロンプト）で移動してから、以下の手順を実行してください。なお、プログラムをビルドするためのバイナリディレクトリは、バージョン管理ファイル（.gitignore）の設定に合わせて `build` という名前にします。

### 2.1 Windows (Visual Studio 2022 の場合)

1. コマンドプロンプトまたは PowerShell を開き、このプロジェクトのディレクトリに移動します。
2. 以下のコマンドを実行してビルドディレクトリを作成し、CMake で構成を行います。

   ```bat
   mkdir build
   cd build
   cmake .. -G "Visual Studio 17 2022"
   ```

3. 生成された `build` フォルダ内の `glsl2.sln` を Visual Studio で開きます。
4. ソリューションエクスプローラーで `glsl2` プロジェクトを右クリックし、「スタートアップ プロジェクトに設定」を選択します。
5. 「ローカル Windows デバッガー」をクリックするか、F5 キーを押してビルドおよび実行します。

### 2.2 macOS (Xcode の場合)

1. ターミナルを開き、このプロジェクトのディレクトリに移動します。
2. 以下のコマンドを実行してビルドディレクトリを作成し、Xcode 用のプロジェクトを生成します。

   ```sh
   mkdir build
   cd build
   cmake .. -G Xcode
   ```

3. 生成された `build/glsl2.xcodeproj` を Xcode で開きます。
4. 左上のスキーム選択（再生ボタンの横）が `glsl2` になっていることを確認します。
5. 「Run」ボタン（再生ボタン）をクリックするか、Command + R を押してビルドおよび実行します。

### 2.3 Ubuntu Linux

1. ターミナルを開き、このプロジェクトのディレクトリに移動します。
2. 必要なパッケージ（freeglut3-dev など）がインストールされていることを確認し、以下のコマンドでビルドします。

   ```sh
   mkdir build
   cd build
   cmake ..
   make
   ```

## 3. 使い方

### 3.1 プログラムの起動方法

各OSとも、ビルド後に生成されるバイナリディレクトリ (`build`) やそのサブフォルダから起動します。（※ CMake の設定により、Windows や Xcode では `Debug` などのフォルダ下に実行ファイルが置かれることがあります）

- **Windows**

  Visual Studio 上で「ローカル Windows デバッガー」をクリックして実行するか、またはコマンドプロンプトから以下のコマンドで起動します。

  ```cmd
  cd build\Debug
  glsl2.exe
  ```

- **macOS**

  Xcode 上で左上の「Run（再生ボタン）」をクリックするのが楽です。これにより `glsl2.app` アプリケーションバンドルとして自動的に実行されます。アプリケーションバンドルを直接起動するなら、Finder から `build/Debug/glsl2.app` をダブルクリックするか、ターミナルから `open build/Debug/glsl2.app` を実行します (この場合はエラーメッセージ等が表示されません)。

- **Ubuntu Linux**

  ターミナルから以下のコマンドで実行ファイル（バイナリ）を直接起動します。

  ```sh
  cd build
  ./glsl2
  ```

### 3.2 操作方法

- **マウスの左ボタンでドラッグ**

  画面内のオブジェクト（四角形またはティーポット）を３次元的に回転させることができます。

- **キーボードの q, Q または ESC キー**

  プログラムを終了します。

## 4. 解説

このプログラムの主要なソースコードである [main.cpp](https://github.com/tokoik/glsl2/blob/main/main.cpp) は、前回のプロジェクトである [glsl1](https://github.com/tokoik/glsl1) をベースに、OpenGL (GLUT) と GLSL (OpenGL Shading Language) を用いて **Gouraud（グーロー）シェーディング** および **Phong（フォン）シェーディング** による陰影付け（ライティング）を実装したものです。

### 4.1 陰影計算の基本設定

本プログラムでは、光源および材質の設定は `main.cpp` の中で行っていますが、実際のカラー計算処理は GLSL シェーダ側で実装されています。

1. **光源と材質の初期設定 (`init()` 関数)**
   - `GL_LIGHTING` と `GL_LIGHT0` を有効化し、光源の拡散反射成分 (`GL_DIFFUSE`)、鏡面反射成分 (`GL_SPECULAR`)、環境光成分 (`GL_AMBIENT`) を設定します。
   - `glLightModeli(GL_LIGHT_MODEL_LOCAL_VIEWER, GL_TRUE)` を設定し、視点位置を無限遠ではなくローカル座標系（有限の距離）として扱うことで、より正確なハイライト（鏡面反射）計算を行えるようにしています。
2. **シーンの描画と材質設定 (`scene()` 関数)**
   - 描画するオブジェクト（四角形ポリゴンまたはティーポット）に対し、拡散反射係数 (`GL_AMBIENT_AND_DIFFUSE`)、鏡面反射係数 (`GL_SPECULAR`)、および輝き係数 (`GL_SHININESS`, 値: `100.0f`) を設定します。
   - `#define DRAW_TEAPOT` を `1` に設定することで、3D のティーポットを描画できます。
3. **描画ループでのシェーダと光源の適用 (`display()` 関数)**
   - `glUseProgram(gl2Program)` を呼び出してシェーダプログラムを適用した後に、モデルビュー行列の初期化と `glLightfv(GL_LIGHT0, GL_POSITION, lightpos)` による光源位置の設定を行います。これにより、光源の位置情報が正しく視点座標系に変換され、シェーダに伝わります。

### 4.2 シェーダプログラムの切り替え

`main.cpp` の `init()` 関数内で、読み込むバーテックスシェーダおよびフラグメントシェーダのファイルを変更することで、Gouraud シェーディングと Phong シェーディングを切り替えることができます。

* **Gouraud シェーディングを使用する場合:**
  ```cpp
  if (readShaderSource(vertShader, "gouraud.vert")) exit(1);
  if (readShaderSource(fragShader, "gouraud.frag")) exit(1);
  ```
* **Phong シェーディングを使用する場合 (デフォルト設定):**
  ```cpp
  if (readShaderSource(vertShader, "phong.vert")) exit(1);
  if (readShaderSource(fragShader, "phong.frag")) exit(1);
  ```

### 4.3 ロードされる各シェーダの処理内容

#### 4.3.1 Gouraud シェーディング

Gouraud シェーディングでは、**頂点単位（バーテックスシェーダ）**で陰影（ライティング）計算を行い、ポリゴン内部の画素（フラグメント）の色は各頂点色の線形補間によって決定されます。

1. **バーテックスシェーダ ([gouraud.vert](https://github.com/tokoik/glsl2/blob/main/gouraud.vert))**
   - 頂点の視点座標系での位置 `position` と法線ベクトル `normal` を計算し、そこから光線ベクトル `light`、視線ベクトル `view`、中間ベクトル `halfway` を算出します。
   - Blinn-Phong 反射モデルに基づき、拡散反射率 `diffuse = max(dot(light, normal), 0.0)` と鏡面反射率 `specular = pow(max(dot(normal, halfway), 0.0), gl_FrontMaterial.shininess)` を求めます。
   - 最終的な頂点の色を計算し、組み込みの出力変数 `gl_FrontColor` に設定します。

   ```glsl
   #version 120
   // gouraud.vert

   void main(void)
   {
     // 頂点位置（視点座標系）
     vec4 position = gl_ModelViewMatrix * gl_Vertex;

     // 法線ベクトル（視点座標系）
     vec3 normal = normalize(gl_NormalMatrix * gl_Normal);

     // 光線ベクトル
     vec3 light = normalize((gl_LightSource[0].position * position.w
       - gl_LightSource[0].position.w * position).xyz);

     // 視線ベクトル（視点から頂点への逆ベクトル）
     vec3 view = -normalize(position.xyz);

     // 中間ベクトル（光線ベクトルと視線ベクトルのハーフウェイベクトル）
     vec3 halfway = normalize(light + view);

     // 拡散反射率
     float diffuse = max(dot(light, normal), 0.0);

     // 鏡面反射率（Blinn-Phongモデル）
     float specular = pow(max(dot(normal, halfway), 0.0), gl_FrontMaterial.shininess);

     // 頂点の色を計算して出力
     gl_FrontColor = gl_FrontLightProduct[0].ambient
                   + gl_FrontLightProduct[0].diffuse * diffuse
                   + gl_FrontLightProduct[0].specular * specular;

     // 頂点位置の射影変換
     gl_Position = ftransform();
   }
   ```

2. **フラグメントシェーダ ([gouraud.frag](https://github.com/tokoik/glsl2/blob/main/gouraud.frag))**
   - 頂点シェーダで計算され、ラスタライザによって線形補間された色 `gl_Color` を、そのままフラグメントの出力色 `gl_FragColor` に設定します。

   ```glsl
   #version 120
   // gouraud.frag

   void main (void)
   {
     // 補間された色をそのまま出力
     gl_FragColor = gl_Color;
   }
   ```

#### 4.3.2 Phong シェーディング

Phong シェーディングでは、頂点シェーダは位置と法線ベクトルの受け渡しのみを行い、**画素（フラグメント）単位（フラグメントシェーダ）**で陰影（ライティング）計算を行います。これにより、ポリゴン境界を目立たなくし、滑らかな曲面とシャープで美しい鏡面反射ハイライトを表現できます。

1. **バーテックスシェーダ ([phong.vert](https://github.com/tokoik/glsl2/blob/main/phong.vert))**
   - 頂点位置と法線ベクトルを視点座標系に変換し、それぞれフラグメントシェーダへ渡す `varying` 変数である `position` および `normal` に代入します。

   ```glsl
   #version 120
   // phong.vert

   varying vec4 position;
   varying vec3 normal;

   void main(void)
   {
     // 頂点位置と法線ベクトルを計算し、フラグメントシェーダへ送る
     position = gl_ModelViewMatrix * gl_Vertex;
     normal = normalize(gl_NormalMatrix * gl_Normal);

     // 頂点位置の射影変換
     gl_Position = ftransform();
   }
   ```

2. **フラグメントシェーダ ([phong.frag](https://github.com/tokoik/glsl2/blob/main/phong.frag))**
   - 補間されて送られてきた `normal` は、線形補間の影響で単位ベクトルではなくなっているため、まず再正規化を行って `fnormal` を得ます。
   - 各画素の位置における光線、視線、中間ベクトルを算出し、フラグメント単位で陰影計算を行い、結果を `gl_FragColor` に出力します。

   ```glsl
   #version 120
   // phong.frag

   varying vec4 position;
   varying vec3 normal;

   void main (void)
   {
     // 補間された法線ベクトルを再正規化
     vec3 fnormal = normalize(normal);

     // 光線ベクトル
     vec3 light = normalize((gl_LightSource[0].position * position.w
       - gl_LightSource[0].position.w * position).xyz);

     // 視線ベクトル
     vec3 view = -normalize(position.xyz);

     // 中間ベクトル
     vec3 halfway = normalize(light + view);

     // 拡散反射率
     float diffuse = max(dot(fnormal, light), 0.0);

     // 鏡面反射率（Blinn-Phongモデル）
     float specular = pow(max(dot(fnormal, halfway), 0.0), gl_FrontMaterial.shininess);

     // フラグメントの最終色を算出して出力
     gl_FragColor = gl_FrontLightProduct[0].ambient
                  + gl_FrontLightProduct[0].diffuse * diffuse
                  + gl_FrontLightProduct[0].specular * specular;
   }
   ```
