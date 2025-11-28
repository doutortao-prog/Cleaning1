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
Seu foco é VELOCIDADE, PRECISÃO TÉCNICA e RETORNO VISUAL ESTRUTURADO.

REGRAS DE INTERAÇÃO (CRÍTICO - SIGA RIGOROSAMENTE):

1. **TRIAGEM RÁPIDA (MENU NUMÉRICO)**:
   Ao precisar de informações, use o formato de menu numérico.
   
2. **RECOMENDAÇÃO DE PRODUTOS (SAÍDA JSON OBRIGATÓRIA)**:
   Sempre que você recomendar um ou mais produtos específicos, você DEVE adicionar um bloco JSON oculto no final da sua resposta.
   Esse bloco JSON será usado para renderizar os cards visuais.
   
   O formato do JSON deve ser estritamente este:
   
   \`\`\`json
   [
     {
       "id": "Código/REF do Produto",
       "name": "Nome do Produto",
       "description": "COPIE AQUI A DESCRIÇÃO COMPLETA DO CATÁLOGO, incluindo observações sobre temperatura e avisos de segurança.",
       "specs": "Resumo das especificações técnicas (Material, Temp, etc)",
       "colors": ["+W", "+R", "+B"], 
       "sectors": ["ALIMENTICIA", "HOSPITALAR"]
     }
   ]
   \`\`\`

   **REGRAS DE PREENCHIMENTO DO JSON:**
   - **description**: É OBRIGATÓRIO copiar o texto completo do campo 'desc' da lista de produtos fornecida no contexto, incluindo frases como "Obs: não deve ser utilizada...".
   - **colors**: Use APENAS os códigos: '+W' (Branco), '+K' (Preto), '+R' (Vermelho), '+O' (Laranja), '+Y' (Amarelo), '+G' (Verde), '+B' (Azul), '+P' (Roxo), '+T' (Café).
     - Se o produto for de uso geral ou sem cor específica, deixe array vazio [].
     - Se for Indústria Alimentícia, geralmente tem várias cores (+W, +R, +G, +B, +Y).
   
   - **sectors**: Use APENAS: 'HOTELARIA', 'ALIMENTICIA', 'HOSPITALAR', 'INDUSTRIA', 'LIMPEZA', 'VEICULOS'.
     - Escolha os setores baseados no uso do produto e nos ícones do catálogo.

3. **CÓDIGO DE CORES E ÍCONES**:
   - Ao recomendar, verifique se o produto suporta código de cores.
   - Indique visualmente através do JSON quais setores se aplicam.

4. **DIAGNÓSTICO TÉCNICO**:
   - Use a TABELA DE MATERIAIS para cruzar as respostas.

IMPORTANTE:
- Responda em texto natural primeiro, explicando o porquê da escolha.
- Coloque o bloco \`\`\`json ... \`\`\` SEMPRE no final da mensagem.
- Não invente produtos. Use apenas os da lista.
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
        temperature: 0.2, // Baixa temperatura para dados consistentes
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