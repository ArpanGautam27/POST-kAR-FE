import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '../components/layout/Navigation';
import Mascot from '../components/common/Mascot';
import ProductGrid from '../components/product/ProductGrid';
import { categoryService } from '../services/CategoryService';
import type { Product, Category } from '../types';
import './ProductsPage.css'; // Reuse ProductsPage styles

export default function CategoryPage() {
    const { categoryId } = useParams<{ categoryId: string }>();
    const navigate = useNavigate();

    const [category, setCategory] = useState<Category | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadCategoryData = async () => {
            if (!categoryId) {
                setError('Category ID is missing');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                // Fetch category details and markers in parallel
                const [categoryData, markersData] = await Promise.all([
                    categoryService.getCategoryById(categoryId),
                    categoryService.getMarkersByCategory(categoryId)
                ]);

                if (!categoryData) {
                    setError('Category not found');
                } else {
                    setCategory(categoryData);
                    setProducts(markersData);
                }
            } catch (err: any) {
                const message = err?.message || 'Failed to load category';
                setError(message);
                console.error('Error loading category data:', err);
            } finally {
                setLoading(false);
            }
        };

        loadCategoryData();
    }, [categoryId]);

    if (error) {
        return (
            <div className="products-page">
                <Navigation />
                <div className="products-container" style={{ paddingTop: 80 }}>
                    <div className="error-state">
                        <h2>Oops! Something went wrong</h2>
                        <p>{error}</p>
                        <button
                            onClick={() => navigate('/')}
                            className="retry-btn"
                        >
                            Go Back Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="products-page" style={{ background: 'transparent' }}>
            <Navigation />
            <div className="products-container" style={{ paddingTop: 80 }}>
                <div className="products-header">
                    <h1 className="products-title" style={{ textAlign: 'center', width: '100%', color: '#ffffff' }}>
                        {loading ? 'Loading...' : category?.name || 'Category'}
                    </h1>
                    {category?.description && (
                        <p style={{ textAlign: 'center', color: '#999', marginTop: '0.5rem' }}>
                            {category.description}
                        </p>
                    )}
                </div>
                <div>
                    <ProductGrid
                        products={products}
                        loading={loading}
                        onProductClick={(id) => { window.location.href = `/product/${id}`; }}
                        cardProps={{ hideCart: true }}
                        forceFourColumns={true}
                    />
                </div>
            </div>
            <Mascot model="products" />
        </div>
    );
}
