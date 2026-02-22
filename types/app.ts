import { LandmarkDto } from '@/types/model';

export type BookmarkedLandmark = LandmarkDto & {
  bookmarkId: number;
};
