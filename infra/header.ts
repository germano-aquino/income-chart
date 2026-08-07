import Store, { StoreNames } from "./store";

export default class Header {
  private headers: {
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:139.0) Gecko/20100101 Firefox/139.0";
    Accept: "*/*";
    "Content-Type": "application/json";
    "id-conta-logado": string;
    "id-estabelecimento-autenticado": string;
    "X-Requested-With": "XMLHttpRequest";
    Origin: "https://www.trinks.com";
    Cookie: string;
  };

  constructor() {
    const cookie = process.env.COOKIE;

    const idEstabelecimentoPattern = new RegExp(
      "(?<=idEstabelecimentoPadrao)(.+?)=(.+?)(?=;)",
    );

    const match = cookie?.match(idEstabelecimentoPattern);

    if (!match || !cookie) {
      throw Error("Cookie is invalid!");
    }
    const idContaLogado = match[1];
    const idEstabelecimento = match[2];

    this.headers = {
      "User-Agent":
        "Mozilla/5.0 (X11; Linux x86_64; rv:139.0) Gecko/20100101 Firefox/139.0",
      Accept: "*/*",
      "Content-Type": "application/json",
      "id-conta-logado": idContaLogado,
      "id-estabelecimento-autenticado": idEstabelecimento,
      "X-Requested-With": "XMLHttpRequest",
      Origin: "https://www.trinks.com",
      Cookie: cookie,
    };
  }

  get(contentType = "json") {
    if (contentType === "formdata")
      return {
        ...this.headers,
        "Content-Type": "application/x-www-form-urlencoded",
      };
    else return this.headers;
  }

  setCookie(response: Response) {
    const setCookie = response.headers.getSetCookie();
    if (setCookie) {
      setCookie.map((ck) => {
        const keyValue = ck.split(";")[0];
        const [key, value] = keyValue.split("=");
        const pattern = new RegExp(`(?<=${key})=(.+?)(?=;)`);

        this.headers.Cookie = this.headers.Cookie.replace(pattern, `=${value}`);
      });
    }
  }

  setStore(storeName: StoreNames) {
    const idEstabelecimentoPattern = new RegExp(
      "(?<=idEstabelecimentoPadrao)(.+?)=(.+?)(?=;)",
    );
    this.headers.Cookie = this.headers.Cookie.replace(
      idEstabelecimentoPattern,
      `$1=${Store.ID_ESTABELECIMENTO[storeName]}`,
    );

    this.headers["id-estabelecimento-autenticado"] =
      Store.ID_ESTABELECIMENTO[storeName];
  }
}
