// #region imports
import { importFileInit } from "./ts/importFile"
import { Filter } from "./ts/filter";
import { Illustrator } from "./ts/illustrations";  
import { Diotres } from "./ts/Elelements/dioptres";
import { KernelSettings } from "./ts/Elelements/kernelSettings";
import { GaussSettings } from "./ts/Elelements/gaussSettings";
import { FilterSettings } from "./ts/Elelements/filterSettings";

// #endregion
// #region variables
let resetButton = document.querySelector<HTMLInputElement>('#reset-all');
const inputConfigFile = document.querySelector<HTMLInputElement>('#input-config-file')
const inputConfigFileButton = document.getElementById('input-config-file-button');

let imageRowSlice = document.querySelector<HTMLInputElement>('#image-row-slice');
let imageRowSliceValue = document.querySelector<HTMLInputElement>('#image-row-slice-value');
let saveButton = document.querySelector<HTMLInputElement>('#save');
let saveConfigButton = document.querySelector<HTMLInputElement>('#saveConfig');



let filter = new Filter();
let illustrator = new Illustrator();

let kernelSettings = new KernelSettings(update);
let gaussSettings = new GaussSettings(update);
let filterSettings = new FilterSettings(update);
let diotres = new Diotres(update);

function init() {
    importFileInit(imageRowSlice!);
    
    
    resetButton!.addEventListener("click", function() {
        resetAllOptions();
        update();
    });

    inputConfigFileButton!.addEventListener('click', () => { 
        inputConfigFile!.click();
    });

    inputConfigFile!.addEventListener('input', () => {
         console.log('File input changed');
        const file = inputConfigFile!.files![0];
        
        const reader = new FileReader();
        reader.onload = () => {
            const fileContent = reader.result as string;
            try {
                const jsonObject = JSON.parse(fileContent);
                jsonObject.settings.forEach((element: any, i: number) => {
                    filterSettings.updateFilterTypeValue(i, element.filterType);
                    filterSettings.updateBlurOrSharpenCheckboxValue(i, element.blurOrSharpenCheckbox);
                    filterSettings.updateTimesFilterAppliedTypeValue(i, element.timeFiltersApllied); 
                    kernelSettings.updateValue(i, element.kernelSize);
                    gaussSettings.updateSigmaValue(i, element.sigma);
                    gaussSettings.updateSigma2Value(i, element.sigma2);
                });
                update();
            } catch (error) {
                console.log('Error parsing JSON');
            }
        };
        reader.readAsText(file);
        inputConfigFile!.value = "";
    });

    

    imageRowSlice!.addEventListener('input', function() {
        imageRowSliceValue!.value = imageRowSlice!.value;
        update();
    }, false);

    saveButton!.addEventListener('click', () => {
        const canvas = document.getElementById("HiddenCanvas") as HTMLCanvasElement;
        var context = canvas.getContext('2d');
        var pixels = context!.getImageData(0, 0, canvas.width, canvas.height);

        const timeFiltersAplliedValuesArray = filterSettings.timeFilterAplliedValues; //Array.from(timeFiltersApllied).map(input => parseInt(input.value));
        filter.applyToImage(pixels, timeFiltersAplliedValuesArray);

        var canvas2 = document.createElement('canvas');
        canvas2.width = pixels.width;
        canvas2.height = pixels.height;

        var context2 = canvas2.getContext('2d');
        context2!.putImageData(pixels, 0, 0);

        const filename = window.prompt('Enter a filename', 'image.png');
        if (filename) {
            const downloadLink = document.createElement('a');
            downloadLink.setAttribute('download', filename);
            const dataURL = canvas2.toDataURL('image/png');
            downloadLink.setAttribute('href', dataURL);
            downloadLink.click();
        }

    });

    saveConfigButton!.addEventListener('click', () => {
        let contentJson = {
            settings: Array()
        };
        filterSettings.colorOptionMenuTabButtons.forEach((element, i) => {
            contentJson.settings.push({
                name: element.innerHTML,
                filterType: filterSettings.filterTypeValues[i],//filterTypes[i].value,
                blurOrSharpenCheckbox: filterSettings.blurOrSharpenCheckboxValues[i],//blurOrSharpenCheckboxs[i].checked,
                kernelSize: filter.kernels[i].kernelSize,
                sigma: gaussSettings.sigmaValues[i],
                sigma2: gaussSettings.sigma2Values[i],
                timeFiltersApllied: filterSettings.filterTypeValues[i], //timeFiltersApllied[i].value,
            });
        });
        const contentString = JSON.stringify(contentJson);
        const link = document.createElement("a");
        const file = new Blob([contentString], { type: 'text/plain' });
        link.href = URL.createObjectURL(file);
        link.download = "config.txt";
        link.click();
        URL.revokeObjectURL(link.href);
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
        kernel.subtract = filterSettings.blurOrSharpenCheckboxValues[i];
        
        switch (filterSettings.filterTypeValues[i]) {
            case "gauss":
                kernel.initGauss(gaussSettings.sigmaValues[i], gaussSettings.sigma2Values[i], kernelSettings.values[i]);
                break;
            case "boxBlur":
                kernel.initBoxKernel(kernelSettings.values[i]);
                break;  
            case "cylinderBlur":
                kernel.createCircularKernel(kernelSettings.values[i], kernelSettings.values[i]);
                break;
            default:
                console.log("Invalid filter type: " + filterSettings.filterTypeValues[i]);
                break;
        } 
    });
    
}

function applyKernel() {
    // Get data from imported image
    const canvas = document.getElementById("Mycanvas") as HTMLCanvasElement;
    var context = canvas.getContext('2d');
    var pixels = context!.getImageData(0, 0, canvas.width, canvas.height);

    const timeFiltersAplliedValuesArray =  filterSettings.timeFilterAplliedValues; //Array.from(timeFiltersApllied).map(input => parseInt(input.value));

    filter.applyToImage(pixels, timeFiltersAplliedValuesArray);
    illustrator.generatKernelGraph(filter.kernels);
    illustrator.generatFrequencyGraph(pixels, parseInt(imageRowSlice!.value));

    // Show the processed image
    const canvas2 = document.getElementById("ProcessCanvas") as HTMLCanvasElement;
    var context = canvas2.getContext('2d');
    context!.putImageData(pixels, 0, 0);
}

function resetAllOptions() {
    kernelSettings.reset();
    gaussSettings.reset()
    filterSettings.reset();
    
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