const sharks = {};

sharks.delete = function(id) {
    fetch('/api/sharks/' + id, {
        method: 'delete'
    }).then(response => {
        if (response.ok) {
            console.log('ok');
            location.reload();
        } else {
            return response.json();
        }
    }).then(console.error);
};