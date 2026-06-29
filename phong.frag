#version 120

// phong.frag

// ラスタライザから受け取る視点座標系の頂点の位置の補間値
varying vec4 position;

// ラスタライザから受け取る視点座標系の法線ベクトルの補間値
varying vec3 normal;

void main ()
{
  // 視点座標系の法線ベクトル
  vec3 fnormal = normalize(normal);

  // 視点座標系の光線ベクトル
  vec3 light = normalize((gl_LightSource[0].position * position.w
    - gl_LightSource[0].position.w * position).xyz);

  // 拡散反射率
  float diffuse = max(dot(fnormal, light), 0.0);

  // 視点座標系の視線ベクトル
  vec3 view = -normalize(position.xyz);

  // 視点座標系の中間ベクトル
  vec3 halfway = normalize(light + view);

  // 鏡面反射率
  float specular = pow(max(dot(fnormal, halfway), 0.0), gl_FrontMaterial.shininess);

  // フラグメントの色
  gl_FragColor = gl_FrontLightProduct[0].ambient
               + gl_FrontLightProduct[0].diffuse * diffuse
               + gl_FrontLightProduct[0].specular * specular;
}
