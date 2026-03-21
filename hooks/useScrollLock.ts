"use client";
 
import { useEffect } from "react";
 
let lockCount = 0;
let originalScrollY = 0;

export function useScrollLock(lock: boolean) {
  useEffect(() => {
    if (!lock) return;

    if (lockCount === 0) {
      originalScrollY = window.scrollY;
      const body = document.body;
      body.style.position = "fixed";
      body.style.top = `-${originalScrollY}px`;
      body.style.left = "0";
      body.style.right = "0";
      body.style.overflow = "hidden";
    }
    
    lockCount++;

    return () => {
      lockCount--;
      
      if (lockCount === 0) {
        const body = document.body;
        body.style.position = "";
        body.style.top = "";
        body.style.left = "";
        body.style.right = "";
        body.style.overflow = "";
        window.scrollTo(0, originalScrollY);
      }
    };
  }, [lock]);
}