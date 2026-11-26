import { Chrome, Footer, Nav, type Page } from './components/Shared';
import About from './pages/About';
import Book from './pages/Book';
import Gallery from './pages/Gallery';
import Home from './pages/Home';

// One shell for every page: the shared chrome around the page's own content.
export default function App({ page }: { page: Page }) {
  return (
    <>
      <Chrome />
      <Nav page={page} />
      {page === 'about' ? <About /> : page === 'book' ? <Book /> : page === 'gallery' ? <Gallery /> : <Home />}
      <Footer page={page} />
    </>
  );
}
