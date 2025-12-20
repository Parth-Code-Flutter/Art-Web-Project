"use client";

import { Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { deleteArtwork } from "@/app/actions/inventory";

interface DeleteArtworkButtonProps {
    id: string;
    imageUrl: string;
}

export function DeleteArtworkButton({ id, imageUrl }: DeleteArtworkButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this artwork? This action cannot be undone.")) {
            return;
        }

        setIsDeleting(true);
        const result = await deleteArtwork(id, imageUrl);

        if (result?.error) {
            alert("Error: " + result.error);
            setIsDeleting(false);
        }
        // revalidatePath in the action will handle UI update
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 text-zinc-500 hover:text-rose-500 transition-colors disabled:opacity-50"
            title="Delete Artwork"
        >
            {isDeleting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <Trash2 className="w-4 h-4" />
            )}
        </button>
    );
}
