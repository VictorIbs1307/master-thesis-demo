import { Kernel } from "./kernel";

export class Filter {
    kernels: Kernel[]

    constructor() {
        this.kernels = [new Kernel(), new Kernel(), new Kernel()]; 
    }

    applyToImage(pixels: ImageData, timeFiltersApllied: number[]) {
        this.kernels.forEach((kernel, i) => {
            if (kernel.sigma !== 0){
                this.applyKernel(pixels, i, kernel.self, kernel.subtract, timeFiltersApllied[i]);
            }
        });
    }

    applyKernel(pixels: ImageData, colorChannel: number, kernel: Float32Array, subtract: boolean, timeFiltersApllied: number) {
        if (pixels !== undefined && pixels !== null) {
            var data = pixels.data;
            var w = pixels.width;
            var h = pixels.height;
            var buff = new Uint8Array(w * h);
            var mk = Math.floor(kernel.length / 2);
            var kl = kernel.length;
            for(var times = 1; times <= timeFiltersApllied; times++){
                // First step process columns
                for (var j = 0, hw = 0; j < h; j++, hw += w) {
                    for (var i = 0; i < w; i++) {
                        var sum = 0;
                        for (var k = 0; k < kl; k++) {
                            var col = i + (k - mk);
                            col = (col < 0) ? 0 : ((col >= w) ? w - 1 : col);
                            sum += data[(hw + col) * 4 + colorChannel] * kernel[k];
                        }
                        buff[hw + i] = sum;
                    }
                }

                // Second step process rows
                for (var j = 0, offset = 0; j < h; j++, offset += w) {
                    for (var i = 0; i < w; i++) {
                        var sum = 0;
                        for (k = 0; k < kl; k++) {
                            var row = j + (k - mk);
                            row = (row < 0) ? 0 : ((row >= h) ? h - 1 : row);
                            sum += buff[(row * w + i)] * kernel[k];
                        }
                        var off = (j * w + i) * 4;
                        if (!subtract)
                            data[off + colorChannel] = sum;
                        else {
                            data[off + colorChannel] = data[off + colorChannel] + (data[off + colorChannel] - sum);
                        }
                    }
                }
            }
        }
    }


}
