
"use client";

import {
  FormEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import ReactMarkdown from "react-markdown";
import "./ChatInterface.css";

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
  failed?: boolean;
};

type ChatInterfaceProps = {
  onClose: () => void;
};

export default function ChatInterface({ onClose }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const nextMessageId = useRef(1);
  const isSendingRef = useRef(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  async function sendMessage(retryContent?: string) {
    const message = (retryContent ?? input).trim();

    if (!message || isSendingRef.current) return;

    isSendingRef.current = true;

    let updatedMessages: Message[];

    if (retryContent !== undefined) {
      // Remove a mensagem de erro anterior e recupera o histórico válido.
      updatedMessages = messages.filter(
        (item) => !item.failed
      );

      // Não adiciona novamente a mensagem se ela já estiver no histórico.
      const lastMessage = updatedMessages[updatedMessages.length - 1];

      if (
        lastMessage?.role !== "user" ||
        lastMessage.content !== message
      ) {
        updatedMessages = [
          ...updatedMessages,
          {
            id: nextMessageId.current++,
            role: "user",
            content: message,
          },
        ];
      }

      setMessages(updatedMessages);
    } else {
      const userMessage: Message = {
        id: nextMessageId.current++,
        role: "user",
        content: message,
      };

      updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      setInput("");
    }

    setIsLoading(true);

    try {
      // Envia somente as últimas 30 mensagens válidas.
      const history = updatedMessages
        .filter((item) => !item.failed)
        .slice(-30)
        .map(({ role, content }) => ({
          role,
          content,
        }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: history,
        }),
        signal: AbortSignal.timeout(90000),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Não foi possível obter uma resposta."
        );
      }

      if (typeof data.reply !== "string" || !data.reply.trim()) {
        throw new Error("A IA retornou uma resposta vazia.");
      }

      const assistantMessage: Message = {
        id: nextMessageId.current++,
        role: "assistant",
        content: data.reply,
      };

      setMessages((current) => [
        ...current.filter((item) => !item.failed),
        assistantMessage,
      ]);
    } catch (error) {
      const errorMessage =
        error instanceof Error && error.name === "TimeoutError"
          ? "A IA demorou demais para responder. Tente novamente."
          : error instanceof Error
            ? error.message
            : "Não foi possível obter uma resposta da IA.";

      const assistantMessage: Message = {
        id: nextMessageId.current++,
        role: "assistant",
        content: errorMessage,
        failed: true,
      };

      setMessages((current) => [
        ...current.filter((item) => !item.failed),
        assistantMessage,
      ]);
    } finally {
      isSendingRef.current = false;
      setIsLoading(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage();
    }
  }

  return (
    <main className="chat-page">
      <header className="chat-header">
        <button
          type="button"
          className="chat-back-button"
          onClick={onClose}
          aria-label="Voltar para a tela inicial"
        >
          <span aria-hidden="true">←</span>
        </button>

        <div className="chat-header__copy">
          <p className="chat-header__eyebrow">ROAM</p>
          <h1>Planeje sua viagem</h1>
        </div>

        <div className="chat-status" aria-label="Assistente online">
          <span />
          Online
        </div>
      </header>

      <section className="chat-conversation" aria-live="polite">
        {messages.length === 0 ? (
          <div className="chat-empty-state">
            <div
              className="chat-empty-state__icon"
              aria-hidden="true"
            >
              ✦
            </div>

            <h2>Para onde vamos?</h2>

            <p>
              Conte o destino, a época da viagem ou o que você
              gostaria de viver.
            </p>
          </div>
        ) : (
          <div className="chat-messages">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`chat-message chat-message--${message.role}`}
              >
                <div className="chat-message__bubble">
                  {message.role === "assistant" && !message.failed ? (
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  ) : (
                    message.content
                  )}

                  {message.failed && (
                    <button
                      type="button"
                      className="chat-retry-button"
                      disabled={isLoading}
                      onClick={() => {
                        const previousUserMessage = messages
                          .slice(0, index)
                          .reverse()
                          .find((item) => item.role === "user");

                        if (previousUserMessage) {
                          void sendMessage(previousUserMessage.content);
                        }
                      }}
                    >
                      Tentar novamente
                    </button>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="chat-message chat-message--assistant">
                <div
                  className="chat-message__bubble chat-loading"
                  role="status"
                  aria-label="Assistente está pensando"
                >
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </section>

      <form className="chat-composer" onSubmit={handleSubmit}>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Digite sua mensagem..."
          rows={1}
          aria-label="Mensagem"
        />

        <button
          type="submit"
          className="chat-send-button"
          disabled={!input.trim() || isLoading}
          aria-label="Enviar mensagem"
        >
          <svg
            viewBox="0 0 24 24"
            width="22"
            height="22"
            aria-hidden="true"
          >
            <path
              d="M5 12h14M13 6l6 6-6 6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </form>
    </main>
  );
}