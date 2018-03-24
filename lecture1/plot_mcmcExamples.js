$(document).ready(function() {

    function targetDensity(x) {
        var logDensity1 = -0.5*Math.log(2*Math.PI) - 0.5*Math.pow(x+3,2);
        var logDensity2 = -0.5*Math.log(2*Math.PI) - 0.5*Math.pow(x-2,2);
        return(0.2*Math.exp(logDensity1) + 0.8*Math.exp(logDensity2));
    }

    var truth = {x: [], y: [], showlegend: false, name: "truth"};
    var acc = 0;
    for (var x=-10; x<=10; x+=0.1) {
        truth.x.push(x);
        truth.y.push(targetDensity(x));
    }

    var layout =  {
        width: 900,
        height: 300,
        margin: {
            t:10
        },
        xaxis: {
            title: "x",
        },
        yaxis: {
            title: "p(x)"
        },
    };


    Plotly.plot("targetDensity", [truth], layout, {displayModeBar: false});

    // MCMC
    function doMCMC(targetDensity, w, N, x0) {

        function proposal(x, w) {
            return(x + w*(Math.random()-0.5));
        }

        var x = [x0];
        var samples = [0];
        var currentP = targetDensity(x0);

        for (var iter=1; iter<N; iter+=1) {
            var xp = proposal(x[iter-1], w)

            var newP = targetDensity(xp);

            var alpha = newP/currentP;

            if (alpha>1 || Math.random()<alpha) {
                x.push(xp)
                currentP = newP;
            } else {
                x.push(x[iter-1]);
            }

            samples.push(iter);
        }

        return({y: x, x: samples})
    }

    var mcmcTrace = doMCMC(targetDensity, 3, 2000, -10);
    
    Plotly.plot("mcmcTrace", [mcmcTrace], {width: 1000,
                                           height: 500,
                                           margin: {t:10},
                                           xaxis: {title: "Iteration"},
                                           yaxis: {title: "x"}},
                {displayModeBar: false});
    
    var N = 5000;
    var mcmcTrace1 = doMCMC(targetDensity, 1, N, -10);
    var mcmcTrace2 = doMCMC(targetDensity, 3, N, -10);
    var mcmcTrace3 = doMCMC(targetDensity, 5, N, -10);

     var layout =  {
        width: 700,
        height: 150,
        margin: {t:10,b:30},
        xaxis: {
            title: "Iteration",
        },
        yaxis: {
            title: "x"
        },
    };
   
    Plotly.plot("mcmcTrace_w1", [mcmcTrace1], layout, {displayModeBar: false});
    Plotly.plot("mcmcTrace_w2", [mcmcTrace2], layout, {displayModeBar: false});
    Plotly.plot("mcmcTrace_w3", [mcmcTrace3], layout, {displayModeBar: false});

    function getHistogram(mcmcTrace) {
        return {x: mcmcTrace.y,
                type: 'histogram', histnorm: 'probability density'}
    }

    var densityLayout =  {
        width: 300,
        height: 150,
        margin: {t:10,b:30,l:30},
        xaxis: {
            title: "x",
        },
        yaxis: {
            title: ""
        },
        showlegend: false
    };


    Plotly.plot("mcmcDensity_w1", [getHistogram(mcmcTrace1), truth], densityLayout, {displayModeBar: false});
    Plotly.plot("mcmcDensity_w2", [getHistogram(mcmcTrace2), truth], densityLayout, {displayModeBar: false});
    Plotly.plot("mcmcDensity_w3", [getHistogram(mcmcTrace3), truth], densityLayout, {displayModeBar: false});
    
});
