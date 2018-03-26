var generate2dTraces;

$(document).ready(function() {

    function targetDensity(x,y) {
        var sx = 1, sy = 1;
        var mx = 0, my = 0;
        var rho = 0.95;
        var density = 1/(2*Math.PI*sx*sy*Math.sqrt(1-rho*rho)) *
            Math.exp(-1/(2*(1-rho*rho))*(Math.pow(x-mx,2)/(sx*sx)
                                         + Math.pow(y-my,2)/(sy*sy)
                                         - 2*rho*(x-mx)*(y-my)/(sx*sy)));

        return density;
    }

    var lower=-3, upper=3;

    xvec = [];
    yvec = [];
    for (var xy=lower; xy<=upper; xy+=0.05) {
        xvec.push(xy);
        yvec.push(xy);
    }
        
    zmat = [];
    for (var x=lower; x<=upper; x+=0.05) {
        var row = [];
        for (var y=lower; y<=upper; y+= 0.05) {
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
        height: 400,
        margin: {
            t:10,b:40
        },
        xaxis: {title: "x1"},
        yaxis: {title: "x2"},
    };

    Plotly.newPlot('targetDensity2d', [truth], layout, {displayModeBar: false});


    generate2dTraces = function() {

        // MCMC
        function doMCMC(targetDensity, proposal, N, x0, y0) {


            var x = [x0];
            var y = [y0];
            var currentP = targetDensity(x0, y0);

            for (var iter=1; iter<N; iter+=1) {
                prime = proposal(x[iter-1], y[iter-1])

                var newP = targetDensity(prime.x, prime.y);

                var alpha = newP/currentP;

                if (alpha>1 || Math.random()<alpha) {
                    x.push(prime.x)
                    y.push(prime.y)
                    currentP = newP;
                } else {
                    x.push(x[iter-1]);
                    y.push(y[iter-1]);
                }
            }

            return({x: x, y: y,
                    mode: 'markers+lines',
                    type: 'scatter'})
        }

        function makeProposal(w) {
            return function(x, y) {
                var xp, yp;

                if (Math.random()<0.5) {
                    xp = x + w*(Math.random()-0.5);
                    yp = y;
                } else {
                    xp = x;
                    yp = y + w*(Math.random()-0.5);
                }

                return {x: xp, y: yp}
            }
        }

        var mcmcTrace = doMCMC(targetDensity, makeProposal(2), 200, 2,-2);

        var traceLayout =  {
            width: 800,
            height: 600,
            margin: {
                t:10,b:40
            },
            xaxis: {title: "x1"},
            yaxis: {title: "x2"},
        };

        // Need to create new object here for some reason
        truth = {
            x: xvec,
            y: yvec,
            z: zmat,
            type: 'contour',
            contours: {coloring: 'heatmap'},
            showscale: false
        }

        Plotly.newPlot("mcmcTrace2dFirstTry", [truth, mcmcTrace], traceLayout, {displayModeBar: false});


        function makeBetterProposal(w,v) {
            return function(x, y) {
                var xp, yp;

                var u = Math.random();

                if (u < 1/3) {
                    xp = x + w*(Math.random()-0.5);
                    yp = y;
                } else {
                    if (u < 2/3) {
                        xp = x;
                        yp = y + w*(Math.random()-0.5);
                    } else {
                        a = v*(Math.random()-0.5);
                        xp = x + a;
                        yp = y + a;
                    }
                }

                return {x: xp, y: yp}
            }
        }

        var mcmcTrace2 = doMCMC(targetDensity, makeBetterProposal(2,2), 200, 2,-2);
        Plotly.newPlot("mcmcTrace2dBetter", [truth, mcmcTrace2], traceLayout, {displayModeBar: false});
    }

    generate2dTraces();
});
