CREATE OR REPLACE FUNCTION sp_soft_delete_user(p_id INTEGER)
RETURNS TABLE(
    success BOOLEAN,
    message TEXT,
    user_name VARCHAR(255)
) AS $$
DECLARE
    current_name VARCHAR(255);
BEGIN
    -- Check if user exists and get current name
    SELECT users.name INTO current_name FROM users WHERE users.id = p_id AND users.is_active = true;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Guest with id % not found', p_id;
    END IF;

    -- Soft delete the user
    UPDATE users SET is_active = false WHERE users.id = p_id;
    
    RETURN QUERY SELECT true, 'Guest ' || current_name || ' has checked out successfully', current_name;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION sp_hard_delete_user(p_id INTEGER)
RETURNS TABLE(
    success BOOLEAN,
    message TEXT
) AS $$
DECLARE
    deleted_name VARCHAR(255);
BEGIN
    -- Get the user name before deletion
    SELECT users.name INTO deleted_name FROM users WHERE users.id = p_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Guest with ID % not found', p_id;
    END IF;
    
    -- Delete the user
    DELETE FROM users WHERE users.id = p_id;
    
    RETURN QUERY SELECT true, 'Guest ' || deleted_name || ' has been permanently deleted';
END;
$$ LANGUAGE plpgsql;