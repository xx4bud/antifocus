import { useEffect, useState } from "react";

interface BatteryManager {
  addEventListener(type: string, listener: () => void): void;
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number;
  removeEventListener(type: string, listener: () => void): void;
}

interface NavigatorWithBattery extends Navigator {
  getBattery(): Promise<BatteryManager>;
}

export const useBattery = () => {
  const [level, setLevel] = useState<number>(1);
  const [charging, setCharging] = useState<boolean>(false);
  const [chargingTime, setChargingTime] = useState<number>(0);
  const [dischargingTime, setDischargingTime] = useState<number>(
    Number.POSITIVE_INFINITY
  );

  useEffect(() => {
    const nav = navigator as NavigatorWithBattery;
    if (!nav.getBattery) {
      return;
    }

    const updateBattery = (battery: BatteryManager) => {
      setLevel(battery.level);
      setCharging(battery.charging);
      setChargingTime(battery.chargingTime);
      setDischargingTime(battery.dischargingTime);
    };

    nav.getBattery().then((battery: BatteryManager) => {
      updateBattery(battery);

      const handleChange = () => updateBattery(battery);

      battery.addEventListener("levelchange", handleChange);
      battery.addEventListener("chargingchange", handleChange);
      battery.addEventListener("chargingtimechange", handleChange);
      battery.addEventListener("dischargingtimechange", handleChange);

      return () => {
        battery.removeEventListener("levelchange", handleChange);
        battery.removeEventListener("chargingchange", handleChange);
        battery.removeEventListener("chargingtimechange", handleChange);
        battery.removeEventListener("dischargingtimechange", handleChange);
      };
    });
  }, []);

  return { level, charging, chargingTime, dischargingTime };
};
