const game = {"num_format": "scientific", "menu": "life", "submenu": "life-crystals", "le": new Decimal(1000), "leps": new Decimal(0), "lc_buy5mul": 2, "lc": []}
const lc_base_costs = [new Decimal(10), new Decimal(100), new Decimal(1e4), new Decimal(1e6)]
const lc_base_cost_muls = [new Decimal(100), new Decimal(1e3), new Decimal(1e4), new Decimal(1e5)]
const menu_submenus = {"life": ["life-crystals", "upgrades"], "achievements": ["achievements"], "options": ["saving", "visual"]}
const submenu_names = {"life-crystals": "Life Crystals", "upgrades": "Upgrades", "achievements": "Achievements", "saving": "Saving", "visual": "Visual"}

let lc_object;
for (i = 0; i < lc_base_costs.length; i++) {
    lc_object = {"unlocked": true, "num": new Decimal(0), "num_bought": 0, "ps": 0, "mul": new Decimal(1), "cost": lc_base_costs[i], "cost_mul": lc_base_cost_muls[i]}
    game.lc.push(lc_object);
}

for (i = 1; i < lc_base_costs.length; i++) {
    const lcp_clone = document.getElementsByClassName("lcp")[0].cloneNode(true)
    const production_el = document.getElementById("production")
    production_el.appendChild(lcp_clone)
}

const lc_buy_btns = document.getElementsByClassName("lc-buy-btn")
for (i = 0; i < lc_base_costs.length; i++) {
    lc_buy_btns[i].setAttribute("onclick", "buy_lc(" + (i + 1) + ")")
}

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

function replace_submenus(submenus) {
    const submenu_buttons = document.getElementById("submenu-buttons")
    while (submenu_buttons.firstChild) {
        submenu_buttons.removeChild(submenu_buttons.lastChild)
    }
    
    for (let i = 0; i < submenus.length; i++) {
        const new_button = document.createElement("button")
        new_button.classList.add("submenu-button")
        new_button.id = "submenu-" + submenus[i]
        new_button.setAttribute("onclick", "submenu_btn_click(this.id)")
        const button_text = document.createTextNode(submenu_names[submenus[i]])
        new_button.appendChild(button_text)
        submenu_buttons.appendChild(new_button);
    }
}

function menu_btn_click(id) {
    const body_bg_colors = {"menu-life": "#2c0045", "menu-achievements": "#403b00", "menu-options": "#363636"}

    if (id in body_bg_colors) {
        document.body.style.backgroundColor = body_bg_colors[id];
    }
    
    menu_name = id.replace("menu-", "")
    game.menu = menu_name
    game.submenu = menu_submenus[menu_name][0]
    console.log([game.menu, game.submenu])
    
    console.log(menu_submenus[menu_name])
    replace_submenus(menu_submenus[menu_name])
}

function submenu_btn_click(id) {
    game.submenu = id.replace("submenu-", "")
    console.log([game.menu, game.submenu])
}

function buy_lc(tier) {
    lc_object = game.lc[tier - 1]
    
    if (game.le.gte(lc_object.cost)) {
        game.le = game.le.sub(lc_object.cost)
        lc_object.num_bought += 1
        lc_object.num = lc_object.num.add(1)
        
        if (lc_object.num_bought % 5 === 0) {
            lc_object.cost = lc_object.cost.mul(lc_object.cost_mul)
            lc_object.mul = lc_object.mul.mul(game.lc_buy5mul)
        }
    }
}

function life_menu_update() {
    switch (game.submenu) {
        case "life-crystals":
            document.getElementById("production").style.display = "inline-block"
            
            const lc_info_tier_elements = document.getElementsByClassName("lc-info-tier");
            for (let i = 0; i < lc_info_tier_elements.length; i++) {
                lc_info_tier_elements[i].innerHTML = "T" + (i + 1) + " Life Crystal"
            }
            
            const lc_info_mul_elements = document.getElementsByClassName("lc-info-mul");
            for (let i = 0; i < lc_info_mul_elements.length; i++) {
                lc_info_mul_elements[i].innerHTML = "x" + F(game.lc[i].mul, 3, 2);
            }
            
            const lc_info_num_elements = document.getElementsByClassName("lc-info-num");
            for (let i = 0; i < lc_info_num_elements.length; i++) {
                lc_info_num_elements[i].innerHTML = F(game.lc[i].num, 3, 0) + " (" + F(game.lc[i].num_bought, 3, 0) + ")";
            }
            
            const lc_info_gain_elements = document.getElementsByClassName("lc-info-gain");
            for (let i = 0; i < lc_info_gain_elements.length; i++) {
                lc_info_gain_elements[i].innerHTML = "+" + F(game.lc[i].ps, 3, 1) + "/s"
            }
            
            const lc_buy_btn_elements = document.getElementsByClassName("lc-buy-btn-content");
            for (let i = 0; i < lc_buy_btn_elements.length; i++) {
                lc_buy_btn_elements[i].innerHTML = "Cost: " + F(game.lc[i].cost, 3, 0) + " E"
            }
            
            const lc_progress_elements = document.getElementsByClassName("lc-progress");
            for (let i = 0; i < lc_progress_elements.length; i++) {
                lc_progress_elements[i].style.width = game.lc[i].num_bought % 5 * 20 + "%"
            }
            break;
        default:
            break;
    }
}

let start;
function update(t) {
    const seconds = (t - start) / 1000;
    start = t;
    
    // Math logic
    
    for (let i = 1; i < game.lc.length; i++) {
        let lc_obj = game.lc[i]
        let prev_lc_obj = game.lc[i-1]
        
        prev_lc_obj.ps = lc_obj.num.mul(lc_obj.mul).mul(0.2)
        prev_lc_gain = prev_lc_obj.ps.mul(seconds)
        prev_lc_obj.num = prev_lc_obj.num.add(prev_lc_gain)
    }
    
    game.leps = game.lc[0].num.mul(game.lc[0].mul).mul(1)
    e_gain = game.leps.mul(seconds)
    game.le = game.le.add(e_gain);
    
    // Update HTML elements
  
    document.getElementById("le-num").innerHTML = F(game.le, 3);
    document.getElementById("leps-num").innerHTML = F(game.leps, 3);
    
    document.getElementById("production").style.display = "none"
    
    switch (game.menu) {
        case "life":
            life_menu_update();
            break;
        default:
            break;
    }
   
    
    // console.log(Math.round(1/seconds))
    // console.log(document.getElementsByClassName("lc-progress")[0].style.width)
    
    requestAnimationFrame(update);
}

requestAnimationFrame(update);
