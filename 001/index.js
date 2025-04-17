const body = document.getElementsByTagName("body")[0]

function btn_click(id) {
    body_bg_colors = {"btn1": "#1c0040", "btn2": "#1b4000", "btn3": "#004040"}

    if (id in body_bg_colors) {
        body.style.backgroundColor = body_bg_colors[id];
        console.log(body)
    }
}