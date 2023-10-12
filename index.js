const express = require('express')
const uuid = require('uuid')
const port = 3000
const app = express()
app.use(express.json())
const orders = []
const checkOrdersId = (request, response, next) => {
    const { id } = request.params
    const index = orders.findIndex(orde => orde.id === id)
    if (index < 0) { return response.status(404).json({ error: 'order not found' }) }
    request.ordersIndex = index
    request.ordersId = id
    next()
}
const myOrdersMiddLeware = (request, response, next) => {
    console.log(request.method, request.url)
    next()
}
app.get('/orders', myOrdersMiddLeware, (request, response) => {
    return response.json(orders)
})
app.get('/orders/:id', checkOrdersId, myOrdersMiddLeware, (request, response) => {
    const index = request.ordersIndex
    const id = request.ordersId
    return response.status(201).json(orders[index, id])
})
app.post('/orders', myOrdersMiddLeware, (request, response) => {
    const { order, clientName, price,} = request.body
    const orde = { id: uuid.v4(), order, clientName, price, status: 'Em preparação' }
    orders.push(orde)
    return response.json(orde)
})
app.put('/orders/:id', checkOrdersId, myOrdersMiddLeware, (request, response) => {
    const { order, clientName, price, status } = request.body
    const index = request.ordersIndex
    const id = request.ordersId
    const updateOrders = { id, order, clientName, price, status }
    orders[index] = updateOrders
    return response.json(updateOrders)
})
app.patch('/orders/:id', checkOrdersId, myOrdersMiddLeware, (request, response) => {
    const index = request.ordersIndex
    orders.splice(index, 1)
    return response.status(204).json(orders)
})
app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})