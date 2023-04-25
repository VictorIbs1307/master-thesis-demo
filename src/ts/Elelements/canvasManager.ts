export class CanvasManager {
    private _originalCanvas: HTMLCanvasElement;
    private _processCanvas: HTMLCanvasElement;
    private _hiddenCanvas: HTMLCanvasElement;

    private _originalContext: CanvasRenderingContext2D | null;
    private _processContext: CanvasRenderingContext2D | null;
    private _hiddenContext: CanvasRenderingContext2D | null;

  
    constructor() {
        this._originalCanvas = document.getElementById("Mycanvas") as HTMLCanvasElement;
        this._processCanvas = document.getElementById("ProcessCanvas") as HTMLCanvasElement;
        this._hiddenCanvas = document.getElementById("HiddenCanvas") as HTMLCanvasElement;

        this._originalContext = this._originalCanvas.getContext('2d');
        this._processContext = this._processCanvas.getContext('2d');
        this._hiddenContext = this._hiddenCanvas.getContext('2d');
    }

    public getHiddenImageData(): ImageData {
        return this._hiddenContext!.getImageData(0, 0, this._hiddenCanvas.width, this._hiddenCanvas.height);
    }
    public getOrginalImageData(): ImageData {
        return this._originalContext!.getImageData(0, 0, this._originalCanvas.width, this._originalCanvas.height);
    }

    public setProcessCanvasImageData(pixels: ImageData){
        this._processContext!.putImageData(pixels, 0, 0);
    }


    public createNewCanvas(pixels: ImageData): HTMLCanvasElement {
        let newCanvas = document.createElement('canvas');
        newCanvas.width = pixels.width;
        newCanvas.height = pixels.height;

        let newContext = newCanvas.getContext('2d');
        newContext!.putImageData(pixels, 0, 0);

        return newCanvas;
    }

    public reset(){
        const originalPixels = this.getOrginalImageData();   
        this._processContext!.putImageData(originalPixels, 0, 0);
    }
  }