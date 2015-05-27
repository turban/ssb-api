d3.json("data/NO_Admin_latlng.topojson", function(error, norge) {
  if (error) return console.error(error);

  var kommuner = topojson.feature(norge, norge.objects.NO_Kommuner_pol_latlng).features,
      fylker = topojson.mesh(norge, norge.objects.NO_Fylker_pol_latlng, function(a, b) { return a !== b; });

  var width = 700,
      height = 700;

  var projection = d3.geo.transverseMercator()
      .scale(width * 4)
      .rotate([-15, 0])
      .center([0, 64.9])
      .translate([width / 2, height / 2])
      .precision(.1);

  var path = d3.geo.path()
      .projection(projection);

  var zoom = d3.behavior.zoom()
      .translate([0, 0])
      .scale(1)
      .scaleExtent([1, 8])
      .on("zoom", zoomed);

  var svg = d3.select("body").append("svg")
      .attr("width", width)
      .attr("height", height)
      .classed("map", true)
      .call(zoom);

  var features = svg.append("g");

  svg.append("rect")
      .attr("class", "overlay")
      .attr("width", width)
      .attr("height", height)
      .call(zoom);

  JSONstat('http://data.ssb.no/api/v0/dataset/1108.json?lang=no', function(){
    var ds = this.Dataset(0);

    var tbl = ds.toTable({ type: 'arrobj', content: 'id' }, function (d){
      if (d.ContentsCode === 'Folketilvekst10') {
        return d;
      }
    });

    var min = d3.min(tbl, function(d) { return d.value }),
        max = d3.max(tbl, function(d) { return d.value }),
        byId = d3.map(tbl, function(d) { return d.Region; });

    var quantize = d3.scale.quantile()
        .domain(tbl.map(function(d){return d.value}).sort())
        .range(d3.range(9).map(function(i) { return "q" + i + "-9"; }));


    features.append("g")
      .classed("kommune PuBu", true)
      .selectAll("path")
      .data(kommuner)
      .enter().append("path")
        .attr("class", function(d) { 
          return quantize(byId.get(d.id).value); 
        })      
        .attr("d", path);

    features.append("path")
      .datum(fylker)
      .classed("fylke", true)
      .attr("d", path);

  });

  function zoomed() {
    features.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    features.select(".kommune").style("stroke-width", .2 / d3.event.scale + "px");
    features.select(".fylke").style("stroke-width", 2 / d3.event.scale + "px");
  }

});



