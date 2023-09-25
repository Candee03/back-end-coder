const socket = io()

const render = (data) => {
    const tbody = document.getElementById('tbody-websocket')
    tbody.innerHTML = ''
    //*si la lista de productos esta vacia se imprime un comentario
    if (data.length === 0) {
        tbody.innerHTML = '<h2 class="h2-home">No hay productos agregados</h2>'
    } else {
        data.forEach(p => {
            const tr = document.createElement('tr')
            tr.innerHTML = 
            `<td class='td-body-realTimeProducts'>${p.title}</td>
            <td class='td-body-realTimeProducts'>${p.description}</td>
            <td class='td-body-realTimeProducts'>$${p.price}</td>
            <td class='td-body-realTimeProducts'>${p.category}</td>
            <td class='td-body-realTimeProducts'>${p.status}</td>
            <td class='td-body-realTimeProducts'>${p.stock}</td>
            <td class='td-body-realTimeProducts'>${p.code}</td>
            <td class='td-body-realTimeProducts'>${p.owner}</td>
            <td class='td-body-realTimeProducts'>${p._id}</td>`

            tbody.append(tr)
        });
    }
}

socket.on('products', (data) => {
    render(data);
})