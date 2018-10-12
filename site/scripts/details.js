
/*
details from /pokemon/
  height
  weight
  sprite
  types

details from /pokemon-species/
  flavor text entries


*/
class PokemonDetails {
  constructor(
    {
      speciesName,

      weight,
      height,

      spriteUrl,

      flavorText,

      types
    }
  ) {
    this.speciesName = speciesName;

    this.weight = weight;
    this.height = height;

    this.spriteUrl = spriteUrl;

    this.flavorText = flavorText;

    // split into type1 type2?
    this.types = types;

    // found in versions?
  }
}

var placeholderDetails = new PokemonDetails(
  {
    speciesName: 'loading',
    weight: 'loading',
    height: 'loading',
    // spriteUrl? use missingo?
    flavorText: 'loading...'
  }
);



var pokemonSpecies = URLSearchParams.get(
  'pokemon-species'
);


// todo: add in store/restore technique from catalog page
var pokemonDetails = localStorage.getItem(
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


// template definitions

// profile(/details?)
Vue.component(
  'pokemon-details',
  {
    props: [
      'details'
    ],
    template: `
    `
  }
)

var pokemonDetailsElement = new Vue(
  {
    el: '#pokemon-details',
    data: {
      details: pokemonDetails
    }
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




