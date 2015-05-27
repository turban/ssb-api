d3.json("data/NO_Admin_latlng.topojson", function(error, norge) {
  if (error) return console.error(error);


  var kommuner = topojson.feature(norge, norge.objects.NO_Kommuner_pol_latlng).features,
      fylker = topojson.mesh(norge, norge.objects.NO_Fylker_pol_latlng, function(a, b) { return a !== b; });


  var width = 700,
      height = 700;

  //var features = cartogram(norge, norge.objects.NO_Fylker_pol_latlng.geometries);

  var projection = d3.geo.transverseMercator()
      .scale(width * 4)
      .rotate([-15, 0])
      .center([0, 64.9])
      .translate([width / 2, height / 2])
      .precision(.1);

  var path = d3.geo.path()
      .projection(projection);

  var cartogram = d3.cartogram()
      .projection(projection); /*
      .value(function(d) {
        console.log(d, Math.random() * 100);
        return Math.random() * 100;
      });*/

  var svg = d3.select("body").append("svg")
      .attr("width", width)
      .attr("height", height)
      .classed("map", true);

  //console.log("###");
  var features = svg.append("g");

  //console.log("#####", features, cartogram.path);

  var test = cartogram(norge, norge.objects.NO_Fylker_pol_latlng.geometries);


    features.selectAll("path")
      .data(topojson.feature(norge, norge.objects.NO_Fylker_pol_latlng).features)
      //.data(test)
      .enter().append("path")
        .attr("class", function(d) { 
          //return quantize(byId.get(d.id).value); 
        })      
        .attr("d", path);




});



