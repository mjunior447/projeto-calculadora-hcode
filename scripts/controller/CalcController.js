class CalcController {

    constructor() {
        this._operation = [];
        this._displayCalcEl = document.querySelector('#display');
        this._timeEl = document.querySelector('#hora');
        this._dateEl = document.querySelector('#data');
        this._locale = 'pt-br';
        this.initialize();
        this.initButtonEvents();
        this.initKeyboard();
    }
    
    initialize() {
        this.setDisplayDateTime();

        setInterval(() => {
            this.setDisplayDateTime();
        }, 1000);

        this.setLastNumerToDisplay();
        
        this.pasteFromClipboard();

    }

    // função para copiar texto do display
    copyToClipboard() {
        let input = document.createElement('input');
        input.value = this.displayCalc;
        document.body.appendChild(input);
        input.select();
        document.execCommand('Copy');
        input.remove();
    }

    // função para colar o texto da área de transferência
    pasteFromClipboard() {
        document.addEventListener('paste', e => {
            let text = e.clipboardData.getData('Text');
            this.displayCalc = parseFloat(text);
        })
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

    pushOperation(value) {
        if (this._operation.length > 2) {
            this._operation = [this.calculate()];
        }

        // faz o cálculo de porcentagem
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
                this.setLastElement(newOp);
                this.setLastNumerToDisplay();
            }

        }
    }

    // casos de uso do ponto:
    // 1 - não há nada no display (0 por padrão) e digito o ponto; o resultado deve ser '0.'
    // 2 - caso a última coisa digitada seja um operador (exemplo: "2+"),
    //     ao digitar o ponto, deve-se inserir, após o "2+", um "0." e esperar que
    //     o usuário termine de digitar o número
    // 3 - caso o último elemento no display seja um número que não 0,
    //     deve-se inserir o ponto após esse número
    addDot() {
        let lastElement = this.getLastElement();

        if (lastElement.toString().indexOf('.') > -1) return;

        if (this.isOperator(this.getLastElement()) || !this.getLastElement()) {
            console.log ('hora de inserir o 0. algo');
            this.pushOperation('0.');
        } else {
            this.setLastElement(lastElement.toString() + '.');
        }

        this.setLastNumerToDisplay();
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
                this.addOperation(textBtn);
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

    initKeyboard() {
        document.addEventListener('keyup', e => {
            console.log(e.key);

            switch(e.key) {
                case 'Escape':
                    this.allClear();
                    break;

                case 'Backspace':
                    this.clearEntry();
                    break;

                case '+':
                case '-':
                case '*':
                case '/':
                case '%':
                    this.addOperation(e.key);
                    break;

                case 'Enter':
                case '=':
                    this.equals();
                    break;

                case '.':
                case ',':
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
                    this.addOperation(e.key);
                    break;

                // caso o usuário pressione ctrl+c
                case 'c':
                    if (e.ctrlKey) this.copyToClipboard();
                    break;

            }
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