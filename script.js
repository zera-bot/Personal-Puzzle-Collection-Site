let puzzles = [];

async function loadJSON(){
    const response = await fetch("puzzles.json");
    let jsonData = await response.json();

    for (const puzzle of jsonData) {
        if (puzzle.name == "") continue;
        puzzles.push(puzzle);
    }

    updateStats();
    populateAxisFilter();
    populateShapeFilter();
    renderTable(puzzles);
}

function updateStats(){
    console.log(puzzles);
    let unsolved = 0;
    for (const puzzle of puzzles){
        if (!puzzle.solved) unsolved++;
    }
    
    document.getElementById("uniquePuzzles").textContent = puzzles.length;
    document.getElementById("unsolvedPuzzles").textContent = unsolved;
}

function populateAxisFilter(){
    const filter = document.getElementById("axisFilter");

    const uniqueAxes = [];
    for (const puzzle of puzzles){
        if (!uniqueAxes.includes(puzzle.axisSystem)){
            const option = document.createElement("option");
            option.value = puzzle.axisSystem;
            option.textContent = puzzle.axisSystem;
            filter.appendChild(option);

            uniqueAxes.push(puzzle.axisSystem);
        }
    }
}

function populateShapeFilter(){
    const filter = document.getElementById("shapeFilter");

    const uniqueShapes = [];
    for (const puzzle of puzzles){
        if (!uniqueShapes.includes(puzzle.shape)){
            const option = document.createElement("option");
            option.value = puzzle.shape;
            option.textContent = puzzle.shape;
            filter.appendChild(option);

            uniqueShapes.push(puzzle.shape);
        }
    }
}

function applyFilters(){
    const search = document.getElementById("searchBar").value.toLowerCase();

    const axis = document.getElementById("axisFilter").value;
    const shape = document.getElementById("shapeFilter").value;

    let filtered = [];
    for (const puzzle of puzzles){
        const matchesSearch = puzzle.name.toLowerCase().includes(search);
        const matchesAxis = axis == "all" || puzzle.axisSystem == axis;
        const matchesShape = shape == "all" || puzzle.shape == shape;

        if (matchesSearch && matchesAxis && matchesShape){
            filtered.push(puzzle);
        }
    }

    renderTable(filtered);
}

function renderTable(data){
    const table = document.getElementById("puzzleTableBody");
    table.innerHTML = ""; // reset table

    for (const puzzle of data){
        const row = document.createElement("tr");

        // create row
        row.innerHTML = `
            <td class="imageComponent">
                <img class="thumbnail" src="${puzzle.image}">
            </td>
        `;

        if (puzzle.link == ""){
            row.innerHTML += `<td class="nameComponent">${puzzle.name}</td>`
        } else {
            row.innerHTML += `<td class="nameComponent"><a href="${puzzle.link}">${puzzle.name}</a></td>`
        }

        row.innerHTML += `
            
            <td class="axisSystemComponent ${puzzle.axisSystem}">${puzzle.axisSystem}</td>
            <td class="shapeComponent ${puzzle.shape}">${puzzle.shape}</td>
            <td class="solvedComponent ${puzzle.solved ? "solved" : "unsolved"}">
                ${puzzle.solved ? "✓" : "✗"}
            </td>
            
        `;

        if (puzzle.solved){
            row.innerHTML += `
                <td class="ratingComponent enjoyment${Math.floor(puzzle.enjoyment)}">${puzzle.enjoyment}</td>
                <td class="ratingComponent difficulty${Math.floor(puzzle.difficulty)}">${puzzle.difficulty}</td>
                `;
        } else {
            row.innerHTML += `
                <td class="ratingComponent enjoymentUnsolved"></td>
                <td class="ratingComponent difficultyUnsolved"></td>
            `;
        }

        table.appendChild(row);
    }
}

document.getElementById("searchBar").addEventListener("input", applyFilters);
document.getElementById("axisFilter").addEventListener("change", applyFilters);
document.getElementById("shapeFilter").addEventListener("change", applyFilters);

console.log("Hi!");
loadJSON();