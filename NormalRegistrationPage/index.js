function generateRules() {
    stateVars.randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
    stateVars.unicodeMin = Math.floor(Math.random() * (65535-128));
    stateVars.unicodeMax = stateVars.unicodeMin + 128;
    stateVars.randomCountry = Object.keys(countryCapitals)[Math.floor(Math.random() * Object.keys(countryCapitals).length)];
    stateVars.secretTextX = 40 + Math.random() * 50 + "%";
    stateVars.secretTextY = 40 + Math.random() * 50 + "%";
    stateVars.secretText = numToB64(1e16 + Math.random()*1e18).toString();
    stateVars.romanNumSum = Math.floor(Math.random() * 3000) + 2000;

    return ["Your password must be at least 5 characters long.",
    "Actually, nevermind. Your password must be at least 30 characters long.",
    "Your password must contain at least 3 numbers.",
    "Your password must consist of at least 10% capital letters.",
    "Your password must contain the exact hex color of this text.",
    "Your password must contain a Unicode character between " + 
    stateVars.unicodeMin.toString(16).toUpperCase().padStart(4, "0") + " and " + stateVars.unicodeMax.toString(16).toUpperCase().padStart(4, "0") + " (hexadecimal).",
    "Your password must include this webpage's link.",
    "No single character can take up more than 10% of your password.",
    "The percentage of your password that is not alphanumeric must be between 25% and 27%.",
    "Your password must include the number of minutes since midnight, January 1st, 1970.",
    "The sum of all the numbers in your password must be prime. (Currently: <span id='numberSum'></span>)",
    "Your password must contain at least 3 brainrot references. (Currently: <span id='brainrotRefs'></span>)",
    "Your password must include the capital of " + stateVars.randomCountry + ".",
    "Your password must include the secret text hidden on this page.",
    "The sum of all the Roman numerals in your password must equal " + stateVars.romanNumSum + ". (Currently: <span id='romanNumSum'></span>)",
    "The average value of the chess pieces in your password must be between 3.1 and 3.2. (Currently: <span id='chessAvg'></span>)",
    "The number of digits, capital letters, and lowercase letters in your password must be in an arithmetic progression. (Currently: <span id='charProg'></span>)",
    "Your password must include at least 10 zero-width spaces. Zero-width spaces must only be placed at prime indices.",
    "Your password must include the exact value of this integral: <img src='integral19.png' alt='Ok whatever, the answer is -2' width='400'>",
    "Your password must include the following string: \"I am 100% certain that this password is fully secure, and I will definitely not reuse this password on other websites\""];
}

let rules;
const stateVars = {};
const brainrotRefs = ["skibidi", "goon", "67", "kirk", "sigma", "lebron", "gyatt", "aura", "sybau", "mew", "mog", "rizz", "diddy", "ohio"];
const countryCapitals = {
    "Armenia": "Yerevan",
    "Brunei": "Bandar Seri Begawan",
    "Burkina Faso": "Ouagadougou",
    "Côte D'Ivoire": "Yamoussoukro",
    "Honduras": "Tegucigalpa",
    "Iceland": "Reykjavik",
    "Kiribati": "South Tarawa",
    "Madagascar": "Antananarivo",
    "Malawi": "Lilongwe",
    "Mauritania": "Nouakchott",
    "Myanmar": "Naypyidaw",
    "Palau": "Ngerulmud",
    "Slovenia": "Ljubljana",
    "Sri Lanka": "Sri Jayawardenepura Kotte",
    "Sudan": "Khartoum",
    "Tonga": "Nuku'alofa",
    "Tuvalu": "Funafuti"
}

const ruleChecks = [
    (p) => p.length >= 5,
    (p) => p.length >= 30,
    (p) => countChars(p, (s) => /[0-9]/.test(s)) >= 3,
    (p) => countChars(p, (s) => /[A-Z]/.test(s))/p.length >= 0.1,
    (p) => p.toLowerCase().includes(stateVars.randomColor),
    (p) => countChars(p, (s) => s.codePointAt(0) >= stateVars.unicodeMin && s.codePointAt(0) <= stateVars.unicodeMax) >= 1,
    (p) => p.includes(window.location.href),
    (p) => {for (let i = 0; i < p.length; i++) {
        if ((p.split(p[i]).length-1)/p.length >= 0.1) {
            return false;
        }
    } return true;},
    (p) => {let count = countChars(p, (s) => /[^a-zA-Z0-9]/.test(s));
            return count/p.length >= 0.25 && count/p.length <= 0.27;},
    (p) => p.includes(Math.floor(Date.now()/1000/60).toString()),
    (p) => isPrime(getNumberSum(p)),
    (p) => {let count = 0;
        for (let s of brainrotRefs) {
            if (p.toLowerCase().includes(s)) {
                count++;
            }
        }
        return count >= 3;
    },
    (p) => p.includes(countryCapitals[stateVars.randomCountry]),
    (p) => p.includes(stateVars.secretText),
    (p) => romanNumTotal(p) == stateVars.romanNumSum,
    (p) => chessValueAvg(p) >= 3.1 && chessValueAvg(p) <= 3.2,
    (p) => {let prog = characterProg(p);
        return (prog[1]-prog[0] == prog[2]-prog[1]);
    },
    (p) => countChars(p, (s) => s == "​") >= 10 && checkZWSPIndices(p),
    (p) => p.includes("-2"),
    (p) => p.includes("I am 100% certain that this password is fully secure, and I will definitely not reuse this password on other websites")
];

function checkZWSPIndices(p) {
    for (let i = 0; i < p.length; i++) {
        if (p[i] == "​" && !isPrime(i)) {
            return false;
        }
    }

    return true;
}

function romanNumTotal(str) {
    const numMap = new Map([["CM", 900], ["M", 1000], ["CD", 400], ["D", 500], ["XC", 90], ["C", 100],
                            ["XL", 40], ["L", 50], ["IX", 9], ["X", 10], ["IV", 4], ["V", 5], ["I", 1]]);
    
    let ttl = 0;
    for (let [s, n] of numMap) {
        let nMatches = [...str.matchAll(new RegExp(s, 'g'))].length;
        str = str.replaceAll(s, "");
        ttl += n * nMatches;
    }

    return ttl;
}

function chessValueAvg(str) {
    const valueMap = {"♔": Infinity, "♕": 9, "♖": 5, "♗": 3, "♘": 3, "♙": 1, "♚": Infinity, "♛": 9, "♜": 5, "♝": 3, "♞": 3, "♟": 1};

    let ttl = 0;
    let n = 0;
    for (let i = 0; i < str.length; i++) {
        for (let [k, v] of Object.entries(valueMap)) {
            if (str[i] == k) {
                ttl += v;
                n += 1;
            }
        }
    }

    return ttl/n;
}

function characterProg(p) {
    let arr = [countChars(p, (s) => /[0-9]/.test(s)), countChars(p, (s) => /[A-Z]/.test(s)), countChars(p, (s) => /[a-z]/.test(s))];
    arr.sort((a, b) => a - b);
    return arr;
}

function isPrime(num) {
    if (num <= 1) {return false;}
    for (let i = 2; i*i < num; i++) {
        if(num % i === 0) return false;
    }
    return true;
}

function numToB64(n) {
    const chars = "0123456789ABEFGHIJKLNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!?*$#";
    let b = chars.length;
    let str = '';
    
    n = Math.floor(n);
    while (n > 0) {
        let r = n % b;
        str = chars[r] + str;
        n = Math.floor(n/b);
    }

    return str;
}

function getNumberSum(p) {
    let m = p.match(/\d+/g);
    let total = 0;
    if (m) {
        for (let i = 0; i < m.length; i++) {
            total += parseInt(m[i]);
        }
    }
    return total;
}

function countChars(str, func) {
    let n = 0;
    for (let i = 0; i < str.length; i++) {
        if (func(str[i])) {
            n++;
        }
    }
    return n;
}

let auto = 0;
let highestRule = 0;
let pass;

function onPassInput() {
    pass = document.querySelector("#password").textContent;

    document.querySelector("#numberSum").innerHTML = getNumberSum(pass);
    document.querySelector("#romanNumSum").innerHTML = romanNumTotal(pass);
    document.querySelector("#chessAvg").innerHTML = chessValueAvg(pass);
    document.querySelector("#charProg").innerHTML = characterProg(pass);

    document.querySelector("#brainrotRefs").innerHTML = ""
    for (let s of brainrotRefs) {
        if (pass.toLowerCase().includes(s)) {
            document.querySelector("#brainrotRefs").innerHTML += s + "&nbsp;"
        }
    }

    let goodPass = true;
    for (let i = 0; i < rules.length; i++) {
        let txtElem = document.querySelectorAll(".password-rule")[i];
        if (txtElem) {
            if (goodPass) {
                txtElem.classList.add("show");
                if (ruleChecks[i](pass) || i < auto) {
                    txtElem.style.color = "green";
                } else {
                    txtElem.style.color = "red";
                    if (i == 4) {
                        txtElem.style.color = stateVars.randomColor;
                    }
                    goodPass = false;
                }
            } else {
                txtElem.style.color = "red";
                txtElem.classList.remove("show");
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    rules = generateRules();

    for (let i = 0; i < rules.length; i++) {
        const d = document.createElement("div");
        d.innerHTML = (i+1) + ". " + rules[i];
        d.classList.add("password-rule");

        //d.style.display = "none";
        document.querySelector("#password-rules").appendChild(d);
    }

    document.querySelector("#secret-text").textContent = stateVars.secretText;
    document.querySelector("#secret-text").style.top = stateVars.secretTextX;
    document.querySelector("#secret-text").style.left = stateVars.secretTextY;
});