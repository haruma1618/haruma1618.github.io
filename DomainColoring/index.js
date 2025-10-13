let dcShader;
let pixelSize = 0.01;
let graphMid = [0, 0];

function preload() {
    dcShader = loadShader('shader.vert', 'shader.frag');
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
}

function draw() {  
    shader(dcShader);

    dcShader.setUniform("graphSize", [pixelSize * width, pixelSize * height]);
    dcShader.setUniform("graphCenter", graphMid);

    plane(width, height);
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
    console.log(e.movementX + " " + e.movementY);
    graphMid[0] -= e.movementX * pixelSize;
    graphMid[1] += e.movementY * pixelSize;
}

function windowResized(){
    resizeCanvas(windowWidth, windowHeight);
}