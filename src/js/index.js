// #region imports
import { importFileInit } from "./importFile.js"
import { Filter } from "./filter.js";
import { Illustrator } from "./illustrations.js";
// #endregion
// #region variables
let resetButton = document.getElementById('reset-all');

let kernelSizes = document.querySelectorAll('[id=kernal-size]');
let sigmas = document.querySelectorAll('[id=sigma]');
let sigmas2 = document.querySelectorAll('[id=sigma2]');
let timeFiltersApllied = document.querySelectorAll('[id=time-filter-applied]');
let filterTypes = document.querySelectorAll('[id=filterType]');
let imageRowSlice = document.getElementById('image-row-slice');
let blurOrSharpenCheckboxs = document.querySelectorAll('[id=blurOrSharpenCheckbox]');

let kernalSizesValues = document.querySelectorAll('[id=kernal-size-value]');
let sigmaValues = document.querySelectorAll('[id=sigma-value]');
let sigmaValues2 = document.querySelectorAll('[id=sigma-value2]');
let timeFiltersAplliedValues = document.querySelectorAll('[id=time-filter-applied-value]');
let imageRowSliceValue = document.getElementById('image-row-slice-value');
let saveButton = document.getElementById('save');

let filter = new Filter();
let illustrator = new Illustrator();

// #endregion

function init() {
    importFileInit(imageRowSlice);

    resetButton.addEventListener("click", function() {
        resetAllOptions();
    });

    for (let i = 0; i < kernelSizes.length; i++) {
        kernelSizes[i].addEventListener('input', function() {
            kernalSizesValues[i].value = kernelSizes[i].value;
            update();
        }, false);
    };

    for (let i = 0; i < sigmas.length; i++) {
        sigmas[i].addEventListener('input', function() {
            sigmaValues[i].value = sigmas[i].value;
            update();
        }, false);
    };

    for (let i = 0; i < sigmas2.length; i++) {
        sigmas2[i].addEventListener('input', function() {
            sigmaValues2[i].value = sigmas2[i].value;
            update();
        }, false);
    };

    for (let i = 0; i < timeFiltersApllied.length; i++) {
        timeFiltersApllied[i].addEventListener('input', function() {
            timeFiltersAplliedValues[i].value = timeFiltersApllied[i].value;
            update();
        }, false);
    };

    for (let i = 0; i < filterTypes.length; i++) {
        filterTypes[i].addEventListener("change", (event) => {
            update();
        });
    };

    for (let i = 0; i < blurOrSharpenCheckboxs.length; i++) {
        blurOrSharpenCheckboxs[i].addEventListener("change", (event) => {
            update();
        });
    };

    imageRowSlice.addEventListener('input', function() {
        imageRowSliceValue.value = imageRowSlice.value;
        update();
    }, false);

    saveButton.addEventListener('click', function (e) {
        const canvas = document.getElementById("Mycanvas");
        const filename = window.prompt('Enter a filename', 'image.png');
        if (filename) {
            const downloadLink = document.createElement('a');
            downloadLink.setAttribute('download', filename);
            const dataURL = canvas.toDataURL('image/png');
            downloadLink.setAttribute('href', dataURL);
            downloadLink.click();
        }
    });

    illustrator.initKernelGraph();
    illustrator.initFrequencyGraph();
}


function update() {
    createKernels();
    applyKernel();
}

function createKernels(){
    filter.kernels.forEach((kernel, i) => {
        kernel.subtract = blurOrSharpenCheckboxs[i].checked;

        switch (filterTypes[i].value) {
            case "gauss":
                kernel.initGauss(sigmas[i].value, sigmas2[i].value, parseInt(kernelSizes[i].value));
                break;
            case "boxBlur":
                kernel.initBoxKernel(parseInt(kernelSizes[i].value));
                break;
            default:
                console.log("Invalid filter type");
                break;
        } 
    });
    
}

function applyKernel() {
    // Get data from imported image
    const canvas = document.getElementById("Mycanvas");
    var context = canvas.getContext('2d');
    var pixels = context.getImageData(0, 0, canvas.width, canvas.height);

    filter.applyToImage(pixels);
    illustrator.generatKernelGraph(filter.kernels);
    illustrator.generatFrequencyGraph(pixels, parseInt(imageRowSlice.value));

    // Show the processed image
    const canvas2 = document.getElementById("ProcessCanvas");
    var context = canvas2.getContext('2d');
    context.putImageData(pixels, 0, 0);
}

function resetAllOptions() {
    for (let i = 0; i < kernelSizes.length; i++) {
        kernalSizesValues[i].value = 0;
        kernelSizes[i].value = 0;
    };

    for (let i = 0; i < sigmas.length; i++) {
        sigmaValues[i].value = 0;
        sigmas[i].value = 0;
    };

    for (let i = 0; i < timeFiltersApllied.length; i++) {
        timeFiltersAplliedValues[i].value = 0;
        timeFiltersApllied[i].value = 0;
    };
    imageRowSliceValue.value = 0;
    imageRowSlice.value = 0;

    // Get data from imported image
    const canvas = document.getElementById("Mycanvas");
    var context = canvas.getContext('2d');
    var pixels = context.getImageData(0, 0, canvas.width, canvas.height);

    // Show the processed image
    const canvas2 = document.getElementById("ProcessCanvas");
    var context = canvas2.getContext('2d');
    context.putImageData(pixels, 0, 0);
}

init()