import { createContext, useContext, useState, ReactNode } from "react";
import { vehicles as initialVehicles, Vehicle } from "../data/vehicles";

interface VehiclesContextValue {
  vehicles: Vehicle[];
  addVehicle: (v: Vehicle) => void;
  updateVehicle: (id: string, patch: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;
  togglePause: (id: string) => void;
}

const VehiclesContext = createContext<VehiclesContextValue | null>(null);

export function VehiclesProvider({ children }: { children: ReactNode }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);

  const addVehicle = (v: Vehicle) => setVehicles((prev) => [v, ...prev]);

  const updateVehicle = (id: string, patch: Partial<Vehicle>) =>
    setVehicles((prev) => prev.map((v) => (v.id === id ? { ...v, ...patch } : v)));

  const deleteVehicle = (id: string) =>
    setVehicles((prev) => prev.filter((v) => v.id !== id));

  const togglePause = (id: string) =>
    setVehicles((prev) =>
      prev.map((v) => (v.id === id ? { ...v, paused: !v.paused } : v))
    );

  return (
    <VehiclesContext.Provider value={{ vehicles, addVehicle, updateVehicle, deleteVehicle, togglePause }}>
      {children}
    </VehiclesContext.Provider>
  );
}

export function useVehicles() {
  const ctx = useContext(VehiclesContext);
  if (!ctx) throw new Error("useVehicles must be used within VehiclesProvider");
  return ctx;
}
