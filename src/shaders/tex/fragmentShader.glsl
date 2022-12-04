#version 300 es
precision mediump float;

in vec3 vNormal;
in vec2 vUv;

uniform sampler2D albedoTex;
uniform sampler2D normalTex;
uniform bool edge;
uniform mat4 invMatrix;
uniform vec3 lightPosition;
uniform vec3 eyePosition;
uniform float sdwThreshold;
uniform float hiThreshold;
uniform float rimThreshold;

out vec4 outColor;

void main(void){
    if (edge) {
       outColor   = vec4(0, 0, 0, 1);

    } else {
        // shadow
        vec3  invLight     = normalize(invMatrix * vec4(lightPosition, 0.0)).xyz;
        float halfLambert  = dot(vNormal, invLight) * 0.5 + 0.5;
        vec4  factor       = vec4(vec3(step(halfLambert, sdwThreshold)), 1.0);

        // hight
        vec3  invEye       = normalize(invMatrix * vec4(eyePosition, 0.0)).xyz;
        vec3  halfLE       = normalize(invLight + invEye);
        float specular     = pow(clamp(dot(vNormal, halfLE), 0.0, 1.0), 50.0);
        vec4  stepSpecular = vec4(vec3(step(hiThreshold, specular)), 1.0);

        float rim          = rimThreshold - clamp(dot(vNormal, eyePosition), 0.0, rimThreshold);

        // color
        vec4  smpColor     = texture(albedoTex, vUv);
        vec4  sdwColor     = vec4(0.3, 0.3, 0.3, 1.0);

        outColor = smpColor * (1.0 - factor) + sdwColor * smpColor * factor + rim + (vec4(0.3, 0.3, 0.3, 1.0) * stepSpecular);
    }
}