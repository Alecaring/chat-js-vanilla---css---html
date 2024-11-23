import { createElement } from "../utils/dom.js";

window.addEventListener('pageshow', function(event) {
  if (event.persisted) {
    // Se la pagina è stata ripristinata dalla cache
    if (!webSocket || webSocket.readyState !== WebSocket.OPEN) {
      // Riapri la connessione WebSocket
      openWebSocketConnection();
    }
  }
});

// Caricamento pagina
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
    createElement("h2", {}, [post.author]),
    createElement("p", {}, [post.content]),
  ]);

  const containerCanvasImg = createElement('div', { class: "container-canvas-img" }, []);
  postElement.appendChild(containerCanvasImg);

  // Aggiungi immagine se presente
  if (post.image) {
    const img = createElement("img", {
      src: post.image,
      class: "post-image",
      alt: `author:${post.author}, content:${post.content}`,
    });
    containerCanvasImg.appendChild(img);
  }

  // Crea un canvas per le animazioni
  const canvas = createElement("canvas", { class: "bubbles-canvas" });
  const ctx = canvas.getContext("2d");
  containerCanvasImg.appendChild(canvas);

  // Aggiungi pulsante "Mi piace"
  const likeButton = createElement("button", {
    class: "like-button",
    id: "like-button",
    "aria-label": "Submit your like for post"
  }, ["❤"]);
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
  const commentTopContainer = createElement('div', { class: "comment-top-container" }, []);
  const commentsList = createElement("div", { class: "comments-list" });
  const commentsTitle = createElement("h4", {}, ["Commenti"]);

  // Popola inizialmente la lista dei commenti
  post.comments.length > 0 ?
    (
      post.comments.forEach(comment => {
        commentsList.appendChild(createCommentElement(comment));
      })
    ) : (
      commentsList.appendChild(
        createElement('div', { class: "comment-empty" }, ["Ancora nessun Commento"])
      )
    );

  const emptyComment = commentsList.querySelector(".comment-empty");

  // Aggiungi pulsante "Espandi commenti"
  const expandCommentsButton = createElement("button", {
    class: "expand-comments-button",
    id: "toggle-expand-comment",
    "aria-label": "Toggle expand to read comments"
  }, ["Espandi Commenti"]);

  if (emptyComment) {
    expandCommentsButton.style.opacity = "0";
  } else {
    expandCommentsButton.style.opacity = "1";
  }

  expandCommentsButton.addEventListener("click", () => {
    const isExpanded = commentsList.style.maxHeight === "none";
    commentsList.style.maxHeight = isExpanded ? "150px" : "none"; // Toggle
    expandCommentsButton.textContent = isExpanded ? "Espandi Commenti" : "Comprimi Commenti";
  });

  commentTopContainer.append(commentsTitle, expandCommentsButton);

  const commentForm = createCommentForm(post, commentsList, expandCommentsButton);

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
      createElement('strong', {}, ["Current User -"]),
      ` ${comment}`
    ]),
  ]);
}

/**
 * Crea un modulo per aggiungere un commento
 * @param {object} post - I dati del post
 * @param {HTMLElement} commentsList - La lista dei commenti da aggiornare
 * @param {HTMLElement} expandCommentsButton - Pulsante per espandere i commenti
 * @returns {HTMLElement} - Il modulo HTML per aggiungere commenti
 */
function createCommentForm(post, commentsList, expandCommentsButton) {
  const textarea = createElement("textarea", {
    placeholder: "Scrivi un commento...",
    class: "comment-input",
    id: "textarea-comment",
    "aria-labelledby": "comment-label",
    "aria-required": "true"
  });

  const emptyComment = commentsList.querySelector(".comment-empty");

  const button = createElement("button", {
    class: "submit-button",
    id: "submit-comment",
    "aria-label": "Submit your comment"
  }, ["Invia"]);

  button.addEventListener("click", () => {
    const commentText = textarea.value.trim();

    if (emptyComment && commentText) {
      expandCommentsButton.style.opacity = "1";
      emptyComment.remove();
    }

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
        ctx.arc(bubble