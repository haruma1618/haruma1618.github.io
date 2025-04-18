const game = {"num_format": "standard", "menu": "game1", "essence": new Decimal(1000), "eps": new Decimal(0), "le": new Decimal(0), "leps": new Decimal(0), "le_power": new Decimal(1.2), "lc": [{"unlocked": true, "num": new Decimal(0), "num_bought": 0, "cost": new Decimal(10)}, {"unlocked": true, "num": new Decimal(0), "num_bought": 0, "cost": new Decimal(1000)}]}
let start;

function F(d, p, m=1) {
    let nf = numberformat.formatShort(d, {format: game.num_format, sigfigs: p, maxSmall: true})
    
    if (d < 1000) {
        return d.toFixed(m)
    } else if (d.gte(Number.MIN_VALUE) || d.eq(0)) {
        return nf
    } else {
        return d.toExponential(p - 1)
    }
}

function sidebar_btn_click(id) {
    const body_bg_colors = {"btn1": "#1c0040", "btn2": "#1b4000", "btn3": "#004040"}

    if (id in body_bg_colors) {
        document.body.style.backgroundColor = body_bg_colors[id];
    }
}

function buy_lc(tier) {
    lc_object = game.lc[tier - 1]
    
    if (game.essence.gte(lc_object.cost)) {
        game.essence = game.essence.sub(lc_object.cost)
        lc_object.num_bought += 1
        lc_object.num = lc_object.num.add(1)
    }
}

function update(t) {
    const seconds = (t - start) / 1000;
    start = t;
    
    // Math logic
    
    game.leps = game.lc[0].num.mul(1)
    le_gain = game.leps.mul(seconds)
    game.le = game.le.add(le_gain)
    
    for (let i = 1; i < game.lc.length; i++) {
        lc_obj = game.lc[i]
        prev_lc_obj = game.lc[i-1]
        
        prev_lc_gain = lc_obj.num.mul(10 * seconds)
        prev_lc_obj.num = prev_lc_obj.num.add(prev_lc_gain)
    }
    
    game.eps = game.le.pow(game.le_power)
    e_gain = game.eps.mul(seconds)
    game.essence = game.essence.add(e_gain);
    
    // Update HTML elements
  
    document.getElementById("essence-num").innerHTML = F(game.essence, 3);
    document.getElementById("eps-num1").innerHTML = F(game.eps, 3);
    document.getElementById("le-num").innerHTML = F(game.le, 3);
    document.getElementById("eps-num2").innerHTML = F(game.eps, 3);
    document.getElementById("leps-num").innerHTML = F(game.leps, 3);
    document.getElementById("le-power-num").innerHTML = "^" + game.le_power.toFixed(3);
    
    const lc_info_elements = document.getElementsByClassName("lc-info");
    for (let i = 0; i < lc_info_elements.length; i++) {
        lc_info_elements[i].innerHTML = "T" + (i + 1) + " Life Crystal - " + F(game.lc[i].num, 3, 0) + " (" + F(game.lc[i].num_bought, 3, 0) + ")";
    }
    
    const lc_buy_btn_elements = document.getElementsByClassName("lc-buy-btn-content");
    for (let i = 0; i < lc_buy_btn_elements.length; i++) {
        lc_buy_btn_elements[i].innerHTML = "Cost: " + game.lc[i].cost + " E"
    }
    
    const lc_progress_elements = document.getElementsByClassName("lc-progress");
    for (let i = 0; i < lc_progress_elements.length; i++) {
        lc_progress_elements[i].style.width = game.lc[i].num_bought % 5 * 20 + "%"
    }
    
    console.log(Math.round(1/seconds))
    
    requestAnimationFrame(update);
}

requestAnimationFrame(update);
