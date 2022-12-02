#version 300 es
precision mediump float;

uniform bool edge;
uniform vec3 color;
uniform mat4 invMatrix;
uniform vec3 lightPosition;
in vec3 vNormal;
in vec2 vUv;
out vec4 outColor;

void main(void){
    vec3  invLight     = normalize(invMatrix * vec4(lightPosition, 0.0)).xyz;
    float halfLambert  = dot(vNormal, invLight) * 0.5 + 0.5;
    vec4  factor       = vec4(vec3(step(0.5, halfLambert)), 1.0);


    if(edge){
       outColor   = vec4(0, 0, 0, 1);
       
    }else{
        outColor = vec4(color, 1);
    }
}