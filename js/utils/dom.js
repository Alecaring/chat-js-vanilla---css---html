/**
 * funzione per cariacare un elemento DOM
 * @param {string} tag - nome del tag HTML
 * @param {object} attributes - attributi dell'elemeto (id, src, ...)
 * @param {Array} children - figli dell'elemento (stringhe o nodi DOM)
 * @return {HTMLElement}
 */
export function createElement(tag, attributes, children) {
    const element = document.createElement(tag);
    for (const key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
    if(children) {
        children.forEach(child => {
            if(typeof child === "string") {
                element.appendChild(document.createTextNode(child));
            } else {
                element.appendChild(child);
            };
        });
    };
    return element;
}