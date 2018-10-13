

var pokedexEntries = [];
// initialized to empty array
// avoid it being undefined
// when vue components access it


getPokedexEntries();
// asynchronously gets the pokedex entries
// either by restoring from local storage
// or by requesting from the api and then
// adds them to the pokedex entries



/********************************/
/****  template definitions  ****/
/********************************/

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

/********************************/


/********************************/
/****  api access  ****/
/********************************/

  function parseResponseIntoPokedexEntries(
    response
  ) {
    /*/
    console.log(
      'parsing response data'
    );
    //*/
    let responseData = JSON.parse(
      response
    );

    responseData.pokemon_entries.forEach(
      ( item ) => {
        let pokedexEntry = {
          pokemonId: item.entry_number,
          pokemonSpeciesName: item.pokemon_species.name,
          detailsUrl: detailsUrlForPokemon(
            item.pokemon_species.name
          )
        };

        /*/
        console.log(
          'entry: '
          + pokedexEntry
        );
        //*/
        
        pokedexEntries.push(
          pokedexEntry
        );
      }
    ); // for each

    // store the entries to avoid having
    // to request them again
    storeEntries(
      pokedexEntries
    );
  } // parseResponseIntoPokedexEntries

  function makeRequestForPokedex() {
    let promise = makeRequestToApi(
      apiPokedexUrl
    )
    .then(
      function( // accept callback
        response
      ) {
        parseResponseIntoPokedexEntries(
          response
        );
      }, // accept callback
      function( // reject callback
        reason
      ) {
        console.error(
          reason
        );
      } // reject callback
    ); // then

    return promise;
  } // makeRequestForPokedex

/********************************/


/********************************/
/****  persistence  ****/
/********************************/

  function storeEntries(
    pokedexEntries
  ) {
    entryStringsByPokemonId = {};

    pokedexEntries.forEach(
      ( entry ) => {
        let entryString = JSON.stringify(
          entry
        );

        // have to use object[ key ] notation
        entryStringsByPokemonId[ entry.pokemonId ] = entryString;
      }
    ); // for each

    let storedEntries = JSON.stringify(
      entryStringsByPokemonId
    );

    localStorage.setItem(
      'pokedexEntries',
      storedEntries
    );

    return;
  } // storeEntries

  // restores the entries and
  // adds them to pokedex entries
  function restoreEntries(
    storedEntries
  ) {
    // convert the stored entries
    // from a string back to an object
    // with the pokemonIds as keys and
    // the stringified entries as values
    let restoredEntries = JSON.parse(
      storedEntries
    );

    // convert the entry strings back to
    // objects and then add them to the
    // pokedex entries
    for (
      let i = 1;
      i <= 151;
      i++
    ) {
      // have to use object[ key ] notation
      let entryString = restoredEntries[ i ];

      let entry = JSON.parse(
        entryString
      );

      pokedexEntries.push(
        entry
      );
    } // loop

    return;
  } // restoreEntries


/********************************/



/********************************/
/****  domain service?  ****/
/********************************/

  function getPokedexEntries() {
    let promise = new Promise(
      function(
        resolve,
        reject
      ) {
        let storedEntries = localStorage.getItem(
          'pokedexEntries'
        );

        if (
          storedEntries !== undefined
          && storedEntries !== null
        ) {
          let pokedexEntries = restoreEntries(
            storedEntries
          );

          resolve(
            pokedexEntries
          );
        }

        // make request to api for pokedex
        makeRequestToApi(
          apiPokedexUrl
        )
        .then(
          function(
            response
          ) {
            parseResponseIntoPokedexEntries(
              response
            );

            resolve();
          }, // accept callback
          function(
            reason
          ) {
            console.error(
              reason
            );
          } // reject callback
        ); // then
      } // executor
    );

    return promise;
  } // getPokedexEntries
  
/********************************/


// root instance
new Vue(
  {
    el: '#app-container',
    data: {
      pages: pages,
      currentPageId: 'pokedex',
      entries: pokedexEntries
    }
  }
);
