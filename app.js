/* ---------------- 변수 선언 --------------- */
const resetBtn = document.getElementById("jsReset");
const saveBtn = document.getElementById("jsSave");

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const colors = document.getElementsByClassName("jsColors");
const pickColorBtn = document.getElementById("pickColorBtn");
const colorPicker = document.querySelector("#colorPicker");
const sizeRange = document.getElementById("brushSizeRange");
const modeBtn = document.getElementById("jsMode");
const navigator = document.querySelector(".constrols_navigator");

const INITIAL_COLOR = "black";
const CANVAS_SIZE = 600;

//실제 픽셀배율 설정
canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;

//기본 설정값 초기화
ctx.fillStyle = "white";
ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

ctx.strokeStyle = INITIAL_COLOR;
ctx.fillStyle = INITIAL_COLOR;
ctx.lineWidth = "2.5";

let painting = false;
let filling = false;
let colorCode = colorPicker.value;


/* ---------------- 함수 --------------- */

function stopPainting() {
    painting = false;
}

function startPainting() {
    painting = true;
}

function onMouseMove(event) {
    const x = event.offsetX;
    const y = event.offsetY;
    if (!painting) {
        ctx.beginPath();
        ctx.moveTo(x, y);
    } else {
        ctx.lineTo(x, y);
        ctx.stroke();
    }

}

//색상 변경 이벤트
function changeColor(event) {
    const color = event.target.style.backgroundColor;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    navigator.style.backgroundColor = color;
}

function handleRangeChange(event) {
    const strokeSize = event.target.value;
    ctx.lineWidth = strokeSize;

}

function handleModeClick(event) {
    if (filling === true) {
        filling = false;
        modeBtn.innerText = "Fill";
    } else {
        filling = true;
        modeBtn.innerText = "Paint";
    }
}
function resetClick() {
    const temp = ctx.fillStyle;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    ctx.fillStyle = temp;
}
function handleSaveClick() {
    const image = canvas.toDataURL("image/png");
    const link = document.createElement("a");

    link.href = image;
    link.download = "painting";
    link.click();
}

function handleCanvasClick() {
    if (filling === true) {
        ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    }
}

//캔버스 내 우클릭 
function handleCanvasRightClick(event) {
    event.preventDefault();
}


function updateColor(event) {
    colorCode = event.target.value;
}

function handleColorConfirm() {
    addNewColor(colorCode);
    hideColorPicker();
}

//새 색상 원이 팔레트에 추가됨
function addNewColor(color) {
    const pallete = document.querySelector('.controls_colors');
    const newColor = document.createElement('div');
    newColor.className = 'controls_color jsColors';
    newColor.style.backgroundColor = color;
    pallete.insertBefore(newColor, pallete.lastElementChild);

    newColor.addEventListener("click", changeColor);
}

/* ---------------- 이벤트 리스너 --------------- */
if (resetBtn) {
    resetBtn.addEventListener("click", resetClick);
};
if (saveBtn) {
    saveBtn.addEventListener("click", handleSaveClick);
};

if (canvas) {
    //펜
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mousedown", startPainting);
    canvas.addEventListener("mouseup", stopPainting);
    //공통
    canvas.addEventListener("mouseleave", stopPainting);
    canvas.addEventListener("click", handleCanvasClick);
    canvas.addEventListener("contextmenu", handleCanvasRightClick);
};

if (colors) {
    Array.from(colors).forEach(color => color.addEventListener("click", changeColor));
};

if (sizeRange) {
    sizeRange.addEventListener("input", handleRangeChange);
};

if (modeBtn) {
    modeBtn.addEventListener("click", handleModeClick);
};

if (colorPicker) {
    colorPicker.addEventListener("change", updateColor);
};

if (pickColorBtn) {
    pickColorBtn.addEventListener("click", handleColorConfirm);
};



