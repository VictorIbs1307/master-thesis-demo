// #region imports
import { importFileInit } from "./ts/importFile"
import { Filter } from "./ts/filter";
import { Illustrator } from "./ts/illustrations";  
import { DiotresSettings } from "./ts/Elelements/dioptres";
import { KernelSettings } from "./ts/Elelements/kernelSettings";
import { GaussSettings } from "./ts/Elelements/gaussSettings";
import { FilterSettings } from "./ts/Elelements/filterSettings";
import { CanvasManager } from "./ts/Elelements/canvasManager";
import { FilterDioptre } from "./ts/filterDioptre";

// #endregion
// #region variables
let resetMenuButton = document.querySelector<HTMLInputElement>('#resetFilterMenuButton');
let resetCancelButton = document.querySelector<HTMLInputElement>('#resetCancelButton');
let resetConfirmButton = document.querySelector<HTMLInputElement>('#resetConfirmButton');
let resetConfirmMenu = document.querySelector<HTMLInputElement>('#resetConfirmMenu');

const inputConfigFile = document.querySelector<HTMLInputElement>('#input-config-file')
const inputConfigFileButton = document.getElementById('input-config-file-button');

let imageRowSlice = document.querySelector<HTMLInputElement>('#image-row-slice');
let imageRowSliceValue = document.querySelector<HTMLInputElement>('#image-row-slice-value');
let saveButton = document.querySelector<HTMLInputElement>('#save');
let saveConfigButton = document.querySelector<HTMLInputElement>('#saveConfig');



let filter = new Filter();
let filterDioptre = new FilterDioptre();
let illustrator = new Illustrator();

let kernelSettings = new KernelSettings(update);
let gaussSettings = new GaussSettings(update);
let filterSettings = new FilterSettings(update);
let diotresSettings = new DiotresSettings(update);

let canvasManager = new CanvasManager();

let isPlayground = false;

function init() {
    importFileInit(imageRowSlice!);


    resetConfirmButton!.addEventListener("click", function() {
        resetOptions(true);
        update(false);
        illustrator.initKernelGraph();
        resetConfirmMenu!.classList.add("hidden");
    });

    resetMenuButton!.addEventListener("click", function() {
        resetConfirmMenu!.classList.remove("hidden");
    });

    resetCancelButton!.addEventListener("click", function() {
        resetConfirmMenu!.classList.add("hidden");
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
                update(false);
            } catch (error) {
                console.log('Error parsing JSON');
            }
        };
        reader.readAsText(file);
        inputConfigFile!.value = "";
    });

    

    imageRowSlice!.addEventListener('input', function() {
        imageRowSliceValue!.value = imageRowSlice!.value;
        update(isPlayground);
    }, false);

    saveButton!.addEventListener('click', () => {
        var pixels = canvasManager.getHiddenImageData();
        
        if(!isPlayground){
            filterDioptre.applyToImage(pixels);
        }
        else {
            const timeFiltersAplliedValuesArray = filterSettings.timeFilterAplliedValues; //Array.from(timeFiltersApllied).map(input => parseInt(input.value));
            filter.applyToImage(pixels, timeFiltersAplliedValuesArray);
        }

        var newCanvas = canvasManager.createNewCanvas(pixels);
        
        const filename = window.prompt('Enter a filename', 'image.png');
        if (filename) {
            const downloadLink = document.createElement('a');
            downloadLink.setAttribute('download', filename);
            const dataURL = newCanvas.toDataURL('image/png');
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

function diotreTester(){
    
    filterDioptre.kernels.forEach((kernel, i) => {
        const kernelSize = diotresSettings.calculateKernelSize(i); 
        /* kernel.createCircularKernel(kernelSize); */ 
        if(kernelSize == 0){
            kernel.createCircularKernel(0);
            //kernel.createGaussianKernel2D(5, 5/7);   
        }
        else {
            kernel.createCircularKernel(kernelSize); 
        }
    });

    let pixels = canvasManager.getOrginalImageData();
    
    filterDioptre.applyToImage(pixels);

    illustrator.generatFrequencyGraph(pixels, parseInt(imageRowSlice!.value));

    canvasManager.setProcessCanvasImageData(pixels);
}

function update(newIsPlayground: boolean) {
    isPlayground = newIsPlayground;
    resetOptions(false);
    if(!isPlayground){
        diotreTester();
        
        return
    }

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
/*             case "cylinderBlur":
                kernel.createCircularKernel(kernelSettings.values[i]);
                break; */
            default:
                console.log("Invalid filter type: " + filterSettings.filterTypeValues[i]);
                break;
        } 
    });
    
}

function applyKernel() {
    let pixels = canvasManager.getOrginalImageData();

    filter.applyToImage(pixels, filterSettings.timeFilterAplliedValues);

    illustrator.generatKernelGraph(filter.kernels);
    illustrator.generatFrequencyGraph(pixels, parseInt(imageRowSlice!.value));

    canvasManager.setProcessCanvasImageData(pixels);
}

function resetOptions(resetAll: boolean) {
    if (resetAll) {
        kernelSettings.reset();
        gaussSettings.reset();
        filterSettings.reset();
        diotresSettings.reset();
        imageRowSliceValue!.value = "0";
        imageRowSlice!.value = "0";
        canvasManager.reset(); 
        return;
    } 
    if (!isPlayground) {
        kernelSettings.reset();
        gaussSettings.reset();
        filterSettings.reset();
        return;
    } 
    diotresSettings.reset();
        
      
}
 
init() 