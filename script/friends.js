import { getUsersData } from "./dataLoader.js";
import { formatDate } from "./utils.js";
const friendCard = document.querySelector(".friends__list");

const allFriends = await getUsersData();
let listFriends = [];

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
    const newFriend = sortedFriends.map((friend) => {
        return(
            `<li class="friend__card">
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
        )
    })

    listFriends.push(newFriend);
};

document.getElementById('sort-options').addEventListener('change', (event) => {
    listFriends = [];
    const sortedFriends = sortFriendsBy(event.target.value)
    friendListTemplate(sortedFriends)
    friendCard.innerHTML = listFriends.join("")
});