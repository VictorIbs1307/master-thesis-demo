import { Kernel } from "./kernel.js";

export class Filter {
    kernels

    constructor() {
        this.kernels = [new Kernel(), new Kernel(), new Kernel()];
    }

    subtractKerne(pixels, colorChannel, kernel) {
        var data = pixels.data;
        var w = pixels.width;
        var h = pixels.height;
        let blurredPixels = new Array(pixels.length);

        var dim = kernel.kernelSize;
        const half = parseInt((dim - !(dim & 1)) / 2);

        // Blur the pixels using a box filter
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                let i = y * w + x;
                let color = 0,
                    n = 0;

                // Sum the values of the neighboring pixels
                for (let dy = -half; dy <= half; dy++) {
                    for (let dx = -half; dx <= half; dx++) {
                        let y2 = y + dy,
                            x2 = x + dx;
                        if (y2 >= 0 && y2 < h && x2 >= 0 && x2 < w) {
                            let i2 = y2 * w + x2;
                            color += data[i2 * 4 + colorChannel];
                            n++;
                        }
                    }
                }

                // Average the values of the neighboring pixels
                color /= n;

                // Store the blurred pixel values
                blurredPixels[i * 4 + colorChannel] = color;
            }
        }

        // Subtract the blurred pixels from the original pixels
        for (var i = 0; i < w * h; i += 1) {
            data[i * 4 + colorChannel] = data[i * 4 + colorChannel] + (data[i * 4 + colorChannel] - blurredPixels[i * 4 + colorChannel]) * amount;
        }

    }

    applyToImage(pixels) {
        this.kernels.forEach((kernel, i) => {
            if (kernel.sigma != 0)
                this.applyKernel(pixels, i, kernel.self, kernel.subtract);
        });
    }

    applyKernel(pixels, colorChannel, kernel, subtract) {
        var data = pixels.data;
        var w = pixels.width;
        var h = pixels.height;
        var buff = new Uint8Array(w * h);
        var mk = Math.floor(kernel.length / 2);
        var kl = kernel.length;

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
