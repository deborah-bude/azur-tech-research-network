
import { getMessagesData, getUsersData } from "./dataLoader.js";
import { formatDate } from "./utils.js";

const messageSidebarSection = document.getElementById("messageSidebar")
const conversationSection = document.getElementById("conversation")
const messagesData = await getMessagesData()
const usersData = await getUsersData()
let allConversations = [];

//all conversations in sidebar generate
function sidebarTemplate(message) {
    const {friendId, messages} = message
    const friend = usersData.find((user) => user.id === friendId)
    const lastMessage = messages[messages.length - 1]
    const dateLastMessage = formatDate(lastMessage.timestamp)
    console.log(lastMessage)

    const newConversation = 
    `<li class="contact">
        <div class="contact__info">
            <img src="assets/images/profiles/${friend.profilePicture}" alt="Profil de ${friend.firstName} ${friend.lastName}" class="contact__profile-pic">
            <p class="contact__name">${friend.firstName} ${friend.lastName}</p>
        </div>
        <p class="contact__message-preview">${lastMessage.content}</p>
        <p class="contact__date">${lastMessage.senderId === 0 ? `Envoyé le ${dateLastMessage}` : `Reçu le ${dateLastMessage}`}</p>
    </li>`

    allConversations.push(newConversation)
}

messagesData.map((message) => sidebarTemplate(message))
messageSidebarSection.innerHTML = allConversations.join("");