// Cores oficiais da FIAP
export const FIAP_COLORS = {
	// Cores principais
	PRIMARY_GREEN: '#F527B4',    // Rosa/Magenta FIAP principal
	PRIMARY_BLUE: '#0066CC',     // Azul FIAP secundário
	
	// Cores de texto
	TEXT_PRIMARY: '#333333',     // Texto principal
	TEXT_SECONDARY: '#666666',   // Texto secundário
	TEXT_LIGHT: '#999999',       // Texto claro
	TEXT_WHITE: '#FFFFFF',       // Texto branco
	
	// Cores de fundo
	BACKGROUND_LIGHT: '#f8f9fa', // Fundo claro
	BACKGROUND_WHITE: '#FFFFFF', // Fundo branco
	
	// Cores de borda
	BORDER_LIGHT: '#e1e5e9',     // Borda clara
	
	// Cores de estado
	SUCCESS: '#F527B4',          // Sucesso (rosa/magenta)
	ERROR: '#dc3545',            // Erro (vermelho)
	WARNING: '#ffc107',          // Aviso (amarelo)
	INFO: '#0066CC',             // Informação (azul)
	
	// Cores de sombra
	SHADOW_COLOR: '#000000',     // Cor da sombra
};

// Gradientes da FIAP
export const FIAP_GRADIENTS = {
	PRIMARY: ['#F527B4', '#d91f9a'],
	SECONDARY: ['#0066CC', '#0052a3'],
};

// Configurações de sombra
export const SHADOW_STYLES = {
	SMALL: {
		shadowColor: FIAP_COLORS.SHADOW_COLOR,
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	MEDIUM: {
		shadowColor: FIAP_COLORS.SHADOW_COLOR,
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.15,
		shadowRadius: 8,
		elevation: 6,
	},
	LARGE: {
		shadowColor: FIAP_COLORS.SHADOW_COLOR,
		shadowOffset: { width: 0, height: 8 },
		shadowOpacity: 0.2,
		shadowRadius: 16,
		elevation: 12,
	},
};
