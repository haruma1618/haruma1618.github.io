"use strict";
const game = {};
const game_local = {menu: "life", submenu: "life-crystals", ticker_pos: 100};

const lc_base_costs = [new Decimal(5), new Decimal(100), new Decimal(5e3), new Decimal(1e6)];
const lc_base_cost_muls = [new Decimal(400), new Decimal(3e3), new Decimal(6e4), new Decimal(1.5e6)];

const menu_submenus = {"life": ["life-crystals", "upgrades"], "achievements": ["achievements"], "options": ["saving", "visual"], "statistics": ["statistics"]};
const submenu_names = {"life-crystals": "Life Crystals", "upgrades": "Upgrades", "achievements": "Achievements", "saving": "Saving", "visual": "Visual", "statistics": "Statistics"};
const menu_colors = {"menu-life": ["#2c0045", "#7e0094"], "menu-achievements": ["#403b00", "#b5a000"], "menu-options": ["#363636", "#707070"], "menu-statistics": ["#400020", "#900048"]};
const num_achievements = 20;

const ticker_messages = {
    "0": "This game only has a news ticker because I'm too lazy to actually update the game",
    "1": "Here's a fun maths puzzle: Timothy has a cube of blocks with side length n. Is it possible for Timothy to rearrange the blocks into two smaller cubes so that no blocks are left over? Prove your result.",
    "2": "Hey Vsauce, Michael here. This game is very balanced... or is it?",
    "3": "Your dice rolls: {0} - {1}",
    "4": "The world population has increased by about {0} since you first started playing this game",
    "5": "The downwards subside disappear meme is still ENORMOUS!",
    "6": "(ﾉ✿◕ヮ◕)ﾉ*:･ﾟ✧ (❛◡❛✿)",
    "7": "◢▆▅▄▃ 溫╰(〞︶〝) ╯馨 ▃▄▅▆◣",
    "8": "Why are people leaving food in the oven at 175C for 15 minutes when they could just leave it at 157500C for 1 second?",
    "9": "New update drops in just 12!! hours!!!!",
    "10": "Water bucket, RELEASE!",
    "11": "RIP Pope Francis 44²-45²",
    "12": "20% of car crashes are caused by drunk drivers, and 80% are caused by sober drivers. Therefore, it's 4x safer to drive drunk than to drive sober",
    "13": "2^246829917-1 is prime. Source: just trust me bro",
    "14": "The least beautiful equation: π^(0*ei)=1",
    "15": "Many people are annoyed that τ equals 2π even though it looks like half of π. I propose that we switch the values of π and τ, so that π ≈ 6.28 and τ ≈ 3.14. This will definitely not cause any confusion whatsoever.",
    "16": "E=mc^2, and a^2+b^2=c^2, therefore E=m(a^2+b^2)",
    "17": "Ab Bb Db Bb F F Eb Ab Bb Db Bb Eb Eb Db C Bb Ab Bb Db Bb Db Eb C Bb Ab Ab Eb Db",
    "18": "No, don't base-64 decode that save file!",
    "19": "Why are all of the function names lowercase and separated by underscores? The Python brainrot is real",
    "20": "I... am STEVE.",
    "21": "We can use lightyears and lightseconds to measure distance, but how about lightkilometers and lightparsecs to measure time?",
    "22": "La-la-la-lava, ch-ch-ch-chicken, Steve's lava chicken yeah it's tasty as hell, ooh, mamacita, now you're ringin' the bell, crispy and juicy now you're havin' a snack, ooh, super spicy, it's a LAVA ATTACK!",
    "23": "Waxed lightly weathered cut copper stairs!",
    "24": "Here's a random unicode character: {0}"
};

const achievement_names = ["The Beginning", "Quadratic"];
const achievement_descriptions = ["Buy a T1 Life Crystal", "Buy a T2 Life Crystal"];
let request_update = false;

function setup_game() {
    const new_game = {time: 0, start_time: Date.now(), num_format: "scientific", le: new Decimal(1000), lc_buy5mul: 2, lc: [], achievements: []};

    for (let i = 0; i < lc_base_costs.length; i++) {
        const lc_object = {"unlocked": (i === 0), "num": new Decimal(0), "num_bought": 0, "ps": 0, "mul": new Decimal(1), "cost": lc_base_costs[i], "cost_mul": lc_base_cost_muls[i]};
        new_game.lc.push(lc_object);
    }

    for (let i in new_game) {
        game[i] = new_game[i];
    }
}

function setup_menu_buttons() {
    const menu_buttons = document.getElementsByClassName("menu-button");
    for (let i = 0; i < menu_buttons.length; i++) {
        menu_buttons[i].style.backgroundColor = menu_colors[menu_buttons[i].id][1];
    }

    const submenu_buttons = document.getElementById("submenu-buttons");
    for (let j in menu_submenus) {
        for (let i = 0; i < menu_submenus[j].length; i++) {
            const new_button = document.createElement("button");
            new_button.classList.add("submenu-button");
            new_button.id = "submenu-" + menu_submenus[j][i];
            new_button.setAttribute("onclick", "submenu_btn_click(this.id)");
            const button_text = document.createTextNode(submenu_names[menu_submenus[j][i]]);
            new_button.appendChild(button_text);
            submenu_buttons.appendChild(new_button);
        }
    }

    replace_submenus(menu_submenus["life"])
}

function setup_lcp_elements() {
    for (let i = 1; i < lc_base_costs.length; i++) {
        const lcp_clone = document.getElementsByClassName("lcp")[0].cloneNode(true);
        const production_el = document.getElementById("production");
        production_el.appendChild(lcp_clone);
    }
    
    for (let i = 0; i < lc_base_costs.length; i++) {
        document.getElementsByClassName("lc-buy-btn")[i].setAttribute("onclick", "buy_lc(" + (i + 1) + ")");

        const classes = document.getElementsByClassName("lcp")[i].classList;

        if (i % 2 === 0) {
            classes.add("lcp-even");
        } else {
            classes.add("lcp-odd");
        }
    }
}

function create_div(classes, text="") {
    let new_div = document.createElement("div");
    for (let i = 0; i < classes.length; i++) {
        new_div.classList.add(classes[i]);
    }

    if (text) {
        let text_node = document.createTextNode(text);
        new_div.appendChild(text_node);
    }

    return new_div;
}

function setup_achievement_elements() {
    for (let i = 0; i < num_achievements; i++) {
        let achievement_num_str = String(i).padStart(2, "0");

        let achievement_box = create_div(["achievement-box"], achievement_num_str)
        document.getElementById("achievements").appendChild(achievement_box);
        
        let achievement_box_popup = create_div(["achievement-box-popup"])
        achievement_box.appendChild(achievement_box_popup);

        if (0 <= i < 20) {
            achievement_box.classList.add("achievement-box-life");
            achievement_box_popup.classList.add("achievement-box-life");
        }

        let achievement_box_popup_arrow = document.createElement("div");
        achievement_box_popup_arrow.classList.add("achievement-box-popup-arrow");
        achievement_box_popup.appendChild(achievement_box_popup_arrow);

        let achievement_name_el = document.createElement("div");
        achievement_name_el.classList.add("achievement-name");
        let achievement_name_text = document.createTextNode(achievement_names[i] + " (" + achievement_num_str + ")");
        achievement_name_el.appendChild(achievement_name_text)
        achievement_box_popup.appendChild(achievement_name_el);

        let achievement_desc_el = document.createElement("div");
        achievement_desc_el.classList.add("achievement-desc");
        let achievement_desc_text = document.createTextNode(achievement_descriptions[i]);
        achievement_desc_el.appendChild(achievement_desc_text);
        achievement_box_popup.appendChild(achievement_desc_el);
    }
}

function get_news_message(key=null) {
    let random_key;
    if (key) {
        random_key = key;
    } else {
        let ticker_keys = Object.keys(ticker_messages);
        random_key = ticker_keys[ticker_keys.length * Math.random() << 0];
    }
    let random_message = ticker_messages[random_key];

    if (random_key === "3") {
        let dice_rolls = [];
        for (let i = 0; i < 5; i++) {
            dice_rolls.push((Math.floor(Math.random()*6)+1));
        }
        dice_rolls.sort();

        random_message = random_message.replace("{0}", dice_rolls.join(" "));

        const counts = {};
        for (const num of dice_rolls) {
            counts[num] = counts[num] ? counts[num] + 1 : 1;
        }
        const count_values = Object.values(counts);

        if (count_values.includes(5)) {
            random_message = random_message.replace("{1}", "FIVE OF A KIND!!! +500 aura!!!");
        } else if (count_values.includes(4)) {
            random_message = random_message.replace("{1}", "Four of a kind!! +100 aura!!");
        } else if (count_values.includes(3) && count_values.includes(2)) {
            random_message = random_message.replace("{1}", "Full house!! +50 aura!!");
        } else if (JSON.stringify(dice_rolls) === JSON.stringify([1,2,3,4,5]) ||
                   JSON.stringify(dice_rolls) === JSON.stringify([2,3,4,5,6])) {
            random_message = random_message.replace("{1}", "Straight!! +50 aura!!");
        } else if (count_values.filter(x => x === 2).length === 2) {
            random_message = random_message.replace("{1}", "Two pair! +10 aura!");
        } else if (count_values.includes(3)) {
            random_message = random_message.replace("{1}", "Triplet! +10 aura!");
        } else {
            random_message = random_message.replace("{1}", "Nothing... Better luck next time!");
        }
    } else if (random_key === "4") {
        random_message = random_message.replace("{0}", Math.floor(2.535 * (Date.now() - game.start_time) / 1000));
    } else if (random_key === "24") {
        let random_unicode = String.fromCharCode.apply(null, Array.from(Array(1), () => Math.floor(Math.random()*65536)))
        random_message = random_message.replace("{0}", random_unicode);
    }

    return random_message;
}

function update_ticker() {
    const ticker_container = document.getElementsByClassName("news-ticker")[0];
    const ticker = document.getElementsByClassName("ticker-message")[0];

    if (!ticker.innerHTML || game_local.ticker_pos * ticker_container.offsetWidth / 100 < -ticker.offsetWidth - 250) {
        game_local.ticker_pos = 100;
        ticker.innerHTML = get_news_message();
    } else {
        game_local.ticker_pos -= 0.1;
    }

    ticker.style.left = game_local.ticker_pos.toString() + "%";
}

function F(d, p, m=1) {
    let nf = numberformat.formatShort(d, {format: game.num_format, sigfigs: p, maxSmall: true});
    
    if (d < 1000) {
        return d.toFixed(m);
    } else {
        return nf;
    }
}

function replace_submenus(submenus) {
    const submenu_buttons = document.getElementsByClassName("submenu-button");
    for (let i = 0; i < submenu_buttons.length; i++) {
        submenu_buttons[i].style.display = "none";
    }
    
    for (let i = 0; i < submenus.length; i++) {
        document.getElementById("submenu-" + submenus[i]).style.display = "inline-block";
    }
}

function menu_btn_click(id) {
    if (id in menu_colors) {
        document.body.style.backgroundColor = menu_colors[id][0];
    }
    
    let menu_name = id.replace("menu-", "");
    game_local.menu = menu_name;
    game_local.submenu = menu_submenus[menu_name][0];
    
    replace_submenus(menu_submenus[menu_name]);
    
    let submenu_buttons = document.getElementsByClassName("submenu-button");
    for (let i = 0; i < submenu_buttons.length; i++) {
        submenu_buttons[i].style.backgroundColor = menu_colors[id][1];
    }
}

function submenu_btn_click(id) {
    game_local.submenu = id.replace("submenu-", "");
}

function encode_save(obj) {
    let save_str = JSON.stringify(obj);

    // Replace strings like "2.3e5" with "new Decimal("2.3e5")", since stringify removes that part
    let regex = /("[\d\.\+\-e]+")/g;
    save_str = save_str.replaceAll(regex, "new Decimal($1)");

    let encoded_save_str = btoa(save_str);
    return encoded_save_str;
}

function looseJsonParse(obj) {
    return Function("\"use strict\";return (" + obj + ")")();
}

function set_save(save) {
    let decoded_save_str = atob(save);
    let new_save = looseJsonParse(decoded_save_str);
    for (let i in new_save) {
        game[i] = new_save[i];
    }
}

function copy_text_to_clipboard(text) {
    navigator.clipboard.writeText(text).then(
      function() {alert("Copied to clipboard!");},
      function(err) {console.error("Async: Could not copy text: ", err); alert("Copying failed: " + err);}
    );
}

function export_save_btn() {
    copy_text_to_clipboard(encode_save(game));
}

function import_save_btn() {
    let save = prompt("Enter your savefile:");
    if (save != null) {
        set_save(save);
        add_popup("saving", "Save imported");
    }
}

function save_game() {
    let save = encode_save(game);
    document.cookie = "save=" + save + ";path=/";
}

function save_game_btn() {
    save_game();
    add_popup("saving", "Game saved");
}

function hard_reset() {
    setup_game();
    document.cookie = "save=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
}

function hard_reset_btn() {
    let confirmation = prompt("Are you sure you want to hard reset? Type \"Yes\" to confirm:")

    if (confirmation === "Yes") {
        hard_reset();
    }
}

function load_save_cookie() {
    const save_cookie_value = ('; '+document.cookie).split(`; save=`).pop().split(';')[0];
    if (save_cookie_value) {
        set_save(save_cookie_value);
    }
}

function sgd_btn() {
    let all_elements = document.querySelectorAll('*');

    if (document.body.classList.contains("superior-gd")) {
        for (var i = 0; i < all_elements.length;i++) {
            all_elements[i].classList.remove("superior-gd");
        }
    } else {
        for (var i = 0; i < all_elements.length;i++) {
            all_elements[i].classList.add("superior-gd");
        }
    }
}

function buy_lc(tier) {
    let lc_object = game.lc[tier - 1];
    
    if (game.le.gte(lc_object.cost)) {
        game.le = game.le.sub(lc_object.cost);
        lc_object.num_bought += 1;
        lc_object.num = lc_object.num.add(1);
        
        let lc_btn_element = document.getElementsByClassName("lc-buy-btn")[tier - 1];
        let lc_mul_element = document.getElementsByClassName("lc-info-mul")[tier - 1];
        
        if (lc_object.num_bought % 5 === 0) {
            lc_object.cost = lc_object.cost.mul(lc_object.cost_mul);
            lc_object.mul = lc_object.mul.mul(game.lc_buy5mul);
            lc_btn_element.classList.add("bought-5");
            lc_mul_element.classList.add("bought-5-mul");
            setTimeout(function(){lc_btn_element.classList.remove("bought-5");}, 750);
            setTimeout(function(){lc_mul_element.classList.remove("bought-5-mul");}, 750);
        }
    }
}

function add_popup(type, text) {
    const popup_container = document.getElementsByClassName("popup-container")[0];

    const new_popup = document.createElement("div");
    new_popup.classList.add("popup-temp");
    new_popup.classList.add("popup-" + type);
    const node = document.createTextNode(text);
    new_popup.appendChild(node);
    popup_container.prepend(new_popup);
    
    setTimeout(function() {popup_container.removeChild(new_popup);}, 4000);
}

function check_achievements() {
    if (!(game.achievements.includes(0)) && game.lc[0].num_bought > 0) {
        game.achievements.push(0);
        add_popup("achievement", "Achievement: "+ achievement_names[0]);
    }

    if (!(game.achievements.includes(1)) && game.lc[1].num_bought > 0) {
        game.achievements.push(1);
        add_popup("achievement", "Achievement: "+ achievement_names[1]);
    }
    
    const achievement_boxes = document.getElementsByClassName("achievement-box");
    const achievement_box_popups = document.getElementsByClassName("achievement-box-popup");
    for (let i = 0; i < achievement_boxes.length; i++) {
        if (game.achievements.includes(i)) {
            achievement_boxes[i].classList.add("achievement-box-completed");
            achievement_box_popups[i].classList.add("achievement-box-completed");
        }
    }
}

function set_class_property(class_name, value_function, property, subproperty="") {
    const elements = document.getElementsByClassName(class_name);
    const L = [...Array(elements.length).keys()];

    for (let i = 0; i < elements.length; i++) {
        if (subproperty) {
            elements[i][property][subproperty] = L.map(value_function)[i];
        } else {
            elements[i][property] = L.map(value_function)[i];
        }
    }
}

function toggle_classList(class_name, cond_function, c1, c2="") {
    const elements = document.getElementsByClassName(class_name);
    const L = [...Array(elements.length).keys()];

    for (let i = 0; i < elements.length; i++) {
        if (L.map(cond_function)[i]) {
            elements[i].classList.add(c1)
            if (c2) {
                elements[i].classList.remove(c2)
            }
        } else {
            elements[i].classList.remove(c1)
            if (c2) {
                elements[i].classList.add(c2)
            }
        }
    }
}

function life_menu_update() {
    switch (game_local.submenu) {
        case "life-crystals":
            document.getElementById("production").style.display = "inline-block";

            set_class_property("lcp", i => game.lc[i].unlocked ? "flex" : "none", "style", "display");
            set_class_property("lc-info-tier", i => "T" + (i + 1) + " Life Crystal", "innerHTML");
            set_class_property("lc-info-mul", i => "x" + F(game.lc[i].mul, 3, 2), "innerHTML");
            set_class_property("lc-info-num", i => F(game.lc[i].num, 3, 0) + " (" + F(game.lc[i].num_bought, 3, 0) + ")", "innerHTML");
            set_class_property("lc-info-gain", i =>"+" + F(game.lc[i].ps, 3, 1) + "/s", "innerHTML");
            toggle_classList("lc-buy-btn", i => game.lc[i].cost.gt(game.le), "lc-buy-btn-unaffordable")
            set_class_property("lc-buy-btn-content", i => "Cost: " + F(game.lc[i].cost, 3, 0) + " LE", "innerHTML");
            set_class_property("lc-progress", i => game.lc[i].num_bought % 5 * 20 + "%", "style", "width");
            
            break;
        default:
            break;
    }
}

function achievements_menu_update() {
    switch (game_local.submenu) {
        case "achievements":
            document.getElementById("achievements").style.display = "grid";
            break;
        default:
            break;
    }
}

function options_menu_update() {
    switch (game_local.submenu) {
        case "saving":
            document.getElementById("options-saving").style.display = "inline-block";
            break;
        case "visual":
            document.getElementById("options-visual").style.display = "inline-block";
        default:
            break;
    }
}

function statistics_menu_update() {
    switch(game_local.submenu) {
        case "statistics":
            document.getElementById("statistics").style.display = "inline-block";
            break;
        default:
            break;
    }
}

function seconds_to_dhms(s) {
    let d = Math.floor(s / (60 * 60 * 24))
    s %= (60 * 60 * 24)
    let h = Math.floor(s / (60 * 60));
    s %= (60 * 60);
    let m = Math.floor(s / 60);
    s = Math.floor(s % 60);
    
    let dhms = "";
    if (d > 0) {dhms += d.toString() + "d ";}
    if (h > 0) {dhms += h.toString() + "h ";}
    if (m > 0) {dhms += m.toString() + "m ";}
    dhms += s.toString() + "s";
    return dhms;
};

let start = 0;
function handle_offline_progress() {
    let offline_time = Date.now() - game.time;

    let game_before_exit = _.cloneDeep(game);
    console.log(JSON.stringify(game_before_exit))

    let num_ticks = 1000 * Math.min(offline_time / 100000, 1);
    for (let i = 0; i < num_ticks; i++) {
        update(start + offline_time / num_ticks);
        start += offline_time / num_ticks;
    }

    if (offline_time >= 30000 & game_before_exit.time !== 0) {
        let offline_progress_text = document.getElementsByClassName("offline-progress-text")[0];

        offline_progress_text.innerHTML += "<div style='color:#efefef'>Offline time: " + seconds_to_dhms(offline_time / 1000) + "</div>";
        if (game.le.gt(game_before_exit.le)) {
            offline_progress_text.innerHTML += "<div style='color:#e4c9ff;'>Life Essence increased " + F(game_before_exit.le, 3) + " -> " + F(game.le, 3) + "</div>";
        }
    } else {
        document.getElementsByClassName("offline-progress-container")[0].style.display = "none";
    }
}

function update(t) {
    const seconds = (t - start) / 1000;
    start = t;
    
    // Math logic

    game.time = Date.now();
    
    for (let i = 1; i < game.lc.length; i++) {
        let lc_obj = game.lc[i];
        let prev_lc_obj = game.lc[i-1];
        
        prev_lc_obj.ps = lc_obj.num.mul(lc_obj.mul).mul(0.2);
        let prev_lc_gain = prev_lc_obj.ps.mul(seconds);
        prev_lc_obj.num = prev_lc_obj.num.add(prev_lc_gain);

        if (prev_lc_obj.num > 0) {
            lc_obj.unlocked = true;
        }
    }
    
    let leps = game.lc[0].num.mul(game.lc[0].mul).mul(1);
    let e_gain = leps.mul(seconds);
    game.le = game.le.add(e_gain);

    check_achievements();
    
    // Update HTML elements

    update_ticker();
  
    document.getElementById("le-num").innerHTML = F(game.le, 3);
    document.getElementById("leps-num").innerHTML = F(leps, 3);
    
    const switchable_elements = document.getElementsByClassName("switchable");
    for (let i = 0; i < switchable_elements.length; i++) {
        switchable_elements[i].style.display = "none";
    }
    
    switch (game_local.menu) {
        case "life":
            life_menu_update();
            break;
        case "achievements":
            achievements_menu_update();
            break;
        case "options":
            options_menu_update();
            break;
        case "statistics":
            statistics_menu_update();
            break;
        default:
            break;
    }
    
    // console.log(Math.round(1/seconds))
    // console.log(document.getElementsByClassName("lc-progress")[0].style.width)
    // console.log(game.achievements)
    
    if (request_update) {
        requestAnimationFrame(update);
    }
}

window.onload = () => {
    if (!document.cookie) {
        setup_game();
    } else {
        load_save_cookie();
    }
    setInterval(save_game, 5000);
    setup_menu_buttons();
    setup_lcp_elements();
    setup_achievement_elements();
    handle_offline_progress();
    start = 0;
    request_update = true;
    document.body.style.display = "flex";
    requestAnimationFrame(update);
};