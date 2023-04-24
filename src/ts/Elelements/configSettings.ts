export class ConfigSettings {
    private _inputConfigFile: HTMLInputElement | null;
    private _inputConfigFileButton: HTMLElement | null;
    private _saveConfigButton: HTMLElement | null;

    constructor(callback: () => void) {
        this._inputConfigFile = document.querySelector<HTMLInputElement>('#input-config-file')
        this._inputConfigFileButton = document.getElementById('input-config-file-button');
        this._saveConfigButton = document.querySelector<HTMLInputElement>('#saveConfig');
        
        this._inputConfigFileButton!.addEventListener('click', () => { 
            this._inputConfigFile!.click();
        });

        this._inputConfigFile!.addEventListener('change', () => {
            const file = this._inputConfigFile!.files![0];
            const reader = new FileReader();
            reader.onload = () => {
                const fileContent = reader.result as string;
                try {
                    const jsonObject = JSON.parse(fileContent);
                    jsonObject.settings.forEach((element: any, i: number) => {
                        filterTypes[i].value = element.filterType;
                        blurOrSharpenCheckboxs[i].checked = element.blurOrSharpenCheckbox;
                        kernelSizes.sliders[i].value = element.kernelSize;
                        kernelSizes.sliderLabels[i].value = element.kernelSize;
                        gaussSettings.sigmaValues[i] = element.sigma;
                        gaussSettings.sigmaSliderLabels[i].value = element.sigma;
                        gaussSettings.sigma2Values[i] = element.sigma2;
                        gaussSettings.sigma2SliderLabels[i].value = element.sigma2;
                        timeFiltersApllied[i].value = element.timeFiltersApllied; 
                        timeFiltersAplliedValues[i].value = element.timeFiltersApllied; 
                    });
                    callback();
                } catch (error) {
                    console.log('Error parsing JSON');
                }
            };
            reader.readAsText(file);
        });

        this._saveConfigButton!.addEventListener('click', () => {
        let contentJson = {
            settings: Array()
        };
        this._colorOptionMenuTabButtons.forEach((element, i) => {
            contentJson.settings.push({
                name: element.innerHTML,
                filterType: filterTypes[i].value,
                blurOrSharpenCheckbox: blurOrSharpenCheckboxs[i].checked,
                kernelSize: filter.kernels[i].kernelSize,
                sigma: gaussSettings.sigmaValues[i],
                sigma2: gaussSettings.sigma2Values[i],
                timeFiltersApllied: timeFiltersApllied[i].value,
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
    }
}


    

