-- Datos de ejemplo de la API de sanidad vegetal de Breaze in the Moon.
-- Ejecutar con: pnpm seed (la API debe haberse iniciado al menos una vez para que TypeORM cree las tablas).
-- Borra todo lo que haya y vuelve a cargar los datos desde cero, con ids fijos.

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE outbreaks;
TRUNCATE TABLE crops;
TRUNCATE TABLE susceptibilities;
TRUNCATE TABLE treatments;
TRUNCATE TABLE diseases;
TRUNCATE TABLE plants;
TRUNCATE TABLE pathogens;
SET FOREIGN_KEY_CHECKS = 1;

-- Patógenos
INSERT INTO pathogens (id, name, scientificName, pathogenType, transmissionMode, geneticSequence) VALUES
  (1, 'Roya del cafeto', 'Hemileia vastatrix', 'hongo', 'viento', 'ACGTGGCTAACGTTAGCCAT'),
  (2, 'Broca del café', 'Hypothenemus hampei', 'insecto', 'contacto entre frutos', 'TTAGCCGATCGATCGGATAC'),
  (3, 'Tizón tardío', 'Phytophthora infestans', 'oomiceto', 'agua y viento', 'GGATCCATGCATTGCAAGTC'),
  (4, 'Moko', 'Ralstonia solanacearum', 'bacteria', 'suelo y herramientas', 'CATGGCTAGCTAAGCTTGCA'),
  (5, 'Mal de Panamá', 'Fusarium oxysporum f. sp. cubense', 'hongo', 'suelo', 'AGCTTAGCGGCATCGATTCA'),
  (6, 'Moho gris', 'Botrytis cinerea', 'hongo', 'viento', 'GCATCGTAGCTAGGCTACGT'),
  (7, 'Nematodo agallador', 'Meloidogyne incognita', 'nematodo', 'suelo', 'TACGATCGGATCAGCTTACG'),
  (8, 'Virus del rizado amarillo del tomate', 'Tomato yellow leaf curl virus', 'virus', 'insectos vectores (mosca blanca)', 'CGTAGCTAGCATCGTTAGCA');

-- Enfermedades (cada una causada por un patógeno)
INSERT INTO diseases (id, name, symptoms, riskSeason, pathogenId) VALUES
  (1, 'Roya del café', 'Manchas amarillas en el envés de la hoja que se convierten en polvo naranja; la hoja cae antes de tiempo', 'todo_el_ano', 1),
  (2, 'Broca del café', 'Perforaciones pequeñas en la corona del fruto; granos dañados y pérdida de peso en la cosecha', 'todo_el_ano', 2),
  (3, 'Gota de la papa', 'Manchas oscuras de aspecto húmedo en hojas y tallos con moho blanco en el envés; los tubérculos se pudren', 'invierno', 3),
  (4, 'Moko del plátano', 'Amarillamiento y marchitez de hojas jóvenes; pudrición interna de los dedos del racimo', 'invierno', 4),
  (5, 'Marchitez por Fusarium del plátano', 'Hojas viejas amarillas que se doblan desde el pecíolo; el pseudotallo se agrieta y por dentro es rojizo', 'todo_el_ano', 5),
  (6, 'Moho gris de la rosa', 'Pétalos con manchas café y moho gris polvoriento; los botones no abren', 'invierno', 6),
  (7, 'Agallas radiculares', 'Raíces con nódulos o agallas; plantas pequeñas, amarillas y que se marchitan en las horas de calor', 'verano', 7),
  (8, 'Cuchara del tomate', 'Hojas pequeñas, amarillas y enrolladas hacia arriba en forma de cuchara; la planta casi no da fruto', 'verano', 8);

-- Tratamientos (cada uno para una enfermedad)
INSERT INTO treatments (id, name, applicationDescription, treatmentType, diseaseId) VALUES
  (1, 'Fungicida cúprico', 'Aplicar oxicloruro de cobre al follaje cada 30 días durante las lluvias, cubriendo bien el envés de las hojas', 'quimico', 1),
  (2, 'Variedades resistentes', 'Renovar el cafetal con variedades resistentes a la roya, como Castillo o Cenicafé 1', 'cultural', 1),
  (3, 'Re-Re (recolección y repase)', 'Recoger todos los frutos maduros, sobremaduros y secos de la planta y del suelo en cada pase de cosecha', 'cultural', 2),
  (4, 'Hongo Beauveria bassiana', 'Asperjar Beauveria bassiana sobre los frutos en los focos de broca cuando hay más del 2 % de frutos infestados', 'biologico', 2),
  (5, 'Fungicida sistémico', 'Aplicar metalaxil más mancozeb al aparecer los primeros síntomas y repetir cada 7 a 10 días en época de lluvias', 'quimico', 3),
  (6, 'Aporque alto', 'Cubrir con tierra la base de las plantas para proteger los tubérculos de las esporas que caen con la lluvia', 'cultural', 3),
  (7, 'Erradicación de plantas enfermas', 'Inyectar herbicida a las plantas enfermas, dejarlas secar en el sitio y no sembrar en ese punto durante un año', 'cultural', 4),
  (8, 'Desinfección de herramientas', 'Sumergir machetes y palines en hipoclorito al 2 % antes de pasar a la siguiente planta', 'cultural', 4),
  (9, 'Cuarentena del lote', 'Restringir la entrada al lote afectado, desinfectar el calzado y no mover colinos ni tierra a otras fincas', 'cultural', 5),
  (10, 'Trichoderma en el suelo', 'Aplicar Trichoderma harzianum al suelo alrededor de la planta cada 2 meses para competir con el hongo', 'biologico', 5),
  (11, 'Ventilación del invernadero', 'Abrir cortinas en las horas secas y reducir la humedad relativa por debajo del 85 %', 'cultural', 6),
  (12, 'Fungicida para botrytis', 'Aplicar fludioxonil a los botones florales cada 7 días en temporada de lluvias, rotando con otro ingrediente activo', 'quimico', 6),
  (13, 'Rotación de cultivos', 'Rotar con maíz o gramíneas durante al menos una temporada para cortar el ciclo del nematodo', 'cultural', 7),
  (14, 'Hongo Paecilomyces lilacinus', 'Aplicar Paecilomyces lilacinus al suelo en el trasplante y repetir a los 30 días', 'biologico', 7),
  (15, 'Control de mosca blanca', 'Instalar trampas amarillas pegajosas y mallas antiinsectos en las entradas del invernadero', 'cultural', 8),
  (16, 'Insecticida para mosca blanca', 'Aplicar imidacloprid al suelo en el trasplante para controlar el insecto que transmite el virus', 'quimico', 8);

-- Plantas
INSERT INTO plants (id, commonName, scientificName, botanicalFamily, cropType, geneticSequence) VALUES
  (1, 'Café', 'Coffea arabica', 'Rubiaceae', 'otro', 'ACGTTGCAACGTAGCTAGGC'),
  (2, 'Papa', 'Solanum tuberosum', 'Solanaceae', 'hortaliza', 'TTGACCAGTCAGGATCCAAT'),
  (3, 'Tomate', 'Solanum lycopersicum', 'Solanaceae', 'hortaliza', 'GGCATTACGGATCCTAGCTA'),
  (4, 'Plátano', 'Musa paradisiaca', 'Musaceae', 'frutal', 'CATGCATGGCTTAACGGTCA'),
  (5, 'Maíz', 'Zea mays', 'Poaceae', 'cereal', 'ATGGCGTACCGTTAGGCATC'),
  (6, 'Rosa', 'Rosa hybrida', 'Rosaceae', 'ornamental', 'GTACGTTAGCCATGCAATGC');

-- Susceptibilidad de cada planta a cada enfermedad
INSERT INTO susceptibilities (id, plantId, diseaseId, level) VALUES
  (1, 1, 1, 'alta'),
  (2, 1, 2, 'alta'),
  (3, 2, 3, 'alta'),
  (4, 3, 3, 'media'),
  (5, 4, 4, 'alta'),
  (6, 4, 5, 'alta'),
  (7, 6, 6, 'alta'),
  (8, 3, 6, 'baja'),
  (9, 3, 7, 'media'),
  (10, 2, 7, 'baja'),
  (11, 5, 7, 'baja'),
  (12, 3, 8, 'alta');

-- Cultivos: la semilla del 1 y el 6 es idéntica a la referencia (0 mutaciones);
-- la del 8 tiene una longitud distinta, para mostrar el error 422 en la verificación de mutaciones
INSERT INTO crops (id, plantId, lot, region, sowingDate, seedGeneticCode) VALUES
  (1, 1, 'Finca La Esperanza - Lote 3', 'Huila', '2026-02-10', 'ACGTTGCAACGTAGCTAGGC'),
  (2, 1, 'Finca El Mirador - Lote 1', 'Caldas', '2026-03-05', 'ACGCTGCAACGTAGTTAGGC'),
  (3, 2, 'Vereda Tunjuelito - Lote 2', 'Nariño', '2026-04-12', 'TCGACCAGCCAGGATCCGAT'),
  (4, 3, 'Invernadero San José', 'Boyacá', '2026-06-01', 'GGCATTGCGGATCCTAGCTA'),
  (5, 4, 'Hacienda Villa Luz - Lote 7', 'Urabá', '2025-11-20', 'TATGTATGGCTCAACGGTCG'),
  (6, 5, 'Granja El Porvenir', 'Tolima', '2026-07-15', 'ATGGCGTACCGTTAGGCATC'),
  (7, 6, 'Flores de la Sabana - Bloque B', 'Cundinamarca', '2026-05-03', 'GTACGTTAGTCATGCAATGC'),
  (8, 3, 'Invernadero La Pradera', 'Santander', '2026-08-20', 'GGCATTACGGATCCTAGC');

-- Brotes reportados entre noviembre de 2025 y octubre de 2026
INSERT INTO outbreaks (id, plantId, diseaseId, reportDate, region, affectedHectares) VALUES
  (1, 1, 1, '2025-11-08', 'Huila', 14.50),
  (2, 2, 3, '2025-11-25', 'Nariño', 30.00),
  (3, 4, 4, '2025-12-02', 'Urabá', 8.00),
  (4, 1, 1, '2025-12-15', 'Caldas', 9.00),
  (5, 4, 5, '2026-01-12', 'La Guajira', 20.00),
  (6, 1, 1, '2026-01-20', 'Huila', 22.75),
  (7, 3, 8, '2026-01-30', 'Santander', 5.50),
  (8, 1, 2, '2026-02-03', 'Huila', 7.50),
  (9, 3, 7, '2026-02-14', 'Valle del Cauca', 2.00),
  (10, 3, 8, '2026-02-26', 'Santander', 6.00),
  (11, 1, 1, '2026-03-11', 'Antioquia', 6.50),
  (12, 6, 6, '2026-03-28', 'Cundinamarca', 2.50),
  (13, 2, 3, '2026-04-07', 'Boyacá', 16.50),
  (14, 1, 2, '2026-04-18', 'Tolima', 5.00),
  (15, 6, 6, '2026-04-22', 'Cundinamarca', 3.75),
  (16, 4, 4, '2026-04-25', 'Urabá', 12.50),
  (17, 3, 3, '2026-04-30', 'Boyacá', 3.20),
  (18, 1, 1, '2026-05-02', 'Huila', 18.00),
  (19, 2, 3, '2026-05-22', 'Nariño', 41.00),
  (20, 4, 4, '2026-06-10', 'Quindío', 4.75),
  (21, 2, 7, '2026-06-19', 'Nariño', 1.50),
  (22, 4, 5, '2026-07-03', 'Magdalena', 15.00),
  (23, 1, 1, '2026-07-17', 'Antioquia', 8.50),
  (24, 3, 8, '2026-07-21', 'Valle del Cauca', 4.25),
  (25, 1, 2, '2026-08-09', 'Huila', 12.00),
  (26, 3, 8, '2026-08-28', 'Santander', 7.50),
  (27, 5, 7, '2026-09-05', 'Tolima', 3.00),
  (28, 1, 1, '2026-09-14', 'Caldas', 11.25),
  (29, 2, 3, '2026-10-02', 'Nariño', 25.50),
  (30, 6, 6, '2026-10-08', 'Cundinamarca', 1.80);

ALTER TABLE pathogens AUTO_INCREMENT = 9;
ALTER TABLE diseases AUTO_INCREMENT = 9;
ALTER TABLE treatments AUTO_INCREMENT = 17;
ALTER TABLE plants AUTO_INCREMENT = 7;
ALTER TABLE susceptibilities AUTO_INCREMENT = 13;
ALTER TABLE crops AUTO_INCREMENT = 9;
ALTER TABLE outbreaks AUTO_INCREMENT = 31;
