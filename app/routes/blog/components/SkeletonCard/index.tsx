export default function SkeletonCard() {
  return (
    <div className="flex flex-col bg-white border border-gray-100 rounded-xl overflow-hidden animate-pulse">
      <div className="aspect-video bg-gray-200" />
      <div className="p-6 flex flex-col grow">
        <div className="h-3 bg-gray-200 rounded w-1/4 mb-4" />
        <div className="grow space-y-2 mb-4">
          <div className="h-5 bg-gray-200 rounded w-3/4" />
          <div className="h-5 bg-gray-200 rounded w-1/2" />
        </div>
        <div className="h-15 flex flex-col justify-end space-y-2">
          <div className="h-3 bg-gray-200 rounded w-full" />
          <div className="h-3 bg-gray-200 rounded w-full" />
          <div className="h-3 bg-gray-200 rounded w-2/3" />
        </div>
      </div>
    </div>
  );
}
