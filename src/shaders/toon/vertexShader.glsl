#version 300 es

layout (location = 0) in vec3 position;
layout (location = 1) in vec3 normal;
layout (location = 2) in vec2 uv;

uniform mat4 mMatrix;
uniform mat4 vMatrix;
uniform mat4 pMatrix;
uniform bool edge;
out vec3 vNormal;
out vec2 vUv;

void main(void){
    vec3  pos      = position;

    if(edge){
        pos        += normal * 0.03;
    }
    
    gl_Position    = pMatrix * vMatrix * mMatrix * vec4(pos, 1.0);

    vNormal        = normal;
    vUv            = uv;
}