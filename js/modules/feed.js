import { createElement } from "../utils/dom.js";

document.addEventListener('DOMContentLoaded', () => {
    console.log("Script caricato");
    // caricamento dei files json
    fetch("data/posts.json")
        .then(res => {
            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
            return res.json();
        })
        .then(posts => {
            const feedContainer = document.getElementById("feed-container");
            posts.forEach(post => {
                if (!post.author || !post.content) {
                    console.warn("Post non valido:", post);
                    return;
                }
                // creazione del singolo post
                const postElement = createElement('div',
                    { class: "post" },
                    [
                        createElement('h3', {}, [post.author]),
                        createElement('p', {}, [post.content]),
                        post.image ?
                            createElement('img', { src: post.image, alt: "post image" })
                            : null,
                    ]);
                feedContainer.appendChild(postElement)
            });
        })
        .catch(err => {
            console.error("Errore durante il caricamento dei post:", err);
            // Mostra un messaggio di errore all'utente
            const feedContainer = document.getElementById("feed-container");
            feedContainer.textContent = "Impossibile caricare i post.";
        });
})