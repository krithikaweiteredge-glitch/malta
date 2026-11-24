import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';
import App from './App';
import type { Page } from './components/Shared';
import './styles.css';
import { start } from './motion';

const root = document.getElementById('root');
if (!root) throw new Error('#root is missing from the page');
// Each HTML page says which page it is (<body data-page="…">); React renders it once, then the motion is set up on it.
const page: Page = document.body.dataset.page === 'gallery' ? 'gallery' : 'home';
flushSync(() => createRoot(root).render(<App page={page} />));
start(page);
