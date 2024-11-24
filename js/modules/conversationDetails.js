import { createElement } from "../utils/dom.js";

/**
 * Renderizza i dettagli della conversazione nel contenitore.
 * @param {HTMLElement} container - Il contenitore dove verranno mostrati i dettagli.
 * @param {object} conversation - Dati della conversazione.
 */
export function renderConversationDetails(container, conversation) {
    // Pulire il contenitore
    container.innerHTML = "";

    const containerBodyMessage = createElement(
        'div',
        {class: "container-body-message"},
        [
            
        ]
    );
    container.appendChild(containerBodyMessage);

    // Mostra i messaggi
    conversation.messages.forEach(message => {
        const isUser = message.sender === "You"; // Verifica se il messaggio è dell'utente
        const messageElement = createElement(
            "div",
            { class: `message ${isUser ? "user-message" : "other-message"}` },
            [
                createElement("span", { class: "message-sender" }, [message.sender]),
                createElement("p", { class: "message-content" }, [message.content]),
                createElement("span", { class: "message-time" }, [`${message.time}`]),
            ]
        );
        containerBodyMessage.appendChild(messageElement);
    });

    // Aggiungi una area per inviare nuovi messaggi
    const inputContainer = createElement("div", { class: "input-container" }, []);
    const input = createElement("textarea", {
        placeholder: "Scrivi un messaggio...",
        class: "message-input"
    });
    const button = createElement("button", { class: "send-button" }, ["Invia"]);

    button.addEventListener("click", () => {
        const newMessage = {
            sender: "You",
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            content: input.value,
        };

        if (input.value.trim() === "") return; // Evita messaggi vuoti
        conversation.messages.push(newMessage);

        // Ricarica i dettagli della conversazione
        renderConversationDetails(container, conversation);
    });

    inputContainer.appendChild(input);
    inputContainer.appendChild(button);
    container.appendChild(inputContainer);
}
