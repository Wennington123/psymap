# PsyMap 🧠

Mapeamento emocional direto do seu bolso. Registre como você se sente, acompanhe padrões ao longo do tempo e entenda melhor suas emoções — tudo 100% offline e privado.

---

## ✨ Funcionalidades

- **Roda de emoções** — selecione entre emoções base ou crie as suas próprias
- **Intensidade** — registre a força de cada sentimento (1 a 5)
- **Notas** — adicione uma anotação opcional a cada registro
- **Histórico** — visualize, filtre e exclua entradas passadas
- **Estatísticas** — gráficos de frequência, distribuição, tendência de intensidade, dias da semana e horários
- **Exportar PDF** — gere relatórios com seus dados para compartilhar com seu terapeuta
- **4 temas** — Dracula, Escuro, Claro e Gatinhos
- **Doação via PIX** — contribua com o projeto se quiser

---

## 🔒 Privacidade

**O PsyMap não coleta, armazena ou transmite nenhum dado pessoal.**

Todos os seus registros ficam exclusivamente no seu dispositivo, usando `AsyncStorage`. Não existe login, não existe nuvem, não existe telemetria. O app não tem acesso à internet para nada além do que você explicitamente solicitar (abrir seu app de e-mail para feedback, por exemplo).

Ninguém — nem os desenvolvedores — tem acesso aos seus dados. Se você desinstalar o app, tudo some junto.

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
- Node.js 18+
- Expo CLI (`npx expo`)

### Rodando localmente

```bash
git clone https://gitlab.com/wenningtondiasx25/psymap.git
cd psymap
npm install
npx expo start
```

Escaneie o QR code com o **Expo Go** (Android/iOS) ou pressione `a` para emulador Android.

### Build APK

```bash
npx eas-cli build -p android --profile preview
```

> **Nota:** O `eas-cli` deve ser usado via `npx` ou instalado globalmente (`npm i -g eas-cli`), não como dependência do projeto. O arquivo `.easignore` já exclui `releases/`, `.git/` e `node_modules/` do pacote enviado ao servidor de build.

---

## 🛠 Tecnologias

- [Expo](https://expo.dev) + [Expo Router](https://docs.expo.dev/router/introduction/) (navegação por arquivos)
- [React Native](https://reactnative.dev) 0.81
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) (persistência local)
- [react-native-gifted-charts](https://gifted-charts.web.app) (gráficos)
- [Ionicons](https://ionic.io/ionicons) (ícones da tab bar)

---

## 🤝 Contribuindo

Pull requests são bem-vindos! Para mudanças grandes, abra uma issue primeiro para discutir o que você gostaria de alterar.

Gostou do app? Considere apoiar o projeto com uma doação via PIX — a chave e o QR code estão na aba **Configurações** do app. Toda contribuição ajuda a manter o PsyMap gratuito e independente.

---

## 📄 Licença

GNU GPLv3 © Wennington Dias

---

## 🙏 Atribuições

- Emojis dos temas **Floresta**, **Sunset** e **Ocean** projetados por [OpenMoji](https://openmoji.org) – the open-source emoji and icon project. Licença: [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).
