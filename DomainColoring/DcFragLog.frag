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

#define u vec3(1.0, 0.0, 0.0)
#define i vec3(0.0, 1.0, 0.0)
#define e vec3(1.0, 0.0, 1.0)
#define e_F 2.71828182846
#define pi vec3(3.14159265359, 0.0, 0.0)
#define pi_F 3.14159265359
#define tau vec3(6.28318530718, 0.0, 0.0)
#define tau_F 6.28318530718
#define cgamma vec3(0.5772156649, 0.0, 0.0)
#define cgamma_F 0.5772156649

/****** Complex Function Definitions ******/
vec3 cx(float f) {return vec3(f, 0.0, 0.0);}
vec3 cx_neg(vec3 z) {return vec3(-z.x, -z.y, z.z);}

vec3 cx_add(vec3 a, vec3 b) {
    float p = step(0.0, a.z-b.z);
    vec3 ab_max = p*a + (1.0-p)*b;
    vec3 ab_min = a+b-ab_max;
    return ab_max + vec3(exp(-abs(a.z-b.z)) * ab_min.xy, 0);
}
vec3 cx_sub(vec3 a, vec3 b) {return cx_add(a, cx_neg(b));}
vec3 cx_mul(vec3 a, vec3 b) {return vec3(a.x*b.x-a.y*b.y, a.x*b.y+a.y*b.x, a.z+b.z);}
vec3 cx_div(vec3 a, vec3 b) {return vec3(vec2(a.x*b.x+a.y*b.y, a.y*b.x-a.x*b.y)/(b.x*b.x+b.y*b.y), a.z-b.z);}

float fcx_abs(vec3 z) {return length(z.xy)*exp(z.z);}
vec3 flatten(vec3 z) {return vec3(z.xy*exp(z.z), 0.0);}
vec3 cx_smul(vec3 z, float a) {return vec3(z.xy * a, z.z);}
vec3 cx_ix(vec3 z) {return vec3(-z.y, z.x, z.z);}
vec3 cx_nix(vec3 z) {return vec3(z.y, -z.x, z.z);}
vec3 cx_conj(vec3 z) {return vec3(z.x, -z.y, z.z);}
vec3 cx_rcp(vec3 z) {return vec3(vec2(z.x, -z.y)/(z.x*z.x+z.y*z.y), -z.z);}
vec3 cx_abs(vec3 z) {return cx(fcx_abs(z));}
vec3 cx_sgn(vec3 z) {return cx_smul(z, 1.0/fcx_abs(z));}
vec3 cx_arg(vec3 z) {return cx(atan(z.y, z.x));}
vec3 cx_modulo(vec3 z, vec3 m) {return cx_mul(m, fract(flatten(cx_div(z, m))));}
vec3 cx_exp(vec3 z) {float theta = mod(z.y*exp(z.z), tau_F); return vec3(cos(theta), sin(theta), z.x*exp(z.z));}
vec3 cx_log(vec3 z) {return vec3(log(length(z.xy))+z.z, atan(z.y, z.x), 0.0);}
vec3 cx_ln(vec3 z) {return cx_log(z);}

vec3 cx_cos(vec3 z) {return cx_smul(cx_add(cx_exp(cx_nix(z)), cx_exp(cx_ix(z))), 0.5);}
vec3 cx_sin(vec3 z) {return cx_ix(cx_smul(cx_sub(cx_exp(cx_nix(z)), cx_exp(cx_ix(z))), 0.5));}
vec3 cx_tan(vec3 z) {vec3 a = cx_exp(cx_nix(z)); vec3 b = cx_exp(cx_ix(z)); return cx_ix(cx_div(cx_sub(a, b), cx_add(a, b)));}
vec3 cx_sec(vec3 z) {return cx_rcp(cx_cos(z));}
vec3 cx_csc(vec3 z) {return cx_rcp(cx_sin(z));}
vec3 cx_cot(vec3 z) {return cx_rcp(cx_tan(z));}

vec3 cx_pow(vec3 a, vec3 b) {return cx_exp(cx_mul(b, cx_log(a)));}
vec3 cx_sqrt(vec3 z) {return cx_exp(cx_smul(cx_log(z), 0.5));}
vec3 cx_arcsin(vec3 z) {return cx_nix(cx_log(cx_add(cx_sqrt(cx_sub(u, cx_mul(z, z))), cx_ix(z))));}
vec3 cx_arccos(vec3 z) {return cx_sub(cx(pi_F/2.0), cx_arcsin(z));}
vec3 cx_arctan(vec3 z) {return cx_smul(cx_ix(cx_log(cx_div(cx_add(u, cx_ix(z)), cx_sub(u, cx_ix(z))))), -0.5);}
vec3 cx_arccsc(vec3 z) {return cx_arcsin(cx_rcp(z));}
vec3 cx_arcsec(vec3 z) {return cx_arccos(cx_rcp(z));}
vec3 cx_arccot(vec3 z) {return cx_arctan(cx_rcp(z));}

vec3 cx_cosh(vec3 z) {return cx_cos(cx_ix(z));}
vec3 cx_sinh(vec3 z) {return cx_nix(cx_sin(cx_ix(z)));}
vec3 cx_tanh(vec3 z) {return cx_nix(cx_tan(cx_ix(z)));}
vec3 cx_sech(vec3 z) {return cx_rcp(cx_cosh(z));}
vec3 cx_csch(vec3 z) {return cx_rcp(cx_sinh(z));}
vec3 cx_coth(vec3 z) {return cx_rcp(cx_tanh(z));}

vec3 cx_arsinh(vec3 z) {return cx_nix(cx_arcsin(cx_ix(z)));}
vec3 cx_arcosh(vec3 z) {return cx_nix(cx_arccos(z));}
vec3 cx_artanh(vec3 z) {return cx_nix(cx_arctan(cx_ix(z)));;}
vec3 cx_arcsch(vec3 z) {return cx_arsinh(cx_rcp(z));}
vec3 cx_arsech(vec3 z) {return cx_arcosh(cx_rcp(z));}
vec3 cx_arcoth(vec3 z) {return cx_artanh(cx_rcp(z));}

vec3 cx_gamma_i(vec3 z) {
    return cx_mul(cx_sqrt(cx_div(tau, z)), cx_pow(cx_smul(cx_add(z, cx_rcp(cx_sub(cx_smul(z, 12.0), cx_rcp(cx_smul(z, 10.0))))), 1.0/e_F), z));
}
vec3 cx_gamma(vec3 z) {
    if (z.x*exp(z.z) >= 0.5) {
        return cx_gamma_i(z);
    }
    return cx_div(pi, cx_mul(cx_sin(cx_smul(z, pi_F)), cx_gamma_i(cx_sub(u, z))));
}
vec3 cx_beta(vec3 z1, vec3 z2) {
    return cx_div(cx_mul(cx_gamma(z1), cx_gamma(z2)), cx_gamma(cx_add(z1, z2)));
}

vec3 cx_zeta_i(vec3 s) {
    int j = 1;
    vec3 a = cx(0.0);
    vec3 v = cx(0.0);
    vec3 nv;
    while (j < maxZetaTerms) {
        a = cx_add(a, cx_pow(cx(float(j)), cx_neg(s)));
        nv = cx_add(a, cx_div(cx_pow(cx(float(j) + 0.5), cx_sub(u, s)), cx_sub(s, u)));
        if (length(nv.xy*exp(nv.z) - v.xy*exp(v.z)) < 1e-6) {
            return nv;
        }
        v = nv;
        j++;
    }
    
    /*vec3 v = cx_div(cx_pow(cx(float(zetaTerms) + 0.5), cx_sub(u, s)), cx_sub(s, u));
    for (int k = 1; k <= zetaTerms; k++) {
        v = cx_add(v, cx_pow(cx(float(k)), cx_neg(s)));
    }*/
    return v;
}
vec3 cx_zeta(vec3 s) {
    if (length(s.xy) == 0.0) {
        return cx(-0.5);
    }
    if (s.x*exp(s.z) >= 0.5) {
        return cx_zeta_i(s);
    }
    return cx_smul(cx_mul(cx_mul(cx_pow(tau, s), cx_sin(s*pi_F/2.0)), cx_mul(cx_gamma(cx_sub(u, s)), cx_zeta_i(cx_sub(u, s)))), 1.0/pi_F);
}
vec3 cx_eta(vec3 s) {
    return cx_mul(cx_sub(u, cx_pow(cx(2.0), cx_sub(u, s))), cx_zeta(s));
}

vec3 cx_digamma_i(vec3 z) {  // asymptotic expansion
    vec3 v = cx_log(z);
    v = cx_sub(v, cx_rcp(cx_smul(z, 2.0)));
    v = cx_sub(v, cx_rcp(cx_smul(cx_mul(z, z), 12.0)));
    v = cx_add(v, cx_rcp(cx_smul(cx_pow(z, cx(4.0)), 120.0)));
    v = cx_sub(v, cx_rcp(cx_smul(cx_pow(z, cx(6.0)), 252.0)));
    v = cx_add(v, cx_rcp(cx_smul(cx_pow(z, cx(8.0)), 240.0))); 
    v = cx_sub(v, cx_rcp(cx_smul(cx_pow(z, cx(10.0)), 132.0)));
    return v;
}
vec3 cx_digamma(vec3 z) {
    if (abs(z.y)*exp(z.z) > 2.0) {
        return cx_digamma_i(z);
    }
    if (z.x*exp(z.z) < -5.0) {
        return cx_sub(cx_digamma_i(cx_sub(u, z)), cx_smul(cx_cot(cx_smul(z, pi_F)), pi_F));
    }
    vec3 v = cx(0.0);
    while (z.x*exp(z.z) < 6.0) {
        v = cx_add(v, cx_rcp(z));
        z = cx_add(z, cx(1.0));
    }
    return cx_sub(cx_digamma_i(z), v);
}

vec3 cx_faddeeva_i(vec3 z) {
    vec3 fa[4] = vec3[](vec3(-0.01734011, -0.04630644, 0.0), vec3(-0.73991781, 0.83951828, 0.0), vec3(5.84063211, 0.95360275, 0.0), vec3(-5.58337418, -11.2085505, 0.0));
    vec3 fb[4] = vec3[](vec3(2.23768773, -1.62594102, 0.0), vec3(1.46523409, -1.7896203, 0.0), vec3(0.83925397, -1.89199521, 0.0), vec3(0.27393622, -1.94178704, 0.0));
    vec3 v = cx(0.0);
    for (int j = 0; j < 4; j++) {
        v = cx_add(v, cx_div(fa[j], cx_sub(z, fb[j])));
        v = cx_add(v, cx_div(cx_conj(fa[j]), cx_sub(z, cx_neg(cx_conj(fb[j])))));
    }

    return v;
}
vec3 cx_faddeeva_p(vec3 z) {
    return cx_smul(cx_nix(cx_faddeeva_i(z)), 1.0/sqrt(pi_F));
}
vec3 cx_faddeeva(vec3 z) {
    if (z.y >= 0.0) {
        return cx_faddeeva_p(z);
    }
    vec3 v = cx_add(cx_conj(cx_faddeeva_i(cx_conj(z))), cx_smul(cx_ix(cx_exp(cx_neg(cx_mul(z, z)))), 2.0*sqrt(pi_F)));
    return cx_smul(cx_nix(v), 1.0/sqrt(pi_F));
}

vec3 cx_erf(vec3 z) {
    vec3 v = z.x >= 0.0 ? z : cx_neg(z);
    return cx_smul(cx_sub(u, cx_mul(cx_faddeeva_p(cx_ix(v)), cx_exp(cx_neg(cx_mul(v, v))))), step(0.0, z.x)*2.0-1.0);
}
vec3 cx_erfi(vec3 z) {
    return cx_nix(cx_erf(cx_ix(z)));
}

vec3 cx_lambertw(vec3 z) {
    int iters = 0;
    vec3 v = z.x*exp(z.z) > -1.0/e_F ? cx(0.0) : cx_smul(cx_log(z), pow(e_F, -1.0/e_F));
    vec3 pv;
    while (iters < 20) {
        vec3 expv = cx_exp(v);
        vec3 v_expv = cx_mul(v, expv);
        pv = v;
        v = cx_sub(v, cx_div(cx_sub(v_expv, z), cx_sub(cx_add(v_expv, expv), cx_div(cx_mul(cx_add(v, cx(2.0)), cx_sub(v_expv, z)), cx_add(cx_smul(v, 2.0), cx(2.0))))));
        if (length(fcx_abs(v) - fcx_abs(pv)) < 1e-6) {return v;}
        iters++;
    }
    return v;
}

vec3 cx_ei(vec3 z) {
    if (fcx_abs(z) < 10.0) {
        vec3 v = cx_add(cgamma, cx_log(z));
        vec3 t = z;
        vec3 pv;
        for (float k = 1.0; k <= 35.0; k++) {
            // Ratio between term & next term = z^(n+1)/((n+1)(n+1)!) * n*n!/z^n = zn/(n+1)^2
            float f = k/(k*k + 2.0*k + 1.0);
            pv = v;
            v = cx_add(v, t);
            if (length(fcx_abs(v) - fcx_abs(pv)) < 1e-6) {return v;}
            t = cx_mul(cx_smul(t, f), z);
        }
        return v;
    } else {
        vec3 v = cx_ix(cx(sign(z.y)*pi_F));
        vec3 t = cx_div(cx_exp(z), z);
        vec3 pv;
        for (float k = 1.0; k <= min(20.0, floor(fcx_abs(z) + 1.0)); k++) {
            pv = v;
            v = cx_add(v, t);
            if (length(fcx_abs(v) - fcx_abs(pv)) < 1e-6) {return v;}
            t = cx_mul(t, cx_smul(cx_rcp(z), k));
        }
        return v;
    }
}
vec3 cx_li(vec3 z) {
    return cx_ei(cx_log(z));
}

vec3 cx_tetr(vec3 z, vec3 n) { // Constants are automatically converted to cx form, so have to change them back
    vec3 v = z;
    for (int j = 1; j < int(n.x); j++) {
        v = cx_pow(z, v);
    }
    return v;
}
/****** End Complex Definitions ******/
vec3 cx3_norm(vec3 z) {
    float l = length(z.xy);
    if (l == 0.0) {return vec3(0.0, 0.0, -1.0/0.0);}
    return vec3(z.xy/l, z.z + log(l));
}

vec3 hsl2rgb(in vec3 c) {
    vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
    return c.z + c.y * (rgb - 0.5) * (1.0 - abs(2.0 * c.z - 1.0));
}

float ltFunc(vec3 z) {
    float fct;
    if (!expColoring) {
        fct = exp(z.z*ltSens);
    } else {
        fct = z.z > 0.0 ? z.z*ltSens + 1.0 : 1.0 / (-z.z*ltSens + 1.0);
    }
    return 1.0 - 1.0/(1.0+fct);
}

#define f(z) $$

void main() {
    vec3 z = vec3(vTexCoord.xy * graphSize - graphSize/2.0 + graphCenter, 0.0);
    vec3 fz = cx3_norm(f(z));

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