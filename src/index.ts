// #region imports
import { importFileInit } from "./ts/importFile"
import { Filter } from "./ts/filter";
import { Illustrator } from "./ts/illustrations";  
// #endregion
// #region variables
let resetButton = document.querySelector<HTMLInputElement>('#reset-all');

let kernelSizes = document.querySelectorAll<HTMLInputElement>('[id=kernal-size]');
let sigmas = document.querySelectorAll<HTMLInputElement>('[id=sigma]');
let sigmas2 = document.querySelectorAll<HTMLInputElement>('[id=sigma2]');
let timeFiltersApllied = document.querySelectorAll<HTMLInputElement>('[id=time-filter-applied]');
let filterTypes = document.querySelectorAll<HTMLInputElement>('[id=filterType]');
let imageRowSlice = document.querySelector<HTMLInputElement>('#image-row-slice');
let blurOrSharpenCheckboxs = document.querySelectorAll<HTMLInputElement>('[id=blurOrSharpenCheckbox]');

let kernalSizesValues = document.querySelectorAll<HTMLInputElement>('[id=kernal-size-value]');
let sigmaValues = document.querySelectorAll<HTMLInputElement>('[id=sigma-value]');
let sigmaValues2 = document.querySelectorAll<HTMLInputElement>('[id=sigma-value2]');
let timeFiltersAplliedValues = document.querySelectorAll<HTMLInputElement>('[id=time-filter-applied-value]');
let imageRowSliceValue = document.querySelector<HTMLInputElement>('#image-row-slice-value');
let saveButton = document.querySelector<HTMLInputElement>('#save');

let colorOptionMenuTabButtons = document.querySelectorAll<HTMLInputElement>('[id=colorOptionMenuTab]');
let colorOptionMenus = document.querySelectorAll<HTMLElement>('[id=colorOptionMenu]');

let filter = new Filter();
let illustrator = new Illustrator();
 
// #endregion

function init() {
    importFileInit(imageRowSlice!);

    resetButton!.addEventListener("click", function() {
        resetAllOptions();
    });

    for (let i = 0; i < kernelSizes.length; i++) {
        kernelSizes[i].addEventListener('input', function() {
            if(kernelSizes[i].value === "0"){
                kernalSizesValues[i].value = "auto";
            }
            else {
                kernalSizesValues[i].value = kernelSizes[i].value;
            }
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
            if(sigmas2[i].value === "0"){
                sigmaValues2[i].value = "auto";
            }
            else {
                sigmaValues2[i].value = sigmas2[i].value;
            }
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
        filterTypes[i].addEventListener("change", () => {
            update();
        });
    };

    for (let i = 0; i < blurOrSharpenCheckboxs.length; i++) {
        blurOrSharpenCheckboxs[i].addEventListener("change", () => {
            update();
        });
    };

    imageRowSlice!.addEventListener('input', function() {
        imageRowSliceValue!.value = imageRowSlice!.value;
        update();
    }, false);

    saveButton!.addEventListener('click', () => {
        const canvas = document.getElementById("Mycanvas") as HTMLCanvasElement;
        const filename = window.prompt('Enter a filename', 'image.png');
        if (filename) {
            const downloadLink = document.createElement('a');
            downloadLink.setAttribute('download', filename);
            const dataURL = canvas.toDataURL('image/png');
            downloadLink.setAttribute('href', dataURL);
            downloadLink.click();
        }
    });

    const buttonColorClasses = ["bg-red-200", "bg-green-200", "bg-blue-200", "bg-gray-300"];
    colorOptionMenuTabButtons.forEach(button => {
        button.addEventListener('click', () => {
            
            // Turn all non-clicked buttons grey
            colorOptionMenuTabButtons.forEach((otherButton,i) => {
                otherButton.classList.remove(...buttonColorClasses);

                if (otherButton !== button) {
                    otherButton.classList.add(buttonColorClasses[3]);
                    colorOptionMenus[i].style.display = "none";
                }
                else {
                    otherButton.classList.add(buttonColorClasses[i]);
                    colorOptionMenus[i].style.display = "flex";
                }
            });
        });
    });

    illustrator.initKernelGraph();
    illustrator.initFrequencyGraph();  
}


function update() {
    createKernels();
    applyKernel(); 
}

function createKernels(){
    filter.kernels.forEach((kernel, i: number) => {
        kernel.subtract = blurOrSharpenCheckboxs[i].checked;
        
        switch (filterTypes[i].value) {
            case "gauss":
                kernel.initGauss(parseFloat(sigmas[i].value), parseFloat(sigmas2[i].value), parseFloat(kernelSizes[i].value));
                break;
            case "boxBlur":
                kernel.initBoxKernel(parseFloat(kernelSizes[i].value));
                break;
            default:
                console.log("Invalid filter type");
                break;
        } 
    });
    
}

function applyKernel() {
    // Get data from imported image
    const canvas = document.getElementById("Mycanvas") as HTMLCanvasElement;
    var context = canvas.getContext('2d');
    var pixels = context!.getImageData(0, 0, canvas.width, canvas.height);

    const timeFiltersAplliedValuesArray = Array.from(timeFiltersApllied).map(input => parseInt(input.value));

    filter.applyToImage(pixels, timeFiltersAplliedValuesArray);
    illustrator.generatKernelGraph(filter.kernels);
    illustrator.generatFrequencyGraph(pixels, parseInt(imageRowSlice!.value));

    // Show the processed image
    const canvas2 = document.getElementById("ProcessCanvas") as HTMLCanvasElement;
    var context = canvas2.getContext('2d');
    context!.putImageData(pixels, 0, 0);
}

function resetAllOptions() {
    for (let i = 0; i < kernelSizes.length; i++) {
        kernalSizesValues[i].value = "0";
        kernelSizes[i].value = "0";
    };

    for (let i = 0; i < sigmas.length; i++) {
        sigmaValues[i].value = "0";
        sigmas[i].value = "0";
    };

    for (let i = 0; i < timeFiltersApllied.length; i++) {
        timeFiltersAplliedValues[i].value = "0";
        timeFiltersApllied[i].value = "0";
    };
    imageRowSliceValue!.value = "0";
    imageRowSlice!.value = "0";

    // Get data from imported image
    const canvas = document.getElementById("Mycanvas") as HTMLCanvasElement;
    var context = canvas.getContext('2d');
    var pixels = context!.getImageData(0, 0, canvas.width, canvas.height);

    // Show the processed image
    const canvas2 = document.getElementById("ProcessCanvas") as HTMLCanvasElement;
    var context = canvas2.getContext('2d');
    context!.putImageData(pixels, 0, 0);
}
 
init() 