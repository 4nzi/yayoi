#version 300 es
precision mediump float;

uniform sampler2D albedoTex;
uniform sampler2D normalTex;
uniform bool edge;
uniform mat4 invMatrix;
uniform vec3 lightDirection;
in vec3 vNormal;
in vec2 vUv;
out vec4 outColor;

void main(void){
    vec3  invLight     = normalize(invMatrix * vec4(lightDirection, 0.0)).xyz;
    float halfLambert  = dot(vNormal, invLight) * 0.5 + 0.5;
    vec4  factor       = vec4(vec3(step(0.5, halfLambert)), 1.0);


    if(edge){
       outColor   = vec4(0.0, 0.0, 0.0, 1.0);
       
    }else{
        vec4 smpColor = texture(albedoTex, vUv);
        vec4 sdwColor = vec4(0.3, 0.3, 0.3, 1.0);

        outColor = smpColor * (1.0 - factor) + sdwColor * smpColor * factor;
    }
}