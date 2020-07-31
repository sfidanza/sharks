let page = {};

page.initialize = function() {
    access.init();
}

/************************/
let access = {};

access.init = function() {
    this.code = '';
    this.retry = 3;

    // Display initial code
    access.displayCode();

    // Attach onclick on keypad
    document.querySelector("#keypad").addEventListener('click', function(event) {
        let targetKey = event.target.dataset.type;
        if (targetKey) {
            access.handleKey(targetKey);
        }
    })
};

access.handleKey = function(key) {
    switch (key) {
        case 'OK':
            this.validateCode();
            break;
        case "CX":
            if (this.code.length > 0) {
                this.code = this.code.slice(0, -1);
                this.displayCode();
            }
            break;
        default:
            if (this.code.length < 4) {
                this.code += '' + key;
                this.displayCode();
            }
            break;
    }
};

access.validateCode = function() {
    //send user guess to server to get it checked
    fetch('/api/code?guess=' + this.code)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                this.correctCode();
            } else {
                this.wrongCode();
            }
        });
};

access.displayCode = function() {
    let showCode = '*'.repeat(this.code.length);
    document.querySelector("#code").innerHTML = showCode || '&nbsp;';
};

access.correctCode = function() {
    document.querySelector("#incorrect").className = '';
    document.querySelector("#granted").className = 'active';
    document.querySelector("#keypad").className = 'hidden';
    this.play(true);
};

access.wrongCode = function() {
    this.retry--;
    if (this.retry) {
        this.code = '';
        access.displayCode();
        document.querySelector("#incorrect").className = 'active';
        window.setTimeout(function() {
            document.querySelector("#incorrect").className = '';
        }, 2000);
    } else {
        document.querySelector("#incorrect").className = '';
        document.querySelector("#alert").className = 'active';
        document.querySelector("#keypad").className = 'hidden';
        this.play(false);
    }
};

access.play = function(success) {
    var el = document.getElementById(success ? 'audioOK' : 'audioNOK');
    el.play();
};

/************************/

window.addEventListener("load", function(event) {
    page.initialize();
});