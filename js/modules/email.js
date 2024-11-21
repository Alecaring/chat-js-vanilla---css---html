import { createElement } from "../utils/dom.js";
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
                    loadConversationDetails(conversation);
                });

                conversationContainer.appendChild(conversationElement);
        });
    });

    /**
     * carica i detagli di una conversazione
     * @param {object} conversation - dati della conversazione
     */
    function loadConversationDetails(conversation) {
        // pulire il contenitore dei dettagli
        messageDetailsContainer.innerHTML = "";

        // mostra i messaggi
        conversation.messages.forEach(message => {
            const messageElement = createElement('div', 
                {class: 'message'}, [
                    createElement('span', {class: "sender"}, [message.sender]),
                    createElement('span', {class: "time"}, [`(${message.time})`]),
                    createElement('p', {}, [message.content]),
            ]);
            messageDetailsContainer.appendChild(messageElement);
        });

        // aggiungi una area per inviare nuovi messaggi
        const input = createElement("textarea", {placeholder: "scrivi un messaggio..."});
        const button = createElement("button", {}, ["invia"]);
        button.addEventListener('click', () => {
            const newMessage = {
                sender: "You",
                time: new Date().toLocaleTimeString(),
                content: input.value
            };

            // aggiungi il nuovo messaggio al json simulato
            conversation.messages.push(newMessage);

            // ricerca i dettagli della conversazione
            loadConversationDetails(conversation);
        });

        messageDetailsContainer.appendChild(input);
        messageDetailsContainer.appendChild(button);
    }
});