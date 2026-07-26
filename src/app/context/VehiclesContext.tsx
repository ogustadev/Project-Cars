import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Vehicle } from "../data/vehicles";
import { supabase } from "../lib/supabase";

interface VehiclesContextValue {
  vehicles: Vehicle[];
  loading: boolean;
  addVehicle: (v: Vehicle) => Promise<void>;
  updateVehicle: (id: string, patch: Partial<Vehicle>) => Promise<void>;
  deleteVehicle: (id: string) => Promise<void>;
  togglePause: (id: string) => Promise<void>;
  refreshVehicles: () => Promise<void>;
}

const VehiclesContext = createContext<VehiclesContextValue | null>(null);

// Mapper: DB (snake_case) to Frontend (camelCase)
function mapToFrontend(dbVehicle: any): Vehicle {
  return {
    id: dbVehicle.id,
    brand: dbVehicle.brand,
    model: dbVehicle.model,
    year: dbVehicle.year,
    km: dbVehicle.km,
    color: dbVehicle.color,
    selo: dbVehicle.selo,
    categoria: dbVehicle.categoria,
    carroceria: dbVehicle.carroceria,
    cambio: dbVehicle.cambio,
    combustivel: dbVehicle.combustivel,
    motor: dbVehicle.motor,
    potencia: dbVehicle.potencia,
    velocidadeMax: dbVehicle.velocidade_max,
    price: dbVehicle.price,
    shortDesc: dbVehicle.short_desc,
    highlights: dbVehicle.highlights,
    images: dbVehicle.images,
    featuredImage: dbVehicle.featured_image,
    available: dbVehicle.available,
    paused: dbVehicle.paused,
    addedWeeksAgo: dbVehicle.added_weeks_ago,
  };
}

// Mapper: Frontend (camelCase) to DB (snake_case)
function mapToDB(frontendVehicle: Partial<Vehicle>): any {
  const db: any = { ...frontendVehicle };
  if (db.velocidadeMax !== undefined) {
    db.velocidade_max = db.velocidadeMax;
    delete db.velocidadeMax;
  }
  if (db.shortDesc !== undefined) {
    db.short_desc = db.shortDesc;
    delete db.shortDesc;
  }
  if (db.featuredImage !== undefined) {
    db.featured_image = db.featuredImage;
    delete db.featuredImage;
  }
  if (db.addedWeeksAgo !== undefined) {
    db.added_weeks_ago = db.addedWeeksAgo;
    delete db.addedWeeksAgo;
  }
  return db;
}

export function VehiclesProvider({ children }: { children: ReactNode }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshVehicles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("Erro ao buscar veículos:", error);
    } else if (data) {
      setVehicles(data.map(mapToFrontend));
    }
    setLoading(false);
  };

  useEffect(() => {
    refreshVehicles();
  }, []);

  const addVehicle = async (v: Vehicle) => {
    const { error } = await supabase.from("vehicles").insert(mapToDB(v));
    if (error) {
      console.error("Erro ao adicionar:", error);
      throw error;
    }
    await refreshVehicles();
  };

  const updateVehicle = async (id: string, patch: Partial<Vehicle>) => {
    const { error } = await supabase.from("vehicles").update(mapToDB(patch)).eq("id", id);
    if (error) {
      console.error("Erro ao atualizar:", error);
      throw error;
    }
    setVehicles((prev) => prev.map((v) => (v.id === id ? { ...v, ...patch } : v)));
  };

  const deleteVehicle = async (id: string) => {
    const { error } = await supabase.from("vehicles").delete().eq("id", id);
    if (error) {
      console.error("Erro ao deletar:", error);
      throw error;
    }
    setVehicles((prev) => prev.filter((v) => v.id !== id));
  };

  const togglePause = async (id: string) => {
    const vehicle = vehicles.find(v => v.id === id);
    if (!vehicle) return;
    const newPausedStatus = !vehicle.paused;
    
    const { error } = await supabase.from("vehicles").update({ paused: newPausedStatus }).eq("id", id);
    if (error) {
      console.error("Erro ao pausar:", error);
      throw error;
    }
    setVehicles((prev) =>
      prev.map((v) => (v.id === id ? { ...v, paused: newPausedStatus } : v))
    );
  };

  return (
    <VehiclesContext.Provider value={{ vehicles, loading, addVehicle, updateVehicle, deleteVehicle, togglePause, refreshVehicles }}>
      {children}
    </VehiclesContext.Provider>
  );
}

export function useVehicles() {
  const ctx = useContext(VehiclesContext);
  if (!ctx) throw new Error("useVehicles must be used within VehiclesProvider");
  return ctx;
}
