#version 300 es
precision mediump float;

uniform bool edge;
uniform vec3 color;

out vec4 outColor;

void main (void) {

    if (edge) { outColor   = vec4(0, 0, 0, 1); } 
    else { outColor = vec4(color, 1); }
}