export class FilterSettings {
    private _timeFiltersAplliedSlider: NodeListOf<HTMLInputElement>;
    private _timeFiltersAplliedLabels: NodeListOf<HTMLInputElement>;
    private _filterTypeDropdownFields: NodeListOf<HTMLInputElement>;
    private _blurOrSharpenCheckboxs: NodeListOf<HTMLInputElement>;
    private _colorOptionMenuTabButtons: NodeListOf<HTMLInputElement>;
    private _colorOptionMenus:  NodeListOf<HTMLElement>

    private _timeFilterAplliedValues: number[];
    private _filterTypeValues: string[];
    private _blurOrSharpenCheckboxValues: boolean[];

    private _resetSliderValue: string = "0";
    private _resetCheckboxValue: boolean = false;

//#region get & set
    //TODO: Can this be change to return a list of "names" istead?
    get colorOptionMenuTabButtons(): NodeListOf<HTMLInputElement>{
        return this._colorOptionMenuTabButtons;
    }

    get timeFilterAplliedValues(): number[] {
        return this._timeFilterAplliedValues;
    }
    get filterTypeValues(): string[] {
        return this._filterTypeValues;
    }
    get blurOrSharpenCheckboxValues(): boolean[] {
        return this._blurOrSharpenCheckboxValues;
    }
//#endregion

    constructor(callback: () => void) {
        this._timeFiltersAplliedSlider = document.querySelectorAll<HTMLInputElement>('[id=time-filter-applied]');
        this._timeFiltersAplliedLabels = document.querySelectorAll<HTMLInputElement>('[id=time-filter-applied-value]');
        this._filterTypeDropdownFields = document.querySelectorAll<HTMLInputElement>('[id=filterType]');
        this._blurOrSharpenCheckboxs = document.querySelectorAll<HTMLInputElement>('[id=blurOrSharpenCheckbox]');
        this._colorOptionMenuTabButtons = document.querySelectorAll<HTMLInputElement>('[id=colorOptionMenuTab]');
        this._colorOptionMenus = document.querySelectorAll<HTMLElement>('[id=colorOptionMenu]');
        
        this._timeFilterAplliedValues = new Array<number>(this._timeFiltersAplliedSlider.length).fill(0);
        this._filterTypeValues = new Array<string>(this._filterTypeDropdownFields.length).fill("");
        this._blurOrSharpenCheckboxValues = new Array<boolean>(this._blurOrSharpenCheckboxs.length).fill(false);


        this._timeFiltersAplliedSlider.forEach((slider: HTMLInputElement, i: number) => {
            slider.addEventListener("input", () => {
                this._timeFiltersAplliedLabels[i].value = slider.value;
                this._timeFilterAplliedValues[i] = parseFloat(slider.value); 
                callback();
            });
        });

        this._filterTypeDropdownFields.forEach((dropdownField: HTMLInputElement, i: number) => {
            dropdownField.addEventListener("change", () => {
                this._filterTypeValues[i] = dropdownField.value;
                callback();
            });
        });

        this._blurOrSharpenCheckboxs.forEach((checkbox: HTMLInputElement, i: number) => {
            checkbox.addEventListener("change", () => {
                this._blurOrSharpenCheckboxValues[i] = checkbox.checked;
                callback();
            });
        });
        

        const buttonColorClasses = ["bg-red-200", "bg-green-200", "bg-blue-200", "bg-gray-300"];
        this._colorOptionMenuTabButtons.forEach((button: HTMLInputElement) => {
            button.addEventListener('click', () => {
                
                // Turn all non-clicked buttons grey
                this._colorOptionMenuTabButtons.forEach((otherButton: HTMLInputElement, i: number) => {
                    otherButton.classList.remove(...buttonColorClasses);

                    if (otherButton !== button) {
                        otherButton.classList.add(buttonColorClasses[3]);
                        this._colorOptionMenus[i].style.display = "none";
                        return;
                    }
                    
                    otherButton.classList.add(buttonColorClasses[i]);
                    this._colorOptionMenus[i].style.display = "flex";
                    
                });
            });
        });
    }

    // public updateValue(index: number, value: string){
    //     this._values[index] = parseFloat(value); 
    //     this._sliders[index].value = value;
    //     if(value === "0"){
    //         this._sliderLabels[index].value = "auto";
    //         return;
    //     }
    //     this._sliderLabels[index].value = value
    // }

    public reset(){
        for (let i = 0; i < this._timeFiltersAplliedSlider.length; i++) {
            this._timeFiltersAplliedLabels[i].value = this._resetSliderValue;
            this._timeFiltersAplliedSlider[i].value = this._resetSliderValue;
            this._timeFilterAplliedValues[i] = parseFloat(this._resetSliderValue);
        };

        this._blurOrSharpenCheckboxs.forEach((checkbox: HTMLInputElement, i: number) => {
            checkbox.checked = this._resetCheckboxValue;
            this._blurOrSharpenCheckboxValues[i] = this._resetCheckboxValue;
        });
    }
}