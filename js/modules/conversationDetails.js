import { createElement } from "../utils/dom.js";

/**
 * renderizza i dettagli della conversazione nel contenitore
 * @param {HTMLElement} container - il contenitore dove verranno mostrati i dettagli
 * @param {object} conversation - dati della conversazione
 */
export function renderConversationDetails(container, conversation) {

    // pulire il contenitore
    container.innerHTML = "";

    // mostra i messaggi
    conversation.messages.forEach(message => {
        const messageElement = createElement("div",
            { class: "message" },
            [
                createElement('span', { class: "sender" }, [message.sender]),
                createElement("span", { class: "time" }, [`(${message.time})`]),
                createElement("p", {}, [message.content]),
            ]);
        container.appendChild(messageElement);
    });

    // aggiungi una area per inviare nuovi messaggi
    const input = createElement("textarea", { placeHolder: "Scrivi un messaggio..." }, []);
    const button = createElement("button", {}, ["invia"]);

    button.addEventListener('click', () => {
        const newMessage = {
            sender: "You",
            time: new Date().toLocaleTimeString(),
            content: input.value
        };

        // aggiungi il nuovo messaggio al json simulato
        conversation.messages.push(newMessage);

        // ricarica i dettagli della conversazione
        renderConversationDetails(container, conversation);

    });

    container.appendChild(input);
    container.appendChild(button);
};