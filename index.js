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
const myOrdersMiddLerware = (request, response, next) => {
    console.log(request.method, request.url)
    next()
}
app.get('/orders', myOrdersMiddLerware, (request, response) => {
    return response.json(orders)
})
app.get('/orders/:id', checkOrdersId, myOrdersMiddLerware, (request, response) => {
    const index = request.ordersIndex
    const id = request.ordersId
    return response.status(201).json(orders[index, id])
})
app.post('/orders', myOrdersMiddLerware, (request, response) => {
    const { order, clientName, price,} = request.body
    const orde = { id: uuid.v4(), order, clientName, price, status: 'Em preparação' }
    orders.push(orde)
    return response.json(orde)
})
app.put('/orders/:id', checkOrdersId, myOrdersMiddLerware, (request, response) => {
    const { order, clientName, price, status } = request.body
    const index = request.ordersIndex
    const id = request.ordersId
    const updateOrders = { id, order, clientName, price, status }
    orders[index] = updateOrders
    return response.json(updateOrders)
})
app.patch('/orders/:id', checkOrdersId, myOrdersMiddLerware, (request, response) => {
    const index = request.ordersIndex
    const id = request.ordersId
    const updateStatus  = { id, order: orders[index].order, clientName: orders[index].clientName, price: orders[index].price, status:'pronto'}
    orders[index] = updateStatus 
    return response.status(201).json(updateStatus)   
})
app.delete('/orders/:id', checkOrdersId, myOrdersMiddLerware, (request, response) => {
    const index = request.ordersIndex
    orders.splice(index, 1)
    return response.status(204).json(orders)
})
app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})