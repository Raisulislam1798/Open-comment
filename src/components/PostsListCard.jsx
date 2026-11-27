'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiMessageSquare, FiArrowRight } from 'react-icons/fi';

const PostsListCard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const res = await fetch('https://jsonplaceholder.typicode.com/posts');
        if (!res.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchAllPosts();
  }, []);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center text-slate-600">
        Loading posts...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-4">
      <h2 className="text-2xl font-bold text-slate-800 mb-4">
        All Posts ({posts.length})
      </h2>

      {posts.map((post) => (
        <Link
          key={post.id}
          href={`/${post.id}`}
          className="block group bg-white border border-slate-200 hover:border-indigo-500 rounded-xl p-4 shadow-sm hover:shadow-md transition duration-200"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="mt-1 p-2 rounded-lg bg-indigo-50 text-indigo-600">
                <FiMessageSquare className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-indigo-600">
                  post {post.id}
                </span>
                <h3 className="text-base font-semibold text-slate-800 group-hover:text-indigo-600 capitalize transition">
                  {post.title}
                </h3>
              </div>
            </div>

            <FiArrowRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 shrink-0 mt-2 transition" />
          </div>
        </Link>
      ))}
    </div>
  );
};

export default PostsListCard;