export class Kernel {
    sigma: number = 0
    sigma2: number = 0
    kernelSize: number = 0
    subtract: boolean = false
    self: Float32Array = new Float32Array();
    test: number[][] = new Array(0);

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

    createCircularKernel(kernelSize: number) {
        // test code:
        if(kernelSize == -1){
            kernelSize = 0;
        }
        this.kernelSize = kernelSize;
            
        var width = (kernelSize -1 ) / 2;
        var dim = (width * 2) + 1;
        var array = new Array(dim);
        for(let row = 0; row < dim; row++)
            array[row] = new Array(dim);
        
        this.makeCircle(width, width, width, array, dim, dim);  
        this.test = array; 
    }

    makeCircle(centerX: number, centerY: number, radius: number, a: number[][], arrayWidth: number, arrayHeight: number)
    {
        var x, y, d, yDiff, threshold, radiusSq;
        radius = (radius * 2);// + 1;
        radiusSq = (radius * radius) / 4;
        let sum = 0;
        for(y = 0; y < arrayHeight; y++)
        {
            yDiff = y - centerY;
            threshold = radiusSq - (yDiff * yDiff);
            for(x = 0; x < arrayWidth; x++)
            {
                d = x - centerX;
                if((d * d) > threshold){
                    a[y][x] = 0;
                }
                else {
                    a[y][x] = 1;
                    sum += 1;
                }
            }
        }

        sum = 1/sum;
        for(y = 0; y < arrayHeight; y++)
        {
            for(x = 0; x < arrayWidth; x++)
            {
                if(a[y][x] == 1){
                    a[y][x] = sum;
                }
            }
        }
    }
  
    createGaussianKernel2D(kernelSize: number, sigma: number) {
        const kernel: number[][] = [];
        this.kernelSize = kernelSize;
        // Calculate the center of the kernel
        const center = Math.floor(kernelSize / 2);
      
        // Calculate the normalization factor
        const norm = 1 / (2 * Math.PI * sigma * sigma);
      
        // Calculate the kernel values and sum
        let sum = 0;
        for (let i = 0; i < kernelSize; i++) {
          kernel[i] = [];
          for (let j = 0; j < kernelSize; j++) {
            const x = i - center;
            const y = j - center;
            const exponent = -(x * x + y * y) / (2 * sigma * sigma);
            const value = norm * Math.exp(exponent);
            kernel[i][j] = value;
            sum += value;
          }
        }
      
        // Normalize the kernel
        for (let i = 0; i < kernelSize; i++) {
          for (let j = 0; j < kernelSize; j++) {
            kernel[i][j] /= sum;
          }
        }
      
        let sum2 = 0;
        for (let i = 0; i < kernel.length; i++) {
            for (let j = 0; j < kernel[i].length; j++) {
              sum2 += kernel[i][j];
            }
          }
        this.test = kernel;
      }
}