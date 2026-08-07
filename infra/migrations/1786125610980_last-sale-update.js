const { unique } = require("next/dist/build/utils");

exports.up = (pgm) => {
  pgm.createTable("last_update_sale", {
    store: {
      type: "varchar(60)",
      unique: true,
      notNull: true,
    },

    date: {
      type: "timestamptz",
      notNull: true,
    },

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
