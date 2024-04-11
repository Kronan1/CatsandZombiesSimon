const game = document.getElementById("game")
const catArray = []
let zombieAmount = 2
let catToAdd = 0
let positionX = 4
let positionY = 0
const fieldSize = 25
let gameArray = []
let health = 3
const character = "&heartsuit;"
let level = 0
let catFound = false
let zombieFound = false


const locationArray = [
    { url: './images/alleystreet.jpg', description: 'You find yourself in a picturesque alley, where every corner holds a story.' },
    { url: './images/asianhouse.jpg', description: "You're intrigued by the mystery of the old house, its weathered facade whispering tales of the past." },
    { url: './images/belemtower.jpg', description: "You're entranced by the timeless beauty of Belém Tower, standing proudly against the horizon." },
    { url: './images/coolhouse.jpg', description: "You're intrigued by the charm of the old house with the blue door, wondering about its stories." },
    { url: './images/eskilstuna.jpg', description: "You're in front of Eskilstuna City Hall, conveniently close to school" },
    { url: './images/graz.jpg', description: "You find yourself in the quaint courtyard of an old house, surrounded by history." },
    { url: './images/moonlanding.jpg', description: "You find yourself on the moon, surrounded by the vastness of space." },
    { url: './images/newyork.jpg', description: 'You stand in awe as the Manhattan Bridge looms above you, a symbol of urban majesty' },
    { url: './images/newzealand.jpg', description: 'A peculiar little house triggers a sense of déjà vu.' },
    { url: './images/osaka.jpg', description: "You're navigating through a narrow alleyway, surrounded by secrets waiting to be discovered." },
    { url: './images/slovenia.jpg', description: "You're standing at the harbor, where the scent of the sea fills the air." },
    { url: './images/stockholm.jpg', description: "You find yourself in the vibrant atmosphere of the blue subway station, surrounded by the hustle and bustle of the city." },
    { url: './images/tribergwaterfall.jpg', description: "You're enchanted by the tranquility of the small waterfall, its gentle cascade a soothing melody." },
    { url: './images/almedalen.jpg', description: "You're exploring the peaceful ambiance of Almedalen, enjoying its serene surroundings" },
    { url: './images/desert.jpg', description: "You're wandering through the vast desert expanse, surrounded by endless sands." },
    { url: './images/drottningholm.jpg', description: "You feel like royalty as you stroll through Drottningholm's majestic gardens" },
    { url: './images/forestpath.jpg', description: 'The sun shines brightly through the trees along the forest path.' },
    { url: './images/gothenburg.jpg', description: "Quick, move out of the way! You're blocking the pram's path!" },
    { url: './images/greatwallofchina.jpg', description: 'The Great Wall of China sprawls out before you, a breathtaking sight.' },
    { url: './images/junglepath.jpg', description: 'The jungle path appears almost enchanted, beckoning you forward with mystery.' },
    { url: './images/tajmahal.jpg', description: "You're captivated by the grandeur of the Taj Mahal, lost in its beauty." },
    { url: './images/tivoli.jpg', description: "You're swept away by the magic of Tivoli, immersed in its enchanting atmosphere." },
    { url: './images/versailles.jpg', description: "You're awestruck by the elegance of the walkways in Versailles, feeling like royalty as you stroll." },
    { url: './images/yellowstone.jpg', description: "You're spellbound by the spectacle of the Yellowstone geyser, marveling at its raw power" },
    { url: './images/fuji.jpg', description: "You're mesmerized by the majestic presence of Mount Fuji, feeling its grandeur towering above you" }
];


init()


async function init(){
    await catApi()

    addLocationsToBoard()
    createBoard()
}


function createBoard() {
    addZombiesAndCats()
    const index1 = indexToAdd(fieldSize)
    const pos = gameArray[index1].position
    positionX = pos % 5
    positionY = Math.floor(pos / 5)

    drawBoard()

    let index2 = calculateIndex(positionY, positionX)
    drawImage("locationImg", gameArray[index2].img)
    updateDescription(gameArray[index2].description)
    updateHealth()
    catFound = false
    zombieFound = false
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

        const locationToAdd = 
        { 
            position: currentNumber, 
            img: locationArray[i].url, 
            description: locationArray[i].description, 
            cat: "", 
            zombie: "" 
        }
        gameArray.push(locationToAdd)

    }

}


function getRandomInt(max) {
    return Math.floor(Math.random() * max)
}


function addZombiesAndCats() {
    gameArray.forEach(element => {
        if (element.cat != "") {
            element.cat == ""
        }
        if (element.zombie != "") {
            element.zombie == ""
        }
    });

    for (let zombie = 0; zombie < zombieAmount; zombie++) {
        let index = indexToAdd()
        gameArray[index].zombie = "./images/zombie2.png"
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

    let currentNumber
    let found = false;

    while (!found) {
        currentNumber = getRandomInt(fieldSize)
        const randomLocation = gameArray[currentNumber];
        if (randomLocation.zombie === "" && randomLocation.cat === "") {
            break
        }
    }
    return currentNumber
}


function movePlayer(id){
    let oldId = "cell" + positionX.toString() + positionY.toString()

    if(catFound){
        

        zombieAmount++
        health++

        document.getElementById("board").innerHTML = ""
        document.getElementById("catOrZombieImg").style.visibility = "hidden"
        
        createBoard();
        return
    }

    if(zombieFound){
        document.getElementById("catOrZombieImg").style.visibility = "hidden"
    }

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

    let index = calculateIndex()

    updateDescription(gameArray[index].description)

    drawImage("locationImg", gameArray[index].img)

    
    let newId = "cell" + positionX.toString() + positionY.toString()

    let oldCell = document.getElementById(oldId)
    oldCell.innerHTML = "0"

    let newCell = document.getElementById(newId)
    newCell.innerHTML = character

    let image = document.getElementById("catOrZombieImg")
    if (hasZombieOrCat("cat")){
        drawImage("catOrZombieImg", gameArray[index].cat)
        image.style.visibility = "visible"
        document.getElementById("description").innerHTML = "You found the Cat! Press any button to continue"
        catFoundFunc()
    }
    
    if (hasZombieOrCat("zombie")){
        drawImage("catOrZombieImg", gameArray[index].zombie)
        image.style.visibility = "visible"
        zombieFoundFunc()
    }

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


function calculateIndex(){
    let position = positionY * 5 + positionX
    let index = gameArray.findIndex(obj => obj.position === position)

    return index
}


function updateDescription(description){
    document.getElementById("description").innerHTML = description
}


function updateHealth(){
    let lives = ""
    for (let i = 0; i < health; i++) {
        lives += "&#10084;"
    }

    document.getElementById("life").innerHTML = lives
}


function catFoundFunc(){
    level++

    if (level === 3){
        const game = document.getElementById("game")
        game.innerHTML = ""
        document.getElementById("description").innerHTML = "You won!"
    }

    catFound = true
}


function zombieFoundFunc(){
    zombieFound = true
    health--

    if (health === 0){
        death()
    }

    updateHealth()
}

function death(){
    
    const game = document.getElementById("game")
    game.innerHTML = ""
    document.getElementById("description").innerHTML = "You died"
    
}
