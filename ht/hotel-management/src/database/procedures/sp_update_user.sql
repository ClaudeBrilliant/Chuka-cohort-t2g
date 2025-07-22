CREATE OR REPLACE FUNCTION sp_update_user(
    p_id INTEGER,
    p_name VARCHAR(255) DEFAULT NULL,
    p_email VARCHAR(255) DEFAULT NULL,
    p_phone VARCHAR(20) DEFAULT NULL,
    p_check_in_date TIMESTAMP DEFAULT NULL,
    p_check_out_date TIMESTAMP DEFAULT NULL,
    p_room_number INTEGER DEFAULT NULL,
    p_is_active BOOLEAN DEFAULT NULL
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
DECLARE
current_email VARCHAR(255);
BEGIN
    SELECT users.email INTO current_email FROM users WHERE users.id = p_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION ' Guest with id % not found',p_id;
    END IF;

    IF p_email IS NOT NULL AND p_email != current_email THEN
        IF EXISTS (SELECT 1 FROM users WHERE users.email = p.email AND users.id !=p.id) THEN
            RAISE EXCEPTION 'Another guest with this email exists';
        END IF;
    END IF;

    RETURN QUERY
    UPDATE users SET
        name = COALESCE(p_name, users.name),
        email = COALESCE(p_email, users.email),
        phone = COALESCE(p_phone, users.phone),
        check_in_date = COALESCE(p_check_in_date, users.check_in_date),
        check_out_date = COALESCE(p_check_out_date, users.checkout_date),
        room_number= COALESCE(p_room_number, users.room_number),
        is_active = COALESCE(p_is_active, users.is_active)
    WHERE users.is = p_id
    RETURNING users.id, users.name, users.email, users.phone, users.check_in_date, users.check_out_date,
                users.room_number, users.is_active, users.created_at, users.updated_at;
END;
$$ LANGUAGE plpgsql;