"use client";

import React, { useState, useEffect } from "react";
import { createCollection } from "@/actions/collection";
import { toast } from "sonner";
import CollectionPreview from "./collection-preview";
import CollectionForm from "@/components/collection-dialog";
import useFetch from "@/hooks/use-fetch";
import { BookOpen } from "lucide-react";

interface Collection {
  id: string;
  name: string;
  [key: string]: any; // if other dynamic fields exist
}

interface Entry {
  id: string;
  title: string;
  content: string;
  mood: string;
  createdAt: string;
  collectionId?: string;
  [key: string]: any;
}

interface CollectionsProps {
  collections?: Collection[];
  entriesByCollection: Record<string, Entry[]>;
}

const Collections: React.FC<CollectionsProps> = ({
  collections = [],
  entriesByCollection,
}) => {
  const [isCollectionDialogOpen, setIsCollectionDialogOpen] = useState(false);

  const {
    loading: createCollectionLoading,
    fn: createCollectionFn,
    data: createdCollection,
  } = useFetch<any, any>(createCollection);

  useEffect(() => {
    if (createdCollection) {
      setIsCollectionDialogOpen(false);
      // Remove the undefined fetchCollections call
      toast.success(`Collection ${createdCollection.name} created!`);
    }
  }, [createdCollection, createCollectionLoading]);

  const handleCreateCollection = async (data: any) => {
    createCollectionFn(data);
  };

  // Always show the collections section, even when there are no user collections

  return (
    <section id="collections" className="space-y-6">
      <h2 className="text-5xl font-bold gradient-title flex items-center gap-3">
        <BookOpen className="w-10 h-10 text-orange-500" />
        Collections
      </h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Create New Collection Button */}
        <CollectionPreview
          isCreateNew={true}
          onCreateNew={() => setIsCollectionDialogOpen(true)}
        />

        {/* Unorganized Collection */}
        <CollectionPreview
          name="Unorganized"
          entries={entriesByCollection?.unorganized || []}
          isUnorganized={true}
        />

        {/* User Collections */}
        {collections.map((collection) => (
          <CollectionPreview
            key={collection.id}
            id={collection.id}
            name={collection.name}
            entries={entriesByCollection[collection.id] || []}
          />
        ))}

        <CollectionForm
          loading={!!createCollectionLoading}
          onSuccess={handleCreateCollection}
          open={isCollectionDialogOpen}
          setOpen={setIsCollectionDialogOpen}
        />
      </div>
    </section>
  );
};

export default Collections;
