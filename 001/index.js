const game = {"menu": "game1"}

function sidebar_btn_click(id) {
    const body_bg_colors = {"btn1": "#1c0040", "btn2": "#1b4000", "btn3": "#004040"}

    if (id in body_bg_colors) {
        document.body.style.backgroundColor = body_bg_colors[id];
    }
}