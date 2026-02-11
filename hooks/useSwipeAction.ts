import { DragHandler, useMotionValue, useTransform } from 'framer-motion';
import { useRef } from 'react';

import { SWIPE_CONFIG } from '@/constants/types';

export const useSwipeAction = (onAction: () => void) => {
  const x = useMotionValue(0);
  const opacity = useTransform(x, [...SWIPE_CONFIG.VISIBLE_RANGE], [0, 1]);
  const isDragging = useRef(false);

  const DragStart = () => {
    isDragging.current = true;
  };

  const DragEnd: DragHandler = (_, info) => {
    const shouldTrigger =
      info.offset.x < SWIPE_CONFIG.THRESHOLD || info.velocity.x < SWIPE_CONFIG.VELOCITY;
    if (shouldTrigger) onAction();
    setTimeout(() => {
      isDragging.current = false;
    }, 100);
  };

  return { x, opacity, isDragging, DragStart, DragEnd };
};
