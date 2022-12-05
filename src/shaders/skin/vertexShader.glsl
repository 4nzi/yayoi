#version 300 es

layout (location = 0) in vec3 position;
layout (location = 1) in vec3 normal;
layout (location = 2) in vec2 uv;
layout (location = 3) in vec4 weights;
layout (location = 4) in vec4 boneIdx;

uniform mat4 mMatrix;
uniform mat4 vMatrix;
uniform mat4 pMatrix;
uniform bool edge;
uniform float edgeWidth;
uniform mat4 bones[76];

out vec3 vNormal;
out vec2 vUv;

void main(void){
    mat4 mvpMatrix = pMatrix * vMatrix * mMatrix;

    gl_Position = mvpMatrix * (bones[int(boneIdx[0])] * vec4(position, 1.0) * weights[0] +
                                bones[int(boneIdx[1])]  * vec4(position, 1.0) * weights[1] +
                                bones[int(boneIdx[2])]  * vec4(position, 1.0) * weights[2] +
                                bones[int(boneIdx[3])]  * vec4(position, 1.0) * weights[3]);

    vNormal = normal;
    vUv     = uv;
} 