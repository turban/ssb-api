// UTM 33
// https://github.com/mbostock/d3/blob/master/src/geo/albers-usa.js
// http://bl.ocks.org/mbostock/5545680

// http://bl.ocks.org/turban/5866872

d3.geo.norway = function() {

	var projection = d3.geo.transverseMercator()
	    .scale(165)
	    .rotate(15)
	    .clipAngle(90);

	function norway(coordinates) {
		var x = coordinates[0], y = coordinates[1];
		point = null;
 		//(lower48Point(x, y), point) || (alaskaPoint(x, y), point) || hawaiiPoint(x, y);
		return point;
	}

	return norway.scale(165);

};