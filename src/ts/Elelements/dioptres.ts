export class Diotres {
  private readonly sliders: NodeListOf<HTMLInputElement>;
  private sliderLabels: NodeListOf<HTMLInputElement>;

  constructor(callback: () => void) {
    this.sliders = document.querySelectorAll<HTMLInputElement>('[id=dipotre-slider]');
    this.sliderLabels = document.querySelectorAll<HTMLInputElement>('[id=dipotre-slider-value]');
    
    for (let i = 0; i < this.sliders.length; i++) {
        this.sliders[i].addEventListener('input', () => {
            this.sliderLabels[i].value = this.sliders[i].value;
            callback();
        }, false);
    };
  }
}