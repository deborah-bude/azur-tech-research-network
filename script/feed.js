import { getPostsData, getUsersData, postCommentPostData } from "./dataAPI.js";
import { formatDate } from "./utils.js";

const feedSection = document.getElementById("feed");
const popupSection = document.getElementById("popup");
const popupImage = document.querySelector('.popup__image');
const popupClose = document.querySelector('.popup__close');

/**
 * Manage Posts Feed
 */
class FeedManager {
    constructor() {
        this.postsData = [];
        this.usersData = [];
        this.allPosts = [];
    }

    /**
     * Charge les données des posts et des utilisateurs, puis génère le fil d'actualités.
     */
    async loadData() {
        this.postsData = await getPostsData();
        this.usersData = await getUsersData();

        this.postsData.map((post) => this.postTemplate(post));
        feedSection.innerHTML = this.allPosts.join("");
        this.initParticleAnimations();
        this.initPopupImageView();
    }

    /**
     * @typedef {Object} Reaction
     * @property {number} like - Number of likes for the post.
     * @property {number} dislike - Number of dislikes for the post.
     */

    /**
     * @typedef {Object} Comment
     * @property {number} id - ID of the comment.
     * @property {number} authorId - ID of the comment's author.
     * @property {string} content - Content of the comment.
     * @property {string} timestamp - ISO 8601 date string indicating when the comment was created.
     */

    /**
     * @typedef {Object} Post
     * @property {number} id - ID of the post.
     * @property {number} authorId - ID of the author of the post.
     * @property {string} [content] - Content of the post (optional).
     * @property {string} [image] - Image URL of the post (optional).
     * @property {Reaction} reactions - Reactions data of the post.
     * @property {Comment[]} comments - Array of comments on the post.
     * @property {string} timestamp - ISO 8601 date string indicating when the post was created.
     */

    /**
     * Create HTML post with template.
     * 
     * @param {Post} post - Data object containing post information.
     * @returns {string} - The generated HTML string for the post.
     */
    postTemplate(post) {
        const {id, authorId, content, image, reactions, comments, timestamp} = post;
        const author = this.usersData.find((user) => user.id === authorId);
        const datePost = formatDate(timestamp);
    

        /**
         * @typedef {Object} Comment
         * @property {number} id - Unique identifier for the comment.
         * @property {number} authorId - ID of the user who wrote the comment (used to find user details).
         * @property {string} content - The comment's text content.
         * @property {string} timestamp - ISO 8601 date string for when the comment was created.
         * @property {number} depth - The nesting level of the comment (1 for top-level comments, up to 3).
         * @property {Comment[]} [replies] - (Optional) Nested array of replies, each following the same structure.
         */

        /**
         * Recursively generates HTML for a list of comments and their replies.
         * Each comment can include replies, which are also processed recursively.
         * 
         * @param {Comment[]} comments - Array of comment objects to process.
         * @returns {string} - The generated HTML string for the comments, including nested replies.
         */
        const generateCommentsHTML = (comments) => {
            return comments.map((comment) => {
                const commentDate = formatDate(comment.timestamp);
                const commentAuthor = this.usersData.find((user) => user.id === comment.authorId);
                const repliesHTML = comment.replies ? generateCommentsHTML(comment.replies) : "";
                const showReplyForm = comment.depth < 3;

                // Generate and return the HTML structure for a single comment
                return(
                `<li class="post__comment">
                    <a class="post__comment-user-info" href="#">
                        <img src="assets/images/profiles/${commentAuthor.profilePicture}" alt="Profil de ${commentAuthor.firstName} ${commentAuthor.lastName}" class="post__comment-pic">
                        <p class="post__comment-username">${commentAuthor.firstName} ${commentAuthor.lastName}</p>
                    </a>
                    <div class="post__comment-content">
                        <p class="post__comment-text">${comment.content}</p>
                        <p class="post__comment-date">Publié le ${commentDate}</p>
                    </div>
                        ${showReplyForm ?
                            `<form class="comment-respond" data-post-id="${id}" data-parent-id="${comment.id}" data-depth="${comment.depth}">
                                <div class="comment-respond__input-box">
                                    <label for="comment-postId-${id}_${comment.id}"">Répondez au commentaire</label>
                                    <input id="comment-postId-${id}_${comment.id}"" type="text" placeholder="Ecrivez votre commentaire" class="comment-respond__input">
                                </div>
                                <button type="submit" class="button">Répondre</button>
                            </form>`
                            : ""
                        }
                        <ul class="post__replies depth-${comment.depth}">${repliesHTML}</ul>
                </li>`)
            }).join("");
        }

        // Generate post comments
        const allCommentsHTML = generateCommentsHTML(comments);
    
        const newPost = 
        `<article class="post">
            <div class="post__header">
                <a class="post__user-info" href="#">
                    <img src="assets/images/profiles/${author.profilePicture}" alt="Profil de ${author.firstname} ${author.lastname}" class="post__profile-pic">
                    <p class="post__username">${author.firstName} ${author.lastName}</p>
                </a>
                <p class="post__date">Publié le ${datePost}</p>
            </div>
            ${content ? `<p class="post__content">${content}</p>` : ""}
            ${image ? `<img src="assets/images/posts/${image}" alt="Image de ${image} posté par ${author.firstName} ${author.lastName}" class="post__image">` : ""}
            <section class="post__footer">
                <div class="post__reactions">
                    <button class="post__reaction">
                        <img class="post__icon post__icon--share" src="./assets/icons/share.svg" alt="Partager">
                        <span class="particles"></span>
                    </button>
                    <div>
                        <button class="post__reaction">
                            <img class="post__icon post__icon--like" src="./assets/icons/like.svg" alt="Like">
                            <span class="particles"></span>
                        </button>
                        <p>${reactions.like}</p>
                    </div>
                    <div>
                        <button class="post__reaction">
                            <img class="post__icon post__icon--dislike" src="./assets/icons/dislike.svg" alt="Dislike">
                            <span class="particles"></span>
                        </button>
                        <p>${reactions.dislike}</p>
                    </div>
                </div>
                <div class="post__comments-section">
                    <h3 class="post__comments-title">Commentaires</h3>
                    <form class="comment-respond" data-post-id="${id}">
                        <div class="comment-respond__input-box">
                            <label for="comment-postId-${id}">Postez votre commentaire</label>
                            <input id="comment-postId-${id}" type="text" placeholder="Ecrivez votre commentaire" class="comment-respond__input">
                        </div>
                        <button type="submit" class="button">Répondre</button>
                    </form>
                    <ul>
                        ${allCommentsHTML}
                    </ul>
                </div>
            </section>
        </article>`;
    
        this.allPosts.push(newPost);
    }

    /**
     * Initialize particles animation.
     */
    initParticleAnimations() {
        document.querySelectorAll(".post__reaction").forEach((reactionButton) => {
            reactionButton.addEventListener("click", this.particleAnimation.bind(this));
        });
    }

    /**
     * Initialize popup image
     */
    initPopupImageView() {
        document.querySelectorAll(".post__image").forEach((image) => {
          image.addEventListener("click", this.popupImgOpen.bind(this));
        });
    
        popupSection.addEventListener('click', (event) => {
          if (event.target === popupSection || event.target === popupClose) {
            popupSection.classList.remove('active');
            popupImage.src = "";
          }
        });
    }

    /**
     * Created particles animation with click event on the buttons
     * @param {Event} event - Click event on reactions buttons
     */
    particleAnimation(event) {
        const btn = event.currentTarget;
        const particleContainer = btn.querySelector(".particles");

        // Particles creations
        for (let i = 0; i < 10; i++) {
            const particle = document.createElement("div");
            particle.classList.add("particle");
            
            particle.style.setProperty('--offset-x', `${Math.random() * 100 - 50}px`);
            particle.style.setProperty('--offset-y', `${Math.random() * 100 - 50}px`);  

            particleContainer.appendChild(particle);

            // Delete particle at the end of animation
            particle.addEventListener("animationend", () => {
                particle.remove();
            });
        }
    }
    
    /**
     * Open popup image with click event
     * @param {Event} event - Click event on image
     */
    popupImgOpen(event) {
        popup.classList.add('active');
        popupImage.src = event.currentTarget.src;
    }

    /**
     * Sends a new message to the server and updates the conversation view.
     * @async
     * @param {string} content - Content of the message to send.
     */
    async sendCommentData(postId, parentId, depth, content) {
        // console.log(depth)
        const newDepthComment = parentId ? parseInt(depth) + 1 : 1
        try {
        const timestamp = new Date().toISOString();
        const newComment = await postCommentPostData(
            parseInt(postId),
            content, 
            timestamp,
            parseInt(parentId),
            newDepthComment,
        );
        this.allPosts = [];
        const newCommentPostId = this.postsData.findIndex((post) => post.id === newComment.id)
        this.postsData[newCommentPostId] = newComment
        this.postsData.map((post) => this.postTemplate(post));
        feedSection.innerHTML = this.allPosts.join("");
        } catch (error) {
        console.error("Erreur lors de l'envoi du message:", error);
        }
    }
}

// Utilisation
const feedManager = new FeedManager();
await feedManager.loadData();


const formMessages = document.querySelectorAll(".comment-respond")
// Post a new comment
formMessages.forEach(form => {
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const messageContent = event.currentTarget.querySelector(".comment-respond__input");
        const postId = event.currentTarget.dataset.postId;
        const parentId = event.currentTarget.dataset.parentId;
        const depth = event.currentTarget.dataset.depth;

        if(!messageContent.value || postId === NaN || depth >= 3) {
            return;
        }
        
        console.log(depth)
        feedManager.sendCommentData(postId, parentId, depth, messageContent.value);
    })
});