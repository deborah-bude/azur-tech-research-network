import { getPostsData, getUsersData } from "./dataLoader.js";
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
     * Create HTML post with template
     * @param {Object} post - Post Data
     * @param {number} post.id - ID of the post
     * @param {number} post.authorId - ID of the author
     * @param {string} [post.content] - Content of the post (optional)
     * @param {string} [post.image] - Image URL of the post (optional)
     * @param {Object} post.reactions - Reactions data of the post
     * @param {number} post.reactions.like - Number of likes for the post
     * @param {number} post.reactions.dislike - Number of dislikes for the post
     * @param {Array.<Object>} post.comments - Comments on the post
     * @param {number} post.comments[].id - ID of the comment
     * @param {number} post.comments[].authorId - ID of the comment's author
     * @param {string} post.comments[].content - Content of the comment
     * @param {string} post.comments[].timestamp - Timestamp of the comment
     * @param {string} post.timestamp - Timestamp of the post
     */
    postTemplate(post) {
        const {id, authorId, content, image, reactions, comments, timestamp} = post;
        const author = this.usersData.find((user) => user.id === authorId);
        const datePost = formatDate(timestamp);
    
        const allComments = comments.map((comment) => {
            const commentDate = formatDate(comment.timestamp);
            const commentAuthor = this.usersData.find((user) => user.id === comment.authorId);
    
            return(
            `<div class="post__comment">
                <a class="post__comment-user-info" href="#">
                    <img src="assets/images/profiles/${commentAuthor.profilePicture}" alt="Profil de ${commentAuthor.firstName} ${commentAuthor.lastName}" class="post__comment-pic">
                    <p class="post__comment-username">${commentAuthor.firstName} ${commentAuthor.lastName}</p>
                </a>
                <div class="post__comment-content">
                    <p class="post__comment-text">${comment.content}</p>
                    <p class="post__comment-date">Publié le ${commentDate}</p>
                    <button class="button">Répondre</button>
                </div>
            </div>`)
        });
    
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
                    <div class="comment-respond">
                        <label for="comment-postId-${id}">Postez votre commentaire</label>
                        <input id="comment-postId-${id}" type="text" placeholder="Ecrivez votre commentaire" class="comment-respond__input">
                        <button type="submit" class="button">Répondre</button>
                    </div>
                    ${allComments.join("")}
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
}

// Utilisation
const feedManager = new FeedManager();
await feedManager.loadData();