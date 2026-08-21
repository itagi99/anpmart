'use client';
import Link from 'next/link';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { imageSrc } from '@/lib/utils';
import { ChevronLeft, LayoutGrid, Filter, ChevronDown, ShoppingCart } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';

export default async function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | number>(0);
  const [sortBy, setSortBy] = useState('alpha');
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [flashDeals, setFlashDeals] = useState<Record<number, any>>({});
  const [loading, setLoading] = useState(true);
  const [currentCatName, setCurrentCatName] = useState('All Products');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const { id: categoryId } = await params;
  const selectedCategoryParam = categoryId === 'all' ? '0' : categoryId;

  useEffect(() => {
    const contentArea = contentRef.current;
    const sidebarArea = document.getElementById('sidebarArea');
    if (sessionStorage.getItem('catScroll') && contentRef.current) {
      contentRef.current.scrollTop = parseInt(sessionStorage.getItem('catScroll')!, 10);
    }
    if (sessionStorage.getItem('sideScroll')) {
      const sidebar = document.getElementById('sidebarArea');
      if (sidebar) sidebar.scrollTop = parseInt(sessionStorage.getItem('sideScroll')!, 10);
    }
    window.addEventListener('beforeunload', () => {
      if (contentRef.current) sessionStorage.setItem('catScroll', contentRef.current.scrollTop.toString());
      const sidebar = document.getElementById('sidebarArea');
      if (sidebar) sessionStorage.setItem('sideScroll', sidebar.scrollTop.toString());
    });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [cats, prods, deals] = await Promise.all([
          fetch('/api/categories').then(r => r.json()),
          fetch(`/api/products?category=${selectedCategoryParam}&sort=${sortBy}`).then(r => r.json()),
          fetch('/api/flash-deals').then(r => r.json()),
        ]);
        setCategories(cats.categories || []);
        setProducts(prods.products || []);
        setFlashDeals(deals.deals || {});
        setLoading(false);

        if (selectedCategoryParam !== '0' && selectedCategoryParam !== 'all') {
          const cat = cats.categories?.find((c: any) => c.id == selectedCategoryParam);
          if (cat) setCurrentCatName(cat.name);
        } else {
          setCurrentCatName('All Products');
        }
      } catch (e) {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedCategoryParam, sortBy]);

  const handleCategoryClick = (id: string | number) => {
    const newId = id === 0 ? 'all' : id;
    router.push(`/category/${newId}?sort=${sortBy}`);
  };

  const handleSortChange = (sort: string) => {
    const currentId = selectedCategoryParam === 'all' ? 0 : selectedCategoryParam;
    router.push(`/category/${currentId === 0 ? 'all' : currentId}?sort=${sort}`);
  };

  const renderLoading = () => (
    <html lang="en">
      <head>
        <title>Categories - ANP MART</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="manifest" href="/manifest.json" />
        <link href="https://fonts.googleapis.com/css2?family=Mulish:wght@600;700;800;900&display=swap" rel="stylesheet" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-white font-mulish" style={{fontFamily: "'Mulish', sans-serif"}}>
        <div className="layout">
          <aside className="sidebar" id="sidebarArea">
            <a href="/category/all" className="c-item active" onClick={(e) => { e.preventDefault(); handleCategoryClick('all'); }}>
              <div className="c-img"><ShoppingCart className="w-7 h-7 text-gray-400" /></div>
              <div className="c-txt text-emerald-600">All</div>
            </a>
            {categories.map((c: any) => (
              <Link key={c.id} href={`/category/${c.id}`} className="c-item">
                <div className="c-img">
                  {c.image_path ? <img src={imageSrc(c.image_path)} alt="" loading="lazy" /> : <svg className="w-7 h-7 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 18H4V4h16v16z"/></svg>}
                </div>
                <div className="c-txt">{c.name}</div>
              </Link>
            ))}
          </aside>
          <main className="content" id="contentArea">
            <div className="content-header">
              <h1 className="cat-title">Loading...</h1>
              <div className="filter-row">
                <select className="sort-select" value={sortBy} onChange={(e) => handleSortChange(e.target.value)}>
                  <option value="alpha">A to Z</option>
                  <option value="newest">Newest</option>
                  <option value="price_asc">Low to High</option>
                  <option value="price_desc">High to Low</option>
                </select>
                <button className="filter-btn"><Filter className="w-4 h-4 mr-1" /> Filter</button>
              </div>
            </div>
            <div className="grid">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="shop-card animate-pulse">
                  <div className="shop-card-img-wrapper">
                    <div className="shop-card-gallery">
                      <div className="h-full w-full bg-gray-200" />
                    </div>
                  </div>
                  <div className="shop-card-body">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
        <BottomNav />
      </body>
    </html>
  );

  const renderMain = () => (
    <html lang="en">
      <head>
        <title>{currentCatName} - ANP MART</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="manifest" href="/manifest.json" />
        <link href="https://fonts.googleapis.com/css2?family=Mulish:wght@600;700;800;900&display=swap" rel="stylesheet" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet" />

      </head>
      <body className="min-h-screen bg-white font-mulish" style={{fontFamily: "'Mulish', sans-serif"}}>
        <Header />
        <div className="layout">
          <aside className="sidebar" id="sidebarArea">
            <a
              href="/category/all"
              className={`c-item ${selectedCategory === '0' || selectedCategory === 'all' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); handleCategoryClick('all'); }}
            >
              <div className="c-img"><ShoppingCart className="w-7 h-7 text-gray-400" /></div>
              <div className={`c-txt ${selectedCategory === '0' || selectedCategory === 'all' ? 'text-emerald-600' : ''}`}>All</div>
            </a>
            {categories.map((c: any) => (
              <Link
                key={c.id}
                href={`/category/${c.id}`}
                className={`c-item ${selectedCategory === c.id ? 'active' : ''}`}
                onClick={() => handleCategoryClick(c.id)}
              >
                <div className="c-img">
                  {c.image_path ? <img src={imageSrc(c.image_path)} alt="" loading="lazy" /> : <svg className="w-7 h-7 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 18H4V4h16v16z"/></svg>}
                </div>
                <div className={`c-txt ${selectedCategory === c.id ? 'text-emerald-600' : ''}`}>{c.name}</div>
              </Link>
            ))}
          </aside>
          <main className="content" id="contentArea" ref={contentRef}>
            <div className="content-header">
              <h1 className="cat-title">{currentCatName}</h1>
              <div className="filter-row">
                <select
                  className="sort-select"
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                >
                  <option value="alpha">A to Z</option>
                  <option value="newest">Newest</option>
                  <option value="price_asc">Low to High</option>
                  <option value="price_desc">High to Low</option>
                </select>
                <button className="filter-btn"><Filter className="w-4 h-4 mr-1" /> Filter</button>
              </div>
            </div>
            {loading ? (
              <div className="grid">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="shop-card animate-pulse">
                    <div className="shop-card-img-wrapper">
                      <div className="shop-card-gallery">
                        <div className="h-full w-full bg-gray-200" />
                      </div>
                    </div>
                    <div className="shop-card-body">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                      <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
                      <div className="h-3 bg-gray-200 rounded w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="empty">
                <svg className="w-12 h-12 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10l-8 4m0-10L4 7m8 4v10l-8 4m0-10L4 7m8 4v10l-8 4m0-10L4 7m8 4v10l-8 4m0-10L4 7"/></svg>
                <div className="font-bold text-gray-500 mt-2">No items found</div>
              </div>
            ) : (
              <div className="grid">
                {products.map((p: any) => (
                  <ProductCard key={p.id} product={p} flashDeal={flashDeals[p.id]} />
                ))}
              </div>
            )}
          </main>
        </div>
        <BottomNav />
      </body>
    </html>
  );

  if (loading) {
    return renderLoading();
  }

  return renderMain();
}