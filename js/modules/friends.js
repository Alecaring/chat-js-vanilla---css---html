import { createElement } from "../utils/dom.js";

document.addEventListener('DOMContentLoaded', () => {
    const friends = [
        { name: "Mario Bianchi" },
        { name: "Gino Verdi" },
        { name: "Giacomo Rossi" },
        { name: "Frank Sinner" },
        { name: "Luigi Spalletti" },
    ];

    const friendsList = document.getElementById('friends-list');
    const searchInput = document.getElementById('search');

    // mostra la lista degli amici
    function renderFriendList(filteredFriends) {
        friendsList.innerHTML = "";
        filteredFriends.forEach(friend => {
            const friendElement = createElement('li',
                { class: "friend" },
                [friend.name]);
            friendsList.appendChild(friendElement);
        });
    }

    // filtra gli amici in base al nome
    searchInput.addEventListener('input', e => {
        const searchQuery = e.target.value.toLowerCase();
        const filteredFriends = friends.filter(friend =>
            friend.name.toLowerCase().includes(searchQuery)
        );
        // Aggiorna la lista con i risultati filtrati
        renderFriendList(filteredFriends);
    });

    // render iniziale
    renderFriendList(friends);
});
