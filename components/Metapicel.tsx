
"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import Script from "next/script";
import { db } from "@/lib/firebase";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

export default function MetaPixel() {
  const pathname = usePathname();
  const [pixelId, setPixelId] = useState("");
  const initializedId = useRef("");
  const lastTrackedPath = useRef("");

  const isAdmin =
    pathname === "/admin" ||
    pathname.startsWith("/admin/");

  useEffect(() => {
    async function loadPixelId() {
      try {
        const snapshot = await getDoc(
          doc(db, "settings", "ads")
        );

        if (snapshot.exists()) {
          const id = snapshot.data().metaPixelId;

          if (typeof id === "string" && /^\d+$/.test(id)) {
            setPixelId(id);
          }
        }
      } catch (error) {
        console.error("Meta Pixel 불러오기 오류:", error);
      }
    }

    loadPixelId();
  }, []);

  const trackPageView = () => {
    if (!pixelId || isAdmin || !window.fbq) return;

    if (lastTrackedPath.current === pathname) return;

    window.fbq("track", "PageView");
    lastTrackedPath.current = pathname;
  };

  useEffect(() => {
    if (!pixelId || !window.fbq) return;

    if (initializedId.current !== pixelId) {
      window.fbq("init", pixelId);
      initializedId.current = pixelId;
    }

    trackPageView();
  }, [pixelId, pathname, isAdmin]);

  if (!pixelId || isAdmin) return null;

  return (
    <Script
      id="meta-pixel-script"
      strategy="afterInteractive"
      onReady={() => {
        if (!window.fbq) return;

        if (initializedId.current !== pixelId) {
          window.fbq("init", pixelId);
          initializedId.current = pixelId;
        }

        trackPageView();
      }}
    >
      {`
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;
        n.version='2.0';n.queue=[];
        t=b.createElement(e);t.async=!0;t.src=v;
        s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)
        }(window,document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
      `}
    </Script>
  );
}
