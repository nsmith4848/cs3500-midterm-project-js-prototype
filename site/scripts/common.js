


/********************************/
/****  constants  ****/
/********************************/

  // api url stuff
  var baseApiUrl = 'https://pokeapi.co/api/v2/';
  // appended to base api url
  var apiPokedexUrl = baseApiUrl + 'pokedex/2/';
  var apiPokemonUrl = baseApiUrl + 'pokemon/'; // pokemonId appended
  var apiSpeciesUrl = baseApiUrl + 'pokemon-species/'; // pokemonSpecies appended
  var spritesUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' // pokemonId and png extension appended


  // site url stuff
  var detailsUrl = "./details.html?pokemon-species="; // pokemonSpecies appended

/********************************/


/********************************/
/****  api access  ****/
/********************************/

  // returns a promise which resolves
  // or rejects the response of the request
  // based on the status code
  function makeRequestToApi(
    url
  ) {
    let promise = new Promise(
      function(
        resolve,
        reject
      ) {
        var request = new XMLHttpRequest();
        request.open(
          "GET",
          url
        );
        request.onload = function(
          event
        ) {
          let status = this.status;

          if (
            status >= 200
            && status < 300
          ) {
            resolve(
              this.response
            );
          }
          else {
            reject(
              this.statusText
            );
          }
        };
        request.send();
      } // executor
    ); // promise
    

    return;
  } // makeRequestToApi

  // returns a promise which resolves
  // or rejects the response of the request
  // based on the status code
  function makeRequestForSprite(
    url,
    pokemonId
  ) {
    let promise = new Promise(
      function (
        resolve,
        reject
      ) {
        let request = new XMLHttpRequest();
        request.responseType = 'arraybuffer';
        request.onload = function(
          event
        ) {
          let status = this.status;

          if (
            status >= 200
            && status < 300
          ) {
            resolve(
              this.response
            );
          }
          else {
            reject(
              this.statusText
            );
          }
        }; // onload function
        request.open(
          'GET',
          url
        );
        request.send();
      } // executor
    ); // promise
    
    return promise;
  } // makeRequestForSprite

/********************************/


/********************************/
/****  template definitions  ****/
/********************************/

  Vue.component(
    'nav-bar',
    {
      props: [
        'pages',
        'currentPageId'
      ],
      template: `
        <nav>
          <a v-for='page in pages'
            v-bind:key='page.id'
            v-bind:href='page.url'
            v-bind:class='
              currentPageId === page.id
              ? "nav-item current-nav-item"
              : "nav-item"
            '>
            {{ page.title }}
          </a>
        </nav>
      `
    }
  );

/********************************/


/********************************/
/****  ??? persistence? data? ???  ****/
/********************************/

  function convertImageToBase64String(
    image
  ) {
    let base64String = btoa(
      String.fromCharCode.apply(
        null,
        new Uint8Array(
          image
        )
      )
    );

    return base64String;
  } // convertImageToBase64String

  // retrieve from local storage
  // store in local storage

  function retrieveSpriteStringFromLocalStorage(
    pokemonId
  ) {
    // try local storage
    let storedString = localStorage.getItem(
      pokemonId
    );

    return storedString;
  } // retrieveSpriteStringFromLocalStorage


  function storeSpriteStringForPokemon(
    spriteString,
    pokemonId
  ) {
    let key = pokemonId
      + '/sprite-string';

    localStorage.setItem(
      key,
      spriteString
    );

    return;
  } // storeSpriteStringForPokemon


/********************************/


/********************************/
/****  domain service?  ****/
/********************************/

  // returns a promise which resolves
  // the sprite string
  function getSpriteStringForPokemon(
    pokemonId // or pokemonSpeciesName?
  ) {
    let promise = new Promise(
      function(
        resolve,
        reject
      ) {
        let storedString = retrieveSpriteStringFromLocalStorage(
          pokemonId
        );

        let spriteString;

        if (
          storedString !== undefined
          && storedString !== null
        ) {
          spriteString = 'data:image/png;base64,'
          + storedString;

          resolve(
            spriteString
          );
        }

        let spriteUrl = spritesUrl
        + pokemonId
        + '.png';

        let requestPromise = makeRequestForSprite(
          spriteUrl,
          pokemonId
        );
        requestPromise.then(
          function(
            response
          ) {
            spriteString = convertImageToBase64String(
              response
            );

            // to avoid having to request
            // the sprite again
            storeSpriteStringForPokemon(
              spriteString,
              pokemonId
            );

            resolve(
              spriteString
            );
          }, // accept callback
          function(
            reason
          ) {
            reject(
              reason
            );
          } // reject callback
        ); // then
      } // executor
    ); // promise
    
    return promise;
  } // getSpriteStringForPokemon

  function getPokedexEntries() {
    let promise = new Promise(
      function(
        resolve,
        reject
      ) {
        // make request to api for pokedex
        let requestPromise = makeRequestToApi(
          apiPokedexUrl
        );
        requestPromise.then(
          function(
            response
          ) {
            //
          }, // accept callback
          function(
            reason
          ) {
            //
          } // reject callback
        )
      } // executor
    );
  }

/********************************/
