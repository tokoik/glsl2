#version 120

// phong.frag

// ラスタライザから受け取る頂点の法線ベクトルの補間値
varying vec3 normal;

// ラスタライザから受け取る光線ベクトルの補間値
varying vec3 light;

// ラスタライザから受け取る中間ベクトルの補間値
varying vec3 halfway;

void main ()
{
  // 法線ベクトル
  vec3 fnormal = normalize(normal);

  // 光線ベクトル
  vec3 flight = normalize(light);
  
  // 中間ベクトル
  vec3 fhalfway = normalize(halfway);

  // 拡散反射率
  float diffuse = max(dot(fnormal, flight), 0.0);

  // 鏡面反射率
  float specular = pow(max(dot(fnormal, fhalfway), 0.0), gl_FrontMaterial.shininess);

  // フラグメントの色
  gl_FragColor = gl_FrontLightProduct[0].ambient
               + gl_FrontLightProduct[0].diffuse * diffuse
               + gl_FrontLightProduct[0].specular * specular;
}
