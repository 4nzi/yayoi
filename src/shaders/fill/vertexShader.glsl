#version 300 es

layout (location = 0) in vec3 position;
layout (location = 1) in vec3 normal;

uniform mat4 mMatrix;
uniform mat4 vMatrix;
uniform mat4 pMatrix;
uniform bool edge;
uniform float edgeWidth;


void main(void){
    vec3  pos = position;

    if (edge) {  pos += normal * float(edgeWidth); }
    
    gl_Position = pMatrix * vMatrix * mMatrix * vec4(pos, 1.0);
}