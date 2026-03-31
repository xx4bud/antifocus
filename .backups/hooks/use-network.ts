import { useEffect, useState } from "react";

interface NetworkInformation {
  addEventListener(type: string, listener: () => void): void;
  downlink: number;
  effectiveType: string;
  removeEventListener(type: string, listener: () => void): void;
  rtt: number;
}

interface NavigatorWithConnection extends Navigator {
  connection?: NetworkInformation;
  mozConnection?: NetworkInformation;
  webkitConnection?: NetworkInformation;
}

export const useNetwork = () => {
  const [effectiveType, setEffectiveType] = useState<string>("");
  const [downlink, setDownlink] = useState<number>(0);
  const [rtt, setRtt] = useState<number>(0);

  useEffect(() => {
    const nav = navigator as NavigatorWithConnection;
    const connection =
      nav.connection || nav.mozConnection || nav.webkitConnection;

    if (!connection) {
      return;
    }

    const updateNetwork = () => {
      setEffectiveType(connection.effectiveType || "");
      setDownlink(connection.downlink || 0);
      setRtt(connection.rtt || 0);
    };

    updateNetwork();

    connection.addEventListener("change", updateNetwork);

    return () => {
      connection.removeEventListener("change", updateNetwork);
    };
  }, []);

  return { effectiveType, downlink, rtt };
};
