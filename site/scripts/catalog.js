

var pokedexEntries = [];

var storedEntries = localStorage.getItem(
  'pokedexEntries'
);

if (
  storedEntries === undefined
  || storedEntries === null
) {
  getPokedexEntries();
}
else {
  restoreEntries(
    storedEntries
  );
}



// template definitions
Vue.component(
  'pokedex-entry',
  {
    props: [
      'entry'
    ],
    template: `
      <li>
        <a :href="entry.detailsUrl">
          <span>
            {{ entry.pokemonId }}
          </span>

          {{ entry.pokemonSpeciesName }}
        </a>
      </li>
    `
  }
);


var pokedexElement = new Vue(
  {
    el: '#pokedex-entries',
    data: {
      entries: pokedexEntries
    }
  }
);



// api call and parsing response

function getPokedexEntries() {
  makeRequestToApi(
    apiPokedexUrl,
    onPokedexRequestLoaded
  );
} // getPokedexEntries

function onPokedexRequestLoaded(
  xhr
) {
  //*/
  console.log(
    'pokedex request loaded'
  );

  console.log(
    xhr
  );
  //*/
  
  let status = xhr.status;
  if (
    status >= 200
    && status < 300
  ) {
    let responseData = JSON.parse(
      xhr.responseText
    );
    
    parseResponseDataIntoPokedexEntries(
      responseData
    );
  }
  else {
    //*/
    console.error(
      'status code: '
      + status
    );
    //*/
  }
} // onPokedexRequestLoaded

function parseResponseDataIntoPokedexEntries(
  responseData
) {
  //*/
  console.log(
    'parsing response data'
  );
  //*/

  responseData.pokemon_entries.forEach(
    ( item ) => {
      let pokedexEntry = {
        pokemonId: item.entry_number,
        pokemonSpeciesName: item.pokemon_species.name,
        detailsUrl: detailsUrl + item.pokemon_species.name
      };

      
      //*/
      console.log(
        'entry: '
        + pokedexEntry
      );
      //*/
      
      pokedexEntries.push(
        pokedexEntry
      );
    }
  );

  storeEntries(
    pokedexEntries
  );
} // parseResponseDataIntoPokedexEntries

function storeEntries(
  pokedexEntries
) {
  entryStringsByPokemonId = {};

  pokedexEntries.forEach(
    ( entry ) => {
      let entryString = JSON.stringify(
        entry
      );

      entryStringsByPokemonId[ entry.pokemonId ] = entryString;
    }
  );

  let storedEntries = JSON.stringify(
    entryStringsByPokemonId
  );

  //*/
  console.log(
    storedEntries
  );
  //*/

  localStorage.setItem(
    'pokedexEntries',
    storedEntries
  );
}

function restoreEntries(
  storedEntries
) {
  restoredEntries = JSON.parse(
    storedEntries
  );

  for (
    let i = 1;
    i <= 151;
    i++
  ) {
    let entryString = restoredEntries[ i ];

    let entry = JSON.parse(
      entryString
    );

    pokedexEntries.push(
      entry
    );
  }

  //*/
  console.log(
    pokedexEntries
  );
  //*/
}
