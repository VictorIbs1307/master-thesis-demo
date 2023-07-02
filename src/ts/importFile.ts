// export function importFileInit(imageRowSlice: HTMLInputElement) {
//     const input = document.querySelector<HTMLInputElement>('#input-file') as HTMLInputElement;
//     input.addEventListener('change', function(evt) {
//         const source = (evt.target as HTMLInputElement).files![0];
//         const image = new Image();

//         image.onload = function() {
//             imageRowSlice.max = String(image.height);
//             drawFrame(this as HTMLImageElement | HTMLVideoElement);
//         }
//         image.onerror = function() {
//             console.log("error loading image!");
//         }
//         window.URL.revokeObjectURL(image.src);
//         image.src = window.URL.createObjectURL(source);
//     }, false);
// }



interface CanvasRenderingContext2DWithTransform extends CanvasRenderingContext2D {
        transformedPoint(x: number, y: number): { x: number, y: number };
    }

export function importFileInit(imageRowSlice: HTMLInputElement) {
    

    var canvas =  document.getElementById('Mycanvas') as HTMLCanvasElement;
    var processCanvas =  document.getElementById('ProcessCanvas') as HTMLCanvasElement;

    const fileInput = document.querySelector<HTMLInputElement>('#input-file') as HTMLInputElement;

    canvas.width = 600;
    canvas.height = 350;

    var gkhead : any = new Image;


    var lastX = canvas.width / 2,
        lastY = canvas.height / 2;
    var ctx1 = canvas.getContext('2d') as CanvasRenderingContext2DWithTransform;
    var ctx2 = processCanvas.getContext('2d') as CanvasRenderingContext2DWithTransform;
    var ctxArray = [ctx1, ctx2]as CanvasRenderingContext2DWithTransform[];
    trackTransforms(ctx1);

    function redraw() {
        console.log(ctxArray);
        ctxArray.forEach((ctx) => {
            // Clear the entire canvas
            var p1 = {x:0, y:0};
            var p2 = {x: canvas.width, y: canvas.height};
            // var p1 = ctx!.transformedPoint(0, 0);
            // var p2 = ctx!.transformedPoint(canvas.width, canvas.height);
            ctx!.clearRect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y);

            ctx!.save();
            ctx!.setTransform(1, 0, 0, 1, 0, 0);
            ctx!.clearRect(0, 0, canvas.width, canvas.height);
            ctx!.restore();

            ctx!.drawImage(gkhead, 0, 0);
        });
        

    }
    redraw();

    var dragStart: any, dragged;

    canvas.addEventListener('mousedown', function(evt) {
        //document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';
        lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
        lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
        dragStart = ctx1!.transformedPoint(lastX, lastY);
        dragged = false;
    }, false);

    canvas.addEventListener('mousemove', function(evt) {
        lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
        lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
        dragged = true;
        if (dragStart) {
            var pt = ctx1!.transformedPoint(lastX, lastY);
            ctx1!.translate(pt.x - dragStart.x, pt.y - dragStart.y);
            ctx2!.translate(pt.x - dragStart.x, pt.y - dragStart.y);
            redraw();
        }
    }, false);

    canvas.addEventListener('mouseup', function() {
        dragStart = null;
    }, false);

    fileInput.addEventListener('change', function(evt) {
         const source = (evt.target as HTMLInputElement).files![0];
        const image = new Image();

        image.onload = function() {
            const hiddenCanvas = document.getElementById("HiddenCanvas") as HTMLCanvasElement;
            const hiddenCanvasContex = hiddenCanvas.getContext("2d");
            hiddenCanvas.width = image.width;
            hiddenCanvas.height = image.height;
            var hRatio = hiddenCanvas.width / image.width    ;
            var vRatio = hiddenCanvas.height / image.height  ;
            var ratio  = Math.min ( hRatio, vRatio );
            hiddenCanvasContex!.drawImage(image, 0,0, image.width, image.height, 0,0,image.width*ratio, image.height*ratio);

            imageRowSlice.max = String(canvas.height);
            gkhead = this;
            redraw();
            ctxArray.forEach((ctx) => {
                ctx!.setTransform(1, 0, 0, 1, 0, 0);
                ctx!.clearRect(0, 0, canvas.width, canvas.height);
                ctx!.drawImage(gkhead, 0, 0);
            });
        }
        image.onerror = function() {
            console.log("error loading image!");
        }
        window.URL.revokeObjectURL(image.src);
        image.src = window.URL.createObjectURL(source);
    }, false);

    gkhead.src = 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png';

    // Adds ctx.getTransform() - returns an SVGMatrix
    // Adds ctx.transformedPoint(x,y) - returns an SVGPoint
    function trackTransforms(ctx: any) {
        var svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
        var xform = svg.createSVGMatrix();
        ctx.getTransform = function() { return xform; };

        var savedTransforms: any = [];
        var save = ctx.save;
        ctx.save = function() {
            savedTransforms.push(xform.translate(0, 0));
            return save.call(ctx);
        };

        var restore = ctx.restore;
        ctx.restore = function() {
            xform = savedTransforms.pop();
            return restore.call(ctx);
        };

        var scale = ctx.scale;
        ctx.scale = function(sx: any, sy: any) {
            xform = xform.scaleNonUniform(sx, sy);
            return scale.call(ctx, sx, sy);
        };

        var rotate = ctx.rotate;
        ctx.rotate = function(radians: any) {
            xform = xform.rotate(radians * 180 / Math.PI);
            return rotate.call(ctx, radians);
        };

        var translate = ctx.translate;
        ctx.translate = function(dx: any, dy: any) {
            xform = xform.translate(dx, dy);
            return translate.call(ctx, dx, dy);
        };

        var transform = ctx.transform;
        ctx.transform = function(a: any, b: any, c: any, d: any, e: any, f: any) {
            var m2 = svg.createSVGMatrix();
            m2.a = a;
            m2.b = b;
            m2.c = c;
            m2.d = d;
            m2.e = e;
            m2.f = f;
            xform = xform.multiply(m2);
            return transform.call(ctx, a, b, c, d, e, f);
        };

        var setTransform = ctx.setTransform;
        ctx.setTransform = function(a: any, b: any, c: any, d: any, e: any, f: any) {
            xform.a = a;
            xform.b = b;
            xform.c = c;
            xform.d = d;
            xform.e = e;
            xform.f = f;
            return setTransform.call(ctx, a, b, c, d, e, f);
        };

        var pt = svg.createSVGPoint();
        ctx.transformedPoint = function(x: any, y: any) {
            pt.x = x;
            pt.y = y;
            return pt.matrixTransform(xform.inverse());
        }
    }
};

// function drawFrame(source: HTMLImageElement | HTMLVideoElement) {
//     var MAX_WIDTH = 800;
//     var MAX_HEIGHT = 800;

//     const hiddenCanvas = document.getElementById("HiddenCanvas") as HTMLCanvasElement;
//     const hiddenCanvasContex = hiddenCanvas.getContext("2d");
//     hiddenCanvas.width = source.width;
//     hiddenCanvas.height = source.height;
//     var hRatio = hiddenCanvas.width / source.width    ;
//     var vRatio = hiddenCanvas.height / source.height  ;
//     var ratio  = Math.min ( hRatio, vRatio );
//     hiddenCanvasContex!.drawImage(source, 0,0, source.width, source.height, 0,0,source.width*ratio, source.height*ratio);

//     var width, height;
//     if ('naturalWidth' in source) { // Check if source is an HTMLImageElement
//         width = source.naturalWidth;
//         height = source.naturalHeight;
//       } else { // Otherwise, assume source is an HTMLVideoElement
//         width = source.videoWidth;
//         height = source.videoHeight;
//       }

//     const canvas = document.getElementById("Mycanvas") as HTMLCanvasElement;
//     const context = canvas.getContext("2d");
//     const canvas2 = document.getElementById("ProcessCanvas") as HTMLCanvasElement;
//     const context2 = canvas.getContext("2d");

//     canvas.width = width;
//     canvas.height = height;
//     context!.drawImage(source, 0, 0, width, height);
//     canvas2.width = width
//     canvas2.height = height;
//     context2!.drawImage(source, 0, 0, width, height);


// }