//ejemplo fazt
import express from 'express'
import {PrismaClient} from './generated/prisma/index.js'
import cors from "cors";

const app = express()
const prisma = new PrismaClient()

const PORT = process.env.PORT || 4000

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.json({ ok: true }))

app.get('/productos', async (req, res) => {
    try {
        const productos = await prisma.producto.findMany();
        return res.json(productos)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Error obteniendo productos' })
    }
})

app.post('/productos', async (req, res) => {
    try {
        const { nombre, descripcion, precio, stock } = req.body
        const producto = await prisma.producto.create({
            data: { nombre, descripcion, precio, stock }
        })
        return res.status(201).json(producto)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Error creando producto' })
    }
})

app.get('/productos/:id', async (req, res) => {
    try {
        const id = Number(req.params.id)
        const producto = await prisma.producto.findUnique({ where: { id } })
        if (!producto) return res.status(404).json({ error: 'Producto no encontrado' })
        return res.json(producto)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Error obteniendo producto' })
    }
})

app.put('/productos/:id', async (req, res) => {
    try {
        const id = Number(req.params.id)
        const { nombre, descripcion, precio, stock } = req.body
        const producto = await prisma.producto.update({
            where: { id },
            data: { nombre, descripcion, precio, stock }
        })
        return res.json(producto)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Error actualizando producto' })
    }
})

app.delete('/productos/:id', async (req, res) => {
    try {
        const id = Number(req.params.id)
        await prisma.producto.delete({ where: { id } })
        return res.status(204).send()
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Error eliminando producto' })
    }
})

// Métodos de pago
app.get('/metodos-pago', async (req, res) => {
    try {
        const metodos = await prisma.metodoPago.findMany()
        return res.json(metodos)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Error obteniendo métodos de pago' })
    }
})

app.post('/metodos-pago', async (req, res) => {
    try {
        const { nombre, proveedor } = req.body
        const metodo = await prisma.metodoPago.create({ data: { nombre, proveedor } })
        return res.status(201).json(metodo)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Error creando método de pago' })
    }
})

app.delete('/metodos-pago/:id', async (req, res) => {
    try {
        const id = Number(req.params.id)
        await prisma.metodoPago.delete({ where: { id } })
        return res.status(204).send()
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Error eliminando método de pago' })
    }
})

// Órdenes y pago (ejemplo simple)
app.post('/ordenes', async (req, res) => {
    try {
        const { items, cliente, metodoPagoId, total } = req.body
        const orden = await prisma.orden.create({
            data: {
                cliente,
                total,
                metodoPago: metodoPagoId ? { connect: { id: metodoPagoId } } : undefined,
                items: {
                    create: items.map(i => ({
                        producto: { connect: { id: i.productoId } },
                        cantidad: i.cantidad,
                        precio: i.precio
                    }))
                }
            },
            include: { items: true, metodoPago: true }
        })
        return res.status(201).json(orden)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Error creando orden (ver modelos Prisma)' })
    }
})

app.post('/pagar', async (req, res) => {
    try {
        const { ordenId, metodoPagoId, monto } = req.body
        // Simulación de pasarela de pago
        const orden = await prisma.orden.update({
            where: { id: ordenId },
            data: { pagado: true, metodoPago: metodoPagoId ? { connect: { id: metodoPagoId } } : undefined }
        })
        return res.json({ success: true, orden, monto })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Error procesando pago (ver modelos Prisma)' })
    }
})

app.listen(PORT, () => {
    console.log('server en puerto ', PORT)
})