
import { Brand, Product } from '../types';

// Tabela de Classificação de Fibra por Material (Baseada na Página 1 do PDF)
// Legenda: E=Excelente, B=Boa, S=Suficiente, I=Insuficiente
export const MATERIAL_SPECS = {
  description: "TABELA MESTRA DE RESISTÊNCIA TÉCNICA (O PULO DO GATO). Use esta tabela para decidir qual fibra recomendar baseada no ambiente do cliente.",
  legend: "E = EXCELENTE | B = BOA | S = SUFICIENTE | I = INSUFICIENTE",
  materials: [
    {
      name: "LECHUGUILLA (Fibra Natural)",
      temp_max: "150°C",
      specs: {
        resistencia_raios_sol: "B",
        resistencia_abrasao: "E",
        absorcao_agua: "B", // Absorbe
        rigidez: "I",
        memoria_elastica: "I",
        resistencia_umidade: "S",
        resistencia_acidos_diluidos: "E",
        resistencia_acidos_concentrados: "B",
        resistencia_alcalis_diluidos: "B",
        resistencia_alcool_oleos_vegetais: "B",
        resistencia_derivados_petroleo: "B"
      }
    },
    {
      name: "PALMYRA (Fibra Natural)",
      temp_max: "150°C",
      specs: {
        resistencia_raios_sol: "E",
        resistencia_abrasao: "E",
        absorcao_agua: "B", // Absorbe
        rigidez: "B",
        memoria_elastica: "I",
        resistencia_umidade: "S",
        resistencia_acidos_diluidos: "E",
        resistencia_acidos_concentrados: "E",
        resistencia_alcalis_diluidos: "E",
        resistencia_alcool_oleos_vegetais: "E",
        resistencia_derivados_petroleo: "S"
      }
    },
    {
      name: "NYLON",
      temp_max: "100°C",
      specs: {
        resistencia_raios_sol: "B",
        resistencia_abrasao: "B",
        absorcao_agua: "I", // Não absorbe (I de absorção = Bom para higiene)
        rigidez: "E",
        memoria_elastica: "E",
        resistencia_umidade: "E",
        resistencia_acidos_diluidos: "S",
        resistencia_acidos_concentrados: "S",
        resistencia_alcalis_diluidos: "E",
        resistencia_alcool_oleos_vegetais: "E",
        resistencia_derivados_petroleo: "E"
      }
    },
    {
      name: "PBT (Polibutileno Tereftalato)",
      temp_max: "120°C",
      specs: {
        resistencia_raios_sol: "E",
        resistencia_abrasao: "E",
        absorcao_agua: "I", // Não absorbe
        rigidez: "E",
        memoria_elastica: "E",
        resistencia_umidade: "E",
        resistencia_acidos_diluidos: "B",
        resistencia_acidos_concentrados: "B",
        resistencia_alcalis_diluidos: "E",
        resistencia_alcool_oleos_vegetais: "E",
        resistencia_derivados_petroleo: "E"
      },
      extra_note: "O PBT é o padrão ouro para Indústria Alimentícia (APPCC/FDA) pois não absorve água, aguenta autoclave e químicos agressivos."
    },
    {
      name: "POLIÉSTER (PET - Reciclado)",
      temp_max: "77°C",
      specs: {
        resistencia_raios_sol: "S",
        resistencia_abrasao: "I",
        absorcao_agua: "I",
        rigidez: "I",
        memoria_elastica: "I",
        resistencia_umidade: "B",
        resistencia_acidos_diluidos: "I",
        resistencia_acidos_concentrados: "I",
        resistencia_alcalis_diluidos: "I",
        resistencia_alcool_oleos_vegetais: "S",
        resistencia_derivados_petroleo: "S"
      },
      extra_note: "Opção econômica e ecológica, mas com menor resistência química e térmica."
    },
    {
      name: "POLIPROPILENO",
      temp_max: "80°C",
      specs: {
        resistencia_raios_sol: "B",
        resistencia_abrasao: "B",
        absorcao_agua: "I",
        rigidez: "B",
        memoria_elastica: "I",
        resistencia_umidade: "E",
        resistencia_acidos_diluidos: "E",
        resistencia_acidos_concentrados: "E",
        resistencia_alcalis_diluidos: "E",
        resistencia_alcool_oleos_vegetais: "E",
        resistencia_derivados_petroleo: "S"
      },
      extra_note: "Excelente resistência a ácidos e químicos, mas baixa memória elástica."
    },
    {
      name: "PVC",
      temp_max: "53°C",
      specs: {
        resistencia_raios_sol: "E",
        resistencia_abrasao: "B",
        absorcao_agua: "I",
        rigidez: "B",
        memoria_elastica: "B",
        resistencia_umidade: "E",
        resistencia_acidos_diluidos: "E",
        resistencia_acidos_concentrados: "E",
        resistencia_alcalis_diluidos: "B",
        resistencia_alcool_oleos_vegetais: "E",
        resistencia_derivados_petroleo: "B"
      },
      extra_note: "Muito usado em escovas automotivas (cerdas macias)."
    },
    {
      name: "TEFLÓN",
      temp_max: "260°C",
      specs: {
        resistencia_raios_sol: "E",
        resistencia_abrasao: "B",
        absorcao_agua: "I",
        rigidez: "E",
        memoria_elastica: "E",
        resistencia_umidade: "E",
        resistencia_acidos_diluidos: "E",
        resistencia_acidos_concentrados: "E",
        resistencia_alcalis_diluidos: "E",
        resistencia_alcool_oleos_vegetais: "E",
        resistencia_derivados_petroleo: "E"
      },
      extra_note: "A fibra de maior resistência térmica."
    },
    {
      name: "AÇO INOXIDÁVEL",
      temp_max: "N/A (Altíssima)",
      specs: {
        resistencia_raios_sol: "E",
        resistencia_abrasao: "E",
        absorcao_agua: "I",
        rigidez: "E",
        memoria_elastica: "E",
        resistencia_umidade: "E",
        resistencia_acidos_diluidos: "B",
        resistencia_acidos_concentrados: "B",
        resistencia_alcalis_diluidos: "E",
        resistencia_alcool_oleos_vegetais: "E",
        resistencia_derivados_petroleo: "E"
      }
    },
    {
      name: "AÇO TEMPLADO AL CARBÓN",
      temp_max: "N/A (Altíssima)",
      specs: {
        resistencia_raios_sol: "E",
        resistencia_abrasao: "E",
        absorcao_agua: "I",
        rigidez: "E",
        memoria_elastica: "E",
        resistencia_umidade: "I", // Enferruja
        resistencia_acidos_diluidos: "I",
        resistencia_acidos_concentrados: "I",
        resistencia_alcalis_diluidos: "I",
        resistencia_alcool_oleos_vegetais: "E",
        resistencia_derivados_petroleo: "E"
      }
    }
  ]
};

// Código de Cores APPCC (PDF Página 2)
export const COLOR_CODES = {
  description: "Sistema de codificação por área (APPCC / HACCP) para evitar contaminação cruzada.",
  codes: [
    { code: "+W", color: "Branco", area: "Serviços e Hotelaria / Indústria Alimentícia" },
    { code: "+K", color: "Preto", area: "Indústria em Geral" },
    { code: "+R", color: "Vermelho", area: "Áreas de Alto Risco / Sanitários" },
    { code: "+O", color: "Laranja", area: "Indústria Alimentícia / Áreas de Gordura" },
    { code: "+Y", color: "Amarelo", area: "Hospitais e Clínicas / Áreas de Isolamento" },
    { code: "+G", color: "Verde", area: "Áreas de Preparação de Alimentos / Frutas e Verduras" },
    { code: "+B", color: "Azul", area: "Limpeza Profissional / Áreas Gerais" },
    { code: "+P", color: "Roxo", area: "Áreas Específicas / Alérgenos" },
    { code: "+T", color: "Café", area: "Cuidado de Veículos / Cafeterias" }
  ]
};

// Lista de Produtos Extraída do OCR
export const EL_CASTOR_PRODUCTS: Product[] = [
  // --- NOVOS PRODUTOS (Página 13 e 14) ---
  {
    id: '9201 + Sufixo (Pequena) / 9202 + Sufixo (Média)',
    name: 'Espátula Multiuso de Plástico',
    description: 'Ideal para a remoção de sujidade impregnada em superfícies fixas e planas, sem riscá-las ou arranhá-las. Os materiais com os quais são fabricados atendem a todos os requisitos para estar em contato com alimentos. Alça com furo para armazenamento.',
    category: 'Espátulas',
    imageUrl: '',
    brand: Brand.EL_CASTOR,
    specs: "Material: Polipropileno (PP). Rigidez: Pequena (9201) ou Média (9202).",
    availableColors: ['+G', '+R', '+W', '+Y', '+O', '+B']
  },
  {
    id: '9801 + Sufixo (Pequena) / 9802 + Sufixo (Grande)',
    name: 'Pá Sanitária (Pequena ou Grande)',
    description: 'Ideal para áreas de produção e contato direto com alimentos. Por ser de plástico, não gera faísca e não oxida. Indicada para transportar produtos de recipiente para recipiente ou de recipiente para correias transportadoras.',
    category: 'Pás',
    imageUrl: '',
    brand: Brand.EL_CASTOR,
    specs: "Material: Polipropileno (PP). Tamanhos: Pequena (9801) e Grande (9802).",
    availableColors: ['+G', '+R', '+W', '+Y', '+B']
  },
  {
    id: '5001 + Sufixo',
    name: 'Pincel Sanitário Red. 1 Pol (C. Suave Nylon)',
    description: 'Escova sanitária com cerdas de nylon macias de 4,44cm comprimento e (2,54 cm) de diâmetro. Popular na indústria de panificação e em áreas de processamento de alimentos em geral. Obs: Não deve ser utilizada em trabalho contínuo a mais de 60°C.',
    category: 'Pincéis',
    imageUrl: '',
    brand: Brand.EL_CASTOR,
    specs: "Diâmetro: 2,54cm (1 Pol). Material: Nylon Macio. Temp Máx: 60°C.",
    availableColors: ['+G', '+R', '+W', '+Y', '+O', '+B', '+P']
  },
  {
    id: '5002 + Sufixo (5cm) / 5003 + Sufixo (7cm)',
    name: 'Pincel Sanitário Plano',
    description: 'Linha de pincéis com cerdas de nylon macias de 5,08 cm de comprimento, amplamente utilizados na indústria de panificação e em áreas de processamento de alimentos em geral. Obs: não devem ser utilizados em trabalho contínuo a mais de 60°C.',
    category: 'Pincéis',
    imageUrl: '',
    brand: Brand.EL_CASTOR,
    specs: "Larguras: 5,08cm (5002) e 7,62cm (5003). Material: Nylon Macio. Temp Máx: 60°C.",
    availableColors: ['+G', '+R', '+W', '+Y', '+O', '+B', '+T', '+P']
  },
  {
    id: '3204',
    name: 'Escova Manual de Nylon para Tecidos',
    description: 'Cerda de nylon branca com 4,44 cm de comprimento. Esta escova é ideal para lavar estofados e carpetes com tecidos mais resistentes.',
    category: 'Diversos',
    imageUrl: '',
    brand: Brand.EL_CASTOR,
    specs: "Material: Nylon Branco. Uso: Estofados e Carpetes.",
    availableColors: ['+W']
  },
  {
    id: '4911 + Sufixo',
    name: 'Cordão de Fixação para Escovas de Mãos',
    description: 'Ideal para a fixação das escovas manuais, deixando-as disponíveis nos locais de trabalho.',
    category: 'Acessórios',
    imageUrl: '',
    brand: Brand.EL_CASTOR,
    specs: "Material: Polipropileno/Espiral. Cores: +R, +W, +Y, +G, +B.",
    availableColors: ['+R', '+W', '+Y', '+B']
  },

  // --- PRODUTOS ANTERIORES (Com cores atualizadas) ---
  // Página 3 - Escovas PBT
  {
    id: '4002 + Sufixo (Curto) / 4102 + Sufixo (Longo)',
    name: 'Escova Multiuso (Punho Longo ou Curto)',
    description: 'Escova popular na indústria alimentícia para esfregar panelas, chaleiras e utensílios. Grampos de aço inox (evita corrosão). Autoclavável. PBT com memória elástica.',
    category: 'Escovas Manuais PBT',
    imageUrl: '',
    brand: Brand.EL_CASTOR,
    specs: "Material: PBT Rigidez Média. Comp. Cerda: 4,44cm. Cabo Longo (4102) para áreas difíceis. Cabo Curto (4002). Resistência Temp: 120°C.",
    availableColors: ['+B', '+G', '+R', '+W', '+Y', '+O']
  },
  {
    id: '4012 + Sufixo',
    name: 'Escova Larga para Limpeza Detalhada',
    description: 'Design ergonômico. Recomendada para peças de máquinas pequenas e difícil acesso.',
    category: 'Escovas Manuais PBT',
    imageUrl: '',
    brand: Brand.EL_CASTOR,
    specs: "Medida: 17,8cm x 3,81cm. Material: Polipropileno Sólido + PBT Rígido (2,54cm altura).",
    availableColors: ['+G', '+R', '+W', '+Y', '+O', '+B']
  },
  // Página 4
  {
    id: '4022 + Sufixo',
    name: 'Escova Estreita para Limpeza Detalhada',
    description: 'Design estreito e alongado. Recomendada para máquinas ou detalhamento. Design ergonômico.',
    category: 'Escovas Manuais PBT',
    imageUrl: '',
    brand: Brand.EL_CASTOR,
    specs: "Medida: 22,86cm x 2,22cm. Material: PBT Rígido (1,90cm altura).",
    availableColors: ['+G', '+R', '+W', '+Y', '+O', '+B']
  },
  {
    id: '4302 + Sufixo',
    name: 'Escova P/ Limp. Tábuas Corte',
    description: 'Projetada para limpar superfícies planas e espaços pequenos. Cerdas inclinadas na ponta para locais difíceis.',
    category: 'Escovas Manuais PBT',
    imageUrl: '',
    brand: Brand.EL_CASTOR,
    specs: "Medida: 15cm. Material: PBT Rigidez Média.",
    availableColors: ['+G', '+R', '+W', '+Y', '+O', '+B']
  },
  {
    id: '4312 + Sufixo',
    name: 'Escova Mult. Tipo Prancha',
    description: 'Cabo de plástico maciço tipo ferro. Alça aberta para pendurar na borda do balde.',
    category: 'Escovas Manuais PBT',
    imageUrl: '',
    brand: Brand.EL_CASTOR,
    specs: "Medida: 15,5cm. Material: PBT Média Rigidez 1 1/4\".",
    availableColors: ['+G', '+R', '+W', '+Y', '+O', '+B']
  },
  // Página 5
  {
    id: '4402 + Sufixo',
    name: 'Escova de Mão Cerdas Médias',
    description: 'Limpeza de prateleiras, bancadas, balcões e tábuas. Usada em mesas de aço inoxidável.',
    category: 'Escovas de Mão',
    imageUrl: '',
    brand: Brand.EL_CASTOR,
    specs: "Medida: 20,32cm. Material: PBT Rigidez Média (3,18cm).",
    availableColors: ['+G', '+R', '+W', '+Y', '+O', '+B']
  },
  {
    id: '4332 + Sufixo',
    name: 'Escova de Mão Redonda Tipo Estrela',
    description: 'Formato redondo ideal para limpar recipientes e potes redondos. Permite pressão forte.',
    category: 'Escovas de Mão',
    imageUrl: '',
    brand: Brand.EL_CASTOR,
    specs: "Medida: 10,3cm. Material: PBT Rigidez Média (3,97cm).",
    availableColors: ['+G', '+R', '+W', '+Y', '+O', '+B']
  },
  {
    id: '4601 + Sufixo (Baixa Rigidez) / 4602 + Sufixo (Rigidez Média)',
    name: 'Escova de Bancadas',
    description: 'Duas versões: Baixa rigidez (4601) para farináceos/pós finos. Rigidez média (4602) para lavagem de bancadas.',
    category: 'Escovas de Bancada',
    imageUrl: '',
    brand: Brand.EL_CASTOR,
    specs: "Medida: 33,02cm. Material: PBT.",
    availableColors: ['+G', '+R', '+W', '+Y', '+O', '+B']
  },
  // Página 6 - Tubos
  {
    id: '5325 + Sufixo (6cm) / 5330 + Sufixo (7cm)',
    name: 'Escova Limpeza de Tubos e Válvulas',
    description: 'Cerdas em toda a circunferência. Base de Polipropileno sólido com rosca de 3/4".',
    category: 'Tubos e Válvulas',
    imageUrl: '',
    brand: Brand.EL_CASTOR,
    specs: "Diâmetros: 6,35cm (5325) e 7,62cm (5330). Material: PBT Rigidez Média.",
    availableColors: ['+R', '+W', '+Y', '+B']
  },
  {
    id: '5401 + Sufixo',
    name: 'Escova Curvada Tubulações',
    description: 'Forma curva para perfil exterior de tubos aéreos. Acoplável a cabos extensores.',
    category: 'Tubos e Válvulas',
    imageUrl: '',
    brand: Brand.EL_CASTOR,
    specs: "Material: PBT Durável.",
    availableColors: ['+G', '+R', '+W', '+Y', '+B']
  },
  // Página 7 - Tanques
  {
    id: '4802 + Sufixo',
    name: 'Escova Para Tanques',
    description: '3 posições para encaixe do cabo, facilitando limpeza em ângulos diversos.',
    category: 'Tanques',
    imageUrl: '',
    brand: Brand.EL_CASTOR,
    specs: "Medida: 25,4cm. Material: PBT Rigidez Média.",
    availableColors: ['+G', '+R', '+W', '+Y', '+O', '+B']
  },
  {
    id: '5107W / 5115W / 5120W / 5130W',
    name: 'Escova Baqueta',
    description: 'Limpeza de tubulações com fio de aço inoxidável e alça. Furo para pendurar.',
    category: 'Tubos e Válvulas',
    imageUrl: '',
    brand: Brand.EL_CASTOR,
    specs: "Diâmetros: 1,9cm a 7,62cm. Material: PBT e Aço Inox.",
    availableColors: ['+W']
  },
  {
    id: '4641 + Sufixo',
    name: 'Escova Detalhada Estreita Macia',
    description: 'Cabo longo e cerda macia. Para locais de difícil acesso que exigem suavidade.',
    category: 'Detalhe',
    imageUrl: '',
    brand: Brand.EL_CASTOR,
    specs: "Material: Polipropileno e PBT Macio.",
    availableColors: ['+G', '+R', '+W', '+Y', '+O', '+B']
  },
  // Página 8 - Pisos
  {
    id: '4632 + Sufixo',
    name: 'Escova Limpeza de Botas',
    description: 'Canais para fluxo de líquidos. Rosca universal para mangueira. Limpeza manual de botas.',
    category: 'Pisos e Botas',
    imageUrl: '',
    brand: Brand.EL_CASTOR,
    specs: "Material: PBT Rígido. Conexão: 1/2\" para mangueira.",
    availableColors: ['+G', '+W', '+Y', '+B']
  },
  {
    id: '4501 + Sufixo (Macias) / 4502 + Sufixo (Médias)',
    name: 'Escova para Piso (Macias ou Médias)',
    description: 'Base polipropileno estrutural. 4501 (Macias): Superfícies delicadas. 4502 (Média): Sujidade grau maior.',
    category: 'Pisos',
    imageUrl: '',
    brand: Brand.EL_CASTOR,
    specs: "Material: PBT. Rosca: 3/4\".",
    availableColors: ['+G', '+R', '+W', '+Y', '+O', '+B']
  },
  {
    id: '4202 + Sufixo',
    name: 'Escova Piso Dois Ângulos',
    description: 'Dois níveis de cerdas (Hi-Lo). Permite limpar sob móveis e máquinas sem perder ângulo.',
    category: 'Pisos',
    imageUrl: '',
    brand: Brand.EL_CASTOR,
    specs: "Medida: 25,4cm. Material: PBT Rigidez Média.",
    availableColors: ['+G', '+R', '+W', '+Y', '+O', '+B']
  },
  // Página 9
  {
    id: '4510 + Sufixo',
    name: 'Escova Giratória',
    description: 'Rotativa para limpar rodapés e paredes. Cerdas resistentes a ácidos.',
    category: 'Pisos e Paredes',
    imageUrl: '',
    brand: Brand.EL_CASTOR,
    specs: "Material: PBT/Nylon (Resistente Químico).",
    availableColors: ['+G', '+R', '+W', '+Y', '+B']
  },
  {
    id: '45T2 + Sufixo',
    name: 'Escova Limpeza Rejuntes',
    description: 'Base triangular. Cerdas em formato de cunha para rejuntes.',
    category: 'Pisos e Paredes',
    imageUrl: '',
    brand: Brand.EL_CASTOR,
    specs: "Material: PBT Alta Rigidez.",
    availableColors: ['+G', '+R', '+W', '+Y', '+O', '+B']
  },
  {
    id: '4702 + Sufixo',
    name: 'Vassoura Angular Cerdas Médias',
    description: 'Dura 10x mais que vassoura convencional. Resistência ao calor. Dupla perfuração para ângulo do cabo.',
    category: 'Vassouras',
    imageUrl: '',
    brand: Brand.EL_CASTOR,
    specs: "Material: PBT Rigidez Média. Rosca: 3/4\".",
    availableColors: ['+G', '+R', '+W', '+Y', '+O', '+B']
  },
  // Página 10
  {
    id: '4901 + Sufixo',
    name: 'Escova P/ Limpeza de Unhas e Mãos',
    description: 'Base de Polipropileno de 12,7 cm. Fibras PBT rigidez média com cerdas pretas e mais rígidas no centro.',
    category: 'Higiene Pessoal',
    imageUrl: '',
    brand: Brand.EL_CASTOR,
    specs: "Material: PBT. Cerdas: Média/Rígida.",
    availableColors: ['+G', '+R', '+W', '+Y', '+O', '+B', '+K']
  },
  // Página 11 - Rodos
  {
    id: 'FI25 + Sufixo / FI99 + Sufixo (Cabo)',
    name: 'Secador de Bancadas',
    description: 'Secagem de bancadas e pias. Aprovado para contato com alimentos. Cabo vendido separadamente.',
    category: 'Rodos',
    imageUrl: '',
    brand: Brand.EL_CASTOR,
    specs: "Medida: 25cm. Material: Borracha sanitária.",
    availableColors: ['+G', '+R', '+W', '+Y', '+B']
  },
  {
    id: 'FI45 + Sufixo / FI75 + Sufixo',
    name: 'Rodo Higiênico Pequeno',
    description: 'Base leve e flexível. Borracha não propaga microrganismos. Não risca.',
    category: 'Rodos',
    imageUrl: '',
    brand: Brand.EL_CASTOR,
    specs: "Medidas: 45cm e 75cm. Rosca: 3/4\".",
    availableColors: ['+G', '+R', '+W', '+Y', '+O', '+B', '+K']
  },
  {
    id: 'UH50 + Sufixo',
    name: 'Rodo Ultra Higiênico',
    description: 'Peça única (lâmina e base integrados). Extrema higienização. Não enferruja.',
    category: 'Rodos',
    imageUrl: '',
    brand: Brand.EL_CASTOR,
    specs: "Medida: 50cm. Material: Borracha/Plástico peça única.",
    availableColors: ['+R', '+W', '+Y', '+G', '+B']
  },
  // Página 12 - Cabos
  {
    id: '1906 + Sufixo (F = Vidro / A = Alumínio)',
    name: 'Cabo (Fibra de Vidro ou Alumínio)',
    description: 'Fibra de Vidro (FG/FR/FW...): Não conduz energia. Alumínio (AG/AR/AW...): Leve. Padrão Americano ou Europeu.',
    category: 'Cabos',
    imageUrl: '',
    brand: Brand.EL_CASTOR,
    specs: "Medida: 1,50m. Cores disponíveis variam por material.",
    availableColors: ['+G', '+R', '+W', '+Y', '+O', '+B', '+K']
  },
  // Página 15
  {
    id: 'W011 + Sufixo',
    name: 'Balde Retangular Plástico 22 Litros',
    description: 'Ideal para uso com ferramentas que não cabem em baldes redondos (rodos, aplicadores de cera).',
    category: 'Baldes',
    imageUrl: '',
    brand: Brand.EL_CASTOR,
    specs: "Capacidade: 22L. Material: Plástico Resistente.",
    availableColors: ['+G', '+R', '+W', '+Y', '+B']
  },
  {
    id: '9110 + Sufixo',
    name: 'Organizador de Parede em Alumínio',
    description: 'Organizador para ferramentas de limpeza. Revestido com pintura eletrostática.',
    category: 'Organizadores',
    imageUrl: '',
    brand: Brand.EL_CASTOR,
    specs: "Material: Alumínio. Alta durabilidade.",
    availableColors: ['+G', '+R', '+W', '+Y', '+B', '+K']
  }
];
