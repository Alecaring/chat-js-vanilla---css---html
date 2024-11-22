import { createElement } from "../utils/dom.js";

document.addEventListener("DOMContentLoaded", () => {
  const feedContainer = document.getElementById("feed-container");

  // Carica i post dal file JSON
  fetch("data/posts.json")
    .then(response => response.json())
    .then(posts => {
      posts.forEach(post => renderPost(feedContainer, post));
    });
});

/**
 * Renderizza un post all'interno del feed
 * @param {HTMLElement} container - Il contenitore dove inserire il post
 * @param {object} post - I dati del post
 */
function renderPost(container, post) {
  const postElement = createElement("div", { class: "post" }, [
    createElement("h3", {}, [post.author]),
    createElement("p", {}, [post.content]),
  ]);

  // Aggiungi immagine se presente
  if (post.image) {
    const img = createElement("img", { src: post.image, class: "post-image" });
    postElement.appendChild(img);
  }

  // Crea un canvas per le animazioni
  const canvas = createElement("canvas", { class: "bubbles-canvas" });
  const ctx = canvas.getContext("2d");
  postElement.appendChild(canvas);

  // Aggiungi pulsante "Mi piace"
  const likeButton = createElement("button", { class: "like-button" }, ["❤"]);
  likeButton.classList.add(post.liked ? "liked" : "not-liked");

  likeButton.addEventListener("click", () => {
    post.liked = !post.liked;
    likeButton.classList.toggle("liked");
    likeButton.classList.toggle("not-liked");

    if (post.liked) {
      triggerCanvasAnimation(canvas, ctx);
    }
  });

  const reactionsContainer = createElement("div", { class: "reactions" }, [likeButton]);
  postElement.appendChild(reactionsContainer);

  // Aggiungi sezione commenti
  const commentsSection = createElement("div", { class: "comments" }, [
    createElement("h4", {}, ["Commenti"]),
    ...post.comments.map(comment => createElement("p", {}, [comment])),
    createCommentForm(post),
  ]);
  postElement.appendChild(commentsSection);

  container.appendChild(postElement);
}

/**
 * Crea un modulo per aggiungere un commento
 * @param {object} post - I dati del post
 */
function createCommentForm(post) {
  const textarea = createElement("textarea", {
    placeholder: "Scrivi un commento...",
  });
  const button = createElement("button", {}, ["Invia"]);

  button.addEventListener("click", () => {
    if (textarea.value.trim()) {
      post.comments.push(textarea.value);
      textarea.value = "";
      alert("Commento aggiunto!");
    }
  });

  return createElement("div", {}, [textarea, button]);
}

/**
 * Avvia un'animazione di bolle su un canvas
 * @param {HTMLCanvasElement} canvas - Il canvas dove disegnare
 * @param {CanvasRenderingContext2D} ctx - Il contesto 2D del canvas
 */
function triggerCanvasAnimation(canvas, ctx) {
  let bubbles = generateBubbles(canvas);

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    bubbles.forEach(bubble => {
      bubble.y -= bubble.speedY;
      bubble.x += bubble.speedX;
      bubble.alpha -= 0.01;

      if (bubble.alpha > 0) {
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${bubble.color.r}, ${bubble.color.g}, ${bubble.color.b}, ${bubble.alpha})`;
        ctx.fill();
        ctx.closePath();
      }
    });

    // Rimuovi bolle "morte"
    bubbles = bubbles.filter(b => b.alpha > 0);

    if (bubbles.length > 0) {
      requestAnimationFrame(animate);
    }
  }

  animate();
}

/**
 * Genera bolle per l'animazione
 * @param {HTMLCanvasElement} canvas - Il canvas dove disegnare
 * @returns {Array} - Array di oggetti bolle
 */
function generateBubbles(canvas) {
  const bubbles = [];
  const numBubbles = 15;

  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  for (let i = 0; i < numBubbles; i++) {
    bubbles.push({
      x: canvas.width / 2 + (Math.random() - 0.5) * 100,
      y: canvas.height / 2,
      size: Math.random() * 10 + 5,
      speedY: Math.random() * 2 + 1,
      speedX: (Math.random() - 0.5) * 2,
      alpha: 1,
      color: {
        r: Math.floor(Math.random() * 256),
        g: Math.floor(Math.random() * 256),
        b: Math.floor(Math.random() * 256),
      },
    });
  }

  return bubbles;
}
