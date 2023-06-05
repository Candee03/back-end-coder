const socket = io()
let user
const message = document.getElementById('message')
const historial = document.getElementById('historial')

Swal.fire({
    title:'Bienvenid@!',
    input:'text',
    text: 'Identificate para chatear',
    icon: 'success',
    inputValidator: (value) => {
        return !value && 'tenes que identificarte, no te hagas el piola...'
    },
    allowOutsideClick: false,
}).then((res) => {
    user = res.value
    socket.emit('sayhello', user);
})

message.addEventListener('keyup', e => {
    if(e.key === 'Enter') {
        let msj = message.value
        if (msj.trim().length > 0) {
            socket.emit('new-message', {user, message: msj})
            message.value = " "
        }
    }
})

const render = (data) => {
    const html = data.map((e, i) => {
        const letras = e.user.split('')
        let acc = 0
        letras.forEach(element => {
            let posicion = obtenerPosicionLetra(element)
            acc += posicion
        })
        const color = generarColor(acc)
        return `<div>
            <span style='color: ${color};' class='username'>${e.user}: </span>
            <span>${e.message} </span>
        </div>`
    }).join(' ')
    historial.innerHTML = html
}

socket.on ('messages', (data) => {
    if (data) {
        render(data);
    }
})

socket.on('connected', (data) => {
	Swal.fire({
		text: `Se conecto ${data}`,
        toast: true,
        position: 'top-right',
        timer: 3000
	});
});

//~-------FUNCIONES PARA COLOR ALEATORIO-------
function generarColor(numero) {
    const r = (numero * 123) % 256;
    const g = (numero * 321) % 256;
    const b = (numero * 543) % 256;

    const colorHex = '#' + componentesHex(r) + componentesHex(g) + componentesHex(b);
    return colorHex;
}

function componentesHex(componente) {
    const hex = componente.toString(16).padStart(2, '0');
    return hex;
}

function obtenerPosicionLetra(letra) {
    const codigoAscii = letra.toUpperCase().charCodeAt(0);
    const posicion = codigoAscii - 65 + 1;
    return posicion;
}