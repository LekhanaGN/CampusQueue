CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id)
        ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'student'
        CHECK (role IN ('student', 'staff', 'admin')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    avg_service_time INT NOT NULL DEFAULT 5
        CHECK (avg_service_time > 0),
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE staff_services (
    staff_id UUID REFERENCES profiles(id),
    service_id INT REFERENCES services(id),
    PRIMARY KEY (staff_id, service_id)
);

CREATE TABLE time_slots (
    id SERIAL PRIMARY KEY,
    service_id INT NOT NULL REFERENCES services(id),
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    capacity INT NOT NULL DEFAULT 1
        CHECK (capacity > 0),
    CHECK (end_time > start_time),
    UNIQUE (service_id, start_time)
);

CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES profiles(id),
    slot_id INT NOT NULL REFERENCES time_slots(id),
    status TEXT NOT NULL DEFAULT 'booked'
        CHECK (status IN (
            'booked', 'completed', 'cancelled'
        )),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE queue (
    id SERIAL PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES profiles(id),
    service_id INT NOT NULL REFERENCES services(id),
    token_number INT NOT NULL,
    queue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status TEXT NOT NULL DEFAULT 'waiting'
        CHECK (status IN (
            'waiting', 'serving', 'completed',
            'skipped', 'cancelled'
        )),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    UNIQUE (service_id, queue_date, token_number)
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE queue ENABLE ROW LEVEL SECURITY;

INSERT INTO services
(name, description, avg_service_time)
VALUES
('Administrative Office', 'Certificates and documents', 5),
('Examination Section', 'Exam-related queries', 10),
('Fee Counter', 'Fee-related services', 5),
('Faculty Appointment', 'Meet faculty members', 15);

CREATE POLICY "Read active services"
ON services
FOR SELECT
TO anon, authenticated
USING (is_active = TRUE);

