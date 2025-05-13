"use strict";
const ticker_messages = {
    "n0": "This game only has a news ticker because I'm too lazy to actually update the game",
    "n1": "Here's a fun maths puzzle: Timothy has a cube of blocks with side length n. Is it possible for him to rearrange the blocks into two smaller cubes such that no blocks are left over? Prove your result.",
    "n2": "Hey Vsauce, Michael here. This game is very balanced... or is it?",
    "n3": "Your 5 dice rolls: {0} - {1}",
    "n4": "The world population has increased by ~{0} since you first started playing this game",
    "n5": "The downwards subside disappear meme is still ENORMOUS!",
    "n6": "(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧ (❛◡❛✿)",
    "n7": "◢▆▅▄▃ 溫╰(〞︶〝) ╯馨 ▃▄▅▆◣",
    "n8": "Why are people leaving food in the oven at 175C for 15 minutes when they could just leave it at 157500000C for 1 millisecond?",
    "n9": "New update drops in just 12!! hours!!!!",
    "n10": "Water bucket, RELEASE!",
    "n11": "RIP Pope Francis 44²-45²",
    "n12": "20% of car crashes are caused by drunk drivers, and 80% are caused by sober drivers. Therefore, it's 4x safer to drive drunk than to drive sober",
    "n13": "2^{0}-1 is prime. Source: just trust me bro",
    "n14": "The least beautiful equation: π^(0*ei)=1",
    "n15": "Many people are annoyed that τ equals 2π even though it looks like half of π. I propose that we swap the values of π and τ, so that π ≈ 6.28 and τ ≈ 3.14. This will definitely not cause any confusion whatsoever.",
    "n16": "E=mc^2, and a^2+b^2=c^2, therefore E=ma^2+mb^2",
    "n17": "Try playing this: Ab Bb Db Bb F F Eb Ab Bb Db Bb Eb Eb Db C Bb Ab Bb Db Bb Db Eb C Bb Ab Ab Eb Db",
    "n18": "No, don't base-64 decode that save file!",
    "n19": "Why are all of the function names lowercase and separated by underscores? The Python brainrot is real",
    "n20": "I... am STEVE.",
    "n21": "We can use lightyears and lightseconds to measure distance, but how about lightkilometers and lightparsecs to measure time?",
    "n22": "FLINT AND STEEL 🗣️🗣️🔥🔥🔥",
    "n23": "Waxed lightly weathered cut copper stairs!",
    "n24": "Here's a random unicode character: {0}",
    "n25": "<div style='transform: scale(-1, -1);'>This ticker message was made in Australia</div>",
    "n26": "The following statement is true. The previous statement is false.",
    "n27": "100 dudes would destroy a gorilla, what are these guys talking about?",
    "n28": "Whoa-ohoh-ohoh, this is how the story goes",
    "n29": "<div class='superior-gd'>My graphic design is superior</div>",
    "n30": "\"Uhh, what?\" - Joe Biden",
    "n31": "Since you first started playing this game, you have moved about {0} mm due to continental drift",
    "n32": "This news ticker contains at least 3 rickrolls, can you find them all?",
    "n33": "<a class='special-text' href='https://www.youtube.com/watch?v=dQw4w9WgXcQ' target='_blank' rel='noopener noreferrer'>I'm a special link, click me!</a>",
    "n34": "🥷🐘🌋🐘🚀 🦒🐙🥷🥷🥑 🦒♾️🌋🐘 ☯️🐙☂️ ☂️🐼",
    "n35": "Ts pmo bro icl 🥀",
    "n36": "*ଘ(੭*ˊᵕˋ)੭* ੈ✩‧₊˚ &nbsp;&nbsp;(╹◡╹๑)",
    "n37": "(´,,•ω•,,)♡",
    "n38": "Here's a randomly generated number: {0}. If it's above 1e1000, consider yourself very lucky!",
    "n39": "<div class='ghost-text'>oooooh, it's a ghost news message</div>",
    "n40": "Chicken jockey!",
    "n41": "Erm, what the sigma?",
    "n42": "10 billion guys vs Godzilla, who would win?",
    "n43": "{0} life essence? That's a MASSIVE number",
    "n44": "Change da world, my final message. goodbye",
    "n45": "The dev isn't releasing updates because he was one of the 100 men drafted to fight the gorilla",
    "n46": "The high increase grow meme is still MINUSCULE!",
    "n47": "No one: R\\{1}&nbsp; Absolutely no one: [0,∞)\\{1}",
    "n48": "An infinite number of mathematicians walk into a bar. The first orders a beer. The second disagrees with him, and cancels the first mathematician's order. The third orders a beer, and the fourth cancels the third's order. The bartender pours them all 1/2 a beer, saying, \"You guys gotta know your Cesàro summations.\"",
    "n49": "2025 is the first square year since 1936, but you know what's even crazier? 2026 is the first year of the form n^2+1 since 1937!",
    "n50": "New update releases at {0} UTC!",
    "n51": "ξ( ✿＞◡❛)▄︻▇▇〓▄︻┻┳═一",
    "n52": "The lion does WHAT to the small dog when it barks?!",
    "n53": "What the heck is base \"10\"? I only use base 1, not base 1111111111 or base 1111111111111111 like you weirdos.",
    "n54": "Fun fact: Every news message has a 1/256 chance of becoming shiny. Good luck collecting them all!",
};

const game = {};
const game_local = {menu: "life", submenu: "life-crystals", ticker_pos: 100};

const lc_base_costs = [new Decimal(10), new Decimal(150), new Decimal(3e3), new Decimal(2e5), new Decimal(1e14), new Decimal(1e30), new Decimal("1e1000"), new Decimal("1e1000"), new Decimal("1e1000"), new Decimal("1e1000"), new Decimal("1e1000"), new Decimal("1e1000")];
const lc_base_cost_muls = [new Decimal(500), new Decimal(4e3), new Decimal(6e4), new Decimal(1.5e6), new Decimal(7e8), new Decimal(3e12), new Decimal("1e1000"), new Decimal("1e1000"), new Decimal("1e1000"), new Decimal("1e1000"), new Decimal("1e1000"), new Decimal("1e1000")];

const lc_upgrade_names = ["Crystal Synergy", "LE Synergy", "Price Efficiency", "Self-boosting Crystals"];
const lc_upgrade_costs = [new Decimal("5e5"), new Decimal("2e10"), new Decimal("3e19"), new Decimal("1e29")];
const lc_upgrade_cost_muls = [new Decimal("2e2"), new Decimal("1e5"), new Decimal("2e4"), new Decimal("1e13")];
const lc_upgrade_cost_muls_quad = [new Decimal("1e3"), new Decimal("3e4"), new Decimal("5e7"), new Decimal("1e10")];
const lc_scaling_nums = [50, 200]

const lc_boost_names = ["Tier Boost", "Purchase Boost", "Multiboost 1"];
const lc_boost_costs = [new Decimal("1e11"), new Decimal("1e17"), new Decimal("1e21")];

const menu_submenus = {"life": ["life-crystals", "upgrades"], "achievements": ["achievements"], "options": ["saving", "visual"], "statistics": ["statistics"]};
const submenu_names = {"life-crystals": "Life Crystals", "upgrades": "Upgrades", "achievements": "Achievements", "saving": "Saving", "visual": "Visual/Gameplay", "statistics": "Statistics"};
const menu_colors = {"menu-life": ["#2c0045", "#7e0094"], "menu-achievements": ["#403b00", "#b5a000"], "menu-options": ["#363636", "#707070"], "menu-statistics": ["#400020", "#900048"]};
const num_achievements = 20;

const achievement_names = ["The Beginning", "f(x)=ax²+bx+c", "HL3, for real this time", "Tetrahedral Crystal", "Hand of Crystals", "Snowflake Crystal", "Infinity doesn't exist here", "Decahedral Crystal", "The Best Number", "",
                           "See, this totally isn't AD", "Scaling already?", "I <3 Arbitrary Upgrade Names"];
const achievement_descriptions = ["Buy a T1 Life Crystal", "Buy a T2 Life Crystal", "Buy a T3 Life Crystal", "Buy a T4 Life Crystal", "Buy a T5 Life Crystal", "Buy a T6 Life Crystal", "Buy a T8 Life Crystal", "Buy a T10 Life Crystal", "Buy a T12 Life Crystal", "",
                                  "Buy the 2nd Life Upgrade", "Encounter LC cost scaling at " + lc_scaling_nums[0] + " purchases<br>Reward: Divide T1-5 LC costs by 2", "Buy the 4th Life Upgrade"];

const pressed_keys = {};
let dev_mode = true;
let request_update = false;

function setup_game() {
    const new_game = {time: 0, start_time: Date.now(), time_mult: 1, num_format: "scientific", ticker_enabled: true, ticker_speed: 1, offline_progress: true, lc_gain_display: "percent", le: new Decimal(10), total_le: new Decimal(0), lc_buy5mul: 2, lc: [], upgrades: [], boosts: [], lc_purchase_mode: 0, lc_upgrade_purchase_mode: 0, achievements: [], upgrades_unlocked: false};

    for (let i = 0; i < lc_base_costs.length; i++) {
        const lc_object = {unlocked: (i === 0), num: new Decimal(0), num_bought: 0, buy_boosts: 0, ps: new Decimal(0), mul: new Decimal(1), cost: lc_base_costs[i], prev_cost: lc_base_costs[i]};
        new_game.lc.push(lc_object);
    }

    for (let i = 0; i < lc_upgrade_costs.length; i++) {
        const upg_object = {unlocked: false, num: 0, cost: lc_upgrade_costs[i], cost_mul: lc_upgrade_cost_muls[i], cost_mul_quad: lc_upgrade_cost_muls_quad[i]};
        new_game.upgrades.push(upg_object);
    }

    for (let i = 0; i < lc_boost_costs.length; i++) {
        const boost_object = {unlocked: false, cost: lc_boost_costs[i], bought: false};
        new_game.boosts.push(boost_object);
    }

    for (let i in new_game) {
        game[i] = new_game[i];
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

function setup_lc_elements() {
    for (let i = 1; i < lc_base_costs.length; i++) {
        const lcp_clone = document.getElementsByClassName("lcp")[0].cloneNode(true);
        const production_el = document.getElementById("production");
        production_el.appendChild(lcp_clone);
    }
    
    for (let i = 0; i < lc_base_costs.length; i++) {
        document.getElementsByClassName("lc-buy-btn")[i].setAttribute("onclick", "buy_lc(" + i + ")");

        const classes = document.getElementsByClassName("lcp")[i].classList;

        if (i % 2 === 0) {
            classes.add("lcp-even");
        } else {
            classes.add("lcp-odd");
        }
    }

    for (let i = 1; i < lc_upgrade_costs.length; i++) {
        const lc_upgrade_clone = document.getElementsByClassName("lc-upgrade-rep")[0].cloneNode(true);
        document.getElementById("lc-upgrade-rep-container").appendChild(lc_upgrade_clone);
    }

    for (let i = 1; i < lc_boost_costs.length; i++) {
        const lc_boost_clone = document.getElementsByClassName("lc-boost")[0].cloneNode(true);
        document.getElementById("lc-boost-container").appendChild(lc_boost_clone);
    }

    for (let i = 0; i < lc_upgrade_costs.length; i++) {
        document.getElementsByClassName("lc-upgrade-rep")[i].classList.add("lc-upgrade-rep-" + i);
        document.getElementsByClassName("lc-upgrade-rep-buy-btn")[i].setAttribute("onclick", "buy_lc_upgrade(" + i + ")");
    }

    for (let i = 0; i < lc_boost_costs.length; i++) {
        document.getElementsByClassName("lc-boost-buy-btn")[i].setAttribute("onclick", "buy_lc_boost(" + i + ")");
    }
}

function setup_achievement_elements() {
    for (let i = 0; i < num_achievements; i++) {
        let achievement_num_str = String(i).padStart(2, "0");

        let achievement_box = create_div(["achievement-box"], achievement_num_str)
        document.getElementById("achievement-boxes").appendChild(achievement_box);
        
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
        achievement_desc_el.innerHTML = achievement_descriptions[i];
        achievement_box_popup.appendChild(achievement_desc_el);
    }
}

function setup_html_elements() {
    setup_menu_buttons();
    setup_lc_elements();
    setup_achievement_elements();
}

function get_news_message(key=null) {
    if (!key) {
        let ticker_keys = Object.keys(ticker_messages);
        key = ticker_keys[ticker_keys.length * Math.random() << 0];
    }
    let message = ticker_messages[key];

    if (key === "n3") {
        let dice_rolls = [];
        for (let i = 0; i < 5; i++) {
            dice_rolls.push((Math.floor(Math.random()*6)+1));
        }
        dice_rolls.sort();

        message = message.replace("{0}", dice_rolls.join(" "));

        const counts = {};
        for (const num of dice_rolls) {
            counts[num] = counts[num] ? counts[num] + 1 : 1;
        }
        const count_values = Object.values(counts);

        if (count_values.includes(5)) {
            message = message.replace("{1}", "FIVE OF A KIND!!! +500 aura!!!");
        } else if (count_values.includes(4)) {
            message = message.replace("{1}", "Four of a kind!! +100 aura!!");
        } else if (count_values.includes(3) && count_values.includes(2)) {
            message = message.replace("{1}", "Full house!! +50 aura!!");
        } else if (JSON.stringify(dice_rolls) === JSON.stringify([1,2,3,4,5]) ||
                   JSON.stringify(dice_rolls) === JSON.stringify([2,3,4,5,6])) {
            message = message.replace("{1}", "Straight!! +50 aura!!");
        } else if (count_values.filter(x => x === 2).length === 2) {
            message = message.replace("{1}", "Two pair! +10 aura!");
        } else if (count_values.includes(3)) {
            message = message.replace("{1}", "Triplet! +10 aura!");
        } else {
            message = message.replace("{1}", "Nothing... Better luck next time!");
        }
    } else if (key === "n4") {
        message = message.replace("{0}", Math.floor(2.535 * (Date.now() - game.start_time) / 1000));
    } else if (key === "n13") {
        message = message.replace("{0}", 2*(100_000_000+Math.floor(Math.random()*400_000_000))+1);
    } else if (key === "n24") {
        let random_unicode = String.fromCharCode.apply(null, Array.from(Array(1), () => Math.floor(Math.random()*65536)));
        message = message.replace("{0}", random_unicode);
    } else if (key === "n31") {
        message = message.replace("{0}", (0.4753 * (Date.now() - game.start_time) / 1000000000).toFixed(5));
    } else if (key === "n38") {
        let rnum = new Decimal(Math.random());
        message = message.replace("{0}", F(Decimal.pow(10, rnum.pow(-2).sub(1)).sub(1), 3, 2));
    } else if (key === "n43") {
        message = message.replace("{0}", F(game.le, 3));
    } else if (key === "n50") {
        let date = new Date();
        date.setTime(date.getTime() + (12*60*60*1000));
        message = message.replace("{0}", date.toISOString().slice(0, 19).replace("T", " "));
    }

    if (Math.random() <= 1 / 256) {
        message = "<div class='shiny-text'>" + message + "</div>"
    }

    return message;
}

function update_ticker() {
    const ticker_container = document.getElementById("news-ticker");
    const ticker = document.getElementById("ticker-message");

    if (!ticker.innerHTML || !request_update || game_local.ticker_pos * ticker_container.offsetWidth / 100 < -ticker.offsetWidth - 250) {
        game_local.ticker_pos = 100;
        ticker.innerHTML = get_news_message();
    } else {
        game_local.ticker_pos -= game.ticker_speed * 0.05;
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
    document.getElementById(id).classList.remove("new-feature");
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

function export_save() {
    navigator.clipboard.writeText(encode_save(game));
}

function export_save_btn() {
    export_save();
    alert("Copied to clipboard!");
}

function import_save(save) {
    let decoded_save_str = atob(save);
    setup_game();
    let new_save = looseJsonParse(decoded_save_str);
    for (let i in new_save) {
        game[i] = new_save[i];
    }
}

function import_save_btn() {
    let save = prompt("Enter your savefile:");
    if (save != null) {
        import_save(save);
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
        import_save(save_cookie_value);
    }
}

function toggle_ticker_btn() {
    game.ticker_enabled = game.ticker_enabled ? false : true;
}

function num_format_btn() {
    switch (game.num_format) {
        case "scientific": 
            game.num_format = "engineering";
            break;
        case "engineering":
            game.num_format = "standard";
            break;
        case "standard":
            game.num_format = "scientific";
            break;
    }
}

function lc_gain_display_btn() {
    if (game.lc_gain_display === "num") {
        game.lc_gain_display = "percent";
    } else {
        game.lc_gain_display = "num";
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

function lc_purchase_mode_btn() {
    switch (game.lc_purchase_mode) {
        case 0:
            game.lc_purchase_mode = 1;
            break;
        case 1:
            game.lc_purchase_mode = 2;
            break;
        case 2:
            game.lc_purchase_mode = 0;
            break;
    }
}

function lc_upgrade_purchase_mode_btn() {
    switch (game.lc_upgrade_purchase_mode) {
        case 0:
            game.lc_upgrade_purchase_mode = 1;
            break;
        case 1:
            game.lc_upgrade_purchase_mode = 0;
            break;
    }
}

function buy_max(iters=0) {
    if (game_local.menu === "life" && game_local.submenu === "life-crystals") {
        let cheapest_lc_id = 0;
        let cheapest_lc_cost = game.lc[0].cost;

        for (let i = 1; i < game.lc.length; i++) {
            if (game.lc[i].cost.lte(cheapest_lc_cost)) {
                cheapest_lc_cost = game.lc[i].cost;
                cheapest_lc_id = i;
            }
        }
        
        let lc_afforded = buy_lc(cheapest_lc_id, 1);
        if (lc_afforded && iters < 1000) {
            buy_max(iters + 1);
        }
    } else if (game_local.menu === "life" && game_local.submenu === "upgrades") {
        let cheapest_upgrade_id;
        let cheapest_upgrade_cost = Infinity;

        for (let i = 0; i < game.upgrades.length; i++) {
            if (game.upgrades[i].unlocked && game.upgrades[i].cost.lte(cheapest_upgrade_cost)) {
                cheapest_upgrade_cost = game.upgrades[i].cost;
                cheapest_upgrade_id = i;
            }
        }

        let cheapest_boost_id;
        let cheapest_boost_cost = Infinity;

        for (let i = 0; i < game.boosts.length; i++) {
            if (game.boosts[i].unlocked && !game.boosts[i].bought && game.boosts[i].cost.lte(cheapest_boost_cost)) {
                cheapest_boost_cost = game.boosts[i].cost;
                cheapest_boost_id = i;
            }
        }
        
        let lc_upgrade_bought = false;

        if (cheapest_upgrade_id !== undefined) {
            if (cheapest_boost_id === undefined || cheapest_upgrade_cost.lte(cheapest_boost_cost)) {
                lc_upgrade_bought = buy_lc_upgrade(cheapest_upgrade_id, 0);
            } else {
                lc_upgrade_bought = buy_lc_boost(cheapest_boost_id);
            }
        } else if (cheapest_boost_id !== undefined) {
            lc_upgrade_bought = buy_lc_boost(cheapest_boost_id);
        }

        if (lc_upgrade_bought && iters < 1000) {
            buy_max(iters + 1);
        }
    }
}

function buy_lc(id, purchase_mode=game.lc_purchase_mode) {
    let lc_obj = game.lc[id];
    
    if (game.le.gte(lc_obj.cost)) {
        game.le = game.le.sub(lc_obj.cost);
        lc_obj.num_bought += 1;
        lc_obj.num = lc_obj.num.add(1);
        
        let lc_btn_element = document.getElementsByClassName("lc-buy-btn")[id];
        let lc_mul_element = document.getElementsByClassName("lc-info-mul")[id];
        
        if (lc_obj.num_bought % 5 === 0) {
            lc_obj.buy_boosts += 1;
            lc_obj.cost = get_lc_cost(id);
            lc_btn_element.classList.add("bought-5");
            lc_mul_element.classList.add("bought-5-mul");
            setTimeout(function(){lc_btn_element.classList.remove("bought-5");}, 750);
            setTimeout(function(){lc_mul_element.classList.remove("bought-5-mul");}, 750);
        } else {
            if (purchase_mode === 1) {
                buy_lc(id);
            }
        }

        if (purchase_mode === 2) {
            buy_lc(id);
        }

        return true;
    }
    return false;
}

function buy_lc_upgrade(id, purchase_mode=game.lc_upgrade_purchase_mode) {
    let upg_object = game.upgrades[id];

    if (game.le.gte(upg_object.cost)) {
        game.le = game.le.sub(upg_object.cost);
        upg_object.num += 1;
        upg_object.cost = upg_object.cost.mul(upg_object.cost_mul);
        upg_object.cost_mul = upg_object.cost_mul.mul(upg_object.cost_mul_quad);
        update_lc_upgrade_unlocks();

        if (purchase_mode === 1) {
            buy_lc_upgrade(id);
        }

        return true;
    }
    return false;
}

function buy_lc_boost(id) {
    let boost_object = game.boosts[id];

    if (game.le.gte(boost_object.cost) && !boost_object.bought) {
        game.le = game.le.sub(boost_object.cost);
        boost_object.bought = true;
        update_lc_boost_unlocks();

        return true;
    }
    return false;
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

function get_achievement_condition(id) {
    switch (id) {
        case 0:
            return game.lc[0].num_bought > 0;
        case 1:
            return game.lc[1].num_bought > 0;
        case 2:
            return game.lc[2].num_bought > 0;
        case 3:
            return game.lc[3].num_bought > 0;
        case 4:
            return game.lc[4].num_bought > 0;
        case 5:
            return game.lc[5].num_bought > 0;
        case 6:
            return game.lc[7].num_bought > 0;
        case 7:
            return game.lc[9].num_bought > 0;
        case 8:
            return game.lc[11].num_bought > 0;
        case 10:
            return game.upgrades[1].num > 0;
        case 11:
            let highest_purchases = 0;
            for (let i = 0; i < game.lc.length; i++) {
                if (game.lc[i].num_bought > highest_purchases) {
                    highest_purchases = game.lc[i].num_bought;
                }
            }

            return highest_purchases >= lc_scaling_nums[0];
        case 12:
            return game.upgrades[3].num > 0;
        default:
            return false;
    }
}

function check_achievements() {
    for (let i = 0; i < achievement_names.length; i++) {
        if (!(game.achievements.includes(i)) && get_achievement_condition(i)) {
            game.achievements.push(i);
            add_popup("achievement", "Achievement: "+ achievement_names[i]);
        }
    }
    
    const achievement_boxes = document.getElementsByClassName("achievement-box");
    const achievement_box_popups = document.getElementsByClassName("achievement-box-popup");
    for (let i = 0; i < achievement_names.length; i++) {
        if (game.achievements.includes(i)) {
            achievement_boxes[i].classList.add("achievement-box-completed");
            achievement_box_popups[i].classList.add("achievement-box-completed");
            achievement_boxes[i].style.backgroundImage = "url('images/achievement-" + i + ".png')";
        } else {
            achievement_boxes[i].classList.remove("achievement-box-completed");
            achievement_box_popups[i].classList.remove("achievement-box-completed");
            achievement_boxes[i].style.backgroundImage = "none";
        }
    }
}

function get_highest_lc_tier() {
    let highest_tier = 0;
    for (let i = 0; i < game.lc.length; i++) {
        if (game.lc[i].num_bought > 0) {
            highest_tier = i + 1;
        }
    }

    return highest_tier;
}

function get_total_lcs_purchased() {
    let num_purchased = 0;
    for (let i = 0; i < game.lc.length; i++) {
        num_purchased += game.lc[i].num_bought;
    }
    
    return num_purchased;
}

function u1_boost(num) {
    return 1 + 0.1 * Math.log10(num + 1) + 0.005 * Math.pow(num, 0.5);
}

function u2_boost(num) {
    return game.le.pow(0.01 + 0.005 * Math.pow(num, 0.25)).mul(0.25 * Math.pow(num, 1.2)).add(1);
}

function u3_boost(num) {
    return num === 0 ? 0 : 0.08 * Math.pow(num, 0.6);
}

function u4_boost(num) {
    return num === 0 ? 0 : 0.02 + 0.01 * (num - 1);
}

function b1_boost() {
    return 1 + Math.pow(2, get_highest_lc_tier() - 6);
}

function b2_boost() {
    return Math.pow(1.004, get_total_lcs_purchased());
}

function b3_boost() {
    return Math.pow(game.lc[0].mul, 0.04);
}

function get_lc_mul(id) {
    let lc_obj = game.lc[id];

    let lc_mul = Decimal.pow(game.lc_buy5mul, lc_obj.buy_boosts);  // Buy 5 boost
    lc_mul = lc_mul.mul(Decimal.pow(1.02, game.achievements.length));  // Achievement boost

    // LC Upgrade 1
    if (game.upgrades[0].num > 0) {lc_mul = lc_mul.mul(Decimal.pow(u1_boost(game.upgrades[0].num), lc_obj.num_bought));}

    // LC Upgrade 2
    if (game.upgrades[1].num > 0) {lc_mul = lc_mul.mul(u2_boost(game.upgrades[1].num));}
    
    // LC Boost 1
    if (game.boosts[0].bought) {lc_mul = lc_mul.mul(b1_boost());}

    // LC Boost 2
    if (game.boosts[1].bought) {lc_mul = lc_mul.mul(b2_boost());}

    // LC Boost 3
    if (game.boosts[2].bought && 1 <= id && id <= 3) {lc_mul = lc_mul.mul(b3_boost());}

    if (id > 0) {
        let prev_lc_obj = game.lc[id - 1];

        // LC Upgrade 4
        if (game.upgrades[3].num > 0) {lc_mul = lc_mul.mul(prev_lc_obj.num.pow(u4_boost(game.upgrades[3].num)));}
    }

    return lc_mul;
}

function get_lc_cost(id) {
    let lc_obj = game.lc[id];

    let lc_cost = lc_base_costs[id].mul(Decimal.pow(lc_base_cost_muls[id], lc_obj.buy_boosts)); // Buy 5 cost multiplier

    // Cost scaling: Raise base cost mul to the ^1.6, and multiply base cost mul by (base cost mul)^1.2 per boost
    if (lc_obj.num_bought >= lc_scaling_nums[0]) {
        let scaled_boosts = Math.max(Math.floor(lc_obj.buy_boosts - (lc_scaling_nums[0] / 5 - 1)), 0);
        lc_cost = lc_cost.mul(Decimal.pow(lc_base_cost_muls[id].pow(0.6), scaled_boosts)).mul(Decimal.pow(lc_base_cost_muls[id].pow(0.2), scaled_boosts * (scaled_boosts + 1) / 2));
    }

    // Achievement 11
    if (game.achievements.includes(11) && 0 <= id && id <= 4) {lc_cost = lc_cost.div(2);}

    // LC Upgrade 3
    if (game.upgrades[2].num > 0) {lc_cost = lc_cost.div(Decimal.pow(lc_obj.num.add(1), u3_boost(game.upgrades[2].num)));}

    return lc_cost;
}

function get_upgrade_desc(id) {
    switch (id) {
        case 0:
            return "Life Crystals are multiplied by x" + u1_boost(game.upgrades[0].num).toFixed(3) + " -> <span style='color:#60ff60;'>x" + u1_boost(game.upgrades[0].num+1).toFixed(3) + "</span> for each one purchased of that tier";
        case 1:
            return "Life Crystals are boosted based on current Life Essence<br>x" + F(u2_boost(game.upgrades[1].num), 3, 3) + " -> <span style='color:#60ff60;'>x" + F(u2_boost(game.upgrades[1].num+1), 3, 3) + "</span>";
        case 2:
            return "LC cost is divided based on LC amount<br>/amt^" + F(u3_boost(game.upgrades[2].num), 3, 3) + " -> <span style='color:#60ff60;'>/amt^" + F(u3_boost(game.upgrades[2].num+1), 3, 3) + "</span";
        case 3:
            return "T2+ Life Crystals are boosted by previous LC amount, raised to the ^" + u4_boost(game.upgrades[3].num).toFixed(2) + " -> ^<span style='color:#60ff60;'>" + u4_boost(game.upgrades[3].num+1) + "</span> power"
    }
}

function get_boost_desc(id) {
    switch (id) {
        case 0:
            return "Life Crystals are boosted based on highest LC tier owned (1+2^(tier-6))<br>Currently: x" + F(b1_boost(), 3, 3) + " (T" + get_highest_lc_tier() + ")";
        case 1:
            return "Life Crystals are boosted based on total LCs purchased (1.004^purchases)<br>Currently: x" + F(b2_boost(), 3, 3) + " (" + get_total_lcs_purchased() + " purchases)";
        case 2:
            return "T1 Life Crystal multiplier boosts T2-4 Life Crystals at a heavily reduced rate (mul^0.04)<br>Currently: x" + F(b3_boost(), 3, 3)
    }
}

function update_lc_upgrade_unlocks() {
    game.upgrades[1].unlocked = (game.upgrades[0].num > 0);
    game.upgrades[2].unlocked = (game.boosts[1].bought);
    game.upgrades[3].unlocked = (game.upgrades[2].num >= 2);
}

function update_lc_boost_unlocks() {
    game.boosts[0].unlocked = (game.upgrades[1].num > 0);
    game.boosts[1].unlocked = (game.boosts[0].bought);
    game.boosts[2].unlocked = (game.boosts[1].bought);
}

function get_lc_scaling(id) {
    let lc_obj = game.lc[id];

    for (let i = 0; i < lc_scaling_nums.length; i++) {
        if (lc_obj.num_bought < lc_scaling_nums[i]) {
            return i
        }
    }

    return lc_scaling_nums.length
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
            elements[i].classList.add(c1);
            if (c2) {
                elements[i].classList.remove(c2);
            }
        } else {
            elements[i].classList.remove(c1);
            if (c2) {
                elements[i].classList.add(c2);
            }
        }
    }
}

function life_menu_update() {
    switch (game_local.submenu) {
        case "life-crystals":
            document.getElementById("production").style.display = "flex";

            set_class_property("lcp", i => game.lc[i].unlocked ? "flex" : "none", "style", "display");
            toggle_classList("lcp", i => get_lc_scaling(i) === 1, "lcp-scaled");
            set_class_property("lc-info-tier", i => "T" + (i + 1) + " Life Crystal", "innerHTML");
            set_class_property("lc-info-mul", i => "x" + F(game.lc[i].mul, 3, 2), "innerHTML");
            set_class_property("lc-info-num", i => F(game.lc[i].num, 3, 0) + " (" + F(game.lc[i].num_bought, 3, 0) + ")", "innerHTML");
            set_class_property("lc-info-gain", i => game.lc_gain_display === "num" ? "+" + F(game.lc[i].ps, 3, 1) + "/s" : "+" + F(game.lc[i].ps.div(game.lc[i].num.add(1)).mul(100), 3, 2) + "%/s", "innerHTML");
            toggle_classList("lc-buy-btn", i => game.lc[i].cost.gt(game.le), "buy-btn-unaffordable");
            toggle_classList("lc-buy-btn", i => get_lc_scaling(i) === 1, "lc-buy-btn-scaled");
            set_class_property("lc-progress", i => game.lc[i].num_bought % 5 * 20 + "%", "style", "width");
            document.getElementById("submenu-upgrades").style.display = game.upgrades_unlocked ? "inline-block" : "none";
            document.getElementById("lc-purchase-mode-btn").innerHTML = "Purchase mode: " + (game.lc_purchase_mode === 0 ? "Buy 1" : (game.lc_purchase_mode === 1 ? "Until 5" : "Buy Max"));

            set_class_property("lc-buy-btn-content", i => "Cost: " + F(game.lc[i].cost, 3, 0) + " LE<br>", "innerHTML");
            break;
        case "upgrades":
            document.getElementById("upgrades").style.display = "flex";

            document.getElementById("lc-boosts-text").style.display = game.upgrades[1].num > 0 ? "flex" : "none";
            document.getElementById("lc-boost-container").style.display = game.upgrades[1].num > 0 ? "flex" : "none";

            set_class_property("lc-upgrade-rep", i => game.upgrades[i].unlocked ? "flex" : "none", "style", "display");
            toggle_classList("lc-upgrade-rep-buy-btn", i => game.upgrades[i].cost.gt(game.le), "buy-btn-unaffordable");
            set_class_property("lc-upgrade-rep-buy-btn", i => "Cost: " + F(game.upgrades[i].cost, 3, 0) + " LE", "innerHTML");
            set_class_property("lc-upgrade-rep-name", i => lc_upgrade_names[i] + " (Lv" + game.upgrades[i].num + ")", "innerHTML");
            set_class_property("lc-upgrade-rep-desc", i => get_upgrade_desc(i), "innerHTML");

            set_class_property("lc-boost", i => game.boosts[i].unlocked ? "flex" : "none", "style", "display");
            toggle_classList("lc-boost", i => game.boosts[i].bought, "lc-boost-bought");
            toggle_classList("lc-boost-buy-btn", i => game.boosts[i].cost.gt(game.le) && !game.boosts[i].bought, "buy-btn-unaffordable");
            set_class_property("lc-boost-buy-btn", i => game.boosts[i].bought ? "Bought (" + F(game.boosts[i].cost, 3, 0) + " LE)" : "Cost: " + F(game.boosts[i].cost, 3, 0) + " LE", "innerHTML");
            set_class_property("lc-boost-buy-btn", i => game.boosts[i].bought ? "default" : "pointer", "style", "cursor");
            toggle_classList("lc-boost-buy-btn", i => game.boosts[i].bought, "lc-boost-buy-btn-bought");
            set_class_property("lc-boost-name", i => lc_boost_names[i], "innerHTML");
            set_class_property("lc-boost-desc", i => get_boost_desc(i), "innerHTML");
        default:
            break;
    }
}

function achievements_menu_update() {
    switch (game_local.submenu) {
        case "achievements":
            document.getElementById("achievements").style.display = "flex";
            document.getElementsByClassName("achievement-info-text")[0].innerHTML = "Each achievement boosts LCs by x1.02"
            document.getElementsByClassName("achievement-info-text")[1].innerHTML = "Current boost: x" + Math.pow(1.02, game.achievements.length).toFixed(2)
            break;
        default:
            break;
    }
}

function options_menu_update() {
    switch (game_local.submenu) {
        case "saving":
            document.getElementById("options-saving").style.display = "flex";
            break;
        case "visual":
            document.getElementById("options-visual").style.display = "inline-block";

            document.getElementById("options-format-button").innerHTML = "Number format: " + game.num_format.charAt(0).toUpperCase() + game.num_format.slice(1);
            document.getElementById("options-progress-button").innerHTML = game.offline_progress ? "Offline progress: Enabled" : "Offline progress: Disabled";
            document.getElementById("options-ticker-button").innerHTML = game.ticker_enabled ? "News ticker: Enabled" : "News ticker: Disabled";
            let ticker_speed_value = document.getElementById("options-ticker-speed-slider").value;
            let new_ticker_speed = Math.pow(4, 2*ticker_speed_value-1);
            game.ticker_speed = new_ticker_speed;
            document.getElementById("options-ticker-speed-text").innerHTML = "Ticker speed: " + Math.round(100*new_ticker_speed) + "%"
            document.getElementById("options-lc-gain-display-button").innerHTML = game.lc_gain_display === "num" ? "Life Crystal gain displays: Amount/sec" : "Life Crystal gain displays: Percentage/sec";
        default:
            break;
    }
}

function statistics_menu_update() {
    switch(game_local.submenu) {
        case "statistics":
            document.getElementById("statistics").style.display = "inline-block";

            const statistics_texts = document.getElementsByClassName("statistics-text");
            
            statistics_texts[0].innerHTML = "You have played this game for <span style='color:#ffe4c2;'>" + seconds_to_dhms((game.time - game.start_time) / 1000) + "</span> (including offline progress).";
            statistics_texts[1].innerHTML = "You have generated <span style='color:#e4c9ff;'>" + F(game.total_le, 3) + "</span> life essence in total.";

            break;
        default:
            break;
    }
}

function seconds_to_dhms(s) {
    let d = Math.floor(s / (60 * 60 * 24));
    s %= (60 * 60 * 24);
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

function toggle_offline_progress() {
    game.offline_progress = !game.offline_progress;
}

let start = 0;
function handle_offline_progress() {
    let offline_time = Date.now() - game.time;
    let reached_max_time = false;
    if (offline_time > 3600000) {
        reached_max_time = true;
        offline_time = 3600000;
    }

    const game_before_exit = {};
    for (let i in game) {
        game_before_exit[i] = game[i]
    }

    let num_ticks = Math.round(1000 * Math.min(offline_time / 100000, 1));
    for (let i = 0; i < num_ticks; i++) {
        update(start + offline_time / num_ticks);
        start += offline_time / num_ticks;
    }

    if (offline_time >= 30000 & game_before_exit.time !== 0) {
        document.getElementsByClassName("offline-progress-container")[0].style.display = "flex";
        let offline_progress_text = document.getElementsByClassName("offline-progress-text")[0];

        offline_progress_text.innerHTML += "<div style='color:#efefef'>Offline time: " + seconds_to_dhms(offline_time / 1000) + (reached_max_time ? " (max)" : "") + " (" + num_ticks + " ticks)" + "</div>";
        if (game.le.gt(game_before_exit.le)) {
            offline_progress_text.innerHTML += "<div style='color:#e4c9ff;'>Life Essence increased " + F(game_before_exit.le, 3) + " -> " + F(game.le, 3) + "</div>";
        }
    } else {
        document.getElementsByClassName("offline-progress-container")[0].style.display = "none";
    }
}

function update(t) {
    const seconds = game.time_mult * (t - start) / 1000;
    start = t;
    
    // Math logic

    game.time = Date.now();
    
    for (let i = 0; i < game.lc.length; i++) {
        let lc_obj = game.lc[i];

        if (lc_obj.unlocked) {
            lc_obj.cost = get_lc_cost(i);
            lc_obj.mul = get_lc_mul(i);
        }
    }

    for (let i = 1; i < game.lc.length; i++) {
        let lc_obj = game.lc[i];
        let prev_lc_obj = game.lc[i-1];

        if (prev_lc_obj.num > 0) {
            lc_obj.unlocked = true;
        }

        if (lc_obj.unlocked) {
            prev_lc_obj.ps = lc_obj.num.mul(lc_obj.mul).mul(0.2);
            let prev_lc_gain = prev_lc_obj.ps.mul(seconds);
            prev_lc_obj.num = prev_lc_obj.num.add(prev_lc_gain);
        }
    }
    
    let leps = game.lc[0].num.mul(game.lc[0].mul).mul(2);
    let e_gain = leps.mul(seconds);
    game.le = game.le.add(e_gain);
    game.total_le = game.total_le.add(e_gain);
    
    if (request_update) {
        // Check achievements
        check_achievements();

        // Update news ticker
        document.getElementsByClassName("news-ticker-container")[0].style.display = game.ticker_enabled ? "inline-block" : "none";
        update_ticker();
        
        // Update other HTML
        document.getElementById("le-num").innerHTML = F(game.le, 3);
        document.getElementById("leps-num").innerHTML = F(leps, 3);
        
        if (game.lc[3].num.gte(1) && !game.upgrades_unlocked) {
            add_popup("feature", "New feature unlocked: Upgrades")
            game.upgrades_unlocked = true;
            document.getElementById("submenu-upgrades").classList.add("new-feature");
            game.upgrades[0].unlocked = true;
        }
    
        update_lc_upgrade_unlocks();
        update_lc_boost_unlocks();
    
        let progress = 0;
        if (!game.upgrades_unlocked) {
            progress = Math.min(100, 100 * game.le.add(1).log10() / lc_base_costs[3].log10());
            document.getElementById("progress-text").innerHTML = "Next feature at " + F(lc_base_costs[3], 3) + " life essence (" + progress.toFixed(1) + "%)"
        } else {
            progress = Math.min(100, 100 * game.le.add(1).log10() / 30);
            document.getElementById("progress-text").innerHTML = "Next feature at " + F(new Decimal(1e30), 3) + " life essence (" + progress.toFixed(1) + "%)"
        }
    
        document.getElementById("progress-bar").style.width = progress.toString() + "%";

        if (dev_mode) {
            document.getElementsByClassName("dev-tools")[0].innerHTML = "H: Set LE amount<br>" + "S: Set game speed " + "(Currently: " + game.time_mult.toFixed(1) + ")<br>J: Adjust unbought prices";
        }
    
        // Handle hotkeys
        if (pressed_keys.hasOwnProperty("KeyM")) {
            if (pressed_keys["KeyM"]) {
                buy_max();
            }
        }
    
        // Switch & update menus
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

        requestAnimationFrame(update);
    }
}

function add_listeners() {
    window.onkeydown = function(e) {
        pressed_keys[e.code] = true;
        if (e.code === "KeyH" && dev_mode) {
            let le_exp = prompt("LE Exponent:");
            if (le_exp != null && !isNaN(Number(le_exp))) {
                game.le.m = 1;
                game.le.e = Number(le_exp);
            }
        }
        if (e.code === "KeyS" && dev_mode) {
            let game_speed = prompt("Game Speed:");
            if (game_speed != null && !isNaN(Number(game_speed))) {
                game.time_mult = Number(game_speed);
            }
        }
        if (e.code === "KeyJ" && dev_mode) {
            let confirmation = confirm("Adjust all prices?");
            if (confirmation) {
                for (let i = 0; i < game.lc.length; i++) {
                    if (game.lc[i].num_bought === 0) {
                        game.lc[i].cost = lc_base_costs[i];
                    }
                }

                for (let i = 0; i < game.upgrades.length; i++) {
                    if (game.upgrades[i].num === 0) {
                        game.upgrades[i].cost = lc_upgrade_costs[i];
                    }
                }

                for (let i = 0; i < game.boosts.length; i++) {
                    if (!game.boosts[i].bought) {
                        game.boosts[i].cost = lc_boost_costs[i];
                    }
                }
            }
        }
    }

    window.onkeyup = function(e) {
        pressed_keys[e.code] = false;
    }
    
}

window.onload = () => {
    if (!document.cookie) {
        setup_game();
    } else {
        load_save_cookie();
    }
    add_listeners();
    setInterval(save_game, 5000);
    setup_html_elements();
    get_news_message();
    if (game.offline_progress) {
        handle_offline_progress();
    }
    start = 0;
    request_update = true;
    document.body.style.display = "flex";
    requestAnimationFrame(update);
};