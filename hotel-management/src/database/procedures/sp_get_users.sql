CREATE OR REPLACE FUNCTION sp_get_all_users()
RETURNS SETOF users AS $$
BEGIN
    RETURN QUERY SELECT * FROM users ORDER BY id;
END;
$$LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION sp_get_active_users()
RETURNS SETOF users as $$
BEGIN
    RETURN  QUERY SELECT * FROM users WHERE  is_active = true ORDER BY id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION sp_get_user_by_id(p_id INTEGER)
RETURNS SETOF users AS $$
BEGIN
    RETURN QUERY SELECT * FROM users WHERE id = p_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION ' Guest with id % not found', p_id;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION sp_get_user_by_email(p_email VARCHAR(255))
RETURNS SETOF users AS $$
BEGIN
    RETURN QUERY SELECT * FROM users WHERE email = p_email;

    IF NOT FOUND THEN
        RAISE EXCEPTION ' Guest with email % not found', p_email;
    END IF;
END;
$$ LANGUAGE plpgsql;