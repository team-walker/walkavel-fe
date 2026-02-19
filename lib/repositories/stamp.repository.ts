import { getApi } from '@/types/api';
import { CreateStampDto, StampResponseDto, StampSummaryDto } from '@/types/model';

/**
 * 스탬프 미션 및 수집 데이터에 대한 영속성 레이어입니다.
 */
export const stampRepository = {
  /**
   * 유저의 스탬프 요약 정보를 가져옵니다.
   */
  async getSummary(): Promise<StampSummaryDto> {
    const api = getApi();
    return await api.userControllerGetMyStampSummary();
  },

  /**
   * 스탬프를 획득합니다.
   */
  async collect(createStampDto: CreateStampDto): Promise<StampResponseDto> {
    const api = getApi();
    return await api.tourControllerCreateStamp(createStampDto);
  },
};
