let dcShader;
let func = "z";
let prevFunc = func;
let pixelSize = 0.01;
let graphMid = [0, 0];
let logMode = true;
let funcInput;
let ltSensSlider;
let hueShiftSlider;
let hueValuesSlider;
let ltValuesSlider;
let numHueValues = 0;
let numLtValues = 0;
let zetaTerms = 50;

let bVert = `#version 300 es
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
let bFrag;
let bFragLog;

function getFrag(f, logMode) {
    return (logMode ? bFragLog : bFrag).replace("$$", f);
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

    const cx_funcs = ["arcsin", "arccos", "arctan", "arccsc", "arcsec", "arccot", "arsinh", "arcosh", "artanh", "arcsch", "arsech", "arcoth",
        "digamma", "gamma", "beta", "zeta", "eta", "faddeeva", "erf", "erfi", "lambertw", "W", "Ei", "li", "Tetr",
        "sqrt", "conj", "sinh", "cosh", "tanh", "sech", "csch", "coth",
        "add", "sub", "mul", "div", "abs", "arg", "sgn", "modulo",
        "exp", "log", "cos", "sin", "tan", "pow", "sec", "csc", "cot", "ln"];

    for (let s of cx_funcs) {
        nf = nf.replaceAll(new RegExp("(^|[(,])(" + s + ")", "g"), "$1cx_$2");
    }

    console.log(nf);

    dcShader = createShader(bVert, getFrag(nf, logMode));
}

async function setup() {
    funcInput = document.querySelector("#function-input");
    ltSensSlider = document.querySelector("#lt-sens-slider");
    hueShiftSlider = document.querySelector("#hue-shift-slider");
    hueValuesSlider = document.querySelector("#hue-values-slider");
    ltValuesSlider = document.querySelector("#lt-values-slider");

    bFrag = (await loadStrings("DcFrag.frag")).join("\n");
    bFragLog = (await loadStrings("DcFragLog.frag")).join("\n");

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

    funcInput.value = "z";
}

function draw() {  
    shader(dcShader);
    numHueValues = hueValuesSlider.value == 0 ? 0 : parseInt(hueValuesSlider.max) + 1 - hueValuesSlider.value;
    numLtValues = ltValuesSlider.value == 0 ? 0 : parseInt(ltValuesSlider.max) + 1 - ltValuesSlider.value;

    dcShader.setUniform("graphSize", [pixelSize * width, pixelSize * height]);
    dcShader.setUniform("graphCenter", graphMid);
    dcShader.setUniform("hueShift", hueShiftSlider.value);
    dcShader.setUniform("ltSens", ltSensSlider.value);
    dcShader.setUniform("numHueValues", numHueValues);
    dcShader.setUniform("numLightnessValues", numLtValues);
    dcShader.setUniform("zetaTerms", zetaTerms);

    document.querySelector("#lt-sens-value").innerHTML = ltSensSlider.value;
    document.querySelector("#hue-shift-value").innerHTML = hueShiftSlider.value + "°";
    document.querySelector("#hue-values-value").innerHTML = numHueValues == 0 ? "∞" : numHueValues;
    document.querySelector("#lt-values-value").innerHTML = numLtValues == 0 ? "∞" : numLtValues + 1;
    document.querySelector("#logmode-button").style.backgroundColor = logMode ? "#ddffff" : "#ffdddd";
    document.querySelector("#logmode-value").innerHTML = logMode;

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
    if (![funcInput, ltSensSlider, hueShiftSlider, hueValuesSlider, ltValuesSlider].includes(document.activeElement)) {
        graphMid[0] -= e.movementX * pixelSize;
        graphMid[1] += e.movementY * pixelSize;
    }
}

function windowResized(){
    resizeCanvas(windowWidth, windowHeight);
}