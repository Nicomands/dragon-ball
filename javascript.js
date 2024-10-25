const apiUrl = 'https://dragonball-api.com/api/characters';
const charactersContainer = document.getElementById('characters');
const filterSelect = document.getElementById('filter-select');
const errorMessage = document.getElementById('error-message');

async function fetchAllCharacters() {
    const allCharacters = [];
    let currentPage = 1;
    let totalPages = 1;

    do {
        try {
            const response = await fetch(`${apiUrl}?page=${currentPage}`);
            if (!response.ok) {
                throw new Error('Error en la solicitud: ' + response.status);
            }
            const data = await response.json();
            const characters = data.items;

            allCharacters.push(...characters);
            totalPages = data.meta.totalPages;
            currentPage++;
        } catch (error) {
            errorMessage.textContent = error.message;
            console.error(error);
            return;
        }
    } while (currentPage <= totalPages);

    renderCharacters(allCharacters);
    populateFilter(allCharacters);
}

function renderCharacters(characters) {
    charactersContainer.innerHTML = '';
    characters.forEach(character => {
        const card = document.createElement('div');
        card.className = 'character-card';
        card.innerHTML = `
            <img src="${character.image}" alt="${character.name}">
            <h2>${character.name}</h2>
            <p>Raza: ${character.race}</p>
            <p>Transformaciones: ${character.transformations ? character.transformations.join(', ') : 'N/A'}</p>
        `;
        charactersContainer.appendChild(card);
    });
}

function populateFilter(characters) {
    const races = [...new Set(characters.map(character => character.race))];
    filterSelect.innerHTML = '<option value="all">Todos</option>'; // Reiniciar el filtro
    races.forEach(race => {
        const option = document.createElement('option');
        option.value = race;
        option.textContent = race;
        filterSelect.appendChild(option);
    });

    filterSelect.addEventListener('change', () => filterCharacters(characters));
}

function filterCharacters(characters) {
    const selectedRace = filterSelect.value;
    if (selectedRace === 'all') {
        renderCharacters(characters);
    } else {
        const filteredCharacters = characters.filter(character => character.race === selectedRace);
        renderCharacters(filteredCharacters);
    }
}

fetchAllCharacters();
