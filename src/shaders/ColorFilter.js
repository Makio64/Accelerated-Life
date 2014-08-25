/**
 * @author David Ronai / @Makio64 / Makiopolis.com
 */
 
PIXI.ColorFilter = function()
{
    PIXI.AbstractFilter.call( this );   
 
    this.passes = [this];
 
    // set the uniforms
    this.uniforms = {
        r: {type: '1f', value: 0.0},
        g: {type: '1f', value: 0.0},
        b: {type: '1f', value: 1.0},
        intensity: {type: '1f', value: 0.5}
    };
 
    this.fragmentSrc = [
        'precision mediump float;',
        'varying vec2 vTextureCoord;',
        'uniform sampler2D uSampler;',
        'uniform float intensity;',
        'uniform float r;',
        'uniform float g;',
        'uniform float b;',
 
        'void main(void) {',
            'vec4 color = texture2D(uSampler, vTextureCoord);',
            'color.r = r*intensity+color.r*(1.0-intensity);',
            'color.g = g*intensity+color.g*(1.0-intensity);',
            'color.b = b*intensity+color.b*(1.0-intensity);',
            'gl_FragColor = color;',
        '}'
    ];
};
 
PIXI.ColorFilter.prototype = Object.create( PIXI.AbstractFilter.prototype );
PIXI.ColorFilter.prototype.constructor = PIXI.ColorFilter;

Object.defineProperty(PIXI.ColorFilter.prototype, 'intensity', {
    get: function() {
        return this.uniforms.intensity.value;
    },
    set: function(value) {
        this.uniforms.intensity.value = value;
    }
});
Object.defineProperty(PIXI.ColorFilter.prototype, 'r', {
    get: function() {
        return this.uniforms.r.value;
    },
    set: function(value) {
        this.uniforms.r.value = value;
    }
});
Object.defineProperty(PIXI.ColorFilter.prototype, 'g', {
    get: function() {
        return this.uniforms.g.value;
    },
    set: function(value) {
        this.uniforms.g.value = value;
    }
});
Object.defineProperty(PIXI.ColorFilter.prototype, 'b', {
    get: function() {
        return this.uniforms.b.value;
    },
    set: function(value) {
        this.uniforms.b.value = value;
    }
});