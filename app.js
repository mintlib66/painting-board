/* ---------------- 변수 선언 --------------- */
const canvas = document.querySelector(".canvas");
const ctx = canvas.getContext("2d");

const toolBtns = document.getElementsByClassName("tool");
const toolBtn_pen = document.getElementById("jsTool_pen");
const toolBtn_pen_round = document.getElementById("jsTool_pen_r");
const toolBtn_fill = document.getElementById("jsTool_fill");
const toolBtn_square = document.getElementById("jsTool_square");
const toolBtn_square_fill = document.getElementById("jsTool_square_fill");

const sizeRange = document.getElementById("brushSizeRange");
const opacityRange = document.getElementById("opacityRange");

const colors = document.getElementsByClassName("jsColors");
const navigator = document.querySelector(".constrols_navigator");
const pickColorBtn = document.getElementById("pickColorBtn");
const colorPicker = document.querySelector("#colorPicker");

const settingBtn = document.getElementById("jsSetting");
const resetBtn = document.getElementById("jsReset");
const saveBtn = document.getElementById("jsSave");

const INITIAL_CANVAS_SIZE = 600;
const MIN_CANVAS_SIZE = 50;
const MAX_CANVAS_SIZE = 1500;
const INITIAL_COLOR = "black";
const INITIAL_SIZE = "2.5";
const INITIAL_ALPHA = "1";

//실제 픽셀배율 설정
canvas.width = INITIAL_CANVAS_SIZE;
canvas.height = INITIAL_CANVAS_SIZE;

//기본 설정값 초기화
ctx.fillStyle = "white";
ctx.fillRect(0, 0, INITIAL_CANVAS_SIZE, INITIAL_CANVAS_SIZE);

ctx.strokeStyle = INITIAL_COLOR;
ctx.fillStyle = INITIAL_COLOR;
ctx.lineWidth = INITIAL_SIZE
ctx.globalAlpha = INITIAL_ALPHA;

//변동 변수
let canvasWidth = INITIAL_CANVAS_SIZE;
let canvasHeight = INITIAL_CANVAS_SIZE;
let nowColor = INITIAL_COLOR;
let colorCode = colorPicker.value;
let tool = "pen";
let painting = false;
let filling = false;
let drawingSquare = false;
let strokeSize = INITIAL_SIZE;
let opacity = INITIAL_ALPHA;
let start_x, start_y;


/* ---------------- 캔버스와 그리기 관련 함수 --------------- */
//초기화
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

//그리기 툴
function startPainting() {
    painting = true;
}
function stopPainting() {
    painting = false;

}
function fillCanvas(){
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
}

function startDrawing(event){
    start_x = event.offsetX;
    start_y = event.offsetY;
    drawingSquare = true;
}
//드래그하는동안 그려지는 사각형 형태 미리보기
function previewDrawing(event){
    const x = event.offsetX;
    const y = event.offsetY;
    if(drawingSquare){
        ctx.strokeRect(x, y, start_x - x, start_y - y);
    }
}
function stopDrawing(event){
    const x = event.offsetX;
    const y = event.offsetY;
    ctx.strokeRect(x, y, start_x - x, start_y - y);
    drawingSquare = false
}
function stopDrawingFill(event){
    const x = event.offsetX;
    const y = event.offsetY;
    ctx.fillRect(x, y, start_x - x, start_y - y);
    drawingSquare = false
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
//캔버스 내 좌클릭 기능
function handleCanvasClick() {
    
}
//캔버스 내 우클릭 기능
function handleCanvasRightClick(event) {
    event.preventDefault();
}


/* ---------------- 함수 --------------- */
//캔버스 사이즈 변경 모달창
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

//좌측 툴바 클릭 이벤트
function toolBtnClick(event){
    const targetBtn = event.target;
    const isSelected = targetBtn.classList.contains("selected");

    if(!isSelected){
        Array.from(toolBtns).forEach(btn => btn.classList.remove("selected"));
        targetBtn.classList.add("selected");
        handleToolChange(targetBtn.id);
    }
}
//툴 변경
function handleToolChange(id) {
    switch(id){
        case "jsTool_pen": 
            tool = "pen";
            handlePentip("butt");
            OnEventPen();
            OffEventFill();
            OffEventShape();
            OffEventShapeFill();
            break;
        case "jsTool_pen_r":
            tool = "r_pen";
            handlePentip("round");
            OnEventPen();
            OffEventFill();
            OffEventShape();
            OffEventShapeFill();
            break;
        case "jsTool_fill":
            tool = "fill"; 
            OffEventPen();
            OnEventFill(); 
            OffEventShape();
            OffEventShapeFill();
            break;
        case "jsTool_square":
            tool = "square";
            OffEventPen();
            OffEventFill();
            OnEventShape();
            OffEventShapeFill();
            break;
        case "jsTool_square_fill":
            tool = "square_fill";
            OffEventPen();
            OffEventFill();
            OnEventShape();
            OnEventShapeFill();
            break;
    }
}

//툴 별 이벤트 리스터 관리
function OnEventPen(){
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mousedown", startPainting);
    canvas.addEventListener("mouseup", stopPainting);  
}
function OffEventPen(){
    canvas.removeEventListener("mousemove", onMouseMove);
    canvas.removeEventListener("mousedown", startPainting);
    canvas.removeEventListener("mouseup", stopPainting);  
}
function OnEventFill(){
    canvas.addEventListener("mousedown", fillCanvas);
}
function OffEventFill(){
    canvas.removeEventListener("mousedown", fillCanvas);
}
function OnEventShape(){
    canvas.addEventListener("mousedown", startDrawing);
    //canvas.addEventListener("mousemove", previewDrawing);
    canvas.addEventListener("mouseup", stopDrawing);
}
function OffEventShape(){
    canvas.removeEventListener("mousedown", startDrawing);
    canvas.removeEventListener("mouseup", stopDrawing);
}
function OnEventShapeFill(){
    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mouseup", stopDrawingFill);
}
function OffEventShapeFill(){
    canvas.removeEventListener("mousedown", startDrawing);
    canvas.removeEventListener("mouseup", stopDrawingFill);
}
//브러시 모양 변경
function handlePentip(tip){
    ctx.lineCap = tip;
}

//브러시 크기 변경
function handleSizeRangeChange(event) {
    strokeSize = event.target.value;
    ctx.lineWidth = strokeSize;
}
//불투명도 변경
function handleOpacityRangeChange(event) {
    opacity = event.target.value;
    ctx.globalAlpha = opacity;
    console.log(ctx.strokeStyle);
}

//색상 변경 이벤트
function changeColor(event) {
    const color = event.target.style.backgroundColor;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    navigator.style.backgroundColor = color;
    nowColor = color;
}
function updateColor(event) {
    colorCode = event.target.value;
}
function handleColorConfirm() {
    addNewColor(colorCode);
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

//리셋 버튼 기능
function resetClick() {
    const temp_color = ctx.fillStyle;
    const temp_alpha = ctx.globalAlpha;
    ctx.fillStyle = "white";
    ctx.globalAlpha = "1";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = temp_color;
    ctx.globalAlpha = temp_alpha;
}

//저장 버튼 기능
function handleSaveClick() {
    const image = canvas.toDataURL("image/png");
    const link = document.createElement("a");

    link.href = image;
    link.download = "painting";
    link.click();
}

/* ---------------- 이벤트 리스너 --------------- */
if (canvas) {
    //공통
    canvas.addEventListener("contextmenu", handleCanvasRightClick);
    canvas.addEventListener("mouseleave", stopPainting);
    
    //기본-펜 이벤트 활성화
    OnEventPen();   
};

if (resetBtn) {
    resetBtn.addEventListener("click", resetClick);
};
if (saveBtn) {
    saveBtn.addEventListener("click", handleSaveClick);
};

if (colors) {
    Array.from(colors).forEach(color => color.addEventListener("click", changeColor));
};

if (sizeRange) {
    sizeRange.addEventListener("input", handleSizeRangeChange);
};
if (opacityRange) {
    opacityRange.addEventListener("input", handleOpacityRangeChange);
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

if (toolBtns) {
    Array.from(toolBtns).forEach( btn => btn.addEventListener("click", toolBtnClick));
};