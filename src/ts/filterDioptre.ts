import { Kernel } from "./kernel";

export class FilterDioptre {
    kernels: Kernel[]

    constructor() {
        this.kernels = [new Kernel(), new Kernel(), new Kernel()]; 
    }


    applyToImage(pixels: ImageData) {
        this.kernels.forEach((kernel, i) => {
            if (kernel.kernelSize !== 0 && kernel.kernelSize % 2 != 0){
                this.applyKernel(pixels, i, kernel.test);
            } 
        });
     
        /* for(let i = 0; i<3; i++){
            this.applyKernel(pixels, i, this.kernels[0].test);
        } */
    }

    applyKernel(pixels: ImageData, colorChannel: number, kernel: number[][]) {
        console.log(kernel);
        if (pixels !== undefined && pixels !== null) {
            let kernelSize = kernel.length;
            var data = pixels.data;
            var buffer = new Uint8ClampedArray(data.length);
            var w = pixels.width;
            var h = pixels.height;

            const dim = (kernelSize-1)/2;
            
            for(let i = 0; i < h; i++){
                for(let j = 0; j < w; j++){
                    //kernel
                    //let sumThreshHold = 240;
                    let sum = 0;
                    for(let y = -dim; y <= dim; y++){
                        for(let x = -dim; x <= dim; x++){
                            if (i+y >= 0 && i+y < h && j+x >= 0 && j+x < w) {
                                sum += kernel[x+dim][y+dim] * data[(((i+y)*w + (j+x)) * 4) + colorChannel]
                            }
                            else {
                                sum += kernel[x+dim][y+dim] * 255;
                            }
                        }
                    }
                    /* if(sum != 0){
                        console.log("point: " + data[((i*w + j) * 4) + colorChannel] + " sum: " + sum);
                        
                    }  */
                    buffer[((i*w + j) * 4) + colorChannel] = sum;
                    
                    //if(sum < sumThreshHold || data[((i*w + j) * 4) + colorChannel] < sumThreshHold){
                        //data[((i*w + j) * 4) + colorChannel] = sum;
                    //}
                    
                }
            }

            for(let i = 0; i < h; i++){
                for(let j = 0; j < w; j++){
                    data[((i*w + j) * 4) + colorChannel] = buffer[((i*w + j) * 4) + colorChannel];
                }
            }
            return;
        }
    }


}
