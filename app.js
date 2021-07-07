/* ---------------- 변수 선언 --------------- */
const resetBtn = document.getElementById("jsReset");
const saveBtn = document.getElementById("jsSave");

const canvas = document.querySelector(".canvas");
const ctx = canvas.getContext("2d");

const colors = document.getElementsByClassName("jsColors");
const pickColorBtn = document.getElementById("pickColorBtn");
const colorPicker = document.querySelector("#colorPicker");
const navigator = document.querySelector(".constrols_navigator");

const sizeRange = document.getElementById("brushSizeRange");
const modeBtn = document.getElementById("jsMode");


const settingBtn = document.getElementById("jsSetting");

const INITIAL_CANVAS_SIZE = 600;
const MIN_CANVAS_SIZE = 50;
const MAX_CANVAS_SIZE = 1500;
const INITIAL_COLOR = "black";

//실제 픽셀배율 설정
canvas.width = INITIAL_CANVAS_SIZE;
canvas.height = INITIAL_CANVAS_SIZE;

//기본 설정값 초기화
ctx.fillStyle = "white";
ctx.fillRect(0, 0, INITIAL_CANVAS_SIZE, INITIAL_CANVAS_SIZE);

ctx.strokeStyle = INITIAL_COLOR;
ctx.fillStyle = INITIAL_COLOR;
ctx.lineWidth = "2.5";

//변동 변수
let canvasWidth = INITIAL_CANVAS_SIZE;
let canvasHeight = INITIAL_CANVAS_SIZE;
let nowColor = INITIAL_COLOR;
let painting = false;
let filling = false;
let colorCode = colorPicker.value;


/* ---------------- 함수 --------------- */
function initializeCanvas(){
    canvas.style.width = canvasWidth+"px";
    canvas.style.height = canvasHeight+"px";

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    //브러시 크기 및 색상 설정은 유지
    ctx.lineWidth = sizeRange.value;
    ctx.strokeStyle = nowColor;
}

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
    nowColor = color;
}

function handleRangeChange(event) {
    const strokeSize = event.target.value;
    ctx.lineWidth = strokeSize;
    console.log(ctx.lineWidth);
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
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
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
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
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
    const pallete = document.querySelector(".controls_colors");
    const newColor = document.createElement("div");
    newColor.className = "controls_color jsColors";
    newColor.style.backgroundColor = color;
    pallete.insertBefore(newColor, pallete.lastElementChild);

    newColor.addEventListener("click", changeColor);
}

//모달창 관련
function openModal(){
    const modal = document.createElement("div");
    modal.className = 'modal_bg';
    const modal_code = 
        `<div class="modal_bg">
            <div class="modal_window">
            <div class="modal_content">
                <p class="modal_content_title">Canvas Size</p>
                <div class="modal_content_label">
                width<input type="number" id="input_size_width" value="${canvasWidth}" />px
                </div>
                <div class="modal_content_label">
                height<input type="number" id="input_size_height" value="${canvasHeight}" />px
                </div>
            </div>
            <div class="btns modal_btns">
                <button id="jsModalOK">OK</button>
                <button id="jsModalClose">close</button>
            </div>
            </div>
        </div>`;
    modal.innerHTML = modal_code;
    document.body.prepend(modal);

    //이벤트 리스너 추가
    document.getElementById('jsModalOK').addEventListener("click", UpdateCanvasSize);
    document.getElementById('jsModalClose').addEventListener("click", closeModal);
}

function closeModal(){
    const modal = document.querySelector(".modal_bg");
    document.body.removeChild(modal);
}

function UpdateCanvasSize(){
    //input값 가져오기
    const input_width = document.getElementById('input_size_width').value;
    const input_height = document.getElementById('input_size_height').value;
    
    //캔버스 사이즈 입력 체크
    if(input_width < MIN_CANVAS_SIZE || input_height < MIN_CANVAS_SIZE){
        alert(`최소 캔버스 사이즈는 ${MIN_CANVAS_SIZE}px입니다.`);      
    }else if(input_width > MAX_CANVAS_SIZE || input_height > MAX_CANVAS_SIZE){
        alert(`최대 캔버스 사이즈는 ${MAX_CANVAS_SIZE}px입니다.`);
    }else if(input_width === canvasWidth && input_height === canvasHeight){
        closeModal();
    }else{
        //사이즈 변경 및 캔버스 재생성
        canvasWidth = input_width;
        canvasHeight = input_height;
        initializeCanvas();
        closeModal();
    }   
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

//모달창
if (settingBtn) {
    settingBtn.addEventListener("click", openModal);
};

