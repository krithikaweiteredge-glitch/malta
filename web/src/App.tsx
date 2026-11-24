import { Chrome, Drawer, Footer, Nav, type Page } from './components/Shared';
import Gallery from './pages/Gallery';
import Home from './pages/Home';

// One shell for every page: the shared chrome around the page's own content.
export default function App({ page }: { page: Page }) {
  return (
    <>
      <Chrome />
      <Nav page={page} />
      {page === 'gallery' ? <Gallery /> : <Home />}
      <Footer page={page} />
      <Drawer />
    </>
  );
}
