class CalcController {

    constructor() {
        this._operation = [];
        this._displayCalcEl = document.querySelector('#display');
        this._timeEl = document.querySelector('#hora');
        this._dateEl = document.querySelector('#data');
        this._locale = 'pt-br';
        //this._currentDate;
        this.initialize();
        this.initButtonEvents();
    }
    
    initialize() {
        this.setDisplayDateTime();

        setInterval(() => {
            this.setDisplayDateTime();
        }, 1000);

    }
    
    // apaga tudo que está no console da calculadora, inclusive historico
    allClear() {
        this._operation = [];
    }

    // apaga a última entrada no console da calculadora, preservando historico
    clearEntry() {
        this._operation.pop();
    }

    porcento() {}

    divisao() {}

    multiplicacao() {}

    subtracao() {}

    soma() {}

    igual() {}

    setError() {
        this.displayCalc = 'Error';
    }

    addOperation(op) {
        this._operation.push(op);
        console.log (this._operation);
    }

    execBtn(value) {

        switch(value) {
            case 'ac':
                this.allClear();
                break;

            case 'ce':
                this.clearEntry();
                break;

            case 'porcento':
                this.porcento();
                break;

            case 'divisao':
                this.divisao();
                break;

            case 'multiplicacao':
                this.multiplicacao();
                break;

            case 'subtracao':
                this.subtracao();
                break;

            case 'soma':
                this.soma();
                break;

            case 'igual':
                this.igual();
                break;

            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value));
                break;

            default:
                this.setError();
                break;
            
        }

    }

    initButtonEvents() {

        // o botão "AC" significa "All Clear (limpar tudo)"
        // o botão "CE" significa "Clear Entry (limpa última entrada)"
        let buttons = document.querySelectorAll('#buttons > g, #parts > g');

        buttons.forEach(btn => {
            this.addEventListenerAll(btn, 'click drag', e => {
                let textBtn = btn.className.baseVal.replace("btn-", "");
                console.log(textBtn);
                this.execBtn(textBtn);
            });

            this.addEventListenerAll(btn, 'mouseover mouseup mousedown', e => {
                btn.style.cursor = 'pointer';
            })
        });

    }

    addEventListenerAll(element, events, fn) {
        events.split(' ').forEach(e => {
            element.addEventListener(e, fn, false);
        });
    }

    setDisplayDateTime() {
        this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
    }

    get displayDate() {
        return this._dateEl.innerHTML;
    }

    set displayDate(value) {
        this._dateEl.innerHTML = value;
    }

    get displayTime() {
        return this._timeEl.innerHTML;
    }

    set displayTime(value) {
        this._timeEl.innerHTML = value;
    }

    get displayCalc() {
        return this._displayCalcEl.innerHTML;
    }

    set displayCalc(value) {
        this._displayCalcEl.innerHTML = value;
    }

    get currentDate() {
        return new Date();
    }

    set currentDate(value) {
        this._currentDate = value;
    }

    

}