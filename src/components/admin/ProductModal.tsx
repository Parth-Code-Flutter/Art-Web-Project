'use client';

import React, { useState, useEffect } from 'react';
import { X, Upload, Check, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import styles from './ProductModal.module.css';

interface Product {
    id: string;
    name: string;
    description?: string;
    price: number;
    discount_price?: number;
    quantity: number;
    category: string;
    images: string[];
}

interface Category {
    id: string;
    name: string;
}

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    productToEdit?: Product | null;
    isViewOnly?: boolean;
}

/**
 * ProductModal Component
 * 
 * Supports Creating, Editing, and Viewing products.
 * Uses ₹ (Rupee) as currency.
 */
export default function ProductModal({ isOpen, onClose, onSuccess, productToEdit, isViewOnly }: ProductModalProps) {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [discountPrice, setDiscountPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);

    // Load categories
    useEffect(() => {
        if (isOpen) {
            fetchCategories();
        }
    }, [isOpen]);

    // Load existing data if editing or viewing
    useEffect(() => {
        if (productToEdit) {
            setName(productToEdit.name);
            setCategory(productToEdit.category);
            setPrice(productToEdit.price.toString());
            setDiscountPrice(productToEdit.discount_price?.toString() || '');
            setQuantity(productToEdit.quantity.toString());
            setDescription(productToEdit.description || '');
            setExistingImages(productToEdit.images || []);
            setPreviews([]); // Clear local previews
            setImages([]); // Clear local files
        } else {
            setName('');
            setCategory('');
            setPrice('');
            setDiscountPrice('');
            setQuantity('');
            setDescription('');
            setExistingImages([]);
            setPreviews([]);
            setImages([]);
        }
    }, [productToEdit, isOpen]);

    async function fetchCategories() {
        const { data } = await supabase.from('categories').select('id, name');
        setCategories(data || []);
    }

    if (!isOpen) return null;

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isViewOnly) return;
        const files = Array.from(e.target.files || []);

        const validFiles: File[] = [];
        const newPreviews: string[] = [];

        files.forEach(file => {
            if (file.size > 5 * 1024 * 1024) {
                alert(`${file.name} exceeds 5MB limit.`);
            } else {
                validFiles.push(file);
                newPreviews.push(URL.createObjectURL(file));
            }
        });

        setImages(prev => [...prev, ...validFiles]);
        setPreviews(prev => [...prev, ...newPreviews]);
    };

    const removeImage = (index: number, isExisting: boolean) => {
        if (isViewOnly) return;
        if (isExisting) {
            setExistingImages(prev => prev.filter((_, i) => i !== index));
        } else {
            setImages(prev => prev.filter((_, i) => i !== index));
            setPreviews(prev => prev.filter((_, i) => i !== index));
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isViewOnly || !name || !category || !price) return;

        setLoading(true);
        try {
            let uploadedImageUrls: string[] = [...existingImages];

            // 1. Upload new images if any
            for (const file of images) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
                const filePath = `products/${fileName}`;

                const { error: uploadError, data } = await supabase.storage
                    .from('products')
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                if (data) {
                    const { data: { publicUrl } } = supabase.storage
                        .from('products')
                        .getPublicUrl(filePath);
                    uploadedImageUrls.push(publicUrl);
                }
            }

            const productData = {
                name,
                category,
                price: parseFloat(price),
                discount_price: discountPrice ? parseFloat(discountPrice) : null,
                quantity: parseInt(quantity) || 0,
                description,
                images: uploadedImageUrls
            };

            // 2. Perform Insert or Update
            if (productToEdit) {
                const { error } = await supabase
                    .from('products')
                    .update(productData)
                    .eq('id', productToEdit.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('products')
                    .insert([productData]);
                if (error) throw error;
            }

            onSuccess();
            onClose();
            alert(productToEdit ? 'Product updated!' : 'Product added!');
        } catch (err: any) {
            console.error('Operation failed:', err);
            alert(err.message || 'Error saving product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeBtn} onClick={onClose}>
                    <X size={24} />
                </button>

                <header>
                    <h2 className={styles.title}>
                        {isViewOnly ? 'Product Details' : productToEdit ? 'Edit Product' : 'New Product'}
                    </h2>
                    <p className={styles.subtitle}>
                        {isViewOnly
                            ? 'Viewing product information.'
                            : productToEdit
                                ? 'Update your product details below.'
                                : 'List a new masterpiece in your gallery.'}
                    </p>
                </header>

                <form className={styles.form} onSubmit={handleSave}>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Product Name</label>
                        <input
                            type="text"
                            className={styles.input}
                            placeholder="e.g. Starry Night Recreation"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={isViewOnly}
                            required
                        />
                    </div>

                    <div className={styles.row}>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Category</label>
                            <select
                                className={styles.select}
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                disabled={isViewOnly}
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Quantity / Stock</label>
                            <input
                                type="number"
                                className={styles.input}
                                placeholder="e.g. 5"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                disabled={isViewOnly}
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.row}>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Price (₹) (Per Quantity)</label>
                            <input
                                type="number"
                                className={styles.input}
                                placeholder="e.g. 5000"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                disabled={isViewOnly}
                                required
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Discount Price (₹)</label>
                            <input
                                type="number"
                                className={styles.input}
                                placeholder="e.g. 4500 (Optional)"
                                value={discountPrice}
                                onChange={(e) => setDiscountPrice(e.target.value)}
                                disabled={isViewOnly}
                            />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Description</label>
                        <textarea
                            className={styles.textarea}
                            placeholder="Describe the artwork, medium, size, etc."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            disabled={isViewOnly}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Artwork Images</label>
                        {!isViewOnly && (
                            <div
                                className={styles.uploadArea}
                                onClick={() => document.getElementById('prodImageInput')?.click()}
                            >
                                <input
                                    id="prodImageInput"
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageChange}
                                    style={{ display: 'none' }}
                                />
                                <Upload size={32} color="#3b82f6" opacity={0.6} />
                                <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>
                                    Upload Images (Max 5MB each)
                                </p>
                            </div>
                        )}

                        <div className={styles.imageGrid}>
                            {existingImages.map((url, i) => (
                                <div key={`existing-${i}`} className={styles.imagePreview}>
                                    <img src={url} alt="existing preview" />
                                    {!isViewOnly && (
                                        <button type="button" className={styles.removeImgBtn} onClick={() => removeImage(i, true)}>
                                            <Trash2 size={14} />
                                        </button>
                                    )}
                                </div>
                            ))}
                            {previews.map((url, i) => (
                                <div key={`new-${i}`} className={styles.imagePreview}>
                                    <img src={url} alt="new preview" />
                                    {!isViewOnly && (
                                        <button type="button" className={styles.removeImgBtn} onClick={() => removeImage(i, false)}>
                                            <Trash2 size={14} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {!isViewOnly && (
                        <button
                            type="submit"
                            className={styles.saveBtn}
                            disabled={loading || !name}
                        >
                            {loading ? 'Saving...' : (
                                <>
                                    <Check size={20} />
                                    {productToEdit ? 'Update Product' : 'Add Product'}
                                </>
                            )}
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
}
