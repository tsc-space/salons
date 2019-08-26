import Home from './Home';
import Grid from './Popular';

import { fetchPopularRepos } from '../shared/api';

const routes = [
  {
    path: '/',
    exact: true,
    component: Home,
  },
  {
    path: '/popular/:id',
    exact: true,
    component: Grid,
    fetchInitialData: (path = '') => fetchPopularRepos(path.split('/').pop()),
  }
]

export default routes;