import { DragHandler, useMotionValue, useTransform } from 'framer-motion';
import { useRef } from 'react';

const SWIPE_THRESHOLD = -100; // 삭제를 확정짓는 드래그 거리
const VELOCITY_THRESHOLD = -400; // 삭제를 확정짓는 드래그 속도
const BACK_LAYER_VISIBLE_RANGE = [0, -60]; // 배경 삭제 아이콘이 나타나는 지점

export const useSwipeAction = (onAction: () => void) => {
  const x = useMotionValue(0);
  const opacity = useTransform(x, BACK_LAYER_VISIBLE_RANGE, [0, 1]);
  const isDragging = useRef(false);

  const DragStart = () => {
    isDragging.current = true;
  };

  const DragEnd: DragHandler = (_, info) => {
    const shouldTrigger = info.offset.x < SWIPE_THRESHOLD || info.velocity.x < VELOCITY_THRESHOLD;
    if (shouldTrigger) onAction();
    setTimeout(() => {
      isDragging.current = false;
    }, 100);
  };

  return { x, opacity, isDragging, DragStart, DragEnd };
};
