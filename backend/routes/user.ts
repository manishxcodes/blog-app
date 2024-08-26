import { Hono } from 'hono'

const router = new Hono()

router.post('/singup', (c) => {
    return c.text('Signup route')
  })
  
router.post('/singin', (c) => {
    return c.text('singin route')
  })

router.get('/sin', (c) => {
return c.text('singin route')
})

export default router 