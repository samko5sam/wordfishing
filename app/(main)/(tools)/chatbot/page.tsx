/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Settings2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

interface ApiKeys {
  [key: string]: string | undefined;
  openai?: string;
  anthropic?: string;
  gemini?: string;
  groq?: string;
}

const AI_PROVIDERS = [
  { id: "openai", name: "OpenAI", placeholder: "sk-..." },
  { id: "anthropic", name: "Anthropic", placeholder: "sk-ant-..." },
  { id: "gemini", name: "Google Gemini", placeholder: "API key" },
  { id: "groq", name: "Groq", placeholder: "API key" },
];

export default function ChatbotPage() {
  const { toast } = useToast();
  const [isConfigExpanded, setIsConfigExpanded] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string>("openai");
  const [apiKeys, setApiKeys] = useState<ApiKeys>({});
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentApiKey, setCurrentApiKey] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("你是一個有幫助的智慧學習助手，請依照問題使用繁體中文或英文回答。");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lastSelectedProvider = window.localStorage.getItem(
      "lastSelectedAiProvider"
    );
    if (lastSelectedProvider) {
      setSelectedProvider(lastSelectedProvider);
    }
  }, []);

  useEffect(() => {
    const loadedKeys: ApiKeys = {};
    AI_PROVIDERS.forEach((provider) => {
      const key = localStorage.getItem(`${provider.id}_api_key`);
      if (key) {
        loadedKeys[provider.id] = key;
      }
    });
    setApiKeys(loadedKeys);

    const currentKey = loadedKeys[selectedProvider];
    setCurrentApiKey(currentKey || "");
    if (!currentKey) {
      setIsConfigExpanded(true);
    }
  }, [selectedProvider]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const saveApiKey = () => {
    if (!currentApiKey) return;
    localStorage.setItem(`${selectedProvider}_api_key`, currentApiKey);
    setApiKeys((prev) => ({
      ...prev,
      [selectedProvider]: currentApiKey,
    }));
    toast({
      title: "已儲存",
      description: "Api Key 已儲存在瀏覽器",
    })
  };

  const handleProviderChange = (providerId: string) => {
    localStorage.setItem("lastSelectedAiProvider", providerId);
    setSelectedProvider(providerId);
    setCurrentApiKey(apiKeys[providerId] || "");
    setMessages([]);
  };

  const getEndpointForProvider = (provider: string, apiKey: string) => {
    switch (provider) {
      case "openai":
        return "https://api.openai.com/v1/chat/completions";
      case "anthropic":
        return "https://api.anthropic.com/v1/messages";
      case "gemini":
        return `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
      case "groq":
        return "https://api.groq.com/openai/v1/chat/completions";
      default:
        return "";
    }
  };

  const formatRequestForProvider = (provider: string, messages: Message[]) => {
    switch (provider) {
      case "openai":
        return {
          model: "gpt-4",
          messages,
          stream: true,
        };
      case "anthropic":
        return {
          model: "claude-3-haiku-20240307",
          system: systemPrompt,
          "max_tokens": 1024,
          messages: messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        };
      case "gemini":
        return {
          contents: [
            {
              parts: [
                {
                  text: systemPrompt + "\n\n" + messages[messages.length - 1].content,
                },
              ],
            },
          ],
        };
      case "groq":
        return {
          model: "llama3-8b-8192",
          messages,
          stream: true,
        };
      default:
        return {};
    }
  };

  const getHeadersForProvider = (provider: string, apiKey: string): {
    "Content-Type"?: string;
    Authorization?: string;
    "x-api-key"?: string;
    "anthropic-version"?: string;
    "anthropic-dangerous-direct-browser-access"?: string;
  }  => {
    switch (provider) {
      case "openai":
      case "groq":
        return {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        };
      case "anthropic":
        return {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true"
        };
      case "gemini":
        return {
          "Content-Type": "application/json"
        };
      default:
        return {};
    }
  };

  const parseResponseForProvider = (provider: string, data: any): string => {
    switch (provider) {
      case "openai":
      case "groq":
        return data.choices[0].message.content;
      case "anthropic":
        return data.content[0].text;
      case "gemini":
        return data.candidates[0].content.parts[0].text;
      default:
        return "Unsupported provider response";
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !currentApiKey) return;

    const newMessage: Message = { role: "user", content: inputMessage };
    setMessages((prev) => [...prev, newMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const requestMessages = [
        ...messages,
      ]
      if (requestMessages.length === 0){
        switch (selectedProvider) {
          case "openai":
          case "groq":
            requestMessages.push({
              role: "system",
              content: systemPrompt
            })
            break;
        
          default:
            break;
        }
      }
      requestMessages.push(newMessage);

      const endpoint = getEndpointForProvider(selectedProvider, currentApiKey);
      const headers = getHeadersForProvider(selectedProvider, currentApiKey);
      const body = formatRequestForProvider(selectedProvider, requestMessages);

      if (selectedProvider === "openai" || selectedProvider === "groq") {
        const response = await fetch(endpoint, {
          method: "POST",
          headers,
          body: JSON.stringify(body),
        });

        const reader = response.body?.getReader();
        const decoder = new TextDecoder("utf-8");
        let assistantContent = "";

        while (reader) {
          const { value, done } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          const lines = chunk.split("\n").filter(Boolean);

          for (const line of lines) {
            const message = line.replace(/^data: /, "");
            if (message === "[DONE]") {
              setIsLoading(false);
              return;
            }

            try {
              const parsed = JSON.parse(message);
              const text = parsed.choices[0].delta?.content || "";
              assistantContent += text;
              setMessages((prev) => {
                const updatedMessages = [...prev];
                if (updatedMessages[updatedMessages.length - 1].role === "assistant") {
                  updatedMessages[updatedMessages.length - 1].content = assistantContent;
                } else {
                  updatedMessages.push({ role: "assistant", content: text });
                }
                return updatedMessages;
              });
            } catch (error) {
              console.error("Error parsing streaming data", error);
            }
          }
        }
      } else {
        const response = await fetch(endpoint, {
          method: "POST",
          headers,
          body: JSON.stringify(body),
        });

        const data = await response.json();

        if (response.ok) {
          const assistantResponse = parseResponseForProvider(
            selectedProvider,
            data
          );
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: assistantResponse,
            },
          ]);
        } else {
          throw new Error(data.error?.message || "Failed to get response");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "對不起，處理您的請求時發生錯誤。",
        },
      ]);
    } finally {
      setIsLoading(false);
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <h1 className="text-2xl font-bold mb-6">AI 學習助手</h1>

      <div className={`transition-all duration-300 ${isConfigExpanded ? 'mb-48' : 'mb-4'}`}>
        <div className="fixed top-28 left-4 right-4 z-10">
          <button
            onClick={() => setIsConfigExpanded(!isConfigExpanded)}
            className="absolute top-2 right-2 p-1 z-50"
            aria-label="Toggle settings"
          >
            <Settings2
              className={`w-5 h-5 transition-transform ${
                isConfigExpanded ? "rotate-45 text-blue-500" : "text-gray-500"
              }`}
            />
          </button>
          {isConfigExpanded && (
            <Card className="relative p-4 mb-6">
              <div className="space-y-4 mt-4">
                <div>
                  <h2 className="text-lg font-semibold mb-2">選擇 AI 供應商</h2>
                  <Select
                    value={selectedProvider}
                    onValueChange={handleProviderChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a provider" />
                    </SelectTrigger>
                    <SelectContent>
                      {AI_PROVIDERS.map(({ id, name }) => (
                        <SelectItem key={id} value={id}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <h2 className="text-lg font-semibold mb-2">
                    {apiKeys[selectedProvider]
                      ? `更新 ${
                          AI_PROVIDERS.find(({ id }) => id === selectedProvider)
                            ?.name
                        } 的 API Key`
                      : `輸入 ${
                          AI_PROVIDERS.find(({ id }) => id === selectedProvider)
                            ?.name
                        } 的 API Key`}
                  </h2>
                  <div className="flex gap-2">
                    <Input
                      type="password"
                      value={currentApiKey}
                      onChange={({ target: { value } }) =>
                        setCurrentApiKey(value)
                      }
                      placeholder={
                        AI_PROVIDERS.find(({ id }) => id === selectedProvider)
                          ?.placeholder
                      }
                      className="flex-1"
                    />
                    <Button onClick={saveApiKey}>儲存</Button>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    您的 API 金鑰將安全地儲存在您的瀏覽器中。
                  </p>
                </div>

                <div>
                  <h2 className="text-lg font-semibold mb-2">自訂系統提示</h2>
                  <Textarea
                    value={systemPrompt}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                    placeholder="輸入系統提示..."
                    className="flex-1"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    指令將被加到每個 AI 請求中，以自定義助手的行為。
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message, index) => {
            if (message.role === "system") return null;
            return (
            <div
              key={index}
              className={`p-4 rounded-lg whitespace-pre-wrap ${
                message.role === "user"
                  ? "bg-blue-100 dark:bg-blue-900 ml-12"
                  : "bg-gray-100 dark:bg-gray-700 mr-12"
              }`}
            >
              {message.content}
            </div>
          )
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <Textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="輸入訊息..."
          className="flex-1"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
        />
        <Button onClick={sendMessage} disabled={isLoading || !currentApiKey}>
          {isLoading ? "正在回答..." : "傳送"}
        </Button>
      </div>
    </div>
  );
}
