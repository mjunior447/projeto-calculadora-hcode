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

        this.setLastNumerToDisplay();

    }
    
    // apaga tudo que está no console da calculadora, inclusive historico
    allClear() {
        this._operation = [];

        this.setLastNumerToDisplay();
    }

    // apaga a última entrada no console da calculadora, preservando historico
    clearEntry() {
        this._operation.pop();

        this.setLastNumerToDisplay();
    }

    setError() {
        this.displayCalc = 'Error';
    }

    getLastOperator() {
        let lastOperator;
        for (let i = 0; i < this._operation.length; i++) {
            if (isNaN(this._operation[i])) {
                lastOperator = this._operation[i];
                break;
            }
        }
        return lastOperator;
    }

    getLastElement() {
        return this._operation[this._operation.length - 1];
    }

    setLastElement(value) {
        this._operation[this._operation.length - 1] = value;
    }

    isOperator(value) {
        return (['+', '-', '*', '/', '%'].indexOf(value) > -1);
    }

    concatExpression() {
        let expression = this._operation.join('');
        return expression;
    }

    calculate() {
        let expression = this.concatExpression();
        let result = eval(expression);
        return result;
    }

    equals() {
        // só é possivel usar o 'igual' se houver
        // pelo menos dois operandos e um operador no array
        if (this._operation.length > 2) {
            this._operation = [this.calculate()];
            this.setLastNumerToDisplay();
        }
    }

    // insertDot() {
    //     // caso o ponto não exista no último número
    //     if (!(this.getLastElement().toString().indexOf('.') >= -1)) {
    //         let newOperator = this._operation.pop().toString() + '.';
    //         this._operation.push(newOperator);
    //         this.setLastNumerToDisplay();
    //     } else {
    //         console.log('aqui')
    //     }
    // }

    pushOperation(value) {
        if (this._operation.length > 2) {
            this._operation = [this.calculate()];
        }

        if (value == '%') {
            let result = this.getLastElement();
            result /= 100;
            this._operation = [result];
        } else {
            this._operation.push(value);
        }

        this.setLastNumerToDisplay();
    }

    // atualiza o display
    setLastNumerToDisplay() {
        let lastNumber;

        for (let i = this._operation.length - 1; i >= 0; i--) {
            if (!this.isOperator(this._operation[i])) {
                lastNumber = this._operation[i];
                break;
            }
        }
        if (!lastNumber) lastNumber = 0;

        this.displayCalc = lastNumber;
    }

    // insere o último operador ou número na pilha, tratando cada caso
    addOperation(op) {
        if (isNaN(this.getLastElement())) {
            if (this.isOperator(op)) {
                this.setLastElement(op);
            } else {
                this.pushOperation(op);
                this.setLastNumerToDisplay();
            }

        } else {
            if (this.isOperator(op)) {
                this.pushOperation(op);
            } else {
                let newOp = this.getLastElement().toString() + op.toString();
                this.setLastElement(parseFloat(newOp));
                this.setLastNumerToDisplay();
            }

        }
    }

    addDot() {
        let lastOperator = this.getLastOperator();
        console.log(lastOperator);
    }

    // adiciona a funcionalidade de cada botão
    // o botão "AC" significa "All Clear (limpar tudo)"
    // o botão "CE" significa "Clear Entry (limpar última entrada)"
    execBtn(textBtn) {

        switch(textBtn) {
            case 'ac':
                this.allClear();
                break;

            case 'ce':
                this.clearEntry();
                break;

            case 'porcento':
                this.addOperation('%');
                break;

            case 'divisao':
                this.addOperation('/');
                break;

            case 'multiplicacao':
                this.addOperation('*');
                break;

            case 'subtracao':
                this.addOperation('-');
                break;

            case 'soma':
                this.addOperation('+');
                break;

            case 'igual':
                this.equals();
                break;

            case 'ponto':
                this.addDot();
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
                this.addOperation(parseInt(textBtn));
                break;

            default:
                this.setError();
                break;
            
        }
    }

    initButtonEvents() {
        let buttons = document.querySelectorAll('#buttons > g, #parts > g');

        buttons.forEach(btn => {
            this.addEventListenerAll(btn, 'click drag', e => {
                let textBtn = btn.className.baseVal.replace("btn-", "");
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