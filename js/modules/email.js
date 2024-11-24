import { createElement } from "../utils/dom.js";
import { renderConversationDetails } from "./conversationDetails.js";

window.addEventListener('beforeunload', function() {
    if (webSocket) {
      webSocket.close();  // Chiudi la connessione WebSocket quando la pagina sta per essere abbandonata
    }
  });

window.onload = function () {
    document.getElementById('loader').style.display = 'none';
    document.getElementById('appEmail').style.display = 'block';
};

document.addEventListener('DOMContentLoaded', () => {
    const conversationContainer = document.getElementById('conversation-container');
    const messageDetailsContainer = document.getElementById('message-details-container');


    const whereNothingOnMessage = createElement('div',
        { class: "container-whereNothing" }, [

        createElement('div',
            { class: "container-image" }, [
            createElement('img', { src: "assets/svg/mountain-view.svg" }, []),
            createElement('div',
                { class: "container-dots" },
                [
                    createElement('span', { class: "dot" }, [
                        createElement("img", {src: "../../assets/svg/fingerprint.svg"}, [])
                    ]),
                    createElement('span', { class: "dot" }, [
                        createElement("img", {src: "../../assets/svg/bookmark-check.svg"}, [])
                    ]),
                    createElement('span', { class: "dot" }, [
                        createElement("img", {src: "../../assets/svg/emoji-laughing.svg"}, [])
                    ]),
                ]),
            createElement('div',
                { class: "inner-container-txt" }, [
                createElement('h2', { class: "" }, ["Select & Chat !"]),
            ]),
        ]),

    ]);
    messageDetailsContainer.appendChild(whereNothingOnMessage);

    // Carica le conversazioni dal file JSON
    fetch("data/messages.json")
        .then(res => {
            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
            return res.json();
        })
        .then(conversations => {
            // Mostra la lista delle conversazioni
            conversations.forEach(conversation => {
                if (!conversation.name || !conversation.lastMessage) {
                    console.warn("Conversazione non valida:", conversation);
                    return;
                }

                // Crea l'elemento per ogni conversazione
                const conversationElement = createElement('div',
                    { class: "conversation" },
                    [
                        createElement('img', {
                            src: conversation.avatar || "https://via.placeholder.com/50",
                            alt: `${conversation.name} Avatar`
                        }),
                        createElement('div', {class: "inner-conversation-cell-txt"}, [
                            createElement('h3', {}, [conversation.name]),
                            createElement('p', {}, [conversation.lastMessage]),
                        ])
                    ]
                );

                // Aggiungi un evento di click per caricare i dettagli della conversazione
                conversationElement.addEventListener('click', () => {
                    renderConversationDetails(messageDetailsContainer, conversation);
                });

                // Aggiungi la conversazione alla lista
                conversationContainer.appendChild(conversationElement);
            });
        })
        .catch(err => {
            console.error("Errore durante il caricamento delle conversazioni:", err);
        });
});
