#version 120

// phong.frag

varying vec4 position;
varying vec3 normal;

void main (void)
{
  // 法線ベクトル（のフラグメントにおける補間値）
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

  // 鏡面反射率
  float specular = pow(max(dot(fnormal, halfway), 0.0), gl_FrontMaterial.shininess);

  // フラグメントの色
  gl_FragColor = gl_FrontLightProduct[0].ambient
               + gl_FrontLightProduct[0].diffuse * diffuse
               + gl_FrontLightProduct[0].specular * specular;
}
