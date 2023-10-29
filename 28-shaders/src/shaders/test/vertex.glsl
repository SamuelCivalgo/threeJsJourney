uniform vec2 uFrequency;
uniform float uTime;

varying vec2 vUv;
varying float vElevation;

float mapValue(float value, float inputMin, float inputMax, float outputMin, float outputMax) {
  float normalized = smoothstep(inputMin, inputMax, value);
  return mix(outputMin, outputMax, normalized);
}

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    float elevation = sin(modelPosition.x * uFrequency.x - uTime) * 0.1;
    elevation += cos(modelPosition.y * uFrequency.y - uTime) * 0.1;

    modelPosition.z = elevation;


    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;

    vUv = uv;
    vElevation = mapValue(elevation, -0.1, 0.1, 0.0, 1.0);
}