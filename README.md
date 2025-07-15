# JarvisKit Dev-UI

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white)](https://python.org/)
[![LangGraph](https://img.shields.io/badge/LangGraph-1C3AA9?style=flat&logo=langchain&logoColor=white)](https://langchain-ai.github.io/langgraph/)

Provides a minimal conversation dialog for testing, debugging, and developing agents with JarvisKit.
<div align="center">
  <picture>
    <img alt="JarvisKit Dev-UI" src="https://github.com/Jarviskit/Dev-UI/blob/releases/0.0.1/assets/DevUI.png?raw=true"/>
    </picture>
</div>


## 🛠️ Tech Stack
### Frontend (Dev-UI)
- **React 19** with TypeScript
- **Vite** for fast development and building
- **TailwindCSS** for styling
- **Socket.io Client** for real-time communication

### Quick Start

1. **Clone the repository**
    ```bash
    git clone https://github.com/JarvisKit/Dev-UI.git
    cd Dev-UI
    ```

2. **Set up environment variables**
    ```bash
    cp .env.example .env
    # Edit .env with your configuration
    ```

3. **Install and run**
    ```bash
    # Install dependencies
    yarn

    # Start dev ui
    yarn dev
    ```


## 🔧 Usage
```tsx
import ChatBox from "./dev-ui/chat/ChatBox";
import EventBox from './dev-ui/components/EventBox';
import { JarvisKitProvider } from './jarviskit/jarviskit.context';

export default function JarvisKitDevUI() {
  const runtimeAuthToken = import.meta.env.VITE_JARVIS_KIT_AUTH_TOKEN;

  return (
    <JarvisKitProvider
      runtimeEndpoint="http://localhost:6789"
      namespace="demo_agent_space"
      agentName="agent_with_client_tool_call"
      agentConfig={{ token: 'abc.def.ghi', model: 'gpt-4o-mini' }}
      authToken={runtimeAuthToken}
    >
      <div className="flex flex-row gap-2 w-screen h-screen">
        <ChatBox threadId="agent_with_client_tool_call_002" />

        <div className="flex flex-col flex-grow">
          <EventBox />
        </div>
      </div>
    </JarvisKitProvider>
  );
}
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Nghia Pham** - [@nghiapd92](mailto:nghiapd92@gmail.com) - JarvisKit Founder

## 🙏 Acknowledgments

- [LangChain](https://langchain.com/) for the AI framework
- [LangGraph](https://langchain-ai.github.io/langgraph/) for agent workflows
- [NestJS](https://nestjs.com/) for the backend framework
- [React](https://reactjs.org/) for the frontend framework

## 📞 Support

- 📧 Email: nghiapd92@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/JarvisKit/JarvisKit/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/JarvisKit/JarvisKit/discussions)

---

Made with ❤️ by the JarvisKit Team
