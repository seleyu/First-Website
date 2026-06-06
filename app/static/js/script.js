// START
const startPage = document.getElementById("start-page");
const mainPage = document.getElementById("main-page");
const startBtn = document.getElementById("start-btn");

startBtn.addEventListener("click", (e) =>
{
    startPage.classList.add("hidden"); // hide start
    mainPage.classList.remove("hidden"); // reveal main
});

// MAIN
const canvas = document.getElementById("canvas");
let draggedSrc = null; // store current sticker
let dragOffsetX = 0;
let dragOffsetY = 0;

//=== STICKER LOGIC ===

// drag
document.querySelectorAll(".sticker").forEach(sticker => 
{
    sticker.addEventListener("dragstart", (e) => 
    {
        draggedSrc = e.target.src;
        dragOffsetX = e.offsetX;
        dragOffsetY = e.offsetY;
    });
});

// drop
canvas.addEventListener("dragover", (e) => 
{
    e.preventDefault();
});

canvas.addEventListener("drop", (e) => 
{
    e.preventDefault();

    if (!draggedSrc) return;

    const rect = canvas.getBoundingClientRect();

    // position where dropped
    let x = e.clientX - rect.left - dragOffsetX;
    let y = e.clientY - rect.top - dragOffsetY;
    
    placeSticker(draggedSrc, x, y);
});

function placeSticker(src, x, y)
{
    const newSticker = document.createElement("img");
    newSticker.src = src; // use saved img path
    newSticker.classList.add("placed-sticker");
    canvas.appendChild(newSticker); // add to canvas div
    
    const sizePercent = 8;
    newSticker.style.width = sizePercent + "%";
    newSticker.style.height = "auto";

    const clamped = withinBounds(x, y, newSticker); // can only place on canvas

    // store as percent to resize with canvas
    const percent = toPercent(clamped.x, clamped.y);
    newSticker.style.left = percent.x + "%";
    newSticker.style.top = percent.y + "%";

    makeDraggable(newSticker);
}

// drag placed sticker
function makeDraggable(sticker)
{
    let isHeld = false;
    let offsetX, offsetY;

    sticker.addEventListener("mousedown", (e) =>
    {
        isHeld = true;
        offsetX = e.offsetX;
        offsetY = e.offsetY;
        sticker.style.cursor = "grabbing";
        sticker.style.zIndex = 10; // bring to front during drag
        e.preventDefault();
    });

    document.addEventListener("mousemove", (e) =>
    {
        if(!isHeld) return;
        const rect = canvas.getBoundingClientRect();

        let newX = e.clientX - rect.left - offsetX;
        let newY = e.clientY - rect.top - offsetY;

        const clamped = withinBounds(newX, newY, sticker);

        const percent = toPercent(clamped.x, clamped.y);
        sticker.style.left = percent.x + "%";
        sticker.style.top = percent.y + "%";
    });

    document.addEventListener("mouseup", (e) =>
    {
        if(!isHeld) return;

        isHeld = false;
        sticker.style.cursor = "move";
        sticker.style.zIndex = "";
    });
}

// == STICKER HELPERS ==

function toPercent(x, y) // pixel position to percentage relative to canvas
{
    return { // object literal
        x: (x/canvas.offsetWidth) * 100,
        y: (y/canvas.offsetHeight) * 100
    };
}

function withinBounds(x, y, sticker)
{
    const maxX = canvas.offsetWidth - sticker.offsetWidth;
    const maxY = canvas.offsetHeight - sticker.offsetHeight;
    
    return {
        x: Math.max(0, Math.min(x, maxX)),
        y: Math.max(0, Math.min(y, maxY))
    };
}

// == BUTTONS ==
const changeBgBtn = document.getElementById("change-bg-btn");
const clearBtn = document.getElementById("clear-btn");
const exitBtn = document.getElementById("exit-btn");

// change canvas button
const bgClasses = ['bg-blank', 'bg-day', 'bg-night', 'bg-dreary'];
let currentBgIndex = 0;

changeBgBtn.addEventListener("click", (e) =>
{
    canvas.classList.remove(bgClasses[currentBgIndex]);
    currentBgIndex = currentBgIndex + 1;
    
    if(currentBgIndex >= bgClasses.length)
    {
        currentBgIndex = 0;
    }

    canvas.classList.add(bgClasses[currentBgIndex]);
});

// clear all button
clearBtn.addEventListener("click", (e) =>
{
    const placedStickers = canvas.querySelectorAll(".placed-sticker");

    placedStickers.forEach(sticker =>
    {
        sticker.remove();
    });
});

// back to start button
exitBtn.addEventListener("click", (e) =>
{
    mainPage.classList.add("hidden");
    startPage.classList.remove("hidden");
})