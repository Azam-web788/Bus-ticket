-- Insert Buses (6 different types)
INSERT INTO buses (name, type, total_seats, operator, registration_number, amenities) VALUES
('Skyline Express', 'AC Sleeper', 40, 'Skyline Travels', 'SKY-001', ARRAY['wifi','ac','charging','snacks','tv']),
('City Cruiser', 'AC Seater', 50, 'CityBus Co.', 'CTY-001', ARRAY['wifi','ac','charging']),
('Green Line', 'Non-AC', 45, 'Green Transport', 'GRN-001', ARRAY['charging']),
('Royal Star', 'AC Sleeper', 36, 'Royal Travels', 'RYL-001', ARRAY['wifi','ac','charging','snacks','tv']),
('Swift Express', 'AC Semi-Sleeper', 42, 'Swift Buses', 'SWF-001', ARRAY['wifi','ac','charging','tv']),
('Comfort Ride', 'AC Seater', 50, 'Comfort Lines', 'CMF-001', ARRAY['wifi','ac','charging','snacks']);

-- Insert Routes (popular city pairs in Pakistan)
INSERT INTO routes (from_city, to_city, distance, duration, base_price) VALUES
('Lahore', 'Islamabad', '375 km', '4h 30m', 1200.00),
('Lahore', 'Karachi', '1200 km', '14h', 3500.00),
('Islamabad', 'Lahore', '375 km', '4h 30m', 1200.00),
('Karachi', 'Lahore', '1200 km', '14h', 3500.00),
('Lahore', 'Faisalabad', '130 km', '2h', 600.00),
('Islamabad', 'Rawalpindi', '15 km', '30m', 200.00),
('Karachi', 'Hyderabad', '150 km', '2h 30m', 500.00),
('Multan', 'Lahore', '320 km', '4h', 1000.00),
('Faisalabad', 'Islamabad', '280 km', '3h 30m', 900.00),
('Peshawar', 'Islamabad', '180 km', '2h 30m', 700.00);

-- Insert Schedules (using tomorrow and day after)
DO $$
DECLARE
  bus_id_val UUID;
  route_id_val UUID;
  base_price_val NUMERIC;
  total_seats_val INT;
BEGIN
  -- Schedule 1: Skyline Express on Lahore-Islamabad
  SELECT id, total_seats INTO bus_id_val, total_seats_val FROM buses WHERE name = 'Skyline Express';
  SELECT id, base_price INTO route_id_val, base_price_val FROM routes WHERE from_city = 'Lahore' AND to_city = 'Islamabad';
  INSERT INTO schedules (bus_id, route_id, date, departure_time, arrival_time, price, available_seats)
  VALUES (bus_id_val, route_id_val, CURRENT_DATE + 1, '08:00', '12:30', base_price_val, total_seats_val);

  -- Schedule 2: City Cruiser on Lahore-Islamabad
  SELECT id, total_seats INTO bus_id_val, total_seats_val FROM buses WHERE name = 'City Cruiser';
  INSERT INTO schedules (bus_id, route_id, date, departure_time, arrival_time, price, available_seats)
  VALUES (bus_id_val, route_id_val, CURRENT_DATE + 1, '10:00', '14:30', 1000.00, total_seats_val);

  -- Schedule 3: Royal Star on Lahore-Karachi
  SELECT id, total_seats INTO bus_id_val, total_seats_val FROM buses WHERE name = 'Royal Star';
  SELECT id, base_price INTO route_id_val, base_price_val FROM routes WHERE from_city = 'Lahore' AND to_city = 'Karachi';
  INSERT INTO schedules (bus_id, route_id, date, departure_time, arrival_time, price, available_seats)
  VALUES (bus_id_val, route_id_val, CURRENT_DATE + 1, '06:00', '20:00', base_price_val, total_seats_val);

  -- Schedule 4: Green Line on Islamabad-Lahore
  SELECT id, total_seats INTO bus_id_val, total_seats_val FROM buses WHERE name = 'Green Line';
  SELECT id, base_price INTO route_id_val, base_price_val FROM routes WHERE from_city = 'Islamabad' AND to_city = 'Lahore';
  INSERT INTO schedules (bus_id, route_id, date, departure_time, arrival_time, price, available_seats)
  VALUES (bus_id_val, route_id_val, CURRENT_DATE + 1, '07:00', '11:30', 800.00, total_seats_val);

  -- Schedule 5: Swift Express on Karachi-Lahore
  SELECT id, total_seats INTO bus_id_val, total_seats_val FROM buses WHERE name = 'Swift Express';
  SELECT id, base_price INTO route_id_val, base_price_val FROM routes WHERE from_city = 'Karachi' AND to_city = 'Lahore';
  INSERT INTO schedules (bus_id, route_id, date, departure_time, arrival_time, price, available_seats)
  VALUES (bus_id_val, route_id_val, CURRENT_DATE + 1, '05:00', '19:00', base_price_val, total_seats_val);

  -- Schedule 6: Comfort Ride on Lahore-Faisalabad
  SELECT id, total_seats INTO bus_id_val, total_seats_val FROM buses WHERE name = 'Comfort Ride';
  SELECT id, base_price INTO route_id_val, base_price_val FROM routes WHERE from_city = 'Lahore' AND to_city = 'Faisalabad';
  INSERT INTO schedules (bus_id, route_id, date, departure_time, arrival_time, price, available_seats)
  VALUES (bus_id_val, route_id_val, CURRENT_DATE + 1, '09:00', '11:00', base_price_val, total_seats_val);

  -- Schedule 7: Skyline Express on Multan-Lahore
  SELECT id, total_seats INTO bus_id_val, total_seats_val FROM buses WHERE name = 'Skyline Express';
  SELECT id, base_price INTO route_id_val, base_price_val FROM routes WHERE from_city = 'Multan' AND to_city = 'Lahore';
  INSERT INTO schedules (bus_id, route_id, date, departure_time, arrival_time, price, available_seats)
  VALUES (bus_id_val, route_id_val, CURRENT_DATE + 2, '06:00', '10:00', base_price_val, total_seats_val);

  -- Schedule 8: City Cruiser on Faisalabad-Islamabad
  SELECT id, total_seats INTO bus_id_val, total_seats_val FROM buses WHERE name = 'City Cruiser';
  SELECT id, base_price INTO route_id_val, base_price_val FROM routes WHERE from_city = 'Faisalabad' AND to_city = 'Islamabad';
  INSERT INTO schedules (bus_id, route_id, date, departure_time, arrival_time, price, available_seats)
  VALUES (bus_id_val, route_id_val, CURRENT_DATE + 2, '08:00', '11:30', base_price_val, total_seats_val);

  -- Schedule 9: Royal Star on Peshawar-Islamabad
  SELECT id, total_seats INTO bus_id_val, total_seats_val FROM buses WHERE name = 'Royal Star';
  SELECT id, base_price INTO route_id_val, base_price_val FROM routes WHERE from_city = 'Peshawar' AND to_city = 'Islamabad';
  INSERT INTO schedules (bus_id, route_id, date, departure_time, arrival_time, price, available_seats)
  VALUES (bus_id_val, route_id_val, CURRENT_DATE + 2, '10:00', '12:30', base_price_val, total_seats_val);

  -- Schedule 10: Green Line on Karachi-Hyderabad
  SELECT id, total_seats INTO bus_id_val, total_seats_val FROM buses WHERE name = 'Green Line';
  SELECT id, base_price INTO route_id_val, base_price_val FROM routes WHERE from_city = 'Karachi' AND to_city = 'Hyderabad';
  INSERT INTO schedules (bus_id, route_id, date, departure_time, arrival_time, price, available_seats)
  VALUES (bus_id_val, route_id_val, CURRENT_DATE + 2, '14:00', '16:30', base_price_val, total_seats_val);

  -- Schedule 11: Swift Express on Lahore-Islamabad (night)
  SELECT id, total_seats INTO bus_id_val, total_seats_val FROM buses WHERE name = 'Swift Express';
  SELECT id, base_price INTO route_id_val, base_price_val FROM routes WHERE from_city = 'Lahore' AND to_city = 'Islamabad';
  INSERT INTO schedules (bus_id, route_id, date, departure_time, arrival_time, price, available_seats)
  VALUES (bus_id_val, route_id_val, CURRENT_DATE + 1, '22:00', '02:30', 1500.00, total_seats_val);

  -- Schedule 12: Comfort Ride on Lahore-Islamabad
  SELECT id, total_seats INTO bus_id_val, total_seats_val FROM buses WHERE name = 'Comfort Ride';
  INSERT INTO schedules (bus_id, route_id, date, departure_time, arrival_time, price, available_seats)
  VALUES (bus_id_val, route_id_val, CURRENT_DATE + 1, '14:00', '18:30', 1100.00, total_seats_val);
END $$;
