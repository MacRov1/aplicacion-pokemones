// Selección de elementos del DOM
const pokemonList = document.getElementById('pokemon-list');
const pokemonDetails = document.getElementById('pokemon-details');
const closeModal = document.getElementsByClassName('close')[0];
const searchInput = document.getElementById('search');

// Función para obtener la lista de Pokemones
function fetchPokemonList() {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=10')
        .then(response => response.json())
        .then(data => {
            // Por cada Pokémon, obtenemos sus detalles
            data.results.forEach(pokemon => {
                fetchPokemonDetails(pokemon.url);
            });
        })
        .catch(error => console.error('Error al obtener la lista de Pokemones:', error));
}

// Llamamos a la función al cargar la página
fetchPokemonList();

// Función para obtener detalles de un Pokémon
function fetchPokemonDetails(url) {
    fetch(url)
        .then(response => response.json())
        .then(pokemon => {
            // Creamos la tarjeta del Pokémon
            createPokemonCard(pokemon);
        })
        .catch(error => console.error('Error al obtener detalles del Pokémon:', error));
}

// Función para crear la tarjeta de un Pokémon
function createPokemonCard(pokemon) {
    // Contenedor de la tarjeta
    const pokemonCard = document.createElement('div');
    pokemonCard.classList.add('pokemon');

    // Imagen del Pokémon
    const pokemonImg = document.createElement('img');
    pokemonImg.src = pokemon.sprites.front_default;
    pokemonImg.alt = pokemon.name;

    // Nombre del Pokémon
    const pokemonName = document.createElement('p');
    pokemonName.textContent = pokemon.name;

    // Botón de favorito
    const favoriteButton = document.createElement('button');
    favoriteButton.textContent = 'Favorito';
    favoriteButton.classList.add('button');
    favoriteButton.addEventListener('click', () => {
        toggleFavorite(pokemon.name, favoriteButton);
    });

    // Botón de detalles
    const detailsButton = document.createElement('button');
    detailsButton.textContent = 'Detalles';
    detailsButton.classList.add('button');
    detailsButton.addEventListener('click', () => {
        showPokemonDetails(pokemon);
    });

    // Agregamos los elementos a la tarjeta
    pokemonCard.appendChild(pokemonImg);
    pokemonCard.appendChild(pokemonName);
    pokemonCard.appendChild(favoriteButton);
    pokemonCard.appendChild(detailsButton);

    // Agregamos la tarjeta al contenedor de la lista
    pokemonList.appendChild(pokemonCard);

    // Verificamos si el Pokémon es favorito
    checkIfFavorite(pokemon.name, favoriteButton);
}
// Función para mostrar detalles del Pokémon en el modal
function showPokemonDetails(pokemon) {
    document.getElementById('pokemon-name').textContent = pokemon.name;
    document.getElementById('pokemon-img').src = pokemon.sprites.front_default;
    document.getElementById('pokemon-height').textContent = pokemon.height;
    document.getElementById('pokemon-weight').textContent = pokemon.weight;

    // Obtenemos las habilidades y las unimos en una cadena
    const abilities = pokemon.abilities.map(ability => ability.ability.name).join(', ');
    document.getElementById('pokemon-abilities').textContent = abilities;

    // Mostramos el modal
    pokemonDetails.style.display = 'block';
}
// Cuando el usuario hace clic en la 'X', cerramos el modal
closeModal.onclick = function() {
    pokemonDetails.style.display = 'none';
}

// Cuando el usuario hace clic fuera del modal, también lo cerramos
window.onclick = function(event) {
    if (event.target == pokemonDetails) {
        pokemonDetails.style.display = 'none';
    }
}

// Función para alternar el estado de favorito
function toggleFavorite(pokemonName, button) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    if (favorites.includes(pokemonName)) {
        // Si ya es favorito, lo removemos
        favorites = favorites.filter(name => name !== pokemonName);
        button.style.backgroundColor = '#ef5350'; // Color por defecto
    } else {
        // Si no es favorito, lo agregamos
        favorites.push(pokemonName);
        button.style.backgroundColor = '#FFD700'; // Color dorado para indicar favorito
    }

    // Guardamos la lista actualizada en localStorage
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

// Función para verificar si el Pokémon es favorito al cargar la página
function checkIfFavorite(pokemonName, button) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    if (favorites.includes(pokemonName)) {
        button.style.backgroundColor = '#FFD700'; // Color dorado para indicar favorito
    }
}

// Evento para filtrar Pokemones mientras el usuario escribe
searchInput.addEventListener('keyup', () => {
    const searchTerm = searchInput.value.toLowerCase();
    const pokemonCards = document.getElementsByClassName('pokemon');

    Array.from(pokemonCards).forEach(card => {
        const pokemonName = card.getElementsByTagName('p')[0].textContent.toLowerCase();
        if (pokemonName.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
});