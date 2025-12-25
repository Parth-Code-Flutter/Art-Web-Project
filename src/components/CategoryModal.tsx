'use client';

import React, { useState } from 'react';
import { X, Upload, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import styles from './CategoryModal.module.css';

interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

/**
 * CategoryModal Component
 * 
 * A modern dialog for creating new product categories.
 * Features:
 * - Image upload with preview
 * - 5MB size validation
 * - Supabase Storage & DB integration
 */
export default function CategoryModal({ isOpen, onClose, onSuccess }: CategoryModalProps) {
    const [name, setName] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        if (!name) return;

        setLoading(true);
        try {
            let imageUrl = '';

            // 1. Upload Category Image if exists
            if (image) {
                const fileExt = image.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `category-images/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('products') // Using the same bucket for simplicity, or create 'categories'
                    .upload(filePath, image);

                if (!uploadError) {
                    const { data: { publicUrl } } = supabase.storage
                        .from('products')
                        .getPublicUrl(filePath);
                    imageUrl = publicUrl;
                }
            }

            // 2. Insert into categories table
            const { error } = await supabase.from('categories').insert([
                { name, image_url: imageUrl }
            ]);

            if (error) throw error;

            onSuccess();
            onClose();
            // Reset state
            setName('');
            setImage(null);
            setPreview(null);
        } catch (err: any) {
            alert(err.message || 'Error creating category');
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
                    <h2 className={styles.title}>New Category</h2>
                    <p className={styles.subtitle}>Organize your art pieces by creating a new group.</p>
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
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Category Cover Image</label>
                        <div
                            className={styles.uploadArea}
                            onClick={() => document.getElementById('catImageInput')?.click()}
                        >
                            <input
                                id="catImageInput"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{ display: 'none' }}
                            />
                            {preview ? (
                                <div className={styles.preview}>
                                    <img src={preview} alt="Category preview" />
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                                    <Upload size={32} color="#3b82f6" opacity={0.6} />
                                    <p style={{ fontSize: '0.9rem', color: '#666' }}>Upload Image (Max 5MB)</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className={styles.saveBtn}
                        disabled={loading || !name}
                    >
                        {loading ? (
                            'Creating...'
                        ) : (
                            <>
                                <Check size={20} />
                                Save Category
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
