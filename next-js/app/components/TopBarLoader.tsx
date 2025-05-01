"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

NProgress.configure({ showSpinner: false });

export default function TopBarLoader() {
  const pathname = usePathname();
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    if (isFirstLoad) {
      setIsFirstLoad(false);
      return;
    }

    NProgress.start();
    const timeout = setTimeout(() => {
      NProgress.done();
    }, 300); // simulate transition duration

    return () => clearTimeout(timeout);
  }, [pathname]);

  return null;
}
