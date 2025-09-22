// src/components/shared/MobileTouchHandler.js
import React, { useState, useRef, useEffect } from 'react';
import { Box } from '@mui/material';

const MobileTouchHandler = ({ 
  children, 
  onSwipeLeft, 
  onSwipeRight, 
  onSwipeUp, 
  onSwipeDown,
  swipeThreshold = 50,
  className = '',
  ...props 
}) => {
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const touchRef = useRef(null);

  const minSwipeDistance = swipeThreshold;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && onSwipeLeft) {
      onSwipeLeft();
    }
    if (isRightSwipe && onSwipeRight) {
      onSwipeRight();
    }
  };

  const onTouchStartVertical = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientY);
  };

  const onTouchMoveVertical = (e) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const onTouchEndVertical = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isUpSwipe = distance > minSwipeDistance;
    const isDownSwipe = distance < -minSwipeDistance;

    if (isUpSwipe && onSwipeUp) {
      onSwipeUp();
    }
    if (isDownSwipe && onSwipeDown) {
      onSwipeDown();
    }
  };

  // Detect if device supports touch
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  if (!isTouchDevice) {
    return <Box className={className} {...props}>{children}</Box>;
  }

  return (
    <Box
      ref={touchRef}
      className={className}
      onTouchStart={onSwipeLeft || onSwipeRight ? onTouchStart : onTouchStartVertical}
      onTouchMove={onSwipeLeft || onSwipeRight ? onTouchMove : onTouchMoveVertical}
      onTouchEnd={onSwipeLeft || onSwipeRight ? onTouchEnd : onTouchEndVertical}
      {...props}
    >
      {children}
    </Box>
  );
};

export default MobileTouchHandler;
