// -------------------------------------------------------------------
// Set Website Base Url

var local = 1;

if (local === 1){
	// local
	var website_base_url = "http://localhost/NinePenguins/";

	// local
	// <base href="/pokemonpacific/"/> // Set Base Href
	document.write("<base href=\"/NinePenguins/\" ");
} else if (local === 2){
	// website pokemonpacific.com
	var website_base_url = "http://pokemonpacific.com/";

	// website pokemonpacific.com // Set Base Href
	//<base href="/"/>
	document.write("<base href=\"/\" ");
} else if (local === 3){
	// website test
	var website_base_url = "http://pokemonpacific.com/2.0/2/";

	// website test // Set Base Href
	// <base href="/2.0/2/"/>
	document.write("<base href=\"/2.0/2/\" ");
}
