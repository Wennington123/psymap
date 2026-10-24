# PsyMap 🧠

Mapeamento emocional direto do seu bolso. Registre como você se sente, acompanhe padrões ao longo do tempo e entenda melhor suas emoções — com os dados no seu aparelho.

---

## ✨ Funcionalidades

- **Roda de emoções** — registre entre as 8 emoções base (roda de Plutchik)
- **Intensidade** — a força de cada sentimento (1 a 5)
- **Descrição** — escreva o que aconteceu e o que você percebeu no corpo e nos pensamentos
- **Histórico** — visualize, filtre e exclua registros
- **Estatísticas** — frequência, distribuição, tendência de intensidade, dia da semana e horário, com exportação em PDF
- **Gamificação** — XP, níveis, sequência de dias e conquistas
- **Ranking** — compare XP semanal/geral com outras pessoas (login opcional com Google)
- **Temas** — Claro, Escuro, Dracula, Nord, Gruvbox, Catppuccin e Pixel
- **Doação via PIX** — contribua com o projeto se quiser

---

## 🔒 Privacidade

**Seus registros de humor ficam apenas no seu dispositivo** (`AsyncStorage`). Emoções, intensidades e descrições nunca saem do aparelho.

O único dado que pode sair é o que o ranking precisa, e **somente se você entrar com Google** (opcional):

- nome de exibição e foto do perfil
- XP total e semanal, nível e sequência de dias

Esses campos vão para o Firestore do projeto e ficam visíveis para quem está no ranking. Sem login, o app funciona 100% local. Não há telemetria nem rastreamento.

---

## 📜 Termos de Serviço

Ao usar o PsyMap, você concorda que:

1. O app é fornecido "como está", sem garantias de qualquer tipo.
2. Você é o único responsável pelos dados que registra. Faça backups se quiser preservá-los.
3. O app não se responsabiliza por qualquer decisão tomada com base nas informações exibidas. Ele é uma ferramenta de autoconhecimento, não substitui acompanhamento profissional.
4. Você pode usar o app gratuitamente para qualquer finalidade pessoal.

---

## 🚀 Instalação

### Pré-requisitos
- Node.js 22+
- JDK 17 (para builds Android)
- Android SDK com platform 36

### Rodando localmente

```bash
git clone https://gitlab.com/wenningtondiasx25/psymap.git
cd psymap
npm install
npx expo start
```

Para testar em um device Android com hot reload:

```bash
npx expo prebuild --platform android
npx expo run:android
```

> O login Google e o ranking exigem `google-services.json` na raiz. Veja [FIREBASE_SETUP.md](./FIREBASE_SETUP.md).

### Build

```bash
npx expo prebuild --platform android --clean
cd android && ./gradlew assembleDebug       # APK de dev
./gradlew assembleRelease bundleRelease     # APK + AAB assinados
```

O repositório também tem um workflow de CI no GitHub Actions que gera **APK debug, APK release e AAB** a cada push no `main`, com artifacts para download.

---

## 🛠 Tecnologias

- [Expo](https://expo.dev) 54 + [Expo Router](https://docs.expo.dev/router/introduction/)
- [React Native](https://reactnative.dev) 0.81 (New Architecture)
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)
- [React Native Firebase](https://rnfirebase.io) + [Google Sign-In](https://github.com/react-native-google-signin/google-signin)
- [react-native-gifted-charts](https://gifted-charts.web.app)
- [Lucide](https://lucide.dev) (ícones) e [Nunito](https://fonts.google.com/specimen/Nunito) / [Pixelify Sans](https://fonts.google.com/specimen/Pixelify+Sans) (tipografia)
- [Fluent Emoji](https://github.com/microsoft/fluentui-emoji) (emojis 3D e flat)

---

## 🤝 Contribuindo

Pull requests são bem-vindos! Para mudanças grandes, abra uma issue primeiro para discutir o que você gostaria de alterar.

**Reportar bugs e sugestões:** use a aba **Ajustes → Enviar feedback** (abre um e-mail) ou abra uma issue no repositório.

**Apoiar o projeto:** a chave PIX e o QR code estão em **Ajustes → Contribua**. Toda contribuição ajuda a manter o PsyMap gratuito e independente.

### Próximas atualizações

- Emoção × intensidade nas estatísticas
- Vibração e microanimações
- Ranking entre amigos
- Exportar e importar histórico
- Lembretes com horários personalizáveis

---

## 📄 Licença

GNU GPLv3 © Wennington Dias

---

## 🙏 Atribuições

- Emojis por [Microsoft Fluent Emoji](https://github.com/microsoft/fluentui-emoji) — licença MIT.
- Temas inspirados nas paletas FOSS [Dracula](https://draculatheme.com), [Nord](https://www.nordtheme.com), [Gruvbox](https://github.com/morhetz/gruvbox) e [Catppuccin](https://catppuccin.com).
