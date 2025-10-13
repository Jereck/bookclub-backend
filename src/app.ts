import { Hono } from 'hono'
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { auth } from './utils/auth';
import bookclubRoutes from './features/bookclub/bookclub.routes';
import bookRoutes from './features/book/book.routes'

const app = new Hono()

const router = app.use(
  '/api/auth/*', 
  cors({
    origin: ['http://localhost:3000', 'http://localhost:5000'],
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['POST', 'GET', 'PUT', 'DELETE', 'OPTIONS'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
    credentials: true
  })
);
app.use(logger());

app.on(["POST", "GET"], "/api/auth/**", (c) => auth.handler(c.req.raw));

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route('/api/bookclubs', bookclubRoutes)
app.route('/api/books', bookRoutes)

export type AppType = typeof router;
export default app;
