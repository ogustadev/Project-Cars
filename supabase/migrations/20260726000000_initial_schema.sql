-- 1. Extensão para UUID
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Enum para Status de Agendamento
CREATE TYPE appointment_status AS ENUM ('PENDING', 'CONFIRMED', 'CANCELED', 'COMPLETED');

-- 3. Tabela de Veículos
CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    year INTEGER NOT NULL,
    km INTEGER NOT NULL,
    color TEXT NOT NULL,
    selo TEXT,
    categoria TEXT NOT NULL,
    carroceria TEXT NOT NULL,
    cambio TEXT NOT NULL,
    combustivel TEXT NOT NULL,
    motor TEXT NOT NULL,
    potencia TEXT NOT NULL,
    velocidade_max TEXT NOT NULL,
    price NUMERIC(15, 2), -- Aceita null, como no mock
    short_desc TEXT NOT NULL,
    highlights TEXT[] NOT NULL DEFAULT '{}',
    images TEXT[] NOT NULL DEFAULT '{}',
    featured_image TEXT,
    available BOOLEAN NOT NULL DEFAULT true,
    paused BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Tabela de Agendamentos / Leads
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    client_name TEXT NOT NULL,
    client_email TEXT NOT NULL,
    client_phone TEXT NOT NULL,
    scheduled_at TIMESTAMPTZ NOT NULL,
    status appointment_status NOT NULL DEFAULT 'PENDING',
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Índices de performance
CREATE INDEX idx_vehicles_slug ON vehicles(slug);
CREATE INDEX idx_vehicles_available ON vehicles(available);
CREATE INDEX idx_appointments_vehicle_id ON appointments(vehicle_id);
CREATE INDEX idx_appointments_status ON appointments(status);

-- 6. Função e Trigger para updated_at (Gerenciamento automático de cache/modificação)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_vehicles_modtime
BEFORE UPDATE ON vehicles
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_appointments_modtime
BEFORE UPDATE ON appointments
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Habilitar RLS
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- ==== POLÍTICAS: VEHICLES ====

-- 1. Leitura pública para veículos disponíveis e não pausados
CREATE POLICY "Veículos ativos são de leitura pública" ON vehicles
    FOR SELECT
    USING (available = true AND paused = false);

-- 2. Acesso total para administradores (autenticados no painel)
CREATE POLICY "Admins têm acesso total a veículos" ON vehicles
    TO authenticated
    USING (true)
    WITH CHECK (true);


-- ==== POLÍTICAS: APPOINTMENTS ====

-- 1. Qualquer pessoa na internet pode criar um agendamento (captação de lead)
CREATE POLICY "Visitantes podem solicitar agendamento" ON appointments
    FOR INSERT
    WITH CHECK (true);

-- 2. Apenas administradores podem visualizar a lista de leads
CREATE POLICY "Admins podem ver agendamentos" ON appointments
    FOR SELECT
    TO authenticated
    USING (true);

-- 3. Apenas administradores podem atualizar (ex: mudar status para CONFIRMED)
CREATE POLICY "Admins podem gerenciar agendamentos" ON appointments
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admins podem deletar agendamentos" ON appointments
    FOR DELETE
    TO authenticated
    USING (true);

-- DADOS MOCK (SEED)
INSERT INTO vehicles 
(slug, brand, model, year, km, color, selo, categoria, carroceria, cambio, combustivel, motor, potencia, velocidade_max, price, short_desc, highlights, images, featured_image, available)
VALUES 
(
  'porsche-gt3rs', 'Porsche', '911 GT3 RS', 2024, 1200, 'Branco Carrara', 'RARO', 'Esportivos', 'Coupé', 'PDK', 'Gasolina', '4.0L Boxer 6 aspirado', '525 cv', '296 km/h', 2890000.00, 
  'Aero kit Weissach, bancos em fibra de carbono e procedência impecável de primeiro dono.', 
  ARRAY['Aero kit Weissach completo', 'Teto em magnésio', 'Rodas forjadas 20"', 'Bancos em fibra de carbono'], 
  ARRAY['/storage/v1/object/public/cars/porsche_1.jpg', '/storage/v1/object/public/cars/porsche_2.jpg'], 
  '/storage/v1/object/public/cars/porsche_destaque.jpg', 
  true
),
(
  'ferrari-296gtb', 'Ferrari', '296 GTB', 2023, 3400, 'Rosso Corsa', 'ÚLTIMA UNIDADE', 'Esportivos', 'Coupé', 'DCT', 'Híbrido', 'V6 híbrido turbinado', '830 cv', '330 km/h', NULL, 
  'V6 híbrido turbinado, 830 cv combinados. Histórico completo e revisão oficial.', 
  ARRAY['Pacote Assetto Fiorano', 'Freios carbono-cerâmica', 'Revisão oficial em dia', 'Interior Alcantara'], 
  ARRAY['/storage/v1/object/public/cars/ferrari_1.jpg'], 
  NULL, 
  true
);
