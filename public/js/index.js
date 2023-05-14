const socket = io()

const render = (data) => {
    const ul = document.getElementById('ul-websocket')
    ul.innerHTML = ''
    //*si la lista de productos esta vacia se imprime un comentario
    if (data.length === 0) {
        ul.innerHTML = '<h2 class="h2-home">No hay productos agregados</h2>'
    } else {
        data.forEach(p => {
            const html = document.createElement('li')
            html.innerHTML =
            `<p>Title: ${p.title}</p>
            <p>Description: ${p.description}</p>
            <p>Price: $${p.price}</p>
            <p>Category: ${p.category}</p>
            <p>Status: ${p.status}</p>
            <p>Stock: ${p.stock}</p>
            <p>Code: ${p.code}</p>
            <p>Id: ${p.id}</p>`

            ul.append(html)
        });
    }
}

socket.on('products', (data) => {
    render(data);
})

