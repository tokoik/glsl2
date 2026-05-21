#version 120

// phong.vert

// ラスタライザに送る頂点の位置
varying vec4 position;

// ラスタライザに送る頂点の法線ベクトル
varying vec3 normal;

void main()
{
  // 頂点位置
  position = gl_ModelViewMatrix * gl_Vertex;

  // 法線ベクトル
  normal = normalize(gl_NormalMatrix * gl_Normal);

  // gouraud.vert の途中削除

  // 頂点位置
  gl_Position = ftransform();
}
