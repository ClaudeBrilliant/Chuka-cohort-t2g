-- Create users table
CREATE TABLE IF NOT EXISTS users (
id SERIAL PRIMARY KEY,
name VARCHAR(255) NOT NULL,
email VARCHAR(255) UNIQUE NOT NULL,
phone VARCHAR(20),
check_in_date TIMESTAMP,
check_out_date TIMESTAMP,
room_number INTEGER,
is_active BOOLEAN DEFAULT true,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CREATE indexes 

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_isActive ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_users_room_number ON users(room_number);
CREATE INDEX IF NOT EXISTS idx_users_check_dates ON users(check_in_date, check_out_date);

-- TRIGGER FUNCTIONS
-- trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- trigger function to autonomously update updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- trigger function to validate check-in and checkout dates
CREATE OR REPLACE FUNCTION validate_check_dates()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.check_in_date IS NOT NULL AND NEW.check_out_date IS NOT NULL THEN
        IF NEW.check_in_date >= NEW.check_out_date THEN
            RAISE EXCEPTION 'Checkout date must be after checkin date';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

--trigger function to validate dates on create and update
CREATE TRIGGER validate_user_check_dates
    BEFORE INSERT OR UPDATE ON users
    FOR EACH ROW 
    EXECUTE FUNCTION validate_check_dates();

-- SEED user data
INSERT INTO users (name, email, phone, check_in_date, check_out_date, room_number) VALUES
('John Doe','john.doe@gmail.com','+2356666666879','2025-06-08','2025-06-12',101),
('Jane Doe','jane.doe@gmail.com','+23525666879','2025-06-08','2025-06-12',102)
ON CONFLICT (email) DO NOTHING;