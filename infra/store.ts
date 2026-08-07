export type StoreNames = "14" | "batista" | "duque" | "umarizal";
export default class Store {
  static readonly NAMES = [
    "14",
    "batista",
    "duque",
    "umarizal",
  ] as StoreNames[];

  static readonly ID_ESTABELECIMENTO = {
    14: "18769",
    batista: "35295",
    duque: "120037",
    umarizal: "19357",
  } as Record<StoreNames, string>;

  static readonly ID_RELACAO_PARCEIRA = {
    14: "46810",
    batista: "103890",
    duque: "440885",
    umarizal: "49102",
  } as Record<StoreNames, string>;

  static readonly ID_RELACAO_RECEPCIONISTA = {
    14: "46809",
    batista: "103889",
    duque: "440884",
    umarizal: "49101",
  } as Record<StoreNames, string>;

  static readonly FULL_NAME = {
    14: "14 de Abril",
    batista: "Batista Campos",
    duque: "Duque",
    umarizal: "Umarizal",
  } as Record<StoreNames, string>;

  constructor() {}
}
