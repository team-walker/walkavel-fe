import { getApi } from '@/types/api';
import { CreateStampDto, StampResponseDto, StampSummaryDto } from '@/types/model';

export const stampRepository = {
  async getSummary(): Promise<StampSummaryDto> {
    const api = getApi();
    return await api.userControllerGetMyStampSummary();
  },

  async collect(createStampDto: CreateStampDto): Promise<StampResponseDto> {
    const api = getApi();
    return await api.tourControllerCreateStamp(createStampDto);
  },
};
