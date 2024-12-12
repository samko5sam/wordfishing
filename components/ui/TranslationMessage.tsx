import { MessageCircleWarning } from "lucide-react"

export const TranslationMessage = () => {
  return (
    <p className="text-sm text-gray-500 mt-2 flex flex-row items-center gap-x-2">
      <MessageCircleWarning /> <span>所選文字過長，無法翻譯。</span>
    </p>
  )
}
