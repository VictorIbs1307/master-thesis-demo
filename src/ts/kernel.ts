export class Kernel {
    sigma: number = 0
    sigma2: number = 0
    kernelSize: number = 0
    subtract: boolean = false
    self: Float32Array = new Float32Array();

    initGauss(sigma: number, sigma2: number, kernelSize: number) {
        this.sigma = sigma;
        this.sigma2 = sigma2;
        if (sigma2 == 0)
            this.sigma2 = this.sigma;

        const GAUSSKERN = 6.0;
        var dim = 0;
        if (kernelSize != 0)
            dim = kernelSize;
        else
            dim = Math.max(3.0, GAUSSKERN * this.sigma);
        this.kernelSize = dim;
        var sqrtSigmaPi2 = Math.sqrt(Math.PI * 2.0) * this.sigma;
        var s2 = 2.0 * this.sigma * this.sigma2;
        var sum = 0.0;

        var kernel = new Float32Array(dim - Number(!(dim & 1))); // Make it odd number
        
        const half = kernel.length / 2;
        for (var j = 0, i = -half; j < kernel.length; i++, j++) {
            kernel[j] = Math.exp(-(i * i) / (s2)) / sqrtSigmaPi2;
            sum += kernel[j];
        }
        // Normalize the gaussian kernel to prevent image darkening/brightening
        for (var i = 0; i < dim; i++) {
            kernel[i] /= sum;
        }
        
        this.self = kernel;
    }

    initBoxKernel(kernelSize: number) {
        this.sigma = 1;
        this.sigma2 = 1;
        this.kernelSize = kernelSize;

        var dim = 0;
        if (kernelSize != 0)
            dim = kernelSize;
        else
            dim = 3;

        var sum = 0.0;
        var kernel = new Float32Array(dim - Number(!(dim & 1))); // Make it odd number
        const half = kernel.length / 2;

        for (var j = 0, i = -half; j < kernel.length; i++, j++) {
            kernel[j] = 1;
            sum += kernel[j];
        }
        // Normalize the kernel to prevent image darkening/brightening
        for (var i = 0; i < dim; i++) {
            kernel[i] /= sum;
        }

        this.self = kernel;
    }

    createCircularKernel(kernelSize: number, radius: number) {
        this.sigma = 1;
        const center = (kernelSize - 1) / 2;
        const kernel = new Float32Array(kernelSize);

        let sum = 0;
        for (let i = 0; i < kernelSize; i++) {
            const distance = Math.abs(i - center);
            if (distance <= radius) {
            const value = 1 - distance / radius;
            kernel[i] = value;
            sum += value;
            } else {
            kernel[i] = 0;
            }
        }

        // Normalize the kernel
        for (let i = 0; i < kernelSize; i++) {
            kernel[i] /= sum;
        }

        this.self = kernel;
    } 
}