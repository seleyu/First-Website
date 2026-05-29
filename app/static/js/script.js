const canvas = document.getElementById("canvas");
let draggedSrc = null; // store current sticker

// button
const btn = document.querySelector(".btn");
const bgClasses = ['bg-blank', 'bg-day', 'bg-night', 'bg-dreary'];
let currentBgIndex = 0;

btn.addEventListener("click", (e) =>
{
    canvas.classList.remove(bgClasses[currentBgIndex]);
    currentBgIndex = currentBgIndex + 1;
    
    if(currentBgIndex >= bgClasses.length)
    {
        currentBgIndex = 0;
    }

    canvas.classList.add(bgClasses[currentBgIndex]);
});

// drag
document.querySelectorAll(".sticker").forEach(sticker => 
{
    sticker.addEventListener("dragstart", (e) => 
    {
        draggedSrc = e.target.src;
    });
});

// drop
canvas.addEventListener("dragover", (e) => 
{
    e.preventDefault();
});

canvas.addEventListener("drop", (e) => 
{
    e.preventDefault

    const newSticker = document.createElement("img");
    newSticker.src = draggedSrc; // use saved img path
    newSticker.classList.add("placed-sticker");

    // position where dropped
    newSticker.style.left = e.offsetX + "px";
    newSticker.style.top = e.offsetY + "px";

    canvas.appendChild(newSticker); // add to canvas div
    makeDraggable(newSticker);
});

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
        e.preventDefault();
    });

    document.addEventListener("mousemove", (e) =>
    {
        if(!isHeld) return;

        const canvasRect = canvas.getBoundingClientRect();
        sticker.style.left = (e.clientX - canvasRect.left - offsetX) + "px";
        sticker.style.top = (e.clientY - canvasRect.top - offsetY) + "px";
    });

    document.addEventListener("mouseup", (e) =>
    {
        isHeld = false;
        sticker.style.cursor = "move";
    });
}