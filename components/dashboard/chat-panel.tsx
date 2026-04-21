"use client"

import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport, type UIMessage } from "ai"
import { ArrowUp, Bot, Loader2, Sparkles, User as UserIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type { Lang, UserProfile, VoterState } from "@/lib/types"
import { t } from "@/lib/i18n"

/**
 * Per-state, per-language quick-prompt suggestions. English is the guaranteed
 * fallback for any language not present in the map.
 */
const SUGGESTIONS_EN: Record<VoterState, string[]> = {
  NOT_ELIGIBLE: [
    "When can I pre-enroll?",
    "What documents should I prepare?",
    "Explain the qualifying date",
  ],
  ELIGIBLE_NOT_REGISTERED: [
    "How do I fill Form 6?",
    "What address proof is accepted?",
    "How long does registration take?",
  ],
  REGISTERED: [
    "How do I download my e-EPIC?",
    "Fix a spelling error on my EPIC",
    "How to find my polling booth",
  ],
  READY_TO_VOTE: [
    "What ID can I carry besides EPIC?",
    "What if my name is missing from the roll?",
    "Explain VVPAT in simple terms",
  ],
}

const SUGGESTIONS_HI: Record<VoterState, string[]> = {
  NOT_ELIGIBLE: [
    "मैं कब प्री-एनरोल कर सकता हूँ?",
    "कौन से दस्तावेज़ तैयार रखूँ?",
    "योग्यता तिथि क्या है?",
  ],
  ELIGIBLE_NOT_REGISTERED: [
    "फॉर्म 6 कैसे भरें?",
    "कौन सा पता प्रमाण मान्य है?",
    "पंजीकरण में कितना समय लगता है?",
  ],
  REGISTERED: [
    "e-EPIC कैसे डाउनलोड करें?",
    "EPIC पर नाम की गलती कैसे सुधारें?",
    "अपना बूथ कैसे खोजें?",
  ],
  READY_TO_VOTE: [
    "EPIC के अलावा कौन सी ID मान्य है?",
    "अगर सूची में नाम न हो तो?",
    "VVPAT क्या है सरल भाषा में?",
  ],
}

const SUGGESTIONS_MR: Record<VoterState, string[]> = {
  NOT_ELIGIBLE: [
    "मी कधी पूर्व-नोंदणी करू शकतो?",
    "कोणती कागदपत्रे तयार ठेवू?",
    "पात्रता तारीख म्हणजे काय?",
  ],
  ELIGIBLE_NOT_REGISTERED: [
    "फॉर्म 6 कसा भरावा?",
    "कोणता पत्ता पुरावा मान्य?",
    "नोंदणीला किती वेळ लागतो?",
  ],
  REGISTERED: [
    "e-EPIC कसे डाउनलोड करावे?",
    "EPIC वरील चूक कशी दुरुस्त करावी?",
    "माझा बूथ कसा शोधावा?",
  ],
  READY_TO_VOTE: [
    "EPIC शिवाय कोणते ID चालते?",
    "यादीत नाव नसेल तर काय?",
    "VVPAT सोप्या भाषेत सांगा",
  ],
}

const SUGGESTIONS_GU: Record<VoterState, string[]> = {
  NOT_ELIGIBLE: [
    "હું ક્યારે પ્રી-એનરોલ કરી શકું?",
    "કયા દસ્તાવેજો તૈયાર રાખું?",
    "યોગ્યતા તારીખ એટલે શું?",
  ],
  ELIGIBLE_NOT_REGISTERED: [
    "ફોર્મ 6 કેવી રીતે ભરવું?",
    "કયા સરનામાના પુરાવા સ્વીકાર્ય?",
    "નોંધણીમાં કેટલો સમય લાગે?",
  ],
  REGISTERED: [
    "e-EPIC કેવી રીતે ડાઉનલોડ કરું?",
    "EPIC પરની ભૂલ કેવી રીતે સુધારું?",
    "મારું મતદાન કેન્દ્ર કેવી રીતે શોધું?",
  ],
  READY_TO_VOTE: [
    "EPIC સિવાય કયું ID ચાલે?",
    "યાદીમાં નામ ન હોય તો?",
    "VVPAT સરળ ભાષામાં સમજાવો",
  ],
}

const SUGGESTIONS_TA: Record<VoterState, string[]> = {
  NOT_ELIGIBLE: [
    "முன்-பதிவு எப்போது?",
    "என்ன ஆவணங்கள் தேவை?",
    "தகுதி தேதி என்றால் என்ன?",
  ],
  ELIGIBLE_NOT_REGISTERED: [
    "படிவம் 6 எப்படி நிரப்ப?",
    "என்ன முகவரி சான்று ஏற்கப்படும்?",
    "பதிவுக்கு எவ்வளவு நேரம்?",
  ],
  REGISTERED: [
    "e-EPIC எப்படி பதிவிறக்க?",
    "EPIC-ல் உள்ள பிழையை சரி செய்ய?",
    "எனது வாக்குச்சாவடியை எப்படி கண்டுபிடிக்க?",
  ],
  READY_TO_VOTE: [
    "EPIC இல்லாமல் என்ன ID?",
    "பட்டியலில் பெயர் இல்லை என்றால்?",
    "VVPAT எளிய மொழியில்",
  ],
}

const SUGGESTIONS_TE: Record<VoterState, string[]> = {
  NOT_ELIGIBLE: [
    "ముందస్తు నమోదు ఎప్పుడు?",
    "ఏ పత్రాలు సిద్ధం చేయాలి?",
    "అర్హత తేదీ అంటే ఏమిటి?",
  ],
  ELIGIBLE_NOT_REGISTERED: [
    "ఫారం 6 ఎలా నింపాలి?",
    "ఏ చిరునామా ఆధారం అంగీకరించబడుతుంది?",
    "నమోదుకు ఎంత సమయం పడుతుంది?",
  ],
  REGISTERED: [
    "e-EPIC ఎలా డౌన్‌లోడ్?",
    "EPIC లోని లోపాన్ని ఎలా సరిచేయాలి?",
    "పోలింగ్ బూత్ ఎలా కనుగొనాలి?",
  ],
  READY_TO_VOTE: [
    "EPIC కాకుండా ఏ ID?",
    "జాబితాలో పేరు లేకపోతే?",
    "VVPAT సులభంగా చెప్పండి",
  ],
}

const SUGGESTIONS_BN: Record<VoterState, string[]> = {
  NOT_ELIGIBLE: [
    "প্রাক-নিবন্ধন কখন?",
    "কোন কাগজপত্র প্রস্তুত রাখব?",
    "যোগ্যতার তারিখ কী?",
  ],
  ELIGIBLE_NOT_REGISTERED: [
    "ফর্ম 6 কীভাবে পূরণ করব?",
    "কোন ঠিকানা প্রমাণ গ্রহণযোগ্য?",
    "নিবন্ধনে কত সময় লাগে?",
  ],
  REGISTERED: [
    "e-EPIC কীভাবে ডাউনলোড?",
    "EPIC এর ভুল কীভাবে ঠিক করব?",
    "বুথ কীভাবে খুঁজব?",
  ],
  READY_TO_VOTE: [
    "EPIC ছাড়া কোন ID?",
    "তালিকায় নাম না থাকলে?",
    "VVPAT সহজ ভাষায়",
  ],
}

const SUGGESTIONS_BY_LANG: Record<Lang, Record<VoterState, string[]>> = {
  en: SUGGESTIONS_EN,
  hi: SUGGESTIONS_HI,
  mr: SUGGESTIONS_MR,
  gu: SUGGESTIONS_GU,
  ta: SUGGESTIONS_TA,
  te: SUGGESTIONS_TE,
  bn: SUGGESTIONS_BN,
}

function getSuggestions(lang: Lang, state: VoterState): string[] {
  return SUGGESTIONS_BY_LANG[lang]?.[state] ?? SUGGESTIONS_EN[state]
}

function getMessageText(msg: UIMessage): string {
  if (!msg.parts || !Array.isArray(msg.parts)) return ""
  return msg.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("")
}

export function ChatPanel({
  profile,
  voterState,
}: {
  profile: UserProfile
  voterState: VoterState
}) {
  const lang: Lang = profile.language ?? "en"
  const firstName = profile.name.split(" ")[0]

  const userContext = useMemo(
    () => ({
      name: profile.name,
      age: profile.age,
      isRegistered: profile.isRegistered,
      hasVoterId: profile.hasVoterId,
      state: profile.state,
      voterState,
      language: lang,
    }),
    [profile, voterState, lang],
  )

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        prepareSendMessagesRequest: ({ messages, id }) => ({
          body: { messages, id, userContext },
        }),
      }),
    [userContext],
  )

  const { messages, sendMessage, status, error, setMessages } = useChat({ transport })

  const [input, setInput] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const isStreaming = status === "streaming" || status === "submitted"

  // Clear messages when language changes so the thread starts fresh in the new language.
  useEffect(() => {
    setMessages([])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang])

  useEffect(() => {
    if (!scrollRef.current) return
    scrollRef.current.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    })
  }, [messages, status])

  const suggestions = getSuggestions(lang, voterState)
  const hasMessages = messages.length > 0

  const submit = useCallback(
    (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || isStreaming) return
      // Enforce a reasonable client-side cap (server also caps).
      sendMessage({ text: trimmed.slice(0, 4000) })
      setInput("")
      textareaRef.current?.focus()
    },
    [isStreaming, sendMessage],
  )

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        submit(input)
      }
    },
    [input, submit],
  )

  return (
    <section
      aria-labelledby="chat-heading"
      className="flex h-[min(720px,calc(100dvh-7rem))] flex-col overflow-hidden rounded-2xl border border-border bg-card"
    >
      <header className="flex items-center justify-between border-b border-border/60 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"
            aria-hidden
          >
            <Sparkles className="h-4 w-4" />
          </span>
          <div>
            <p id="chat-heading" className="text-sm font-medium leading-tight">
              {t(lang, "chat.heading")}
            </p>
            <p className="text-[11px] text-muted-foreground">{t(lang, "chat.subtitle")}</p>
          </div>
        </div>
        <span
          role="status"
          aria-live="polite"
          className={cn(
            "flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wider",
            isStreaming
              ? "border-accent/40 bg-accent/10 text-accent-foreground"
              : "border-border text-muted-foreground",
          )}
        >
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              isStreaming ? "bg-accent animate-pulse" : "bg-muted-foreground",
            )}
            aria-hidden
          />
          {isStreaming ? t(lang, "chat.thinking") : t(lang, "chat.online")}
        </span>
      </header>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-5"
        role="log"
        aria-live="polite"
        aria-label={t(lang, "chat.heading")}
      >
        {!hasMessages ? (
          <EmptyChat firstName={firstName} onPick={submit} suggestions={suggestions} lang={lang} />
        ) : (
          <div className="space-y-4">
            {messages.map((m) => (
              <Message key={m.id} message={m} />
            ))}
            {isStreaming && messages[messages.length - 1]?.role === "user" ? (
              <ThinkingBubble />
            ) : null}
          </div>
        )}

        {error ? (
          <p
            role="alert"
            className="mt-3 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive"
          >
            {t(lang, "chat.error")}
          </p>
        ) : null}
      </div>

      <div className="border-t border-border/60 p-3">
        {hasMessages && suggestions.length > 0 ? (
          <div className="mb-2 flex flex-wrap gap-1.5">
            {suggestions.slice(0, 2).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => submit(s)}
                disabled={isStreaming}
                className="rounded-full border border-border bg-background px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:border-accent/40 hover:text-foreground disabled:opacity-50"
              >
                {s}
              </button>
            ))}
          </div>
        ) : null}

        <form
          onSubmit={(e) => {
            e.preventDefault()
            submit(input)
          }}
          className="flex items-end gap-2 rounded-xl border border-border bg-background p-2 focus-within:border-accent/50 focus-within:ring-2 focus-within:ring-accent/20"
        >
          <label htmlFor="chat-input" className="sr-only">
            {t(lang, "chat.placeholder")}
          </label>
          <textarea
            id="chat-input"
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={t(lang, "chat.placeholder")}
            rows={1}
            maxLength={4000}
            className="flex-1 resize-none bg-transparent px-2 py-1.5 text-sm outline-none placeholder:text-muted-foreground"
            disabled={isStreaming}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || isStreaming}
            className="h-9 w-9 flex-none rounded-lg"
            aria-label={t(lang, "chat.send")}
          >
            {isStreaming ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <ArrowUp className="h-4 w-4" aria-hidden />
            )}
          </Button>
        </form>
      </div>
    </section>
  )
}

function EmptyChat({
  firstName,
  onPick,
  suggestions,
  lang,
}: {
  firstName: string
  onPick: (text: string) => void
  suggestions: string[]
  lang: Lang
}) {
  return (
    <div className="flex h-full flex-col justify-between">
      <div>
        <span
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary"
          aria-hidden
        >
          <Bot className="h-5 w-5" />
        </span>
        <h3 className="mt-4 font-serif text-xl leading-tight tracking-tight">
          {t(lang, "dashboard.hello")} {firstName}, {t(lang, "chat.emptyGreet")}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {t(lang, "chat.emptyBody")}
        </p>
      </div>

      <div className="mt-6 space-y-2">
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          {t(lang, "chat.tryAsking")}
        </p>
        {suggestions.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onPick(s)}
            className="group flex w-full items-center justify-between gap-2 rounded-xl border border-border bg-background px-3.5 py-3 text-left text-sm transition-all hover:border-accent/40 hover:bg-accent/5"
          >
            <span>{s}</span>
            <ArrowUp
              className="h-3.5 w-3.5 rotate-45 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
              aria-hidden
            />
          </button>
        ))}
      </div>
    </div>
  )
}

function Message({ message }: { message: UIMessage }) {
  const text = getMessageText(message)
  const isUser = message.role === "user"
  return (
    <div
      className={cn("flex items-start gap-2.5", isUser && "flex-row-reverse")}
      data-role={message.role}
    >
      <span
        className={cn(
          "flex h-7 w-7 flex-none items-center justify-center rounded-lg",
          isUser ? "bg-secondary text-foreground" : "bg-primary text-primary-foreground",
        )}
        aria-hidden
      >
        {isUser ? <UserIcon className="h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5" />}
      </span>
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
          isUser ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground",
        )}
      >
        <RenderedText text={text} />
      </div>
    </div>
  )
}

function ThinkingBubble() {
  return (
    <div className="flex items-start gap-2.5" aria-hidden>
      <span className="flex h-7 w-7 flex-none items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Sparkles className="h-3.5 w-3.5" />
      </span>
      <div className="rounded-2xl bg-secondary px-4 py-3">
        <div className="flex gap-1">
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" />
        </div>
      </div>
    </div>
  )
}

/** Minimal markdown-ish renderer: **bold**, bullet lines, paragraphs. */
function RenderedText({ text }: { text: string }) {
  const lines = text.split("\n")
  const blocks: React.ReactNode[] = []
  let listBuffer: string[] = []

  const flushList = (keyIdx: number) => {
    if (listBuffer.length === 0) return
    blocks.push(
      <ul key={`ul-${keyIdx}`} className="my-1.5 list-disc space-y-1 pl-4">
        {listBuffer.map((li, i) => (
          <li key={i}>{renderInline(li)}</li>
        ))}
      </ul>,
    )
    listBuffer = []
  }

  lines.forEach((rawLine, idx) => {
    const line = rawLine.trim()
    if (/^[-*•]\s+/.test(line)) {
      listBuffer.push(line.replace(/^[-*•]\s+/, ""))
      return
    }
    flushList(idx)
    if (line.length === 0) return
    blocks.push(
      <p key={`p-${idx}`} className="my-0.5">
        {renderInline(line)}
      </p>,
    )
  })
  flushList(lines.length)

  return <>{blocks}</>
}

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      )
    }
    return <span key={i}>{part}</span>
  })
}
