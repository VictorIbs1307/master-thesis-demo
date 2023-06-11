export class DiotresSettings {
    private _sliders: NodeListOf<HTMLInputElement>;
    private _sliderLabels: NodeListOf<HTMLInputElement>;
    private _values: number[];

    private _ppmInput: HTMLInputElement;

    private _resetValue: string = "0";

//#region get & set
    get values(): number[] {
        return this._values;
    }
//#endregion

    constructor(callback: (newIsPlayground: boolean) => void) {
        this._sliders = document.querySelectorAll<HTMLInputElement>('[id=dipotre-slider]');
        this._sliderLabels = document.querySelectorAll<HTMLInputElement>('[id=dipotre-slider-value]');
        this._values = new Array<number>(this._sliders.length).fill(0);

        this._ppmInput = document.getElementById("PPM") as HTMLInputElement;

        for (let i = 0; i < this._sliders.length; i++) {
            this._sliders[i].addEventListener('input', () => {
                const sliderValue = this._sliders[i].value;
                this._sliderLabels[i].value = sliderValue;
                this._values[i] = parseFloat(sliderValue);
            }, false);
            this._sliders[i].addEventListener('mouseup', () => {
                callback(false);
            }, false);
        };

    }

    public reset(){
        for (let i = 0; i < this._sliders.length; i++) {
            this._sliderLabels[i].value = this._resetValue;
            this._sliders[i].value = this._resetValue;;
            this._values[i] = parseFloat(this._resetValue); 
        };
    }

    public calculateKernelSize(colorChannel: number): number{
        console.log(this._values[colorChannel]);
        if(this._values[colorChannel] == 0){
            return 0;
        }
        let pupilArea = 0.0025;
        let dioptre = this._values[colorChannel];
        // dioptre = 1.5;
        // PSF (Point Spread Function) - Result is a diameter in radians.
        let diameter = pupilArea * dioptre;
        // console.log("pupilArea: " + pupilArea)
        // console.log("diotre: " + dioptre)
        // console.log("diameter: " + diameter)

        // Distance from eye to screen in meters
        let distanceToScreen = 1;

        let distanceInMillimeter = 2 * Math.tan(diameter / 2) * distanceToScreen;
        // console.log("distanceInMillimeter: " + distanceInMillimeter)

        // Screen PPM (Pixels Per Millimeter)
        let ppm = parseFloat(this._ppmInput.value) * 1000;
        // console.log("ppm: " + ppm);
        let kernelSize = Math.floor(distanceInMillimeter * ppm);
        // console.log("kernelSize: " + kernelSize)

        // Round to odd number
        kernelSize = 2* Math.floor(kernelSize/2) + 1;
        //console.log("kernelSize: " + kernelSize)
        //console.log(this._values[colorChannel]);
        console.log(kernelSize);
        return kernelSize;
    }
}

