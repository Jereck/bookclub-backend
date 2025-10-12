import { Hono } from 'hono'
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { auth } from './utils/auth';
import bookclubRoutes from './features/bookclub/bookclub.routes';

const app = new Hono()

app.use(
  '/api/auth/*', 
  cors({
    origin: 'http://localhost:3000',
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

export default app;
