import  { useEffect, useState } from "react";

export function useDeviceInfo() {
    // Initialize state with undefined width/height so server and client renders match
    // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
    const [deviceInfo, setDeviceInfo] = useState({
      isIOS: undefined,
      isIPad:undefined,
      isSafari:undefined,
      isIPhone:undefined,
    });
  
    useEffect(() => {
      // only execute all the code below in client side
      if (typeof window !== 'undefined') {
        function checkForIOS() {
          const ua = window.navigator.userAgent;
          const webkit = !!ua.match(/WebKit/i);
          const isIPad = !!ua.match(/iPad/i);
          const isIPhone = !!ua.match(/iPhone/i)
          const isIOS = isIPad || isIPhone;
          const isSafari = isIOS && webkit && !ua.match(/CriOS/i);
          const isApple = isIOS || isSafari
          setDeviceInfo({...deviceInfo, isIPad,isIPhone, isIOS, isSafari, isApple})
      }
      checkForIOS()
      }
    }, []);
    return deviceInfo;
  }
