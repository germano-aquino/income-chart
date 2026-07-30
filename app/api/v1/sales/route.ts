import { NextResponse } from "next/server";

export async function POST() {
  try {
    

    return NextResponse.json(
      { message: "Script de aniversariantes foi executado com sucesso." },
      { status: 200 },
    );
  } catch (error) {
    console.error("Falha ao gerar lista de aniversariantes do mês.");
    console.error(error);
    return NextResponse.json(
      { error: "Falha ao executar o script." },
      { status: 400 },
    );
  }
}
