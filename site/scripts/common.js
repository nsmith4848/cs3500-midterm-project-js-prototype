


/********************************/
/****  constants  ****/
/********************************/

  // api url stuff
  var baseApiUrl = 'https://pokeapi.co/api/v2/';
  // appended to base api url
  var apiPokedexUrl = baseApiUrl
  + 'pokedex/2/';
  var apiPokemonUrl = baseApiUrl
  + 'pokemon/'; // pokemonId appended
  var apiSpeciesUrl = baseApiUrl
  + 'pokemon-species/'; // pokemonSpecies appended

  var spritesUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' // pokemonId and png extension appended


  // site url stuff
  var detailsUrl = "./details.html?pokemon-species="; // pokemonSpecies appended

  var pages = [
    {
      id: 'welcome',
      title: 'Welcome',
      url: './index.html'
    },
    {
      id: 'pokedex',
      title: 'Pokedex',
      url: './catalog.html'
    },
    {
      id: 'about-site',
      title: 'About Site',
      url: './about-site.html'
    },
    {
      id: 'about-us',
      title: 'About Us',
      url: './about-us.html'
    }
  ];

/********************************/


/********************************/
/****  utilities  ****/
/********************************/

  function detailsUrlForPokemon(
    pokemonSpecies
  ) {
    let url = detailsUrl
    + pokemonSpecies;

    return url;
  } // detailsUrlForPokemon

  function apiPokemonUrlForPokemon(
    pokemonSpecies
  ) {
    let url = apiPokemonUrl
    + pokemonSpecies
    + '/';

    return url;
  } // apiPokemonUrlForPokemon

  function apiSpeciesUrlForPokemon(
    pokemonSpecies
  ) {
    let url = apiSpeciesUrl
    + pokemonSpecies
    + '/';

    return url;
  } // apiSpeciesUrlForPokemon

  function spriteUrlForPokemon(
    pokemonId
  ) {
    let url = spritesUrl
    + pokemonId
    + '.png';

    return url;
  } // spriteUrlForPokemon


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

        request.onload = function() {
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
        }; // onload callback

        request.send();
      } // executor
    ); // promise

    return promise;
  } // makeRequestToApi

  // returns a promise which resolves
  // or rejects the response of the request
  // based on the status code
  function makeRequestForSprite(
    url
  ) {
    let promise = new Promise(
      function (
        resolve,
        reject
      ) {
        let request = new XMLHttpRequest();

        request.responseType = 'arraybuffer';

        request.open(
          'GET',
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
        }; // onload callback

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
/****  persistence  ****/
/********************************/

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
        let spriteString = retrieveSpriteStringFromLocalStorage(
          pokemonId
        );

        if (
          spriteString !== undefined
          && spriteString !== null
        ) {
          resolve(
            spriteString
          );
        }

        let spriteUrl = spriteUrlForPokemon(
          pokemonId
        );

        makeRequestForSprite(
          spriteUrl
        )
        .then(
          function( // accept callback
            response
          ) {
            spriteString = 'data:image/png;base64,'
            + convertImageToBase64String(
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
          function( // reject callback
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

/********************************/
