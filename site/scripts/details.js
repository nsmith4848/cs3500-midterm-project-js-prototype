
/********************************/
/****  model definitions  ****/
/********************************/

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
    } // constructor
  } // PokemonDetails

/********************************/


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
      <div class="container panel panel-default pokemon-card">

        <div class="row panel-heading">
          <h2 class="panel-title">
            {{ details.speciesName }}
          </h2>
        </div>

        <div class="row panel-body">
          <div class="col-md-6">
            <img class="pokemon-card-sprite center-block"
              v-bind:src='
                details.spriteString
                ? details.spriteString
                : "./images/missingo.png"
              '
              width="192px"
              height="192px"/>
          </div>

          <div class="col-md-6">
            <p>
              No. {{ details.pokemonId }}
            </p>

            <p>
              Height: {{ details.height }} m
            </p>

            <p>
              Weight: {{ details.weight }} kg
            </p>

            <p>
              Types:

              <span>
                {{ details.type1 }}
              </span>

              <span v-if="details.type2">
                {{ details.type2 }}
              </span>
            </p>
          </div>
        </div>

        <div class="row panel-body">
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
    pokemon
  ) {
    let key = localStorageDetailsKeyForPokemon(
      pokemon
    );

    let storedDetails = localStorage.getItem(
      key
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

    let key = localStorageDetailsKeyForPokemon(
      pokemonDetails.pokemonId
    );

    localStorage.setItem(
      key,
      storedDetails
    );
    
    return;
  } // storeDetailsForPokemon

/********************************/


/********************************/
/****  api access  ****/
/********************************/

  function makeRequestsForPokemonDetails(
    pokemon
  ) {
    let speciesUrl = apiSpeciesUrlForPokemon(
      pokemon
    )
    let pokemonUrl = apiPokemonUrlForPokemon(
      pokemon
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

    let combinedDetails = {
      pokemonId: pokemonData.id,
      speciesName: speciesData.name,
      // api uses tenths of a kg for weight
      // and tenths of a meter for height...
      weight: pokemonData.weight / 10, // kg
      height: pokemonData.height / 10, // m
      flavorTextPart1: flavorTextPart1,
      flavorTextPart2: flavorTextPart2,
      type1: type1,
      type2: type2
    };

    return combinedDetails;
  } // parseResponsesAndCombineDetails

/********************************/


/********************************/
/****  domain  ****/
/********************************/

  function getDetailsForPokemon(
    pokemon
  ) {
    let promise = new Promise(
      function(
        resolve,
        reject
      ) {
        let storedDetails = retrieveDetailsFromLocalStorage(
          pokemon
        );

        if (
          storedDetails !== undefined
          && storedDetails !== null
        ) {
          let restoredDetails = restoreDetails(
            storedDetails
          );

          resolve(
            restoredDetails
          );

          return;
        }


        makeRequestsForPokemonDetails(
          pokemon
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
  } // getDetailsForPokemon


  function updateDisplayedDetails(
    details
  ) {
    for (
      property in pokemonDetails
    ) {
      pokemonDetails[ property ] = details[ property ];
    }

    return;
  } // updateDisplayedDetails

/********************************/


/********************************/
/****  execution  ****/
/********************************/

  var placeholderDetails = new PokemonDetails(
    {
      pokemonId: '000',
      speciesName: 'loading',
      weight: 'loading',
      height: 'loading',
      spriteString: './images/pokeball.svg',
      flavorTextPart1: 'loading...',
      flavorTextPart2: '',
      type1: 'loading',
      type2: ''
    }
  );
  var errorDetails = new PokemonDetails(
    {
      pokemonId: '000',
      speciesName: 'error',
      weight: '00',
      height: '00',
      spriteString: './images/missingo.png',
      flavorTextPart1: 'error...',
      flavorTextPart2: '',
      type1: 'bird',
      type2: 'normal'
    }
  );

  var pokemonDetails = placeholderDetails;


  let urlSearchParams = new URLSearchParams(
    window.location.search
  );

  var pokemon = Number.parseInt(
    urlSearchParams.get(
      'pokemon'
    )
  );


  var previousPokemonUrl = detailsUrlForPokemon(
    pokemon - 1
  );
  var nextPokemonUrl = detailsUrlForPokemon(
    pokemon + 1
  );

  if (
    pokemon === 1
  ) {
    previousPokemonUrl = null;
  }
  else if (
    pokemon === 151
  ) {
    nextPokemonUrl = null;
  }



  // root instance
  new Vue(
    {
      el: '#app-container',
      data: {
        pages: pages,
        currentPageId: 'details',
        pokemonDetails: pokemonDetails,
        previousPokemonUrl: previousPokemonUrl,
        nextPokemonUrl: nextPokemonUrl
      }
    }
  );


  getDetailsForPokemon(
    pokemon
  )
  .then(
    function(
      details
    ) {
      // replacing object does not work
      // vue still uses the old one
      //pokemonDetails = details;

      updateDisplayedDetails(
        details
      );

      return details;
    }
  )
  .catch(
    function(
      reason
    ) {
      updateDisplayedDetails(
        errorDetails
      );

      console.error(
        reason
      );
    }
  );

/********************************/
