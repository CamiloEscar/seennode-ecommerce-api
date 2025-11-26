//ejemplo fazt

import express from 'express'
import {PrismaClient} from './generated/prisma/index.js'

const app = express()
const prisma = new PrismaClient()

const PORT = process.env.PORT || 3000

app.get('/productos', async (req, res) => {

    const productos = await prisma.producto.findMany();
    return res.json(productos)
})

app.listen(PORT, () => {
    console.log('server en puerto ', PORT)
})