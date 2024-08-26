import { Hono } from "hono"

const router = new Hono()

router.post('/', (c) => {
    return c.text('blog post rooute')
  })
  
router.put('/', (c) => {
    return c.text('post edit route')
  })
  
router.get('/:id', (c) => {
    return c.text('get post using id ')
  })
  
router.get('/bulk', (c) => {
    return c.text('get all blog route')
  })

export default router