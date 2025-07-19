import { getCollectionById } from '@/actions/collection';
import { getJournalEntries } from '@/actions/journal';
import DeleteCollectionButton from './_components/delete-collection';
import React from 'react'
import JournalFilters from './_components/journal-filters';


const CollectionPage = async ({params}: {params: {collectionId: string}}) => {
    const { collectionId } = params;
    const entries = await getJournalEntries({collectionId});
    const collection = await getCollectionById(collectionId);

  return (
    <div className='space-y-6'>
        <div className='flex flex-col justify-between'>
            <div className='flex justify-between'>
                <h1 className='text-4xl font-bold gradient-title'>
                    {collectionId === "unorganized" ? "Unorganized Entries" : collection?.name}
                </h1>
                {collection && entries.success && (
                    <DeleteCollectionButton 
                        collection={collection}
                        entriesCount={entries.data.entries.length}
                    />
                )}
            </div>
            {collection?.description && (
                <p className='text-sm text-muted-foreground'>
                    {collection?.description}
                </p>
            )}
        </div>

        <JournalFilters 
          collectionId={collectionId} 
        />
    </div>
  )
}

export default CollectionPage;