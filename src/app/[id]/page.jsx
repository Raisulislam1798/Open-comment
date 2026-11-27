import PostDetailCard from '@/components/PostDetailCard';

export default async function DynamicIdPage({ params }) {
  const { id } = await params;
  return <PostDetailCard id={id} />;
}