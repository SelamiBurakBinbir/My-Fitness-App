/************************************************************
 * dbSetup.js
 ************************************************************/
const { Pool, Client } = require("pg");

// Veritabanının varlığını kontrol edip oluşturacak fonksiyon
async function ensureDatabaseExists() {
  // Veritabanı oluşturma işlemi için bağlantı, fitnessdb veritabanı kullanılmadan
  const client = new Client({
    user: process.env.PGUSER || "postgres",
    host: process.env.PGHOST || "localhost",
    password: process.env.PGPASSWORD || "1001",
    port: process.env.PGPORT || 5432,
  });

  try {
    await client.connect();
    const res = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = 'fitnessdb'"
    );
    if (res.rowCount === 0) {
      await client.query("CREATE DATABASE fitnessdb");
      console.log("Veritabanı 'fitnessdb' oluşturuldu.");
    } else {
      console.log("Veritabanı 'fitnessdb' zaten mevcut.");
    }
  } catch (error) {
    console.error("Veritabanı oluşturulurken hata meydana geldi:", error);
  } finally {
    await client.end();
  }
}

const pool = new Pool({
  user: process.env.PGUSER || "postgres",
  host: process.env.PGHOST || "localhost",
  database: process.env.PGDATABASE || "fitnessdb",
  password: process.env.PGPASSWORD || "1001",
  port: process.env.PGPORT || 5432,
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function createTables() {
  try {
    /********************************************************
     * USERS
     ********************************************************/
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        user_id         SERIAL       PRIMARY KEY,
        name            VARCHAR(100) NOT NULL,
        email           VARCHAR(100) UNIQUE NOT NULL,
        password        VARCHAR(200) NOT NULL,
        age             INT          NULL,
        height          DECIMAL(5,2) NULL,
        weight          DECIMAL(5,2) NULL,
        created_at      TIMESTAMP    DEFAULT NOW(),
        updated_at      TIMESTAMP    DEFAULT NOW()
      );
    `);

    /********************************************************
     * GOALS
     ********************************************************/
    await pool.query(`
      CREATE TABLE IF NOT EXISTS goals (
        goal_id         SERIAL       PRIMARY KEY,
        user_id         INT          NOT NULL,
        goal_type       VARCHAR(50)  NOT NULL,
        target_value    DECIMAL(7,2) NULL,
        current_value   DECIMAL(7,2) NULL,
        start_date      DATE         DEFAULT CURRENT_DATE,
        end_date        DATE         NULL,
        CONSTRAINT fk_goals_user
          FOREIGN KEY (user_id) REFERENCES users(user_id)
          ON DELETE CASCADE
      );
    `);

    /********************************************************
     * ACHIEVEMENTS
     ********************************************************/
    await pool.query(`
      CREATE TABLE IF NOT EXISTS achievements (
        achievement_id  SERIAL       PRIMARY KEY,
        user_id         INT          NOT NULL,
        achievement_type VARCHAR(100) NOT NULL,
        achievement_date TIMESTAMP    DEFAULT NOW(),
        description     VARCHAR(255)  NULL,
        CONSTRAINT fk_achievements_user
          FOREIGN KEY (user_id) REFERENCES users(user_id)
          ON DELETE CASCADE
      );
    `);

    /********************************************************
     * HABITS
     ********************************************************/
    await pool.query(`
      CREATE TABLE IF NOT EXISTS habits (
        habit_id    SERIAL       PRIMARY KEY,
        user_id     INT          NOT NULL,
        habit_name  VARCHAR(100) NOT NULL,
        created_at  TIMESTAMP    DEFAULT NOW(),
        CONSTRAINT fk_habits_user
          FOREIGN KEY (user_id) REFERENCES users(user_id)
          ON DELETE CASCADE
      );
    `);

    /********************************************************
     * HABIT_TRACKING
     ********************************************************/
    await pool.query(`
      CREATE TABLE IF NOT EXISTS habit_tracking (
        tracking_id  SERIAL       PRIMARY KEY,
        habit_id     INT          NOT NULL,
        track_date   DATE         DEFAULT CURRENT_DATE,
        status       BOOLEAN      DEFAULT false,
        CONSTRAINT fk_habit_tracking
          FOREIGN KEY (habit_id) REFERENCES habits(habit_id)
          ON DELETE CASCADE
      );
    `);

    /********************************************************
     * EXERCISES
     *    Tabloyu önce silip yeniden oluşturuyoruz
     *    user_id ekliyoruz ki her egzersiz bir kullanıcıya ait olsun
     ********************************************************/
    await pool.query(`
      DROP TABLE IF EXISTS exercises CASCADE;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS exercises (
        exercise_id    SERIAL       PRIMARY KEY,
        user_id        INT          NOT NULL,
        exercise_name  VARCHAR(100) NOT NULL,
        exercise_desc  TEXT         NULL,
        muscle_group   VARCHAR(100) NULL,
        image_url      VARCHAR(255) NULL,
        CONSTRAINT fk_exercises_user
          FOREIGN KEY (user_id) REFERENCES users(user_id)
          ON DELETE CASCADE
      );
    `);

    /********************************************************
     * WORKOUTS
     ********************************************************/
    await pool.query(`
      CREATE TABLE IF NOT EXISTS workouts (
        workout_id   SERIAL       PRIMARY KEY,
        user_id      INT          NOT NULL,
        workout_name VARCHAR(100) NOT NULL,
        created_at   TIMESTAMP    DEFAULT NOW(),
        updated_at   TIMESTAMP    DEFAULT NOW(),
        CONSTRAINT fk_workouts_user
          FOREIGN KEY (user_id) REFERENCES users(user_id)
          ON DELETE CASCADE
      );
    `);

    /********************************************************
     * WORKOUT_EXERCISES
     ********************************************************/
    await pool.query(`
      CREATE TABLE IF NOT EXISTS workout_exercises (
        we_id        SERIAL PRIMARY KEY,
        workout_id   INT    NOT NULL,
        exercise_id  INT    NOT NULL,
        sets         INT    NOT NULL DEFAULT 3,
        reps         INT    NOT NULL DEFAULT 10,
        rest_time    INT    NOT NULL DEFAULT 60,
        CONSTRAINT fk_workout_exercises_workout
          FOREIGN KEY (workout_id) REFERENCES workouts(workout_id)
          ON DELETE CASCADE,
        CONSTRAINT fk_workout_exercises_exercise
          FOREIGN KEY (exercise_id) REFERENCES exercises(exercise_id)
          ON DELETE CASCADE
      );
    `);

    /********************************************************
     * MEAL_PLANS
     ********************************************************/
    await pool.query(`
      CREATE TABLE IF NOT EXISTS meal_plans (
        meal_plan_id  SERIAL       PRIMARY KEY,
        user_id       INT          NOT NULL,
        title         VARCHAR(100) NOT NULL,
        created_at    TIMESTAMP    DEFAULT NOW(),
        updated_at    TIMESTAMP    DEFAULT NOW(),
        CONSTRAINT fk_meal_plans_user
          FOREIGN KEY (user_id) REFERENCES users(user_id)
          ON DELETE CASCADE
      );
    `);

    /********************************************************
     * MEAL_ENTRIES
     ********************************************************/
    await pool.query(`
      CREATE TABLE IF NOT EXISTS meal_entries (
        meal_entry_id  SERIAL       PRIMARY KEY,
        meal_plan_id   INT          NOT NULL,
        meal_type      VARCHAR(50)  NOT NULL,
        meal_desc      TEXT         NULL,
        CONSTRAINT fk_meal_entries
          FOREIGN KEY (meal_plan_id) REFERENCES meal_plans(meal_plan_id)
          ON DELETE CASCADE
      );
    `);

    /********************************************************
     * CALENDAR
     ********************************************************/
    await pool.query(`
      DROP TABLE IF EXISTS calendar CASCADE;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS calendar (
        calendar_id   SERIAL PRIMARY KEY,
        user_id       INT    NOT NULL,
        calendar_date DATE   NOT NULL,
        note          TEXT,
        workout_id    INT    NULL,
        meal_plan_id  INT    NULL,
        CONSTRAINT fk_calendar_user
          FOREIGN KEY (user_id) REFERENCES users(user_id)
          ON DELETE CASCADE,
        CONSTRAINT fk_calendar_workout
          FOREIGN KEY (workout_id) REFERENCES workouts(workout_id)
          ON DELETE SET NULL,
        CONSTRAINT fk_calendar_meal_plan
          FOREIGN KEY (meal_plan_id) REFERENCES meal_plans(meal_plan_id)
          ON DELETE SET NULL
      );
    `);

    /********************************************************
     * PROGRESS
     ********************************************************/
    await pool.query(`
      CREATE TABLE IF NOT EXISTS progress (
        progress_id        SERIAL       PRIMARY KEY,
        user_id            INT          NOT NULL,
        measurement_type   VARCHAR(50)  NOT NULL,
        measurement_value  DECIMAL(7,2) NOT NULL,
        measurement_date   DATE         DEFAULT CURRENT_DATE,
        CONSTRAINT fk_progress_user
          FOREIGN KEY (user_id) REFERENCES users(user_id)
          ON DELETE CASCADE
      );
    `);

    console.log("Tüm tablolar başarıyla oluşturuldu.");
  } catch (error) {
    console.error("Tablolar oluşturulurken hata meydana geldi:", error);
  } finally {
    pool.end();
  }
}

ensureDatabaseExists().then(() => {
  createTables();
});
