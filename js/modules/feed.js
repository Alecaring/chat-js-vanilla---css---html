import { createElement } from "../utils/dom.js";

// caricamneto pagina
window.onload = function () {
  document.getElementById('loader').style.display = 'none';
  document.getElementById('appEmail').style.display = 'block';
};

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
  const commentsSection = createCommentsSection(post);
  postElement.appendChild(commentsSection);

  container.appendChild(postElement);
}

/**
 * Crea la sezione dei commenti
 * @param {object} post - I dati del post
 * @returns {HTMLElement} - La sezione commenti completa
 */
function createCommentsSection(post) {
  const commentsContainer = createElement("div", { class: "comments-section" });
  const commentTopContainer = createElement('div', {class: "comment-top-container"}, []);
  const commentsList = createElement("div", { class: "comments-list" });
  const commentsTitle = createElement("h4", {}, ["Commenti"]);

  // Popola inizialmente la lista dei commenti
  post.comments.forEach(comment => {
    commentsList.appendChild(createCommentElement(comment));
    console.log(comment);
    
  });

  // Aggiungi pulsante "Espandi commenti" specifico
  const expandCommentsButton = createElement("button", { class: "expand-comments-button" }, ["Espandi Commenti"]);
  expandCommentsButton.addEventListener("click", () => {
    const isExpanded = commentsList.style.maxHeight === "none";
    commentsList.style.maxHeight = isExpanded ? "150px" : "none"; // Toggle
    expandCommentsButton.textContent = isExpanded ? "Espandi Commenti" : "Comprimi Commenti";
  });

  const commentForm = createCommentForm(post, commentsList);

  commentTopContainer.append(commentsTitle, expandCommentsButton)
  commentsContainer.append(commentTopContainer, commentsList, commentForm);

  return commentsContainer;
}

/**
 * Crea un singolo commento
 * @param {string} comment - Il contenuto del commento
 * @returns {HTMLElement} - L'elemento HTML del commento
 */
function createCommentElement(comment) {
  return createElement("div", { class: "comment" }, [
    createElement('p', {}, [
      createElement('strong',
        {},
        ["Current User -"]
      ),
      ` ${comment}`]),
  ]);
}

/**
 * Crea un modulo per aggiungere un commento
 * @param {object} post - I dati del post
 * @param {HTMLElement} commentsList - La lista dei commenti da aggiornare
 * @returns {HTMLElement} - Il modulo HTML per aggiungere commenti
 */
function createCommentForm(post, commentsList) {
  const textarea = createElement("textarea", {
    placeholder: "Scrivi un commento...",
    class: "comment-input",
  });
  const button = createElement("button", { class: "comment-submit" }, ["Invia"]);

  button.addEventListener("click", () => {
    const commentText = textarea.value.trim();
    if (commentText) {
      post.comments.push(commentText); // Aggiorna i dati del post
      const newComment = createCommentElement(commentText);
      commentsList.appendChild(newComment); // Aggiungi il nuovo commento alla lista
      textarea.value = ""; // Resetta l'input
    }
  });

  return createElement("div", { class: "comment-form" }, [textarea, button]);
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
