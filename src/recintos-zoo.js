class RecintosZoo {
    constructor() {
        // Define os recintos e os animais existentes em cada um
        this.recintos = [
            { numero: 1, bioma: 'savana', tamanhoTotal: 10, animaisExistentes: [{ especie: 'MACACO', quantidade: 3 }] },
            { numero: 2, bioma: 'floresta', tamanhoTotal: 5, animaisExistentes: [] },
            { numero: 3, bioma: 'savana e rio', tamanhoTotal: 7, animaisExistentes: [{ especie: 'GAZELA', quantidade: 1 }] },
            { numero: 4, bioma: 'rio', tamanhoTotal: 8, animaisExistentes: [] },
            { numero: 5, bioma: 'savana', tamanhoTotal: 9, animaisExistentes: [{ especie: 'LEAO', quantidade: 1 }] }
        ];

        // Define as características de cada animal, como tamanho, biomas e se é carnívoro
        this.animais = {
            'LEAO': { tamanho: 3, biomas: ['savana'], carnivoro: true },
            'LEOPARDO': { tamanho: 2, biomas: ['savana'], carnivoro: true },
            'CROCODILO': { tamanho: 3, biomas: ['rio'], carnivoro: true },
            'MACACO': { tamanho: 1, biomas: ['savana', 'floresta'], carnivoro: false },
            'GAZELA': { tamanho: 2, biomas: ['savana'], carnivoro: false },
            'HIPOPOTAMO': { tamanho: 4, biomas: ['savana', 'rio'], carnivoro: false }
        };
    }

    // Função para analisar quais recintos são viáveis para um determinado animal e quantidade
    analisaRecintos(animal, quantidade) {
        // Verifica se o animal é válido
        if (!this.animais[animal]) {
            return { erro: "Animal inválido" };
        }

        // Verifica se a quantidade é válida
        if (quantidade <= 0) {
            return { erro: "Quantidade inválida" };
        }

        // Obtém as informações do animal
        const { tamanho, biomas, carnivoro } = this.animais[animal];
        const recintosViaveis = [];

        // Itera sobre cada recinto para verificar se é viável
        for (const recinto of this.recintos) {
            
            // Verifica se o bioma do recinto é compatível com o do animal
            if (!biomas.includes(recinto.bioma) && !(recinto.bioma === 'savana e rio' && biomas.includes('savana'))) {
                continue;
            }

            // Verifica a convivência com carnívoros no recinto
            const possuiCarnivoro = recinto.animaisExistentes.some(a => this.animais[a.especie].carnivoro);
            if (carnivoro && recinto.animaisExistentes.length > 0 && possuiCarnivoro) {
                continue;
            }
            if (!carnivoro && possuiCarnivoro) {
                continue;
            }

            // Verifica se o recinto é viável para hipopótamos (bioma e presença de outros animais)
            if (animal === 'HIPOPOTAMO' && recinto.bioma !== 'savana e rio' && recinto.animaisExistentes.length > 0) {
                continue;
            }

            // Verifica a regra de conforto dos macacos (evitar recinto vazio com apenas 1 macaco)
            if (animal === 'MACACO' && recinto.animaisExistentes.length === 0 && quantidade === 1) {
                continue;
            }

            // Calcula o espaço ocupado pelos animais existentes no recinto
            const espacoOcupado = recinto.animaisExistentes.reduce((total, { especie, quantidade }) => {
                return total + this.animais[especie].tamanho * quantidade;
            }, 0);

            // Calcula o espaço necessário para os novos animais
            let espacoNecessario = tamanho * quantidade;

            // Adiciona espaço extra se houver outras espécies no recinto
            if (recinto.animaisExistentes.length > 0 && !recinto.animaisExistentes.some(a => a.especie === animal)) {
                espacoNecessario += 1;
            }

            // Verifica se o recinto tem espaço livre suficiente
            const espacoLivre = recinto.tamanhoTotal - espacoOcupado;
            if (espacoLivre >= espacoNecessario) {
                recintosViaveis.push(`Recinto ${recinto.numero} (espaço livre: ${espacoLivre - espacoNecessario} total: ${recinto.tamanhoTotal})`);
            }
        }

        // Ordena os recintos viáveis pelo número
        recintosViaveis.sort((a, b) => {
            const numA = parseInt(a.match(/Recinto (\d+)/)[1]);
            const numB = parseInt(b.match(/Recinto (\d+)/)[1]);
            return numA - numB;
        });

        // Retorna erro se não houver recintos viáveis, caso contrário, retorna a lista de recintos viáveis
        if (recintosViaveis.length === 0) {
            return { erro: "Não há recinto viável" };
        }

        return { recintosViaveis };
    }
}

// Exporta a classe RecintosZoo para ser utilizada em outros módulos
export { RecintosZoo as RecintosZoo };
