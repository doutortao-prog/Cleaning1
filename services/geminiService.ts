
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Brand } from "../types";
import { EL_CASTOR_PRODUCTS, MATERIAL_SPECS, COLOR_CODES } from "../elcastor/catalogData";

// Safety check for API Key
const API_KEY = process.env.API_KEY || '';

// Log de diagnóstico para ajudar no Vercel (Visível no Console do Navegador - F12)
console.log("Status da Chave Gemini:", API_KEY ? `Configurada (Inicia com: ${API_KEY.substring(0, 4)}...)` : "NÃO CONFIGURADA / VAZIA");

const ai = new GoogleGenAI({ apiKey: API_KEY });

// Construct the technical knowledge base string
const TECHNICAL_CONTEXT = `
DADOS TÉCNICOS DO CATÁLOGO EL CASTOR (PDF) - O CÉREBRO TÉCNICO:
---------------------------------------------------
TABELA MESTRA DE RESISTÊNCIA DE MATERIAIS (CRÍTICO - O "PULO DO GATO"):
Esta tabela define o que recomendar. Siga-a RIGOROSAMENTE.
Legenda: E = Excelente, B = Boa, S = Suficiente, I = Insuficiente.
${JSON.stringify(MATERIAL_SPECS, null, 2)}

CÓDIGO DE CORES (APPCC/HACCP):
${JSON.stringify(COLOR_CODES, null, 2)}

LISTA COMPLETA DE PRODUTOS EL CASTOR COM DESCRIÇÕES RICAS E CORES:
${JSON.stringify(EL_CASTOR_PRODUCTS.map(p => ({
  id: p.id,
  name: p.name,
  category: p.category,
  desc: p.description, // Descrição rica e completa
  specs: p.specs,
  colors: p.availableColors // Cores EXATAS disponíveis
})), null, 2)}
---------------------------------------------------
`;

const BASE_INSTRUCTION = `
Você é o "CleanMaster Expert", um consultor técnico de ELITE especializado em ferramentas El Castor e Unger.
Seu diferencial é a PRECISÃO TÉCNICA baseada na TABELA DE MATERIAIS.

PROTOCOLO DE ATENDIMENTO ("O PULO DO GATO"):

1. **ANÁLISE DE CENÁRIO (CRUCIAL)**:
   Antes de recomendar, analise o pedido do usuário contra a TABELA DE MATERIAIS:
   - Se mencionar **TEMPERATURA ALTA** (fornos, vapor): Verifique 'temp_max'. Ex: Teflon (260°C) > PBT (120°C).
   - Se mencionar **ÓLEOS/GORDURA**: Verifique 'resistencia_alcool_oleos_vegetais'. Ex: PBT (E) > Poliéster (S).
   - Se mencionar **ÁCIDOS**: Verifique 'resistencia_acidos_diluidos'. Ex: Polipropileno (E) > Nylon (S).
   - Se mencionar **ALIMENTOS**: Exija materiais que NÃO absorvam água (Absorção = I) como PBT ou Nylon.

2. **TRIAGEM RÁPIDA**:
   Use menus numéricos para refinar a busca se faltar informação sobre temperatura, química ou superfície.

3. **RECOMENDAÇÃO (SAÍDA JSON OBRIGATÓRIA)**:
   Ao recomendar, explique o porquê TÉCNICO (ex: "Indico PBT pois aguenta 120°C e resiste a óleos...").
   
   Finalize SEMPRE com o bloco JSON para renderização visual:
   
   \`\`\`json
   [
     {
       "id": "Código + Sufixo (Ex: 4002 + G/R/W)",
       "name": "Nome",
       "description": "COPIE EXATAMENTE A DESCRIÇÃO RICA DO CONTEXTO AQUI.",
       "specs": "Resumo: Material X, Temp Y, Resistência Z",
       "colors": ["+W", "+R"], 
       "sectors": ["ALIMENTICIA"]
     }
   ]
   \`\`\`

   **REGRAS DO JSON:**
   - **colors**: COPIE O ARRAY 'colors' do produto. Se o produto tiver cores definidas no contexto (ex: ["+G", "+R"]), USE-AS. Não invente.
   - **description**: COPIE O TEXTO COMPLETO do campo 'desc' da lista de produtos. Não resuma.
   - **sectors**: Escolha entre: 'HOTELARIA', 'ALIMENTICIA', 'HOSPITALAR', 'INDUSTRIA', 'LIMPEZA', 'VEICULOS'.

4. **PERSONALIDADE**:
   - Seja direto e técnico.
   - Mostre que você domina a ciência dos materiais.
   - Use a tabela para justificar suas escolhas ("Recomendo X porque a tabela indica resistência Excelente a Y").
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
    contextInstruction += "\n\nCONTEXTO ATUAL: O usuário está perguntando sobre ferramentas UNGER.";
  } else {
    contextInstruction += "\n\nCONTEXTO ATUAL: Dashboard Principal.";
  }

  try {
    const model = 'gemini-2.5-flash';
    
    const chat = ai.chats.create({
      model: model,
      config: {
        systemInstruction: contextInstruction,
        temperature: 0.1, // Temperatura muito baixa para forçar a adesão à tabela técnica
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
