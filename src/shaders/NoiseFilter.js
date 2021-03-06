/**
 * @author David Ronai http://makiopolis.com/ @Makio64
 */

/**
 *
 * Add Noise on the texture!
 * @class NoiseFilter
 * @contructor
 */
PIXI.NoiseFilter = function()
{
    PIXI.AbstractFilter.call( this );

    this.passes = [this];

    // set the uniforms
    this.uniforms = {
        intensity:  { type: "1f", value: 0.5 },
        time:       { type: "1f", value: 0.0 }
    };
       
    this.fragmentSrc = [
        'precision lowp float;',
        'varying vec2 vTextureCoord;',
        'uniform sampler2D uSampler;',
        'uniform float time;',
        'uniform float intensity;',

        'float rand(vec2 co){',
            'return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);',
        '}',

        'vec3 mod289(vec3 x) {',
            'return x - floor(x * (1.0 / 289.0)) * 289.0;',
        '}',

        'vec2 mod289(vec2 x) {',
            'return x - floor(x * (1.0 / 289.0)) * 289.0;',
        '}',

        'vec3 permute(vec3 x) {',
            'return mod289(((x*34.0)+1.0)*x);',
        '}',

        'float snoise(vec2 v)',
        '{',
            'const vec4 C = vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);',
            // First corner
            'vec2 i  = floor(v + dot(v, C.yy) );',
            'vec2 x0 = v -   i + dot(i, C.xx);',

            // Other corners
            'vec2 i1;',
            'i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);',
            'vec4 x12 = x0.xyxy + C.xxzz;',
            'x12.xy -= i1;',

            // Permutations
            'i = mod289(i);', // Avoid truncation effects in permutation
            'vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));',

            'vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);',
            'm = m*m ;',
            'm = m*m ;',

            // Gradients: 41 points uniformly over a line, mapped onto a diamond.
            // The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)

            'vec3 x = 2.0 * fract(p * C.www) - 1.0;',
            'vec3 h = abs(x) - 0.5;',
            'vec3 ox = floor(x + 0.5);',
            'vec3 a0 = x - ox;',

            // Normalise gradients implicitly by scaling m
            // Approximation of: m *= inversesqrt( a0*a0 + h*h );
            'm *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );',

            // Compute final noise value at P
            'vec3 g;',
            'g.x  = a0.x  * x0.x  + h.x  * x0.y;',
            'g.yz = a0.yz * x12.xz + h.yz * x12.yw;',
            'return 130.0 * dot(m, g);',
        '}',

        'void main(void) {',
            'float noise = snoise(vTextureCoord * vec2(1024.0 + time * 512.0, 1024.0 + time * 512.0)) * 0.5;',
            'vec4 texture = texture2D( uSampler, vTextureCoord );',
            'vec3 cResult = texture.rgb + noise * intensity;',
            'gl_FragColor =  vec4( cResult, texture.a );',
        '}'
    ];
};

PIXI.NoiseFilter.prototype = Object.create( PIXI.AbstractFilter.prototype );
PIXI.NoiseFilter.prototype.constructor = PIXI.NoiseFilter;

/**
 * Sets the noise intensity
 *
 * @property intensity
 * @type float between 1 and 0
 * @default 1.0
 */
Object.defineProperty(PIXI.NoiseFilter.prototype, 'intensity', {
    get: function() {
        return this.uniforms.intensity.value;
    },
    set: function(value) {
        this.uniforms.intensity.value = value;
    }
});

/**
 * Sets the time to make the noise move
 *
 * @property time
 * @type float 
 * @default 1.0
 */
Object.defineProperty(PIXI.NoiseFilter.prototype, 'time', {
    get: function() {
        return this.uniforms.time.value;
    },
    set: function(value) {
        this.uniforms.time.value = value;
    }
});