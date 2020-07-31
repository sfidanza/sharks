const TPL_SHARK = (s) => `<li>${s.name}, ${s.type} - <a class="action" onclick="sharks.delete('${s._id}'); return false;">remove</a></li>`;

const sharks = {};

sharks.display = function() {
    let contents = '';
    if (sharks.data && sharks.data.length) {
        contents = sharks.data.reduce((str, shark) => str + TPL_SHARK(shark), '');
    }
    const container = document.getElementById('sharks-list');
    container.innerHTML = contents;
};

sharks.list = function() {
    fetch('/api/sharks/', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(response => {
        sharks.data = response.sharks;
        sharks.display();
    });
};

sharks.post = function(body) {
    let { name, type } = body || {};
    fetch('/api/sharks/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, type })
    }).then(sharks.handleResponse);
};

sharks.put = function(id, body) {
    let { name, type } = body || {};
    fetch('/api/sharks/' + id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, type })
    }).then(sharks.handleResponse);
};

sharks.delete = function(id) {
    fetch('/api/sharks/' + id, {
        method: 'DELETE'
    }).then(sharks.handleResponse);
};

sharks.handleResponse = async function(response) {
    const msg = await response.json();
    if (response.ok) {
        sharks.list();
    } else {
        console.error(msg);
    }
};

/***[Utils]******************/

const utils = {};

utils.getFormBody = function(form) {
    let obj = {};
    Array.prototype.forEach.call(form.elements, input => { if (input.name) obj[input.name] = input.value });
    return obj;
};

/***[Init]*******************/

window.addEventListener("load", function() {
	sharks.list();
}, false);
