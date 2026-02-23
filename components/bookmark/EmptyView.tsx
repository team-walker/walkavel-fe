import BookmarkIcon from '@/public/images/bookmark.svg';

export default function EmptyView() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center">
      <div className="bg-walkavel-gray-100 mb-6 flex h-16 w-16 items-center justify-center rounded-full">
        <BookmarkIcon width={28} height={28} className="text-walkavel-gray-300" />
      </div>
      <h3 className="text-walkavel-gray-900 mb-2 text-xl font-bold break-keep">
        아직 나의 워커블이 없어요
      </h3>
      <p className="text-walkavel-gray-500 text-sm break-keep">
        카드를 스와이프하며
        <br />
        마음에 드는 곳을 발견하고 저장해 보세요
      </p>
    </div>
  );
}
