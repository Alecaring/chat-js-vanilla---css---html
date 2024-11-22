import { createElement } from "../utils/dom.js";
import { renderConversationDetails } from "./conversationDetails.js";

document.addEventListener('DOMContentLoaded', () => {
    const conversationContainer = document.getElementById('conversation-container');
    const messageDetailsContainer = document.getElementById('message-details-container');

    // carica le conversazioni dal file json
    fetch("data/messages.json")
    .then(res => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
    })
    .then(conversations => {
        
        //  mostra la lista delle conversazioni
        conversations.forEach(conversation => {
            if (!conversation.name || !conversation.lastMessage) {
                console.warn("conversation non valido:", conversation);
                return;
            }
            const conversationElement = createElement('div', 
                {class: "conversation"},
                [
                    createElement('h3', {}, [conversation.name]),
                    createElement('p', {}, [conversation.lastMessage]),
                ]);
                // aggiungi un evento di ascolto per caricare i dettagli della conversazione
                conversationElement.addEventListener('click', () => {
                    renderConversationDetails(messageDetailsContainer, conversation);
                });

                conversationContainer.appendChild(conversationElement);
        });
    });

   
});