

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