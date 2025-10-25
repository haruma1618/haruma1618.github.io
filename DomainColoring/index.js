let dcShader;
let func = "tan(z)";
let prevFunc = func;
let pixelSize = 0.01;
let graphMid = [0, 0];
let funcInput;
let ltSensSlider;
let zetaTerms = 50;

function getVert() {
    let vert = `#version 300 es
    precision highp float;

    in vec3 aPosition;
    in vec2 aTexCoord;

    out vec2 vTexCoord;

    void main() {
        vec4 positionVec4 = vec4(aPosition, 1.0);
        positionVec4.xy = positionVec4.xy * 2.0;
        gl_Position = positionVec4;

        vTexCoord = aTexCoord;
    }`;

    return vert;
}

function getFrag(f, logMode) {
    let frag = !logMode ? `#version 300 es
    precision highp float;

    in vec2 vTexCoord;
    out vec4 fragColor;

    uniform vec2 graphSize;
    uniform vec2 graphCenter;
    uniform float ltSens;
    uniform int zetaTerms;
    
    #define i vec2(0.0, 1.0)
    #define u vec2(1.0, 0.0)
    #define e vec2(2.71828182846, 0.0)
    #define e_F 2.71828182846
    #define pi vec2(3.14159265359, 0.0) 
    #define pi_F 3.14159265359

    /****** Complex Function Definitions ******/
    vec2 cx(float f) {return vec2(f, 0.0);}
    vec2 cx(vec2 z) {return z;}

    vec2 cx_add(vec2 a, vec2 b) {return vec2(a.x+b.x, a.y+b.y);}
    vec2 cx_sub(vec2 a, vec2 b) {return vec2(a.x-b.x, a.y-b.y);}
    vec2 cx_mul(vec2 a, vec2 b) {return vec2(a.x*b.x-a.y*b.y, a.x*b.y+a.y*b.x);}
    vec2 cx_div(vec2 a, vec2 b) {return vec2(a.x*b.x+a.y*b.y, a.y*b.x-a.x*b.y)/(b.x*b.x+b.y*b.y);}

    vec2 cx_ix(vec2 z) {return vec2(-z.y, z.x);}
    vec2 cx_conj(vec2 z) {return vec2(z.x, -z.y);}
    vec2 cx_rcp(vec2 z) {return vec2(z.x, -z.y)/(z.x*z.x+z.y*z.y);}
    vec2 cx_abs(vec2 z) {return cx(length(z));}
    vec2 cx_arg(vec2 z) {return cx(atan(z.y, z.x));}
    vec2 cx_exp(vec2 z) {return vec2(cos(z.y), sin(z.y))*exp(z.x);}
    vec2 cx_log(vec2 z) {return vec2(log(length(z)), atan(z.y, z.x));}
    vec2 cx_ln(vec2 z) {return cx_log(z);}

    vec2 cx_cos(vec2 z) {return vec2(cos(z.x) * cosh(z.y), -sin(z.x) * sinh(z.y));}
    vec2 cx_sin(vec2 z) {return vec2(sin(z.x) * cosh(z.y), cos(z.x) * sinh(z.y));}
    vec2 cx_tan(vec2 z) {return vec2(sin(2.0*z.x), sinh(2.0*z.y)) / (cos(2.0*z.x)+cosh(2.0*z.y));}
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
        } else {
            return cx_div(pi, cx_mul(cx_sin(pi_F*z), cx_gamma_i(u - z)));
        }
    }
    vec2 cx_beta(vec2 z1, vec2 z2) {
        return cx_div(cx_mul(cx_gamma(z1), cx_gamma(z2)), cx_gamma(z1 + z2));
    }

    vec2 cx_zeta_i(vec2 s) {
        vec2 v = cx_div(cx_pow(cx(float(zetaTerms) + 0.5), u-s), s-u);
        for (int k = 1; k <= zetaTerms; k++) {
            v += cx_pow(cx(float(k)), -s);
        }
        return v;
    }
    vec2 cx_zeta(vec2 s) {
        if (length(s) == 0.0) {
            return cx(-0.5);
        } else if (s.x >= 0.5) {
            return cx_zeta_i(s);
        } else {
            return cx_mul(cx_mul(cx_pow(2.0*pi, s), cx_sin(s*pi_F/2.0)), cx_mul(cx_gamma(u-s), cx_zeta_i(u-s)))/pi_F;
        }
    }

    vec2 cx_eta(vec2 s) {return cx_mul(u - cx_pow(cx(2.0), u - s), cx_zeta(s));}

    vec2 cx_digamma_i(vec2 z) {  // asymptotic expansion
        vec2 v = cx_log(z) - cx_rcp(2.0*z) - cx_rcp(12.0*cx_mul(z, z)) + cx_rcp(120.0*cx_pow(z, cx(4.0)));
        v += - cx_rcp(252.0*cx_pow(z, cx(6.0))) + cx_rcp(240.0*cx_pow(z, cx(8.0))) - cx_rcp(132.0*cx_pow(z, cx(10.0)));
        return v;
    }
    vec2 cx_digamma(vec2 z) {
        if (abs(z.y) > 1.0) {
            return cx_digamma_i(z);
        }
        vec2 v = cx(0.0);
        while (z.x < 3.0) {
            v += cx_rcp(z);
            z += cx(1.0);
        }
        return cx_digamma_i(z) - v;
    }

    vec3 hsl2rgb(in vec3 c) {
        vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
        return c.z + c.y * (rgb - 0.5) * (1.0 - abs(2.0 * c.z - 1.0));
    }

    float ltFunc(vec2 z) {
        float fct = pow(length(z), ltSens);
        return 1.0 - 1.0/(1.0+fct);
    }

    #define f(z) ` + f + `
    
    void main() {
        vec2 z = vTexCoord.xy * graphSize - graphSize/2.0 + graphCenter;
        vec2 fz = f(z);
        fz = (fz != fz) ? vec2(1.0/0.0, 0.0) : fz;

        fragColor = vec4(hsl2rgb(vec3(mod(atan(fz.y, fz.x)/(2.0*pi_F) + 1.0, 1.0), 1.0, ltFunc(fz))), 1.0);
    }` : ``; // Add "log mode" code (Complex numbers represented as (x+yi)*e^z)

    return frag;
}

function getExpressionInds(ind, nf) {
    let leftInd = ind;
    // Parentheses value. When going left, "(" increases it by 1, ")" decreases it by 1, vice versa with right.
    // If it gets above 0, stop.
    let leftPValue = 0;
    while (leftInd > 0) {
        leftInd--;
        let char = nf[leftInd];

        if (char === "(") {leftPValue++;}
        if (char === ")") {leftPValue--;}

        if (leftPValue === 0 && char === ",") {leftInd++; break;}
        if (leftPValue > 0) {leftInd++; break;}
    }
    
    let rightInd = ind;
    let rightPValue = 0;
    while (rightInd < nf.length) {
        rightInd++;
        let char = nf[rightInd];

        if (char === "(") {rightPValue--;}
        if (char === ")") {rightPValue++;}

        if (rightPValue === 0 && char === ",") {break;}
        if (rightPValue > 0) {break;}
    }

    return [leftInd, rightInd];
}

function replaceWithFuncNotation(nf, symbol, funcName) {
    let symbolIndex = 0;
    let ind = 0;

    while (true) {
        while (symbolIndex < nf.length) {
            if (nf[symbolIndex] === symbol) {
                break;
            }
            symbolIndex += 1;
        }

        if (symbolIndex >= nf.length) {
            break;
        }

        ind = symbolIndex;
        let expInds = getExpressionInds(ind, nf);

        // The slice from expInds[0] to expInds[1] is the full addition expression.
        nf = nf.slice(0, expInds[0]) + funcName + "(" + nf.slice(expInds[0], ind) + "," +
            nf.slice(ind+1, expInds[1]) + ")" + nf.slice(expInds[1], nf.length);
        console.log(nf);
    }

    return nf;
}

function changeFunc(f) {
    let nf = f;
    let indOffset;

    // Remove all blank space
    nf = nf.replace(/\s+/g, '')

    // Replace integers with decimals
    const digitRegex = /\d+/g;
    const digitMatches = nf.matchAll(digitRegex);
    indOffset = 0;  // Index goes up by 2 for each replacement, since we're adding ".0"

    if (digitMatches) {
        for (let m of digitMatches) {
            let startPos = m.index + indOffset;
            let endPos = startPos + m[0].length;
            if ((startPos == 0 || nf[startPos-1] != ".") && (endPos == nf.length || nf[endPos] != ".")) {
                nf = nf.slice(0, endPos) + ".0" + nf.slice(endPos);
                indOffset += 2;
            }
        }
    }

    // Replace num with cx(num)
    const numberRegex = /\d+\.?\d+/g;
    const numberMatches = nf.matchAll(numberRegex);
    indOffset = 0;  // This time, ind goes up by 4 per replacement
    if (numberMatches) {
        for (let m of numberMatches) {
            let startPos = m.index + indOffset;
            let endPos = startPos + m[0].length;
            if (startPos < 3 || nf.slice(startPos-3, startPos) != "cx(") {
                nf = nf.slice(0, startPos) + "cx(" + nf.slice(startPos, endPos) + ")" + nf.slice(endPos);
                indOffset += 4;
            }
        }   
    }

    // Replace unary subtraction operators, since they break things
    let ind = 0;
    while (ind < nf.length) {
        if (nf[ind] === "-" && (ind === 0 || nf[ind-1] === "(" || nf[ind-1] === ",")) {
            nf = nf.slice(0, ind) + "cx(0.0)" + nf.slice(ind);
        }
        ind++;
    }

    // Turn a+b into cx_add(a, b) (This is still necessary so that order of operations is preserved)
    nf = replaceWithFuncNotation(nf, "+", "add");

    // Turn a-b into cx_sub(a, b)
    nf = replaceWithFuncNotation(nf, "-", "sub");

    // Turn a*b into cx_mul(a, b)
    nf = replaceWithFuncNotation(nf, "*", "mul");

    // Turn a/b into cx_div(a, b)
    nf = replaceWithFuncNotation(nf, "/", "div");

    // Turn a^b into cx_pow(a, b)
    nf = replaceWithFuncNotation(nf, "^", "pow");

    const cx_funcs = ["arcsin", "arccos", "arctan", "arccsc", "arcsec", "arccot", "arsinh", "arcosh", "artanh", "arcsch", "arsech", "arcoth",
        "digamma", "gamma", "beta", "zeta", "eta", "sqrt", "conj", "sinh", "cosh", "tanh", "sech", "csch", "coth",
        "add", "sub", "mul", "div", "mod", "arg", "exp", "log", "cos", "sin", "tan", "pow", "sec", "csc", "cot", "ln"];

    for (let s of cx_funcs) {
        nf = nf.replaceAll(new RegExp("(^|[(,])(" + s + ")", "g"), "$1cx_$2");
    }

    console.log(nf);

    dcShader = createShader(getVert(), getFrag(nf, false));
}

function setup() {
    funcInput = document.querySelector("#function-input");
    ltSensSlider = document.querySelector("#lt-sens-slider");

    changeFunc(func);

    createCanvas(windowWidth, windowHeight, WEBGL2);

    window.addEventListener('wheel', event => {
        if (event.ctrlKey) {
            event.preventDefault();
        }
    }, {passive: false});

    funcInput.addEventListener("input", function() {
        funcInput.style.borderColor = "black";
        prevFunc = func;
        func = funcInput.value;

        changeFunc(func);
    });

    funcInput.value = "tan(z)";
}

function draw() {  
    shader(dcShader);
    dcShader.setUniform("graphSize", [pixelSize * width, pixelSize * height]);
    dcShader.setUniform("graphCenter", graphMid);
    dcShader.setUniform("ltSens", ltSensSlider.value);
    dcShader.setUniform("zetaTerms", zetaTerms);

    document.querySelector("#lt-sens-value").innerHTML = ltSensSlider.value;

    try {
        plane(width, height);
    } catch (error) {
        funcInput.style.borderColor = "red";

        func = prevFunc;
        changeFunc(func);
    }
}

function mouseWheel(e) {
    let zoomFactor = 1.05;
    if (e.delta > 0) { // zoom out
        pixelSize *= zoomFactor;
        graphMid[0] -= (mouseX - width/2) * pixelSize * (1 - 1/zoomFactor);
        graphMid[1] += (mouseY - height/2) * pixelSize * (1 - 1/zoomFactor);
    } else { // zoom in
        pixelSize /= zoomFactor;
        graphMid[0] -= (mouseX - width/2) * pixelSize * (1 - zoomFactor);
        graphMid[1] += (mouseY - height/2) * pixelSize * (1 - zoomFactor);
    }
}

function mouseDragged(e) {
    if (![funcInput, ltSensSlider].includes(document.activeElement)) {
        graphMid[0] -= e.movementX * pixelSize;
        graphMid[1] += e.movementY * pixelSize;
    }
}

function windowResized(){
    resizeCanvas(windowWidth, windowHeight);
}