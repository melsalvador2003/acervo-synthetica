# Instruções e Preferências do Projeto (AI Studio Agent Rules)

## Diretrizes para Objetos e Visualizadores 3D (WebGL / Three.js)

1. **Zero Botões de Interface Sobrepostos na Área 3D:**
   - **NUNCA** adicionar botões flutuantes, badges, tags de status (ex: "WebGL • 360°"), seletores de iluminação, botões de reset, tela cheia, zoom in/out, botões de eixos ou barras de ferramentas sobrepostas diretamente dentro do visualizador ou sobre a área do objeto 3D.
   - A área do objeto 3D deve ser completamente limpa, minimalista e focada exclusivamente no modelo 3D.

2. **Interação Natural:**
   - A inspeção do objeto deve ocorrer de forma limpa e nativa via toque e mouse (arrastar para girar em 360°, pinça ou scroll do mouse para zoom suave com `OrbitControls`).
   - Permitir clique/toque no próprio objeto para interações contextuais (como tocar/pausar reprodução se aplicável).

3. **Carregamento Discreto:**
   - Exibir apenas um indicador sutil e minimalista de carregamento enquanto o arquivo `.glb` é decodificado, que desaparece completamente após a carga.

4. **Padronização para os Próximos Objetos 3D:**
   - Aplicar este mesmo padrão limpo (sem botões sobrepostos) para todos os modelos 3D futuros das demais categorias do acervo (Dança, Cinema, Artes Visuais, etc.).
