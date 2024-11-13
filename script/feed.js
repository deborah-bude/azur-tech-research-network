import { getPostsData, getUsersData } from "./dataLoader.js";
import { formatDate } from "./utils.js";

const feedSection = document.getElementById("feed")
const postsData = await getPostsData()
const usersData = await getUsersData()
let allPosts = [];

//Post generate
function postTemplate(post) {
    const {authorId, content, image, reactions, comments, timestamp} = post
    const author = usersData.find((user) => user.id === authorId)
    const datePost = formatDate(timestamp)

    const allComments = comments.map((comment) => {
        const commentDate = formatDate(comment.timestamp)
        const commentAuthor = usersData.find((user) => user.id === comment.authorId)

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
    }) 

    const newPost = 
    `<article class="post">
        <div class="post__header">
            <a class="post__user-info" href="#">
                <img src="assets/images/profiles/${author.profilePicture}" alt="Profil de ${author.firstname} ${author.lastname}" class="post__profile-pic">
                <p class="post__username">${author.firstName} ${author.lastName}</p>
            </a>
            <p class="post__date">Publié le ${datePost}</p>
        </div>
        <p class="post__content">${content}</p>
        <img src="assets/images/posts/${image}" alt="Post Image" class="post__image">
        <section class="post__footer">
            <div class="post__reactions">
                <button class="post__reaction">
                    <img class="post__icon post__icon--share" src="./assets/icons/share.svg" alt="Partager">
                    <div class="particles"></div>
                </button>
                <div>
                    <button class="post__reaction">
                        <img class="post__icon post__icon--like" src="./assets/icons/like.svg" alt="Like">
                        <div class="particles"></div>
                    </button>
                    <p>${reactions.like}</p>
                </div>
                <div>
                    <button class="post__reaction">
                        <img class="post__icon post__icon--dislike" src="./assets/icons/dislike.svg" alt="Dislike">
                        <div class="particles"></div>
                    </button>
                    <p>${reactions.dislike}</p>
                </div>
            </div>
            <div class="post__comments-section">
                <h3 class="post__comments-title">Commentaires</h3>
                <div class="comment-respond">
                    <label for="comment">Postez votre commentaire</label>
                    <input id="comment" type="text" placeholder="Ecrivez votre commentaire" class="comment-respond__input">
                    <button type="submit" class="button">Répondre</button>
                </div>
                ${allComments.join("")}
            </div>
        </section>
    </article>`

    allPosts.push(newPost)
}

postsData.map((post) => postTemplate(post))
feedSection.innerHTML = allPosts.join("");

//Particule animations
function particuleAnimation(event) {
    const btn = event.currentTarget;
    const particleContainer = btn.querySelector(".particles");

    // // Création particules
    for (let i = 0; i < 10; i++) {
        const particle = document.createElement("div");
        particle.classList.add("particle");
        
        particle.style.setProperty('--offset-x', `${Math.random() * 100 - 50}px`);
        particle.style.setProperty('--offset-y', `${Math.random() * 100 - 50}px`);  

        particleContainer.appendChild(particle);

        // Delete particule at the end of animation
        particle.addEventListener("animationend", () => {
            particle.remove();
        });
    }
    
    console.log(btn.querySelector(".particles"))
}

document.querySelectorAll(".post__reaction").forEach((reactionButton) => {
    reactionButton.addEventListener("click", particuleAnimation);
});