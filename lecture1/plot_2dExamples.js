$(document).ready(function() {

    function targetDensity(x,y) {
        var sx = 1, sy = 1;
        var mx = 0, my = 0;
        var rho = 0.9;
        var density = 1/(2*Math.PI*sx*sy*Math.sqrt(1-rho*rho)) *
            Math.exp(-1/(2*(1-rho*rho))*(Math.pow(x-mx,2)/(sx*sx)
                                         + Math.pow(y-my,2)/(sy*sy)
                                         - 2*rho*(x-mx)*(y-my)/(sx*sy)));

        return density;
    }

    xvec = [];
    yvec = [];
    for (var xy=-2; xy<=2; xy+=0.05) {
        xvec.push(xy);
        yvec.push(xy);
    }
        
    zmat = [];
    for (var x=-2; x<=2; x+=0.05) {
        var row = [];
        for (var y=-2; y<=2; y+= 0.05) {
            row.push(targetDensity(x,y));
        }
        zmat.push(row);
    }

    var truth = {
        x: xvec,
        y: yvec,
        z: zmat,
        type: 'contour',
        contours: {coloring: 'heatmap'},
        showscale: false
    }

    var layout =  {
        width: 700,
        height: 600,
        margin: {
            t:10
        },
        xaxis: {title: "x"},
        yaxis: {title: "y"},
    };


    Plotly.newPlot('targetDensity2d', [truth], layout, {displayModeBar: false});
});
