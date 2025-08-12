# 🔍 Guia de Acessibilidade - PharmaLife

## Melhorias Implementadas para Idosos e Pessoas com Deficiência

### 🎯 Principais Funcionalidades

#### 1. **Modo de Acessibilidade (Letras Grandes)**
- **Como ativar**: Clique no botão "🔍 Letras Grandes" no canto superior direito
- **O que muda**:
  - Fontes 50% maiores em todo o aplicativo
  - Botões maiores e mais fáceis de clicar
  - Contraste melhorado (preto no branco)
  - Interface simplificada com menos informações por tela

#### 2. **Navegação Simplificada**
- Botões grandes com texto claro
- Menu lateral com opções bem espaçadas
- Cores contrastantes para melhor visibilidade
- Ícones grandes e descritivos

#### 3. **Formulários Acessíveis**
- Campos de entrada maiores (70px de altura)
- Texto maior nos formulários (1.3rem)
- Bordas mais visíveis (3px)
- Foco amarelo para navegação por teclado

### 📱 Como Usar o Modo de Acessibilidade

#### **Para Idosos:**
1. **Primeira vez**: Peça ajuda de um familiar para ativar
2. **Localizar o botão**: Canto superior direito da tela
3. **Clicar**: "🔍 Letras Grandes"
4. **Resultado**: Tudo fica maior e mais fácil de ler

#### **Para Cuidadores:**
1. Ajude a ativar o modo na primeira vez
2. Ensine onde fica o botão para ligar/desligar
3. Explique que as configurações ficam salvas
4. Mostre como usar os botões maiores

### 🎨 Melhorias Visuais

#### **Cores e Contraste:**
- Fundo branco com texto preto
- Botões com bordas grossas (3-4px)
- Cores de status mais visíveis
- Eliminação de gradientes confusos

#### **Tipografia:**
- Fonte base: 18px (modo acessível)
- Títulos: até 2.5rem
- Peso da fonte: mais negrito (700-800)
- Espaçamento entre linhas: 1.8

#### **Botões e Interação:**
- Altura mínima: 60-80px
- Padding generoso: 1.5-2rem
- Bordas visíveis e coloridas
- Efeito hover mais pronunciado

### 🔧 Funcionalidades Técnicas

#### **Persistência:**
- Configuração salva no navegador
- Mantém preferência entre sessões
- Funciona em todas as páginas

#### **Responsividade:**
- Adapta-se a diferentes tamanhos de tela
- Mantém acessibilidade em dispositivos móveis
- Layout simplificado em telas pequenas

#### **Navegação por Teclado:**
- Foco amarelo visível
- Ordem lógica de navegação
- Suporte completo ao Tab

### 📋 Guia para Familiares

#### **Como Ajudar um Idoso:**
1. **Configuração Inicial:**
   - Abra o aplicativo
   - Clique em "🔍 Letras Grandes"
   - Explique que ficou mais fácil de ver

2. **Ensinar o Básico:**
   - Mostrar onde estão os botões principais
   - Explicar as cores dos remédios
   - Ensinar a marcar como "tomado"

3. **Dicas Importantes:**
   - Use horários simples (8h, 12h, 18h)
   - Mantenha uma lista no papel também
   - Verifique regularmente se está funcionando

### 🆘 Suporte e Ajuda

#### **Se Tiver Dificuldades:**
- Peça ajuda a um familiar ou amigo
- Use a seção "Ajuda" do aplicativo
- Mantenha sempre uma lista de remédios no papel

#### **Emergências:**
- **SAMU**: 192
- **Bombeiros**: 193
- **Polícia**: 190

### 💡 Dicas de Uso

#### **Para Melhor Experiência:**
1. **Sempre ative o modo de acessibilidade**
2. **Use horários regulares e simples**
3. **Peça ajuda quando necessário**
4. **Mantenha backup em papel**
5. **Consulte sempre seu médico**

---

## 🔍 Detalhes Técnicos (Para Desenvolvedores)

### Arquivos Modificados:
- `src/Accessibility.css` - Estilos de acessibilidade
- `src/Home.jsx` - Componente principal com toggle
- `src/App.jsx` - Aplicação do modo em login/cadastro
- `src/Home.css` - Estilos do botão de acessibilidade

### Classes CSS Principais:
- `.accessibility-mode` - Classe principal do modo acessível
- `.accessibility-toggle` - Botão de alternância
- `.accessibility-header` - Cabeçalho nas páginas de login

### Funcionalidades Implementadas:
- Toggle persistente com localStorage
- Estilos específicos para cada componente
- Responsividade mantida
- Navegação por teclado aprimorada
- Contraste WCAG AA compliant