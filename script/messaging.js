import { formatDate } from "./utils.js";
import { getMessagesData, getUsersData, sendMessagesData } from "./dataLoader.js";

const messageSidebarSection = document.getElementById("messageSidebar");
const conversationHeader = document.querySelector("#conversation .conversation__profile");
const conversationSection = document.querySelector("#conversation .conversation__messages");
const formMessage = document.querySelector(".form-message")

class ConversationManager {
  constructor() {
    this.messagesData = [];
    this.usersData = [];
    this.allConversations = [];
    this.messagesConversation = [];
    this.friendUser;
  }

  async loadData() {
    this.messagesData = await getMessagesData();
    this.usersData = await getUsersData();
  }

  generateSidebar() {
    this.messagesData.forEach((message) => this.sidebarTemplate(message));
    messageSidebarSection.innerHTML = this.allConversations.join("");
  }

  sidebarTemplate(message) {
    const { friendId, messages } = message;
    const friend = this.usersData.find((user) => user.id === friendId);
    const lastMessage = messages[messages.length - 1];
    const dateLastMessage = formatDate(lastMessage.timestamp);

    const newConversation = 
    `<li ${message.conversationId === parseInt(conversationId) ? `class="contact active"` : "class='contact'"}>
      <a href="messaging.html?id=${message.conversationId}">
        <div class="contact__info">
          <img src="assets/images/profiles/${friend.profilePicture}" alt="Profil de ${friend.firstName} ${friend.lastName}" class="contact__profile-pic">
          <p class="contact__name">${friend.firstName} ${friend.lastName}</p>
        </div>
        <p class="contact__message-preview">${lastMessage.content}</p>
        <p class="contact__date">${lastMessage.senderId === 0 ? `Envoyé le ${dateLastMessage}` : `Reçu le ${dateLastMessage}`}</p>
      </a>
    </li>`;

    this.allConversations.push(newConversation);
  }

  async generateConversation(conversationId) {
    let conversations = this.messagesData.find((message) => message.conversationId === parseInt(conversationId));

    if (conversations === undefined) {
      conversations = this.messagesData[0];
      conversationId = this.messagesData[0].conversationId;
    }
    
    this.friendUser = this.usersData.find((user) => user.id === conversations.friendId);

    conversationHeader.innerHTML = 
    `<div class="conversation__profile">
        <img src="assets/images/profiles/${this.friendUser.profilePicture}" alt="Profil de ${this.friendUser.firstName} ${this.friendUser.lastName}" class="conversation__profile-pic">
        <p class="conversation__name">${this.friendUser.firstName} ${this.friendUser.lastName}</p>
    </div>`;

    conversations.messages.forEach((message) => this.messageTemplate(message));
    conversationSection.innerHTML = this.messagesConversation.join("");
  }

  messageTemplate(message) {
    const newMessages = 
    `<div class="message ${message.senderId === 0 ? "message--sent" : "message--received"}">
        <div class="conversation__profile">
            <img src="assets/images/profiles/${message.senderId === 0 ? "john.jpeg" : this.friendUser.profilePicture}" alt="Profil de ${message.senderId === 0 ? "John Doe" : `${this.friendUser.firstName} ${this.friendUser.lastName}`}" class="conversation__profile-pic">
            <p class="conversation__name">${message.senderId === 0 ? "John Doe" : `${this.friendUser.firstName} ${this.friendUser.lastName}`}</p>
        </div>
        <p class="message__text">${message.content}</p>
        <p class="message__date">${formatDate(message.timestamp)}</p>
    </div>`;

    this.messagesConversation.push(newMessages);
  }

  async sendMessagesData(conversationId, content) {
    console.log(content)
    const timestamp = new Date();
    const newMessage = await sendMessagesData(conversationId, this.friendUser.id, content, timestamp);
    // this.messageTemplate(newMessage);
    // this.conversationSection.innerHTML = this.messagesConversation.join("");
  }
}

// Usage
const searchParams = new URLSearchParams(window.location.search);
let conversationId = searchParams.get("id");

const conversationManager = new ConversationManager();
await conversationManager.loadData();
conversationManager.generateSidebar();

await conversationManager.generateConversation(conversationId);

// Send a new message
formMessage.addEventListener("submit", (event) => {
  event.preventDefault();
  const messageContent = document.getElementById("messageContent");

  if(!messageContent.value) {
    return;
  }

  conversationManager.sendMessagesData(conversationId, messageContent.value);
})
