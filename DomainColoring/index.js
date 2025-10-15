let dcShader;
let func = "tan(z)";
let prevFunc = func;
let pixelSize = 0.01;
let graphMid = [0, 0];

function getVert() {
    return `precision highp float;

    attribute vec3 aPosition;
    attribute vec2 aTexCoord;

    varying vec2 vTexCoord;

    void main() {
        vec4 positionVec4 = vec4(aPosition, 1.0);
        positionVec4.xy = positionVec4.xy * 2.0;
        gl_Position = positionVec4;

        vTexCoord = aTexCoord;
    }`
}

function getFrag(f) {
    return `precision highp float;

    varying vec2 vTexCoord;

    uniform vec2 graphSize;
    uniform vec2 graphCenter;

    #define i vec2(0.0, 1.0)
    #define e 2.71828182846
    #define pi 3.14159265359

    // These functions are missing in GLSL 1
    float cosh (float val) {
        float tmp = exp(val);
        return (tmp + 1.0 / tmp) / 2.0;
    }

    float sinh(float val) {
        float tmp = exp(val);
        return (tmp - 1.0 / tmp) / 2.0;
    }   

    float tanh(float val) {
        float tmp = exp(2.0*val);
        return 1.0 - 2.0 / (tmp + 1.0);
    }

    /****** Complex Function Definitions ******/
    vec2 cx_add(vec2 a, vec2 b) {return vec2(a.x+b.x, a.y+b.y);}
    vec2 cx_add(vec2 a, float b) {return vec2(a.x+b, a.y);}
    vec2 cx_add(float a, vec2 b) {return vec2(a+b.x, b.y);}
    vec2 cx_add(float a, float b) {return vec2(a+b, 0.0);}

    vec2 cx_sub(vec2 a, vec2 b) {return vec2(a.x-b.x, a.y-b.y);}
    vec2 cx_sub(vec2 a, float b) {return vec2(a.x-b, a.y);}
    vec2 cx_sub(float a, vec2 b) {return vec2(a-b.x, -b.y);}
    vec2 cx_sub(float a, float b) {return vec2(a-b, 0.0);}

    vec2 cx_mul(vec2 a, vec2 b) {return vec2(a.x*b.x-a.y*b.y, a.x*b.y+a.y*b.x);}
    vec2 cx_mul(vec2 a, float b) {return vec2(a.x*b, a.y*b);}
    vec2 cx_mul(float a, vec2 b) {return vec2(a*b.x, a*b.y);}
    vec2 cx_mul(float a, float b) {return vec2(a*b, 0.0);}
        
    vec2 cx_div(vec2 a, vec2 b) {return vec2((a.x*b.x+a.y*b.y)/(b.x*b.x+b.y*b.y), (a.y*b.x-a.x*b.y)/(b.x*b.x+b.y*b.y));}
    vec2 cx_div(float a, vec2 b) {return vec2(a*b.x/(b.x*b.x+b.y*b.y), -a*b.y/(b.x*b.x+b.y*b.y));}
    vec2 cx_div(vec2 a, float b) {return vec2(a.x/b, a.y/b);}
    vec2 cx_div(float a, float b) {return vec2(a/b, 0.0);}

    #define cx_ix(z) vec2(-z.y, z.x)
    #define cx_mod(z) length(z)
    #define cx_arg(z) atan(z.y, z.x)
    #define cx_exp(z) vec2(cos(z.y), sin(z.y))*exp(z.x)
    #define cx_log(z) vec2(log(length(z)), atan(z.y, z.x))
    #define cx_ln(z) cx_log(z)

    vec2 cx_cos(vec2 z) {return vec2(cos(z.x) * cosh(z.y), -sin(z.x) * sinh(z.y));}
    vec2 cx_sin(vec2 z) {return vec2(sin(z.x) * cosh(z.y), cos(z.x) * sinh(z.y));}
    vec2 cx_tan(vec2 z) {return vec2(sin(2.0*z.x), sinh(2.0*z.y)) / (cos(2.0*z.x)+cosh(2.0*z.y));}
    vec2 cx_sec(vec2 z) {return cx_div(1.0, cx_cos(z));}
    vec2 cx_csc(vec2 z) {return cx_div(1.0, cx_sin(z));}
    vec2 cx_cot(vec2 z) {return cx_div(1.0, cx_tan(z));}

    vec2 cx_pow(vec2 a, vec2 b) {return cx_exp(cx_mul(b, cx_log(a)));}
    vec2 cx_pow(vec2 a, float b) {return pow(cx_mod(a), b) * vec2(cos(cx_arg(a) * b), sin(cx_arg(a) * b));}
    vec2 cx_pow(float a, vec2 b) {return cx_exp(log(a) * b);}
    vec2 cx_pow(float a, float b) {return vec2(pow(a, b), 0.0);}

    vec2 cx_sqrt(vec2 z) {return cx_pow(z, 0.5);}
    vec2 cx_arcsin(vec2 z) {return -cx_ix(cx_log(cx_add(cx_sqrt(cx_sub(1.0, cx_mul(z, z))), cx_ix(z))));}
    vec2 cx_arccos(vec2 z) {return cx_sub(pi, 2.0 * cx_arcsin(z)) / 2.0;}
    vec2 cx_arctan(vec2 z) {return -cx_ix(cx_log(cx_div(cx_add(1.0, cx_ix(z)), cx_sub(1.0, cx_ix(z))))) / 2.0;}
    vec2 cx_arccsc(vec2 z) {return cx_arcsin(cx_div(1.0, z));}
    vec2 cx_arcsec(vec2 z) {return cx_arccos(cx_div(1.0, z));}
    vec2 cx_arccot(vec2 z) {return cx_arctan(cx_div(1.0, z));}
    
    vec2 cx_cosh(vec2 z) {return cx_cos(cx_ix(z));}
    vec2 cx_sinh(vec2 z) {return -cx_ix(cx_sin(cx_ix(z)));}
    vec2 cx_tanh(vec2 z) {return -cx_ix(cx_tan(cx_ix(z)));}
    vec2 cx_sech(vec2 z) {return cx_div(1.0, cx_cosh(z));}
    vec2 cx_csch(vec2 z) {return cx_div(1.0, cx_sinh(z));}
    vec2 cx_coth(vec2 z) {return cx_div(1.0, cx_tanh(z));}

    vec2 cx_arsinh(vec2 z) {return cx_log(cx_add(z, cx_sqrt(cx_add(cx_mul(z, z), 1.0))));}
    vec2 cx_arcosh(vec2 z) {return cx_log(cx_add(z, cx_sqrt(cx_sub(cx_mul(z, z), 1.0))));}
    vec2 cx_artanh(vec2 z) {return cx_log(cx_div(cx_add(1.0, z), cx_sub(1.0, z))) / 2.0;}
    vec2 cx_arcsch(vec2 z) {return cx_arsinh(cx_div(1.0, z));}
    vec2 cx_arsech(vec2 z) {return cx_arcosh(cx_div(1.0, z));}
    vec2 cx_arcoth(vec2 z) {return cx_artanh(cx_div(1.0, z));}

    vec3 hsl2rgb(in vec3 c) {
        vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
        return c.z + c.y * (rgb - 0.5) * (1.0 - abs(2.0 * c.z - 1.0));
    }

    #define f(z) ` + f + `
    
    void main() {
        vec2 z = vTexCoord.xy * graphSize - graphSize/2.0 + graphCenter;
        vec2 fz = f(z);

        gl_FragColor = vec4(hsl2rgb(vec3(mod(atan(fz.y, fz.x)/(2.0*pi) + 1.0, 1.0), 1.0, 2.0*atan(length(fz))/pi)), 1.0);
    }`
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

    // Check if function is constant
    if (/^-?\d+(\.\d+)?$/.test(nf)) {
        nf = "vec2(" + nf + ",0.0)";
        dcShader = createShader(getVert(), getFrag(nf));
        return;
    }

    // Replace unary subtraction operators, since they break things
    let ind = 0;
    while (ind < nf.length) {
        if (nf[ind] === "-" && (ind === 0 || nf[ind-1] === "(" || nf[ind-1] === ",")) {
            nf = nf.slice(0, ind) + "0.0" + nf.slice(ind);
        }
        ind++;
    }

    // Turn a+b into cx_add(a, b)
    nf = replaceWithFuncNotation(nf, "+", "add");

    // Turn a-b into cx_sub(a, b)
    nf = replaceWithFuncNotation(nf, "-", "sub");

    // Turn a*b into cx_mul(a, b)
    nf = replaceWithFuncNotation(nf, "*", "mul");

    // Turn a/b into cx_div(a, b)
    nf = replaceWithFuncNotation(nf, "/", "div");

    // Turn a^b into cx_pow(a, b)
    nf = replaceWithFuncNotation(nf, "^", "pow");

    // From longest to shortest (important)
    const cx_funcs = ["arcsin", "arccos", "arctan", "arccsc", "arcsec", "arccot", "arsinh", "arcosh", "artanh", "arcsch", "arsech", "arcoth",
        "sqrt", "sinh", "cosh", "tanh", "sech", "csch", "coth",
        "add", "sub", "mul", "div", "mod", "arg", "exp", "log", "cos", "sin", "tan", "pow", "sec", "csc", "cot", "ln"];

    for (let s of cx_funcs) {
        nf = nf.replaceAll(new RegExp("(^|[(,])(" + s + ")", "g"), "$1cx_$2");
    }

    console.log(nf);

    dcShader = createShader(getVert(), getFrag(nf));
}

function getFuncInput() {
    return document.getElementById("function-input");
}

function preload() {
    changeFunc(func);
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);

    window.addEventListener('wheel', event => {
        if (event.ctrlKey) {
            event.preventDefault();
        }
    }, {passive: false});

    const funcInput = getFuncInput();
    funcInput.addEventListener("input", function() {
        getFuncInput().style.borderColor = "black";
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

    try {
        plane(width, height);
    } catch (error) {
        getFuncInput().style.borderColor = "red";

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
    if (document.activeElement != getFuncInput()) {
        graphMid[0] -= e.movementX * pixelSize;
        graphMid[1] += e.movementY * pixelSize;
    }
}

function windowResized(){
    resizeCanvas(windowWidth, windowHeight);
}