-- Create vehicles table
CREATE TABLE IF NOT EXISTS public.vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand text NOT NULL,
  model text NOT NULL,
  year integer NOT NULL,
  km integer NOT NULL DEFAULT 0,
  color text NOT NULL,
  selo text,
  categoria text NOT NULL,
  carroceria text NOT NULL,
  cambio text NOT NULL,
  combustivel text NOT NULL,
  motor text NOT NULL,
  potencia text NOT NULL,
  velocidade_max text NOT NULL,
  price numeric,
  short_desc text NOT NULL,
  highlights text[] NOT NULL DEFAULT '{}',
  images text[] NOT NULL DEFAULT '{}',
  featured_image text,
  available boolean NOT NULL DEFAULT true,
  paused boolean NOT NULL DEFAULT false,
  added_weeks_ago integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Public can view available vehicles" ON public.vehicles
    FOR SELECT USING (paused = false);
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Auth users have full access" ON public.vehicles
    FOR ALL TO authenticated USING (true) WITH CHECK (true);
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Storage
INSERT INTO storage.buckets (id, name, public) 
VALUES ('vehicle-images', 'vehicle-images', true)
ON CONFLICT (id) DO NOTHING;

DO $$ BEGIN
  CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'vehicle-images');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Auth Access" ON storage.objects FOR ALL TO authenticated USING (bucket_id = 'vehicle-images') WITH CHECK (bucket_id = 'vehicle-images');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Auth User
INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role)
VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'admin@selectcars.com.br',
  crypt('selectcars@2026', gen_salt('bf')),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{}',
  'authenticated',
  'authenticated'
) ON CONFLICT (email) DO NOTHING;

-- Insert Mock Data
INSERT INTO public.vehicles (id, brand, model, year, km, color, selo, categoria, carroceria, cambio, combustivel, motor, potencia, velocidade_max, price, short_desc, highlights, images, featured_image, available, paused, added_weeks_ago)
VALUES 
('f55b172a-609c-48be-9b7e-967f08c35b8e', 'Porsche', '911 GT3 RS', 2024, 1200, 'Branco Carrara', 'RARO', 'Esportivos', 'Coupé', 'PDK', 'Gasolina', '4.0L Boxer 6 aspirado', '525 cv', '296 km/h', 2890000, 'Aero kit Weissach, bancos em fibra de carbono e procedência impecável de primeiro dono.', ARRAY['Aero kit Weissach completo', 'Teto em magnésio', 'Rodas forjadas 20"', 'Bancos em fibra de carbono'], ARRAY['/imports/Image__Porsche_911_GT3_RS_.png', '/imports/Image__Porsche_911_GT3_RS_em_destaque_.png', '/imports/Video_-_Porsche_911_GT3_RS___perfil_em_v_deo.png'], '/imports/Image__Porsche_911_GT3_RS_em_destaque_.png', true, false, 0),
('62544c80-6058-48b8-bdf4-fde26e5fc3a2', 'Ferrari', '296 GTB', 2023, 3400, 'Rosso Corsa', 'ÚLTIMA UNIDADE', 'Esportivos', 'Coupé', 'DCT', 'Híbrido', 'V6 híbrido turbinado', '830 cv', '330 km/h', null, 'V6 híbrido turbinado, 830 cv combinados. Histórico completo e revisão oficial.', ARRAY['Pacote Assetto Fiorano', 'Freios carbono-cerâmica', 'Revisão oficial em dia', 'Interior Alcantara'], ARRAY['/imports/Image__Ferrari_296_GTB_-1.png', '/imports/Image__Ferrari_296_GTB_.png'], null, true, false, 1),
('2d015b63-0c46-4c4f-9e7b-cde9b158019b', 'Lamborghini', 'Huracán Tecnica', 2024, 800, 'Bianco Icarus', 'NOVO', 'Edições limitadas', 'Coupé', 'DCT', 'Gasolina', '5.2L V10 aspirado', '640 cv', '325 km/h', 3450000, 'V10 aspirado, dinâmica de pista, configuração específica para a unidade.', ARRAY['Configuração Ad Personam', 'Escapamento esportivo', 'Pacote em carbono', 'Bancos esportivos'], ARRAY['/imports/Image__Lamborghini_Hurac_n_Tecnica_-1.png', '/imports/Image__Lamborghini_Hurac_n_Tecnica_.png'], null, true, false, 0),
('f22e8469-65a1-43e5-8123-f32a0c242ef9', 'Mercedes-AMG', 'GT 63 S', 2023, 5100, 'Cinza Selenita', null, 'Esportivos', 'Sedan', 'Automático', 'Gasolina', '4.0L V8 biturbo', '639 cv', '315 km/h', 1690000, 'Quatro portas com motor 4.0 V8 biturbo. Acabamento Designo e laudo independente.', ARRAY['Acabamento Designo', 'Teto panorâmico', 'Burmester High-End', 'Laudo independente'], ARRAY['/imports/Image__Mercedes-AMG_GT_63_S_-1.png', '/imports/Image__Mercedes-AMG_GT_63_S_.png'], null, true, false, 2),
('7f6c3821-65f2-4e4f-b649-656d0a70198c', 'Aston Martin', 'DB12', 2024, 1500, 'Magnetic Silver', 'RESERVADO', 'Esportivos', 'GT', 'Automático', 'Gasolina', '4.0L V8 biturbo', '680 cv', '325 km/h', null, 'GT inglês com 680 cv. Couro Bridge of Weir e detalhes em alumínio escovado.', ARRAY['Couro Bridge of Weir', 'Alumínio escovado', 'Freios carbono-cerâmica', 'Bang & Olufsen'], ARRAY['/imports/Image__Aston_Martin_DB12_-1.png', '/imports/Image__Aston_Martin_DB12_.png'], null, false, false, 3),
('eb497355-081e-42c2-be16-efc8fcba8903', 'Bentley', 'Continental GT Speed', 2023, 6800, 'Orange Flame', null, 'Clássicos', 'GT', 'Automático', 'Gasolina', '6.0L W12 biturbo', '659 cv', '335 km/h', 2150000, 'GT de 12 cilindros, interior em couro Mulliner, presença para qualquer agenda.', ARRAY['Interior Mulliner', 'Rodas 22" diamantadas', 'Naim for Bentley', 'Volante aquecido'], ARRAY['/imports/Image__Bentley_Continental_GT_Speed_-1.png', '/imports/Image__Bentley_Continental_GT_Speed_.png'], null, true, false, 4),
('8b5c90cf-22c6-4d1a-be39-813c01c0c6dc', 'BMW', 'M5 Competition', 2024, 2800, 'Cinza Brooklyn', 'NOVO', 'Recém-chegados', 'Sedan', 'Automático', 'Gasolina', '4.4L V8 biturbo', '625 cv', '305 km/h', 1290000, 'Sedã de alta performance com pacote M Competition e freios M Carbon.', ARRAY['Pacote M Competition', 'Freios M Carbon', 'M Driver''s Package', 'Bancos M em carbono'], ARRAY['/imports/Image__BMW_M5_Competition_-1.png', '/imports/Image__BMW_M5_Competition_.png'], null, true, false, 0),
('3ca1a669-7bc3-4d43-ac8b-40fa8dbba757', 'Jaguar', 'F-Type R75', 2023, 4200, 'Azul Velocity', null, 'Clássicos', 'Conversível', 'Automático', 'Gasolina', '5.0L V8 supercharged', '575 cv', '300 km/h', 980000, 'Edição de despedida do V8 supercharged. Capota flexível e escape esportivo.', ARRAY['Edição comemorativa R75', 'Escapamento Switchable', 'Meridian Surround', 'Bancos Windsor'], ARRAY['/imports/Image__Jaguar_F-Type_R75_-1.png', '/imports/Image__Jaguar_F-Type_R75_.png'], null, true, false, 5),
('819eb34a-9ef8-47bc-ad3b-7414bc9cfb4d', 'Range Rover', 'SV Autobiography', 2024, 3200, 'Belgravia Green', null, 'SUV Premium', 'SUV', 'Automático', 'Híbrido', '4.4L V8 híbrido', '615 cv', '290 km/h', 1890000, 'SUV de luxo com acabamento SV, mesas traseiras retráteis e sistema híbrido.', ARRAY['Acabamento SV Bespoke', 'Mesas Executive traseiras', 'Meridian Signature', 'Suspensão pneumática'], ARRAY['/imports/Image__Range_Rover_SV_Autobiography_.png'], null, true, false, 6)
ON CONFLICT (id) DO NOTHING;
