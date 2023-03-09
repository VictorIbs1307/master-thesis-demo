import { Kernel } from "./kernel"

/* import Plotly, { PlotlyHTMLElement } from 'plotly.js-dist'; */
var Plotly = require('plotly.js-dist-min')

export class Illustrator {
    plotColors 
    plotNames 
    plotDefaultConfig
    plotDefaultKernelLayout
    plotDefaultFrequencyLayout



    constructor() {
        this.plotColors = ['rgb(255, 0, 0)', 'rgb(0, 255, 0)', 'rgb(0, 0, 255)', 'rgb(148,0,211)'];
        this.plotNames = ['Red', 'Green', 'Blue', 'Alpha'];

        this.plotDefaultConfig = {
            displayModeBar: false,
        };

        this.plotDefaultKernelLayout = {
            xaxis: { range: [0, 1] },
            yaxis: { range: [0, 1] },
            margin: {
                t: 20,
                b: 20,
            }
        };

        this.plotDefaultFrequencyLayout = {
            yaxis: { range: [-10, 256] },
            margin: {
                t: 20,
                b: 20,
            }
        };
    }

    

    initKernelGraph(){
        const plotting_data: string | any[] = [[null], [null], [null]];
        const plotting_labels: any[] = [[null], [null], [null]];

        var plotData = []
        for (var i = 0; i < plotting_data.length; i++) {
            plotData.push({
                x: plotting_labels[i],
                y: plotting_data[i],
                name: this.plotNames[i],
                line: { shape: 'spline', color: this.plotColors[i] },
                type: 'scatter'
            });
        }   
        
        Plotly.newPlot('myDiv', plotData, this.plotDefaultKernelLayout, this.plotDefaultConfig);
    }

    initFrequencyGraph(){
        const plotting_data: string | any[] = [[null], [null], [null], [null]];
        const plotting_labels: any[] = [[null], [null], [null], [null]];

        var plotData = []
        for (var i = 0; i < plotting_data.length; i++) {
            plotData.push({
                x: plotting_labels[i],
                y: plotting_data[i],
                name: this.plotNames[i],
                line: { shape: 'spline', color: this.plotColors[i] },
                type: 'scatter'
            });
        }   
        Plotly.newPlot('myPlot2', plotData, this.plotDefaultFrequencyLayout, this.plotDefaultConfig);
    }

    generatKernelGraph(kernels: Kernel[]) {
        var plotting_data: (number[] | null[])[] = [];
        var plotting_labels: (number[] | null[])[]= [];
        kernels.forEach(kernel_ => {
            const kernel = kernel_.self;
            if (kernel.length == 0) {
                plotting_data.push([null]);
                plotting_labels.push([null]);
                return;
            }

            var xyValues = [];
            var xValues: number[] = [];
            var yValues = [];
            for (var i = 0; i < kernel.length; i++) {
                xyValues.push({ x: i / (kernel.length - 1), y: kernel[i] });
                xValues.push(i / (kernel.length - 1));
                yValues.push(kernel[i]);
            }
            var k = [];
            for (var i = 0; i < kernel.length; i++) {
                k.push(kernel[i] / kernel[0]);
            }

            var k_t = []
            for (var i = 0; i < k.length; i++) {
                k_t.push([k[i]])
            };

            var k_m = this.multiply(k_t, [k]);

            var k_m_sum = k_m.reduce(function(a, b) { return a.concat(b) })
                .reduce(function(a: number, b: number) { return a + b });

            for (var row = 0; row < k_m.length; row++) {
                for (var col = 0; col < k_m[0].length; col++) {
                    k_m[row][col] = k_m[row][col] / k_m_sum;
                }
            }
            plotting_data.push(yValues);
            plotting_labels.push(xValues);
        });
        
        var plotData = []
        
        const allTraces = (document.getElementById('myDiv') as any).data;
        const trace = allTraces.filter((trace: any) => trace.visible === true);

        for (var i = 0; i < plotting_data.length; i++) {
            let isTraceVisible = true;

            if (trace.length != 0)
                isTraceVisible = trace.some((trace: any) => trace.name === this.plotNames[i]);

            plotData.push({
                x: plotting_labels[i],
                y: plotting_data[i],
                name: this.plotNames[i],
                line: { shape: 'spline', color: this.plotColors[i] },
                type: 'scatter',
                visible: isTraceVisible ? true : "legendonly"
            });
        }
        
        Plotly.react('myDiv', plotData, this.plotDefaultKernelLayout, this.plotDefaultConfig );
    }  

    multiply(a: number[][], b: number[][]) {
        var aNumRows = a.length,
            aNumCols = a[0].length,
            /* bNumRows = b.length, */
            bNumCols = b[0].length,
            m = new Array(aNumRows); // initialize array of rows
        for (var r = 0; r < aNumRows; ++r) {
            m[r] = new Array(bNumCols); // initialize the current row
            for (var c = 0; c < bNumCols; ++c) {
                m[r][c] = 0; // initialize the current cell
                for (var i = 0; i < aNumCols; ++i) {
                    m[r][c] += a[r][i] * b[i][c];
                }
            }
        }
        return m;
    }

    generatFrequencyGraph(pixels: ImageData, row: number) {
        var data = pixels.data;
        var w = pixels.width;

        var red = new Array();
        var green = new Array();
        var blue = new Array();
        var alpha = new Array();

        var xValues = [];
        //Read image and make changes on the fly as it's read  
        for (var i = 0 + w * row; i < w * (row + 1); i += 1) {
            xValues.push(i - w * row);
            red[i - w * row] = data[i * 4];
            green[i - w * row] = data[i * 4 + 1];
            blue[i - w * row] = data[i * 4 + 2]; // no change, blue == 0 for black and for yellow
            alpha[i - w * row] = data[i * 4 + 3]; // Again, no change
        }

        var plotData = [];
        var plotting_data = [red, green, blue, alpha];
        var plotting_labels = [xValues, xValues, xValues, xValues];
        //PlotlyHTMLElement
        const allTraces = (document.getElementById('myPlot2') as any).data;
        const trace = allTraces.filter((trace: any) => trace.visible === true);

        for (var i = 0; i < plotting_data.length; i++) {
            let isTraceVisible = true;

            if (trace.length != 0) {
                //Plotly.scatter
                isTraceVisible = trace.some((trace: any) => trace.name === this.plotNames[i]);
            }
            plotData.push({
                x: plotting_labels[i],
                y: plotting_data[i],
                name: this.plotNames[i],
                line: { color: this.plotColors[i] },
                type: 'scatter',
                visible: isTraceVisible ? true : "legendonly"
            });
        }

        Plotly.react('myPlot2', plotData, this.plotDefaultFrequencyLayout, this.plotDefaultConfig);

        // Write the image back to the canvas
        for (var i = 0 + w * (row - 1); i < w * row; i += 1) {
            data[i * 4] = 0;
            data[i * 4 + 1] = 0;
            data[i * 4 + 2] = 0;
            data[i * 4 + 3] = 255;
        }

        for (var i = 0 + w * (row + 2); i < w * (row + 3); i += 1) {
            data[i * 4] = 0;
            data[i * 4 + 1] = 0;
            data[i * 4 + 2] = 0;
            data[i * 4 + 3] = 255;
        }
    }
}