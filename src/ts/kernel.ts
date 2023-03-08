export class Kernel {
    sigma: number
    sigma2: number
    kernelSize: number
    subtract = false
    self: Float32Array;

    initGauss(sigma: number, sigma2: number, kernelSize: number) {
        this.sigma = sigma;
        this.sigma2 = sigma2;
        if (sigma2 == 0)
            this.sigma2 = this.sigma;

        this.kernelSize = kernelSize;

        const GAUSSKERN = 6.0;
        var dim = 0;
        if (kernelSize != 0)
            dim = kernelSize;
        else
            dim = Math.max(3.0, GAUSSKERN * this.sigma);
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

/*     printMatrix() {
        var k = [];
        for (var i = 0; i < this.self.length; i++) {
            k.push(kernel[i] / kernel[0]);
        }

        var k_t = []
        for (var i = 0; i < k.length; i++) {
            k_t.push([k[i]])
        };

        var k_m = multiply(k_t, [k]);

        var k_m_sum = k_m.reduce(function(a, b) { return a.concat(b) })
            .reduce(function(a, b) { return a + b });

        for (var row = 0; row < k_m.length; row++) {
            for (var col = 0; col < k_m[0].length; col++) {
                k_m[row][col] = k_m[row][col] / k_m_sum;
            }
        }
        console.log(k_m)
    } */
}