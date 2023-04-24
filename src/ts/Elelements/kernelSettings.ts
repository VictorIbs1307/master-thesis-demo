export class KernelSettings {
    private _sliders: NodeListOf<HTMLInputElement>;
    private _sliderLabels: NodeListOf<HTMLInputElement>;
    private _values: number[];

    private _resetValue: string = "0";

    get values(): number[] {
        return this._values;
    }

    constructor(callback: () => void) {
        this._sliders = document.querySelectorAll<HTMLInputElement>('[id=kernal-size]');
        this._sliderLabels = document.querySelectorAll<HTMLInputElement>('[id=kernal-size-value]');
        this._values = new Array<number>(this._sliders.length).fill(0);
        
        for (let i = 0; i < this._sliders.length; i++) {
            this._sliders[i].addEventListener('input', () => {
                const sliderValue = this._sliders[i].value;
                this._values[i] = parseFloat(sliderValue); 

                this._sliderLabels[i].value = sliderValue
                if(sliderValue === "0"){
                    this._sliderLabels[i].value = "auto";
                }
                callback();
            }, false);
        };
    }

    public updateValue(index: number, value: string){
        this._values[index] = parseFloat(value); 
        this._sliders[index].value = value;
        if(value === "0"){
            this._sliderLabels[index].value = "auto";
            return;
        }
        this._sliderLabels[index].value = value
    }

    public reset(){
        for (let i = 0; i < this._sliders.length; i++) {
            this._sliderLabels[i].value = this._resetValue;
            this._sliders[i].value = this._resetValue;;
            this._values[i] = parseFloat(this._resetValue); 
        };
    }
}