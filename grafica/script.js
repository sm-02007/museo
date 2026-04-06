let slider = document.getElementById("sliderK");
let playBtn = document.getElementById("playBtn");

let interval = null;
let isPlaying = false;

// Cada vez que movés el slider -> redibuja
slider.addEventListener("input", graficar);

// Toggle play/stop
playBtn.addEventListener("click", () => {

    if (!isPlaying) {
        // ▶ Arranca animación
        let value = Number(slider.value);
        let direction = 1;
        let max = Number(slider.max);
        let min = Number(slider.min);

        interval = setInterval(() => {
            value += direction;

            if (value >= max) { value = max; direction = -1; }
            if (value <= min) { value = min; direction = 1; }

            slider.value = value;
            graficar();

        }, 30);

        isPlaying = true;
        playBtn.value = "Stop";

    } else {
        // Frena animación
        clearInterval(interval);
        interval = null;

        isPlaying = false;
        playBtn.value = "Play";
    }
});

function graficar() {
    let canvas = document.getElementById("loveChart");
    let ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();

    let k = Number(slider.value);
    let first = true;

    for (let x = -1.7; x <= 1.7; x += 0.01) {
        // fórmula del corazón
        let y = math.evaluate(
            "abs(x)^(2/3) + 0.9 * sin(k * x) * sqrt(3 - x^2)",
            { x: x, k: k }
        );
        

        if (!isFinite(y)) continue;

        let canvasX = x * 100 + canvas.width / 2;
        let canvasY = canvas.height / 2 - y * 100;

        if (first) { ctx.moveTo(canvasX, canvasY); first = false; }
        else { ctx.lineTo(canvasX, canvasY); }
    }

    ctx.strokeStyle = "purple";
    ctx.lineWidth = 2;
    ctx.stroke();
}

// dibuja al cargar
graficar();