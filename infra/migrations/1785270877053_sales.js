exports.up = (pgm) => {
  pgm.createTable("users", {
    id: {
      type: "uuid",
      notNull: true,
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },

    store: {
      type: "varchar(60)",
      notNull: true,
    },

    // For reference GitHub limits username to 39 characters.
    date: {
      type: "timestampz",
      notNull: true,
    },

    //Why 254 characters? https://stackoverflow.com/a/1199238
    service: {
      type: "varchar(254)",
      notNull: true,
    },

    //Why 60 characters? https://www.npmjs.com/package/bcrypt#hash-info
    partner: {
      type: "varchar(60)",
      notNull: true,
    },

    category: {
      type: "varchar(60)",
      notNull: true,
    },

    income_in_cents: {
      type: "bigint",
      notNull: true,
    },

    // Why timestamp with time zone? https://justatheory.com/2012/04/postgres-use-timestamptz/
    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("timezone('utc', now())"),
    },

    updated_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("timezone('utc', now())"),
    },
  });
};

exports.down = false;
