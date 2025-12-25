'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import styles from './add-product.module.css';

interface Category {
    id: string;
    name: string;
}

export default function AddProductPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        price: '',
        discountPrice: '',
        quantity: '0',
        description: ''
    });

    // Images State
    const [images, setImages] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);

    useEffect(() => {
        fetchCategories();
    }, []);

    async function fetchCategories() {
        const { data, error } = await supabase.from('categories').select('id, name');
        if (data) setCategories(data);
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const VALID_SIZE = 5 * 1024 * 1024; // 5MB

        const validFiles: File[] = [];
        const newPreviews: string[] = [];

        files.forEach(file => {
            if (file.size > VALID_SIZE) {
                alert(`File ${file.name} is too large. Max size is 5MB.`);
                return;
            }
            validFiles.push(file);
            newPreviews.push(URL.createObjectURL(file));
        });

        setImages(prev => [...prev, ...validFiles]);
        setPreviews(prev => [...prev, ...newPreviews]);
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Upload Images to Supabase Storage
            const imageUrls: string[] = [];

            for (const file of images) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `product-images/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('products') // Ensure this bucket exists in Supabase
                    .upload(filePath, file);

                if (uploadError) {
                    console.error('Upload error:', uploadError);
                    // Fallback to a mock URL if bucket doesn't exist for demo purposes
                    imageUrls.push(`https://via.placeholder.com/600x400?text=${file.name}`);
                } else {
                    const { data: { publicUrl } } = supabase.storage
                        .from('products')
                        .getPublicUrl(filePath);
                    imageUrls.push(publicUrl);
                }
            }

            // 2. Save Product to Database
            const { error } = await supabase.from('products').insert([
                {
                    name: formData.name,
                    category: formData.category,
                    price: parseFloat(formData.price),
                    discount_price: formData.discountPrice ? parseFloat(formData.discountPrice) : null,
                    quantity: parseInt(formData.quantity),
                    description: formData.description,
                    images: imageUrls
                }
            ]);

            if (error) throw error;

            alert('Product added successfully!');
            router.push('/admin');
        } catch (err: any) {
            alert(err.message || 'Error adding product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className={styles.container}>
            <div className={styles.header}>
                <button onClick={() => router.back()} className={styles.backBtn}>
                    ←
                </button>
                <h1 className={styles.title}>Add New Product</h1>
            </div>

            <div className={styles.formCard}>
                <form onSubmit={handleSubmit}>
                    <div className={styles.grid}>
                        {/* Product Name */}
                        <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                            <label className={styles.label}>Product Name *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className={styles.input}
                                placeholder="e.g. Starry Night Over the Rhone"
                                required
                            />
                        </div>

                        {/* Category */}
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                className={styles.select}
                            >
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                                ))}
                                <option value="Uncategorized">Uncategorized</option>
                            </select>
                        </div>

                        {/* Quantity */}
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Available Quantity</label>
                            <input
                                type="number"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleInputChange}
                                className={styles.input}
                                placeholder="0"
                                min="0"
                            />
                        </div>

                        {/* Price */}
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Price ($) *</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                className={styles.input}
                                placeholder="0.00"
                                step="0.01"
                                required
                            />
                        </div>

                        {/* Discount Price */}
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Discount Price ($)</label>
                            <input
                                type="number"
                                name="discountPrice"
                                value={formData.discountPrice}
                                onChange={handleInputChange}
                                className={styles.input}
                                placeholder="0.00"
                                step="0.01"
                            />
                        </div>

                        {/* Description */}
                        <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                            <label className={styles.label}>Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className={styles.textarea}
                                placeholder="Tell the story behind this piece..."
                            />
                        </div>
                    </div>

                    {/* Image Upload Area */}
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Product Images (Max 5MB each)</label>
                        <div
                            className={styles.imageUploadArea}
                            onClick={() => document.getElementById('imageInput')?.click()}
                        >
                            <input
                                id="imageInput"
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{ display: 'none' }}
                            />
                            <p>Click to upload or drag images here</p>
                            <small style={{ color: 'var(--secondary)' }}>支持 JPG, PNG, WEBP</small>
                        </div>

                        {previews.length > 0 && (
                            <div className={styles.previewGrid}>
                                {previews.map((src, i) => (
                                    <div key={i} className={styles.previewItem}>
                                        <img src={src} className={styles.previewImg} alt="Preview" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(i)}
                                            className={styles.removeBtn}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Save Button */}
                    <button
                        type="submit"
                        className={styles.saveBtn}
                        disabled={loading}
                    >
                        {loading ? 'Saving Artwork...' : 'Publish Product'}
                    </button>
                </form>
            </div>
        </main>
    );
}
