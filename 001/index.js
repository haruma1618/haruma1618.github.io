const game = {"menu": "game1", "essence": new Decimal(1)}
let start;

function sidebar_btn_click(id) {
    const body_bg_colors = {"btn1": "#1c0040", "btn2": "#1b4000", "btn3": "#004040"}

    if (id in body_bg_colors) {
        document.body.style.backgroundColor = body_bg_colors[id];
    }
}

function update(t) {
    const elapsed = t - start;
    start = t;
    
    game.essence = game.essence.add(elapsed / 1000)
    document.getElementById("essence-amt").innerHTML = game.essence.toFixed(1)
    
    requestAnimationFrame(update);
}

requestAnimationFrame(update);
