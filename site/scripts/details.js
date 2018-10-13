
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

      flavorText,

      type1,
      type2
    }
  ) {
    this.pokemonId = pokemonId;
    this.speciesName = speciesName;

    this.weight = weight;
    this.height = height;

    this.spriteString = spriteString;

    this.flavorText = flavorText;

    this.type1 = type1;
    this.type2 = type2;

    // found in versions?
  }
}




var placeholderDetails = new PokemonDetails(
  {
    pokemonId: '000',
    speciesName: 'loading',
    weight: 'loading',
    height: 'loading',
    spriteString: './images/missingo.png',
    flavorText: 'loading...',
    type1: 'bird',
    type2: 'normal'
  }
);

var pokemonDetails = placeholderDetails;


let urlSearchParams = new URLSearchParams(
  window.location
);

var pokemonSpecies = urlSearchParams.get(
  'pokemon-species'
);


// todo: add in store/restore technique from catalog page

/*
var storedDetails = localStorage.getItem(
  pokemonSpecies
);

if (
  pokemonDetails === undefined
  || pokemonDetails === null
) {
  pokemonDetails = placeholderDetails;
  // placeholder values while actual ones are retrieved?

  getPokemonSpeciesDetails(
    pokemonSpecies
  );
}
*/

// template definitions

// profile(/details?)

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
        <img v-bind:src='
          details.spriteString
          ? details.spriteString
          : "./images/missingo.png"
        '>

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
      </div>
    </div>
    `
  }
);



// api calls

function getPokemonSpeciesDetails(
  pokemonSpeciesName
) {
  // todo make requests for details at each endpoint
  let speciesUrl = apiSpeciesUrl + pokemonSpeciesName + '/';
  let pokemonUrl = apiPokemonUrl + pokemonSpeciesName + '/';

  makeRequestToApi(
    url,
    ( xhr ) => {
      let responseData = JSON.parse(
        xhr.responseText
      );

      // alright so the pokemon details are
      // split across:
      // pokemon/{name}/
      // pokemon-species/{name}/
      // will need to make requests to both
      // and add properties/info to the details
      // object...
      let pokemonSpeciesDetails = {
        name: responseData.name,
        types: responseData.types
      };
    }
  );
}

function onSpeciesDetailsRequestLoaded(
  xhr
) {
}


function onPokemonDetailsRequestLoaded(
  xhr
) {
}



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

