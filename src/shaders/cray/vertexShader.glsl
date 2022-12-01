#version 300 es

layout (location = 0) in vec3 position;

uniform mat4 mMatrix;
uniform mat4 vMatrix;
uniform mat4 pMatrix;

void main(void){
    gl_Position    = pMatrix * vMatrix * mMatrix * vec4(position, 1.0);
}