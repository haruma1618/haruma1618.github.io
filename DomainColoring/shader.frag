precision highp float;

varying vec2 vTexCoord;

uniform vec2 graphSize;
uniform vec2 graphCenter;

#define i vec2(0.0, 1.0)
#define PI 3.14159265359

// These functions are missing in WebGL1
float cosh (float val) {
    float tmp = exp(val);
    return (tmp + 1.0 / tmp) / 2.0;
}

float sinh(float val) {
    float tmp = exp(val);
    return (tmp - 1.0 / tmp) / 2.0;
}   

float tanh(float val) {
    float tmp = exp(val);
    return (tmp - 1.0 / tmp) / (tmp + 1.0 / tmp);
}

/****** Complex Function Definitions ******/
#define cx_mul(a, b) vec2(a.x*b.x-a.y*b.y, a.x*b.y+a.y*b.x)
#define cx_div(a, b) vec2((a.x*b.x+a.y*b.y)/(b.x*b.x+b.y*b.y), (a.y*b.x-a.x*b.y)/(b.x*b.x+b.y*b.y))
#define cx_mod(a) length(a)
#define cx_arg(a) atan(a.y, a.x)
#define cx_exp(z) vec2(cos(z.y), sin(z.y))*exp(z.x)
#define cx_log(z) vec2(log(length(z)), atan(z.y, z.x))
#define cx_cos(z) vec2(cos(z.x) * cosh(z.y), -sin(z.x) * sinh(z.y))
#define cx_sin(z) vec2(sin(z.x) * cosh(z.y), cos(z.x) * sinh(z.y))
#define cx_tan(z) vec2(sin(2.0*z.x), sinh(2.0*z.y)) / (cos(2.0*z.x)+cosh(2.0*z.y))

vec2 cx_pow(vec2 z, float p) {
    return pow(cx_mod(z), p) * vec2(cos(cx_arg(z) * p), sin(cx_arg(z) * p));
}

vec2 cx_cpow(vec2 a, vec2 b) {
    if (cx_mod(a) == 0.0) {
        if (cx_mod(b) == 0.0) {
            return vec2(1.0, 0.0);
        }
        return vec2(0.0);
    }
    return cx_exp(cx_mul(b, cx_log(a)));
}

/****** Complex Function Definitions ******/

vec3 hsl2rgb(in vec3 c) {
    vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
    return c.z + c.y * (rgb - 0.5) * (1.0 - abs(2.0 * c.z - 1.0));
}

void main() {
    vec2 z = vTexCoord.xy * graphSize - graphSize/2.0 + graphCenter;
    vec2 fz = cx_sin(z);

    gl_FragColor = vec4(hsl2rgb(vec3(mod(atan(fz.y, fz.x)/(2.0*PI) + 1.0, 1.0), 1.0, 2.0*atan(length(fz))/PI)), 1.0);
}