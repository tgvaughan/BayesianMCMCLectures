$(document).ready(function() {
    var data = {x: [], y: [], showlegend: false};
    var acc = 0;
    for (var m=3; m<=100; m+=1) {
        acc = acc + Math.log10(2*m-3)
        data.x.push(m);
        data.y.push(acc);
    }

    var guide = {x: [0,100], y:[100,100], mode: "lines", name: "Particles in universe", showlegend: true};

    var layout =  {
        width: 900,
        height: 400,
        margin: {
            t:10
        },
        xaxis: {
            title: "Leaf/sequence count",
        },
        yaxis: {
            title: "log<sub>10</sub>(Number of topologies)"
        },
    };


    Plotly.plot("treecount", [data, guide], layout, {displayModeBar: false});
});
