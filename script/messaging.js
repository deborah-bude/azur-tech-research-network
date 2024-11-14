import { formatDate } from "./utils.js";
import { getMessagesData, getUsersData, postMessagesData } from "./dataLoader.js";

const messageSidebarSection = document.getElementById("messageSidebar");
const conversationHeader = document.querySelector("#conversation .conversation__profile");
const conversationSection = document.querySelector("#conversation .conversation__messages");
const formMessage = document.querySelector(".form-message")

/**
 * Manages the conversation data and UI interactions.
 */
class ConversationManager {
  constructor() {
    this.messagesData = [];
    this.usersData = [];
    this.allConversations = [];
    this.messagesConversation = [];
    this.friendUser;
  }

  /**
   * Loads data for messages and users from the server.
   * @async
   */
  async loadData() {
    this.messagesData = await getMessagesData();
    this.usersData = await getUsersData();
  }

  /**
   * Generates the sidebar with a list of all conversations.
   */
  generateSidebar() {
    this.messagesData.forEach((message) => this.sidebarTemplate(message));
    messageSidebarSection.innerHTML = this.allConversations.join("");
  }

  /**
   * Generates the HTML template for each conversation in the sidebar and adds it to the conversations array.
   * @param {Object} message - The message data object containing conversation details.
   * @param {number} message.senderId - ID of the message
   * @param {string} message.content - Content of the comment
   * @param {string} message.timestamp - Date of the message
   */
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

  /**
   * Generates the conversation content for a given conversation ID.
   * @async
   * @param {number} conversationId - ID of the conversation to display.
   */
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

  /**
   * Generates the HTML template for each message and adds it to the messagesConversation array.
   * @param {Object} message - The message object containing message details.
   * @param {number} message.senderId - ID of the message
   * @param {string} message.content - Content of the comment
   * @param {string} message.timestamp - Date of the message
   */
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

  /**
   * Sends a new message to the server and updates the conversation view.
   * @async
   * @param {number} conversationId - ID of the conversation where the message will be sent.
   * @param {string} content - Content of the message to send.
   */
  async sendMessagesData(conversationId, content) {
    try {
      const timestamp = new Date();
      const newConversation = await postMessagesData(conversationId, this.friendUser.id, content, timestamp);
      
      // Update the UI with the new conversation
      this.messagesConversation = []; // Reset the message array
      newConversation.messages.forEach(message => this.messageTemplate(message));
      conversationSection.innerHTML = this.messagesConversation.join("");
      
      // Clear the message input field
      document.getElementById("messageContent").value = "";
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
    }
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
