mapboxgl.accessToken = 'pk.eyJ1IjoiamFjb2Jyb2RyaWd1ZXo2NyIsImEiOiJjbHM4ZXYwcHUxZmo5Mm9wajR2a2ZsZnl2In0.PA6EAvd_nOlATsJG18QdBg';
let map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/dark-v10',
    zoom: 5, // starting zoom
    minZoom: 4, // minimum zoom level of the map
    center: [138, 38] // starting center
});
const grades = [4, 5, 6],
    colors = ['rgb(208,209,230)', 'rgb(103,169,207)', 'rgb(1,108,89)'],
    radii = [5, 15, 20];
//load data to the map as new layers.
//map.on('load', function loadingData() {
map.on('load', () => { //simplifying the function statement: arrow with brackets to define a function
    // when loading a geojson, there are two steps
    // add a source of the data and then add the layer out of the source
    map.addSource('covid-data', {
        type: 'geojson',
        data: 'assets/us-covid-2020-rates.json'
    });
    map.addLayer({
        'id': 'covid-choropleth',
        'type': 'fill',
        'source': 'covid-data',
        'paint': {
            'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'rates'],
                0, 'rgb(208,209,230)',
                10, 'rgb(160,198,224)',
                20, 'rgb(103,169,207)',
                30, 'rgb(52,135,182)',
                40, 'rgb(1,108,89)'
            ],
            'fill-opacity': 0.6
        }
    });

    // click on tree to view magnitude in a popup
    map.on('click', 'covid-choropleth', (event) => {
        const rate = event.features[0].properties.rates || 'Data not available';
        new mapboxgl.Popup({ offset: [0, -15] }) // Adjust the offset as needed
            .setLngLat(event.lngLat)
            .setHTML(`<strong>Covid-19 Rate:</strong> ${rate}`)
            .addTo(map);
    });
});
// create legend
const legend = document.getElementById('legend');
//set up legend grades and labels
var labels = ['<strong>Rate</strong>'],
    vbreak;
//iterate through grades and create a scaled circle and label for each
for (var i = 0; i < grades.length; i++) {
    vbreak = grades[i];
    // you need to manually adjust the radius of each dot on the legend 
    // in order to make sure the legend can be properly referred to the dot on the map.
    dot_radii = 2 * radii[i];
    labels.push(
        '<p class="break"><i class="dot" style="background:' + colors[i] + '; width: ' + dot_radii +
        'px; height: ' +
        dot_radii + 'px; "></i> <span class="dot-label" style="top: ' + dot_radii / 2 + 'px;">' + vbreak +
        '</span></p>');
}
const source =
    '<p style="text-align: right; font-size:10pt">Source: <a href="https://github.com/nytimes/covid-19-data/blob/43d32dde2f87bd4dafbb7d23f5d9e878124018b8/live/us-counties.csv">USGS</a></p>';
legend.innerHTML = labels.join('') + source;



