DO $$
DECLARE
  target_user_id UUID := '7873403e-fce1-4d88-9db1-3b525688b242';
BEGIN
  -- 1. Update "Leader" badges to lowercase "leader"
  -- We handle potential conflicts by deleting duplicates first
  
  -- Delete any "Kanto-Leader" if "kanto-leader" already exists
  DELETE FROM user_badges
  WHERE user_id = target_user_id
    AND badge LIKE '%-Leader'
    AND lower(badge) IN (
      SELECT badge FROM user_badges WHERE user_id = target_user_id
    );

  -- Update remaining "Kanto-Leader" to "kanto-leader"
  UPDATE user_badges
  SET badge = lower(badge)
  WHERE user_id = target_user_id
    AND badge LIKE '%-Leader';

  -- 2. Just in case, ensure all arena badges are lowercase (though they should be)
  UPDATE user_badges
  SET badge = lower(badge)
  WHERE user_id = target_user_id
    AND badge != lower(badge);

END $$;
