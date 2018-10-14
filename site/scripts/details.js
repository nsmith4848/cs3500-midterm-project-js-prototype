
/*
details from /pokemon/
  height
  weight
  sprite
  types

details from /pokemon-species/
  flavor text entries


todo:
  genus (Foo Pokemon)


*/
class PokemonDetails {
  constructor(
    {
      pokemonId,
      speciesName,

      weight,
      height,

      spriteString,

      flavorTextPart1,
      flavorTextPart2,

      type1,
      type2
    }
  ) {
    this.pokemonId = pokemonId;
    this.speciesName = speciesName;

    this.weight = weight;
    this.height = height;

    this.spriteString = spriteString;

    this.flavorTextPart1 = flavorTextPart1;
    this.flavorTextPart2 = flavorTextPart2;

    this.type1 = type1;
    this.type2 = type2;

    // found in versions?
  } // constructor
} // PokemonDetails


// use pokeball or something while loading
// and only use missingo for error?

var placeholderDetails = new PokemonDetails(
  {
    pokemonId: '000',
    speciesName: 'loading',
    weight: 'loading',
    height: 'loading',
    spriteString: './images/missingo.png',
    flavorTextPart1: 'loading...',
    flavorTextPart2: 'loading...',
    type1: 'bird',
    type2: 'normal'
  }
);

var pokemonDetails = placeholderDetails;


let urlSearchParams = new URLSearchParams(
  window.location.search
);

var pokemonSpecies = urlSearchParams.get(
  'pokemon-species'
);

//*/ could do it like
getDetailsForPokemonSpecies(
  pokemonSpecies
)
//*/
.then(
  function(
    details
  ) {
    // replacing object does not work
    // vue still uses the old one
    //pokemonDetails = details;

    pokemonDetails.pokemonId = details.pokemonId;
    pokemonDetails.speciesName = details.speciesName;
    pokemonDetails.weight = details.weight;
    pokemonDetails.height = details.height;
    pokemonDetails.spriteString = details.spriteString;
    pokemonDetails.flavorTextPart1 = details.flavorTextPart1;
    pokemonDetails.flavorTextPart2 = details.flavorTextPart2;
    pokemonDetails.type1 = details.type1;
    pokemonDetails.type2 = details.type2;

    return details;
  }
)
.catch(
  function(
    reason
  ) {
    //pokemonDetails = errorDetails; // TODO

    console.error(
      reason
    );
  }
);





/********************************/
/****  template definitions  ****/
/********************************/

  Vue.component(
    'pokemon-details-card',
    {
      props: [
        'details'
      ],
      template: `
      <div class="pokemon-card">
        <h3>
          {{ details.speciesName }}
        </h3>

        <div>
          <img class="pokemon-card-sprite"
            v-bind:src='
              details.spriteString
              ? details.spriteString
              : "./images/missingo.png"
            '>

          <p>
            HT: {{ details.height }} m
          </p>

          <p>
            WT: {{ details.weight }} kg
          </p>

          <p>
            Types:
            <br>

            <span>
              {{ details.type1 }}
            </span>

            <span v-if="details.type2">
              {{ details.type2 }}
            </span>
          </p>

          <p>
            {{ details.flavorTextPart1 }}
            {{ details.flavorTextPart2 }}
          </p>
        </div>
      </div>
      `
    }
  );

/********************************/


/********************************/
/****  persistence  ****/
/********************************/

  function retrieveDetailsFromLocalStorage(
    pokemonSpecies
  ) {
    let storedDetails = localStorage.getItem(
      pokemonSpecies
    );

    return storedDetails;
  } // retrieveDetailsFromLocalStorage

  function restoreDetails(
    storedDetails
  ) {
    let restoredDetails = JSON.parse(
      storedDetails
    );

    return restoredDetails;
  } // restoreDetails


  function storeDetailsForPokemon(
    pokemonDetails
  ) {
    let storedDetails = JSON.stringify(
      pokemonDetails
    );

    localStorage.setItem(
      pokemonDetails.speciesName,
      storedDetails
    );
    
    return;
  }

/********************************/


/********************************/
/****  api access  ****/
/********************************/

  function makeRequestsForPokemonDetails(
    pokemonSpecies
  ) {
    let speciesUrl = apiSpeciesUrlForPokemon(
      pokemonSpecies
    )
    let pokemonUrl = apiPokemonUrlForPokemon(
      pokemonSpecies
    );


    let speciesPromise = makeRequestToApi(
      speciesUrl
    );
    let pokemonPromise = makeRequestToApi(
      pokemonUrl
    );

    let combinedPromise = Promise.all(
      [
        speciesPromise,
        pokemonPromise
      ]
    );

    return combinedPromise;
  } // makeRequestsForPokemonDetails

  function parseResponsesAndCombineDetails(
    responses
  ) {
    let speciesResponse = responses[ 0 ];
    let pokemonResponse = responses[ 1 ];

    // parse into objects
    let speciesData = JSON.parse(
      speciesResponse
    );
    let pokemonData = JSON.parse(
      pokemonResponse
    );

    let flavorTextEntries = speciesData.flavor_text_entries;

    let flavorTextPart1;
    let flavorTextPart2;

    flavorTextEntries.forEach(
      ( entry ) => {
        let language = entry.language.name;
        let version = entry.version.name;

        if (
          language === 'en'
          && (
            version === 'red'
            || version === 'blue'
          )
        ) {
          let flavorText = entry.flavor_text.split(
            '\f'
          );

          flavorTextPart1 = flavorText[ 0 ];
          flavorTextPart2 = flavorText[ 1 ];

          return;
        }
      } // callback
    ); // for each

    let types = pokemonData.types;

    let type1;
    let type2;

    if (
      types.length === 1
    ) {
      type1 = types[ 0 ].type.name;
      type2 = null;
    }
    else if (
      types[ 0 ].slot === 1
    ) {
      type1 = types[ 0 ].type.name;
      type2 = types[ 1 ].type.name;
    }
    else {
      type1 = types[ 1 ].type.name;
      type2 = types[ 0 ].type.name;
    }

    console.log(
      flavorTextPart2
    );

    let combinedDetails = {
      pokemonId: pokemonData.id,
      speciesName: speciesData.name,
      weight: pokemonData.weight / 10,
      height: pokemonData.height / 10,
      flavorTextPart1: flavorTextPart1,
      flavorTextPart2: flavorTextPart2,
      type1: type1,
      type2: type2
    };

    return combinedDetails;
  } // parseResponsesAndCombineDetails

/********************************/


/********************************/
/****  domain service?  ****/
/********************************/

  function addSpriteStringToDetails(
    details
  ) {
    let promise = getSpriteStringForPokemon(
      details.pokemonId
    )
    .then(
      ( spriteString ) => {
        details.spriteString = spriteString;

        return details;
      }
    );

    return promise;
  } // addSpriteStringToDetails

  function getDetailsForPokemonSpecies(
    pokemonSpecies
  ) {
    let promise = new Promise(
      function(
        resolve,
        reject
      ) {
        let storedDetails = retrieveDetailsFromLocalStorage(
          pokemonSpecies
        );

        if (
          storedDetails !== undefined
          && storedDetails !== null
        ) {
          let restoredDetails = restoreDetails(
            storedDetails
          );

          // ?? return details or just set
          // pokemonDetails to/with them
          resolve(
            restoredDetails
          );

          return;
        }


        makeRequestsForPokemonDetails(
          pokemonSpecies
        )
        .then(
          function(
            responses
          ) {
            let combinedDetails = parseResponsesAndCombineDetails(
              responses
            );

            return combinedDetails;
          }
        ) // then
        .then(
          function(
            combinedDetails
          ) {
            getSpriteStringForPokemon(
              combinedDetails.pokemonId
            )
            .then(
              function(
                spriteString
              ) {
                combinedDetails.spriteString = spriteString;

                let details = new PokemonDetails(
                  combinedDetails
                );

                storeDetailsForPokemon(
                  details
                );

                // make new details object and
                // replace existing/displayed
                // details object or update values?
                resolve(
                  details
                );
              },
              function(
                reason
              ) {
                reject(
                  reason
                );
              }
            ); // then

            console.log(
              'reached call after nested resolve'
            );

          }
        ) // then
        .catch(
          function( // reject callback
            reason
          ) {
            console.error(
              reason
            );

            reject(
              reason
            );
          } // reject callback
        ); // catch
      } // executor
    ); // promise

    return promise;
  } // getDetailsForPokemonSpecies


/********************************/



// root instance
new Vue(
  {
    el: '#app-container',
    data: {
      pages: pages,
      currentPageId: 'details',
      pokemonDetails: pokemonDetails
    }
  }
);


