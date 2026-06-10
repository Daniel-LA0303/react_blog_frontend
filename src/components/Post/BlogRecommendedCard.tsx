import { Link } from 'react-router-dom'
import useGlobalDataContext from '../../context/hooks/useGlobalDataContext'

const BlogRecommendedCard = ({ blog }: { blog: any }) => {
  const { globalData } = useGlobalDataContext();
  const dark = !globalData.themeGlobal;
  const hasImage = !!blog?.linkImage?.secure_url;

  return (
    <Link
      to={`/view-post/${blog._id}`}
      className={`flex gap-3 p-3 rounded-xl border transition-colors duration-200 group
        ${dark
          ? 'bg-[#27272A] border-gray-800 hover:border-gray-700'
          : 'bg-white border-gray-100 hover:border-gray-200'
        }`}
    >
      {/* thumbnail — only if image exists */}
      {hasImage && (
        <img
          src={blog.linkImage.secure_url}
          alt={blog.title}
          className="h-16 w-16 rounded-lg object-cover flex-shrink-0"
        />
      )}

      {/* info */}
      <div className="min-w-0 flex flex-col justify-between">
        <p className={`text-sm font-medium line-clamp-2 leading-snug group-hover:underline underline-offset-2
          ${dark ? 'text-gray-200' : 'text-gray-800'}`}>
          {blog.title}
        </p>
        {blog.categories?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {blog.categories.slice(0, 2).map((cat: any) => (
              <span
                key={cat._id}
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ backgroundColor: cat.color + '22', color: cat.color }}
              >
                #{cat.name}
              </span>
            ))}
          </div>
        )}
        <p className={`text-xs mt-1 ${dark ? 'text-gray-600' : 'text-gray-400'}`}>
          {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </p>
      </div>
    </Link>
  );
};

export default BlogRecommendedCard;