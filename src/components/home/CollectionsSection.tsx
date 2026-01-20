import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoryService } from '../../services/CategoryService';
import type { Category } from '../../types';
import './CollectionsSection.css';

export default function CollectionsSection() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                setLoading(true);
                setError(null);
                const categoriesData = await categoryService.getAllCategories();
                setCategories(categoriesData);
            } catch (err: any) {
                const message = err?.message || 'Failed to load categories';
                setError(message);
                console.error('Error loading categories:', err);
            } finally {
                setLoading(false);
            }
        };

        loadCategories();
    }, []);

    // Map category names to emoji icons (fallback to default if not found)
    const getCategoryIcon = (name: string): string => {
        const iconMap: Record<string, string> = {
            'custom': '🎨',
            'movie': '🎬',
            'tv': '📺',
            'music': '🎵',
            'game': '🎮',
            'motivate': '💪',
            'cricket': '🏏',
            'football': '⚽',
            'f1': '🏎️',
            'car': '🚗',
            'superhero': '🦸',
        };

        const lowerName = name.toLowerCase();
        for (const [key, icon] of Object.entries(iconMap)) {
            if (lowerName.includes(key)) {
                return icon;
            }
        }
        return '📦'; // Default icon
    };

    if (error) {
        return (
            <section className="collections-section">
                <div className="collections-container">
                    <div className="collections-header">
                        <h2 className="collections-title">COLLECTIONS</h2>
                        <p className="collections-subtitle" style={{ color: '#ff6b6b' }}>
                            {error}
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="collections-section">
            <div className="collections-container">
                <div className="collections-header">
                    <h2 className="collections-title">COLLECTIONS</h2>
                    <p className="collections-subtitle">
                        MOVIE STYLE, ANIME COLLECTION, AUTO AND FOOTBALL ACTION HERE
                    </p>
                </div>

                <div className="collections-grid">
                    {loading ? (
                        // Show loading placeholders
                        Array.from({ length: 6 }).map((_, index) => (
                            <div key={index} className="collection-card" style={{ opacity: 0.5 }}>
                                <div className="collection-icon-wrapper">
                                    <span className="collection-icon">⏳</span>
                                </div>
                                <p className="collection-name">Loading...</p>
                            </div>
                        ))
                    ) : categories.length === 0 ? (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
                            <p style={{ color: '#999' }}>No collections available</p>
                        </div>
                    ) : (
                        categories.map((category) => (
                            <Link
                                key={category.id}
                                to={`/category/${category.id}`}
                                className="collection-card"
                            >
                                <div className="collection-icon-wrapper">
                                    <span className="collection-icon">{getCategoryIcon(category.name)}</span>
                                    {category.name.toLowerCase().includes('custom') && (
                                        <span className="ar-indicator">AR</span>
                                    )}
                                </div>
                                <p className="collection-name">{category.name}</p>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}
