'use client';

import React, { useState, useEffect } from 'react';
import { X, Upload, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import styles from './CategoryModal.module.css';

interface Category {
    id: string;
    name: string;
    image_url: string;
}

interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    categoryToEdit?: Category | null;
    isViewOnly?: boolean;
}

/**
 * CategoryModal Component
 * 
 * Supports Creating, Editing, and Viewing categories.
 */
export default function CategoryModal({ isOpen, onClose, onSuccess, categoryToEdit, isViewOnly }: CategoryModalProps) {
    const [name, setName] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Load existing data if editing or viewing
    useEffect(() => {
        if (categoryToEdit) {
            setName(categoryToEdit.name);
            setPreview(categoryToEdit.image_url);
        } else {
            setName('');
            setImage(null);
            setPreview(null);
        }
    }, [categoryToEdit, isOpen]);

    if (!isOpen) return null;

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isViewOnly) return;
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            alert('Image size exceeds 5MB limit.');
            return;
        }

        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isViewOnly || !name) return;

        setLoading(true);
        try {
            let imageUrl = preview || '';

            // 1. Upload new image if chosen
            if (image) {
                const fileExt = image.name.split('.').pop();
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
                const filePath = `category-images/${fileName}`;

                const { error: uploadError, data } = await supabase.storage
                    .from('products')
                    .upload(filePath, image);

                if (uploadError) {
                    throw new Error(`Storage Error: ${uploadError.message}. Ensure 'products' bucket exists and is PUBLIC.`);
                }

                if (data) {
                    const { data: { publicUrl } } = supabase.storage
                        .from('products')
                        .getPublicUrl(filePath);
                    imageUrl = publicUrl;
                }
            }

            // 2. Perform Insert or Update
            if (categoryToEdit) {
                // UPDATE
                const { error } = await supabase
                    .from('categories')
                    .update({ name, image_url: imageUrl })
                    .eq('id', categoryToEdit.id);
                if (error) throw error;
            } else {
                // INSERT
                const { error } = await supabase
                    .from('categories')
                    .insert([{ name, image_url: imageUrl }]);
                if (error) throw error;
            }

            onSuccess();
            onClose();
            alert(categoryToEdit ? 'Category updated!' : 'Category created!');
        } catch (err: any) {
            console.error('Operation failed:', err);
            if (err.message.includes('row-level security')) {
                alert('Security Error: You need to enable RLS policies in Supabase for this operation.');
            } else {
                alert(err.message || 'Error saving category');
            }
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
                        {isViewOnly ? 'Category Details' : categoryToEdit ? 'Edit Category' : 'New Category'}
                    </h2>
                    <p className={styles.subtitle}>
                        {isViewOnly
                            ? 'Viewing category information.'
                            : categoryToEdit
                                ? 'Update your category details below.'
                                : 'Organize your art pieces by creating a new group.'}
                    </p>
                </header>

                <form className={styles.form} onSubmit={handleSave}>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Category Name</label>
                        <input
                            type="text"
                            className={styles.input}
                            placeholder="e.g. Modernism, Abstract"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={isViewOnly}
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Category Cover Image</label>
                        <div
                            className={`${styles.uploadArea} ${isViewOnly ? styles.viewOnlyArea : ''}`}
                            onClick={() => !isViewOnly && document.getElementById('catImageInput')?.click()}
                        >
                            <input
                                id="catImageInput"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{ display: 'none' }}
                                disabled={isViewOnly}
                            />
                            {preview ? (
                                <div className={styles.preview}>
                                    <img src={preview} alt="Category preview" />
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                                    <Upload size={32} color="#3b82f6" opacity={0.6} />
                                    <p style={{ fontSize: '0.9rem', color: '#666' }}>
                                        {isViewOnly ? 'No Image Provided' : 'Upload Image (Max 5MB)'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {!isViewOnly && (
                        <button
                            type="submit"
                            className={styles.saveBtn}
                            disabled={loading || !name}
                        >
                            {loading ? (
                                categoryToEdit ? 'Updating...' : 'Creating...'
                            ) : (
                                <>
                                    <Check size={20} />
                                    {categoryToEdit ? 'Update Category' : 'Save Category'}
                                </>
                            )}
                        </button>
                    )}

                    {isViewOnly && (
                        <button
                            type="button"
                            className={styles.saveBtn}
                            onClick={onClose}
                            style={{ background: 'rgba(255,255,255,0.05)', color: '#fff' }}
                        >
                            Close Viewer
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
}
