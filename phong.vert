#version 120

// phong.vert

// ラスタライザに送る視点座標系の頂点の位置
varying vec4 position;

// ラスタライザに送る視点座標系の法線ベクトル
varying vec3 normal;

void main()
{
  // 頂点のクリッピング座標値
  gl_Position = ftransform();

  // 視点座標系の頂点の位置
  position = gl_ModelViewMatrix * gl_Vertex;

  // 視点座標系の法線ベクトル
  normal = normalize(gl_NormalMatrix * gl_Normal);

  //
  // gouraud.vert の以下削除 (phong.frag に移動)
  //
}
