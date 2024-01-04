import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove, set } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"


const appSettings = {
    databaseURL: "https://we-are-the-champions-ca31d-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const messagesInDB = ref(database, "Message")
const endorsementListEle = document.querySelector(".endorsement-list")
const submitButtonEle = document.querySelector(".button-element")
const largeInputEle = document.querySelector(".input-element-large")
const smallInputEleLeft = document.querySelector("#input-element-small-1")
const smallInputEleRight = document.querySelector("#input-element-small-2")
let endorsementId = 0;
let buttons = document.getElementsByClassName("button-element-2");
let clickedButtons = new Set();

function clearUserFields() {
    largeInputEle.value = ""
    smallInputEleLeft.value = ""
    smallInputEleRight.value = ""
}

 function sendEndorsementToDB() {
    let userInput = `["${largeInputEle.value}", "${smallInputEleLeft.value}", "${smallInputEleRight.value}", ${0}]`  
    set(ref(database, 'Message/' + endorsementId), userInput)
}

    submitButtonEle.addEventListener("click", function() {
        sendEndorsementToDB()    
        clearUserFields()
    })
    
    function updateButtonValue(buttonToModify) {
        let dbKey = buttonToModify.charAt(buttonToModify.length - 1)    
        if(buttonToModify === "button-10") {
            dbKey = 10
        } 
        let largeInputEleValue = document.querySelector(`#content-${dbKey}`).textContent.trim()
        let smallInputEleLeftValue = document.querySelector(`#sender-${dbKey}`).textContent.trim().replace("From", "")
        let smallInputEleRightValue = document.querySelector(`#recepient-${dbKey}`).textContent.trim().replace("To", "")
        let likesValue = parseInt(document.querySelector(`#${buttonToModify}`).textContent)
        let appendedLikesValue = likesValue + 1
        let userInput = `["${largeInputEleValue}", "${smallInputEleLeftValue}", "${smallInputEleRightValue}", ${appendedLikesValue}]`
        set(ref(database, 'Message/' + dbKey), userInput)
    }
    

onValue(messagesInDB, function(snapshot) {
    let itemsArray = Object.entries(snapshot.val())
    endorsementListEle.innerHTML = "";
    endorsementId = itemsArray.length;
    itemsArray.reverse();
    let endorsementElementId = itemsArray.length - 1;
    
    for (let i = 0; i < itemsArray.length; i++) {
        let currentItem = itemsArray[i]
        let currentItemID = currentItem[0]
        let currentItemValue = currentItem[1]
        let storedDatabaseValues = JSON.parse(currentItemValue)
        let newEl = document.createElement("li")
        let newSenderHeadingEl = document.createElement("h4")
        let newContent = document.createTextNode(`
        From ${storedDatabaseValues[1]}
        `);
        newSenderHeadingEl.appendChild(newContent);
        newSenderHeadingEl.id = `sender-${endorsementElementId}`
        let newParagraphEl = document.createElement("p")
        let newContent2 = document.createTextNode(`
        ${storedDatabaseValues[0]}
        `);
        newParagraphEl.appendChild(newContent2)
        newParagraphEl.id = `content-${endorsementElementId}`
        
        let endorsementBottomEl = document.createElement("div")
        let recepientHeadingEl = document.createElement("h4")
        newContent = document.createTextNode(`
        To ${storedDatabaseValues[2]}
        `);
        recepientHeadingEl.appendChild(newContent)
        recepientHeadingEl.id = `recepient-${endorsementElementId}`
        let endorsementLikesEl = document.createElement("button")
        endorsementLikesEl.className = "button-element-2"
        newContent = document.createTextNode(`
        ${storedDatabaseValues[3]}
        `);
        let iconEl = document.createElement("img")
        iconEl.src = "assets/heart-solid.svg"
        endorsementLikesEl.appendChild(iconEl)
        endorsementLikesEl.appendChild(newContent)
        endorsementLikesEl.id = `button-${endorsementElementId}`
        endorsementBottomEl.append(recepientHeadingEl)
        endorsementBottomEl.append(endorsementLikesEl)
        newEl.append(newSenderHeadingEl)
        newEl.append(newParagraphEl)
        newEl.append(endorsementBottomEl)
        endorsementListEle.append(newEl)
        let valuePassed = endorsementElementId 
        endorsementLikesEl.addEventListener("click", function() {
            if (!clickedButtons.has(`button-${valuePassed}`)) {
                updateButtonValue(`button-${valuePassed}`)
                clickedButtons.add(`button-${valuePassed}`);
            } else {
                alert("You've already liked this")
            }
        });  
        endorsementElementId--;
    }
})
