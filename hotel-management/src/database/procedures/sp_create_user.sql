CREATE OR REPLACE FUNCTION sp_create_user(
    p_name VARCHAR(255),
    p_email VARCHAR(255),
    p_phone VARCHAR(20) DEFAULT NULL,
    p_check_in_date TIMESTAMP DEFAULT NULL,
    p_check_out_date TIMESTAMP DEFAULT NULL,
    p_room_number INTEGER DEFAULT NULL
)
RETURNS TABLE(
    id INTEGER,
    name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(255),
    check_in_date TIMESTAMP,
    check_out_date TIMESTAMP,
    room_number INTEGER,
    is_active BOOLEAN,
    created_at TIMESTAMP, 
    updated_at TIMESTAMP
) AS $$
BEGIN 
    IF EXISTS (SELECT 1 FROM users WHERE users.email = p_email) THEN
        RAISE EXCEPTION ' Guest with email % already exists', p_email;
    END IF;

    RETURN QUERY
    INSERT INTO users (name, email, phone, check_in_date, check_out_date, room_number)
    VALUES(p_name, p_email, p_phone, p_check_in_date, p_check_out_date, p_room_number)
    RETURNING users.id, users.name, users.email, users.phone, users.check_in_date, users.check_out_date,
                users.room_number, users.is_active, users.created_at, users.updated_at;
    END;
    $$ language plpgsql;
