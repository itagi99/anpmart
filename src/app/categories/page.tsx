import { dbQuery } from '@/lib/db';
import { Category } from '@/lib/types';
import { imageSrc } from '@/lib/utils';
import Header from '@/components/header';
import BottomNav from '@/components/bottom-nav';
import { ShoppingCart } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getCategories(): Promise<Category[]> {
  return dbQuery<Category[]>("SELECT * FROM categories ORDER BY name ASC");
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-4">
        <h1 className="text-xl font-bold text-gray-900 mb-4">All Categories</h1>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <a
              key={cat.id}
              href={`/category/${cat.id}`}
              className="flex flex-col items-center p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden mb-2">
                {cat.image_path ? (
                  <img
                    src={imageSrc(cat.image_path)}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ShoppingCart className="w-7 h-7 text-gray-400" />
                )}
              </div>
              <span className="text-sm font-medium text-gray-700 text-center">{cat.name}</span>
            </a>
          ))}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
