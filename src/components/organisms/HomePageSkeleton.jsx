import React from 'react';
import { motion } from 'framer-motion';

const HomePageSkeleton = () => {
    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Header skeleton */}
                <div className="text-center mb-8">
                    <div className="h-10 bg-gray-200 rounded-lg w-48 mx-auto mb-4 animate-pulse"></div>
                    <div className="h-6 bg-gray-200 rounded-lg w-64 mx-auto animate-pulse"></div>
                </div>

                {/* Progress ring skeleton */}
                <div className="flex justify-center mb-8">
                    <div className="w-24 h-24 bg-gray-200 rounded-full animate-pulse"></div>
                </div>

                {/* Task input skeleton */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>

                {/* Filters skeleton */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-8 w-20 bg-gray-200 rounded-full animate-pulse"></div>
                    ))}
                </div>

                {/* Tasks skeleton */}
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white rounded-xl shadow-sm p-6"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HomePageSkeleton;