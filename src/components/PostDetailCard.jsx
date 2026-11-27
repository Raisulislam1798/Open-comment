'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiArrowLeft, FiHash, FiUser, FiFileText } from 'react-icons/fi';

const PostDetailCard = ({ id }) => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();

    const fetchPostById = async () => {
      setLoading(true);
      setError('');

      try {
        const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`Post with ID ${id} not found`);
        }

        const data = await res.json();
        setPost(data);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Failed to fetch post details');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPostById();

    return () => controller.abort();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center text-slate-600">
        Fetching details for ID #{id}...
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center space-y-4">
        <p className="text-red-600 font-medium">{error || 'Post not found'}</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:underline"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back to posts
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 mb-5"
      >
        <FiArrowLeft className="w-4 h-4" />
        Back to all posts
      </Link>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-md p-6 space-y-5">

        {/* Title */}
        <div>
          <span className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
            Title
          </span>
          <h1 className="text-2xl font-bold text-slate-900 capitalize">
            {post.title}
          </h1>
        </div>

        <hr className="border-slate-100" />

        {/* Body */}
        <div>
          <span className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">
            <FiFileText className="w-4 h-4" />
            Body
          </span>
          <p className="text-slate-700 leading-relaxed text-base">
            {post.body}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PostDetailCard;