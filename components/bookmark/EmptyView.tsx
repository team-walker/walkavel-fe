import BookmarkIcon from '@/public/images/bookmark.svg';

export default function EmptyView() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#F2F4F6]">
        <BookmarkIcon width={28} height={28} className="text-gray-300" />
      </div>
      <h3 className="mb-2 text-[20px] font-bold text-gray-900">아직 저장한 장소가 없어요</h3>
      <p className="text-[15px] text-gray-500">마음에 드는 곳을 북마크해보세요</p>
    </div>
  );
}
