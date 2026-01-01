#version 300 es
precision highp float;

in vec2 vTexCoord;
out vec4 fragColor;

uniform vec2 graphSize;
uniform vec2 graphCenter;
uniform float hueShift;
uniform float ltSens;
uniform int numHueValues;
uniform int numLightnessValues;
uniform int maxZetaTerms;
uniform bool expColoring;

#define i vec2(0.0, 1.0)
#define u vec2(1.0, 0.0)
#define e vec2(2.71828182846, 0.0)
#define e_F 2.71828182846
#define pi vec2(3.14159265359, 0.0) 
#define pi_F 3.14159265359
#define tau vec2(6.28318530718, 0.0)
#define tau_F 6.28318530718
#define cgamma vec2(0.5772156649, 0.0)
#define cgamma_F 0.5772156649

/****** Complex Function Definitions ******/
vec2 cx(float f) {return vec2(f, 0.0);}
vec2 cx(vec2 z) {return z;}

vec2 cx_add(vec2 a, vec2 b) {return vec2(a.x+b.x, a.y+b.y);}
vec2 cx_sub(vec2 a, vec2 b) {return vec2(a.x-b.x, a.y-b.y);}
vec2 cx_mul(vec2 a, vec2 b) {return vec2(a.x*b.x-a.y*b.y, a.x*b.y+a.y*b.x);}
vec2 cx_div(vec2 a, vec2 b) {return vec2(a.x*b.x+a.y*b.y, a.y*b.x-a.x*b.y)/(b.x*b.x+b.y*b.y);}

// Other supported functions: round, floor, ceil, min, max, clamp (Only supported without log mode)
vec2 cx_ix(vec2 z) {return vec2(-z.y, z.x);}
vec2 cx_conj(vec2 z) {return vec2(z.x, -z.y);}
vec2 cx_rcp(vec2 z) {return vec2(z.x, -z.y)/(z.x*z.x+z.y*z.y);}
vec2 cx_abs(vec2 z) {return cx(length(z));}
vec2 cx_sgn(vec2 z) {return z/length(z);}
vec2 cx_arg(vec2 z) {return cx(atan(z.y, z.x));}
vec2 cx_modulo(vec2 a, vec2 m) {return cx_mul(m, fract(cx_div(a, m)));}
vec2 cx_exp(vec2 z) {return vec2(cos(z.y), sin(z.y))*exp(z.x);}
vec2 cx_log(vec2 z) {return vec2(log(length(z)), atan(z.y, z.x));}
vec2 cx_ln(vec2 z) {return cx_log(z);}

vec2 cx_cos(vec2 z) {return vec2(cos(z.x) * cosh(z.y), -sin(z.x) * sinh(z.y));}
vec2 cx_sin(vec2 z) {return vec2(sin(z.x) * cosh(z.y), cos(z.x) * sinh(z.y));}
vec2 cx_tan(vec2 z) {return abs(z.y) > 9.0 ? vec2(0.0, sign(z.y)) : vec2(sin(2.0*z.x), sinh(2.0*z.y)) / (cos(2.0*z.x)+cosh(2.0*z.y));}
vec2 cx_sec(vec2 z) {return cx_rcp(cx_cos(z));}
vec2 cx_csc(vec2 z) {return cx_rcp(cx_sin(z));}
vec2 cx_cot(vec2 z) {return cx_rcp(cx_tan(z));}

vec2 cx_pow(vec2 a, vec2 b) {return cx_exp(cx_mul(b, cx_log(a)));}
vec2 cx_sqrt(vec2 z) {return cx_pow(z, cx(0.5));}
vec2 cx_arcsin(vec2 z) {return -cx_ix(cx_log(cx_sqrt(u - cx_mul(z, z)) + cx_ix(z)));}
vec2 cx_arccos(vec2 z) {return pi/2.0 - cx_arcsin(z);}
vec2 cx_arctan(vec2 z) {return -cx_ix(cx_log(cx_div(u + cx_ix(z), u - cx_ix(z)))) / 2.0;}
vec2 cx_arccsc(vec2 z) {return cx_arcsin(cx_rcp(z));}
vec2 cx_arcsec(vec2 z) {return cx_arccos(cx_rcp(z));}
vec2 cx_arccot(vec2 z) {return cx_arctan(cx_rcp(z));}

vec2 cx_cosh(vec2 z) {return cx_cos(cx_ix(z));}
vec2 cx_sinh(vec2 z) {return -cx_ix(cx_sin(cx_ix(z)));}
vec2 cx_tanh(vec2 z) {return -cx_ix(cx_tan(cx_ix(z)));}
vec2 cx_sech(vec2 z) {return cx_rcp(cx_cosh(z));}
vec2 cx_csch(vec2 z) {return cx_rcp(cx_sinh(z));}
vec2 cx_coth(vec2 z) {return cx_rcp(cx_tanh(z));}

vec2 cx_arsinh(vec2 z) {return -cx_ix(cx_arcsin(cx_ix(z)));}
vec2 cx_arcosh(vec2 z) {return -cx_ix(cx_arccos(z));}
vec2 cx_artanh(vec2 z) {return -cx_ix(cx_arctan(cx_ix(z)));;}
vec2 cx_arcsch(vec2 z) {return cx_arsinh(cx_rcp(z));}
vec2 cx_arsech(vec2 z) {return cx_arcosh(cx_rcp(z));}
vec2 cx_arcoth(vec2 z) {return cx_artanh(cx_rcp(z));}

vec2 cx_gamma_i(vec2 z) {
    return cx_mul(cx_sqrt(cx_div(2.0*pi, z)), cx_pow((z + cx_rcp(12.0*z - cx_rcp(10.0*z)))/e_F, z));
}
vec2 cx_gamma(vec2 z) {
    if (z.x >= 0.5) {
        return cx_gamma_i(z);
    }
    return cx_div(pi, cx_mul(cx_sin(pi_F*z), cx_gamma_i(u - z)));
}
vec2 cx_beta(vec2 z1, vec2 z2) {
    return cx_div(cx_mul(cx_gamma(z1), cx_gamma(z2)), cx_gamma(z1 + z2));
}

vec2 cx_zeta_i(vec2 s) {
    int j = 1;
    vec2 a = cx(0.0);
    vec2 v = cx(0.0);
    vec2 nv;
    while (j < maxZetaTerms) {
        a += cx_pow(cx(float(j)), -s);
        nv = a + cx_div(cx_pow(cx(float(j) + 0.5), u-s), s-u);
        if (length(nv - v) < 1e-6) {
            return nv;
        }
        v = nv;
        j++;
    }

    /*
    vec2 v = cx_div(cx_pow(cx(float(zetaTerms) + 0.5), u-s), s-u);
    for (int k = 1; k <= zetaTerms; k++) {
        v += cx_pow(cx(float(k)), -s);
    }*/
    return v;
}
vec2 cx_zeta(vec2 s) {
    if (length(s) == 0.0) {
        return cx(-0.5);
    }
    if (s.x >= 0.5) {
        return cx_zeta_i(s);
    }
    return cx_mul(cx_mul(cx_pow(2.0*pi, s), cx_sin(s*pi_F/2.0)), cx_mul(cx_gamma(u-s), cx_zeta_i(u-s)))/pi_F;
}
vec2 cx_eta(vec2 s) {
    return cx_mul(u - cx_pow(cx(2.0), u - s), cx_zeta(s));
}

vec2 cx_digamma_i(vec2 z) {  // asymptotic expansion
    vec2 v = cx_log(z) - cx_rcp(2.0*z) - cx_rcp(12.0*cx_mul(z, z)) + cx_rcp(120.0*cx_pow(z, cx(4.0)));
    v += - cx_rcp(252.0*cx_pow(z, cx(6.0))) + cx_rcp(240.0*cx_pow(z, cx(8.0))) - cx_rcp(132.0*cx_pow(z, cx(10.0)));
    return v;
}
vec2 cx_digamma(vec2 z) {
    if (abs(z.y) > 2.0) {
        return cx_digamma_i(z);
    }
    if (z.x < -5.0) {
        return cx_digamma_i(u-z) - pi_F * cx_cot(pi_F * z);
    }
    vec2 v = cx(0.0);
    while (z.x < 6.0) {
        v += cx_rcp(z);
        z += cx(1.0);
    }
    return cx_digamma_i(z) - v;
}

vec2 cx_faddeeva_i(vec2 z) {
    vec2 fa[4] = vec2[](vec2(-0.01734011, -0.04630644), vec2(-0.73991781, 0.83951828), vec2(5.84063211, 0.95360275), vec2(-5.58337418, -11.2085505));
    vec2 fb[4] = vec2[](vec2(2.23768773, -1.62594102), vec2(1.46523409, -1.7896203), vec2(0.83925397, -1.89199521), vec2(0.27393622, -1.94178704));
    vec2 v = cx(0.0);
    for (int j = 0; j < 4; j++) {
        v += cx_div(fa[j], cx_sub(z, fb[j]));
        v += cx_div(cx_conj(fa[j]), cx_sub(z, -cx_conj(fb[j])));
    }
    return v;
}
vec2 cx_faddeeva(vec2 z) {
    vec2 v;
    if (z.y >= 0.0) {
        v = cx_faddeeva_i(z);
    } else {
        v = cx_add(cx_conj(cx_faddeeva_i(cx_conj(z))), 2.0*sqrt(pi_F)*cx_ix(cx_exp(-cx_mul(z, z))));
    }
    return -cx_ix(v)/sqrt(pi_F);
}

vec2 cx_erf(vec2 z) {
    vec2 v = z.x >= 0.0 ? z : -z;
    return (step(0.0, z.x)*2.0-1.0)*cx_sub(u, cx_mul(cx_faddeeva(cx_ix(v)), cx_exp(-cx_mul(v, v))));
}
vec2 cx_erfi(vec2 z) {
    return -cx_ix(cx_erf(cx_ix(z)));
}

vec2 cx_lambertw(vec2 z) {
    int iters = 0;
    vec2 v = z.x > -1.0/e_F ? cx_div(z, z+u) : pow(e_F, -1.0/e_F)*cx_log(z);
    vec2 nv;
    while (iters < 20) {
        vec2 expv = cx_exp(v);
        vec2 v_expv = cx_mul(v, expv);
        nv = v - cx_div(v_expv - z, v_expv + expv - cx_div(cx_mul(v + cx(2.0), v_expv - z), 2.0*v + cx(2.0)));
        if (length(nv - v) < 1e-6) {
            return nv;
        }
        v = nv;
        iters++;
    }
    return v;
}

vec2 cx_ei(vec2 z) {
    vec2 v = cgamma + cx_log(z);
    vec2 t = z;
    for (float k = 1.0; k <= 50.0; k++) {
        // Ratio between term & next term = z^(n+1)/((n+1)(n+1)!) * n*n!/z^n = zn/(n+1)^2
        float f = k/(k*k + 2.0*k + 1.0);
        v += t;
        t = cx_mul(t*f, z);
    }
    return v;
}
vec2 cx_li(vec2 z) {
    return cx_ei(cx_log(z));
}

vec2 cx_tetr(vec2 z, vec2 n) { // Constants are automatically converted to cx form, so have to change them back
    vec2 v = z;
    for (int j = 1; j < int(n.x); j++) {
        v = cx_pow(z, v);
    }
    return v;
}
/****** End Complex Definitions ******/

vec3 hsl2rgb(in vec3 c) {
    vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
    return c.z + c.y * (rgb - 0.5) * (1.0 - abs(2.0 * c.z - 1.0));
}

float ltFunc(vec2 z) {
    float fct;
    if (!expColoring) {
        fct = pow(length(z), ltSens);
    } else {
        fct = length(z) > 1.0 ? log(length(z))*ltSens + 1.0 : 1.0 / (-log(length(z))*ltSens + 1.0);
    }

    return 1.0 - 1.0/(1.0+fct);
}

#define f(z) $$

void main() {
    vec2 z = vTexCoord.xy * graphSize - graphSize/2.0 + graphCenter;
    vec2 fz = f(z);

    float hue = mod(atan(fz.y, fz.x)/(tau_F) + 1.0 + hueShift/360.0, 1.0);
    if (numHueValues > 0) {
        hue = round(float(numHueValues) * hue) / float(numHueValues);
    }

    float lightness = ltFunc(fz);
    if (numLightnessValues > 0) {
        lightness = round(float(numLightnessValues) * lightness) / float(numLightnessValues);
    }

    fragColor = fz == fz ? vec4(hsl2rgb(vec3(hue, 1.0, lightness)), 1.0) : vec4(0.5, 0.5, 0.5, 1.0);
}