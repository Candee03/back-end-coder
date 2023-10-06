async function deleteProduct (pid, owner){
    if (owner != 'admin') {
        await fetch(`/api/mail/product/deleted/${owner}`, {method:'GET'})
        .then((res) => {
            if (res.ok) return location.reload()
        })
    }
    await fetch(`/api/products/${pid}`, {method: 'DELETE'})
    .then((res) => {
        if (res.ok) return location.reload()
    })
    .catch(error => {
        console.error(`Error: ${error.message}`);
    });
}
async function updateProduct (pid){
    const title = document.getElementsByClassName('newTitle')
    const description = document.getElementsByClassName('description')
    const price = document.getElementsByClassName('price')
    const category = document.getElementsByClassName('category')
    const stock = document.getElementsByClassName('stock')

    const updatedProduct = {
        title: title[0].value? title[0].value : title[0].placeholder,
        description: description[0].value? description[0].value : description[0].placeholder,
        price: price[0].value? price[0].value : price[0].placeholder,
        category: category[0].value? category[0].value : category[0].placeholder,
        stock: stock[0].value? stock[0].value : stock[0].placeholder,
    }
    await fetch(`/api/products/${pid}`, { 
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedProduct)
    })
    .then(res => {
        if (res.ok) return location.replace('/')
    })
    .catch(error => {
        console.error(`Error: ${error.message}`);
    });
}
const selectorForCategory = document.getElementById('selectorForCategory')
const selectorForPrice = document.getElementById('selectorForPrice')
const listenerOption = () => {
    location.replace(`/products?limit=10${selectorForCategory.value !== 'all' ? '&category='+selectorForCategory.value : ''}${selectorForPrice.value === 'menor-a-mayor' ? '&sort=asc' : selectorForPrice.value === 'mayor-a-menor' ? '&sort=desc' : ''}`)
    selectorForCategory.value = selectorForCategory.value
    selectorForPrice.value = selectorForPrice.value
}

async function createProduct () {
    const title = document.getElementById('title')
    const description = document.getElementById('description')
    const thumbnail = document.getElementById('thumbnail')
    const category = document.getElementById('category')
    const price = document.getElementById('price')
    const stock = document.getElementById('stock')

    const newProduct = {
        title:title.value,
        description:description.value,
        thumbnail:thumbnail.value,
        category:category.value,
        price:price.value,
        stock:stock.value
    }
    await fetch(`/api/products/`, { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newProduct)
    })
    .then((res) => {
        if(res.ok) return location.replace('/products')
    })
    .catch((error) => {
        console.error(`Error: ${error.message}`);
    })
}