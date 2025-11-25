//ejemplo fazt

import express from 'express'

const app = express()

const PORT = process.env.PORT || 3000

app.get('/productos', (req, res) => {
    res.json({
        id: '1',
        nombre: 'laptop',
        precio: 1000,
        descripcion: 'laptop de 1000',
        imagenURL: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_syOw66L2Wg4hUHMleS3cpyDzeh_zC0ZBUQ&s'

    })
})

app.listen(PORT, () => {
    console.log('server en puerto ', PORT)
})