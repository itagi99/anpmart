import { dbQuery } from '@/lib/db';
import { Product, Category, Banner } from '@/lib/types';
import { imageSrc, formatPrice } from '@/lib/utils';
import ProductCard from '@/components/product-card';
import Header from '@/components/header';
import BottomNav from '@/components/bottom-nav';
import { Star, Flame, Trophy, ShoppingCart, ChevronRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getCategories(): Promise<Category[]> {
  return dbQuery<Category[]>("SELECT * FROM categories ORDER BY name ASC");
}

async function getProducts(): Promise<Product[]> {
  return dbQuery<Product[]>(
    `SELECT p.id, p.name, p.price, p.mrp, p.image_path, p.brand, p.description,
     p.is_best_seller, p.is_product_of_week, p.is_must_buy, p.is_deal_of_day,
     p.visible, p.category_id, u1.name AS unit_name
     FROM products p
     LEFT JOIN units u1 ON p.primary_unit_id = u1.id
     WHERE p.visible = 1
     ORDER BY p.created_at DESC`
  );
}

async function getBanners(): Promise<Banner[]> {
  return dbQuery<Banner[]>(
    "SELECT * FROM banners WHERE active = 1 ORDER BY created_at DESC LIMIT 10"
  );
}

function BannerCarousel({ banners }: { banners: Banner[] }) {
  if (banners.length === 0) return null;
  return (
    <div className="relative w-full overflow-hidden rounded-lg">
      <div className="flex animate-[scroll_20s_linear_infinite]">
        {banners.map((b) => (
          <div key={b.id} className="min-w-full">
            <img
              src={imageSrc(b.image_path)}
              alt={b.title || 'Banner'}
              className="w-full h-40 object-cover rounded-lg"
            />
          </div>
        ))}
      </div>
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

function CategoryScroll({ categories }: { categories: Category[] }) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((cat) => (
        <a
          key={cat.id}
          href={`/category/${cat.id}`}
          className="flex flex-col items-center min-w-[80px]"
        >
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
            {cat.image_path ? (
              <img src={imageSrc(cat.image_path)} alt={cat.name} className="w-full h-full object-cover" />
            ) : (
              <ShoppingCart className="w-6 h-6 text-gray-400" />
            )}
          </div>
          <span className="text-xs mt-1 text-center text-gray-700 whitespace-nowrap">{cat.name}</span>
        </a>
      ))}
    </div>
  );
}

function ProductScrollSection({
  title,
  icon,
  products,
  viewAllLink,
}: {
  title: string;
  icon: React.ReactNode;
  products: Product[];
  viewAllLink: string;
}) {
  if (products.length === 0) return null;
  return (
    <section className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        </div>
        <a href={viewAllLink} className="flex items-center text-sm text-emerald-600 font-medium">
          View All <ChevronRight className="w-4 h-4" />
        </a>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {products.map((p) => (
          <div key={p.id} className="min-w-[160px] max-w-[160px]">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

export default async function HomePage() {
  const [categories, products, banners] = await Promise.all([
    getCategories(),
    getProducts(),
    getBanners(),
  ]);

  const dealOfDay = products.filter((p) => p.is_deal_of_day === 1);
  const bestSellers = products.filter((p) => p.is_best_seller === 1);
  const productOfWeek = products.filter((p) => p.is_product_of_week === 1);
  const mustBuy = products.filter((p) => p.is_must_buy === 1);
  const allProducts = products.slice(0, 30);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-4 space-y-6">
        <p className="text-xl font-semibold text-gray-900">{getGreeting()} 👋</p>

        <BannerCarousel banners={banners} />

        <CategoryScroll categories={categories} />

        <ProductScrollSection
          title="Deal of the Day"
          icon={<Flame className="w-5 h-5 text-red-500" />}
          products={dealOfDay}
          viewAllLink="/category/all"
        />

        <ProductScrollSection
          title="Best Sellers"
          icon={<Trophy className="w-5 h-5 text-amber-500" />}
          products={bestSellers}
          viewAllLink="/category/all"
        />

        <ProductScrollSection
          title="Product of the Week"
          icon={<Star className="w-5 h-5 text-blue-500" />}
          products={productOfWeek}
          viewAllLink="/category/all"
        />

        <ProductScrollSection
          title="Must Buy"
          icon={<ShoppingCart className="w-5 h-5 text-emerald-500" />}
          products={mustBuy}
          viewAllLink="/category/all"
        />

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">All Products</h2>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
            {allProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
