import { createElement } from "../utils/dom.js";

window.onload = function () {
    document.getElementById('loader').style.display = 'none';
    document.getElementById('appEmail').style.display = 'block';
};

document.addEventListener('DOMContentLoaded', () => {
    // Genera nomi casuali e immagini casuali
function generateFriends(num) {
    const firstNames = ["Mario", "Gino", "Giacomo", "Luigi", "Anna", "Francesca", "Elena", "Paolo", "Sofia", "Alessandro"];
    const lastNames = ["Bianchi", "Verdi", "Rossi", "Spalletti", "Moretti", "Ferrari", "Romano", "Esposito", "Marini", "Santoro"];
    const friends = [];

    for (let i = 0; i < num; i++) {
        const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const randomImage = `https://picsum.photos/seed/${i}/100`; // Immagine casuale con seed unico

        friends.push({
            name: `${randomFirstName} ${randomLastName}`,
            image: randomImage
        });
    }

    return friends;
}

// Genera 50 amici
const friends = generateFriends(50);

// Stampa per verifica
console.log(friends);


    const friendsList = document.getElementById('friends-list');
    const searchInput = document.getElementById('search');

    // Funzione per renderizzare la lista di amici
    function renderFriendList(filteredFriends) {
        friendsList.innerHTML = "";
        filteredFriends.forEach(friend => {
            const friendElement = createElement('li',
                { class: "friend" },
                [
                    friend.name,
                    createElement('span', { class: "icon" }, ['➕'])  // Aggiungi un'icona accanto al nome
                ]
            );
            friendsList.appendChild(friendElement);
        });
    }

    // Ascolta l'input di ricerca e filtra gli amici
    searchInput.addEventListener('input', e => {
        const searchQuery = e.target.value.toLowerCase();
        const filteredFriends = friends.filter(friend =>
            friend.name.toLowerCase().includes(searchQuery)
        );
        // Aggiorna la lista con i risultati filtrati
        renderFriendList(filteredFriends);
    });

    // Render iniziale della lista di amici
    renderFriendList(friends);
});
