d3.json("data/NO_Admin_latlng.topojson", function(error, norge) {
  if (error) return console.error(error);

  var kommuner = topojson.feature(norge, norge.objects.NO_Kommuner_pol_latlng).features,
      fylker = topojson.mesh(norge, norge.objects.NO_Fylker_pol_latlng, function(a, b) { return a !== b; });


  var width = 960,
      height = 500;

  /*
  var zoom = d3.behavior.zoom()
      .translate([0, 0])
      .scale(1)
      .scaleExtent([1, 8])
      .on("zoom", zoomed);
  */

  var projection = d3.geo.azimuthalEqualArea()
      .scale(width * 10)
      .rotate([-10, -70])
      .center([-1, -9])
      .translate([width / 2, height / 2])
      .precision(.1);

  var path = d3.geo.path()
      .projection(projection);

  //var tip = d3.tip().attr('class', 'd3-tip').html(function(d) { return d.properties.name; });   

  var svg = d3.select("body").append("svg")
      .attr("width", width)
      .attr("height", height)
      .classed("map", true);
          //.call(tip);       

  /*
  svg.append("rect")
      .attr("class", "overlay")
      .attr("width", width)
      .attr("height", height);
      //.call(zoom);
  */

      //svg.call(tip);    

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


    svg.append("g")
      .classed("kommune PuBu", true)
      .selectAll("path")
      .data(kommuner)
      .enter().append("path")
        .attr("class", function(d) { 
          return quantize(byId.get(d.id).value); 
        })
        .attr("d", path)
        //.on('mouseover', tip.show)
        //.on('mouseout', tip.hide);

    svg.append("path")
      .datum(fylker)
      .classed("fylke", true)
      .attr("d", path);

  });

});

/*
function zoomed() {
  features.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  //features.select(".state-border").style("stroke-width", 1.5 / d3.event.scale + "px");
  //features.select(".county-border").style("stroke-width", .5 / d3.event.scale + "px");
}
*/