import { Brand, Product } from '../types';

// Tabela de Classificação de Fibra por Material (PDF Página 1)
export const MATERIAL_SPECS = {
  description: "Tabela Mestra de Resistência Química e Térmica das Fibras. Use isso para validar se o produto aguenta o ambiente do cliente.",
  legend: "E=Excelente, B=Boa, S=Suficiente, I=Insuficiente",
  materials: [
    {
      name: "LECHUGUILLA (Fibra Natural)",
      rigidity: "Média",
      tempDistortion: "150°C",
      resistances: {
        sun: "B", abrasion: "E", waterAbsorb: "B", elasticMem: "I",
        humidity: "S", acidDiluted: "E", acidConc: "B", alkali: "B",
        alcoholOil: "B", petroleum: "B"
      }
    },
    {
      name: "PALMYRA (Fibra Natural)",
      rigidity: "Média",
      tempDistortion: "150°C",
      resistances: {
        sun: "E", abrasion: "E", waterAbsorb: "B", elasticMem: "I",
        humidity: "S", acidDiluted: "E", acidConc: "E", alkali: "E",
        alcoholOil: "E", petroleum: "S"
      }
    },
    {
      name: "NYLON",
      rigidity: "Média/Alta",
      tempDistortion: "100°C",
      resistances: {
        sun: "B", abrasion: "B", waterAbsorb: "I", elasticMem: "E",
        humidity: "E", acidDiluted: "S", acidConc: "S", alkali: "E",
        alcoholOil: "E", petroleum: "E"
      }
    },
    {
      name: "PBT (Polibutileno Tereftalato)",
      rigidity: "Média/Alta",
      tempDistortion: "120°C",
      resistances: {
        sun: "E", abrasion: "E", waterAbsorb: "I", elasticMem: "E",
        humidity: "E", acidDiluted: "B", acidConc: "B", alkali: "E",
        alcoholOil: "E", petroleum: "E"
      },
      note: "Material padrão para Indústria Alimentícia (FDA). Autoclavável."
    },
    {
      name: "POLIÉSTER (PET)",
      rigidity: "Média",
      tempDistortion: "77°C",
      resistances: {
        sun: "S", abrasion: "I", waterAbsorb: "I", elasticMem: "I",
        humidity: "B", acidDiluted: "I", acidConc: "I", alkali: "I",
        alcoholOil: "S", petroleum: "S"
      },
      note: "Feito de garrafas recicladas. Baixo custo."
    },
    {
      name: "POLIPROPILENO",
      rigidity: "Alta",
      tempDistortion: "80°C",
      resistances: {
        sun: "B", abrasion: "B", waterAbsorb: "I", elasticMem: "I",
        humidity: "E", acidDiluted: "E", acidConc: "E", alkali: "E",
        alcoholOil: "E", petroleum: "S"
      }
    },
    {
      name: "PVC",
      rigidity: "Média",
      tempDistortion: "53°C",
      resistances: {
        sun: "E", abrasion: "B", waterAbsorb: "I", elasticMem: "B",
        humidity: "E", acidDiluted: "E", acidConc: "E", alkali: "B",
        alcoholOil: "E", petroleum: "B"
      },
      note: "Comum em escovas automotivas (cerdas macias)."
    },
    {
      name: "TEFLÓN",
      rigidity: "Alta",
      tempDistortion: "260°C",
      resistances: {
        sun: "E", abrasion: "B", waterAbsorb: "I", elasticMem: "E",
        humidity: "E", acidDiluted: "E", acidConc: "E", alkali: "E",
        alcoholOil: "E", petroleum: "E"
      }
    },
    {
      name: "AÇO INOXIDÁVEL",
      rigidity: "Alta",
      tempDistortion: "N/A",
      resistances: {
        sun: "E", abrasion: "E", waterAbsorb: "I", elasticMem: "E",
        humidity: "E", acidDiluted: "B", acidConc: "B", alkali: "E",
        alcoholOil: "E", petroleum: "E"
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
    id: '9201-9202',
    name: 'Espátula Multiuso de Plástico',
    description: 'Ideal para a remoção de sujidade impregnada em superfícies fixas e planas, sem riscá-las ou arranhá-las. Os materiais com os quais são fabricados atendem a todos os requisitos para estar em contato com alimentos. Alça com furo para armazenamento.',
    category: 'Espátulas',
    imageUrl: '',
    brand: Brand.EL_CASTOR,
    specs: "Material: Polipropileno (PP). Rigidez: Pequena (9201) ou Média (9202)."
  },
  {
    id: '9801-9802',
    name: 'Pá Sanitária (Pequena ou Grande)',
    description: 'Ideal para áreas de produção e contato direto com alimentos. Por ser de plástico, não gera faísca e não oxida. Indicada para transportar produtos de recipiente para recipiente ou de recipiente para correias transportadoras.',
    category: 'Pás',
    imageUrl: '',
    brand: Brand.EL_CASTOR,
    specs: "Material: Polipropileno (PP). Tamanhos: Pequena (9801) e Grande (9802). Cores: +G, +R, +W, +Y, +B."
  },
  {
    id: '5001',
    name: 'Pincel Sanitário Red. 1 Pol (C. Suave Nylon)',
    description: 'Escova sanitária com cerdas de nylon macias de 4,44cm comprimento e (2,54 cm) de diâmetro. Popular na indústria de panificação e em áreas de processamento de alimentos em geral. Obs: Não deve ser utilizada em trabalho contínuo a mais de 60°C.',
    category: 'Pincéis',
    imageUrl: '',
    brand: Brand.EL_CASTOR,
    specs: "Diâmetro: 2,54cm (1 Pol). Material: Nylon Macio. Temp Máx: 60°C."
  },
  {
    id: '5002-5003',
    name: 'Pincel Sanitário Plano',
    description: 'Linha de pincéis com cerdas de nylon macias de 5,08 cm de comprimento, amplamente utilizados na indústria de panificação e em áreas de processamento de alimentos em geral. Obs: não devem ser utilizados em trabalho contínuo a mais de 60°C.',
    category: 'Pincéis',
    imageUrl: '',
    brand: Brand.EL_CASTOR,
    specs: "Larguras: 5,08cm (5002) e 7,62cm (5003). Material: Nylon Macio. Temp Máx: 60°C."
  },
  {
    id: '3204',
    name: 'Escova Manual de Nylon para Tecidos',
    description: 'Cerda de nylon branca com 4,44 cm de comprimento. Esta escova é ideal para lavar estofados e carpetes com tecidos mais resistentes.',
    category: 'Diversos',
    imageUrl: '',
    brand: Brand.EL_CASTOR,
    specs: "Material: Nylon Branco. Uso: Estofados e Carpetes."
  },
  {
    id: '4911',
    name: 'Cordão de Fixação para Escovas de Mãos',
    description: 'Ideal para a fixação das escovas manuais, deixando-as disponíveis nos locais de trabalho.',
    category: 'Acessórios',
    imageUrl: '',
    brand: Brand.EL_CASTOR,
    specs: "Material: Polipropileno/Espiral. Cores: +R, +W, +Y, +G, +B."
  },

  // --- PRODUTOS ANTERIORES ---
  // Página 3 - Escovas PBT
  {
    id: '4002-4102',
    name: 'Escova Multiuso (Punho Longo ou Curto)',
    description: 'Escova popular na indústria alimentícia para esfregar panelas, chaleiras e utensílios. Grampos de aço inox (evita corrosão). Autoclavável. PBT com memória elástica.',
    category: 'Escovas Manuais PBT',
    imageUrl: '',
    brand: Brand.EL_CASTOR,
    specs: "Material: PBT Rigidez Média. Comp. Cerda: 4,44cm. Cabo Longo (4102) para áreas difíceis. Cabo Curto (4002). Resistência Temp: 120°C."
  },
  {
    id: '4012',
    name: 'Escova Larga para Limpeza Detalhada',
    description: 'Design ergonômico. Recomendada para peças de máquinas pequenas e difícil acesso.',
    category: 'Escovas Manuais PBT',
    imageUrl: '',
    brand: Brand.EL_CASTOR,
    specs: "Medida: 17,8cm x 3,81cm. Material: Polipropileno Sólido + PBT Rígido (2,54cm altura)."
  },
  // Página 4
  {
    id: '4022',
    name: 'Escova Estreita para Limpeza Detalhada',
    description: 'Design estreito e alongado. Recomendada para máquinas ou detalhamento. Design ergonômico.',
    category: 'Escovas Manuais PBT',
    imageUrl: '',
    brand: Brand.EL_CASTOR,
    specs: "Medida: 22,86cm x 2,22cm. Material: PBT Rígido (1,90cm altura)."
  },
  {
    id: '4302',
    name: 'Escova P/ Limp. Tábuas Corte',
    description: 'Projetada para limpar superfícies planas e espaços pequenos. Cerdas inclinadas na ponta para locais difíceis.',
    category: 'Escovas Manuais PBT',
    imageUrl: '',
    brand: Brand.EL_CASTOR,
    specs: "Medida: 15cm. Material: PBT Rigidez Média."
  },
  {
    id: '4312',
    name: 'Escova Mult. Tipo Prancha',
    description: 'Cabo de plástico maciço tipo ferro. Alça aberta para pendurar na borda do balde.',
    category: 'Escovas Manuais PBT',
    imageUrl: '',
    brand: Brand.EL_CASTOR,
    specs: "Medida: 15,5cm. Material: PBT Média Rigidez 1 1/4\"."
  },
  // Página 5
  {
    id: '4402',
    name: 'Escova de Mão Cerdas Médias',
    description: 'Limpeza de prateleiras, bancadas, balcões e tábuas. Usada em mesas de aço inoxidável.',
    category: 'Escovas de Mão',
    imageUrl: '',
    brand: Brand.EL_CASTOR,
    specs: "Medida: 20,32cm. Material: PBT Rigidez Média (3,18cm)."
  },
  {
    id: '4332',
    name: 'Escova de Mão Redonda Tipo Estrela',
    description: 'Formato redondo ideal para limpar recipientes e potes redondos. Permite pressão forte.',
    category: 'Escovas de Mão',
    imageUrl: '',
    brand: Brand.EL_CASTOR,
    specs: "Medida: 10,3cm. Material: PBT Rigidez Média (3,97cm)."
  },
  {
    id: '4601-4602',
    name: 'Escova de Bancadas',
    description: 'Duas versões: Baixa rigidez (4601) para farináceos/pós finos. Rigidez média (4602) para lavagem de bancadas.',
    category: 'Escovas de Bancada',
    imageUrl: '',
    brand: Brand.EL_CASTOR,
    specs: "Medida: 33,02cm. Material: PBT."
  },
  // Página 6 - Tubos
  {
    id: '5325-5330',
    name: 'Escova Limpeza de Tubos e Válvulas',
    description: 'Cerdas em toda a circunferência. Base de Polipropileno sólido com rosca de 3/4".',
    category: 'Tubos e Válvulas',
    imageUrl: '',
    brand: Brand.EL_CASTOR,
    specs: "Diâmetros: 6,35cm (5325) e 7,62cm (5330). Material: PBT Rigidez Média."
  },
  {
    id: '5401',
    name: 'Escova Curvada Tubulações',
    description: 'Forma curva para perfil exterior de tubos aéreos. Acoplável a cabos extensores.',
    category: 'Tubos e Válvulas',
    imageUrl: '',
    brand: Brand.EL_CASTOR,
    specs: "Material: PBT Durável."
  },
  // Página 7 - Tanques
  {
    id: '4802',
    name: 'Escova Para Tanques',
    description: '3 posições para encaixe do cabo, facilitando limpeza em ângulos diversos.',
    category: 'Tanques',
    imageUrl: '',
    brand: Brand.EL_CASTOR,
    specs: "Medida: 25,4cm. Material: PBT Rigidez Média."
  },
  {
    id: '5100-SERIES',
    name: 'Escova Baqueta',
    description: 'Limpeza de tubulações com fio de aço inoxidável e alça. Furo para pendurar.',
    category: 'Tubos e Válvulas',
    imageUrl: '',
    brand: Brand.EL_CASTOR,
    specs: "Diâmetros: 1,9cm a 7,62cm. Material: PBT e Aço Inox."
  },
  {
    id: '4641',
    name: 'Escova Detalhada Estreita Macia',
    description: 'Cabo longo e cerda macia. Para locais de difícil acesso que exigem suavidade.',
    category: 'Detalhe',
    imageUrl: '',
    brand: Brand.EL_CASTOR,
    specs: "Material: Polipropileno e PBT Macio."
  },
  // Página 8 - Pisos
  {
    id: '4632',
    name: 'Escova Limpeza de Botas',
    description: 'Canais para fluxo de líquidos. Rosca universal para mangueira. Limpeza manual de botas.',
    category: 'Pisos e Botas',
    imageUrl: '',
    brand: Brand.EL_CASTOR,
    specs: "Material: PBT Rígido. Conexão: 1/2\" para mangueira."
  },
  {
    id: '4501-4502',
    name: 'Escova para Piso (Macias ou Médias)',
    description: 'Base polipropileno estrutural. 4501 (Macias): Superfícies delicadas. 4502 (Média): Sujidade grau maior.',
    category: 'Pisos',
    imageUrl: '',
    brand: Brand.EL_CASTOR,
    specs: "Material: PBT. Rosca: 3/4\"."
  },
  {
    id: '4202',
    name: 'Escova Piso Dois Ângulos',
    description: 'Dois níveis de cerdas (Hi-Lo). Permite limpar sob móveis e máquinas sem perder ângulo.',
    category: 'Pisos',
    imageUrl: '',
    brand: Brand.EL_CASTOR,
    specs: "Medida: 25,4cm. Material: PBT Rigidez Média."
  },
  // Página 9
  {
    id: '4510',
    name: 'Escova Giratória',
    description: 'Rotativa para limpar rodapés e paredes. Cerdas resistentes a ácidos.',
    category: 'Pisos e Paredes',
    imageUrl: '',
    brand: Brand.EL_CASTOR,
    specs: "Material: PBT/Nylon (Resistente Químico)."
  },
  {
    id: '45T2',
    name: 'Escova Limpeza Rejuntes',
    description: 'Base triangular. Cerdas em formato de cunha para rejuntes.',
    category: 'Pisos e Paredes',
    imageUrl: '',
    brand: Brand.EL_CASTOR,
    specs: "Material: PBT Alta Rigidez."
  },
  {
    id: '4702',
    name: 'Vassoura Angular Cerdas Médias',
    description: 'Dura 10x mais que vassoura convencional. Resistência ao calor. Dupla perfuração para ângulo do cabo.',
    category: 'Vassouras',
    imageUrl: '',
    brand: Brand.EL_CASTOR,
    specs: "Material: PBT Rigidez Média. Rosca: 3/4\"."
  },
  // Página 11 - Rodos
  {
    id: 'FI25-99',
    name: 'Secador de Bancadas',
    description: 'Secagem de bancadas e pias. Aprovado para contato com alimentos. Cabo vendido separadamente.',
    category: 'Rodos',
    imageUrl: '',
    brand: Brand.EL_CASTOR,
    specs: "Medida: 25cm. Material: Borracha sanitária."
  },
  {
    id: 'FI45-75',
    name: 'Rodo Higiênico Pequeno',
    description: 'Base leve e flexível. Borracha não propaga microrganismos. Não risca.',
    category: 'Rodos',
    imageUrl: '',
    brand: Brand.EL_CASTOR,
    specs: "Medidas: 45cm e 75cm. Rosca: 3/4\"."
  },
  {
    id: 'UH50',
    name: 'Rodo Ultra Higiênico',
    description: 'Peça única (lâmina e base integrados). Extrema higienização. Não enferruja.',
    category: 'Rodos',
    imageUrl: '',
    brand: Brand.EL_CASTOR,
    specs: "Medida: 50cm. Material: Borracha/Plástico peça única."
  },
  // Página 12 - Cabos
  {
    id: '1906-FG',
    name: 'Cabo Fibra de Vidro',
    description: 'Não conduz energia. Resistente. Rosca padrão americano.',
    category: 'Cabos',
    imageUrl: '',
    brand: Brand.EL_CASTOR,
    specs: "Medida: 1,50m. Cores disponíveis."
  },
  {
    id: '1906-AL',
    name: 'Cabo de Alumínio',
    description: 'Leve e seguro. Opção com pintura eletrostática (coloridos) ou ponta plástica.',
    category: 'Cabos',
    imageUrl: '',
    brand: Brand.EL_CASTOR,
    specs: "Medida: 1,50m. Padrão Americano ou Europeu (requer adaptador)."
  },
  // Página 17 - Automotivo
  {
    id: '1609',
    name: 'Escova Ultimate 1609 (Automotiva)',
    description: 'Cerda natural de rigidez média. Para lavagem de trailers e ônibus. Bloco com proteção.',
    category: 'Automotivo',
    imageUrl: '',
    brand: Brand.EL_CASTOR,
    specs: "Medida: 23cm. Material: Cerda Natural. Rosca 3/4\"."
  },
  {
    id: '1809',
    name: 'Escova Ultimate 1809 (Suave)',
    description: 'Cerda PVC macia. Popular em lava-rápido. Alta densidade de fibras.',
    category: 'Automotivo',
    imageUrl: '',
    brand: Brand.EL_CASTOR,
    specs: "Medida: 23cm. Material: PVC Macio."
  },
  {
    id: '1810',
    name: 'Escova Bi-Level (PVC)',
    description: 'Dois níveis de cerdas para superfícies altas. Macia (1810-B) ou Média (1810-P).',
    category: 'Automotivo',
    imageUrl: '',
    brand: Brand.EL_CASTOR,
    specs: "Medida: 25,4cm. Material: PVC."
  }
];