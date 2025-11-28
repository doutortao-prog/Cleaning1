import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Brand } from "../types";
import { EL_CASTOR_PRODUCTS, MATERIAL_SPECS, COLOR_CODES } from "../elcastor/catalogData";

// Safety check for API Key
const API_KEY = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey: API_KEY });

// Construct the technical knowledge base string
const TECHNICAL_CONTEXT = `
DADOS TÉCNICOS DO CATÁLOGO EL CASTOR (PDF):
---------------------------------------------------
TABELA DE RESISTÊNCIA DE MATERIAIS (FIBRAS):
${JSON.stringify(MATERIAL_SPECS, null, 2)}

CÓDIGO DE CORES (APPCC/HACCP):
${JSON.stringify(COLOR_CODES, null, 2)}

LISTA COMPLETA DE PRODUTOS EL CASTOR:
${JSON.stringify(EL_CASTOR_PRODUCTS.map(p => ({
  id: p.id,
  name: p.name,
  category: p.category,
  desc: p.description,
  specs: p.specs
})), null, 2)}
---------------------------------------------------
`;

const BASE_INSTRUCTION = `
Você é o "CleanMaster Expert", um consultor técnico ágil especializado em ferramentas El Castor e Unger.
Seu foco é VELOCIDADE e PRECISÃO TÉCNICA. O usuário está no Brasil.

REGRAS DE INTERAÇÃO (CRÍTICO - SIGA RIGOROSAMENTE):

1. **TRIAGEM RÁPIDA (MENU NUMÉRICO)**:
   Ao precisar de informações, NÃO escreva parágrafos longos.
   Apresente as opções numeradas e peça para o usuário responder apenas com os números separados por vírgula.
   
   Exemplo de formato OBRIGATÓRIO de pergunta:
   """
   Para recomendar a ferramenta certa, responda com os números (ex: 1, 3, 2):
   
   1. TEMPERATURA?
      [1] Ambiente (<40°C)
      [2] Alta (até 80°C - Cozinhas)
      [3] Extrema (>80°C - Fornos/Vapor)
   
   2. QUÍMICA?
      [1] Neutro/Detergente
      [2] Ácido/Clorado
      [3] Solvente/Óleo
   
   3. SUPERFÍCIE?
      [1] Inox/Delicada
      [2] Piso Liso
      [3] Rústico/Concreto
   """

2. **CÓDIGO DE CORES (FLEXÍVEL)**:
   - NÃO assuma que todo restaurante segue o APPCC rigorosamente.
   - Se o usuário não mencionar cores, pergunte no final: "Você utiliza o sistema de cores (ex: Vermelho para risco)? Se não, posso indicar qualquer cor."
   - Se o usuário disser que não usa, ignore as restrições de cor da tabela.

3. **DIAGNÓSTICO TÉCNICO**:
   - Use a TABELA DE MATERIAIS para cruzar as respostas numéricas.
   - Exemplo: Se o usuário responder "3" para temperatura (>80°C), elimine Polipropileno e Poliéster. Indique PBT ou Nylon.
   - Exemplo: Se responder "2" para Química (Ácidos), não indique Nylon.

4. **RESPOSTA**:
   - Seja direto. "Recomendo a Escova [NOME] (Ref: [ID])".
   - Explique brevemente: "Ideal pois suporta X°C e ácidos."

IMPORTANTE:
- Mantenha o tom profissional mas muito conciso.
- Se o produto não existir no JSON, diga que não consta no catálogo.
`;

export const sendMessageToGemini = async (
  message: string, 
  currentBrand: Brand,
  history: { role: string; parts: { text: string }[] }[]
): Promise<string> => {
  if (!API_KEY) {
    return "Erro: API Key não configurada. Por favor configure a chave Gemini.";
  }

  let contextInstruction = BASE_INSTRUCTION + "\n\n" + TECHNICAL_CONTEXT;

  if (currentBrand === Brand.UNGER) {
    contextInstruction += "\n\nCONTEXTO ATUAL: O usuário está na aba UNGER. Foque em vidros e limpeza em altura.";
  } else if (currentBrand === Brand.EL_CASTOR) {
    contextInstruction += "\n\nCONTEXTO ATUAL: O usuário está na aba EL CASTOR.";
  } else {
    contextInstruction += "\n\nCONTEXTO ATUAL: Dashboard Principal.";
  }

  try {
    const model = 'gemini-2.5-flash';
    
    const chat = ai.chats.create({
      model: model,
      config: {
        systemInstruction: contextInstruction,
        temperature: 0.1, // Temperatura muito baixa para forçar obediência estrita ao formato numérico
      },
      history: history
    });

    const result: GenerateContentResponse = await chat.sendMessage({
      message: message
    });

    return result.text || "Desculpe, não consegui processar sua resposta no momento.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Ocorreu um erro técnico ao conectar com o assistente inteligente. Verifique sua conexão.";
  }
};