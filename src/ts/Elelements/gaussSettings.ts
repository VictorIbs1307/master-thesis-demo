export class GaussSettings {
    private _sigmaSliders: NodeListOf<HTMLInputElement>;
    private _sigma2Sliders: NodeListOf<HTMLInputElement>;

    private _sigmaSliderLabels: NodeListOf<HTMLInputElement>;
    private _sigma2SliderLabels: NodeListOf<HTMLInputElement>;

    private _sigmaValues: number[];
    private _sigma2Values: number[];

    private _resetValue: string = "0";

//#region get & set
    get sigmaSliderLabels(): NodeListOf<HTMLInputElement> {
        return this._sigmaSliderLabels;
    }
    get sigma2SliderLabels(): NodeListOf<HTMLInputElement> {
        return this._sigma2SliderLabels;
    }


    get sigmaValues(): number[] {
        return this._sigmaValues;
    }
    set sigmaValues(value: number[]) {
        this._sigmaValues = value;
    }
    get sigma2Values(): number[] {
        return this._sigma2Values;
    }
    set sigma2Values(value: number[]) {
        this._sigma2Values = value;
    }
//#endregion

    constructor(callback: () => void) {
        this._sigmaSliders = document.querySelectorAll<HTMLInputElement>('[id=sigma]');
        this._sigma2Sliders = document.querySelectorAll<HTMLInputElement>('[id=sigma2]');
        this._sigmaSliderLabels = document.querySelectorAll<HTMLInputElement>('[id=sigma-value]');
        this._sigma2SliderLabels = document.querySelectorAll<HTMLInputElement>('[id=sigma-value2]');

        this._sigmaValues = new Array<number>(this._sigmaSliders.length).fill(0);
        this._sigma2Values = new Array<number>(this._sigma2Sliders.length).fill(0);


        for (let i = 0; i < this._sigmaSliders.length; i++) {
            this._sigmaSliders[i].addEventListener('input', () => {
                const sliderValue = this._sigmaSliders[i].value;

                this._sigmaValues[i] = parseFloat(sliderValue); 
                this._sigmaSliderLabels[i].value = sliderValue;
                callback();
            }, false);
        };

        for (let i = 0; i < this._sigma2Sliders.length; i++) {
            this._sigma2Sliders[i].addEventListener('input', () => {
                const sliderValue = this._sigma2Sliders[i].value;
                this._sigma2Values[i] = parseFloat(sliderValue); 
                this._sigma2SliderLabels[i].value = sliderValue;

                if(sliderValue === "0"){
                    this._sigma2SliderLabels[i].value = "auto";
                }
                
                callback();
            }, false);
        };
    }

    
    public updateSigmaValue(index: number, value: string){
        this._sigmaValues[index] = parseFloat(value); 
        this._sigmaSliders[index].value = value;
        this._sigmaSliderLabels[index].value = value;
    }

    public updateSigma2Value(index: number, value: string){
        this._sigma2Values[index] = parseFloat(value); 
        this._sigma2Sliders[index].value = value;

        if(value === "0"){
            this._sigma2SliderLabels[index].value = "auto";
            return;
        }
        this._sigma2SliderLabels[index].value = value;
    }

    public reset(){
        for (let i = 0; i < this._sigmaSliders.length; i++) {
            this._sigmaSliderLabels[i].value = this._resetValue;
            this._sigmaSliders[i].value = this._resetValue;
            this._sigmaValues[i] = parseFloat(this._resetValue); 
        };

        for (let i = 0; i < this._sigma2Sliders.length; i++) {
            this._sigma2SliderLabels[i].value = this._resetValue;
            this._sigma2Sliders[i].value = this._resetValue;
            this._sigma2Values[i] = parseFloat(this._resetValue); 
        };
    }
}