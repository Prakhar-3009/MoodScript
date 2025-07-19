import { getCollections } from '@/actions/collection';
import { getJournalEntries } from '@/actions/journal';
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, PenTool, BookOpen, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Collections from './_components/collections';
import MoodAnalytics from './_components/mood-analytics';

const Dashboard = async () => {
    const collections = await getCollections();
    const entriesData = await getJournalEntries();
    let entriesByCollection: Record<string, any[]> = {};

    if (entriesData && entriesData.success && entriesData.data && Array.isArray(entriesData.data.entries)) {
        entriesByCollection = entriesData.data.entries.reduce((acc: Record<string, any[]>, entry: any) => {
            const collectionId = entry?.collection?.id ?? 'unorganized';
            if (!acc[collectionId]) {
                acc[collectionId] = [];
            }
            acc[collectionId].push(entry);
            return acc;
        }, {});
    }

    // Mock data for demonstration
    const recentEntries = entriesData?.success && entriesData.data?.entries ? entriesData.data.entries.slice(0, 3) : [];

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
            {/* Welcome Section */}
            <section className="text-center space-y-4">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <Sparkles className="w-6 h-6 text-orange-500" />
                    <h1 className="text-4xl md:text-5xl font-bold text-orange-900">
                        Welcome back, Thinker!
                    </h1>
                    <Sparkles className="w-6 h-6 text-orange-500" />
                </div>
                <p className="text-xl text-orange-700 max-w-2xl mx-auto">
                    Ready to capture today's thoughts and feelings? Your journey of self-discovery continues here.
                </p>
            </section>

            {/* Mood Analytics Section */}
            <section className="space-y-4">
                <MoodAnalytics />
            </section>

            {/* Collections Section */}
            <Collections
                collections={collections}
                entriesByCollection={entriesByCollection}
            />

            {/* Recent Entries Section */}
            <section className="space-y-6">
                <Card className="bg-white/80 backdrop-blur-sm border-orange-200">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-orange-900">
                            <Calendar className="w-5 h-5" />
                            Recent Entries
                        </CardTitle>
                        <CardDescription>Your latest thoughts and reflections</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {recentEntries.length > 0 ? (
                            recentEntries.map((entry: any, index: number) => (
                                <div key={index} className="p-4 border border-orange-100 rounded-lg bg-orange-50/50">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-semibold text-orange-900">{entry.title}</h4>
                                        <Badge variant="secondary" className="text-xs">
                                            {new Date(entry.createdAt).toLocaleDateString()}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-orange-700 line-clamp-2">
                                        {entry.content?.replace(/<[^>]*>/g, '').substring(0, 100)}...
                                    </p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Badge className="bg-orange-100 text-orange-700">
                                            {entry.mood}
                                        </Badge>
                                        {entry.collection && (
                                            <Badge variant="outline" className="text-xs">
                                                {entry.collection.name}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-orange-600">
                                <PenTool className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p>No entries yet. Start your journaling journey!</p>
                                <Link href="/journal/write">
                                    <Button className="mt-4" size="sm">
                                        Write Your First Entry
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </section>
        </div>
    );
};

export default Dashboard;