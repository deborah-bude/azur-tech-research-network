import { getUsersData } from "./dataLoader.js";
import { formatDate } from "./utils.js";
const friendList = document.querySelector(".friends__list");
const sortFilterOption = document.getElementById('sort-options')

const allFriends = await getUsersData();

/* Drag and Drop */
function initDrapAndDrop() {
    const friendCard = document.querySelectorAll(".friend__card");
    let draggedItem;
    let dragStartClientY;


    /** @type {HTMLAnchorElement[]} */
    friendCard.forEach(card => {
        card.addEventListener("dragstart", (event)=> {
            draggedItem = card;
            event.dataTransfer.effectAllowed = "move"
            event.target.classList.add("dragging");
            dragStartClientY = event.clientY;
        })

        card.addEventListener("dragend", ()=> {
            draggedItem = null;
            event.target.classList.remove("dragging");
        })

        card.addEventListener("dragover", (event) => {
            event.preventDefault();
            const box = card.getBoundingClientRect();
            const offsetY = event.clientY - box.top - box.height / 2;
            
            if (card !== draggedItem) {
                if (offsetY < 0) {
                    card.parentNode.insertBefore(draggedItem, card);
                } else {
                    card.parentNode.insertBefore(draggedItem, card.nextSibling);
                }
            }
        })
    });
}

initDrapAndDrop(); 

/* Filter friend by firstName or lastName */
function sortFriendsBy(property) {
    if(property === "none") {
        return [...allFriends];
    };

    return [...allFriends].sort(sortBy(property));

    function sortBy(property) {
        return function (person1, person2) {
            if (person1[property] > person2[property]) {
                return 1;
            }
            if (person1[property] < person2[property]) {
                return -1;
            }
            return 0;
        };
    }
};

function friendListTemplate(sortedFriends) {
    return sortedFriends.map((friend) => 
        `<li class="friend__card" draggable="true">
            <img class="friend__move-icon" src="./assets/icons/drag-drop.svg" alt="Déplacer">
            <div class="friend__info">
                <div class="friend__profile">
                    <img src="assets/images/profiles/${friend.profilePicture}" alt="Profil de Alice" class="friend__profile-pic">
                    <p class="friend__profile-name">${friend.firstName} ${friend.lastName}</p>
                </div>
                <span class="friends__last-seen">Dernière connexion : il y a ${formatDate(friend.lastConnexion)}</span>
            </div>
            <a href="./messaging.html?id=${friend.conversationId}" class="friend__message"><img src="assets/icons/send.svg" alt="Envoyer un message"></a>
        </li>`
    ).join(''); // Joindre les éléments sans espace entre eux
}

sortFilterOption.addEventListener('change', (event) => {
    const sortedFriends = sortFriendsBy(event.target.value);
    friendList.innerHTML = friendListTemplate(sortedFriends);
    initDrapAndDrop(); 
});