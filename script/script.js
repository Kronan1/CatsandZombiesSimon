const game = document.getElementById("game")
const catArray = []
let zombieAmount = 2
let catToAdd = 0
let positionX = 4
let positionY = 0
const fieldSize = 25
let gameArray = []
const character = "&heartsuit;"


const locationArray = [
    '../images/alleystreet.jpg',
    '../images/asianhouse.jpg',
    '../images/belemtower.jpg',
    '../images/coolhouse.jpg',
    '../images/eskilstuna.jpg',
    '../images/graz.jpg',
    '../images/moonlanding.jpg',
    '../images/newyork.jpg',
    '../images/newzealand.jpg',
    '../images/osaka.jpg',
    '../images/slovenia.jpg',
    '../images/stockholm.jpg',
    '../images/tribergwaterfall.jpg',
    '../images/almedalen.jpg',
    '../images/desert.jpg',
    '../images/drottningholm.jpg',
    '../images/forestpath.jpg',
    '../images/gothenburg.jpg',
    '../images/greatwallofchina.jpg',
    '../images/junglepath.jpg',
    '../images/tajmahal.jpg',
    '../images/tivoli.jpg',
    '../images/versailles.jpg',
    '../images/yellowstone.jpg',
    '../images/fuji.jpg'
];





createBoard();


async function createBoard() {
    await catApi()

    positionX = getRandomInt(5)
    positionY = getRandomInt(5)

    addLocationsToBoard()
    addZombiesAndCats()
    drawBoard()

    let index = calculateIndex()
    drawImage("locationImg", gameArray[index].img)

    let test = 0;
}


async function catApi() {
    const url = "https://api.thecatapi.com/v1/images/search?limit=10"
    try{
        const response = await fetch(url)
        const data = await response.json()

        let cats = data
        
        cats.map(function (cat) {
            if (catArray.length < 5) {
                console.log("Adding cat from Api " + cat.url)
                catArray.push(cat.url)
            }
        })
    } catch (error) {
        console.error("Error fetching cat images: ", error)
    }
}


function addLocationsToBoard() {
    let count = fieldSize - gameArray.length
    for (let i = 0; i < count; i++) {
        let currentNumber = getRandomInt(fieldSize)

        while (gameArray.some(obj => obj.position === currentNumber)) {
            currentNumber = getRandomInt(fieldSize)
        }

        const locationToAdd = { position: currentNumber, img: locationArray[i], cat: "", zombie: "" }
        gameArray.push(locationToAdd)
        console.log("Location added: " + locationToAdd)

    }

}


function getRandomInt(max) {
    return Math.floor(Math.random() * max)
}


function addZombiesAndCats() {
    for (let zombie = 0; zombie < zombieAmount; zombie++) {
        let index = indexToAdd()
        gameArray[index].zombie = "../images/zombie.jpg"
        console.log("zombie added: " + gameArray[index].position)
    }

    let index = indexToAdd()
    gameArray[index].cat = catArray[catToAdd]

    if ((catToAdd + 1) <= catArray.length) {
        catToAdd++
        console.log("cat added: " + gameArray[index].position)
    }
}


function indexToAdd() {
    let currentNumber = getRandomInt(fieldSize)

    while (gameArray.some(obj => obj.cat != "" && obj.zombie != "")) {
        currentNumber = getRandomInt(fieldSize)
    }

    return currentNumber
}


function movePlayer(id){
    let oldId = "cell" + positionX.toString() + positionY.toString()

    if (id == "up" && positionY > 0){
        positionY--
    }
    else if (id == "down" && positionY < 4){
        positionY++
    }
    else if (id == "left" && positionX > 0) {
        positionX--
    }
    else if (id == "right" && positionX < 4){
        positionX++
    }
    else{
        return
    }

    // Add logic to move player
    let index = calculateIndex()

    drawImage("locationImg", gameArray[index].img)

    if (hasZombieOrCat("cat")){
        createImg(gameArray[index].cat)
    }
    
    if (hasZombieOrCat("zombie")){
        createImg(gameArray[index].zombie)
    }

    
    let newId = "cell" + positionX.toString() + positionY.toString()

    let oldCell = document.getElementById(oldId)
    oldCell.innerHTML = "0"

    let newCell = document.getElementById(newId)
    newCell.innerHTML = character

    

}


function drawBoard(){
    let tBody = document.createElement("tbody")
    
    for (let row = 0; row < 5; row++) {
        let tRow = document.createElement("tr")

        for (let column = 0; column < 5; column++) {
            let data = document.createElement("td")
            data.setAttribute("class", "cell")

            if (row != positionY || column != positionX) {
                data.innerHTML = "0"
            }
            else{
                data.innerHTML = character
            }

            let cellId = column.toString() + row.toString()
            data.setAttribute("id", "cell" + cellId)
            tRow.appendChild(data)
        }
        tBody.appendChild(tRow)
    }

    let table = document.getElementById("board")
    table.appendChild(tBody)
}


function hasZombieOrCat(catOrZombie){
    let index = calculateIndex()

    if(gameArray[index][catOrZombie] != ""){
        return true
    }
    else{
        return false
    }
}


function drawImage(id, source){
    let image = document.getElementById(id)
    image.setAttribute("src", source)
}


function createImg(url){

    // Not implemented
    let img = document.createElement("img")
    img.setAttribute("src", url)
}


function calculateIndex(){
    let position = positionY * 5 + positionX
    let index = gameArray.findIndex(obj => obj.position === position)

    return index
}