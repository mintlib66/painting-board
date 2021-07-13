/* ---------------- 변수 선언 --------------- */
const canvas = document.querySelector(".canvas");
const ctx = canvas.getContext("2d");

const toolBtns = document.getElementsByClassName("tool");

const sizeNumber = document.querySelector("#brushSizeNumber");
const sizeRange = document.querySelector("#brushSizeRange");
const opacityNumber = document.querySelector("#opacityNumber");
const opacityRange = document.querySelector("#opacityRange");

const colors = document.querySelectorAll(".jsColors");
const navigator = document.querySelectorAll(".navigator_color");
const firstColor = document.querySelector("#firstColor");
const secondColor = document.querySelector("#secondColor");
const pickColorBtn = document.querySelector("#pickColorBtn");
const colorPicker = document.querySelector("#colorPicker");

const settingBtn = document.querySelector("#jsSetting");
const clearBtn = document.querySelector("#jsClear");
const saveBtn = document.querySelector("#jsSave");

//초기값
const INITIAL_CANVAS_SIZE = 600;
const MIN_CANVAS_SIZE = 50;
const MAX_CANVAS_SIZE = 1500;

const INITIAL_FIRST_COLOR = "black";
const INITIAL_SECOND_COLOR = "white";
const INITIAL_SIZE = "2.5";
const MIN_BRUSH_SIZE = "0.1";
const MAX_BRUSH_SIZE = "10";
const INITIAL_ALPHA = "1.0";

//변동값 설정
let canvasWidth = INITIAL_CANVAS_SIZE;
let canvasHeight = INITIAL_CANVAS_SIZE;

let nowFirstColor = INITIAL_FIRST_COLOR;
let nowSecondColor = INITIAL_SECOND_COLOR;
let selectedNavi = "firstColor";
let nowColor = nowFirstColor;
let colorCode = colorPicker.value;

let tool = "pen";
let painting = false;
let filling = false;
let fillingGradient = false;
let drawingSquare = false;

let strokeSize = INITIAL_SIZE;
let opacity = INITIAL_ALPHA;
let start_x, start_y;

//실제 픽셀배율 설정
canvas.width = INITIAL_CANVAS_SIZE;
canvas.height = INITIAL_CANVAS_SIZE;

//기본 설정값 초기화
ctx.fillStyle = "white";
ctx.fillRect(0, 0, INITIAL_CANVAS_SIZE, INITIAL_CANVAS_SIZE);

ctx.strokeStyle = INITIAL_FIRST_COLOR;
ctx.fillStyle = INITIAL_FIRST_COLOR;
ctx.lineWidth = INITIAL_SIZE
ctx.globalAlpha = INITIAL_ALPHA;


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
function startGradientFillCanvas(event){
    start_x = event.offsetX;
    start_y = event.offsetY;
    fillingGradient = true;
}
function stopGradientFillCanvas(event){
    const x = event.offsetX;
    const y = event.offsetY;
    let gradient = ctx.createLinearGradient(start_x, start_y, x, y);
    gradient.addColorStop(0, nowFirstColor);
    gradient.addColorStop(1, nowSecondColor);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    fillingGradient = false;
}

function startDrawing(event){
    start_x = event.offsetX;
    start_y = event.offsetY;
    drawingSquare = true;
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
function stopDrawingFillEraser(event){
    const x = event.offsetX;
    const y = event.offsetY;
    ctx.clearRect(x, y, start_x - x, start_y - y);
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
function handleRightClick(event) {
    event.preventDefault();
}

/* ---------------- 함수 --------------- */

//캔버스 사이즈 변경 모달창
function openModal(){
    const modal = document.createElement("div");
    modal.className = 'modal_bg';
    const modal_code = 
        `<div class="modal_window">
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
        </div>`;
    modal.innerHTML = modal_code;
    document.body.prepend(modal);

    //이벤트 리스너 추가
    document.querySelector('#jsModalOK').addEventListener("click", UpdateCanvasSize);
    document.querySelector('#jsModalClose').addEventListener("click", closeModal);
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
    OffEventPen();
    OffEventFill();
    OffEventFillGradient();
    OffEventShape();
    OffEventShapeFill();
    OffEventShapeFillEraser();
    switch(id){
        case "jsTool_pen": 
            tool = "pen";
            handlePentip("butt");
            OnEventPen();
            break;
        case "jsTool_pen_r":
            tool = "r_pen";
            handlePentip("round");
            OnEventPen();
            break;
        case "jsTool_fill":
            tool = "fill"; 
            OnEventFill(); 
            break;
        case "jsTool_fill_gradient":
            tool = "fill_gradient"; 
            OnEventFillGradient(); 
            break;
        case "jsTool_square":
            tool = "square";
            OnEventShape();
            break;
        case "jsTool_square_fill":
            tool = "square_fill";
            OnEventShapeFill();
            break;
        case "jsTool_square_fill_eraser":
            tool = "square_fill_eraser";
            OnEventShapeFillEraser();
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
function OnEventFillGradient(){
    canvas.addEventListener("mousedown", startGradientFillCanvas);
    canvas.addEventListener("mouseup", stopGradientFillCanvas);
}
function OffEventFillGradient(){
    canvas.removeEventListener("mousedown", startGradientFillCanvas);
    canvas.removeEventListener("mouseup", stopGradientFillCanvas);
}
function OnEventShape(){
    canvas.addEventListener("mousedown", startDrawing);
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
function OnEventShapeFillEraser(){
    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mouseup", stopDrawingFillEraser);
}
function OffEventShapeFillEraser(){
    canvas.removeEventListener("mousedown", startDrawing);
    canvas.removeEventListener("mouseup", stopDrawingFillEraser);
}
//브러시 모양 변경
function handlePentip(tip){
    ctx.lineCap = tip;
}

//네이게이터 색상 선택 
function handleNavigatorSelect(event){
    const isSelected = event.target.classList.contains("selected");

    if(!isSelected){
        event.target.classList.add("selected");
        
        if(nowColor == nowFirstColor){
            firstColor.classList.remove("selected");
            nowColor = nowSecondColor;
            selectedNavi = "secondColor"
        }else {
            secondColor.classList.remove("selected");
            nowColor = nowFirstColor;
            selectedNavi = "firstColor";
        }
    }
}
//브러시 크기 변경
function handleSizeNumberChange(event) {
    let sizeNum = event.target.value;
    if(sizeNum > MAX_BRUSH_SIZE){
        sizeNum = MAX_BRUSH_SIZE;
    }else if(sizeNum < MIN_BRUSH_SIZE){
        sizeNum = MIN_BRUSH_SIZE;
    }
    strokeSize = sizeNum;
    brushSizeNumber.value = sizeNum;
    brushSizeRange.value = sizeNum;
    ctx.lineWidth = strokeSize;
}
function handleSizeRangeChange(event) {
    strokeSize = event.target.value;
    brushSizeNumber.value = event.target.value;
    ctx.lineWidth = strokeSize;
}
//불투명도 변경
function handleOpacityNumberChange(event) {
    let opacityNum = event.target.value;
    if(opacityNum > 1.0){
        opacityNum = 1.0;
    }else if(opacityNum < 0){
        opacityNum = 0;
    }
    opacity = opacityNum;
    opacityNumber.value = opacityNum;
    opacityRange.value = opacityNum;
    ctx.globalAlpha = opacity;
}
function handleOpacityRangeChange(event) {
    opacity = event.target.value;
    opacityNumber.value = event.target.value;
    ctx.globalAlpha = opacity;
}

//색상 변경 이벤트
function changeColor(event) {
    const color = event.target.style.backgroundColor;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    if(selectedNavi == "firstColor") {
        firstColor.style.backgroundColor = color;
        nowFirstColor = color;
    }else if(selectedNavi == "secondColor"){
        secondColor.style.backgroundColor = color;
        nowSecondColor = color;
    }
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

    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    firstColor.style.backgroundColor = color;
    nowColor = color;

    newColor.addEventListener("click", changeColor);
    newColor.addEventListener("contextmenu", handleColorRightClick);
}
//컬러 우클릭 - 컨텍스트창
function handleColorRightClick(event) {
    const targetColor = event.target;
    event.preventDefault();

    const ctxMenu = document.createElement("div");
    ctxMenu.className = 'ctx_menu';
    const ctxInner = `
        <ul class="ctx_menu_list">
            <li id="color_delete">delete</li>
            <li id="color_change">change</li>
        </ul>
    `;
    ctxMenu.innerHTML = ctxInner;

    ctxMenu.style.left = event.pageX+'px';
    ctxMenu.style.top = event.pageY+'px';
    document.body.prepend(ctxMenu);

    document.querySelector("#color_delete").addEventListener('click', () => deletePalleteColor(targetColor));
    document.querySelector("#color_change").addEventListener('click', () => changePalleteColor(targetColor));
    ctxMenu.addEventListener('contextmenu', handleRightClick);
    ctxMenu.addEventListener('mouseleave', closeCtxMenu);
}
//색상 삭제
function deletePalleteColor(targetColor){
    targetColor.remove();
    closeCtxMenu();
}
//색상 변경
function changePalleteColor(targetColor){
    targetColor.style.backgroundColor = colorCode;
    closeCtxMenu();
}
function closeCtxMenu(){
    const ctxMenu = document.querySelector('.ctx_menu');
    ctxMenu.remove();
}


function UpdateCanvasSize(){
    //input값 가져오기
    const input_width = document.querySelector('#input_size_width').value;
    const input_height = document.querySelector('#input_size_height').value;
    
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
function clearClick() {
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

//실행 취소 기능
function undoCanvas(){
    
}

/* ---------------- 이벤트 리스너 --------------- */
if (canvas) {
    //공통
    canvas.addEventListener("contextmenu", handleRightClick);
    canvas.addEventListener("mouseleave", stopPainting);
    
    //기본-펜 이벤트 활성화
    OnEventPen();   
};
if (navigator) {
    Array.from(navigator).forEach(naviColor => {
        naviColor.addEventListener("click", handleNavigatorSelect);
        }
    );  
};

if (clearBtn) {
    clearBtn.addEventListener("click", clearClick);
};
if (saveBtn) {
    saveBtn.addEventListener("click", handleSaveClick);
};

if (colors) {
    Array.from(colors).forEach(color => {
        color.addEventListener("click", changeColor);
        color.addEventListener("contextmenu", handleColorRightClick);
        }
    );  
};
if (sizeNumber) {
    sizeNumber.addEventListener("input", handleSizeNumberChange);
};
if (sizeRange) {
    sizeRange.addEventListener("input", handleSizeRangeChange);
};
if (opacityNumber) {
    opacityNumber.addEventListener("input", handleOpacityNumberChange);
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