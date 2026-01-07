let dcShader;
let func = "z";
let prevFunc = func;
let pixelSize = 0.01;
let graphMid = [0, 0];
let logMode = true;
let expColoring = false;
let funcInput;
let buffer;
let hideBottom = false;
let showInfoPopup = false;

let manualCompile = false;
let ltSensSlider;
let hueShiftSlider;
let hueValuesSlider;
let ltValuesSlider;

let numHueValues = 0;
let numLtValues = 0;
let maxZetaTerms = 500;

let bVert = `#version 300 es
precision highp float;

in vec3 aPosition;
in vec2 aTexCoord;

out vec2 vTexCoord;

void main() {
    vec4 positionVec4 = vec4(aPosition, 1.0);
    positionVec4.xy = vec2(positionVec4.x, -positionVec4.y) * 2.0;
    gl_Position = positionVec4;

    vTexCoord = aTexCoord;
}`;
let bFrag;
let bFragLog;
console.error = () => {}; // Prevent 10+ errors appearing for every keypress

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
        nf = nf.slice(0, expInds[0]) + funcName + "(" + nf.slice(expInds[0], ind) + "," + nf.slice(ind+1, expInds[1]) + ")" + nf.slice(expInds[1], nf.length);
    }

    return nf;
}

function changeFunc(f) {
    let nf = f;
    let indOffset;

    // Remove all blank space
    nf = nf.replace(/\s+/g, '');
    nf = nf.toLowerCase();

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
        "digamma", "gamma", "beta", "zeta", "eta", "faddeeva", "erf", "erfi", "lambertw", "ei", "li", "tetr",
        "sqrt", "conj", "sinh", "cosh", "tanh", "sech", "csch", "coth",
        "add", "sub", "mul", "div", "abs", "arg", "sgn", "modulo",
        "exp", "log", "cos", "sin", "tan", "pow", "sec", "csc", "cot", "ln"];
    for (let s of cx_funcs) {
        nf = nf.replaceAll(new RegExp("(^|[(,])(" + s + ")", "g"), "$1cx_$2");
    }

    dcShader = createShader(bVert, getFrag(nf, logMode));
}

function rgbToHsl(r, g, b) {
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6; // Normalize hue to 0-1 range
    }

    return [h, s, l];
}

function colorToValue(rgb) {
    if (rgb[0] + rgb[1] + rgb[2] == 0) {
        return [-Infinity, 0];
    }

    let hsl = rgbToHsl(rgb[0], rgb[1], rgb[2]);
    
    if (hsl[1] < 0.9) {
        return [NaN, NaN];
    }

    let ln_mod;
    if (!expColoring) {
        // Inverse of y = 1-1/(1+x^ltSens)
        ln_mod = Math.log(hsl[2] / (1-hsl[2])) / ltSensSlider.value;
    } else {
        // Inverse of y = 1-1/(2+ln(x)*ltSens) for y>0.5, y = 1-1/(1+1/(1-ln(x)*ltSens)) for y<=0.5
        ln_mod = hsl[2] > 0.5 ? (2*hsl[2]-1)/(1-hsl[2]) / ltSensSlider.value : (2*hsl[2]-1)/(hsl[2]) / ltSensSlider.value;
    }

    // Solving for arctan(y, x)
    let n_angle = (hsl[0] - hueShiftSlider.value/360);

    return [ln_mod, n_angle];
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

    buffer = createFramebuffer({format: FLOAT});  // Allows for higher color precision than just 0-255

    window.addEventListener('wheel', event => {
        if (event.ctrlKey) {
            event.preventDefault(); // Prevent zooming
        }
    }, {passive: false});

    funcInput.addEventListener("input", function() {
        funcInput.style.borderColor = "black";
        prevFunc = func;
        func = funcInput.value;
        
        if (!manualCompile) {
            changeFunc(func);
        }
    });

    funcInput.value = "z";
}

function draw() {  
    buffer.begin();
    shader(dcShader);
    numHueValues = hueValuesSlider.value == 0 ? 0 : parseInt(hueValuesSlider.max) + 1 - hueValuesSlider.value;
    numLtValues = ltValuesSlider.value == 0 ? 0 : parseInt(ltValuesSlider.max) + 1 - ltValuesSlider.value;

    dcShader.setUniform("graphSize", [pixelSize * width, pixelSize * height]);
    dcShader.setUniform("graphCenter", graphMid);
    dcShader.setUniform("hueShift", hueShiftSlider.value);
    dcShader.setUniform("ltSens", ltSensSlider.value);
    dcShader.setUniform("numHueValues", numHueValues);
    dcShader.setUniform("numLightnessValues", numLtValues);
    dcShader.setUniform("maxZetaTerms", maxZetaTerms);
    dcShader.setUniform("expColoring", expColoring);

    document.querySelector("#lt-sens-value").innerHTML = ltSensSlider.value;
    document.querySelector("#hue-shift-value").innerHTML = hueShiftSlider.value + "°";
    document.querySelector("#hue-values-value").innerHTML = numHueValues == 0 ? "∞" : numHueValues;
    document.querySelector("#lt-values-value").innerHTML = numLtValues == 0 ? "∞" : numLtValues + 1;

    document.querySelector("#logmode-button").style.backgroundColor = logMode ? "#ddffff" : "#ffdddd";
    document.querySelector("#logmode-value").innerHTML = logMode;
    document.querySelector("#manual-comp-button").style.backgroundColor = manualCompile ? "#ddffff" : "#ffdddd";
    document.querySelector("#manual-comp-value").innerHTML = manualCompile;
    document.querySelector("#exp-coloring-button").style.backgroundColor = expColoring ? "#ddffff" : "#ffdddd";
    document.querySelector("#exp-coloring-value").innerHTML = expColoring;
    document.querySelector("#compile-button").style.display = manualCompile ? "inline" : "none";
    document.querySelector("#info-popup").style.display = showInfoPopup ? "flex" : "none";

    let mouseCoordX = (graphMid[0] + (mouseX - width/2) * pixelSize).toPrecision(4);
    let mouseCoordY = (graphMid[1] - (mouseY - height/2) * pixelSize).toPrecision(4);
    document.querySelector("#z-value-text").innerHTML = "z = " + mouseCoordX + " + " + mouseCoordY + "i";

    let mousePxColor = buffer.get(mouseX, mouseY).slice(0, -1);  // Get color at mouse position
    let fz_txt = document.querySelector("#fz-value-text");

    let mousePxValue = colorToValue(mousePxColor);  // f(z) at mouse position
    if (mousePxColor[0] + mousePxColor[1] + mousePxColor[2] == 3) {
        // Highest possible value that can be represented
        let maxPxValueAbs = colorToValue([1, 1, 1-2**-24], 1)[0] * Math.log10(Math.E);
        fz_txt.innerHTML = "|f(z)| > " + Math.pow(10, maxPxValueAbs-Math.floor(maxPxValueAbs)).toPrecision(4) + "e" + Math.floor(maxPxValueAbs);
    } else if (mousePxValue[0] > 64*Math.log(2)) {  // Value is above (arbitrary) limit - always display polar
        let valExp = mousePxValue[0] * Math.log10(Math.E);
        let valMnt = Math.pow(10, valExp - Math.floor(valExp));
        valExp = Math.abs(Math.floor(valExp));
        
        let e_sign = mousePxValue[0] >= 0 ? "e+" : "e-";
        fz_txt.innerHTML = "f(z) ≈ " + valMnt.toPrecision(4) + e_sign + valExp + "e<sup>" + mousePxValue[1].toPrecision(4) + "iτ</sup>";
    } else {
        if (document.querySelector("#rect-value").checked) {
            let reVal = Math.exp(mousePxValue[0])*Math.cos(2*Math.PI*mousePxValue[1]);
            let imVal = Math.exp(mousePxValue[0])*Math.sin(2*Math.PI*mousePxValue[1]);

            fz_txt.innerHTML = "f(z) ≈ " + reVal.toPrecision(4) + " + " + imVal.toPrecision(4) + "i";
        }
        if (document.querySelector("#polar-value").checked) {
            fz_txt.innerHTML = "f(z) ≈ " + Math.exp(mousePxValue[0]).toPrecision(4) + "e<sup>" + mousePxValue[1].toPrecision(4) + "iτ</sup>";
        }
    }

    try { // This feels stupid, but it works
        plane(width, height);
    } catch (error) {
        funcInput.style.borderColor = "red";

        func = prevFunc;
        changeFunc(func);
    }

    buffer.end();
    image(buffer, -width/2, -height/2);
}

function mouseWheel(e) {
    if (!showInfoPopup) {
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
}

function mouseDragged(e) {
    if (![funcInput, ltSensSlider, hueShiftSlider, hueValuesSlider, ltValuesSlider].includes(document.activeElement)) {
        graphMid[0] -= e.movementX * pixelSize;
        graphMid[1] += e.movementY * pixelSize;
    }
}

function keyPressed() {
    if (manualCompile && keyCode === 13) {
        changeFunc(func);
    }
}

function windowResized(){
    resizeCanvas(windowWidth, windowHeight);
}