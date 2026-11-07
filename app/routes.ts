import type { RouteConfig } from '@react-router/dev/routes'
import {
  index,
  route,

} from '@react-router/dev/routes'

export default [
  index('routes/home.tsx'),
  route('examples', 'routes/examples.tsx'),
  route('example', 'routes/example.tsx'),
  route('example/files', 'routes/example-files.tsx'),

  // Not found
  route('*', 'routes/not-found.tsx'),
] satisfies RouteConfig
