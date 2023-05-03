module.exports = {
  username: {
    type: "string",
    empty: false,
    messages: {
      required: "'Username' wajib di isi!",
    },
  },
  name: {
    type: "string",
    empty: false,
    messages: {
      required: "'name' wajib di isi!",
    },
  },
  email: {
    type: "string",
    empty: false,
    messages: {
      required: "'Email' wajib di isi!",
    },
  },
  password: {
    type: "string",
    empty: false,
    min: 6,
    messages: {
      required: "'Password' wajib di isi!",
      stringMin: "Password minimal {expected} karakter",
    },
  },
  role: {
    type: "enum",
    values: ["admin", "public"],
    empty: true,
    default: "admin",
    messages: {
      enumValue: "Role '{actual}' tidak tersedia pada pilihan '{expected}',",
    },
  },
};
