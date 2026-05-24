#version 120

// gouraud.vert

void main()
{
  // 頂点のクリッピング座標値
  gl_Position = ftransform();

  // 頂点のワールド座標値
  vec4 position = gl_ModelViewMatrix * gl_Vertex;

  // 法線ベクトル
  vec3 normal = normalize(gl_NormalMatrix * gl_Normal);

  // 光線ベクトル
  vec3 light = normalize((gl_LightSource[0].position * position.w
    - gl_LightSource[0].position.w * position).xyz);

  // 視線ベクトル
  vec3 view = -normalize(position.xyz);

  // 中間ベクトル
  vec3 halfway = normalize(light + view);

  // 拡散反射率
  float diffuse = max(dot(light, normal), 0.0);

  // 鏡面反射率
  float specular = pow(max(dot(normal, halfway), 0.0), gl_FrontMaterial.shininess);

  // 頂点の色
  gl_FrontColor = gl_FrontLightProduct[0].ambient
                + gl_FrontLightProduct[0].diffuse * diffuse
                + gl_FrontLightProduct[0].specular * specular;

}
