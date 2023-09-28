const WIN_COLOR = "#24d54e";
const DEFEAT_COLOR = "#ff1a65";

/**
 * Function displays records section.
 * @param {string} finalTitle - "Победа" or "Поражение" title that will be displayed
 * to the player. It affects the background color of the section.
 * @param {string} winColor - background color of the section for "Победа" finalTitle. Default value - {@link WIN_COLOR}.
 * @param {string} defeatColor - background color of the section for "Поражение" finalTitle. Default value - {@link DEFEAT_COLOR}
 */
export function recordListView(finalTitle, winColor = WIN_COLOR, defeatColor = DEFEAT_COLOR) {
    let recordsArr = Object.entries(JSON.parse(localStorage.getItem("records") ?? '{}'));

    // Sort by scores in descending order
    recordsArr.sort((a, b) => b[1] - a[1]);

    // Generate html for records
    let pointsListHTML = '';
    let usernamesListHTML = '';
    const recordsLimit = recordsArr.length < 5 ? recordsArr.length : 5;
    for (let i = 0; i < recordsLimit; i++) {
        const record = recordsArr[i];
        usernamesListHTML += `<li>${record[0]}</li>`;
        pointsListHTML += `<li>${record[1]}</li>`;
    }


    const recordsSection = document.querySelector(".records");
    recordsSection.style.visibility = "visible";
    recordsSection.querySelector(".final-label").innerText = finalTitle;
    recordsSection.querySelector(".username-list").innerHTML = usernamesListHTML;
    recordsSection.querySelector(".points-list").innerHTML = pointsListHTML;
    if (finalTitle === "Победа") {
        recordsSection.style.backgroundColor = winColor;
    } else {
        recordsSection.style.backgroundColor = defeatColor;
    }
}

/**
 * Displaying the section with the next shape.
 * This function uses shifts from the next shape object.
 * @param {Shape} nextShape - the next shape object.
 */
export function nextShapeView(nextShape) {
    const newShifts = nextShape.shifts;
    const nextFigureSection = document.querySelector(".next-figure-section");
    const shapeBlocks = nextFigureSection.getElementsByClassName("shape-block");

    for (const block of shapeBlocks) {
        block.style.backgroundColor = "gainsboro";
    }

    for (const point of newShifts) {
        nextFigureSection.querySelector(`.block-${point.x}-${point.y}`)
            .style.backgroundColor = "green";
    }

    document.getElementById("center-block").style.backgroundColor = "green";
}